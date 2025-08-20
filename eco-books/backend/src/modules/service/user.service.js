// src/modules/users/user.service.js
import bcrypt from "bcrypt";                       // si prefieres evitar binarios: import bcrypt from "bcryptjs";
import { sequelize } from "../../config/database.js";

const USER_FIELDS_PUBLIC = "u.user_id, u.name, u.email, r.type AS role";

/** Helper: obtener role_id por su type (nombre) */
async function findRoleIdByType(type) {
  if (!type) return null;
  const [rows] = await sequelize.query(
    "SELECT role_id FROM Role WHERE type = :type",
    { replacements: { type } }
  );
  return rows?.[0]?.role_id ?? null;
}

/** GET all */
export async function getAllUsers() {
  const [rows] = await sequelize.query(
    `SELECT ${USER_FIELDS_PUBLIC}
       FROM \`User\` u
       LEFT JOIN Role r ON u.role_id = r.role_id`
  );
  return rows;
}

/** GET by id */
export async function getUserById(id) {
  const [rows] = await sequelize.query(
    `SELECT ${USER_FIELDS_PUBLIC}
       FROM \`User\` u
       LEFT JOIN Role r ON u.role_id = r.role_id
      WHERE u.user_id = :id`,
    { replacements: { id } }
  );
  return rows[0] || null;
}

/** CREATE */
export async function createUser(data) {
  const { name, email, password, role_id, role } = data || {};
  if (!name || !email || !password) {
    throw new Error("name, email y password son obligatorios");
  }

  // Email único
  const [exists] = await sequelize.query(
    "SELECT 1 FROM `User` WHERE email = :email",
    { replacements: { email } }
  );
  if (exists.length) throw new Error("El email ya está registrado");

  // Resolver role_id si viene 'role' (por nombre)
  let roleId = role_id ?? null;
  if (!roleId && role) {
    roleId = await findRoleIdByType(role);
    if (!roleId) throw new Error(`Role '${role}' no existe. Inserta antes en tabla Role.`);
  }

  const hashed = await bcrypt.hash(password, 10);

  const [result] = await sequelize.query(
    "INSERT INTO `User` (name, email, password, role_id) VALUES (:name, :email, :password, :role_id)",
    { replacements: { name, email, password: hashed, role_id: roleId } }
  );

  const insertId = result.insertId ?? result; // mysql2 devuelve insertId en 'result'
  return await getUserById(insertId);
}

/** UPDATE */
export async function updateUser(id, data) {
  const allowed = ["name", "email", "password", "role_id", "role"];
  const updates = {};
  for (const k of allowed) if (data[k] !== undefined) updates[k] = data[k];

  // Resolver role por nombre
  if (updates.role && !updates.role_id) {
    const rId = await findRoleIdByType(updates.role);
    if (!rId) throw new Error(`Role '${updates.role}' no existe. Inserta antes en tabla Role.`);
    updates.role_id = rId;
    delete updates.role;
  }

  // Email único si cambia
  if (updates.email) {
    const [exists] = await sequelize.query(
      "SELECT 1 FROM `User` WHERE email = :email AND user_id <> :id",
      { replacements: { email: updates.email, id } }
    );
    if (exists.length) throw new Error("El email ya está en uso por otro usuario");
  }

  // Hash si cambia password
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  // Construir SET dinámico
  const fields = [];
  const replacements = { id };
  for (const [k, v] of Object.entries(updates)) {
    fields.push(`${k} = :${k}`);
    replacements[k] = v;
  }

  if (!fields.length) return await getUserById(id);

  await sequelize.query(
    `UPDATE \`User\` SET ${fields.join(", ")} WHERE user_id = :id`,
    { replacements }
  );

  return await getUserById(id);
}

/** DELETE */
export async function deleteUser(id) {
  const existing = await getUserById(id);
  if (!existing) return null;

  await sequelize.query(
    "DELETE FROM `User` WHERE user_id = :id",
    { replacements: { id } }
  );

  return existing;
}

/** LOGIN */
export async function login(email, password) {
  const [rows] = await sequelize.query(
    `SELECT u.user_id, u.name, u.email, u.password, r.type AS role
       FROM \`User\` u
       LEFT JOIN Role r ON u.role_id = r.role_id
      WHERE u.email = :email`,
    { replacements: { email } }
  );
  const user = rows[0];
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;

  const { password: _ignored, ...safe } = user;
  return safe;
}
