import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const requireSignin = (req, res, next) =>{
    try{
        const decode = jwt.verify(req.headers.authorization, JWT_SECRET)
        req.user = decode;
        next();
    }catch(error){
        console.log(error);
        return res.status(401).json({ error: "Invalid or expired token"});
    }
}

