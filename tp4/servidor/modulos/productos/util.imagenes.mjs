import multer from 'multer'
import { nanoid } from 'nanoid'
import mime from 'mime-types'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carpeta donde se guardan físicamente las imágenes subidas
const CARPETA_IMAGENES = path.resolve(__dirname, '..', '..', 'public', 'recursos', 'imagenes')

const tiposPermitidos = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, CARPETA_IMAGENES)
    },
    filename: function (req, file, cb) {
        // Nombre único para evitar pisar imágenes con el mismo nombre
        const nuevoNombre = nanoid() + '.' + mime.extension(file.mimetype)
        cb(null, nuevoNombre)
    }
})

const subirArchivo = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
    fileFilter: function (req, file, cb) {
        if (!tiposPermitidos.includes(file.mimetype)) {
            return cb(new Error('Formato no permitido. Solo se aceptan PNG, JPG, WEBP o GIF'))
        }
        cb(null, true)
    }
})

// Middleware listo para usar en la ruta: espera un único campo 'imagen'
export const gestionImagen = subirArchivo.single('imagen')
