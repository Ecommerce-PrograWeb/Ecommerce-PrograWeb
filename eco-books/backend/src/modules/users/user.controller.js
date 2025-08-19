// src/modules/users/user.controller.js
import * as userService from "./user.service.js";

/** GET /users */
export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/** GET /users/:id */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/** POST /users */
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, role_id } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email y password son requeridos" });
    }
    const newUser = await userService.createUser({ name, email, password, role, role_id });
    res.status(201).json(newUser);
  } catch (err) {
    // si el service lanza errores de validación (email duplicado, etc.)
    res.status(400).json({ message: "Error al crear usuario", error: err.message });
  }
};

/** PUT /users/:id */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await userService.updateUser(id, req.body || {});
    if (!updated) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error al actualizar usuario", error: err.message });
  }
};

/** DELETE /users/:id */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await userService.deleteUser(id);
    if (!deleted) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado con éxito", user: deleted });
  } catch (err) {
    next(err);
  }
};

/** POST /users/auth/login  (o /auth/login si lo montas fuera) */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "email y password son requeridos" });
    }
    const user = await userService.login(email, password);
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });
    res.json({ message: "Login ok", user });
  } catch (err) {
    next(err);
  }
};

// export default, por si prefieres importarlo como default
export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
};
