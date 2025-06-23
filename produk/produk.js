// let products = [
//   {
//     id: 1,
//     name: "Gamis Zahra",
//     price: 213000,
//     category: "Gamis",
//     image:
//       "https://i.pinimg.com/736x/48/04/1c/48041cd200381b20a4cddf3be784d837.jpg",
//     description:
//       "Gamis elegan dengan bahan katun premium yang nyaman digunakan sehari-hari. Desain modern dengan potongan yang syar'i.",
//     material: "Katun Premium",
//     colors: ["Pink", "Putih", "Hitam", "Navy"],
//     sizes: ["S", "M", "L", "XL"],
//   },
//   {
//     id: 2,
//     name: "Hijab Pashmina",
//     price: 50000,
//     category: "Hijab",
//     image:
//       "https://i.pinimg.com/736x/aa/58/5a/aa585a7f2e26b4b0ed97cb2894d187fd.jpg",
//     description:
//       "Hijab pashmina dengan bahan yang lembut dan mudah diatur. Cocok untuk berbagai acara.",
//     material: "Voal Premium",
//     colors: ["Putih", "Hitam", "Pink", "Navy"],
//     sizes: ["One Size"],
//   },
//   {
//     id: 3,
//     name: "Set Gamis & Hijab Aisha",
//     price: 320000,
//     category: "Set",
//     image:
//       "https://i.pinimg.com/736x/2f/e2/1e/2fe21e2ac4cc68a970358d57d7a7b60f.jpg",
//     description:
//       "Set lengkap gamis dan hijab dengan motif yang serasi. Pilihan tepat untuk tampilan yang koordinatif.",
//     material: "Katun Rayon",
//     colors: ["Pink", "Navy", "Maroon"],
//     sizes: ["S", "M", "L", "XL"],
//   },
//   {
//     id: 4,
//     name: "Gamis Syari Fatimah",
//     price: 275000,
//     category: "Gamis",
//     image:
//       "https://i.pinimg.com/736x/c3/78/be/c378be2b22b36e94a8b484d924d5a769.jpg",
//     description:
//       "Gamis syari dengan model longgar dan nyaman. Dilengkapi dengan tali pinggang untuk siluet yang indah.",
//     material: "Wolfis Premium",
//     colors: ["Hitam", "Navy", "Brown"],
//     sizes: ["S", "M", "L", "XL", "XXL"],
//   },
//   {
//     id: 5,
//     name: "Hijab Segi Empat Silk",
//     price: 75000,
//     category: "Hijab",
//     image:
//       "https://i.pinimg.com/736x/59/f1/40/59f140fb34f3856b61fefa2a4fd2e3f4.jpg",
//     description:
//       "Hijab segi empat dengan bahan silk yang mewah dan mudah dibentuk. Memberikan kesan elegan.",
//     material: "Silk Premium",
//     colors: ["Putih", "Cream", "Pink", "Navy", "Hitam"],
//     sizes: ["110x110cm"],
//   },
//   {
//     id: 6,
//     name: "Gamis Casual Mariam",
//     price: 185000,
//     category: "Gamis",
//     image:
//       "https://i.pinimg.com/736x/cc/77/8a/cc778ae30ab31e24fe2a8602423bb542.jpg",
//     description:
//       "Gamis casual untuk aktivitas sehari-hari. Bahan yang ringan dan tidak mudah kusut.",
//     material: "Cotton Combed",
//     colors: ["Pink", "Mint", "Lavender"],
//     sizes: ["S", "M", "L", "XL"],
//   },
// ];

// // Data keranjang belanja
// let cart = JSON.parse(localStorage.getItem("cart")) || [];

// // Fungsi untuk menyimpan data ke localStorage
// function saveToLocalStorage() {
//   localStorage.setItem("cart", JSON.stringify(cart));
//   localStorage.setItem("products", JSON.stringify(products));
// }

// // Fungsi untuk memuat data dari localStorage
// function loadFromLocalStorage() {
//   const savedProducts = localStorage.getItem("products");
//   if (savedProducts) {
//     products = JSON.parse(savedProducts);
//   }

//   const savedCart = localStorage.getItem("cart");
//   if (savedCart) {
//     cart = JSON.parse(savedCart);
//   }
// }

// // Fungsi untuk memformat harga ke Rupiah
// function formatPrice(price) {
//   return new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     minimumFractionDigits: 0,
//   }).format(price);
// }

// // Fungsi untuk parse harga dari format Rupiah ke number
// function parsePrice(priceString) {
//   if (typeof priceString === "number") return priceString;

//   // Handle Indonesian Rupiah format (e.g., "Rp 213.000")
//   if (typeof priceString === "string") {
//     // Remove currency symbol and non-numeric characters except dots
//     const numericString = priceString.replace(/[^0-9.]/g, "");

//     // Replace dots with empty string (Indonesian uses dots as thousand separators)
//     const normalizedString = numericString.replace(/\./g, "");

//     // Parse as integer
//     return Number.parseInt(normalizedString) || 0;
//   }

//   return 0;
// }

// // Fungsi untuk menambah item ke keranjang (FIXED - Mencegah duplikasi)
// function addToCart(
//   productId,
//   name,
//   price,
//   image,
//   color = "Pink",
//   size = "M",
//   quantity = 1
// ) {
//   // Pastikan price adalah number, bukan string format Rupiah
//   const numericPrice = typeof price === "number" ? price : parsePrice(price);

//   // Check if product already exists in cart with same ID, color, and size
//   const existingItemIndex = cart.findIndex(
//     (item) => item.id == productId && item.color === color && item.size === size
//   );

//   if (existingItemIndex !== -1) {
//     // Update quantity if product already exists
//     cart[existingItemIndex].quantity += quantity;
//     showNotification(`Jumlah ${name} di keranjang telah diperbarui`, "success");
//   } else {
//     // Add new item to cart
//     const newItem = {
//       id: productId || Date.now().toString(),
//       name: name,
//       price: numericPrice, // Simpan sebagai number, bukan string
//       image: image,
//       color: color,
//       size: size,
//       quantity: quantity,
//     };

//     cart.push(newItem);
//     showNotification(`${name} berhasil ditambahkan ke keranjang`, "success");
//   }

//   // Save cart to localStorage
//   saveToLocalStorage();

//   // Update cart UI
//   updateCartCount();
// }

// // Fungsi untuk menampilkan notifikasi
// function showNotification(message, type = "success") {
//   // Hapus notifikasi yang ada
//   const existingNotification = document.querySelector(".notification");
//   if (existingNotification) {
//     existingNotification.remove();
//   }

//   // Buat notifikasi baru
//   const notification = document.createElement("div");
//   notification.className = `notification ${type}`;
//   notification.innerHTML = `
//     <div class="notification-content">
//       <i class="fas ${
//         type === "error" ? "fa-exclamation-circle" : "fa-check-circle"
//       }"></i>
//       <span>${message}</span>
//     </div>
//   `;

//   // Tambahkan ke body
//   document.body.appendChild(notification);

//   // Tampilkan notifikasi
//   setTimeout(() => {
//     notification.classList.add("show");
//   }, 10);

//   // Sembunyikan notifikasi setelah 3 detik
//   setTimeout(() => {
//     notification.classList.remove("show");
//     setTimeout(() => {
//       if (document.body.contains(notification)) {
//         document.body.removeChild(notification);
//       }
//     }, 300);
//   }, 3000);
// }

// // Fungsi untuk update cart count di header
// function updateCartCount() {
//   const cartCount = document.getElementById("cartCount");
//   if (cartCount) {
//     const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//     cartCount.textContent = totalItems;
//   }
// }

// // Fungsi untuk mendapatkan produk berdasarkan ID
// function getProductById(id) {
//   return products.find((product) => product.id === Number.parseInt(id));
// }

// // Fungsi untuk logout
// function logout() {
//   // Clear any stored user data
//   localStorage.removeItem("adminLoggedIn");
//   showNotification("Berhasil keluar!", "success");
//   setTimeout(() => {
//     window.location.href = "../index.html";
//   }, 1000);
// }

// // Fungsi untuk setup user dropdown
// function setupUserDropdown() {
//   const userToggle = document.getElementById("userToggle");
//   const userDropdown = document.getElementById("userDropdown");

//   if (userToggle && userDropdown) {
//     // Add click event listener to user toggle
//     userToggle.addEventListener("click", (e) => {
//       e.preventDefault();
//       e.stopPropagation();

//       // Toggle dropdown visibility
//       userDropdown.classList.toggle("show");
//     });

//     // Close dropdown when clicking outside
//     document.addEventListener("click", (e) => {
//       if (!userToggle.contains(e.target) && !userDropdown.contains(e.target)) {
//         userDropdown.classList.remove("show");
//       }
//     });

//     // Prevent dropdown from closing when clicking inside it
//     userDropdown.addEventListener("click", (e) => {
//       e.stopPropagation();
//     });
//   }
// }

// // Event listener ketika halaman dimuat
// document.addEventListener("DOMContentLoaded", () => {
//   loadFromLocalStorage();
//   updateCartCount();
//   setupUserDropdown(); // Setup user dropdown functionality

//   // Setup event listeners untuk action buttons
//   const actionButtons = document.querySelectorAll(".action-btn");

//   // Menambahkan event listener untuk setiap action button
//   actionButtons.forEach((button) => {
//     button.addEventListener("click", function (e) {
//       e.preventDefault();
//       e.stopPropagation();

//       const icon = this.querySelector("i");
//       const productCard = this.closest(".product-card");

//       // Validasi jika elemen tidak ditemukan
//       if (!productCard || !icon) return;

//       const productId = productCard.getAttribute("data-id") || "";
//       const productName =
//         productCard.querySelector("h3")?.textContent || "Produk";
//       const productPriceElement = productCard.querySelector(".current-price");
//       const productPrice = productPriceElement?.textContent || "Rp 0";
//       const productImage = productCard.querySelector("img")?.src || "";

//       if (icon.classList.contains("fa-heart")) {
//         // Toggle wishlist
//         icon.classList.toggle("far");
//         icon.classList.toggle("fas");

//         const message = icon.classList.contains("fas")
//           ? `${productName} ditambahkan ke wishlist`
//           : `${productName} dihapus dari wishlist`;
//         showNotification(message);
//       } else if (icon.classList.contains("fa-shopping-bag")) {
//         // Add to cart tanpa redirect
//         const numericPrice = parsePrice(productPrice);
//         addToCart(
//           productId,
//           productName,
//           numericPrice,
//           productImage,
//           "Pink",
//           "M",
//           1
//         );
//       } else if (icon.classList.contains("fa-eye")) {
//         // Lihat detail produk
//         window.location.href = `../detail_produk/detail_produk.html?id=${productId}`;
//       }
//     });
//   });

//   // Navigasi ke halaman detail jika kartu diklik
//   // const productCards = document.querySelectorAll(".product-card");
//   // productCards.forEach((card) => {
//   //   card.addEventListener("click", function (e) {
//   //     // Abaikan klik jika target adalah tombol aksi
//   //     if (!e.target.closest(".action-btn")) {
//   //       const productId = this.getAttribute("data-id") || "";
//   //       window.location.href = `../detail_produk/detail_produk.html?id=${productId}`;
//   //     }
//   //   });
//   // });

//   const productCards = document.querySelectorAll(".product-card")
//   productCards.forEach((card) => {
//     card.addEventListener("click", function (e) {
//       // Don't trigger if clicking the action buttons
//       if (!e.target.classList.contains("action-btn") && !e.target.closest(".action-btn")) {
//         const productId = this.getAttribute("data-id")
//         window.location.href = `detail_produk/detail_produk.html?id=${productId}`
//       }
//     })
//   })


//   // Filter functionality
//   const filterButtons = document.querySelectorAll(".filter-btn");
//   const productCardsAll = document.querySelectorAll(".product-card");

//   filterButtons.forEach((button) => {
//     button.addEventListener("click", function () {
//       // Remove active class from all buttons
//       filterButtons.forEach((btn) => btn.classList.remove("active"));

//       // Add active class to clicked button
//       this.classList.add("active");

//       // Get filter value
//       const filterValue = this.getAttribute("data-filter");

//       // Filter products
//       productCardsAll.forEach((card) => {
//         if (filterValue === "all") {
//           card.style.display = "block";
//         } else {
//           if (card.getAttribute("data-category") === filterValue) {
//             card.style.display = "block";
//           } else {
//             card.style.display = "none";
//           }
//         }
//       });
//     });
//   });

//   // Mobile menu functionality
//   const mobileMenuBtn = document.getElementById("mobileMenuBtn");
//   const mobileNav = document.getElementById("mobileNav");

//   if (mobileMenuBtn && mobileNav) {
//     mobileMenuBtn.addEventListener("click", function () {
//       mobileNav.classList.toggle("active");
//       document.body.classList.toggle("no-scroll");

//       // Toggle menu button animation
//       this.classList.toggle("active");
//       if (this.classList.contains("active")) {
//         this.children[0].style.transform = "rotate(45deg) translate(5px, 5px)";
//         this.children[1].style.opacity = "0";
//         this.children[2].style.transform =
//           "rotate(-45deg) translate(5px, -5px)";
//       } else {
//         this.children[0].style.transform = "none";
//         this.children[1].style.opacity = "1";
//         this.children[2].style.transform = "none";
//       }
//     });
//   }

//   // Back to top functionality
//   const backToTopBtn = document.getElementById("backToTop");
//   if (backToTopBtn) {
//     window.addEventListener("scroll", () => {
//       if (window.pageYOffset > 300) {
//         backToTopBtn.classList.add("active");
//       } else {
//         backToTopBtn.classList.remove("active");
//       }
//     });

//     backToTopBtn.addEventListener("click", (e) => {
//       e.preventDefault();
//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     });
//   }

//   // Cart icon click - langsung ke halaman keranjang
//   const cartIcon = document.querySelector(".icon-link[href*='keranjang']");
//   if (cartIcon) {
//     cartIcon.addEventListener("click", (e) => {
//       e.preventDefault();
//       window.location.href = "../keranjang/keranjang.html";
//     });
//   }
// });

// // Export fungsi untuk digunakan di file lain
// window.products = products;
// window.cart = cart;
// window.saveToLocalStorage = saveToLocalStorage;
// window.loadFromLocalStorage = loadFromLocalStorage;
// window.formatPrice = formatPrice;
// window.showNotification = showNotification;
// window.updateCartCount = updateCartCount;
// window.getProductById = getProductById;
// window.parsePrice = parsePrice;
// window.addToCart = addToCart;
// window.logout = logout;

// 🚀 SCRIPT.JS - Fungsi utama untuk homepage

// Data produk (simulasi database)
let products = [
  {
    id: 1,
    name: "Gamis Zahra",
    price: 213000,
    category: "Gamis",
    image: "https://i.pinimg.com/736x/48/04/1c/48041cd200381b20a4cddf3be784d837.jpg",
    description:
      "Gamis elegan dengan bahan katun premium yang nyaman digunakan sehari-hari. Desain modern dengan potongan yang syar'i.",
    material: "Katun Premium",
    colors: ["Pink", "Putih", "Hitam", "Navy"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Hijab Pashmina",
    price: 50000,
    category: "Hijab",
    image: "https://i.pinimg.com/736x/aa/58/5a/aa585a7f2e26b4b0ed97cb2894d187fd.jpg",
    description: "Hijab pashmina dengan bahan yang lembut dan mudah diatur. Cocok untuk berbagai acara.",
    material: "Voal Premium",
    colors: ["Putih", "Hitam", "Pink", "Navy"],
    sizes: ["One Size"],
  },
  {
    id: 3,
    name: "Set Gamis & Hijab Aisha",
    price: 320000,
    category: "Set",
    image: "https://i.pinimg.com/736x/2f/e2/1e/2fe21e2ac4cc68a970358d57d7a7b60f.jpg",
    description: "Set lengkap gamis dan hijab dengan motif yang serasi. Pilihan tepat untuk tampilan yang koordinatif.",
    material: "Katun Rayon",
    colors: ["Pink", "Navy", "Maroon"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 4,
    name: "Gamis Syari Fatimah",
    price: 275000,
    category: "Gamis",
    image: "https://i.pinimg.com/736x/c3/78/be/c378be2b22b36e94a8b484d924d5a769.jpg",
    description:
      "Gamis syari dengan model longgar dan nyaman. Dilengkapi dengan tali pinggang untuk siluet yang indah.",
    material: "Wolfis Premium",
    colors: ["Hitam", "Navy", "Brown"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 5,
    name: "Hijab Segi Empat Silk",
    price: 75000,
    category: "Hijab",
    image: "https://i.pinimg.com/736x/59/f1/40/59f140fb34f3856b61fefa2a4fd2e3f4.jpg",
    description: "Hijab segi empat dengan bahan silk yang mewah dan mudah dibentuk. Memberikan kesan elegan.",
    material: "Silk Premium",
    colors: ["Putih", "Cream", "Pink", "Navy", "Hitam"],
    sizes: ["110x110cm"],
  },
  {
    id: 6,
    name: "Gamis Casual Mariam",
    price: 185000,
    category: "Gamis",
    image: "https://i.pinimg.com/736x/cc/77/8a/cc778ae30ab31e24fe2a8602423bb542.jpg",
    description: "Gamis casual untuk aktivitas sehari-hari. Bahan yang ringan dan tidak mudah kusut.",
    material: "Cotton Combed",
    colors: ["Pink", "Mint", "Lavender"],
    sizes: ["S", "M", "L", "XL"],
  },
]

// Data keranjang belanja
let cart = JSON.parse(localStorage.getItem("cart")) || []

// Fungsi untuk menyimpan data ke localStorage
function saveToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart))
  localStorage.setItem("products", JSON.stringify(products))
}

// Fungsi untuk memuat data dari localStorage
function loadFromLocalStorage() {
  const savedProducts = localStorage.getItem("products")
  if (savedProducts) {
    products = JSON.parse(savedProducts)
  }

  const savedCart = localStorage.getItem("cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
  }
}

// Fungsi untuk memformat harga ke Rupiah
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
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

    // Parse as integer
    return Number.parseInt(normalizedString) || 0
  }

  return 0
}

// Fungsi untuk menambah item ke keranjang
function addToCart(productId, name, price, image, color = "Pink", size = "M", quantity = 1) {
  // Pastikan price adalah number, bukan string format Rupiah
  const numericPrice = typeof price === "number" ? price : parsePrice(price)

  // Check if product already exists in cart
  const existingItemIndex = cart.findIndex((item) => item.id == productId && item.color === color && item.size === size)

  if (existingItemIndex !== -1) {
    // Update quantity if product already exists
    cart[existingItemIndex].quantity += quantity
  } else {
    // Add new item to cart
    const newItem = {
      id: productId || Date.now().toString(),
      name: name,
      price: numericPrice, // Simpan sebagai number, bukan string
      image: image,
      color: color,
      size: size,
      quantity: quantity,
    }

    cart.push(newItem)
  }

  // Save cart to localStorage
  saveToLocalStorage()

  // Update cart UI
  updateCartCount()
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification")
  const notificationMessage = document.getElementById("notificationMessage")

  if (notification && notificationMessage) {
    notificationMessage.textContent = message
    notification.style.display = "block"
    notification.style.backgroundColor = type === "error" ? "#f44336" : "#ffb6c1"
    notification.style.transform = "translateY(0)"
    notification.style.opacity = "1"

    setTimeout(() => {
      notification.style.transform = "translateY(100px)"
      notification.style.opacity = "0"
      setTimeout(() => {
        notification.style.display = "none"
      }, 300)
    }, 3000)
  }
}



// Fungsi untuk update cart count di header
function updateCartCount() {
  const cartCount = document.getElementById("cartCount")
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems
  }
}

// Fungsi untuk mendapatkan produk berdasarkan ID
function getProductById(id) {
  return products.find((product) => product.id === Number.parseInt(id))
}

// Fungsi untuk logout
function logout() {
  // Clear any stored user data
  localStorage.removeItem("adminLoggedIn")
  showNotification("Berhasil keluar!", "success")
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}

// Fungsi untuk setup user dropdown
function setupUserDropdown() {
  const userToggle = document.getElementById("userToggle")
  const userDropdown = document.getElementById("userDropdown")

  if (userToggle && userDropdown) {
    // Add click event listener to user toggle
    userToggle.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()

      // Toggle dropdown visibility
      userDropdown.classList.toggle("show")
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!userToggle.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove("show")
      }
    })

    // Prevent dropdown from closing when clicking inside it
    userDropdown.addEventListener("click", (e) => {
      e.stopPropagation()
    })
  }
}

// Event listener ketika halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage()
  updateCartCount()
  setupUserDropdown() // Setup user dropdown functionality

  // Setup event listeners untuk action buttons
  const actionButtons = document.querySelectorAll(".action-btn")

  actionButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()

      const icon = this.querySelector("i")
      const productCard = this.closest(".product-card")
      const productId = productCard.getAttribute("data-id")
      const productName = productCard.querySelector("h3").textContent
      const productPriceElement = productCard.querySelector(".current-price")
      const productPrice = productPriceElement ? productPriceElement.textContent : "Rp 0"
      const productImage = productCard.querySelector("img").src

      if (icon.classList.contains("fa-heart")) {
        // Toggle wishlist
        if (icon.classList.contains("far")) {
          icon.classList.remove("far")
          icon.classList.add("fas")
          showNotification(`${productName} ditambahkan ke wishlist`)
        } else {
          icon.classList.remove("fas")
          icon.classList.add("far")
          showNotification(`${productName} dihapus dari wishlist`)
        }
      } else if (icon.classList.contains("fa-shopping-bag")) {
        // Add to cart and redirect to cart page
        const numericPrice = parsePrice(productPrice)
        addToCart(productId, productName, numericPrice, productImage, "Pink", "M", 1)
        showNotification(`${productName} berhasil ditambahkan ke keranjang`)

        // Redirect ke halaman keranjang setelah 1 detik
        setTimeout(() => {
          window.location.href = "/keranjang.html"
        }, 1000)
      } else if (icon.classList.contains("fa-eye")) {
         window.location.href = `detail-produk.html?id=${productId}`
      }
    })
  })

  // Product card click - Navigate to detail page
  const productCards = document.querySelectorAll(".product-card")
  productCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Don't trigger if clicking the action buttons
      if (!e.target.classList.contains("action-btn") && !e.target.closest(".action-btn")) {
        const productId = this.getAttribute("data-id")
        // window.location.href = `detail_produk/detail_produk.html?id=${productId}`
              window.location.href = `detail-produk.html?id=${productId}`
      }
    })
  })

  // Filter functionality
  const filterButtons = document.querySelectorAll(".filter-btn")
  const productCardsAll = document.querySelectorAll(".product-card")

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      // Get filter value
      const filterValue = this.getAttribute("data-filter")

      // Filter products
      productCardsAll.forEach((card) => {
        if (filterValue === "all") {
          card.style.display = "block"
        } else {
          if (card.getAttribute("data-category") === filterValue) {
            card.style.display = "block"
          } else {
            card.style.display = "none"
          }
        }
      })
    })
  })

  // Mobile menu functionality
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const mobileNav = document.getElementById("mobileNav")

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileNav.classList.toggle("active")
      document.body.classList.toggle("no-scroll")

      // Toggle menu button animation
      this.classList.toggle("active")
      if (this.classList.contains("active")) {
        this.children[0].style.transform = "rotate(45deg) translate(5px, 5px)"
        this.children[1].style.opacity = "0"
        this.children[2].style.transform = "rotate(-45deg) translate(5px, -5px)"
      } else {
        this.children[0].style.transform = "none"
        this.children[1].style.opacity = "1"
        this.children[2].style.transform = "none"
      }
    })
  }

  // Back to top functionality
  const backToTopBtn = document.getElementById("backToTop")
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("active")
      } else {
        backToTopBtn.classList.remove("active")
      }
    })

    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Cart icon click - langsung ke halaman keranjang
  const cartIcon = document.getElementById("cartIcon")
  if (cartIcon) {
    cartIcon.addEventListener("click", (e) => {
      e.preventDefault()
      window.location.href = "/keranjang.html"
    })
  }
})

// Export fungsi untuk digunakan di file lain
window.products = products
window.cart = cart
window.saveToLocalStorage = saveToLocalStorage
window.loadFromLocalStorage = loadFromLocalStorage
window.formatPrice = formatPrice
window.showNotification = showNotification
window.updateCartCount = updateCartCount
window.getProductById = getProductById
window.parsePrice = parsePrice
window.addToCart = addToCart
window.logout = logout

