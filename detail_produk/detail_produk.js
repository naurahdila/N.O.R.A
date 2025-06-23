// 🛍️ DETAIL PRODUK JAVASCRIPT - Fungsi untuk halaman detail produk

// Variabel global
let currentProduct = null
let selectedColor = "Pink"
let selectedSize = "M"
let quantity = 1

// Fungsi untuk memuat detail produk
function loadProductDetail() {
  // Ambil ID produk dari URL
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get("id") || 1 // Default ke produk ID 1 jika tidak ada parameter

  // Coba ambil data produk dari localStorage
  let products = []
  try {
    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      products = JSON.parse(storedProducts)
    } else {
      // Data produk default jika tidak ada di localStorage
      products = [
        {
          id: 1,
          name: "Gamis Zahra",
          price: 213000,
          category: "Gamis",
          image: "https://i.pinimg.com/736x/48/04/1c/48041cd200381b20a4cddf3be784d837.jpg",
          description:
            "Gamis Zahra adalah pilihan sempurna untuk Anda yang menginginkan tampilan elegan namun tetap nyaman. Dibuat dengan bahan katun premium yang adem dan menyerap keringat.",
          material: "Katun Premium",
          code: "GMS-ZHR-001",
          colors: ["Pink", "Putih", "Hitam"],
          sizes: ["S", "M", "L", "XL"],
          images: [
            "https://i.pinimg.com/736x/48/04/1c/48041cd200381b20a4cddf3be784d837.jpg",
            "https://i.pinimg.com/736x/c3/78/be/c378be2b22b36e94a8b484d924d5a769.jpg",
            "https://i.pinimg.com/736x/2f/e2/1e/2fe21e2ac4cc68a970358d57d7a7b60f.jpg",
            "https://i.pinimg.com/736x/cc/77/8a/cc778ae30ab31e24fe2a8602423bb542.jpg",
          ],
        },
      ]
    }
  } catch (error) {
    console.error("Error loading products:", error)
    showNotification("Terjadi kesalahan saat memuat data produk", "error")
  }

  // Cari produk berdasarkan ID
  currentProduct = products.find((p) => p.id == productId)

  if (!currentProduct) {
    showNotification("Produk tidak ditemukan", "error")
    setTimeout(() => {
      window.location.href = "../index.html"
    }, 2000)
    return
  }

  // Tampilkan detail produk
  displayProductDetail()

  // Setup event listeners
  setupEventListeners()
}

// Fungsi untuk menampilkan detail produk
function displayProductDetail() {
  if (!currentProduct) return

  // Update judul halaman
  document.title = `${currentProduct.name} - N.O.R.A`

  // Update informasi produk
  document.getElementById("detailProductName").textContent = currentProduct.name
  document.getElementById("detailProductPrice").textContent = formatPrice(currentProduct.price)

  // Update deskripsi produk
  const descriptionElements = document.querySelectorAll(".product-description p")
  if (descriptionElements.length > 0) {
    descriptionElements[0].textContent = currentProduct.description
  }

  // Update metadata produk
  document.getElementById("productMaterial").textContent = currentProduct.material
  document.getElementById("productCategory").textContent = currentProduct.category
  document.getElementById("productCode").textContent = currentProduct.code || `PROD-${currentProduct.id}`

  // Update gambar utama
  const mainImage = document.getElementById("mainImage")
  mainImage.src = currentProduct.images?.[0] || currentProduct.image
  mainImage.alt = currentProduct.name

  // Update thumbnail images
  setupThumbnailImages()

  // Setup color options
  setupColorOptions()

  // Setup size options
  setupSizeOptions()
}

// Fungsi untuk setup thumbnail images
function setupThumbnailImages() {
  const thumbnailContainer = document.querySelector(".thumbnail-images")
  thumbnailContainer.innerHTML = ""

  const images = currentProduct.images || [currentProduct.image]

  images.forEach((imgSrc, index) => {
    const thumbnail = document.createElement("div")
    thumbnail.className = `thumbnail ${index === 0 ? "active" : ""}`
    thumbnail.setAttribute("data-img", imgSrc)

    const img = document.createElement("img")
    img.src = imgSrc
    img.alt = `${currentProduct.name} - Gambar ${index + 1}`

    thumbnail.appendChild(img)
    thumbnail.addEventListener("click", function () {
      changeMainImage(this)
    })

    thumbnailContainer.appendChild(thumbnail)
  })
}

// Fungsi untuk setup pilihan warna
function setupColorOptions() {
  const colorOptions = document.querySelector(".color-options")
  colorOptions.innerHTML = ""

  const colorMap = {
    Pink: "#ffd1dc",
    Putih: "#f5f5f5",
    Hitam: "#333333",
    Navy: "#000080",
    Maroon: "#800000",
    Mint: "#98fb98",
    Lavender: "#e6e6fa",
    Cream: "#f5f5dc",
  }

  const colors = currentProduct.colors || ["Pink", "Putih", "Hitam"]

  colors.forEach((color, index) => {
    const colorOption = document.createElement("div")
    colorOption.className = `color-option ${index === 0 ? "active" : ""}`
    colorOption.setAttribute("data-color", color)
    colorOption.style.backgroundColor = colorMap[color] || "#cccccc"
    colorOption.title = color

    if (color === "Putih") {
      colorOption.style.border = "1px solid #ddd"
    }

    colorOption.addEventListener("click", function () {
      selectColor(this)
    })

    colorOptions.appendChild(colorOption)
  })

  // Set default selected color
  selectedColor = colors[0]
}

// Fungsi untuk setup pilihan ukuran
function setupSizeOptions() {
  const sizeOptions = document.querySelector(".size-options")
  sizeOptions.innerHTML = ""

  const sizes = currentProduct.sizes || ["S", "M", "L", "XL"]

  sizes.forEach((size, index) => {
    const sizeOption = document.createElement("div")
    sizeOption.className = `size-option ${size === "M" ? "active" : ""}`
    sizeOption.setAttribute("data-size", size)
    sizeOption.textContent = size

    sizeOption.addEventListener("click", function () {
      selectSize(this)
    })

    sizeOptions.appendChild(sizeOption)
  })

  // Set default selected size
  selectedSize = "M"
}

// Fungsi untuk memilih warna
function selectColor(element) {
  // Update active state
  document.querySelectorAll(".color-option").forEach((option) => {
    option.classList.remove("active")
  })
  element.classList.add("active")

  // Update selected color
  selectedColor = element.getAttribute("data-color")
}

// Fungsi untuk memilih ukuran
function selectSize(element) {
  // Update active state
  document.querySelectorAll(".size-option").forEach((option) => {
    option.classList.remove("active")
  })
  element.classList.add("active")

  // Update selected size
  selectedSize = element.getAttribute("data-size")
}

// Fungsi untuk mengubah gambar utama
function changeMainImage(element) {
  const mainImage = document.getElementById("mainImage")
  const imgSrc = element.getAttribute("data-img")

  mainImage.src = imgSrc

  // Update active thumbnail
  document.querySelectorAll(".thumbnail").forEach((thumb) => {
    thumb.classList.remove("active")
  })
  element.classList.add("active")
}

// Fungsi untuk menambah quantity
function increaseQuantity() {
  const quantityInput = document.getElementById("quantityInput")
  let currentValue = Number.parseInt(quantityInput.value)

  if (currentValue < 10) {
    currentValue++
    quantityInput.value = currentValue
    quantity = currentValue
  }
}

// Fungsi untuk mengurangi quantity
function decreaseQuantity() {
  const quantityInput = document.getElementById("quantityInput")
  let currentValue = Number.parseInt(quantityInput.value)

  if (currentValue > 1) {
    currentValue--
    quantityInput.value = currentValue
    quantity = currentValue
  }
}

// Fungsi untuk menambah produk ke keranjang
function addToCart() {
  if (!currentProduct) return

  // Ambil quantity dari input
  const quantityInput = document.getElementById("quantityInput")
  const quantity = Number.parseInt(quantityInput.value)

  // Validasi quantity
  if (isNaN(quantity) || quantity < 1) {
    showNotification("Jumlah produk tidak valid", "error")
    return
  }

  // Ambil keranjang dari localStorage
  let cart = []
  try {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      cart = JSON.parse(storedCart)
    }
  } catch (error) {
    console.error("Error loading cart:", error)
  }

  // Cek apakah produk sudah ada di keranjang dengan spesifikasi yang sama
  const existingItemIndex = cart.findIndex(
    (item) => item.id === currentProduct.id && item.color === selectedColor && item.size === selectedSize,
  )

  if (existingItemIndex > -1) {
    // Update quantity jika produk sudah ada
    cart[existingItemIndex].quantity += quantity
  } else {
    // Tambah produk baru ke keranjang
    cart.push({
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.images?.[0] || currentProduct.image,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
    })
  }

  // Simpan keranjang ke localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Update jumlah item di keranjang
  updateCartCount()

  // Tampilkan notifikasi
  showNotification(`${currentProduct.name} berhasil ditambahkan ke keranjang!`)

  // Tampilkan sidebar keranjang
  showCartSidebar()
}

// Fungsi untuk beli sekarang (langsung ke checkout)
function buyNow() {
  addToCart()

  // Redirect ke halaman pembayaran
  setTimeout(() => {
    window.location.href = "../pembayaran/pembayaran.html"
  }, 500)
}

// Fungsi untuk toggle wishlist
function toggleWishlist() {
  const wishlistBtn = document.getElementById("wishlistBtn")
  const icon = wishlistBtn.querySelector("i")

  if (icon.classList.contains("far")) {
    icon.classList.remove("far")
    icon.classList.add("fas")
    showNotification("Produk ditambahkan ke wishlist!")
  } else {
    icon.classList.remove("fas")
    icon.classList.add("far")
    showNotification("Produk dihapus dari wishlist!")
  }
}

// Fungsi untuk menampilkan tab content
function showTab(tabId) {
  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active")
  })

  // Show selected tab content
  document.getElementById(tabId).classList.add("active")

  // Update active tab button
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  document.querySelector(`[data-tab="${tabId}"]`).classList.add("active")
}

// Fungsi untuk menampilkan sidebar keranjang
function showCartSidebar() {
  document.getElementById("cartOverlay").style.display = "block"
  document.querySelector(".cart-sidebar").classList.add("open")
  document.body.style.overflow = "hidden"

  // Update isi keranjang
  updateCartSidebar()
}

// Fungsi untuk menyembunyikan sidebar keranjang
function hideCartSidebar() {
  document.getElementById("cartOverlay").style.display = "none"
  document.querySelector(".cart-sidebar").classList.remove("open")
  document.body.style.overflow = ""
}

// Fungsi untuk update isi sidebar keranjang
function updateCartSidebar() {
  const cartItems = document.getElementById("cartItems")
  const cartFooter = document.getElementById("cartFooter")
  const emptyCart = document.getElementById("emptyCart")
  const cartTotal = document.getElementById("cartTotal")

  // Ambil keranjang dari localStorage
  let cart = []
  try {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      cart = JSON.parse(storedCart)
    }
  } catch (error) {
    console.error("Error loading cart:", error)
  }

  // Tampilkan pesan keranjang kosong jika tidak ada item
  if (cart.length === 0) {
    emptyCart.style.display = "flex"
    cartFooter.style.display = "none"
    return
  }

  // Sembunyikan pesan keranjang kosong dan tampilkan footer
  emptyCart.style.display = "none"
  cartFooter.style.display = "block"

  // Bersihkan container item keranjang
  cartItems.innerHTML = ""

  // Hitung total
  let total = 0

  // Tambahkan item ke sidebar
  cart.forEach((item, index) => {
    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>Warna: ${item.color}, Ukuran: ${item.size}</p>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="cart-item-actions">
          <div class="cart-item-quantity">
            <button onclick="updateCartItemQuantity(${index}, ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateCartItemQuantity(${index}, ${item.quantity + 1})">+</button>
          </div>
          <div class="remove-item" onclick="removeCartItem(${index})">
            <i class="fas fa-trash"></i>
          </div>
        </div>
      </div>
    `

    cartItems.appendChild(cartItem)

    // Update total
    total += item.price * item.quantity
  })

  // Update total di footer
  cartTotal.textContent = formatPrice(total)
}

// Fungsi untuk update quantity item di keranjang
function updateCartItemQuantity(index, newQuantity) {
  // Ambil keranjang dari localStorage
  let cart = []
  try {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      cart = JSON.parse(storedCart)
    }
  } catch (error) {
    console.error("Error loading cart:", error)
    return
  }

  // Validasi index
  if (index < 0 || index >= cart.length) return

  // Jika quantity 0 atau kurang, hapus item
  if (newQuantity <= 0) {
    removeCartItem(index)
    return
  }

  // Batasi quantity maksimal 10
  if (newQuantity > 10) {
    newQuantity = 10
  }

  // Update quantity
  cart[index].quantity = newQuantity

  // Simpan keranjang ke localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Update tampilan
  updateCartSidebar()
  updateCartCount()
}

// Fungsi untuk menghapus item dari keranjang
function removeCartItem(index) {
  // Ambil keranjang dari localStorage
  let cart = []
  try {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      cart = JSON.parse(storedCart)
    }
  } catch (error) {
    console.error("Error loading cart:", error)
    return
  }

  // Validasi index
  if (index < 0 || index >= cart.length) return

  // Hapus item
  cart.splice(index, 1)

  // Simpan keranjang ke localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Update tampilan
  updateCartSidebar()
  updateCartCount()
  showNotification("Produk dihapus dari keranjang")
}

// Fungsi untuk update jumlah item di keranjang
function updateCartCount() {
  const cartCount = document.getElementById("cartCount")
  if (!cartCount) return

  // Ambil keranjang dari localStorage
  let cart = []
  try {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      cart = JSON.parse(storedCart)
    }
  } catch (error) {
    console.error("Error loading cart:", error)
  }

  // Hitung total item
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Update tampilan
  cartCount.textContent = totalItems
}

// Fungsi untuk format harga ke Rupiah
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

// Utility function to parse price string to number
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

// Add notification styles if not already added
if (!document.querySelector("style[data-notification-styles]")) {
  const style = document.createElement("style")
  style.setAttribute("data-notification-styles", "true")
  style.textContent = `
    .notification {
      position: fixed;
      bottom: 20px;
      left: 20px;
      background-color: #ffb6c1;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 9999;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      font-weight: 500;
      max-width: 300px;
    }
    
    .notification.show {
      transform: translateY(0);
      opacity: 1;
    }
    
    .notification.success {
      background-color: #ffb6c1;
      color: white;
    }
    
    .notification.error {
      background-color: #f44336;
      color: white;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .notification i {
      font-size: 1.25rem;
      color: white;
    }
    
    .no-scroll {
      overflow: hidden;
    }
  `
  document.head.appendChild(style)
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

// Setup event listeners
function setupEventListeners() {
  // Tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")
      showTab(tabId)
    })
  })

  // Quantity buttons
  document.getElementById("minusBtn").addEventListener("click", decreaseQuantity)
  document.getElementById("plusBtn").addEventListener("click", increaseQuantity)

  // Quantity input validation
  const quantityInput = document.getElementById("quantityInput")
  quantityInput.addEventListener("change", function () {
    let value = Number.parseInt(this.value)
    if (isNaN(value) || value < 1) {
      value = 1
    } else if (value > 10) {
      value = 10
    }
    this.value = value
    quantity = value
  })

  // Add to cart button
  document.getElementById("addToCartBtn").addEventListener("click", addToCart)

  // Buy now button
  document.getElementById("buyNowBtn").addEventListener("click", buyNow)

  // Wishlist button
  document.getElementById("wishlistBtn").addEventListener("click", toggleWishlist)

  // Cart icon
  document.getElementById("cartIcon").addEventListener("click", (e) => {
    e.preventDefault()
    showCartSidebar()
  })

  // Close cart button
  document.getElementById("closeCart").addEventListener("click", hideCartSidebar)

  // Cart overlay
  document.getElementById("cartOverlay").addEventListener("click", hideCartSidebar)

  // Related products - add to cart buttons
  document.querySelectorAll(".add-to-cart-related").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation()
      const productCard = this.closest(".product-card")
      const productId = productCard.getAttribute("data-id")

      // Ambil produk dari localStorage
      let products = []
      try {
        const storedProducts = localStorage.getItem("products")
        if (storedProducts) {
          products = JSON.parse(storedProducts)
        }
      } catch (error) {
        console.error("Error loading products:", error)
      }

      // Cari produk berdasarkan ID
      const product = products.find((p) => p.id == productId)

      if (product) {
        // Tambah ke keranjang dengan default options
        let cart = []
        try {
          const storedCart = localStorage.getItem("cart")
          if (storedCart) {
            cart = JSON.parse(storedCart)
          }
        } catch (error) {
          console.error("Error loading cart:", error)
        }

        // Cek apakah produk sudah ada di keranjang
        const existingItemIndex = cart.findIndex((item) => item.id === product.id)

        if (existingItemIndex > -1) {
          // Update quantity jika produk sudah ada
          cart[existingItemIndex].quantity += 1
        } else {
          // Tambah produk baru ke keranjang
          cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || product.image,
            color: product.colors?.[0] || "Default",
            size: product.sizes?.[1] || "M",
            quantity: 1,
          })
        }

        // Simpan keranjang ke localStorage
        localStorage.setItem("cart", JSON.stringify(cart))

        // Update jumlah item di keranjang
        updateCartCount()

        // Tampilkan notifikasi
        showNotification(`${product.name} berhasil ditambahkan ke keranjang!`)

        // Tampilkan sidebar keranjang
        showCartSidebar()
      }
    })
  })

  // Related products - view product buttons
  document.querySelectorAll(".view-product").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation()
      const productCard = this.closest(".product-card")
      const productId = productCard.getAttribute("data-id")

      // Redirect ke halaman detail produk
      window.location.href = `detail-produk.html?id=${productId}`
    })
  })

  // Product card click
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", function () {
      const productId = this.getAttribute("data-id")

      // Redirect ke halaman detail produk
      window.location.href = `detail-produk.html?id=${productId}`
    })
  })
}

// Load product detail when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadProductDetail()
  updateCartCount()
})
