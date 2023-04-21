const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const gavatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const uuid4 = require("uuid").v4;

const sendEmail = require("../helpers/sendEmail");

const avatarsDir = path.join(__dirname, "../", "public/avatars");

const { User } = require("../service/user");
const Jimp = require("jimp");

const { SECRET_KEY, BASE_URL } = process.env;
const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "Email in use",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gavatar.url(email);
    const verificationCode = uuid4();

    const result = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationCode,
    });
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationCode}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
      user: {
        email: result.email,
        subscription: result.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Email or password is wrong",
      });
    }
    if (!user.verify) {
      return res.status(401).json({
        message: "Email not verify",
      });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(401).json({
        message: "Email or password is wrong",
      });
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(
      res.status(401).json({
        message: "Email or password is wrong",
      })
    );
  }
};
const verifyEmail = async (req, res, next) => {
  try {
    const { verificationCode } = req.params;
    const user = await User.findOne({ verificationCode });
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationCode: "",
    });
    return res.status(200).json({
      message: "Verification success",
    });
  } catch (error) {
    next(error);
  }
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      message: "Email not found",
    });
  }
  if (user.verify) {
    return res.status(400).json({
      message: "Verification has already been passed",
    });
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: "Verify email send success",
  });
};
const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json({
      message: "No content",
    });
  } catch (error) {
    next(error);
  }
};
const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(401).json({
        message: "Not found file",
      });
    }
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;

    const avatarName = `${_id}_${filename}`;

    const resultUpload = path.join(avatarsDir, avatarName);
    const avatarURL = path.join("avatars", avatarName);
    try {
      await fs.rename(tempUpload, resultUpload);
      const avatar = await Jimp.read(resultUpload);
      avatar.resize(250, 250);
      avatar.write(resultUpload);
    } catch (error) {
      await fs.unlink(tempUpload);
      throw error;
    }

    await User.findByIdAndUpdate(_id, { avatarURL });
    res.status(200).json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerifyEmail,
  login,
  getCurrent,
  logout,
  updateAvatar,
};
