const API_WEB_URL = '/api/web/productos'

const STORAGE_KEY = 'electromonCart'

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page

  updateCartCount()

  if (page === 'catalogo') {
    initCatalogPage()
  } else if (page === 'carrito') {
    initCartPage()
  } else if (page === 'confirmacion') {
    initConfirmationPage()
  }
})

// Carrito (localStorage)

function getCart() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  updateCartCount()
}

function updateCartCount() {
  const span = document.getElementById('cart-count')
  if (!span) return
  const cart = getCart()
  const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0)
  span.textContent = totalQty
}

//Catálogo

async function initCatalogPage() {
  const productList = document.getElementById('product-list')
  const feedback    = document.getElementById('feedback')
  const searchInput  = document.getElementById('searchInput')
  const searchButton = document.getElementById('searchButton')
  const resetButton  = document.getElementById('resetButton')

  if (!productList) return

  let loadedProductos = []

  try {
    feedback.classList.add('hidden')

    const response = await fetch(API_WEB_URL)
    if (!response.ok) throw new Error('Error al cargar productos: ' + response.status)
    loadedProductos = await response.json()

    renderProducts(loadedProductos, productList)
  } catch (error) {
    console.error('Error al cargar el catálogo:', error)
    showFeedback(feedback, 'Ocurrió un error al cargar los Pokémon. Probá recargar la página.', 'error')
  }

  if (searchButton && searchInput) {
    searchButton.addEventListener('click', () => {
      const term = searchInput.value.trim().toLowerCase()
      if (!term) {
        renderProducts(loadedProductos, productList)
        return
      }
      const filtered = loadedProductos.filter(p => p.nombre.toLowerCase().includes(term))
      if (filtered.length === 0) {
        showFeedback(feedback, 'No se encontraron Pokémon con ese nombre.', 'info')
        productList.innerHTML = ''
      } else {
        feedback.classList.add('hidden')
        renderProducts(filtered, productList)
      }
    })
  }

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (searchInput) searchInput.value = ''
      feedback.classList.add('hidden')
      renderProducts(loadedProductos, productList)
    })
  }
}

function renderProducts(productos, container) {
  container.innerHTML = ''
  productos.forEach(producto => {
    const card = document.createElement('article')
    card.className = 'product-card'

    const img = document.createElement('img')
  
    img.src = producto.imagen
      ? `/recursos/imagenes/${producto.imagen}`
      : `https://img.pokemondb.net/artwork/large/${producto.nombre.toLowerCase()}.jpg`
    img.alt = producto.nombre
    img.onerror = () => {
      img.src = `https://img.pokemondb.net/artwork/large/${producto.nombre.toLowerCase()}.jpg`
    }

    const name = document.createElement('h3')
    name.className = 'product-name'
    name.textContent = producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1)

    const type = document.createElement('p')
    type.className = 'product-type'
    type.textContent = producto.tipo ? `Tipo: ${producto.tipo}` : ''

    const price = document.createElement('p')
    price.className = 'product-price'
    price.textContent = '$ ' + Number(producto.precio).toLocaleString('es-AR')

    const button = document.createElement('button')
    button.className = 'btn-primary'
    button.textContent = 'Agregar al carrito'
    button.addEventListener('click', () => addToCart(producto))

    card.appendChild(img)
    card.appendChild(name)
    if (producto.tipo) card.appendChild(type)
    card.appendChild(price)
    card.appendChild(button)
    container.appendChild(card)
  })
}

function showFeedback(element, message, type) {
  if (!element) return
  element.textContent = message
  element.classList.remove('hidden', 'error', 'info')
  element.classList.add(type === 'error' ? 'error' : 'info')
}

//Carrito

function addToCart(producto) {
  const cart = getCart()
  const existing = cart.find(item => item.id === producto.id)

  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({
      id:       producto.id,
      nombre:   producto.nombre,
      imagen:   producto.imagen || null,
      tipo:     producto.tipo   || null,
      precio:   producto.precio,
      quantity: 1
    })
  }

  saveCart(cart)
}

function initCartPage() {
  const cartList    = document.getElementById('cart-items')
  const cartEmpty   = document.getElementById('cart-empty')
  const cartSummary = document.getElementById('cart-summary')
  const totalSpan   = document.getElementById('cart-total')
  const qtySpan     = document.getElementById('cart-quantity')
  const clearBtn    = document.getElementById('clear-cart')
  const hiddenTotal = document.getElementById('montoTotal')

  function renderCart() {
    const cart = getCart()
    cartList.innerHTML = ''

    if (cart.length === 0) {
      cartEmpty.classList.remove('hidden')
      cartSummary.classList.add('hidden')
      if (hiddenTotal) hiddenTotal.value = 0
      return
    }

    cartEmpty.classList.add('hidden')
    cartSummary.classList.remove('hidden')

    let total = 0, totalQty = 0

    cart.forEach(item => {
      const li = document.createElement('li')
      li.className = 'cart-item'

      const img = document.createElement('img')
      img.src = item.imagen
        ? `/recursos/imagenes/${item.imagen}`
        : `https://img.pokemondb.net/artwork/large/${item.nombre.toLowerCase()}.jpg`
      img.alt = item.nombre
      img.onerror = () => {
        img.src = `https://img.pokemondb.net/artwork/large/${item.nombre.toLowerCase()}.jpg`
      }

      const info = document.createElement('div')
      info.className = 'cart-item-info'

      const title = document.createElement('p')
      title.className = 'cart-item-title'
      title.textContent = item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1)

      const type = document.createElement('p')
      type.className = 'cart-item-type'
      if (item.tipo) type.textContent = 'Tipo: ' + item.tipo

      info.appendChild(title)
      if (item.tipo) info.appendChild(type)

      const actions = document.createElement('div')
      actions.className = 'cart-item-actions'

      const qty = document.createElement('span')
      qty.className = 'cart-item-qty'
      qty.textContent = 'Cantidad: ' + item.quantity

      const price = document.createElement('span')
      price.className = 'cart-item-price'
      const subtotal = item.precio * item.quantity
      price.textContent = '$ ' + subtotal.toLocaleString('es-AR')

      const removeBtn = document.createElement('button')
      removeBtn.className = 'btn-secondary'
      removeBtn.textContent = 'Eliminar'
      removeBtn.addEventListener('click', () => { removeFromCart(item.id); renderCart() })

      actions.appendChild(qty)
      actions.appendChild(price)
      actions.appendChild(removeBtn)

      li.appendChild(img)
      li.appendChild(info)
      li.appendChild(actions)
      cartList.appendChild(li)

      total += subtotal
      totalQty += item.quantity
    })

    if (totalSpan) totalSpan.textContent = '$ ' + total.toLocaleString('es-AR')
    if (qtySpan)   qtySpan.textContent   = totalQty
    if (hiddenTotal) hiddenTotal.value   = total
  }

  function removeFromCart(id) {
    let cart = getCart()
    cart = cart.filter(item => item.id !== id)
    saveCart(cart)
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => { saveCart([]); renderCart() })
  }

  renderCart()
}

//Confirmación

function initConfirmationPage() {
  const box    = document.getElementById('confirmation-box')
  const params = new URLSearchParams(window.location.search)

  const nombre     = params.get('nombreCompleto') || 'cliente'
  const email      = params.get('email')          || ''
  const direccion  = params.get('direccion')       || ''
  const metodoPago = params.get('metodoPago')      || ''
  const total      = params.get('montoTotal')      || '0'

  const cart = getCart()
  saveCart([])

  if (!box) return

  const title = document.createElement('h2')
  title.textContent = '¡Compra realizada con éxito!'

  const msg = document.createElement('p')
  msg.innerHTML = `Gracias, <strong>${nombre}</strong>. Tu pedido fue procesado correctamente.<br>
    Te enviaremos un resumen a <strong>${email}</strong> y lo enviaremos a:<br>
    <strong>${direccion}</strong>.`

  let metodoTexto = ''
  if (metodoPago === 'debito')  metodoTexto = 'Tarjeta de débito'
  else if (metodoPago === 'credito') metodoTexto = 'Tarjeta de crédito'
  else metodoTexto = 'Método no especificado'

  const payInfo = document.createElement('p')
  payInfo.innerHTML = `Método de pago: <strong>${metodoTexto}</strong><br>
    Monto total: <strong>$ ${Number(total).toLocaleString('es-AR')}</strong>`

  box.appendChild(title)
  box.appendChild(msg)
  box.appendChild(payInfo)

  if (cart.length > 0) {
    const listTitle = document.createElement('p')
    listTitle.textContent = 'Resumen de Pokémon comprados:'
    const ul = document.createElement('ul')
    ul.className = 'confirmation-list'
    cart.forEach(item => {
      const li = document.createElement('li')
      li.textContent = `${item.quantity}× ${item.nombre}`
      ul.appendChild(li)
    })
    box.appendChild(listTitle)
    box.appendChild(ul)
  }
}
