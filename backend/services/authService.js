
const db = require('../config/database');
const bcrypt = require('bcryptjs');

// ==============================
// VERIFICAR CREDENCIALES
// ==============================
async function verificarCredenciales(email, password) {
    const [usuarios] = await db.execute(
        `SELECT id_usuario, email, password_hash, id_rol, activo
         FROM usuario
         WHERE email = ?`,
        [email.trim().toLowerCase()]
    );

    // Verificar que el usuario exista y esté activo
    if (usuarios.length === 0 || Number(usuarios[0].activo) !== 1) {
        return null;
    }

    const usuario = usuarios[0];

    // Comparar la contraseña con el hash almacenado
    const passwordValida = await bcrypt.compare(
        password,
        usuario.password_hash
    );

    if (!passwordValida) {
        return null;
    }

    // Devolver únicamente los datos necesarios
    return {
        id_usuario: usuario.id_usuario,
        email: usuario.email,
        id_rol: usuario.id_rol
    };
}

module.exports = {
    verificarCredenciales
};
