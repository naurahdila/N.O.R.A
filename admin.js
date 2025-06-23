// Global Variables
let currentTab = "dashboard"
let currentEditingOrder = null
let currentEditingProduct = null
let currentEditingArticle = null
let currentEditingUser = null
let currentEditingTransaction = null

// DataTables instances
let transactionsTable = null
let productsTable = null
let articlesTable = null
let usersTable = null
//let usersTable = null // Removed duplicate declaration

// Theme management
let currentTheme = "light"

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme()
  initializeDashboard()
  setupEventListeners()
  loadDashboardData()

  // Add dummy data if needed
  setTimeout(() => {
    addDummyDataIfNeeded()
  }, 1000)
})

// Theme Functions
function initializeTheme() {
  // Check for saved theme preference or default to 'light'
  const savedTheme = localStorage.getItem("theme") || "light"
  setTheme(savedTheme)
}

function setTheme(theme) {
  currentTheme = theme
  const html = document.documentElement

  if (theme === "dark") {
    html.classList.remove("light-mode")
    html.classList.add("dark-mode")
  } else {
    html.classList.remove("dark-mode")
    html.classList.add("light-mode")
  }

  // Save theme preference
  localStorage.setItem("theme", theme)
}

function toggleTheme() {
  const newTheme = currentTheme === "light" ? "dark" : "light"
  setTheme(newTheme)
  showNotification(`Switched to ${newTheme} mode`, "info")
}

// Setup Event Listeners
function setupEventListeners() {
  // Theme toggle
  const themeToggleBtn = document.getElementById("themeToggleBtn")
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme)
  }

  // Sidebar toggle
  const sidebarToggle = document.getElementById("sidebarToggle")
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      const sidebar = document.getElementById("sidebar")
      sidebar.classList.toggle("collapsed")
    })
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const mobileOverlay = document.getElementById("mobileOverlay")
  const sidebar = document.getElementById("sidebar")

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("mobile-open")
      mobileOverlay.classList.toggle("show")
    })
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", () => {
      sidebar.classList.remove("mobile-open")
      mobileOverlay.classList.remove("show")
    })
  }

  // Navigation items
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", function () {
      const page = this.getAttribute("data-page")
      if (page) {
        switchPage(page)
        // Close mobile menu
        sidebar.classList.remove("mobile-open")
        mobileOverlay.classList.remove("show")
      }
    })
  })

  // Modal close events
  document.querySelectorAll(".close-modal, .btn-close-modal").forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = this.closest(".modal")
      if (modal) {
        closeModal(modal.id)
      }
    })
  })

  // Update status button
  const updateStatusBtn = document.getElementById("updateStatusBtn")
  if (updateStatusBtn) {
    updateStatusBtn.addEventListener("click", () => {
      if (currentEditingOrder) {
        document.getElementById("newOrderStatus").value = currentEditingOrder.status || "pending"
        openModal("statusUpdateModal")
      }
    })
  }

  // Click outside modal to close
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeModal(e.target.id)
    }
  })

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("mobile-open")
      mobileOverlay.classList.remove("show")
    }
  })

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + D for theme toggle
    if ((e.ctrlKey || e.metaKey) && e.key === "d") {
      e.preventDefault()
      toggleTheme()
    }

    // Escape to close modals
    if (e.key === "Escape") {
      const openModal = document.querySelector(".modal.show")
      if (openModal) {
        closeModal(openModal.id)
      }
    }
  })
}

// Initialize Dashboard
function initializeDashboard() {
  switchPage("dashboard")
}

// Page Switching Function
function switchPage(pageName) {
  // Update navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active")
  })
  const activeNavItem = document.querySelector(`[data-page="${pageName}"]`)
  if (activeNavItem) {
    activeNavItem.classList.add("active")
  }

  // Update content
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active")
  })
  const activePage = document.getElementById(pageName)
  if (activePage) {
    activePage.classList.add("active")
  }

  // Update page title
  const titles = {
    dashboard: "Dashboard",
    transactions: "Riwayat Transaksi",
    products: "Kelola Produk",
    articles: "Kelola Artikel",
    users: "Kelola Pengguna",
    website: "Pengaturan Website",
  }

  const pageTitle = document.getElementById("pageTitle")
  const breadcrumbText = document.getElementById("breadcrumbText")

  if (pageTitle) pageTitle.textContent = titles[pageName] || "Dashboard"
  if (breadcrumbText) breadcrumbText.textContent = titles[pageName] || "Overview"

  currentTab = pageName

  // Load data based on page
  switch (pageName) {
    case "dashboard":
      loadDashboardData()
      break
    case "transactions":
      setTimeout(() => {
        initializeDataTables()
        loadAllTransactions()
      }, 100)
      break
    case "products":
      setTimeout(() => {
        initializeDataTables()
        loadProducts()
      }, 100)
      break
    case "articles":
      setTimeout(() => {
        initializeDataTables()
        loadArticles()
      }, 100)
      break
    case "users":
      setTimeout(() => {
        initializeDataTables()
        loadUsers()
      }, 100)
      break
  }
}

// Data Management Functions
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

function saveOrdersData(orders) {
  try {
    localStorage.setItem("orders", JSON.stringify(orders))
  } catch (error) {
    console.error("Error saving orders:", error)
    showNotification("Terjadi kesalahan saat menyimpan data", "error")
  }
}

function loadProductsData() {
  let products = []
  try {
    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      products = JSON.parse(storedProducts)
    } else {
      // Default products
      products = [
        {
          id: 1,
          name: "Gamis Zahra",
          category: "gamis",
          price: 213000,
          stock: 25,
          image: "/placeholder.svg?height=200&width=200",
          description: "Gamis elegan dengan bahan berkualitas tinggi",
          status: "active",
        },
        {
          id: 2,
          name: "Hijab Pashmina",
          category: "hijab",
          price: 50000,
          stock: 50,
          image: "/placeholder.svg?height=200&width=200",
          description: "Hijab pashmina lembut dan nyaman",
          status: "active",
        },
        {
          id: 3,
          name: "Set Gamis & Hijab Aisha",
          category: "set",
          price: 320000,
          stock: 15,
          image: "/placeholder.svg?height=200&width=200",
          description: "Set lengkap gamis dan hijab matching",
          status: "active",
        },
        {
          id: 4,
          name: "Gamis Muslimah Elegant",
          category: "gamis",
          price: 275000,
          stock: 30,
          image: "/placeholder.svg?height=200&width=200",
          description: "Gamis muslimah dengan desain elegant dan modern",
          status: "active",
        },
        {
          id: 5,
          name: "Hijab Segi Empat Premium",
          category: "hijab",
          price: 75000,
          stock: 40,
          image: "/placeholder.svg?height=200&width=200",
          description: "Hijab segi empat dengan bahan premium",
          status: "active",
        },
      ]
      localStorage.setItem("products", JSON.stringify(products))
    }
  } catch (error) {
    console.error("Error loading products:", error)
  }
  return products
}

function saveProductsData(products) {
  try {
    localStorage.setItem("products", JSON.stringify(products))
  } catch (error) {
    console.error("Error saving products:", error)
    showNotification("Terjadi kesalahan saat menyimpan produk", "error")
  }
}

function loadArticlesData() {
  let articles = []
  try {
    const storedArticles = localStorage.getItem("articles")
    if (storedArticles) {
      articles = JSON.parse(storedArticles)
    } else {
      // Default articles
      articles = [
        {
          id: 1,
          title: "Tips Merawat Hijab Agar Awet",
          category: "Tips & Trik",
          author: "Admin",
          date: new Date().toISOString(),
          status: "published",
          content:
            "Panduan lengkap cara merawat hijab agar tetap awet dan indah. Mulai dari cara mencuci yang benar, menyimpan, hingga tips menghilangkan noda membandel.",
          excerpt: "Panduan lengkap cara merawat hijab agar tetap awet dan indah...",
        },
        {
          id: 2,
          title: "Tren Fashion Muslim 2024",
          category: "Fashion",
          author: "Admin",
          date: new Date().toISOString(),
          status: "published",
          content:
            "Fashion muslim terus berkembang dengan tren-tren baru yang menarik. Simak tren fashion muslim terbaru yang akan populer di tahun 2024.",
          excerpt: "Simak tren fashion muslim terbaru yang akan populer di tahun 2024...",
        },
        {
          id: 3,
          title: "Cara Memilih Gamis Sesuai Bentuk Tubuh",
          category: "Tips & Trik",
          author: "Admin",
          date: new Date().toISOString(),
          status: "draft",
          content:
            "Setiap bentuk tubuh memiliki model gamis yang paling cocok. Pelajari cara memilih gamis yang tepat untuk bentuk tubuh Anda.",
          excerpt: "Pelajari cara memilih gamis yang tepat untuk bentuk tubuh Anda...",
        },
      ]
      localStorage.setItem("articles", JSON.stringify(articles))
    }
  } catch (error) {
    console.error("Error loading articles:", error)
  }
  return articles
}

function saveArticlesData(articles) {
  try {
    localStorage.setItem("articles", JSON.stringify(articles))
  } catch (error) {
    console.error("Error saving articles:", error)
    showNotification("Terjadi kesalahan saat menyimpan artikel", "error")
  }
}

function loadUsersData() {
  let users = []
  try {
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      users = JSON.parse(storedUsers)
    } else {
      // Default users
      users = [
        {
          id: 1,
          name: "David Grey",
          email: "david@nora.com",
          role: "Administrator",
          status: "Active",
          joined: "2023-01-15",
          password: "admin123",
        },
        {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah@nora.com",
          role: "Editor",
          status: "Active",
          joined: "2023-03-20",
          password: "editor123",
        },
        {
          id: 3,
          name: "Mike Wilson",
          email: "mike@nora.com",
          role: "Customer",
          status: "Inactive",
          joined: "2023-05-10",
          password: "customer123",
        },
        {
          id: 4,
          name: "Siti Aminah",
          email: "siti@email.com",
          role: "Customer",
          status: "Active",
          joined: "2023-06-01",
          password: "siti123",
        },
        {
          id: 5,
          name: "Fatimah Zahra",
          email: "fatimah@email.com",
          role: "Customer",
          status: "Active",
          joined: "2023-06-02",
          password: "fatimah123",
        },
      ]
      localStorage.setItem("users", JSON.stringify(users))
    }
  } catch (error) {
    console.error("Error loading users:", error)
  }
  return users
}

function saveUsersData(users) {
  try {
    localStorage.setItem("users", JSON.stringify(users))
  } catch (error) {
    console.error("Error saving users:", error)
    showNotification("Terjadi kesalahan saat menyimpan user", "error")
  }
}

// Utility Functions
function formatPrice(price) {
  const numPrice = typeof price === "number" ? price : Number.parseFloat(price) || 0
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numPrice)
}

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

function getStatusClass(status) {
  switch (status) {
    case "pending":
      return "status-pending"
    case "processing":
      return "status-processing"
    case "completed":
      return "status-completed"
    case "cancelled":
      return "status-cancelled"
    default:
      return "status-pending"
  }
}

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

function getCategoryLabel(category) {
  switch (category) {
    case "gamis":
      return "Gamis"
    case "hijab":
      return "Hijab"
    case "set":
      return "Set Gamis & Hijab"
    default:
      return category
  }
}

function generateOrderId() {
  const prefix = "ORD"
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0")
  return `${prefix}-${timestamp}${random}`
}

// Dashboard Functions
function loadDashboardData() {
  const orders = loadOrdersData()
  const products = loadProductsData()
  const users = loadUsersData()

  // Calculate stats
  const totalSales = orders.reduce((sum, order) => sum + (order.totals?.total || 0), 0)
  const totalOrders = orders.length
  const totalProducts = products.length
  const activeUsers = users.filter((user) => user.status === "Active").length

  // Update stats display
  const weeklySalesElement = document.getElementById("weeklySales")
  const weeklyOrdersElement = document.getElementById("weeklyOrders")
  const visitorsOnlineElement = document.getElementById("visitorsOnline")

  if (weeklySalesElement) weeklySalesElement.textContent = formatPrice(totalSales)
  if (weeklyOrdersElement) weeklyOrdersElement.textContent = totalOrders
  if (visitorsOnlineElement) visitorsOnlineElement.textContent = activeUsers

  // Load recent orders
  loadRecentOrders(orders)
}

function loadRecentOrders(orders = null) {
  if (orders === null) {
    orders = loadOrdersData()
  }

  const recentOrdersTable = document.getElementById("recentTransactionsTable")
  if (!recentOrdersTable) return

  recentOrdersTable.innerHTML = ""

  if (orders.length === 0) {
    recentOrdersTable.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: var(--gray-500);">
          <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
          Tidak ada transaksi
        </td>
      </tr>
    `
    return
  }

  // Sort and take recent 5 orders
  orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
  const recentOrders = orders.slice(0, 5)

  recentOrders.forEach((order) => {
    const status = order.status || "pending"
    const customerName = order.customer
      ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim()
      : "N/A"

    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${order.orderId}</td>
      <td>${formatDate(order.orderDate)}</td>
      <td>${customerName}</td>
      <td>${formatPrice(order.totals?.total || 0)}</td>
      <td><span class="status-badge ${getStatusClass(status)}">${getStatusLabel(status)}</span></td>
      <td>
        <button class="btn-secondary btn-sm view-order-btn" data-order-id="${order.orderId}" title="Lihat Detail">
          <i class="fas fa-eye"></i>
        </button>
      </td>
    `
    recentOrdersTable.appendChild(row)
  })

  addOrderDetailEventListeners()
}

// Initialize DataTables
function initializeDataTables() {
  // Initialize Transactions DataTable
  if (typeof jQuery !== "undefined" && jQuery.fn.DataTable.isDataTable("#transactionsDataTable")) {
    jQuery("#transactionsDataTable").DataTable().destroy()
  }

  if (typeof jQuery !== "undefined") {
    transactionsTable = jQuery("#transactionsDataTable").DataTable({
      responsive: true,
      pageLength: 25,
      order: [[1, "desc"]], // Sort by date descending
      dom: "Bfrtip",
      buttons: [
        {
          extend: "excel",
          text: '<i class="fas fa-file-excel"></i> Excel',
          className: "btn btn-success btn-sm",
        },
        {
          extend: "pdf",
          text: '<i class="fas fa-file-pdf"></i> PDF',
          className: "btn btn-danger btn-sm",
        },
        {
          extend: "print",
          text: '<i class="fas fa-print"></i> Print',
          className: "btn btn-secondary btn-sm",
        },
      ],
      language: {
        search: "Cari:",
        lengthMenu: "Tampilkan _MENU_ data per halaman",
        info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
        infoEmpty: "Menampilkan 0 sampai 0 dari 0 data",
        infoFiltered: "(difilter dari _MAX_ total data)",
        paginate: {
          first: "Pertama",
          last: "Terakhir",
          next: "Selanjutnya",
          previous: "Sebelumnya",
        },
        emptyTable: "Tidak ada data transaksi",
        zeroRecords: "Tidak ada data yang cocok",
      },
    })

    // Initialize Products DataTable
    if (jQuery.fn.DataTable.isDataTable("#productsDataTable")) {
      jQuery("#productsDataTable").DataTable().destroy()
    }

    productsTable = jQuery("#productsDataTable").DataTable({
      responsive: true,
      pageLength: 25,
      order: [[1, "asc"]], // Sort by name ascending
      columnDefs: [
        { orderable: false, targets: [0, 6] }, // Disable sorting for image and actions
      ],
      language: {
        search: "Cari:",
        lengthMenu: "Tampilkan _MENU_ produk per halaman",
        info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ produk",
        infoEmpty: "Menampilkan 0 sampai 0 dari 0 produk",
        infoFiltered: "(difilter dari _MAX_ total produk)",
        paginate: {
          first: "Pertama",
          last: "Terakhir",
          next: "Selanjutnya",
          previous: "Sebelumnya",
        },
        emptyTable: "Tidak ada data produk",
        zeroRecords: "Tidak ada produk yang cocok",
      },
    })

    // Initialize Articles DataTable
    if (jQuery.fn.DataTable.isDataTable("#articlesDataTable")) {
      jQuery("#articlesDataTable").DataTable().destroy()
    }

    articlesTable = jQuery("#articlesDataTable").DataTable({
      responsive: true,
      pageLength: 25,
      order: [[3, "desc"]], // Sort by date descending
      columnDefs: [
        { orderable: false, targets: [5] }, // Disable sorting for actions
      ],
      language: {
        search: "Cari:",
        lengthMenu: "Tampilkan _MENU_ artikel per halaman",
        info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ artikel",
        infoEmpty: "Menampilkan 0 sampai 0 dari 0 artikel",
        infoFiltered: "(difilter dari _MAX_ total artikel)",
        paginate: {
          first: "Pertama",
          last: "Terakhir",
          next: "Selanjutnya",
          previous: "Sebelumnya",
        },
        emptyTable: "Tidak ada data artikel",
        zeroRecords: "Tidak ada artikel yang cocok",
      },
    })

    // Initialize Users DataTable
    if (jQuery.fn.DataTable.isDataTable("#usersDataTable")) {
      jQuery("#usersDataTable").DataTable().destroy()
    }

    usersTable = jQuery("#usersDataTable").DataTable({
      responsive: true,
      pageLength: 25,
      order: [[1, "asc"]], // Sort by name ascending
      columnDefs: [
        { orderable: false, targets: [0, 6] }, // Disable sorting for avatar and actions
      ],
      language: {
        search: "Cari:",
        lengthMenu: "Tampilkan _MENU_ user per halaman",
        info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ user",
        infoEmpty: "Menampilkan 0 sampai 0 dari 0 user",
        infoFiltered: "(difilter dari _MAX_ total user)",
        paginate: {
          first: "Pertama",
          last: "Terakhir",
          next: "Selanjutnya",
          previous: "Sebelumnya",
        },
        emptyTable: "Tidak ada data user",
        zeroRecords: "Tidak ada user yang cocok",
      },
    })
  }
}

// Transaction Functions with DataTable
function loadAllTransactions() {
  const orders = loadOrdersData()

  if (transactionsTable) {
    transactionsTable.clear()

    orders.forEach((order) => {
      const status = order.status || "pending"
      const customerName = order.customer
        ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim()
        : "N/A"
      const customerEmail = order.customer?.email || "N/A"

      const statusDropdown = `
        <select class="status-dropdown ${status}" onchange="updateOrderStatusQuick('${order.orderId}', this.value)">
          <option value="pending" ${status === "pending" ? "selected" : ""}>Menunggu Pembayaran</option>
          <option value="processing" ${status === "processing" ? "selected" : ""}>Diproses</option>
          <option value="completed" ${status === "completed" ? "selected" : ""}>Selesai</option>
          <option value="cancelled" ${status === "cancelled" ? "selected" : ""}>Dibatalkan</option>
        </select>
      `

      const actions = `
        <div class="action-buttons">
          <button class="action-btn view" onclick="showOrderDetail('${order.orderId}')" title="Lihat Detail">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit" onclick="editTransaction('${order.orderId}')" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="deleteOrder('${order.orderId}')" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `

      transactionsTable.row.add([
        order.orderId,
        formatDate(order.orderDate),
        customerName,
        customerEmail,
        formatPrice(order.totals?.total || 0),
        `<i class="fas ${getPaymentIcon(order.paymentMethod)}"></i> ${getPaymentLabel(order.paymentMethod)}`,
        statusDropdown,
        actions,
      ])
    })

    transactionsTable.draw()
  }

  // Render mobile version
  renderMobileTransactions()
}

// Product Functions with DataTable
function loadProducts() {
  const products = loadProductsData()

  if (productsTable) {
    productsTable.clear()

    products.forEach((product) => {
      const actions = `
        <div class="action-buttons">
          <button class="action-btn edit" onclick="editProduct(${product.id})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="deleteProduct(${product.id})" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `

      productsTable.row.add([
        `<img src="${product.image}" alt="${product.name}" class="product-image-table">`,
        product.name,
        getCategoryLabel(product.category),
        formatPrice(product.price),
        product.stock,
        `<span class="status-badge ${product.status === "active" ? "status-completed" : "status-cancelled"}">${product.status === "active" ? "Aktif" : "Tidak Aktif"}</span>`,
        actions,
      ])
    })

    productsTable.draw()
  }

  // Render mobile version
  renderMobileProducts()
}

// Article Functions with DataTable
function loadArticles() {
  const articles = loadArticlesData()

  if (articlesTable) {
    articlesTable.clear()

    articles.forEach((article) => {
      const actions = `
        <div class="action-buttons">
          <button class="action-btn edit" onclick="editArticle(${article.id})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="deleteArticle(${article.id})" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `

      articlesTable.row.add([
        article.title,
        article.category,
        article.author,
        formatDate(article.date),
        `<span class="status-badge ${article.status === "published" ? "status-completed" : "status-pending"}">${article.status === "published" ? "Published" : "Draft"}</span>`,
        actions,
      ])
    })

    articlesTable.draw()
  }

  // Render mobile version
  renderMobileArticles()
}

// User Functions with DataTable
function loadUsers() {
  const users = loadUsersData()

  if (usersTable) {
    usersTable.clear()

    users.forEach((user) => {
      const actions = `
        <div class="action-buttons">
          <button class="action-btn edit" onclick="editUser(${user.id})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="deleteUser(${user.id})" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `

      usersTable.row.add([
        `<div class="user-avatar-table">${user.name.charAt(0)}</div>`,
        user.name,
        user.email,
        user.role,
        `<span class="status-badge ${user.status === "Active" ? "status-completed" : "status-cancelled"}">${user.status}</span>`,
        formatDate(user.joined),
        actions,
      ])
    })

    usersTable.draw()
  }

  // Render mobile version
  renderMobileUsers()
}

// Export functions
function exportTransactions() {
  if (transactionsTable) {
    // Trigger Excel export
    transactionsTable.button(".buttons-excel").trigger()
  }
}

// CRUD Functions for Products
function showAddProductModal() {
  currentEditingProduct = null
  const modal = document.getElementById("productModal")
  const modalTitle = modal.querySelector(".modal-title")
  const form = document.getElementById("productForm")

  modalTitle.textContent = "Tambah Produk"
  form.reset()
  form.status.value = "active" // Set default status
  openModal("productModal")
}

function editProduct(productId) {
  const products = loadProductsData()
  const product = products.find((p) => p.id === productId)

  if (product) {
    currentEditingProduct = product
    const modal = document.getElementById("productModal")
    const modalTitle = modal.querySelector(".modal-title")
    const form = document.getElementById("productForm")

    modalTitle.textContent = "Edit Produk"

    // Fill form with product data
    form.name.value = product.name
    form.category.value = product.category
    form.price.value = product.price
    form.stock.value = product.stock
    form.status.value = product.status
    form.description.value = product.description

    openModal("productModal")
  }
}

function saveProduct() {
  const form = document.getElementById("productForm")
  const formData = new FormData(form)

  const productData = {
    name: formData.get("name"),
    category: formData.get("category"),
    price: Number.parseFloat(formData.get("price")),
    stock: Number.parseInt(formData.get("stock")),
    status: formData.get("status"),
    description: formData.get("description"),
    image: "/placeholder.svg?height=200&width=200",
  }

  // Validate required fields
  if (!productData.name || !productData.category || !productData.price || productData.stock < 0) {
    showNotification("Mohon lengkapi semua field yang wajib diisi dengan benar", "error")
    return
  }

  const products = loadProductsData()

  if (currentEditingProduct) {
    // Update existing product
    const index = products.findIndex((p) => p.id === currentEditingProduct.id)
    if (index !== -1) {
      products[index] = { ...currentEditingProduct, ...productData }
      showNotification("Produk berhasil diperbarui", "success")
    }
  } else {
    // Add new product
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1
    products.push({ id: newId, ...productData })
    showNotification("Produk berhasil ditambahkan", "success")
  }

  saveProductsData(products)
  loadProducts()
  loadDashboardData() // Refresh dashboard stats
  closeModal("productModal")
}

function deleteProduct(productId) {
  if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return

  const products = loadProductsData()
  const filteredProducts = products.filter((p) => p.id !== productId)

  saveProductsData(filteredProducts)
  loadProducts()
  loadDashboardData() // Refresh dashboard stats
  showNotification("Produk berhasil dihapus", "success")
}

// CRUD Functions for Articles
function showAddArticleModal() {
  currentEditingArticle = null
  const modal = document.getElementById("articleModal")
  const modalTitle = modal.querySelector(".modal-title")
  const form = document.getElementById("articleForm")

  modalTitle.textContent = "Tambah Artikel"
  form.reset()
  form.author.value = "Admin" // Set default author
  form.status.value = "draft" // Set default status
  openModal("articleModal")
}

function editArticle(articleId) {
  const articles = loadArticlesData()
  const article = articles.find((a) => a.id === articleId)

  if (article) {
    currentEditingArticle = article
    const modal = document.getElementById("articleModal")
    const modalTitle = modal.querySelector(".modal-title")
    const form = document.getElementById("articleForm")

    modalTitle.textContent = "Edit Artikel"

    // Fill form with article data
    form.title.value = article.title
    form.category.value = article.category
    form.author.value = article.author
    form.status.value = article.status
    form.excerpt.value = article.excerpt
    form.content.value = article.content

    openModal("articleModal")
  }
}

function saveArticle() {
  const form = document.getElementById("articleForm")
  const formData = new FormData(form)

  const articleData = {
    title: formData.get("title"),
    category: formData.get("category"),
    author: formData.get("author"),
    status: formData.get("status"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    date: currentEditingArticle ? currentEditingArticle.date : new Date().toISOString(),
  }

  // Validate required fields
  if (!articleData.title || !articleData.category || !articleData.author || !articleData.content) {
    showNotification("Mohon lengkapi semua field yang wajib diisi", "error")
    return
  }

  const articles = loadArticlesData()

  if (currentEditingArticle) {
    // Update existing article
    const index = articles.findIndex((a) => a.id === currentEditingArticle.id)
    if (index !== -1) {
      articles[index] = { ...currentEditingArticle, ...articleData }
      showNotification("Artikel berhasil diperbarui", "success")
    }
  } else {
    // Add new article
    const newId = articles.length > 0 ? Math.max(...articles.map((a) => a.id)) + 1 : 1
    articles.push({ id: newId, ...articleData })
    showNotification("Artikel berhasil ditambahkan", "success")
  }

  saveArticlesData(articles)
  loadArticles()
  closeModal("articleModal")
}

function deleteArticle(articleId) {
  if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return

  const articles = loadArticlesData()
  const filteredArticles = articles.filter((a) => a.id !== articleId)

  saveArticlesData(filteredArticles)
  loadArticles()
  showNotification("Artikel berhasil dihapus", "success")
}

// CRUD Functions for Users
function showAddUserModal() {
  currentEditingUser = null
  const modal = document.getElementById("userModal")
  const modalTitle = modal.querySelector(".modal-title")
  const form = document.getElementById("userForm")

  modalTitle.textContent = "Tambah User"
  form.reset()
  form.status.value = "Active" // Set default status
  openModal("userModal")
}

function editUser(userId) {
  const users = loadUsersData()
  const user = users.find((u) => u.id === userId)

  if (user) {
    currentEditingUser = user
    const modal = document.getElementById("userModal")
    const modalTitle = modal.querySelector(".modal-title")
    const form = document.getElementById("userForm")

    modalTitle.textContent = "Edit User"

    // Fill form with user data
    form.name.value = user.name
    form.email.value = user.email
    form.role.value = user.role
    form.status.value = user.status
    form.password.value = user.password || ""

    openModal("userModal")
  }
}

function saveUser() {
  const form = document.getElementById("userForm")
  const formData = new FormData(form)

  const userData = {
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    status: formData.get("status"),
    password: formData.get("password"),
    joined: currentEditingUser ? currentEditingUser.joined : new Date().toISOString().split("T")[0],
  }

  // Validate required fields
  if (!userData.name || !userData.email || !userData.role || !userData.password) {
    showNotification("Mohon lengkapi semua field yang wajib diisi", "error")
    return
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(userData.email)) {
    showNotification("Format email tidak valid", "error")
    return
  }

  const users = loadUsersData()

  // Check if email already exists (for new users or different user)
  const existingUser = users.find(
    (u) => u.email === userData.email && (!currentEditingUser || u.id !== currentEditingUser.id),
  )
  if (existingUser) {
    showNotification("Email sudah digunakan oleh user lain", "error")
    return
  }

  if (currentEditingUser) {
    // Update existing user
    const index = users.findIndex((u) => u.id === currentEditingUser.id)
    if (index !== -1) {
      users[index] = { ...currentEditingUser, ...userData }
      showNotification("User berhasil diperbarui", "success")
    }
  } else {
    // Add new user
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1
    users.push({ id: newId, ...userData })
    showNotification("User berhasil ditambahkan", "success")
  }

  saveUsersData(users)
  loadUsers()
  loadDashboardData() // Refresh dashboard stats
  closeModal("userModal")
}

function deleteUser(userId) {
  if (!confirm("Apakah Anda yakin ingin menghapus user ini?")) return

  const users = loadUsersData()
  const filteredUsers = users.filter((u) => u.id !== userId)

  saveUsersData(filteredUsers)
  loadUsers()
  loadDashboardData() // Refresh dashboard stats
  showNotification("User berhasil dihapus", "success")
}

// CRUD Functions for Transactions
function showAddTransactionModal() {
  currentEditingTransaction = null
  const modal = document.getElementById("transactionModal")
  const modalTitle = modal.querySelector(".modal-title")
  const form = document.getElementById("transactionForm")

  modalTitle.textContent = "Tambah Transaksi"
  form.reset()
  form.status.value = "pending" // Set default status
  form.shipping.value = "20000" // Set default shipping
  form.tax.value = "0" // Set default tax
  form.discount.value = "0" // Set default discount
  openModal("transactionModal")
}

function editTransaction(orderId) {
  const orders = loadOrdersData()
  const order = orders.find((o) => o.orderId === orderId)

  if (order) {
    currentEditingTransaction = order
    const modal = document.getElementById("transactionModal")
    const modalTitle = modal.querySelector(".modal-title")
    const form = document.getElementById("transactionForm")

    modalTitle.textContent = "Edit Transaksi"

    // Fill form with transaction data
    form.firstName.value = order.customer.firstName
    form.lastName.value = order.customer.lastName
    form.email.value = order.customer.email
    form.phone.value = order.customer.phone
    form.address.value = order.customer.address
    form.paymentMethod.value = order.paymentMethod
    form.status.value = order.status
    form.subtotal.value = order.totals.subtotal
    form.shipping.value = order.totals.shipping
    form.tax.value = order.totals.tax
    form.discount.value = order.totals.discount

    openModal("transactionModal")
  }
}

function saveTransaction() {
  const form = document.getElementById("transactionForm")
  const formData = new FormData(form)

  const subtotal = Number.parseFloat(formData.get("subtotal")) || 0
  const shipping = Number.parseFloat(formData.get("shipping")) || 0
  const tax = Number.parseFloat(formData.get("tax")) || 0
  const discount = Number.parseFloat(formData.get("discount")) || 0
  const total = subtotal + shipping + tax - discount

  const transactionData = {
    orderId: currentEditingTransaction ? currentEditingTransaction.orderId : generateOrderId(),
    orderDate: currentEditingTransaction ? currentEditingTransaction.orderDate : new Date().toISOString(),
    status: formData.get("status"),
    paymentMethod: formData.get("paymentMethod"),
    customer: {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    },
    items: currentEditingTransaction
      ? currentEditingTransaction.items
      : [
          {
            id: 1,
            productId: 1,
            name: "Produk Default",
            price: subtotal,
            quantity: 1,
            image: "/placeholder.svg?height=200&width=200",
          },
        ],
    totals: {
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      discount: discount,
      total: total,
    },
    lastUpdated: new Date().toISOString(),
  }

  // Validate required fields
  if (
    !transactionData.customer.firstName ||
    !transactionData.customer.lastName ||
    !transactionData.customer.email ||
    !transactionData.customer.phone ||
    !transactionData.customer.address ||
    !transactionData.paymentMethod ||
    !transactionData.status ||
    subtotal <= 0
  ) {
    showNotification("Mohon lengkapi semua field yang wajib diisi dengan benar", "error")
    return
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(transactionData.customer.email)) {
    showNotification("Format email tidak valid", "error")
    return
  }

  const orders = loadOrdersData()

  if (currentEditingTransaction) {
    // Update existing transaction
    const index = orders.findIndex((o) => o.orderId === currentEditingTransaction.orderId)
    if (index !== -1) {
      orders[index] = { ...currentEditingTransaction, ...transactionData }
      showNotification("Transaksi berhasil diperbarui", "success")
    }
  } else {
    // Add new transaction
    orders.push(transactionData)
    showNotification("Transaksi berhasil ditambahkan", "success")
  }

  saveOrdersData(orders)
  loadAllTransactions()
  loadDashboardData() // Refresh dashboard stats
  closeModal("transactionModal")
}

// Order Functions
function showOrderDetail(orderId) {
  const orders = loadOrdersData()
  const order = orders.find((o) => o.orderId === orderId)

  if (order) {
    currentEditingOrder = order

    const orderDetailContent = document.getElementById("orderDetailContent")
    if (orderDetailContent) {
      orderDetailContent.innerHTML = `
        <div class="order-detail-section">
          <h3><i class="fas fa-info-circle"></i> Informasi Pesanan</h3>
          <div class="order-info-grid">
            <div class="order-info-item">
              <div class="order-info-label">Order ID</div>
              <div class="order-info-value">${order.orderId}</div>
            </div>
            <div class="order-info-item">
              <div class="order-info-label">Tanggal Pesanan</div>
              <div class="order-info-value">${formatDate(order.orderDate)}</div>
            </div>
            <div class="order-info-item">
              <div class="order-info-label">Status</div>
              <div class="order-info-value">
                <span class="status-badge ${getStatusClass(order.status)}">${getStatusLabel(order.status)}</span>
              </div>
            </div>
            <div class="order-info-item">
              <div class="order-info-label">Metode Pembayaran</div>
              <div class="order-info-value">
                <i class="fas ${getPaymentIcon(order.paymentMethod)}"></i> ${getPaymentLabel(order.paymentMethod)}
              </div>
            </div>
          </div>
        </div>

        <div class="order-detail-section">
          <h3><i class="fas fa-user"></i> Informasi Pelanggan</h3>
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
            <div class="order-info-item">
              <div class="order-info-label">Alamat</div>
              <div class="order-info-value">${order.customer.address}</div>
            </div>
          </div>
        </div>

        <div class="order-detail-section">
          <h3><i class="fas fa-shopping-cart"></i> Item Pesanan</h3>
          <div class="order-items-list">
            ${order.items
              .map(
                (item) => `
              <div class="order-item-detail">
                <img src="${item.image}" alt="${item.name}" class="order-item-detail-image">
                <div class="order-item-detail-info">
                  <div class="order-item-detail-name">${item.name}</div>
                  <div class="order-item-detail-meta">Qty: ${item.quantity} × ${formatPrice(item.price)}</div>
                </div>
                <div class="order-item-detail-price">${formatPrice(item.price * item.quantity)}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>

        <div class="order-detail-section">
          <h3><i class="fas fa-calculator"></i> Ringkasan Pembayaran</h3>
          <table class="order-totals-table">
            <tr>
              <td>Subtotal</td>
              <td>${formatPrice(order.totals.subtotal)}</td>
            </tr>
            <tr>
              <td>Ongkos Kirim</td>
              <td>${formatPrice(order.totals.shipping)}</td>
            </tr>
            <tr>
              <td>Pajak</td>
              <td>${formatPrice(order.totals.tax)}</td>
            </tr>
            ${
              order.totals.discount > 0
                ? `
              <tr>
                <td>Diskon</td>
                <td>-${formatPrice(order.totals.discount)}</td>
              </tr>
            `
                : ""
            }
            <tr class="order-total-row">
              <td>Total</td>
              <td>${formatPrice(order.totals.total)}</td>
            </tr>
          </table>
        </div>
        ${
          order.notes
            ? `
        <div class="order-detail-section">
          <h3><i class="fas fa-sticky-note"></i> Catatan</h3>
          <p style="background: var(--gray-50); padding: 1rem; border-radius: var(--border-radius); margin: 0;">${order.notes}</p>
        </div>
        `
            : ""
        }
      `
    }

    openModal("orderDetailModal")
  }
}

function deleteOrder(orderId) {
  if (!confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) return

  const orders = loadOrdersData()
  const filteredOrders = orders.filter((o) => o.orderId !== orderId)

  saveOrdersData(filteredOrders)
  loadAllTransactions()
  loadDashboardData()
  showNotification("Pesanan berhasil dihapus", "success")
}

function updateOrderStatus() {
  if (!currentEditingOrder) return

  const newStatus = document.getElementById("newOrderStatus").value
  const note = document.getElementById("statusNote").value

  const orders = loadOrdersData()
  const orderIndex = orders.findIndex((o) => o.orderId === currentEditingOrder.orderId)

  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus
    orders[orderIndex].lastUpdated = new Date().toISOString()

    if (note) {
      orders[orderIndex].notes = orders[orderIndex].notes ? `${orders[orderIndex].notes}\n${note}` : note
    }

    saveOrdersData(orders)
    loadAllTransactions()
    loadDashboardData()
    closeModal("statusUpdateModal")
    closeModal("orderDetailModal")
    showNotification(
      `Status pesanan ${currentEditingOrder.orderId} berhasil diubah ke ${getStatusLabel(newStatus)}`,
      "success",
    )
  }
}

function updateOrderStatusQuick(orderId, newStatus) {
  const orders = loadOrdersData()
  const orderIndex = orders.findIndex((o) => o.orderId === orderId)

  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus
    orders[orderIndex].lastUpdated = new Date().toISOString()

    saveOrdersData(orders)
    loadAllTransactions()
    loadDashboardData()
    showNotification(`Status pesanan ${orderId} berhasil diubah ke ${getStatusLabel(newStatus)}`, "success")
  }
}

// Modal Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add("show")
    modal.style.display = "flex"
    document.body.style.overflow = "hidden" // Prevent background scrolling
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.remove("show")
    modal.style.display = "none"
    document.body.style.overflow = "" // Restore scrolling
  }
}

// Notification Function
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification")
  const notificationMessage = document.getElementById("notificationMessage")

  if (notification && notificationMessage) {
    notificationMessage.textContent = message

    // Remove existing classes
    notification.classList.remove("show", "error", "info", "success")

    // Add type class
    if (type === "error") {
      notification.classList.add("error")
    } else if (type === "info") {
      notification.classList.add("info")
    } else {
      notification.classList.add("success")
    }

    // Show notification
    notification.classList.add("show")

    // Hide after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show")
    }, 3000)
  }
}

// Add Dummy Data Function
function addDummyDataIfNeeded() {
  // Add dummy orders if none exist
  const orders = loadOrdersData()
  if (orders.length === 0) {
    const dummyOrders = [
      {
        orderId: "ORD-001",
        orderDate: "2023-06-15T08:30:00Z",
        status: "completed",
        paymentMethod: "bank-transfer",
        customer: {
          firstName: "Siti",
          lastName: "Aminah",
          email: "siti@email.com",
          phone: "081234567890",
          address: "Jl. Merdeka No. 123, Jakarta",
        },
        items: [
          {
            id: 1,
            productId: 1,
            name: "Gamis Zahra",
            price: 213000,
            quantity: 1,
            image: "/placeholder.svg?height=200&width=200",
          },
          {
            id: 2,
            productId: 2,
            name: "Hijab Pashmina",
            price: 50000,
            quantity: 2,
            image: "/placeholder.svg?height=200&width=200",
          },
        ],
        totals: {
          subtotal: 313000,
          shipping: 20000,
          tax: 31300,
          discount: 0,
          total: 364300,
        },
      },
      {
        orderId: "ORD-002",
        orderDate: "2023-06-16T10:15:00Z",
        status: "processing",
        paymentMethod: "e-wallet",
        customer: {
          firstName: "Fatimah",
          lastName: "Zahra",
          email: "fatimah@email.com",
          phone: "087654321098",
          address: "Jl. Sudirman No. 45, Jakarta",
        },
        items: [
          {
            id: 1,
            productId: 3,
            name: "Set Gamis & Hijab Aisha",
            price: 320000,
            quantity: 1,
            image: "/placeholder.svg?height=200&width=200",
          },
        ],
        totals: {
          subtotal: 320000,
          shipping: 20000,
          tax: 32000,
          discount: 0,
          total: 372000,
        },
      },
      {
        orderId: "ORD-003",
        orderDate: "2023-06-17T14:45:00Z",
        status: "pending",
        paymentMethod: "cod",
        customer: {
          firstName: "Anisa",
          lastName: "Putri",
          email: "anisa@email.com",
          phone: "089876543210",
          address: "Jl. Gatot Subroto No. 78, Jakarta",
        },
        items: [
          {
            id: 1,
            productId: 1,
            name: "Gamis Zahra",
            price: 213000,
            quantity: 1,
            image: "/placeholder.svg?height=200&width=200",
          },
        ],
        totals: {
          subtotal: 213000,
          shipping: 20000,
          tax: 21300,
          discount: 0,
          total: 254300,
        },
      },
      {
        orderId: "ORD-004",
        orderDate: "2023-06-18T11:20:00Z",
        status: "completed",
        paymentMethod: "bank-transfer",
        customer: {
          firstName: "Rina",
          lastName: "Sari",
          email: "rina@email.com",
          phone: "085123456789",
          address: "Jl. Diponegoro No. 56, Bandung",
        },
        items: [
          {
            id: 1,
            productId: 4,
            name: "Gamis Muslimah Elegant",
            price: 275000,
            quantity: 1,
            image: "/placeholder.svg?height=200&width=200",
          },
          {
            id: 2,
            productId: 5,
            name: "Hijab Segi Empat Premium",
            price: 75000,
            quantity: 1,
            image: "/placeholder.svg?height=200&width=200",
          },
        ],
        totals: {
          subtotal: 350000,
          shipping: 25000,
          tax: 35000,
          discount: 10000,
          total: 400000,
        },
      },
      {
        orderId: "ORD-005",
        orderDate: "2023-06-19T16:45:00Z",
        status: "cancelled",
        paymentMethod: "e-wallet",
        customer: {
          firstName: "Maya",
          lastName: "Dewi",
          email: "maya@email.com",
          phone: "082987654321",
          address: "Jl. Ahmad Yani No. 89, Surabaya",
        },
        items: [
          {
            id: 1,
            productId: 2,
            name: "Hijab Pashmina",
            price: 50000,
            quantity: 3,
            image: "/placeholder.svg?height=200&width=200",
          },
        ],
        totals: {
          subtotal: 150000,
          shipping: 20000,
          tax: 15000,
          discount: 0,
          total: 185000,
        },
        notes: "Dibatalkan karena permintaan pelanggan",
      },
    ]

    saveOrdersData(dummyOrders)
  }
}

// Add event listeners for order detail buttons
function addOrderDetailEventListeners() {
  document.querySelectorAll(".view-order-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const orderId = this.getAttribute("data-order-id")
      showOrderDetail(orderId)
    })
  })
}

// Refresh functions
function refreshTransactions() {
  loadAllTransactions()
  showNotification("Data transaksi berhasil diperbarui", "success")
}

function refreshProducts() {
  loadProducts()
  showNotification("Data produk berhasil diperbarui", "success")
}

function refreshArticles() {
  loadArticles()
  showNotification("Data artikel berhasil diperbarui", "success")
}

function refreshUsers() {
  loadUsers()
  showNotification("Data user berhasil diperbarui", "success")
}

// Go to main site function
function goToMainSite() {
  window.location.href = "../index.html"
}

// Mobile Table Rendering Functions
function renderMobileTransactions() {
  const orders = loadOrdersData()
  const container = document.querySelector("#transactions .table-responsive-mobile")

  if (!container) return

  container.innerHTML = ""

  if (orders.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--gray-500);">
        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
        Tidak ada transaksi
      </div>
    `
    return
  }

  orders.forEach((order) => {
    const status = order.status || "pending"
    const customerName = order.customer
      ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim()
      : "N/A"

    const card = document.createElement("div")
    card.className = "table-card-mobile"
    card.innerHTML = `
      <div class="table-card-mobile-header">
        <div>
          <div class="table-card-mobile-title">${order.orderId}</div>
          <div class="table-card-mobile-subtitle">${formatDate(order.orderDate)}</div>
        </div>
        <span class="status-badge ${getStatusClass(status)}">${getStatusLabel(status)}</span>
      </div>
      <div class="table-card-mobile-body">
        <div class="table-card-mobile-row">
          <span class="table-card-mobile-label">Pelanggan</span>
          <span class="table-card-mobile-value">${customerName}</span>
        </div>
        <div class="table-card-mobile-row">
          <span class="table-card-mobile-label">Email</span>
          <span class="table-card-mobile-value">${order.customer?.email || "N/A"}</span>
        </div>
        <div class="table-card-mobile-row">
          <span class="table-card-mobile-label">Total</span>
          <span class="table-card-mobile-value">${formatPrice(order.totals?.total || 0)}</span>
        </div>
        <div class="table-card-mobile-row">
          <span class="table-card-mobile-label">Pembayaran</span>
          <span class="table-card-mobile-value">
            <i class="fas ${getPaymentIcon(order.paymentMethod)}"></i> ${getPaymentLabel(order.paymentMethod)}
          </span>
        </div>
        <div class="table-card-mobile-row">
          <span class="table-card-mobile-label">Status</span>
          <span class="table-card-mobile-value">
            <select class="status-dropdown-mobile ${status}" onchange="updateOrderStatusQuick('${order.orderId}', this.value)">
              <option value="pending" ${status === "pending" ? "selected" : ""}>Menunggu Pembayaran</option>
              <option value="processing" ${status === "processing" ? "selected" : ""}>Diproses</option>
              <option value="completed" ${status === "completed" ? "selected" : ""}>Selesai</option>
              <option value="cancelled" ${status === "cancelled" ? "selected" : ""}>Dibatalkan</option>
            </select>
          </span>
        </div>
      </div>
      <div class="table-card-mobile-actions">
        <button class="action-btn view" onclick="showOrderDetail('${order.orderId}')" title="Lihat Detail">
          <i class="fas fa-eye"></i>
        </button>
        <button class="action-btn edit" onclick="editTransaction('${order.orderId}')" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete" onclick="deleteOrder('${order.orderId}')" title="Hapus">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `
    container.appendChild(card)
  })
}

function renderMobileProducts() {
  const products = loadProductsData()
  const container = document.querySelector("#products .table-responsive-mobile")

  if (!container) return

  container.innerHTML = ""

  if (products.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--gray-500);">
        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
        Tidak ada produk
      </div>
    `
    return
  }

  products.forEach((product) => {
    const card = document.createElement("div")
    card.className = "table-card-mobile"
    card.innerHTML = `
      <div class="product-card-mobile">
        <img src="${product.image}" alt="${product.name}" class="product-card-mobile-image">
        <div class="product-card-mobile-content">
          <div class="product-card-mobile-name">${product.name}</div>
          <div class="product-card-mobile-meta">${getCategoryLabel(product.category)} • Stok: ${product.stock}</div>
          <div class="product-card-mobile-price">${formatPrice(product.price)}</div>
        </div>
      </div>
      <div class="table-card-mobile-body" style="margin-top: 0.75rem;">
        <div class="table-card-mobile-row">
          <span class="table-card-mobile-label">Status</span>
          <span class="table-card-mobile-value">
            <span class="status-badge ${product.status === "active" ? "status-completed" : "status-cancelled"}">
              ${product.status === "active" ? "Aktif" : "Tidak Aktif"}
            </span>
          </span>
        </div>
      </div>
      <div class="table-card-mobile-actions">
        <button class="action-btn edit" onclick="editProduct(${product.id})" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete" onclick="deleteProduct(${product.id})" title="Hapus">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `
    container.appendChild(card)
  })
}

function renderMobileArticles() {
  const articles = loadArticlesData()
  const container = document.querySelector("#articles .table-responsive-mobile")

  if (!container) return

  container.innerHTML = ""

  if (articles.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--gray-500);">
        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
        Tidak ada artikel
      </div>
    `
    return
  }

  articles.forEach((article) => {
    const card = document.createElement("div")
    card.className = "table-card-mobile"
    card.innerHTML = `
      <div class="table-card-mobile-header">
        <div>
          <div class="table-card-mobile-title">${article.title}</div>
          <div class="table-card-mobile-subtitle">${article.category} • ${article.author}</div>
        </div>
        <span class="status-badge ${article.status === "published" ? "status-completed" : "status-pending"}">
          ${article.status === "published" ? "Published" : "Draft"}
        </span>
      </div>
      <div class="table-card-mobile-body">
        <div class="table-card-mobile-row">
          <span class="table-card-mobile-label">Tanggal</span>
          <span class="table-card-mobile-value">${formatDate(article.date)}</span>
        </div>
        <div class="table-card-mobile-row">
          <span class="table-card-mobile-label">Excerpt</span>
          <span class="table-card-mobile-value">${article.excerpt || "Tidak ada excerpt"}</span>
        </div>
      </div>
      <div class="table-card-mobile-actions">
        <button class="action-btn edit" onclick="editArticle(${article.id})" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete" onclick="deleteArticle(${article.id})" title="Hapus">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `
    container.appendChild(card)
  })
}

function renderMobileUsers() {
  const users = loadUsersData()
  const container = document.querySelector("#users .table-responsive-mobile")

  if (!container) return

  container.innerHTML = ""

  if (users.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--gray-500);">
        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
        Tidak ada user
      </div>
    `
    return
  }

  users.forEach((user) => {
    const card = document.createElement("div")
    card.className = "table-card-mobile"
    card.innerHTML = `
      <div class="user-card-mobile">
        <div class="user-card-mobile-avatar">${user.name.charAt(0)}</div>
        <div class="user-card-mobile-content">
          <div class="user-card-mobile-name">${user.name}</div>
          <div class="user-card-mobile-email">${user.email}</div>
          <div class="user-card-mobile-role">${user.role}</div>
        </div>
      </div>
      <div class="table-card-mobile-body" style="margin-top: 0.75rem;">
        <div class="table-card-mobile-row">
          <span class="table-card-mobile-label">Status</span>
          <span class="table-card-mobile-value">
            <span class="status-badge ${user.status === "Active" ? "status-completed" : "status-cancelled"}">
              ${user.status}
            </span>
          </span>
        </div>
        <div class="table-card-mobile-row">
          <span class="table-card-mobile-label">Bergabung</span>
          <span class="table-card-mobile-value">${formatDate(user.joined)}</span>
        </div>
      </div>
      <div class="table-card-mobile-actions">
        <button class="action-btn edit" onclick="editUser(${user.id})" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete" onclick="deleteUser(${user.id})" title="Hapus">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `
    container.appendChild(card)
  })
}

// Update existing load functions to include mobile rendering
function loadAllTransactions() {
  const orders = loadOrdersData()

  if (transactionsTable) {
    transactionsTable.clear()

    orders.forEach((order) => {
      const status = order.status || "pending"
      const customerName = order.customer
        ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim()
        : "N/A"
      const customerEmail = order.customer?.email || "N/A"

      const statusDropdown = `
        <select class="status-dropdown ${status}" onchange="updateOrderStatusQuick('${order.orderId}', this.value)">
          <option value="pending" ${status === "pending" ? "selected" : ""}>Menunggu Pembayaran</option>
          <option value="processing" ${status === "processing" ? "selected" : ""}>Diproses</option>
          <option value="completed" ${status === "completed" ? "selected" : ""}>Selesai</option>
          <option value="cancelled" ${status === "cancelled" ? "selected" : ""}>Dibatalkan</option>
        </select>
      `

      const actions = `
        <div class="action-buttons">
          <button class="action-btn view" onclick="showOrderDetail('${order.orderId}')" title="Lihat Detail">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit" onclick="editTransaction('${order.orderId}')" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="deleteOrder('${order.orderId}')" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `

      transactionsTable.row.add([
        order.orderId,
        formatDate(order.orderDate),
        customerName,
        customerEmail,
        formatPrice(order.totals?.total || 0),
        `<i class="fas ${getPaymentIcon(order.paymentMethod)}"></i> ${getPaymentLabel(order.paymentMethod)}`,
        statusDropdown,
        actions,
      ])
    })

    transactionsTable.draw()
  }

  // Render mobile version
  renderMobileTransactions()
}

function loadProducts() {
  const products = loadProductsData()

  if (productsTable) {
    productsTable.clear()

    products.forEach((product) => {
      const actions = `
        <div class="action-buttons">
          <button class="action-btn edit" onclick="editProduct(${product.id})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="deleteProduct(${product.id})" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `

      productsTable.row.add([
        `<img src="${product.image}" alt="${product.name}" class="product-image-table">`,
        product.name,
        getCategoryLabel(product.category),
        formatPrice(product.price),
        product.stock,
        `<span class="status-badge ${product.status === "active" ? "status-completed" : "status-cancelled"}">${product.status === "active" ? "Aktif" : "Tidak Aktif"}</span>`,
        actions,
      ])
    })

    productsTable.draw()
  }

  // Render mobile version
  renderMobileProducts()
}

function loadArticles() {
  const articles = loadArticlesData()

  if (articlesTable) {
    articlesTable.clear()

    articles.forEach((article) => {
      const actions = `
        <div class="action-buttons">
          <button class="action-btn edit" onclick="editArticle(${article.id})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="deleteArticle(${article.id})" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `

      articlesTable.row.add([
        article.title,
        article.category,
        article.author,
        formatDate(article.date),
        `<span class="status-badge ${article.status === "published" ? "status-completed" : "status-pending"}">${article.status === "published" ? "Published" : "Draft"}</span>`,
        actions,
      ])
    })

    articlesTable.draw()
  }

  // Render mobile version
  renderMobileArticles()
}

function loadUsers() {
  const users = loadUsersData()

  if (usersTable) {
    usersTable.clear()

    users.forEach((user) => {
      const actions = `
        <div class="action-buttons">
          <button class="action-btn edit" onclick="editUser(${user.id})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="deleteUser(${user.id})" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `

      usersTable.row.add([
        `<div class="user-avatar-table">${user.name.charAt(0)}</div>`,
        user.name,
        user.email,
        user.role,
        `<span class="status-badge ${user.status === "Active" ? "status-completed" : "status-cancelled"}">${user.status}</span>`,
        formatDate(user.joined),
        actions,
      ])
    })

    usersTable.draw()
  }

  // Render mobile version
  renderMobileUsers()
}

// Export functions
function exportTransactions() {
  if (transactionsTable) {
    // Trigger Excel export
    transactionsTable.button(".buttons-excel").trigger()
  }
}

// CRUD Functions for Products
function showAddProductModal() {
  currentEditingProduct = null
  const modal = document.getElementById("productModal")
  const modalTitle = modal.querySelector(".modal-title")
  const form = document.getElementById("productForm")

  modalTitle.textContent = "Tambah Produk"
  form.reset()
  form.status.value = "active" // Set default status
  openModal("productModal")
}

function editProduct(productId) {
  const products = loadProductsData()
  const product = products.find((p) => p.id === productId)

  if (product) {
    currentEditingProduct = product
    const modal = document.getElementById("productModal")
    const modalTitle = modal.querySelector(".modal-title")
    const form = document.getElementById("productForm")

    modalTitle.textContent = "Edit Produk"

    // Fill form with product data
    form.name.value = product.name
    form.category.value = product.category
    form.price.value = product.price
    form.stock.value = product.stock
    form.status.value = product.status
    form.description.value = product.description

    openModal("productModal")
  }
}

function saveProduct() {
  const form = document.getElementById("productForm")
  const formData = new FormData(form)

  const productData = {
    name: formData.get("name"),
    category: formData.get("category"),
    price: Number.parseFloat(formData.get("price")),
    stock: Number.parseInt(formData.get("stock")),
    status: formData.get("status"),
    description: formData.get("description"),
    image: "/placeholder.svg?height=200&width=200",
  }

  // Validate required fields
  if (!productData.name || !productData.category || !productData.price || productData.stock < 0) {
    showNotification("Mohon lengkapi semua field yang wajib diisi dengan benar", "error")
    return
  }

  const products = loadProductsData()

  if (currentEditingProduct) {
    // Update existing product
    const index = products.findIndex((p) => p.id === currentEditingProduct.id)
    if (index !== -1) {
      products[index] = { ...currentEditingProduct, ...productData }
      showNotification("Produk berhasil diperbarui", "success")
    }
  } else {
    // Add new product
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1
    products.push({ id: newId, ...productData })
    showNotification("Produk berhasil ditambahkan", "success")
  }

  saveProductsData(products)
  loadProducts()
  loadDashboardData() // Refresh dashboard stats
  closeModal("productModal")
}

function deleteProduct(productId) {
  if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return

  const products = loadProductsData()
  const filteredProducts = products.filter((p) => p.id !== productId)

  saveProductsData(filteredProducts)
  loadProducts()
  loadDashboardData() // Refresh dashboard stats
  showNotification("Produk berhasil dihapus", "success")
}

// CRUD Functions for Articles
function showAddArticleModal() {
  currentEditingArticle = null
  const modal = document.getElementById("articleModal")
  const modalTitle = modal.querySelector(".modal-title")
  const form = document.getElementById("articleForm")

  modalTitle.textContent = "Tambah Artikel"
  form.reset()
  form.author.value = "Admin" // Set default author
  form.status.value = "draft" // Set default status
  openModal("articleModal")
}

function editArticle(articleId) {
  const articles = loadArticlesData()
  const article = articles.find((a) => a.id === articleId)

  if (article) {
    currentEditingArticle = article
    const modal = document.getElementById("articleModal")
    const modalTitle = modal.querySelector(".modal-title")
    const form = document.getElementById("articleForm")

    modalTitle.textContent = "Edit Artikel"

    // Fill form with article data
    form.title.value = article.title
    form.category.value = article.category
    form.author.value = article.author
    form.status.value = article.status
    form.excerpt.value = article.excerpt
    form.content.value = article.content

    openModal("articleModal")
  }
}

function saveArticle() {
  const form = document.getElementById("articleForm")
  const formData = new FormData(form)

  const articleData = {
    title: formData.get("title"),
    category: formData.get("category"),
    author: formData.get("author"),
    status: formData.get("status"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    date: currentEditingArticle ? currentEditingArticle.date : new Date().toISOString(),
  }

  // Validate required fields
  if (!articleData.title || !articleData.category || !articleData.author || !articleData.content) {
    showNotification("Mohon lengkapi semua field yang wajib diisi", "error")
    return
  }

  const articles = loadArticlesData()

  if (currentEditingArticle) {
    // Update existing article
    const index = articles.findIndex((a) => a.id === currentEditingArticle.id)
    if (index !== -1) {
      articles[index] = { ...currentEditingArticle, ...articleData }
      showNotification("Artikel berhasil diperbarui", "success")
    }
  } else {
    // Add new article
    const newId = articles.length > 0 ? Math.max(...articles.map((a) => a.id)) + 1 : 1
    articles.push({ id: newId, ...articleData })
    showNotification("Artikel berhasil ditambahkan", "success")
  }

  saveArticlesData(articles)
  loadArticles()
  closeModal("articleModal")
}

function deleteArticle(articleId) {
  if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return

  const articles = loadArticlesData()
  const filteredArticles = articles.filter((a) => a.id !== articleId)

  saveArticlesData(filteredArticles)
  loadArticles()
  showNotification("Artikel berhasil dihapus", "success")
}

// CRUD Functions for Users
function showAddUserModal() {
  currentEditingUser = null
  const modal = document.getElementById("userModal")
  const modalTitle = modal.querySelector(".modal-title")
  const form = document.getElementById("userForm")

  modalTitle.textContent = "Tambah User"
  form.reset()
  form.status.value = "Active" // Set default status
  openModal("userModal")
}

function editUser(userId) {
  const users = loadUsersData()
  const user = users.find((u) => u.id === userId)

  if (user) {
    currentEditingUser = user
    const modal = document.getElementById("userModal")
    const modalTitle = modal.querySelector(".modal-title")
    const form = document.getElementById("userForm")

    modalTitle.textContent = "Edit User"

    // Fill form with user data
    form.name.value = user.name
    form.email.value = user.email
    form.role.value = user.role
    form.status.value = user.status
    form.password.value = user.password || ""

    openModal("userModal")
  }
}

function saveUser() {
  const form = document.getElementById("userForm")
  const formData = new FormData(form)

  const userData = {
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    status: formData.get("status"),
    password: formData.get("password"),
    joined: currentEditingUser ? currentEditingUser.joined : new Date().toISOString().split("T")[0],
  }

  // Validate required fields
  if (!userData.name || !userData.email || !userData.role || !userData.password) {
    showNotification("Mohon lengkapi semua field yang wajib diisi", "error")
    return
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(userData.email)) {
    showNotification("Format email tidak valid", "error")
    return
  }

  const users = loadUsersData()

  // Check if email already exists (for new users or different user)
  const existingUser = users.find(
    (u) => u.email === userData.email && (!currentEditingUser || u.id !== currentEditingUser.id),
  )
  if (existingUser) {
    showNotification("Email sudah digunakan oleh user lain", "error")
    return
  }

  if (currentEditingUser) {
    // Update existing user
    const index = users.findIndex((u) => u.id === currentEditingUser.id)
    if (index !== -1) {
      users[index] = { ...currentEditingUser, ...userData }
      showNotification("User berhasil diperbarui", "success")
    }
  } else {
    // Add new user
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1
    users.push({ id: newId, ...userData })
    showNotification("User berhasil ditambahkan", "success")
  }

  saveUsersData(users)
  loadUsers()
  loadDashboardData() // Refresh dashboard stats
  closeModal("userModal")
}

function deleteUser(userId) {
  if (!confirm("Apakah Anda yakin ingin menghapus user ini?")) return

  const users = loadUsersData()
  const filteredUsers = users.filter((u) => u.id !== userId)

  saveUsersData(filteredUsers)
  loadUsers()
  loadDashboardData() // Refresh dashboard stats
  showNotification("User berhasil dihapus", "success")
}

// CRUD Functions for Transactions
function showAddTransactionModal() {
  currentEditingTransaction = null
  const modal = document.getElementById("transactionModal")
  const modalTitle = modal.querySelector(".modal-title")
  const form = document.getElementById("transactionForm")

  modalTitle.textContent = "Tambah Transaksi"
  form.reset()
  form.status.value = "pending" // Set default status
  form.shipping.value = "20000" // Set default shipping
  form.tax.value = "0" // Set default tax
  form.discount.value = "0" // Set default discount
  openModal("transactionModal")
}

function editTransaction(orderId) {
  const orders = loadOrdersData()
  const order = orders.find((o) => o.orderId === orderId)

  if (order) {
    currentEditingTransaction = order
    const modal = document.getElementById("transactionModal")
    const modalTitle = modal.querySelector(".modal-title")
    const form = document.getElementById("transactionForm")

    modalTitle.textContent = "Edit Transaksi"

    // Fill form with transaction data
    form.firstName.value = order.customer.firstName
    form.lastName.value = order.customer.lastName
    form.email.value = order.customer.email
    form.phone.value = order.customer.phone
    form.address.value = order.customer.address
    form.paymentMethod.value = order.paymentMethod
    form.status.value = order.status
    form.subtotal.value = order.totals.subtotal
    form.shipping.value = order.totals.shipping
    form.tax.value = order.totals.tax
    form.discount.value = order.totals.discount

    openModal("transactionModal")
  }
}

function saveTransaction() {
  const form = document.getElementById("transactionForm")
  const formData = new FormData(form)

  const subtotal = Number.parseFloat(formData.get("subtotal")) || 0
  const shipping = Number.parseFloat(formData.get("shipping")) || 0
  const tax = Number.parseFloat(formData.get("tax")) || 0
  const discount = Number.parseFloat(formData.get("discount")) || 0
  const total = subtotal + shipping + tax - discount

  const transactionData = {
    orderId: currentEditingTransaction ? currentEditingTransaction.orderId : generateOrderId(),
    orderDate: currentEditingTransaction ? currentEditingTransaction.orderDate : new Date().toISOString(),
    status: formData.get("status"),
    paymentMethod: formData.get("paymentMethod"),
    customer: {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    },
    items: currentEditingTransaction
      ? currentEditingTransaction.items
      : [
          {
            id: 1,
            productId: 1,
            name: "Produk Default",
            price: subtotal,
            quantity: 1,
            image: "/placeholder.svg?height=200&width=200",
          },
        ],
    totals: {
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      discount: discount,
      total: total,
    },
    lastUpdated: new Date().toISOString(),
  }

  // Validate required fields
  if (
    !transactionData.customer.firstName ||
    !transactionData.customer.lastName ||
    !transactionData.customer.email ||
    !transactionData.customer.phone ||
    !transactionData.customer.address ||
    !transactionData.paymentMethod ||
    !transactionData.status ||
    subtotal <= 0
  ) {
    showNotification("Mohon lengkapi semua field yang wajib diisi dengan benar", "error")
    return
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(transactionData.customer.email)) {
    showNotification("Format email tidak valid", "error")
    return
  }

  const orders = loadOrdersData()

  if (currentEditingTransaction) {
    // Update existing transaction
    const index = orders.findIndex((o) => o.orderId === currentEditingTransaction.orderId)
    if (index !== -1) {
      orders[index] = { ...currentEditingTransaction, ...transactionData }
      showNotification("Transaksi berhasil diperbarui", "success")
    }
  } else {
    // Add new transaction
    orders.push(transactionData)
    showNotification("Transaksi berhasil ditambahkan", "success")
  }

  saveOrdersData(orders)
  loadAllTransactions()
  loadDashboardData() // Refresh dashboard stats
  closeModal("transactionModal")
}

// Order Functions
function showOrderDetail(orderId) {
  const orders = loadOrdersData()
  const order = orders.find((o) => o.orderId === orderId)

  if (order) {
    currentEditingOrder = order

    const orderDetailContent = document.getElementById("orderDetailContent")
    if (orderDetailContent) {
      orderDetailContent.innerHTML = `
        <div class="order-detail-section">
          <h3><i class="fas fa-info-circle"></i> Informasi Pesanan</h3>
          <div class="order-info-grid">
            <div class="order-info-item">
              <div class="order-info-label">Order ID</div>
              <div class="order-info-value">${order.orderId}</div>
            </div>
            <div class="order-info-item">
              <div class="order-info-label">Tanggal Pesanan</div>
              <div class="order-info-value">${formatDate(order.orderDate)}</div>
            </div>
            <div class="order-info-item">
              <div class="order-info-label">Status</div>
              <div class="order-info-value">
                <span class="status-badge ${getStatusClass(order.status)}">${getStatusLabel(order.status)}</span>
              </div>
            </div>
            <div class="order-info-item">
              <div class="order-info-label">Metode Pembayaran</div>
              <div class="order-info-value">
                <i class="fas ${getPaymentIcon(order.paymentMethod)}"></i> ${getPaymentLabel(order.paymentMethod)}
              </div>
            </div>
          </div>
        </div>

        <div class="order-detail-section">
          <h3><i class="fas fa-user"></i> Informasi Pelanggan</h3>
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
            <div class="order-info-item">
              <div class="order-info-label">Alamat</div>
              <div class="order-info-value">${order.customer.address}</div>
            </div>
          </div>
        </div>

        <div class="order-detail-section">
          <h3><i class="fas fa-shopping-cart"></i> Item Pesanan</h3>
          <div class="order-items-list">
            ${order.items
              .map(
                (item) => `
              <div class="order-item-detail">
                <img src="${item.image}" alt="${item.name}" class="order-item-detail-image">
                <div class="order-item-detail-info">
                  <div class="order-item-detail-name">${item.name}</div>
                  <div class="order-item-detail-meta">Qty: ${item.quantity} × ${formatPrice(item.price)}</div>
                </div>
                <div class="order-item-detail-price">${formatPrice(item.price * item.quantity)}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>

        <div class="order-detail-section">
          <h3><i class="fas fa-calculator"></i> Ringkasan Pembayaran</h3>
          <table class="order-totals-table">
            <tr>
              <td>Subtotal</td>
              <td>${formatPrice(order.totals.subtotal)}</td>
            </tr>
            <tr>
              <td>Ongkos Kirim</td>
              <td>${formatPrice(order.totals.shipping)}</td>
            </tr>
            <tr>
              <td>Pajak</td>
              <td>${formatPrice(order.totals.tax)}</td>
            </tr>
            ${
              order.totals.discount > 0
                ? `
              <tr>
                <td>Diskon</td>
                <td>-${formatPrice(order.totals.discount)}</td>
              </tr>
            `
                : ""
            }
            <tr class="order-total-row">
              <td>Total</td>
              <td>${formatPrice(order.totals.total)}</td>
            </tr>
          </table>
        </div>
        ${
          order.notes
            ? `
        <div class="order-detail-section">
          <h3><i class="fas fa-sticky-note"></i> Catatan</h3>
          <p style="background: var(--gray-50); padding: 1rem; border-radius: var(--border-radius); margin: 0;">${order.notes}</p>
        </div>
        `
            : ""
        }
      `
    }

    openModal("orderDetailModal")
  }
}

function deleteOrder(orderId) {
  if (!confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) return

  const orders = loadOrdersData()
  const filteredOrders = orders.filter((o) => o.orderId !== orderId)

  saveOrdersData(filteredOrders)
  loadAllTransactions()
  loadDashboardData()
  showNotification("Pesanan berhasil dihapus", "success")
}

function updateOrderStatus() {
  if (!currentEditingOrder) return

  const newStatus = document.getElementById("newOrderStatus").value
  const note = document.getElementById("statusNote").value

  const orders = loadOrdersData()
  const orderIndex = orders.findIndex((o) => o.orderId === currentEditingOrder.orderId)

  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus
    orders[orderIndex].lastUpdated = new Date().toISOString()

    if (note) {
      orders[orderIndex].notes = orders[orderIndex].notes ? `${orders[orderIndex].notes}\n${note}` : note
    }

    saveOrdersData(orders)
    loadAllTransactions()
    loadDashboardData()
    closeModal("statusUpdateModal")
    closeModal("orderDetailModal")
    showNotification(
      `Status pesanan ${currentEditingOrder.orderId} berhasil diubah ke ${getStatusLabel(newStatus)}`,
      "success",
    )
  }
}

// Modal Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add("show")
    modal.style.display = "flex"
    document.body.style.overflow = "hidden" // Prevent background scrolling
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.remove("show")
    modal.style.display = "none"
    document.body.style.overflow = "" // Restore scrolling
  }
}

// Notification Function
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification")
  const notificationMessage = document.getElementById("notificationMessage")

  if (notification && notificationMessage) {
    notificationMessage.textContent = message

    // Remove existing classes
    notification.classList.remove("show", "error", "info", "success")

    // Add type class
    if (type === "error") {
      notification.classList.add("error")
    } else if (type === "info") {
      notification.classList.add("info")
    } else {
      notification.classList.add("success")
    }

    // Show notification
    notification.classList.add("show")

    // Hide after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show")
    }, 3000)
  }
}

// Add Dummy Data Function
function addDummyDataIfNeeded() {
  // Add dummy orders if none exist
  const orders = loadOrdersData()
  if (orders.length === 0) {
    const dummyOrders = [
      {
        orderId: "ORD-001",
        orderDate: "2023-06-15T08:30:00Z",
        status: "completed",
        paymentMethod: "bank-transfer",
        customer: {
          firstName: "Siti",
          lastName: "Aminah",
          email: "siti@email.com",
          phone: "081234567890",
          address: "Jl. Merdeka No. 123, Jakarta",
        },
        items: [
          {
            id: 1,
            productId: 1,
            name: "Gamis Zahra",
            price: 213000,
            quantity: 1,
            image: "/placeholder.svg?height=200&width=200",
          },
          {
            id: 2,
            productId: 2,
            name: "Hijab Pashmina",
            price: 50000,
            quantity: 2,
            image: "/placeholder.svg?height=200&width=200",
          },
        ],
        totals: {
          subtotal: 313000,
          shipping: 20000,
          tax: 31300,
          discount: 0,
          total: 364300,
        },
      },
      {
        orderId: "ORD-002",
        orderDate: "2023-06-16T10:15:00Z",
        status: "processing",
        paymentMethod: "e-wallet",
        customer: {
          firstName: "Fatimah",
          lastName: "Zahra",
          email: "fatimah@email.com",
          phone: "087654321098",
          address: "Jl. Sudirman No. 45, Jakarta",
        },
        items: [
          {
            id: 1,
            productId: 3,
            name: "Set Gamis & Hijab Aisha",
            price: 320000,
            quantity: 1,
            image: "/placeholder.svg?height=200&width=200",
          },
        ],
        totals: {
          subtotal: 320000,
          shipping: 20000,
          tax: 32000,
          discount: 0,
          total: 372000,
        },
      },
      {
        orderId: "ORD-003",
        orderDate: "2023-06-17T14:45:00Z",
        status: "pending",
        paymentMethod: "cod",
        customer: {
          firstName: "Anisa",
          lastName: "Putri",
          email: "anisa@email.com",
          phone: "089876543210",
          address: "Jl. Gatot Subroto No. 78, Jakarta",
        },
        items: [
          {
            id: 1,
            productId: 1,
            name: "Gamis Zahra",
            price: 213000,
            quantity: 1,
            image: "/placeholder.svg?height=200&width=200",
          },
        ],
        totals: {
          subtotal: 213000,
          shipping: 20000,
          tax: 21300,
          discount: 0,
          total: 254300,
        },
      },
      {
        orderId: "ORD-004",
        orderDate: "2023-06-18T11:20:00Z",
        status: "completed",
        paymentMethod: "bank-transfer",
        customer: {
          firstName: "Rina",
          lastName: "Sari",
          email: "rina@email.com",
          phone: "085123456789",
          address: "Jl. Diponegoro No. 56, Bandung",
        },
        items: [
          {
            id: 1,
            productId: 4,
            name: "Gamis Muslimah Elegant",
            price: 275000,
            quantity: 1,
            image: "/placeholder.svg?height=200&width=200",
          },
          {
            id: 2,
            productId: 5,
            name: "Hijab Segi Empat Premium",
            price: 75000,
            quantity: 1,
            image: "/placeholder.svg?height=200&width=200",
          },
        ],
        totals: {
          subtotal: 350000,
          shipping: 25000,
          tax: 35000,
          discount: 10000,
          total: 400000,
        },
      },
      {
        orderId: "ORD-005",
        orderDate: "2023-06-19T16:45:00Z",
        status: "cancelled",
        paymentMethod: "e-wallet",
        customer: {
          firstName: "Maya",
          lastName: "Dewi",
          email: "maya@email.com",
          phone: "082987654321",
          address: "Jl. Ahmad Yani No. 89, Surabaya",
        },
        items: [
          {
            id: 1,
            productId: 2,
            name: "Hijab Pashmina",
            price: 50000,
            quantity: 3,
            image: "/placeholder.svg?height=200&width=200",
          },
        ],
        totals: {
          subtotal: 150000,
          shipping: 20000,
          tax: 15000,
          discount: 0,
          total: 185000,
        },
        notes: "Dibatalkan karena permintaan pelanggan",
      },
    ]

    saveOrdersData(dummyOrders)
  }
}

// Add event listeners for order detail buttons
function addOrderDetailEventListeners() {
  document.querySelectorAll(".view-order-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const orderId = this.getAttribute("data-order-id")
      showOrderDetail(orderId)
    })
  })
}

// Refresh functions
function refreshTransactions() {
  loadAllTransactions()
  showNotification("Data transaksi berhasil diperbarui", "success")
}

function refreshProducts() {
  loadProducts()
  showNotification("Data produk berhasil diperbarui", "success")
}

function refreshArticles() {
  loadArticles()
  showNotification("Data artikel berhasil diperbarui", "success")
}

function refreshUsers() {
  loadUsers()
  showNotification("Data user berhasil diperbarui", "success")
}

// Go to main site function
function goToMainSite() {
  window.location.href = "../index.html"
}

// Global functions for window scope
window.switchPage = switchPage
window.openModal = openModal
window.closeModal = closeModal
window.showAddProductModal = showAddProductModal
window.showAddArticleModal = showAddArticleModal
window.showAddUserModal = showAddUserModal
window.showAddTransactionModal = showAddTransactionModal
window.saveProduct = saveProduct
window.saveArticle = saveArticle
window.saveUser = saveUser
window.saveTransaction = saveTransaction
window.updateOrderStatus = updateOrderStatus
window.updateOrderStatusQuick = updateOrderStatusQuick
window.refreshTransactions = refreshTransactions
window.refreshProducts = refreshProducts
window.refreshArticles = refreshArticles
window.refreshUsers = refreshUsers
window.exportTransactions = exportTransactions
window.goToMainSite = goToMainSite
window.showOrderDetail = showOrderDetail
window.deleteOrder = deleteOrder
window.editProduct = editProduct
window.deleteProduct = deleteProduct
window.editArticle = editArticle
window.deleteArticle = deleteArticle
window.editUser = editUser
window.deleteUser = deleteUser
window.editTransaction = editTransaction
window.toggleTheme = toggleTheme
