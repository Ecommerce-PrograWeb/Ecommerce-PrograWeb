import { Router } from "express";
import jwt from "jsonwebtoken";
import { verifyJWT } from "../../core/middlewares/auth.js";
import User from "../model/user.model.js";
import * as userService from "../service/user.service.js";

const router = Router();

/** POST /auth/register - Registrar nuevo usuario */
router.post("/register", async (req, res) => {
  try {
    console.log("[auth.route] POST /auth/register - body:", req.body);
    
    const { name, email, password, role } = req.body || {};
    
    if (!name || !email || !password) {
      console.error("[auth.route] POST /auth/register - datos incompletos");
      return res.status(400).json({ 
        error: "name, email y password son requeridos" 
      });
    }

    // Verificar si el usuario ya existe
    const exists = await userService.checkUserExists(email);
    if (exists) {
      console.error("[auth.route] POST /auth/register - email duplicado:", email);
      return res.status(409).json({ 
        error: "El email ya está registrado" 
      });
    }

    // Crear el usuario (role por defecto: Customer si no se especifica)
    const newUser = await userService.createUser({
      name,
      email,
      password,
      role: role || "Customer"
    });

    console.log("[auth.route] POST /auth/register - usuario creado exitosamente");
    
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (e) {
    console.error("[auth.route] POST /auth/register error:", e);
    res.status(500).json({ 
      error: e.message || "Error al registrar usuario" 
    });
  }
});

/** POST /auth/login - Iniciar sesión */
router.post("/login", async (req, res) => {
  try {
    console.log("[auth.route] POST /auth/login - body:", req.body);
    
    const { email, password } = req.body || {};
    
    if (!email || !password) {
      console.error("[auth.route] POST /auth/login - datos incompletos");
      return res.status(400).json({ 
        error: "Email y password son requeridos" 
      });
    }

    // Validar credenciales usando el servicio
    const user = await userService.login(email, password);
    
    if (!user) {
      console.error("[auth.route] POST /auth/login - credenciales inválidas");
      return res.status(401).json({ 
        error: "Credenciales inválidas" 
      });
    }

    // Generar JWT token
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET || "secret-key-default",
      { expiresIn: process.env.JWT_EXPIRES || "1h" }
    );

    // Configurar cookie
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000, // 1 hora
      path: "/",
    });

    console.log("[auth.route] POST /auth/login - login exitoso");
    
    res.json({
      message: "Login exitoso",
      user: { 
        user_id: user.user_id, 
        name: user.name, 
        email: user.email,
        role: user.role
      },
    });
  } catch (e) {
    console.error("[auth.route] POST /auth/login error:", e);
    res.status(500).json({ 
      error: "Error al iniciar sesión" 
    });
  }
});

/** GET /auth/me - Obtener usuario actual */
router.get("/me", verifyJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: ["user_id", "name", "email", "role_id"],
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ user });
  } catch (e) {
    console.error("[auth.route] GET /auth/me error:", e);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

/** POST /auth/logout - Cerrar sesión */
router.post("/logout", (_req, res) => {
  console.log("[auth.route] POST /auth/logout - cerrando sesión");
  res.clearCookie("access_token", { path: "/" });
  res.status(200).json({ 
    message: "Sesión cerrada exitosamente",
    ok: true 
  });
});

export default router;

