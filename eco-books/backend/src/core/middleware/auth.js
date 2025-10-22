import { verifyToken } from "../security/jwt.js";

export function authRequired(req, res, next) {
  const h = req.headers.authorization || "";
  const bearer = h.startsWith("Bearer ") ? h.slice(7) : null;
  const cookieToken = req.cookies?.access_token;
  const token = bearer || cookieToken;

  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    req.user = verifyToken(token); // { sub, email, role, ... }
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}
