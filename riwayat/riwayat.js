// 📋 RIWAYAT PESANAN JAVASCRIPT - Fungsi untuk halaman riwayat pesanan

// Fungsi untuk memuat data pesanan dari localStorage
function loadOrdersData() {
  let orders = []
  try {
    const storedOrders = localStorage.getItem("orders")
    if (storedOrders) {
      orders = JSON.parse(storedOrders)
    }
  } catch (error) {
    console.error("Error loading orders:", error)
    showNotification("Terjadi kesalahan saat memuat data pesanan", "error")
  }
  return orders
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

// Fungsi untuk format tanggal
function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  return new Date(dateString).toLocaleDateString("id-ID", options)
}

// Fungsi untuk mendapatkan label status
function getStatusLabel(status) {
  switch (status) {
    case "pending":
      return "Menunggu Pembayaran"
    case "processing":
      return "Diproses"
    case "completed":
      return "Selesai"
    case "cancelled":
      return "Dibatalkan"
    default:
      return "Menunggu Pembayaran"
  }
}

// Fungsi untuk mendapatkan icon metode pembayaran
function getPaymentIcon(method) {
  switch (method) {
    case "bank-transfer":
      return "fa-university"
    case "e-wallet":
      return "fa-mobile-alt"
    case "cod":
      return "fa-money-bill-wave"
    default:
      return "fa-credit-card"
  }
}

// Fungsi untuk mendapatkan label metode pembayaran
function getPaymentLabel(method) {
  switch (method) {
    case "bank-transfer":
      return "Transfer Bank"
    case "e-wallet":
      return "E-Wallet"
    case "cod":
      return "Bayar di Tempat (COD)"
    default:
      return "Metode Pembayaran"
  }
}

// Fungsi untuk menampilkan daftar pesanan
function displayOrders(orders = null) {
  if (orders === null) {
    orders = loadOrdersData()
  }

  const ordersListContainer = document.getElementById("ordersList")
  const emptyOrdersMessage = document.getElementById("emptyOrdersMessage")

  if (!ordersListContainer) return

  // Jika tidak ada pesanan, tampilkan pesan
  if (orders.length === 0) {
    ordersListContainer.innerHTML = ""
    if (emptyOrdersMessage) emptyOrdersMessage.style.display = "flex"
    return
  }

  // Sembunyikan pesan kosong
  if (emptyOrdersMessage) emptyOrdersMessage.style.display = "none"

  // Bersihkan container
  ordersListContainer.innerHTML = ""

  // Urutkan pesanan dari yang terbaru
  orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))

  // Tambahkan setiap pesanan ke daftar
  orders.forEach((order) => {
    // Pastikan status ada, jika tidak gunakan default
    const status = order.status || "pending"

    // Hitung jumlah item
    const itemCount = order.items.reduce((sum, item) => sum + (Number.parseInt(item.quantity) || 1), 0)

    // Ambil gambar item pertama untuk preview
    const firstItemImage = order.items[0]?.image || "/placeholder.svg?height=50&width=50"

    // Buat elemen pesanan
    const orderCard = document.createElement("div")
    orderCard.className = "order-card"

    orderCard.innerHTML = `
      <div class="order-header">
        <div class="order-id">${order.orderId}</div>
        <div class="order-date">${formatDate(order.orderDate)}</div>
        <div class="order-status ${status}">${getStatusLabel(status)}</div>
      </div>
      <div class="order-body">
        <div class="order-summary">
          <div class="order-items-preview">
            <img src="${firstItemImage}" alt="Item Preview" class="order-item-image">
            ${itemCount > 1 ? `<div class="order-item-count">+${itemCount - 1}</div>` : ""}
          </div>
          <div class="order-total">${formatPrice(order.totals.total)}</div>
        </div>
      </div>
      <div class="order-footer">
        <div class="order-payment-method">
          <i class="fas ${getPaymentIcon(order.paymentMethod)}"></i>
          <span>${getPaymentLabel(order.paymentMethod)}</span>
        </div>
        <div class="order-actions">
          <button class="btn-order-detail" data-order-id="${order.orderId}">
            <i class="fas fa-eye"></i> Detail
          </button>
          <button class="btn-track-order" data-order-id="${order.orderId}">
            <i class="fas fa-truck"></i> Lacak
          </button>
        </div>
      </div>
    `

    ordersListContainer.appendChild(orderCard)

    // Tambahkan event listener untuk tombol detail
    const detailBtn = orderCard.querySelector(".btn-order-detail")
    if (detailBtn) {
      detailBtn.addEventListener("click", () => {
        showOrderDetail(order)
      })
    }

    // Tambahkan event listener untuk tombol lacak
    const trackBtn = orderCard.querySelector(".btn-track-order")
    if (trackBtn) {
      trackBtn.addEventListener("click", () => {
        showNotification("Fitur pelacakan pesanan akan segera hadir!", "info")
      })
    }
  })
}

// Fungsi untuk menampilkan detail pesanan
function showOrderDetail(order) {
  const modal = document.getElementById("orderDetailModal")
  const modalContent = document.getElementById("orderDetailContent")

  if (!modal || !modalContent) return

  // Bersihkan konten modal
  modalContent.innerHTML = ""

  // Buat konten detail pesanan
  const orderDetailContent = document.createElement("div")

  // Informasi pesanan
  orderDetailContent.innerHTML = `
    <div class="order-detail-section">
      <h3><i class="fas fa-info-circle"></i> Informasi Pesanan</h3>
      <div class="order-info-grid">
        <div class="order-info-item">
          <div class="order-info-label">ID Pesanan</div>
          <div class="order-info-value">${order.orderId}</div>
        </div>
        <div class="order-info-item">
          <div class="order-info-label">Tanggal Pesanan</div>
          <div class="order-info-value">${formatDate(order.orderDate)}</div>
        </div>
        <div class="order-info-item">
          <div class="order-info-label">Status</div>
          <div class="order-info-value">
            <span class="order-status ${order.status || "pending"}">${getStatusLabel(order.status || "pending")}</span>
          </div>
        </div>
        <div class="order-info-item">
          <div class="order-info-label">Metode Pembayaran</div>
          <div class="order-info-value">
            <i class="fas ${getPaymentIcon(order.paymentMethod)}"></i>
            ${getPaymentLabel(order.paymentMethod)}
          </div>
        </div>
      </div>
    </div>
    
    <div class="order-detail-section">
      <h3><i class="fas fa-user"></i> Informasi Pembeli</h3>
      <div class="order-info-grid">
        <div class="order-info-item">
          <div class="order-info-label">Nama</div>
          <div class="order-info-value">${order.customer.firstName} ${order.customer.lastName}</div>
        </div>
        <div class="order-info-item">
          <div class="order-info-label">Email</div>
          <div class="order-info-value">${order.customer.email}</div>
        </div>
        <div class="order-info-item">
          <div class="order-info-label">Telepon</div>
          <div class="order-info-value">${order.customer.phone}</div>
        </div>
      </div>
    </div>
    
    <div class="order-detail-section">
      <h3><i class="fas fa-truck"></i> Alamat Pengiriman</h3>
      <div class="order-info-grid">
        <div class="order-info-item">
          <div class="order-info-label">Alamat</div>
          <div class="order-info-value">${order.shipping.address}</div>
        </div>
        <div class="order-info-item">
          <div class="order-info-label">Kota</div>
          <div class="order-info-value">${order.shipping.city}</div>
        </div>
        <div class="order-info-item">
          <div class="order-info-label">Provinsi</div>
          <div class="order-info-value">${order.shipping.province}</div>
        </div>
        <div class="order-info-item">
          <div class="order-info-label">Kode Pos</div>
          <div class="order-info-value">${order.shipping.postalCode}</div>
        </div>
      </div>
    </div>
  `

  // Item pesanan
  let itemsHTML = `
    <div class="order-detail-section">
      <h3><i class="fas fa-shopping-bag"></i> Item Pesanan</h3>
      <div class="order-items-list">
  `

  order.items.forEach((item) => {
    const price = typeof item.price === "number" ? item.price : Number.parseFloat(item.price) || 0
    const quantity = Number.parseInt(item.quantity) || 1
    const subtotal = price * quantity

    itemsHTML += `
      <div class="order-item-detail">
        <img src="${item.image}" alt="${item.name}" class="order-item-detail-image">
        <div class="order-item-detail-info">
          <div class="order-item-detail-name">${item.name}</div>
          <div class="order-item-detail-meta">Warna: ${item.color}, Ukuran: ${item.size}</div>
          <div class="order-item-detail-meta">Jumlah: ${quantity} x ${formatPrice(price)}</div>
        </div>
        <div class="order-item-detail-price">${formatPrice(subtotal)}</div>
      </div>
    `
  })

  itemsHTML += `
      </div>
    </div>
  `

  orderDetailContent.innerHTML += itemsHTML

  // Ringkasan total
  orderDetailContent.innerHTML += `
    <div class="order-detail-section">
      <h3><i class="fas fa-receipt"></i> Ringkasan Pembayaran</h3>
      <table class="order-totals-table">
        <tr>
          <td>Subtotal</td>
          <td>${formatPrice(order.totals.subtotal)}</td>
        </tr>
        <tr>
          <td>Pengiriman</td>
          <td>${formatPrice(order.totals.shipping)}</td>
        </tr>
        <tr class="order-total-row">
          <td>Total</td>
          <td>${formatPrice(order.totals.total)}</td>
        </tr>
      </table>
    </div>
  `

  // Catatan pesanan (jika ada)
  if (order.notes) {
    orderDetailContent.innerHTML += `
      <div class="order-detail-section">
        <h3><i class="fas fa-sticky-note"></i> Catatan Pesanan</h3>
        <p>${order.notes}</p>
      </div>
    `
  }

  // Tambahkan konten ke modal
  modalContent.appendChild(orderDetailContent)

  // Tampilkan modal
  modal.classList.add("show")
}

// Fungsi untuk filter pesanan
function filterOrders() {
  const statusFilter = document.getElementById("statusFilter").value
  const dateFilter = document.getElementById("dateFilter").value
  const searchQuery = document.getElementById("orderSearch").value.toLowerCase()

  let orders = loadOrdersData()

  // Filter berdasarkan status
  if (statusFilter !== "all") {
    orders = orders.filter((order) => (order.status || "pending") === statusFilter)
  }

  // Filter berdasarkan tanggal
  if (dateFilter !== "all") {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const yearStart = new Date(now.getFullYear(), 0, 1)

    orders = orders.filter((order) => {
      const orderDate = new Date(order.orderDate)

      switch (dateFilter) {
        case "today":
          return orderDate >= today
        case "week":
          return orderDate >= weekStart
        case "month":
          return orderDate >= monthStart
        case "year":
          return orderDate >= yearStart
        default:
          return true
      }
    })
  }

  // Filter berdasarkan pencarian
  if (searchQuery) {
    orders = orders.filter((order) => {
      // Cari di ID pesanan
      if (order.orderId.toLowerCase().includes(searchQuery)) return true

      // Cari di nama produk
      for (const item of order.items) {
        if (item.name.toLowerCase().includes(searchQuery)) return true
      }

      return false
    })
  }

  // Tampilkan hasil filter
  displayOrders(orders)
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

// Fungsi untuk update jumlah item di keranjang
function updateCartCount() {
  const cartCount = document.getElementById("cartCount")
  if (!cartCount) return

  let cart = []
  try {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      cart = JSON.parse(storedCart)
    }
  } catch (error) {
    console.error("Error loading cart:", error)
  }

  const totalItems = cart.reduce((sum, item) => sum + (Number.parseInt(item.quantity) || 1), 0)
  cartCount.textContent = totalItems
}

// Event listener ketika halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  // Load dan tampilkan pesanan
  displayOrders()
  updateCartCount()

  // Setup event listener untuk filter
  const statusFilter = document.getElementById("statusFilter")
  const dateFilter = document.getElementById("dateFilter")
  const searchInput = document.getElementById("orderSearch")
  const searchBtn = document.getElementById("searchBtn")

  if (statusFilter) {
    statusFilter.addEventListener("change", filterOrders)
  }

  if (dateFilter) {
    dateFilter.addEventListener("change", filterOrders)
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", filterOrders)
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        filterOrders()
      }
    })
  }

  // Setup event listener untuk modal
  const modal = document.getElementById("orderDetailModal")
  const closeModalBtns = document.querySelectorAll(".close-modal, .btn-close-modal")

  if (modal) {
    // Tutup modal ketika klik di luar konten
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show")
      }
    })

    // Tutup modal dengan tombol close
    closeModalBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        modal.classList.remove("show")
      })
    })
  }

  // Tambahkan beberapa pesanan dummy jika tidak ada pesanan
  const orders = loadOrdersData()
  if (orders.length === 0) {
    // Tambahkan data dummy untuk demo
    addDummyOrders()
  }
})

/// Fungsi untuk menambahkan pesanan dummy
function addDummyOrders() {
  const dummyOrders = [
    {
      orderId: "NORA-1686123456789",
      orderDate: "2023-06-07T10:30:00",
      productName: "Produk Contoh A",
      quantity: 2,
      totalPrice: 50000
    },
    {
      orderId: "NORA-1686123456790",
      orderDate: "2023-06-08T14:45:00",
      productName: "Produk Contoh B",
      quantity: 1,
      totalPrice: 75000
    }
  ];

  // Simpan ke localStorage (opsional)
  localStorage.setItem("orders", JSON.stringify(dummyOrders));
}
