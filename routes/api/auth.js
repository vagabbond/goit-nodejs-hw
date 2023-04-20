const express = require("express");
const validateBody = require("../../utils/validateBody");
const {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
} = require("../../controllers/auth-controlers");

const upload = require("../../midlwares/upload");

const authenticate = require("../../midlwares/authenticate");

const { schemas } = require("../../service/user");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), register);

router.post("/login", validateBody(schemas.loginSchema), login);

router.get("/current", authenticate, getCurrent);

router.post("/logout", authenticate, logout);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
