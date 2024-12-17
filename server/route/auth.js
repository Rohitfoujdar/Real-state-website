import express from "express"
import { preRegisterd, register, welcome } from "../controllers/auth.js";
const router = express.Router();

router.get("/api", welcome)

router.post("/pre-defined", preRegisterd)

router.post("/register", register)

 export default router;