import jwt from 'jsonwebtoken'

// Middleware que se ejecuta antes de entrar a las rutas protegidas (/admin y la API CRUD)
export function comprobarToken(req, res, next) {
    const token = req.signedCookies['token']

    if (!token) {
        return res.redirect('/login')
    }

    jwt.verify(token, process.env.FIRMA_JWT, (error, datosUtiles) => {
        if (error) {
            console.log(error)
            return res.redirect('/login')
        }
        // Guardamos los datos del usuario en el request para usarlos más adelante si hace falta
        req.usuario = datosUtiles
        next()
    })
}

// Variante para rutas de API: en vez de redirigir, responde con 401
export function comprobarTokenAPI(req, res, next) {
    const token = req.signedCookies['token']

    if (!token) {
        return res.status(401).json({ error: 'No autenticado' })
    }

    jwt.verify(token, process.env.FIRMA_JWT, (error, datosUtiles) => {
        if (error) {
            return res.status(401).json({ error: 'Token inválido o expirado' })
        }
        req.usuario = datosUtiles
        next()
    })
}
