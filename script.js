document.addEventListener("DOMContentLoaded", () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn")
    const navLinks = document.getElementById("navLinks")
  
    // Toggle mobile menu
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileMenuBtn.classList.toggle("active")
        navLinks.classList.toggle("active")
      })
    }
  
    // Close mobile menu when clicking outside
    document.addEventListener("click", (event) => {
      if (navLinks && mobileMenuBtn && !navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        mobileMenuBtn.classList.remove("active")
        navLinks.classList.remove("active")
      }
    })
  
    // Close mobile menu when window is resized
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && navLinks && mobileMenuBtn) {
        mobileMenuBtn.classList.remove("active")
        navLinks.classList.remove("active")
      }
    })
  
    // Auto-scroll for promo slider
    const promoSlider = document.querySelector(".promo-slider")
    if (promoSlider) {
      let isDown = false
      let startX
      let scrollLeft
  
      promoSlider.addEventListener("mousedown", (e) => {
        isDown = true
        startX = e.pageX - promoSlider.offsetLeft
        scrollLeft = promoSlider.scrollLeft
      })
  
      promoSlider.addEventListener("mouseleave", () => {
        isDown = false
      })
  
      promoSlider.addEventListener("mouseup", () => {
        isDown = false
      })
  
      promoSlider.addEventListener("mousemove", (e) => {
        if (!isDown) return
        e.preventDefault()
        const x = e.pageX - promoSlider.offsetLeft
        const walk = (x - startX) * 2
        promoSlider.scrollLeft = scrollLeft - walk
      })
    }
  
    // Add button click handlers
    const buttons = document.querySelectorAll("button")
    buttons.forEach((button) => {
      button.addEventListener("click", function (e) {
        // Create ripple effect
        const ripple = document.createElement("span")
        ripple.classList.add("ripple")
        this.appendChild(ripple)
  
        // Get position
        const x = e.clientX - e.target.getBoundingClientRect().left
        const y = e.clientY - e.target.getBoundingClientRect().top
  
        ripple.style.left = `${x}px`
        ripple.style.top = `${y}px`
  
        // Remove ripple
        setTimeout(() => {
          ripple.remove()
        }, 600)
  
        // Handle specific button actions
        if (this.classList.contains("detail-btn")) {
          e.stopPropagation()
          const bimbelName = this.closest(".bimbel-card").querySelector("h3").textContent
          alert(`Menampilkan detail untuk: ${bimbelName}`)
        }
      })
    })
  
    // Add click handlers for service cards
    const serviceCards = document.querySelectorAll(".service-card")
    serviceCards.forEach((card) => {
      card.addEventListener("click", function () {
        const serviceName = this.querySelector("h3").textContent
        let category = ""
  
        // Determine which category was clicked
        switch (serviceName) {
          case "Bimbel Pas":
            category = "bimbel-pas"
            break
          case "Terdekat":
            category = "terdekat"
            break
          case "Andalan":
            category = "andalan"
            break
          case "Terjangkau":
            category = "terjangkau"
            break
          default:
            category = "semua"
        }
  
        // Redirect to category page with the selected category
        window.location.href = `category.html?category=${category}`
      })
    })
  
    // Add click handlers for top rated bimbel cards
    const topRatedCards = document.querySelectorAll(".top-rated .bimbel-card")
    topRatedCards.forEach((card) => {
      card.addEventListener("click", function (e) {
        // Don't trigger if clicking the detail button
        if (!e.target.classList.contains("detail-btn") && !e.target.closest(".detail-btn")) {
          const bimbelName = this.querySelector("h3").textContent
          window.location.href = `detail.html?bimbel=${encodeURIComponent(bimbelName)}`
        }
      })
    })
  
    // Add click handlers for bimbel cards
    const bimbelCards = document.querySelectorAll(".bimbel-card")
    bimbelCards.forEach((card) => {
      card.addEventListener("click", function (e) {
        // Don't trigger if clicking the detail button
        if (!e.target.classList.contains("detail-btn") && !e.target.closest(".detail-btn")) {
          const bimbelName = this.querySelector("h3").textContent
          window.location.href = `detail.html?bimbel=${encodeURIComponent(bimbelName)}`
        }
      })
    })
  
    // Add click handlers for mobile nav items
    const navItems = document.querySelectorAll(".mobile-nav .nav-item")
    navItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault()
  
        // Remove active class from all items
        navItems.forEach((navItem) => navItem.classList.remove("active"))
  
        // Add active class to clicked item
        this.classList.add("active")
  
        const navName = this.querySelector("span").textContent
  
        // Navigate based on menu item
        switch (navName) {
          case "Beranda":
            window.location.href = "index.html"
            break
          case "Bimbel":
            window.location.href = "category.html?category=semua"
            break
          case "Tentor":
            window.location.href = "tentor.html"
            break
          case "Promo":
            window.location.href = "promo.html"
            break
          case "Akun":
            window.location.href = "profile.html"
            break
          default:
            window.location.href = "index.html"
        }
      })
    })
  })
  
  document.addEventListener("DOMContentLoaded", () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn")
    const mobileNav = document.getElementById("mobileNav")
  
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
  
    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target) && mobileNav.classList.contains("active")) {
        mobileNav.classList.remove("active")
        document.body.classList.remove("no-scroll")
        mobileMenuBtn.classList.remove("active")
        mobileMenuBtn.children[0].style.transform = "none"
        mobileMenuBtn.children[1].style.opacity = "1"
        mobileMenuBtn.children[2].style.transform = "none"
      }
    })
  
    // Product Filter
    const filterBtns = document.querySelectorAll(".filter-btn")
    const productCards = document.querySelectorAll(".product-card")
  
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active class from all buttons
        filterBtns.forEach((btn) => btn.classList.remove("active"))
  
        // Add active class to clicked button
        this.classList.add("active")
  
        // Get filter value
        const filterValue = this.getAttribute("data-filter")
  
        // Filter products
        productCards.forEach((card) => {
          if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
            card.style.display = "block"
          } else {
            card.style.display = "none"
          }
        })
      })
    })
  
    // Testimonial Slider
    const testimonialDots = document.querySelectorAll(".testimonial-dots .dot")
    const testimonialSlider = document.querySelector(".testimonial-slider")
  
    testimonialDots.forEach((dot, index) => {
      dot.addEventListener("click", function () {
        // Remove active class from all dots
        testimonialDots.forEach((dot) => dot.classList.remove("active"))
  
        // Add active class to clicked dot
        this.classList.add("active")
  
        // Calculate scroll position
        const cardWidth = document.querySelector(".testimonial-card").offsetWidth
        const gap = 30 // Gap between cards
        const scrollPosition = index * (cardWidth + gap)
  
        // Scroll to position
        testimonialSlider.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        })
      })
    })
  
    // Back to Top Button
    const backToTopBtn = document.getElementById("backToTop")
  
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
  
    // Product Actions
    const actionBtns = document.querySelectorAll(".action-btn")
  
    actionBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault()
  
        const icon = this.querySelector("i")
  
        if (icon.classList.contains("fa-heart") || icon.classList.contains("fa-heart-o")) {
          // Toggle wishlist
          if (icon.classList.contains("far")) {
            icon.classList.remove("far")
            icon.classList.add("fas")
            showNotification("Produk ditambahkan ke wishlist")
          } else {
            icon.classList.remove("fas")
            icon.classList.add("far")
            showNotification("Produk dihapus dari wishlist")
          }
        } else if (icon.classList.contains("fa-shopping-bag")) {
          // Add to cart
          const cartCount = document.querySelector(".cart-count")
          cartCount.textContent = Number.parseInt(cartCount.textContent) + 1
          showNotification("Produk ditambahkan ke keranjang")
        } else if (icon.classList.contains("fa-eye")) {
          // Quick view
          showNotification("Quick view akan segera hadir")
        }
      })
    })
  
    // Show notification
    function showNotification(message) {
      // Create notification element
      const notification = document.createElement("div")
      notification.className = "notification"
      notification.textContent = message
  
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
          document.body.removeChild(notification)
        }, 300)
      }, 3000)
    }
  
    // Add notification styles
    const style = document.createElement("style")
    style.textContent = `
          .notification {
              position: fixed;
              bottom: 20px;
              left: 20px;
              background-color: var(--primary-color);
              color: var(--text-color);
              padding: 10px 20px;
              border-radius: var(--border-radius);
              box-shadow: var(--shadow);
              transform: translateY(100px);
              opacity: 0;
              transition: all 0.3s ease;
              z-index: 9999;
          }
          
          .notification.show {
              transform: translateY(0);
              opacity: 1;
          }
          
          .no-scroll {
              overflow: hidden;
          }
      `
    document.head.appendChild(style)
  })
  