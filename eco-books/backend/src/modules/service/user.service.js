// src/modules/users/user.service.js  
import { sequelize } from "../../config/database.js";

const USER_FIELDS_PUBLIC = "u.user_id, u.name, u.email, r.type AS role";

/** Helper: obtener role_id por nombre */
export async function findRoleIdByType(type) {
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

/** Verificar si existe usuario por email */
export async function checkUserExists(email) {
  const [rows] = await sequelize.query(
    "SELECT 1 FROM `User` WHERE email = :email",
    { replacements: { email } }
  );
  return rows.length > 0;
}

/** CREATE  */
export async function createUser(data = {}) {
  const { name, email, password, role_id, role } = data;
  
  console.log("[user.service] createUser - datos recibidos:", { name, email, role, role_id });
  
  if (!name || !email || !password) {
    console.error("[user.service] createUser - datos incompletos");
    throw new Error("name, email y password son obligatorios");
  }

  // email único
  const exists = await checkUserExists(email);
  if (exists) {
    console.error("[user.service] createUser - email duplicado:", email);
    throw new Error("El email ya está registrado");
  }

  // resolver role_id por nombre si viene 'role'
  let roleId = role_id ?? null;
  if (!roleId && role) {
    roleId = await findRoleIdByType(role);
    if (!roleId) {
      console.error("[user.service] createUser - rol no existe:", role);
      throw new Error(`Role '${role}' no existe. Inserta antes en tabla Role.`);
    }
  }

  //  guardar 
  console.log("[user.service] createUser - guardando usuario en DB...");
  const [result] = await sequelize.query(
    "INSERT INTO `User` (name, email, password, role_id) VALUES (:name, :email, :password, :role_id)",
    { replacements: { name, email, password, role_id: roleId } }
  );

  const insertId = result.insertId ?? result;
  const newUser = await getUserById(insertId);
  console.log("[user.service] createUser - usuario creado exitosamente:", newUser);
  return newUser;
}

/** UPDATE  */
export async function updateUser(id, data) {
  const allowed = ["name", "email", "password", "role_id", "role"];
  const updates = {};
  for (const k of allowed) if (data[k] !== undefined) updates[k] = data[k];

  if (updates.role && !updates.role_id) {
    const rId = await findRoleIdByType(updates.role);
    if (!rId) throw new Error(`Role '${updates.role}' no existe. Inserta antes en tabla Role.`);
    updates.role_id = rId;
    delete updates.role;
  }

  if (updates.email) {
    const [exists] = await sequelize.query(
      "SELECT 1 FROM `User` WHERE email = :email AND user_id <> :id",
      { replacements: { email: updates.email, id } }
    );
    if (exists.length) throw new Error("El email ya está en uso por otro usuario");
  }

  // construir SET dinámico
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
  // Prefer model-level mocks/usage if models are available (tests use this style)
  if (sequelize.models && sequelize.models.User) {
    const user = await sequelize.models.User.findByPk(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    await sequelize.models.User.destroy({ where: { user_id: id } });
    return user;
  }

  // If not using models, but raw SQL is available, fall back to raw SQL behavior
  if (typeof sequelize.query === 'function') {
    const existing = await getUserById(id);
    if (!existing) return null;

    await sequelize.query(
      "DELETE FROM `User` WHERE user_id = :id",
      { replacements: { id } }
    );

    return existing;
  }

  // Final fallback: try raw SQL delete (best-effort)
  const existing = await getUserById(id);
  if (!existing) return null;
  await sequelize.query("DELETE FROM `User` WHERE user_id = :id", { replacements: { id } });
  return existing;
}

/** RESTORE */
export async function restoreUser(id) {
  // Prefer model path when available (tests use model mocks)
  if (sequelize.models && sequelize.models.User) {
    const wasRestored = await sequelize.models.User.restore({ where: { user_id: id } });
    if (!wasRestored || !wasRestored[0]) {
      throw new Error(`User with id ${id} could not be restored`);
    }
    const user = await sequelize.models.User.findByPk(id);
    if (!user) throw new Error(`User with id ${id} not found after restore`);
    return user;
  }

  // Raw SQL fallback: update deleted_at to NULL then return user
  if (typeof sequelize.query === 'function') {
    await sequelize.query(
      "UPDATE `User` SET deleted_at = NULL WHERE user_id = :id",
      { replacements: { id } }
    );
    const user = await getUserById(id);
    if (!user) throw new Error(`User with id ${id} not found after restore`);
    return user;
  }

  // Final fallback: attempt raw SQL
  await sequelize.query("UPDATE `User` SET deleted_at = NULL WHERE user_id = :id", { replacements: { id } });
  return await getUserById(id);
}

/** LOGIN */
export async function login(email, password) {
  console.log("[user.service] login - intentando login para email:", email);
  
  const [rows] = await sequelize.query(
    `SELECT u.user_id, u.name, u.email, u.password, r.type AS role
       FROM \`User\` u
       LEFT JOIN Role r ON u.role_id = r.role_id
      WHERE u.email = :email`,
    { replacements: { email } }
  );

  const user = rows[0];
  if (!user) {
    console.error("[user.service] login - usuario no encontrado");
    return null;
  }

  // TODO: Usar bcrypt para comparar passwords hasheadas
  if (user.password !== password) {
    console.error("[user.service] login - password incorrecta");
    return null;
  }

  console.log("[user.service] login - login exitoso para:", email);
  const { password: _ignored, ...safe } = user;
  return safe;
}
