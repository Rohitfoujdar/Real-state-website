import express from "express";
const router = express.Router();
import { requireSignin } from "../middlewares/auth.js";
import { addToWishlist, Ads, create, read, removeFromWishlist, removeImage, uploadImage } from "../controllers/ad.js";

router.post("/upload-image", requireSignin, uploadImage);
router.post("/remove-image", requireSignin, removeImage);
router.post("/ad", requireSignin, create);
router.get("/ads", Ads);
router.get("/ad/:slug", read)
router.post("/whishlist", requireSignin, addToWishlist);
router.delete("/whishlist/:adId", requireSignin, removeFromWishlist);

export default router;
