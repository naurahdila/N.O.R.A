document.addEventListener("DOMContentLoaded", function () {
  // Update cart count
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartCount.textContent = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  // Article filter
  const filterBtns = document.querySelectorAll(".filter-btn");
  const articleCards = document.querySelectorAll(".article-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      filterBtns.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Get filter value
      const filterValue = this.getAttribute("data-filter");

      // Filter articles
      articleCards.forEach((card) => {
        if (
          filterValue === "all" ||
          card.getAttribute("data-category") === filterValue
        ) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Search functionality
  const searchInput = document.querySelector(".articles-search input");
  const searchButton = document.querySelector(".articles-search button");

  function searchArticles() {
    const searchValue = searchInput.value.toLowerCase();

    articleCards.forEach((card) => {
      const title = card
        .querySelector(".article-card-title")
        .textContent.toLowerCase();
      const excerpt = card
        .querySelector(".article-card-excerpt")
        .textContent.toLowerCase();

      if (title.includes(searchValue) || excerpt.includes(searchValue)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  searchButton.addEventListener("click", searchArticles);

  searchInput.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      searchArticles();
    }
  });
});
