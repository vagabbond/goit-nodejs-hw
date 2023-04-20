const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const gavatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");

const avatarsDir = path.join(__dirname, "../", "public/avatars");

const { User } = require("../service/user");
const Jimp = require("jimp");

const { SECRET_KEY } = process.env;
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

    const result = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });

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
  login,
  getCurrent,
  logout,
  updateAvatar,
};
