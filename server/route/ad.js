import express from "express";
const router = express.Router();
import { requireSignin } from "../middlewares/auth.js";
import { addToWishlist, Ads, contactSeller, create, deleteAd, enquiredProperties, read, removeFromWishlist, removeImage, update, uploadImage, userAds, wishlist } from "../controllers/ad.js";
import { deleteModel } from "mongoose";

router.post("/upload-image", requireSignin, uploadImage);
router.post("/remove-image", requireSignin, removeImage);
router.post("/ad", requireSignin, create);
router.get("/ads", Ads);
router.get("/ad/:slug", read)
router.post("/wishlist",requireSignin, addToWishlist);
router.delete("/wishlist/:adId", requireSignin, removeFromWishlist);
router.post("/contact-seller", requireSignin, contactSeller);
router.get("/user-ads/:page", requireSignin, userAds);
router.put("/ad/:_id", requireSignin, update);
router.delete("/ad/:_id", requireSignin, deleteAd)
router.get("/enquiries", requireSignin, enquiredProperties);
router.get("/wishlist", requireSignin, wishlist);

export default router;
