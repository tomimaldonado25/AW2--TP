import pool from '../../conexion.bd.mjs'

// Buscar un usuario por su nombre de usuario
export async function obtenerUsuarioPorUsername(username) {
    const resultado = await pool.query(
        'SELECT * FROM usuarios WHERE username = $1',
        [username]
    )
    return resultado.rows[0] || null
}

// Crear un nuevo usuario (la contraseña ya debe venir hasheada)
export async function crearUsuario(username, passwordHash) {
    const resultado = await pool.query(
        'INSERT INTO usuarios (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
        [username, passwordHash]
    )
    return resultado.rows[0]
}
