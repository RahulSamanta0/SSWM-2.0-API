import jwt from "jsonwebtoken";
import { verifyUserId } from "../models/loginmodel/userAuthModel.js";

export default async function requireAuth(req, res, next) {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await verifyUserId(decoded.id);
    if (result.success) {
      req.user = { id: decoded.id, role: decoded.role }; // Attach role if present in JWT
      next();
    } else {
      return res.status(403).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}