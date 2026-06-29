import express from 'express'
import * as controlador from './controlador.usuarios.mjs'

const rutasUsuarios = express.Router()

rutasUsuarios.post('/registrar', controlador.registrar)
rutasUsuarios.post('/autenticar', controlador.autenticar)
rutasUsuarios.post('/cerrar-sesion', controlador.cerrarSesion)

export default rutasUsuarios
