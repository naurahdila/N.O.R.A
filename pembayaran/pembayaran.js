// 💳 PEMBAYARAN JAVASCRIPT - Fungsi untuk halaman pembayaran

// Fungsi untuk memuat data keranjang dari localStorage
function loadCartData() {
  let cart = []
  try {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      cart = JSON.parse(storedCart)
    }
  } catch (error) {
    console.error("Error loading cart:", error)
    showNotification("Terjadi kesalahan saat memuat data pesanan", "error")
  }
  return cart
}

// Fungsi untuk format harga ke Rupiah
function formatPrice(price) {
  const numPrice = typeof price === "number" ? price : Number.parseFloat(price) || 0
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numPrice)
}

// Fungsi untuk parse harga dari format Rupiah ke number
function parsePrice(priceString) {
  if (typeof priceString === "number") return priceString
  if (typeof priceString === "string") {
    const numericString = priceString.replace(/[^0-9.]/g, "")
    const normalizedString = numericString.replace(/\./g, "")
    return Number.parseInt(normalizedString) || 0
  }
  return 0
}

// Fungsi untuk menampilkan item pesanan
function displayOrderItems() {
  const cart = loadCartData()
  const orderItemsContainer = document.getElementById("orderItems")

  if (!orderItemsContainer) return

  // Jika keranjang kosong, redirect ke halaman keranjang
  if (cart.length === 0) {
    showNotification("Keranjang Anda kosong!", "error")
    setTimeout(() => {
      window.location.href = "../keranjang/keranjang.html"
    }, 2000)
    return
  }

  // Bersihkan container
  orderItemsContainer.innerHTML = ""

  // Tambahkan setiap item ke ringkasan pesanan
  cart.forEach((item) => {
    const price = typeof item.price === "number" ? item.price : Number.parseFloat(item.price) || 0
    const quantity = Number.parseInt(item.quantity) || 1
    const subtotal = price * quantity

    const orderItem = document.createElement("div")
    orderItem.className = "order-item"

    orderItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="order-item-image">
      <div class="order-item-details">
        <h4>${item.name}</h4>
        <p>Warna: ${item.color}, Ukuran: ${item.size}</p>
        <p>Jumlah: ${quantity}</p>
      </div>
      <div class="order-item-price">${formatPrice(subtotal)}</div>
    `

    orderItemsContainer.appendChild(orderItem)
  })

  // Update total pesanan
  updateOrderSummary()
}

// Fungsi untuk update ringkasan pesanan
function updateOrderSummary() {
  const cart = loadCartData()
  const subtotalElement = document.getElementById("orderSubtotal")
  const shippingElement = document.getElementById("orderShipping")
  const totalElement = document.getElementById("orderTotal")

  // Hitung subtotal
  const subtotal = cart.reduce((sum, item) => {
    const price = typeof item.price === "number" ? item.price : Number.parseFloat(item.price) || 0
    const quantity = Number.parseInt(item.quantity) || 1
    return sum + price * quantity
  }, 0)

  // Biaya pengiriman default (bisa diambil dari localStorage jika ada)
  const shipping = 15000

  // Hitung total
  const total = subtotal + shipping

  // Update tampilan
  if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal)
  if (shippingElement) shippingElement.textContent = formatPrice(shipping)
  if (totalElement) totalElement.textContent = formatPrice(total)
}

// Fungsi untuk update jumlah item di keranjang
function updateCartCount() {
  const cartCount = document.getElementById("cartCount")
  if (!cartCount) return

  const cart = loadCartData()
  const totalItems = cart.reduce((sum, item) => sum + (Number.parseInt(item.quantity) || 1), 0)
  cartCount.textContent = totalItems
}

// Fungsi untuk validasi form
function validateForm() {
  const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "province", "postalCode"]

  let isValid = true
  const errors = []

  requiredFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId)
    if (field && !field.value.trim()) {
      isValid = false
      errors.push(`${field.previousElementSibling.textContent} harus diisi`)
      field.style.borderColor = "#ff4444"
    } else if (field) {
      field.style.borderColor = "#e0e0e0"
    }
  })

  // Validasi email
  const emailField = document.getElementById("email")
  if (emailField && emailField.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailField.value)) {
      isValid = false
      errors.push("Format email tidak valid")
      emailField.style.borderColor = "#ff4444"
    }
  }

  // Validasi nomor telepon
  const phoneField = document.getElementById("phone")
  if (phoneField && phoneField.value) {
    const phoneRegex = /^[0-9+\-\s()]+$/
    if (!phoneRegex.test(phoneField.value)) {
      isValid = false
      errors.push("Format nomor telepon tidak valid")
      phoneField.style.borderColor = "#ff4444"
    }
  }

  if (!isValid) {
    showNotification(errors[0], "error")
  }

  return isValid
}

// Fungsi untuk mengumpulkan data pesanan
function collectOrderData() {
  const cart = loadCartData()
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || "bank-transfer"

  // Tentukan status berdasarkan metode pembayaran
  let orderStatus = "pending" // default untuk COD
  if (paymentMethod === "bank-transfer" || paymentMethod === "e-wallet") {
    orderStatus = "processing" // langsung diproses untuk transfer dan e-wallet
  }

  const orderData = {
    // Informasi pembeli
    customer: {
      firstName: document.getElementById("firstName")?.value || "",
      lastName: document.getElementById("lastName")?.value || "",
      email: document.getElementById("email")?.value || "",
      phone: document.getElementById("phone")?.value || "",
    },

    // Alamat pengiriman
    shipping: {
      address: document.getElementById("address")?.value || "",
      city: document.getElementById("city")?.value || "",
      province: document.getElementById("province")?.value || "",
      postalCode: document.getElementById("postalCode")?.value || "",
    },

    // Item pesanan
    items: cart,

    // Metode pembayaran
    paymentMethod: paymentMethod,

    // Catatan pesanan
    notes: document.getElementById("orderNotes")?.value || "",

    // Total pesanan
    totals: {
      subtotal: cart.reduce((sum, item) => {
        const price = typeof item.price === "number" ? item.price : Number.parseFloat(item.price) || 0
        const quantity = Number.parseInt(item.quantity) || 1
        return sum + price * quantity
      }, 0),
      shipping: 15000,
      total: 0,
    },

    // Timestamp
    orderDate: new Date().toISOString(),
    orderId: "NORA-" + Date.now(),
    status: orderStatus, // Status berdasarkan metode pembayaran
  }

  orderData.totals.total = orderData.totals.subtotal + orderData.totals.shipping

  return orderData
}

// Fungsi untuk memproses pesanan
function processOrder() {
  // Validasi form
  if (!validateForm()) {
    return
  }

  // Tampilkan notifikasi sukses segera
  showNotification("Pesanan sedang diproses!", "success")

  // Tampilkan loading
  showLoading(true)

  // Kumpulkan data pesanan
  const orderData = collectOrderData()

  // Simulasi proses pembayaran (dalam implementasi nyata, ini akan mengirim ke server)
  setTimeout(() => {
    try {
      // Simpan pesanan ke localStorage (untuk demo)
      const orders = JSON.parse(localStorage.getItem("orders") || "[]")
      orders.push(orderData)
      localStorage.setItem("orders", JSON.stringify(orders))

      // Bersihkan keranjang
      localStorage.removeItem("cart")

      // Sembunyikan loading
      showLoading(false)

      // Tampilkan notifikasi sukses berdasarkan metode pembayaran
      const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || "bank-transfer"
      let successMessage = "Pesanan berhasil dibuat! Anda akan diarahkan ke halaman riwayat pesanan."

      if (paymentMethod === "bank-transfer") {
        successMessage =
          "Pesanan berhasil dibuat! Pembayaran transfer bank telah dikonfirmasi. Pesanan sedang diproses."
      } else if (paymentMethod === "e-wallet") {
        successMessage = "Pesanan berhasil dibuat! Pembayaran e-wallet berhasil. Pesanan sedang diproses."
      } else if (paymentMethod === "cod") {
        successMessage = "Pesanan berhasil dibuat! Silakan siapkan pembayaran saat barang diterima."
      }

      showNotification(successMessage, "success")

      // Redirect ke halaman riwayat pesanan
      setTimeout(() => {
        window.location.href = "../riwayat/riwayat.html"
      }, 2000)
    } catch (error) {
      console.error("Error processing order:", error)
      showLoading(false)
      showNotification("Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.", "error")
    }
  }, 2000) // Simulasi delay 2 detik
}

// Fungsi untuk menampilkan/menyembunyikan loading
function showLoading(show) {
  const loadingOverlay = document.getElementById("loadingOverlay")
  if (loadingOverlay) {
    if (show) {
      loadingOverlay.classList.add("show")
    } else {
      loadingOverlay.classList.remove("show")
    }
  }
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = "success") {
  // Hapus notifikasi yang ada
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Buat notifikasi baru
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === "error" ? "fa-exclamation-circle" : "fa-check-circle"}"></i>
      <span>${message}</span>
    </div>
  `

  // Tambahkan ke body
  document.body.appendChild(notification)

  // Tampilkan notifikasi
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Sembunyikan notifikasi setelah 5 detik
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 5000)
}

// Event listener ketika halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  // Load dan tampilkan item pesanan
  displayOrderItems()
  updateCartCount()

  // Setup event listener untuk tombol buat pesanan
  const placeOrderBtn = document.getElementById("placeOrderBtn")
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", processOrder)
  }

  // Setup event listener untuk perubahan metode pembayaran
  const paymentMethods = document.querySelectorAll('input[name="payment"]')
  paymentMethods.forEach((method) => {
    method.addEventListener("change", () => {
      // Bisa ditambahkan logika khusus untuk setiap metode pembayaran
      console.log("Payment method changed to:", method.value)
    })
  })

  // Auto-fill form jika ada data tersimpan (opsional)
  const savedCustomerData = localStorage.getItem("customerData")
  if (savedCustomerData) {
    try {
      const customerData = JSON.parse(savedCustomerData)
      Object.keys(customerData).forEach((key) => {
        const field = document.getElementById(key)
        if (field) {
          field.value = customerData[key]
        }
      })
    } catch (error) {
      console.error("Error loading saved customer data:", error)
    }
  }

  // Save customer data saat form berubah (opsional)
  const formFields = ["firstName", "lastName", "email", "phone", "address", "city", "province", "postalCode"]
  formFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId)
    if (field) {
      field.addEventListener("blur", () => {
        const customerData = {}
        formFields.forEach((id) => {
          const f = document.getElementById(id)
          if (f) customerData[id] = f.value
        })
        localStorage.setItem("customerData", JSON.stringify(customerData))
      })
    }
  })
})

// Export functions untuk akses global
window.processOrder = processOrder
window.showNotification = showNotification
window.formatPrice = formatPrice
