let currentProduct = null;
let selectedColor = "Pink";
let selectedSize = "M";
let quantity = 1;

function loadProductDetail() {
  console.log("Loading product detail...");
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id") || 1;

  let products = [];
  try {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      products = JSON.parse(storedProducts);
    } else {
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
        {
          id: 2,
          name: "Gamis Fatimah",
          price: 225000,
          category: "Gamis",
          image: "https://i.pinimg.com/736x/c3/78/be/c378be2b22b36e94a8b484d924d5a769.jpg",
          description: "Gamis syari dengan model longgar dan nyaman.",
          material: "Wolfis Premium",
          colors: ["Pink", "Putih", "Hitam"],
          sizes: ["S", "M", "L", "XL"],
        },
        {
          id: 3,
          name: "Set Gamis & Hijab Aisha",
          price: 320000,
          category: "Set",
          image: "https://i.pinimg.com/736x/2f/e2/1e/2fe21e2ac4cc68a970358d57d7a7b60f.jpg",
          description: "Set lengkap gamis dan hijab dengan motif serasi.",
          material: "Katun Silk",
          colors: ["Pink", "Putih"],
          sizes: ["S", "M", "L", "XL"],
        },
        {
          id: 4,
          name: "Hijab Pashmina",
          price: 50000,
          category: "Hijab",
          image: "https://i.pinimg.com/736x/aa/58/5a/aa585a7f2e26b4b0ed97cb2894d187fd.jpg",
          description: "Hijab pashmina dengan bahan lembut.",
          material: "Voal Premium",
          colors: ["Pink", "Putih", "Hitam", "Abu-abu"],
          sizes: ["One Size"],
        },
      ];
      localStorage.setItem("products", JSON.stringify(products));
    }
  } catch (error) {
    console.error("Error loading products:", error);
    showNotification("Terjadi kesalahan saat memuat data produk", "error");
  }

  currentProduct = products.find((p) => p.id == productId);

  if (!currentProduct) {
    showNotification("Produk tidak ditemukan", "error");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
    return;
  }

  displayProductDetail();
  setupEventListeners();
}

function displayProductDetail() {
  if (!currentProduct) return;

  document.title = `${currentProduct.name} - N.O.R.A`;

  const detailProductName = document.getElementById("detailProductName");
  const detailProductPrice = document.getElementById("detailProductPrice");
  const productMaterial = document.getElementById("productMaterial");
  const productCategory = document.getElementById("productCategory");
  const productCode = document.getElementById("productCode");
  const mainImage = document.getElementById("mainImage");

  if (detailProductName) detailProductName.textContent = currentProduct.name;
  if (detailProductPrice) detailProductPrice.textContent = formatPrice(currentProduct.price);
  if (productMaterial) productMaterial.textContent = currentProduct.material;
  if (productCategory) productCategory.textContent = currentProduct.category;
  if (productCode) productCode.textContent = currentProduct.code || `PROD-${currentProduct.id}`;
  if (mainImage) {
    mainImage.src = currentProduct.images?.[0] || currentProduct.image;
    mainImage.alt = currentProduct.name;
  }

  const descriptionElements = document.querySelectorAll(".product-description p");
  if (descriptionElements.length > 0) {
    descriptionElements[0].textContent = currentProduct.description;
  }

  setupThumbnailImages();
  setupColorOptions();
  setupSizeOptions();
}

function setupThumbnailImages() {
  const thumbnailContainer = document.querySelector(".thumbnail-images");
  if (!thumbnailContainer) return;

  thumbnailContainer.innerHTML = "";

  const images = currentProduct.images || [currentProduct.image];

  images.forEach((imgSrc, index) => {
    const thumbnail = document.createElement("div");
    thumbnail.className = `thumbnail ${index === 0 ? "active" : ""}`;
    thumbnail.setAttribute("data-img", imgSrc);

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = `${currentProduct.name} - Gambar ${index + 1}`;

    thumbnail.appendChild(img);
    thumbnail.addEventListener("click", function () {
      changeMainImage(this);
    });

    thumbnailContainer.appendChild(thumbnail);
  });
}

function setupColorOptions() {
  const colorOptions = document.querySelector(".color-options");
  if (!colorOptions) return;

  colorOptions.innerHTML = "";

  const colorMap = {
    Pink: "#ffd1dc",
    Putih: "#f5f5f5",
    Hitam: "#333333",
    Navy: "#000080",
    Maroon: "#800000",
    Mint: "#98fb98",
    Lavender: "#e6e6fa",
    Cream: "#f5f5dc",
    "Abu-abu": "#e0e0e0",
  };

  const colors = currentProduct.colors || ["Pink", "Putih", "Hitam"];

  colors.forEach((color, index) => {
    const colorOption = document.createElement("div");
    colorOption.className = `color-option ${index === 0 ? "active" : ""}`;
    colorOption.setAttribute("data-color", color);
    colorOption.style.backgroundColor = colorMap[color] || "#cccccc";
    colorOption.title = color;

    if (color === "Putih") {
      colorOption.style.border = "1px solid #ddd";
    }

    colorOption.addEventListener("click", function () {
      selectColor(this);
    });

    colorOptions.appendChild(colorOption);
  });

  selectedColor = colors[0];
}

function setupSizeOptions() {
  const sizeOptions = document.querySelector(".size-options");
  if (!sizeOptions) return;

  sizeOptions.innerHTML = "";

  const sizes = currentProduct.sizes || ["S", "M", "L", "XL"];

  sizes.forEach((size, index) => {
    const sizeOption = document.createElement("div");
    sizeOption.className = `size-option ${size === "M" ? "active" : ""}`;
    sizeOption.setAttribute("data-size", size);
    sizeOption.textContent = size;

    sizeOption.addEventListener("click", function () {
      selectSize(this);
    });

    sizeOptions.appendChild(sizeOption);
  });

  selectedSize = "M";
}

function selectColor(element) {
  document.querySelectorAll(".color-option").forEach((option) => {
    option.classList.remove("active");
  });
  element.classList.add("active");
  selectedColor = element.getAttribute("data-color");
}

function selectSize(element) {
  document.querySelectorAll(".size-option").forEach((option) => {
    option.classList.remove("active");
  });
  element.classList.add("active");
  selectedSize = element.getAttribute("data-size");
}

function changeMainImage(element) {
  const mainImage = document.getElementById("mainImage");
  if (!mainImage) return;

  const imgSrc = element.getAttribute("data-img");
  mainImage.src = imgSrc;
  document.querySelectorAll(".thumbnail").forEach((thumb) => {
    thumb.classList.remove("active");
  });
  element.classList.add("active");
}

function increaseQuantity() {
  const quantityInput = document.getElementById("quantityInput");
  if (!quantityInput) return;

  let currentValue = Number.parseInt(quantityInput.value);
  if (currentValue < 10) {
    currentValue++;
    quantityInput.value = currentValue;
    quantity = currentValue;
  }
}

function decreaseQuantity() {
  const quantityInput = document.getElementById("quantityInput");
  if (!quantityInput) return;

  let currentValue = Number.parseInt(quantityInput.value);
  if (currentValue > 1) {
    currentValue--;
    quantityInput.value = currentValue;
    quantity = currentValue;
  }
}

function addToCart() {
  if (!currentProduct) return;

  const quantityInput = document.getElementById("quantityInput");
  if (!quantityInput) return;

  const quantity = Number.parseInt(quantityInput.value);

  if (isNaN(quantity) || quantity < 1) {
    showNotification("Jumlah produk tidak valid", "error");
    return;
  }

  let cart = [];
  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }
  } catch (error) {
    console.error("Error parsing cart:", error);
    showNotification("Terjadi kesalahan saat memuat keranjang", "error");
    return;
  }

  const existingItemIndex = cart.findIndex(
    (item) => item.id === currentProduct.id && item.color === selectedColor && item.size === selectedSize
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.images?.[0] || currentProduct.image,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
    });
  }

  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showNotification(`${currentProduct.name} berhasil ditambahkan ke keranjang!`);
    showCartSidebar();
  } catch (error) {
    console.error("Error saving cart:", error);
    showNotification("Terjadi kesalahan saat menyimpan keranjang", "error");
  }
}

function buyNow() {
  console.log("Buy now clicked");
  addToCart();
  setTimeout(() => {
    window.location.href = "../keranjang/keranjang.html";
  }, 1000);
}

function toggleWishlist() {
  const wishlistBtn = document.getElementById("wishlistBtn");
  if (!wishlistBtn) return;

  const icon = wishlistBtn.querySelector("i");
  if (icon.classList.contains("far")) {
    icon.classList.remove("far");
    icon.classList.add("fas");
    showNotification("Produk ditambahkan ke wishlist!");
  } else {
    icon.classList.remove("fas");
    icon.classList.add("far");
    showNotification("Produk dihapus dari wishlist!");
  }
}

function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });
  const tabContent = document.getElementById(tabId);
  if (tabContent) tabContent.classList.add("active");

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  const tabBtn = document.querySelector(`[data-tab="${tabId}"]`);
  if (tabBtn) tabBtn.classList.add("active");
}

function showCartSidebar() {
  console.log("Showing cart sidebar");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartSidebar = document.getElementById("cartSidebar");
  if (cartOverlay && cartSidebar) {
    cartOverlay.style.display = "block";
    cartSidebar.classList.add("open");
    document.body.style.overflow = "hidden";
    updateCartSidebar();
  } else {
    console.error("Cart overlay or sidebar not found");
  }
}

function hideCartSidebar() {
  console.log("Hiding cart sidebar");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartSidebar = document.getElementById("cartSidebar");
  if (cartOverlay && cartSidebar) {
    cartOverlay.style.display = "none";
    cartSidebar.classList.remove("open");
    document.body.style.overflow = "";
  } else {
    console.error("Cart overlay or sidebar not found");
  }
}

function updateCartSidebar() {
  console.log("Updating cart sidebar");
  const cartItems = document.getElementById("cartItems");
  const cartFooter = document.getElementById("cartFooter");
  const emptyCart = document.getElementById("emptyCart");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems || !cartFooter || !emptyCart || !cartTotal) {
    console.error("Cart sidebar elements not found");
    return;
  }

  let cart = [];
  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }
  } catch (error) {
    console.error("Error parsing cart:", error);
    showNotification("Terjadi kesalahan saat memuat keranjang", "error");
    return;
  }

  if (cart.length === 0) {
    emptyCart.style.display = "flex";
    cartFooter.style.display = "none";
    return;
  }

  emptyCart.style.display = "none";
  cartFooter.style.display = "block";
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
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
    `;
    cartItems.appendChild(cartItem);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = formatPrice(total);
}

function updateCartItemQuantity(index, newQuantity) {
  console.log(`Updating cart item quantity: index=${index}, newQuantity=${newQuantity}`);
  let cart = [];
  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }
  } catch (error) {
    console.error("Error parsing cart:", error);
    showNotification("Terjadi kesalahan saat memuat keranjang", "error");
    return;
  }

  if (index < 0 || index >= cart.length) return;

  if (newQuantity <= 0) {
    removeCartItem(index);
    return;
  }

  if (newQuantity > 10) {
    newQuantity = 10;
  }

  cart[index].quantity = newQuantity;
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartSidebar();
    updateCartCount();
  } catch (error) {
    console.error("Error saving cart:", error);
    showNotification("Terjadi kesalahan saat menyimpan keranjang", "error");
  }
}

function removeCartItem(index) {
  console.log(`Removing cart item: index=${index}`);
  let cart = [];
  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }
  } catch (error) {
    console.error("Error parsing cart:", error);
    showNotification("Terjadi kesalahan saat memuat keranjang", "error");
    return;
  }

  if (index < 0 || index >= cart.length) return;

  cart.splice(index, 1);
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartSidebar();
    updateCartCount();
    showNotification("Produk dihapus dari keranjang");
  } catch (error) {
    console.error("Error saving cart:", error);
    showNotification("Terjadi kesalahan saat menyimpan keranjang", "error");
  }
}

function updateCartCount() {
  console.log("Updating cart count");
  const cartCount = document.getElementById("cartCount");
  if (!cartCount) return;

  let cart = [];
  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }
  } catch (error) {
    console.error("Error parsing cart:", error);
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function parsePrice(priceString) {
  if (typeof priceString === "number") return priceString;
  if (typeof priceString === "string") {
    const numericString = priceString.replace(/[^0-9.]/g, "");
    const normalizedString = numericString.replace(/\./g, "");
    return Number.parseInt(normalizedString) || 0;
  }
  return 0;
}

if (!document.querySelector("style[data-notification-styles]")) {
  const style = document.createElement("style");
  style.setAttribute("data-notification-styles", "true");
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
      font-family: 'Poppins', sans-serif;
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
  `;
  document.head.appendChild(style);
}

function showNotification(message, type = "success") {
  console.log(`Showing notification: ${message}, type: ${type}`);
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === "error" ? "fa-exclamation-circle" : "fa-check-circle"}"></i>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(notification);
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function setupEventListeners() {
  console.log("Setting up event listeners");
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      showTab(tabId);
    });
  });

  const minusBtn = document.getElementById("minusBtn");
  const plusBtn = document.getElementById("plusBtn");
  if (minusBtn && plusBtn) {
    minusBtn.addEventListener("click", decreaseQuantity);
    plusBtn.addEventListener("click", increaseQuantity);
  }

  const quantityInput = document.getElementById("quantityInput");
  if (quantityInput) {
    quantityInput.addEventListener("change", function () {
      let value = Number.parseInt(this.value);
      if (isNaN(value) || value < 1) {
        value = 1;
      } else if (value > 10) {
        value = 10;
      }
      this.value = value;
      quantity = value;
    });
  }

  const addToCartBtn = document.getElementById("addToCartBtn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", addToCart);
  }

  const buyNowBtn = document.getElementById("buyNowBtn");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", buyNow);
  }

  const wishlistBtn = document.getElementById("wishlistBtn");
  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", toggleWishlist);
  }

  const cartIcon = document.getElementById("cartIcon");
  if (cartIcon) {
    cartIcon.addEventListener("click", (e) => {
      e.preventDefault();
      showCartSidebar();
    });
  }

  const closeCart = document.getElementById("closeCart");
  const cartOverlay = document.getElementById("cartOverlay");
  if (closeCart && cartOverlay) {
    closeCart.addEventListener("click", hideCartSidebar);
    cartOverlay.addEventListener("click", hideCartSidebar);
  }

  document.querySelectorAll(".add-to-cart-related").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      console.log("Add to cart related clicked");
      const productCard = this.closest(".product-card");
      const productId = productCard.getAttribute("data-id");

      let products = [];
      try {
        const storedProducts = localStorage.getItem("products");
        if (storedProducts) {
          products = JSON.parse(storedProducts);
        }
      } catch (error) {
        console.error("Error parsing products:", error);
        showNotification("Terjadi kesalahan saat memuat produk", "error");
        return;
      }

      const product = products.find((p) => p.id == productId);

      if (product) {
        let cart = [];
        try {
          const storedCart = localStorage.getItem("cart");
          if (storedCart) {
            cart = JSON.parse(storedCart);
          }
        } catch (error) {
          console.error("Error parsing cart:", error);
          showNotification("Terjadi kesalahan saat memuat keranjang", "error");
          return;
        }

        const defaultColor = product.colors?.[0] || "Default";
        const defaultSize = product.sizes?.[1] || product.sizes?.[0] || "M";
        const existingItemIndex = cart.findIndex(
          (item) => item.id === product.id && item.color === defaultColor && item.size === defaultSize
        );

        if (existingItemIndex > -1) {
          cart[existingItemIndex].quantity += 1;
        } else {
          cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || product.image,
            color: defaultColor,
            size: defaultSize,
            quantity: 1,
          });
        }

        try {
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartCount();
          showNotification(`${product.name} berhasil ditambahkan ke keranjang!`);
          showCartSidebar();
        } catch (error) {
          console.error("Error saving cart:", error);
          showNotification("Terjadi kesalahan saat menyimpan keranjang", "error");
        }
      } else {
        showNotification("Produk tidak ditemukan", "error");
      }
    });
  });

  document.querySelectorAll(".view-product").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const productCard = this.closest(".product-card");
      const productId = productCard.getAttribute("data-id");
      window.location.href = `detail_produk.html?id=${productId}`;
    });
  });

  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      window.location.href = `detail_produk.html?id=${productId}`;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM content loaded");
  loadProductDetail();
  updateCartCount();
});