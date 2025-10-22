import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "cambia-esto";
const EXPIRES_IN = "2h";

export const signToken   = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
export const verifyToken = (token)   => jwt.verify(token, SECRET);
