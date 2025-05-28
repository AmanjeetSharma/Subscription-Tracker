import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.slice(7).trim();
        }
        
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password -__v");
        if(!user) res.status(401).json({ success: false, message: "User not found, authorization denied" });
        req.user = user; // here we are attaching user to request object
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorized access",
            error: error.message
        });
    }
}