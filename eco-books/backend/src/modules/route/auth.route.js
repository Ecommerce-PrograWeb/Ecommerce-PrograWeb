import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body; // mock para esta fase
  const token = jwt.sign(
    { user_id: 123, role: "USER", email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "1h" }
  );

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
    path: "/",
  });

  res.status(200).json({ ok: true });
});

router.post("/logout", (_req, res) => {
  res.clearCookie("access_token", { path: "/" });
  res.status(200).json({ ok: true });
});

export default router;
