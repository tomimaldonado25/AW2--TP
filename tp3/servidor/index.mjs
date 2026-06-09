import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import './inyectar.env.mjs'
import rutasProductos from './modulos/productos/rutas.productos.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PUERTO = process.env.PUERTO || 3000

const app = express()
app.use(express.json())


app.use(express.static(path.resolve(__dirname, 'public')))

// Rutas de la API
app.use(rutasProductos)

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
    console.log(`Tienda:  http://localhost:${PUERTO}/catalogo.html`)
    console.log(`Admin:   http://localhost:${PUERTO}/admin/`)
    console.log(`API:     http://localhost:${PUERTO}/api/v1/productos`)
})
