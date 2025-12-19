import express from "express";

const router = express.Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  res.status(200).json({ message: "Login endpoint" });
});

// POST /api/auth/register
router.post("/register", (req, res) => {
  res.status(200).json({ message: "Register endpoint" });
});

export default router;
