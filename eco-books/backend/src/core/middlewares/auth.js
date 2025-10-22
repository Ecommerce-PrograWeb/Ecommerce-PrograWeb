import jwt from "jsonwebtoken";

export function verifyJWT(req, res, next) {
  // --- LOGS DE DIAGNÓSTICO ---
  console.log("RAW Cookie header:", req.headers.cookie);
  console.log("req.cookies (parseado):", req.cookies);
  console.log("Authorization:", req.headers.authorization);

  const cookieToken = req.cookies?.access_token;
  const authHeader = req.headers.authorization;
  const headerToken =
    authHeader && /^Bearer /i.test(authHeader) ? authHeader.split(" ")[1] : null;

  const token = cookieToken || headerToken;
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido o vencido" });
  }
}
