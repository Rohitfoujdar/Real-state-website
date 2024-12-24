import express from "express";
const router = express.Router();
import { requireSignin } from "../middlewares/auth.js";
import { removeImage, uploadImage } from "../controllers/ad.js";

router.post("/upload-image", requireSignin, uploadImage);
router.post("/remove-image", requireSignin, removeImage);

export default router;
