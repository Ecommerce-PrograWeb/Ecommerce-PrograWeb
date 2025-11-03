import { Router } from "express";
import jwt from "jsonwebtoken";
import { verifyJWT } from "../../core/middlewares/auth.js";
import User from "../model/user.model.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email es requerido" });

    let user = await User.findOne({ where: { email } });
    if (!user) {
      const name = (email.split("@")[0] || "Usuario").slice(0, 100);
      user = await User.create({ name, email, password: "temporal", role_id: 1 });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "1h" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      message: "login ok",
      user: { user_id: user.user_id, name: user.name, email: user.email },
    });
  } catch (e) {
    console.error("POST /auth/login error:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/me", verifyJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: ["user_id", "name", "email", "role_id"],
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("access_token", { path: "/" });
  res.status(200).json({ ok: true });
});

export default router;

