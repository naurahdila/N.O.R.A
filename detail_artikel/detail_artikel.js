document.addEventListener("DOMContentLoaded", () => {
  // Update cart count
  const cartCount = document.querySelector(".cart-count")
  if (cartCount) {
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Mobile menu functionality
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const mobileNav = document.getElementById("mobileNav")

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", function () {
      this.classList.toggle("active")
      mobileNav.classList.toggle("active")
      document.body.classList.toggle("menu-open")
    })
  }

  // Back to top button
  const backToTopBtn = document.getElementById("backToTop")

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("show")
      } else {
        backToTopBtn.classList.remove("show")
      }
    })

    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  // Comment form functionality
  const commentForm = document.querySelector(".comment-form form")

  if (commentForm) {
    commentForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const textarea = this.querySelector("textarea")
      const commentText = textarea.value.trim()

      if (commentText) {
        // In a real application, you would send this to the server
        // For now, we'll just show an alert
        alert("Komentar Anda telah dikirim dan sedang menunggu moderasi.")
        textarea.value = ""
      } else {
        alert("Silakan tulis komentar Anda terlebih dahulu.")
      }
    })
  }

  // Share functionality
  const shareLinks = document.querySelectorAll(".share-link")

  if (shareLinks.length > 0) {
    shareLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()

        const url = encodeURIComponent(window.location.href)
        const title = encodeURIComponent(document.title)
        let shareUrl

        // Get the platform from the icon class
        const icon = this.querySelector("i")

        if (icon.classList.contains("fa-facebook-f")) {
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        } else if (icon.classList.contains("fa-twitter")) {
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
        } else if (icon.classList.contains("fa-pinterest")) {
          const img = encodeURIComponent(document.querySelector(".article-featured-image img").src)
          shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${img}&description=${title}`
        } else if (icon.classList.contains("fa-whatsapp")) {
          shareUrl = `https://api.whatsapp.com/send?text=${title} ${url}`
        }

        if (shareUrl) {
          window.open(shareUrl, "_blank", "width=600,height=400")
        }
      })
    })
  }

  // Related articles hover effect
  const articleCards = document.querySelectorAll(".article-card")

  if (articleCards.length > 0) {
    articleCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        const title = this.querySelector(".article-card-title a")
        if (title) {
          title.style.color = "var(--primary-color)"
          title.style.transition = "var(--transition)"
        }
      })

      card.addEventListener("mouseleave", function () {
        const title = this.querySelector(".article-card-title a")
        if (title) {
          title.style.color = "var(--text-color)"
        }
      })
    })
  }

  // Image lightbox functionality
  const articleImages = document.querySelectorAll(".article-image img")

  if (articleImages.length > 0) {
    articleImages.forEach((img) => {
      img.style.cursor = "pointer"

      img.addEventListener("click", function () {
        // Create lightbox elements
        const lightbox = document.createElement("div")
        lightbox.className = "lightbox"
        lightbox.style.position = "fixed"
        lightbox.style.top = "0"
        lightbox.style.left = "0"
        lightbox.style.width = "100%"
        lightbox.style.height = "100%"
        lightbox.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
        lightbox.style.display = "flex"
        lightbox.style.alignItems = "center"
        lightbox.style.justifyContent = "center"
        lightbox.style.zIndex = "9999"

        const lightboxImg = document.createElement("img")
        lightboxImg.src = this.src
        lightboxImg.style.maxWidth = "90%"
        lightboxImg.style.maxHeight = "90%"
        lightboxImg.style.borderRadius = "var(--border-radius)"

        const closeBtn = document.createElement("span")
        closeBtn.innerHTML = "&times;"
        closeBtn.style.position = "absolute"
        closeBtn.style.top = "20px"
        closeBtn.style.right = "30px"
        closeBtn.style.fontSize = "40px"
        closeBtn.style.color = "white"
        closeBtn.style.cursor = "pointer"

        lightbox.appendChild(lightboxImg)
        lightbox.appendChild(closeBtn)
        document.body.appendChild(lightbox)

        // Prevent scrolling when lightbox is open
        document.body.style.overflow = "hidden"

        // Close lightbox when clicking on it
        lightbox.addEventListener("click", () => {
          document.body.removeChild(lightbox)
          document.body.style.overflow = "auto"
        })

        // Prevent closing when clicking on the image
        lightboxImg.addEventListener("click", (e) => {
          e.stopPropagation()
        })
      })
    })
  }

  // Reading time calculation
  const articleContent = document.querySelector(".article-content")

  if (articleContent) {
    // Calculate reading time based on words (average reading speed: 200 words per minute)
    const text = articleContent.textContent
    const wordCount = text.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Create reading time element
    const readingTimeEl = document.createElement("span")
    readingTimeEl.className = "article-reading-time"
    readingTimeEl.innerHTML = `<i class="far fa-clock"></i> ${readingTime} menit membaca`

    // Add to article meta
    const articleMeta = document.querySelector(".article-meta")
    if (articleMeta) {
      articleMeta.appendChild(readingTimeEl)

      // Style the reading time element
      readingTimeEl.style.display = "flex"
      readingTimeEl.style.alignItems = "center"
      readingTimeEl.style.gap = "5px"
    }
  }
})
