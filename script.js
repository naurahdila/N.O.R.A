let products = [
  {
    id: 1,
    name: "Gamis Zahra",
    price: 213000,
    category: "Gamis",
    image: "https://i.pinimg.com/736x/48/04/1c/48041cd200381b20a4cddf3be784d837.jpg",
    description: "Gamis elegan dengan bahan katun premium yang nyaman digunakan sehari-hari. Desain modern dengan potongan yang syar'i.",
    material: "Katun",
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
    material: "Katun Silk",
    colors: ["Pink", "Navy", "Maroon"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 4,
    name: "Gamis Syari Fatimah",
    price: 275000,
    category: "Gamis",
    image: "https://i.pinimg.com/736x/c3/78/be/c378be2b22b36e94a8b484d924d5a769.jpg",
    description: "Gamis syari dengan model longgar dan nyaman. Dilengkapi dengan tali pinggang untuk siluet yang indah.",
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
    colors: ["Silver", "Cream", "Pink", "Navy", "Hitam"],
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
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveToLocalStorage() {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("products", JSON.stringify(products));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    showNotification("Gagal menyimpan data", "error");
  }
}

function loadFromLocalStorage() {
  try {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      products = JSON.parse(savedProducts);
    }

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    showNotification("Gagal memuat data", "error");
  }
}

function formatPrice(price) {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  } catch (error) {
    console.error("Error formatting price:", error);
    return `Rp ${price}`;
  }
}

function parsePrice(priceString) {
  if (typeof priceString === "number") return priceString;

  if (typeof priceString === "string") {
    try {
      const numericString = priceString.replace(/[^0-9.]/g, "");
      const normalizedString = numericString.replace(/\./g, '');
      return Number.parseInt(normalizedString) || 0;
    } catch (error) {
      console.error("Error parsing price:", error);
      return 0;
    }
  }

  return 0;
}

function addToCart(productId, name, price, image, color = "default", size = "default", quantity = 1) {
  try {
    const numericPrice = typeof price === "number" ? price : parsePrice(price);
    const existingItemIndex = cart.findIndex(
      (item) => item.id === productId && item.color === color && item.size === size
    );

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      const newItem = {
        id: productId || Date.now().toString(),
        name: name,
        price: numericPrice,
        image: image,
        color: color,
        size: size,
        quantity: quantity,
      };
      cart.push(newItem);
    }

    saveToLocalStorage();
    updateCartCount();
    showNotification(`${name} berhasil ditambahkan ke keranjang`);
    setTimeout(() => {
      window.location.href = "keranjang.html";
    }, 1000);
  } catch (error) {
    console.error("Error adding to cart:", error);
    showNotification("Gagal menambahkan ke keranjang", "error");
  }
}

function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notificationMessage");

  if (notification && notificationMessage) {
    try {
      notificationMessage.textContent = message;
      notification.style.display = "block";
      notification.style.backgroundColor = type === "error" ? "#f44336" : "#ffb6c1";
      notification.style.transform = "translateY(0)";
      notification.style.opacity = "1";

      setTimeout(() => {
        notification.style.transform = "translateY(100px)";
        notification.style.opacity = "0";
        setTimeout(() => {
          notification.style.display = "none";
        }, 300);
      }, 3000);
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  }
}

function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    try {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
    } catch (error) {
      console.error("Error updating cart count:", error);
    }
  }
}

function getProductById(id) {
  try {
    return products.find((product) => product.id === Number.parseInt(id));
  } catch (error) {
    console.error("Error getting product by ID:", error);
    return null;
  }
}

function logout() {
  try {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("customerLoggedIn");
    localStorage.removeItem("userType");
    showNotification("Berhasil keluar!", "success");
    setTimeout(() => {
      window.location.href = "account_selection.html";
    }, 1000);
  } catch (error) {
    console.error("Error during logout:", error);
    showNotification("Gagal keluar", "error");
  }
}

function updateUserUI() {
  try {
    const userType = localStorage.getItem("userType");
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");
    const isCustomerLoggedIn = localStorage.getItem("customerLoggedIn");
    const elements = {
      userInfo: document.getElementById("userInfo"),
      userDivider: document.getElementById("userDivider"),
      adminAccess: document.getElementById("adminAccess"),
      riwayatAccess: document.getElementById("riwayatAccess"),
      loginLink: document.getElementById("loginLink"),
      logoutLink: document.getElementById("logoutLink"),
      userName: document.getElementById("userName"),
      userTypeDisplay: document.getElementById("userTypeDisplay"),
    };

    if (isAdminLoggedIn || isCustomerLoggedIn) {
      if (elements.userInfo) elements.userInfo.style.display = "flex";
      if (elements.userDivider) elements.userDivider.style.display = "block";
      if (elements.loginLink) elements.loginLink.style.display = "none";
      if (elements.logoutLink) elements.logoutLink.style.display = "flex";

      if (elements.userName) elements.userName.textContent = userType === "admin" ? "Admin" : "Customer";
      if (elements.userTypeDisplay) elements.userTypeDisplay.textContent = userType === "admin" ? "Administrator" : "Pelanggan";

      if (userType === "admin" && elements.adminAccess) {
        elements.adminAccess.style.display = "flex";
        if (elements.riwayatAccess) elements.riwayatAccess.style.display = "none";
      } else if (userType === "customer" && elements.riwayatAccess) {
        elements.riwayatAccess.style.display = "flex";
        if (elements.adminAccess) elements.adminAccess.style.display = "none";
      }
    } else {
      if (elements.userInfo) elements.userInfo.style.display = "none";
      if (elements.userDivider) elements.userDivider.style.display = "none";
      if (elements.adminAccess) elements.adminAccess.style.display = "none";
      if (elements.riwayatAccess) elements.riwayatAccess.style.display = "none";
      if (elements.loginLink) elements.loginLink.style.display = "flex";
      if (elements.logoutLink) elements.logoutLink.style.display = "none";
    }
  } catch (error) {
    console.error("Error updating user UI:", error);
  }
}

function setupUserDropdown() {
  const userToggle = document.getElementById("userToggle");
  const userDropdown = document.getElementById("userDropdown");

  if (userToggle && userDropdown) {
    try {
      userToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        userDropdown.classList.toggle("show");
      });

      document.addEventListener("click", (e) => {
        if (!userToggle.contains(e.target) && !userDropdown.contains(e.target)) {
          userDropdown.classList.remove("show");
        }
      });
    } catch (error) {
      console.error("Error setting up user dropdown:", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    // Preloader Logic: Show preloader for 3 seconds (2s logo animation + 1s delay), or skip on click
    const preloader = document.getElementById("preloader");
    const mainContent = document.getElementById("mainContent");

    if (preloader && mainContent) {
      // Function to handle preloader completion
      const handlePreloaderComplete = () => {
        preloader.classList.add("hidden"); // Trigger fade-out transition
        setTimeout(() => {
          preloader.style.display = "none"; // Remove preloader after transition
          // Check if user has selected an account
          const userType = localStorage.getItem("userType");
          if (!userType) {
            // Redirect to account-selection.html if no userType
            window.location.href = "account_selection.html";
          } else {
            // Show main content if userType exists
            mainContent.classList.add("visible"); // Trigger fade-in for content
            // Update UI based on user type
            updateUserUI();
          }
        }, 500); // Match CSS transition duration (0.5s)
      };

      // Set timeout for automatic hide after 3 seconds
      const preloaderTimeout = setTimeout(handlePreloaderComplete, 3000); // Total: 2s animation + 1s delay

      // Add click event to skip preloader
      preloader.addEventListener("click", () => {
        clearTimeout(preloaderTimeout); // Cancel the timeout
        handlePreloaderComplete(); // Immediately handle completion
      });
    }

    loadFromLocalStorage();
    updateCartCount();
    setupUserDropdown();

    const actionButtons = document.querySelectorAll(".action-btn");
    actionButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const icon = this.querySelector("i");
        const productCard = this.closest(".product-card");
        const productId = productCard.getAttribute("data-id");
        const productName = productCard.querySelector("h3").textContent;
        const productPriceElement = productCard.querySelector(".current-price");
        const productPrice = productPriceElement ? productPriceElement.textContent : "Rp 0";
        const productImage = productCard.querySelector("img").src;

        if (icon.classList.contains("fa-heart")) {
          if (icon.classList.contains("far")) {
            icon.classList.remove("far");
            icon.classList.add("fas");
            showNotification(`${productName} ditambahkan ke wishlist`);
          } else {
            icon.classList.remove("fas");
            icon.classList.add("far");
            showNotification(`${productName} dihapus dari wishlist`);
          }
        } else if (icon.classList.contains("fa-shopping-bag")) {
          const numericPrice = parsePrice(productPrice);
          addToCart(productId, productName, numericPrice, productImage);
        } else if (icon.classList.contains("fa-eye")) {
          window.location.href = `detail_produk/detail_produk.html?id=${productId}`;
        }
      });
    });

    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach((card) => {
      card.addEventListener("click", function (e) {
        if (!e.target.classList.contains("action-btn") && !e.target.closest(".action-btn")) {
          const productId = this.getAttribute("data-id");
          window.location.href = `detail_produk/detail_produk.html?id=${productId}`;
        }
      });
    });

    const filterButtons = document.querySelectorAll(".filter-btn");
    const productCardsAll = document.querySelectorAll(".product-card");

    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
        const filterValue = this.getAttribute("data-filter");

        productCardsAll.forEach((card) => {
          if (filterValue === "all") {
            card.style.display = "block";
          } else {
            if (card.getAttribute("data-category") === filterValue) {
              card.style.display = "block";
            } else {
              card.style.display = "none";
            }
          }
        });
      });
    });

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileNav = document.getElementById("mobileNav");

    if (mobileMenuBtn && mobileNav) {
      mobileMenuBtn.addEventListener("click", function () {
        mobileNav.classList.toggle("active");
        document.body.classList.toggle("no-scroll");

        this.classList.toggle("active");
        if (mobileMenuBtn.classList.contains("active")) {
          this.children[0].style.transform = "rotate(45deg) translate(5px, 5px)";
          this.children[1].style.opacity = "0";
          this.children[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
        } else {
          this.children[0].style.transform = "none";
          this.children[1].style.opacity = "1";
          this.children[2].style.transform = "none";
        }
      });
    }

    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
          backToTopBtn.classList.add("active");
        } else {
          backToTopBtn.classList.remove("active");
        }
      });

      backToTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }

    const cartIcon = document.getElementById("cartIcon");
    if (cartIcon) {
      cartIcon.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "keranjang.html";
      });
    }
  } catch (error) {
    console.error("Error during DOMContentLoaded:", error);
    showNotification("Terjadi kesalahan saat memuat halaman", "error");
  }
});

window.products = products;
window.cart = cart;
window.saveToLocalStorage = saveToLocalStorage;
window.loadFromLocalStorage = loadFromLocalStorage;
window.formatPrice = formatPrice;
window.showNotification = showNotification;
window.updateCartCount = updateCartCount;
window.getProductById = getProductById;
window.parsePrice = parsePrice;
window.addToCart = addToCart;
window.logout = logout;
window.updateUserUI = updateUserUI;
window.setupUserDropdown = setupUserDropdown;