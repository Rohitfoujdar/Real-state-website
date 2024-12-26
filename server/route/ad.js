import express from "express";
const router = express.Router();
import { requireSignin } from "../middlewares/auth.js";
import { create, removeImage, uploadImage } from "../controllers/ad.js";

router.post("/upload-image", requireSignin, uploadImage);
router.post("/remove-image", requireSignin, removeImage);
router.post("/ad", requireSignin, create);

export default router;
