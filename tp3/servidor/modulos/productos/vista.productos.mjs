
export function serializarProducto(producto) {
    return {
        id:     producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        tipo:   producto.tipo   || null,
        imagen: producto.imagen || null
    }
}

export function serializarProductos(productos) {
    return productos.map(serializarProducto)
}
