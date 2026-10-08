import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const middleware = (req: Request, res: Response, next: NextFunction) => {

    const header = req.cookies["token"];

    if (!header) {
        return res.status(401).json({ message: "no token provided" });
    }
    try {
        const decoded = jwt.verify(header, config.jwtSecret);
        if (decoded) {
            req.userId = (decoded as { userId: number }).userId;
            next();
        }
    } catch (e) {
        return res.status(401).json({ message: "invalid token or expired token" });
    }
}