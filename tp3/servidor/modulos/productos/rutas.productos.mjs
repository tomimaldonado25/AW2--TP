import express from 'express'
import * as controlador from './controlador.productos.mjs'

const rutasProductos = express.Router()

// ─── API CRUD → panel de administración (5 endpoints)
// GET    /api/v1/productos         → listar todos
// GET    /api/v1/productos/:id     → obtener uno
// POST   /api/v1/productos         → crear
// PUT    /api/v1/productos/:id     → modificar
// DELETE /api/v1/productos/:id     → eliminar

rutasProductos.get('/api/v1/productos',            controlador.obtenerProductos)
rutasProductos.get('/api/v1/productos/:id',        controlador.obtenerProductoPorId)
rutasProductos.post('/api/v1/productos',           controlador.agregarProducto)
rutasProductos.put('/api/v1/productos/:id',        controlador.modificarProducto)
rutasProductos.delete('/api/v1/productos/:id',     controlador.eliminarProducto)

// ─── API Web → solo lectura para la tienda pública (2 endpoints) 
// GET /api/web/productos       → catálogo completo
// GET /api/web/productos/:id   → detalle de un producto

rutasProductos.get('/api/web/productos',           controlador.obtenerProductosWeb)
rutasProductos.get('/api/web/productos/:id',       controlador.obtenerProductoWebPorId)

export default rutasProductos
