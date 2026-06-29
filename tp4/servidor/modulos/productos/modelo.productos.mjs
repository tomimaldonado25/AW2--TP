import pool from '../../conexion.bd.mjs'

// Obtiene todos los productos
export async function obtenerProductos() {
    const resultado = await pool.query('SELECT * FROM productos ORDER BY id ASC')
    return resultado.rows
}

// Obtener un producto por id
export async function obtenerProductoPorId(id) {
    const resultado = await pool.query('SELECT * FROM productos WHERE id = $1', [id])
    return resultado.rows[0] || null
}

// Agregar un producto
export async function agregarProducto(datos) {
    const { nombre, precio, tipo, imagen } = datos
    const resultado = await pool.query(
        'INSERT INTO productos(nombre, precio, tipo, imagen) VALUES($1, $2, $3, $4) RETURNING *',
        [nombre, precio, tipo || null, imagen || null]
    )
    return resultado.rows[0]
}

// Modificar un producto
export async function modificarProducto(id, datos) {
    const { nombre, precio, tipo, imagen } = datos
    const resultado = await pool.query(
        `UPDATE productos 
         SET nombre = $1, precio = $2, tipo = $3, imagen = $4
         WHERE id = $5
         RETURNING *`,
        [nombre, precio, tipo || null, imagen || null, id]
    )
    return resultado.rows[0] || null
}

// Elimina un producto
export async function eliminarProducto(id) {
    const resultado = await pool.query(
        'DELETE FROM productos WHERE id = $1 RETURNING *',
        [id]
    )
    return resultado.rows[0] || null
}
