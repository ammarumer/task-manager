import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

import { protect as auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Verify token and return user info
router.get("/me", auth, (req, res) => {
    res.json({ email: req.user.email, id: req.user.id });
});

export default router;
