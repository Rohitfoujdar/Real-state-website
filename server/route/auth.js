import express from "express";
import { requireSignin } from "../middlewares/auth.js";
import {
  accessAccount,
  currentUser,
  forgotPassword,
  login,
  preRegisterd,
  publicProfile,
  refreshToken,
  register,
  updatePassword,
  updateProfile,
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

router.get("/current-user",requireSignin, currentUser)

router.get("/profile/:username",publicProfile)

router.put("/update-password",requireSignin, updatePassword )

router.put("/update-profile", requireSignin, updateProfile)

export default router;
