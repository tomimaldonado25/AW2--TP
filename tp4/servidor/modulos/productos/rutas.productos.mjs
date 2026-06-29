import express from 'express'
import cors from 'cors'
import * as controlador from './controlador.productos.mjs'
import { comprobarTokenAPI } from '../usuarios/middleware.auth.mjs'

const rutasProductos = express.Router()


// Protegidas con JWT: solo un usuario autenticado puede crear, modificar o eliminar

rutasProductos.get('/api/v1/productos',            controlador.obtenerProductos)
rutasProductos.post('/api/v1/productos/subir-imagen', comprobarTokenAPI, controlador.subirImagen)
rutasProductos.get('/api/v1/productos/:id',        controlador.obtenerProductoPorId)
rutasProductos.post('/api/v1/productos',           comprobarTokenAPI, controlador.agregarProducto)
rutasProductos.put('/api/v1/productos/:id',        comprobarTokenAPI, controlador.modificarProducto)
rutasProductos.delete('/api/v1/productos/:id',     comprobarTokenAPI, controlador.eliminarProducto)


// Se habilita CORS porque esta API puede ser consumida desde otros orígenes
// por ejemplo, si el Front-End de la tienda se despliega en otro dominio/puerto
// distinto al del servidor, como Vercel o Netlify, separado del backend

rutasProductos.get('/api/web/productos',           cors(), controlador.obtenerProductosWeb)
rutasProductos.get('/api/web/productos/:id',       cors(), controlador.obtenerProductoWebPorId)

export default rutasProductos
