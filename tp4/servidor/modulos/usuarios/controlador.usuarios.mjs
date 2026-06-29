import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as modelo from './modelo.usuarios.mjs'

// POST /registrar — crea un nuevo usuario administrador
export async function registrar(req, res) {
    const { usuario, pass } = req.body

    if (!usuario || !pass) {
        return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' })
    }

    try {
        const existente = await modelo.obtenerUsuarioPorUsername(usuario)
        if (existente) {
            return res.status(409).json({ error: 'Ese usuario ya existe' })
        }

        // Hasheamos la contraseña antes de guardarla, nunca se guarda en texto plano
        const salt = bcrypt.genSaltSync(10)
        const passwordHash = bcrypt.hashSync(pass, salt)

        await modelo.crearUsuario(usuario, passwordHash)

        // Respondemos con éxito; la navegación la decide el frontend (sin redirects de servidor)
        res.status(201).json({ mensaje: 'Usuario registrado correctamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al registrar el usuario' })
    }
}

// POST /autenticar — verifica credenciales y entrega el JWT en una cookie
export async function autenticar(req, res) {
    const { usuario, pass } = req.body

    if (!usuario || !pass) {
        return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' })
    }

    try {
        const usuarioBD = await modelo.obtenerUsuarioPorUsername(usuario)

        if (!usuarioBD) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
        }

        // Comparamos la contraseña ingresada con el hash guardado en la BD
        const passwordValida = bcrypt.compareSync(pass, usuarioBD.password_hash)

        if (!passwordValida) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
        }

        // Payload del token: datos no sensibles que identifican al usuario
        const datosUtiles = {
            usuario: usuarioBD.username,
            id: usuarioBD.id
        }

        jwt.sign(datosUtiles, process.env.FIRMA_JWT, { expiresIn: '1h' }, (error, token) => {
            if (error) {
                console.error(error)
                return res.status(500).json({ error: 'Error al generar el token' })
            }

            res.cookie('token', token, {
                signed: true,      // la cookie va firmada con FIRMA_COOKIE
                httpOnly: true,    // no accesible desde JavaScript en el navegador
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 // 1 hora, igual que el token
            })

            // Respondemos con éxito; el frontend hace la navegación a /admin
            res.status(200).json({ mensaje: 'Inicio de sesión correcto' })
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al iniciar sesión' })
    }
}

// POST /cerrar-sesion — limpia la cookie del token
export function cerrarSesion(req, res) {
    res.clearCookie('token')
    res.status(200).json({ mensaje: 'Sesión cerrada' })
}
