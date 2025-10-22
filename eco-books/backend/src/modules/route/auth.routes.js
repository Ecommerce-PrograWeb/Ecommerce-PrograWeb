import { Router } from "express";
import { signToken } from "../../core/security/jwt.js";
const r = Router();

r.post("/login", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requerido" });
  const token = signToken({ sub: 1, email, role: "USER" });
  res.cookie("access_token", token, {
    httpOnly: true, sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 2
  });
  res.json({ ok: true });
});

r.post("/logout", (_req, res) => {
  res.clearCookie("access_token");
  res.json({ ok: true });
});

export default r;
