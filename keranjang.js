// 🛒 KERANJANG JAVASCRIPT - Fungsi untuk halaman keranjang belanja

// Fungsi untuk memuat data keranjang
function loadCartData() {
  // Ambil data keranjang dari localStorage
  let cart = []
  try {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      cart = JSON.parse(storedCart)
    }
  } catch (error) {
    console.error("Error loading cart:", error)
    showNotification("Terjadi kesalahan saat memuat keranjang", "error")
  }

  return cart
}

// Fungsi untuk menyimpan data keranjang
function saveCartData(cart) {
  try {
    localStorage.setItem("cart", JSON.stringify(cart))
  } catch (error) {
    console.error("Error saving cart:", error)
    showNotification("Terjadi kesalahan saat menyimpan keranjang", "error")
  }
}

// Fungsi untuk menampilkan item keranjang
function displayCartItems() {
  const cart = loadCartData()
  const cartItemsList = document.getElementById("cartItemsList")
  const emptyCartMessage = document.getElementById("emptyCartMessage")

  // Tampilkan pesan keranjang kosong jika tidak ada item
  if (cart.length === 0) {
    if (cartItemsList) cartItemsList.innerHTML = ""
    if (emptyCartMessage) emptyCartMessage.style.display = "flex"
    updateCartSummary()
    return
  }

  // Sembunyikan pesan keranjang kosong
  if (emptyCartMessage) emptyCartMessage.style.display = "none"

  // Bersihkan container item keranjang
  if (!cartItemsList) return
  cartItemsList.innerHTML = ""

  // Tambahkan item ke keranjang
  cart.forEach((item, index) => {
    // Pastikan price adalah number
    const price = typeof item.price === "number" ? item.price : Number.parseFloat(item.price) || 0
    const quantity = Number.parseInt(item.quantity) || 1

    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"

    cartItem.innerHTML = `
      <div class="product-col">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>Warna: ${item.color}, Ukuran: ${item.size}</p>
        </div>
      </div>
      <div class="price-col">${formatPrice(price)}</div>
      <div class="quantity-col">
        <div class="quantity-selector">
          <button class="quantity-btn" onclick="updateCartQuantity(${index}, ${quantity - 1})">-</button>
          <input type="number" class="quantity-input" value="${quantity}" min="1" max="10" 
                 onchange="updateCartQuantity(${index}, this.value)">
          <button class="quantity-btn" onclick="updateCartQuantity(${index}, ${quantity + 1})">+</button>
        </div>
      </div>
      <div class="subtotal-col">${formatPrice(price * quantity)}</div>
      <div class="action-col">
        <button class="remove-btn" onclick="removeFromCart(${index})" title="Hapus item">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `

    cartItemsList.appendChild(cartItem)
  })

  // Update ringkasan keranjang
  updateCartSummary()
}

// Fungsi untuk update quantity item di keranjang
function updateCartQuantity(index, newQuantity) {
  const cart = loadCartData()

  // Validasi index
  if (index < 0 || index >= cart.length) return

  // Parse quantity
  newQuantity = Number.parseInt(newQuantity)

  // Jika quantity 0 atau kurang, hapus item
  if (newQuantity <= 0) {
    removeFromCart(index)
    return
  }

  // Batasi quantity maksimal 10
  if (newQuantity > 10) {
    newQuantity = 10
  }

  // Update quantity
  cart[index].quantity = newQuantity

  // Simpan keranjang
  saveCartData(cart)

  // Update tampilan
  displayCartItems()
  updateCartCount()

  showNotification("Produk berhasil diupdate!")
}

// Fungsi untuk menghapus item dari keranjang
function removeFromCart(index) {
  const cart = loadCartData()

  // Validasi index
  if (index < 0 || index >= cart.length) return

  const itemName = cart[index].name

  // Hapus item
  cart.splice(index, 1)

  // Simpan keranjang
  saveCartData(cart)

  // Update tampilan
  displayCartItems()
  updateCartCount()

  showNotification(`${itemName} dihapus dari keranjang!`)
}

// Fungsi untuk update ringkasan keranjang
function updateCartSummary() {
  const cart = loadCartData()
  const subtotalElement = document.getElementById("cartSubtotal")
  const shippingElement = document.getElementById("orderShipping")
  const totalElement = document.getElementById("cartTotal")
  const checkoutBtn = document.getElementById("checkoutBtn")

  // Hitung subtotal dengan validasi price
  const subtotal = cart.reduce((sum, item) => {
    const price = typeof item.price === "number" ? item.price : Number.parseFloat(item.price) || 0
    const quantity = Number.parseInt(item.quantity) || 1
    return sum + price * quantity
  }, 0)

  // Ambil biaya pengiriman yang dipilih
  const shippingRadios = document.querySelectorAll('input[name="shipping"]')
  let shipping = 15000 // Default shipping cost

  shippingRadios.forEach((radio) => {
    if (radio.checked) {
      shipping = Number.parseInt(radio.value) || 15000
    }
  })

  // Hitung total
  const total = subtotal + shipping

  // Update tampilan
  if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal)
  if (shippingElement) shippingElement.textContent = formatPrice(shipping)
  if (totalElement) totalElement.textContent = formatPrice(total)

  // Enable/disable checkout button
  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0
    if (cart.length === 0) {
      checkoutBtn.style.opacity = "0.5"
      checkoutBtn.style.cursor = "not-allowed"
    } else {
      checkoutBtn.style.opacity = "1"
      checkoutBtn.style.cursor = "pointer"
    }
  }
}

// Fungsi untuk melanjutkan ke pembayaran
function proceedToCheckout() {
  const cart = loadCartData()

  if (cart.length === 0) {
    showNotification("Keranjang Anda kosong!", "error")
    return
  }

  // Redirect ke halaman pembayaran
  window.location.href = "pembayaran/pembayaran.html"
}

// Fungsi untuk update jumlah item di keranjang
function updateCartCount() {
  const cartCount = document.getElementById("cartCount")
  if (!cartCount) return

  const cart = loadCartData()
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems
}

// Fungsi untuk parse harga dari format Rupiah ke number
function parsePrice(priceString) {
  if (typeof priceString === "number") return priceString

  // Handle Indonesian Rupiah format (e.g., "Rp 213.000")
  if (typeof priceString === "string") {
    // Remove currency symbol and non-numeric characters except dots
    const numericString = priceString.replace(/[^0-9.]/g, "")

    // Replace dots with empty string (Indonesian uses dots as thousand separators)
    const normalizedString = numericString.replace(/\./g, "")

    // Parse as integer or float depending on the format
    return Number.parseInt(normalizedString) || 0
  }

  return 0
}

// Fungsi untuk format harga ke Rupiah
function formatPrice(price) {
  // Pastikan price adalah number yang valid
  const numPrice = typeof price === "number" ? price : parsePrice(price)

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numPrice)
}

// Function to show notification
function showNotification(message, type = "success") {
  // Remove existing notification if any
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create new notification
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === "error" ? "fa-exclamation-circle" : "fa-check-circle"}"></i>
      <span>${message}</span>
    </div>
  `

  // Add notification to body
  document.body.appendChild(notification)

  // Show notification
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Setup event listeners untuk shipping options
function setupShippingOptions() {
  const shippingRadios = document.querySelectorAll('input[name="shipping"]')

  shippingRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      updateCartSummary()
    })
  })
}

// Fungsi untuk membersihkan data keranjang dan memastikan format yang benar
function cleanCartData() {
  const cart = loadCartData()
  const cleanedCart = cart.map((item) => ({
    ...item,
    price: typeof item.price === "number" ? item.price : Number.parseFloat(item.price) || 0,
    quantity: Number.parseInt(item.quantity) || 1,
  }))

  saveCartData(cleanedCart)
  return cleanedCart
}

// Event listener ketika halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  // Clean cart data first to ensure proper format
  cleanCartData()

  // Load dan tampilkan item keranjang
  displayCartItems()
  updateCartCount()

  // Setup shipping options
  setupShippingOptions()

  // Setup checkout button
  const checkoutBtn = document.getElementById("checkoutBtn")
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", proceedToCheckout)
  }

  // Setup update cart button
  const updateCartBtn = document.getElementById("updateCartBtn")
  if (updateCartBtn) {
    updateCartBtn.addEventListener("click", () => {
      showNotification("Keranjang berhasil diperbarui!")
    })
  }

  // Add notification styles if not already added
  if (!document.querySelector("style[data-notification-styles]")) {
    const style = document.createElement("style")
    style.setAttribute("data-notification-styles", "true")
    style.textContent = `
    .notification {
      position: fixed;
      bottom: 20px;
      left: 20px;
      background-color: #ffc0cb;
      color: #333333;
      padding: 10px 20px;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 9999;
      font-family: "Poppins", sans-serif;
      font-weight: 500;
      max-width: 300px;
    }
    
    .notification.show {
      transform: translateY(0);
      opacity: 1;
    }
    
    .notification.success {
      background-color: #ffc0cb;
      color: #333333;
    }
    
    .notification.error {
      background-color: #ff4444;
      color: white;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .notification i {
      font-size: 1.25rem;
      color: #333333;
    }
    
    .notification.error i {
      color: white;
    }
  `
    document.head.appendChild(style)
  }
})

// Export functions for global access
window.updateCartQuantity = updateCartQuantity
window.removeFromCart = removeFromCart
window.proceedToCheckout = proceedToCheckout
window.updateCartCount = updateCartCount
window.formatPrice = formatPrice
window.showNotification = showNotification
