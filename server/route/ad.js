import express from "express";
const router = express.Router();
import { requireSignin } from "../middlewares/auth.js";
import { addToWishlist, Ads, contactSeller, create, read, removeFromWishlist, removeImage, uploadImage } from "../controllers/ad.js";

router.post("/upload-image", requireSignin, uploadImage);
router.post("/remove-image", requireSignin, removeImage);
router.post("/ad", requireSignin, create);
router.get("/ads", Ads);
router.get("/ad/:slug", read)
router.post("/wishlist",requireSignin, addToWishlist);
router.delete("/wishlist/:adId", requireSignin, removeFromWishlist);
router.post("/contact-seller", requireSignin, contactSeller);

export default router;
