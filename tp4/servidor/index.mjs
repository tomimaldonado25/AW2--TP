import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import './inyectar.env.mjs'
import rutasProductos from './modulos/productos/rutas.productos.mjs'
import rutasUsuarios from './modulos/usuarios/rutas.usuarios.mjs'
import { comprobarToken } from './modulos/usuarios/middleware.auth.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PUERTO = process.env.PUERTO || 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true })) //(login/registro)
app.use(cookieParser(process.env.FIRMA_COOKIE)) // habilita req.signedCookies

// Rutas de autenticación (registro, login, logout)
app.use(rutasUsuarios)

// Rutas de la API de productos (CRUD protegido + web pública con CORS)
app.use(rutasProductos)

// Panel de administración -protegido, exige estar logueado
app.use('/admin', comprobarToken, express.static(path.resolve(__dirname, 'public', 'admin')))

// Página de login pública
app.use('/login', express.static(path.resolve(__dirname, 'public', 'login')))

// Resto del frontend de la tienda - público
app.use(express.static(path.resolve(__dirname, 'public')))

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
    console.log(`Tienda:  http://localhost:${PUERTO}/catalogo.html`)
    console.log(`Login:   http://localhost:${PUERTO}/login`)
    console.log(`Admin:   http://localhost:${PUERTO}/admin  (protegido)`)
    console.log(`API:     http://localhost:${PUERTO}/api/v1/productos`)
})
