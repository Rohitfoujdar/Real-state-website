import express from "express";
import { requireSignin } from "../middlewares/auth.js";
import {
  accessAccount,
  forgotPassword,
  login,
  preRegisterd,
  refreshToken,
  register,
  welcome,
} from "../controllers/auth.js";
const router = express.Router();

router.get("/api", requireSignin, welcome);

router.post("/pre-defined", preRegisterd);

router.post("/register", register);

router.post("/login", login);

router.post("/forget-password", forgotPassword);

router.post("/access-account", accessAccount);

router.get("/refresh-token", refreshToken);

export default router;
