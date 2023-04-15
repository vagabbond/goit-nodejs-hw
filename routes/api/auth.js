const express = require("express");
const validateBody = require("../../utils/validateBody");
const {
  register,
  login,
  getCurrent,
  logout,
} = require("../../controllers/auth-controlers");

const authenticate = require("../../midlwares/authenticate");

const { schemas } = require("../../service/user");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), register);

router.post("/login", validateBody(schemas.loginSchema), login);

router.get("/current", authenticate, getCurrent);

router.post("/logout", authenticate, logout);

module.exports = router;
