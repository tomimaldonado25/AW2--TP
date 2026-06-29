import * as modelo from './modelo.productos.mjs'
import * as vista from './vista.productos.mjs'
import { gestionImagen } from './util.imagenes.mjs'

//API CRUD para el panel admin

// GET /api/v1/productos - todos los productos
export async function obtenerProductos(req, res) {
    try {
        const productos = await modelo.obtenerProductos()
        res.json(vista.serializarProductos(productos))
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener productos' })
    }
}

// GET /api/v1/productos/:id - un producto por id
export async function obtenerProductoPorId(req, res) {
    try {
        const { id } = req.params
        const producto = await modelo.obtenerProductoPorId(id)
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json(vista.serializarProducto(producto))
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener el producto' })
    }
}

// POST /api/v1/productos - crear producto
export async function agregarProducto(req, res) {
    try {
        const { nombre, precio, tipo, imagen } = req.body
        if (!nombre || precio === undefined) {
            return res.status(400).json({ error: 'nombre y precio son obligatorios' })
        }
        const nuevo = await modelo.agregarProducto({ nombre, precio, tipo, imagen })
        res.status(201).json(vista.serializarProducto(nuevo))
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al agregar el producto' })
    }
}

// PUT /api/v1/productos/:id  - modificar producto
export async function modificarProducto(req, res) {
    try {
        const { id } = req.params
        const { nombre, precio, tipo, imagen } = req.body
        if (!nombre || precio === undefined) {
            return res.status(400).json({ error: 'nombre y precio son obligatorios' })
        }
        const actualizado = await modelo.modificarProducto(id, { nombre, precio, tipo, imagen })
        if (!actualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json(vista.serializarProducto(actualizado))
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al modificar el producto' })
    }
}

// DELETE /api/v1/productos/:id - eliminar producto
export async function eliminarProducto(req, res) {
    try {
        const { id } = req.params
        const eliminado = await modelo.eliminarProducto(id)
        if (!eliminado) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json({ mensaje: 'Producto eliminado correctamente', producto: vista.serializarProducto(eliminado) })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al eliminar el producto' })
    }
}



// GET /api/web/productos - todos los productos para el catalogo
export async function obtenerProductosWeb(req, res) {
    try {
        const productos = await modelo.obtenerProductos()
        res.json(vista.serializarProductos(productos))
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener productos' })
    }
}

// GET /api/web/productos/:id - detalle de un producto para la web
export async function obtenerProductoWebPorId(req, res) {
    try {
        const { id } = req.params
        const producto = await modelo.obtenerProductoPorId(id)
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json(vista.serializarProducto(producto))
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener el producto' })
    }
}



// POST /api/v1/productos/subir-imagen- sube un archivo y devuelve el nombre generado
export function subirImagen(req, res) {
    gestionImagen(req, res, (error) => {
        if (error) {
            console.error(error)
            return res.status(400).json({ error: error.message || 'Error al subir la imagen' })
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No se recibió ningún archivo' })
        }
        // Devolvemos el nombre generado para que el frontend lo guarde en el producto
        res.status(201).json({ imagen: req.file.filename })
    })
}
