// Mobile menu toggle
function toggleMobileMenu() {
  const navMenu = document.querySelector(".nav-menu")
  const mobileBtn = document.querySelector(".mobile-menu-btn")

  navMenu.classList.toggle("mobile-active")
  mobileBtn.classList.toggle("active")
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})


// Add scroll effect to header
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  if (window.scrollY > 100) {
    header.style.background = "linear-gradient(135deg, #000000 0%, #1a1a2e 100%)"
    header.style.backdropFilter = "blur(10px)"
    header.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.7)"
  } else {
    header.style.background = "linear-gradient(135deg, #000000 0%, #1a1a2e 100%)"
    header.style.backdropFilter = "none"
    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.5)"
  }
})

// Product card animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe all product cards
document.addEventListener("DOMContentLoaded", () => {
  const productCards = document.querySelectorAll(".product-card")
  productCards.forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(20px)"
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(card)
  })

  initializeReviewTruncation()
})

// Portfolio functionality
function openPortfolio(developer) {
  const modal = document.getElementById("portfolioModal")
  const title = document.getElementById("portfolioTitle")
  const gallery = document.getElementById("portfolioGallery")

  // Set the title based on developer
  const developerNames = {
    plut0: "Plut0's Portfolio",
    sifuhlis: "Sifuhlis's Portfolio",
    jonesegh: "Jonesegh's Portfolio",
    slick: "Slick's Portfolio",
  }

  title.textContent = developerNames[developer] || "Portfolio"

  // Clear existing gallery
  gallery.innerHTML = ""

  // Load images from the developer's folder
  loadPortfolioImages(developer, gallery)

  // Show modal
  modal.style.display = "block"
  document.body.style.overflow = "hidden" // Prevent background scrolling
}

function closePortfolio() {
  const modal = document.getElementById("portfolioModal")
  modal.style.display = "none"
  document.body.style.overflow = "auto" // Restore scrolling
}

function loadPortfolioImages(developer, gallery) {

  gallery.innerHTML = '<div class="portfolio-loading">Loading portfolio images...</div>'

  const foundImages = []
  const totalChecks = 10 // Check for 1.png through 10.png
  let completedChecks = 0

  for (let i = 1; i <= 10; i++) {
    const img = new Image()
    const imagePath = `./public/${developer}/${i}.png`

    img.onload = () => {

      const imgElement = document.createElement("img")
      imgElement.src = imagePath
      imgElement.alt = `${developer} work ${i}`
      imgElement.className = "portfolio-image"
      imgElement.onclick = () => openImageFullscreen(imagePath)

      // Remove loading message if it exists
      const loadingDiv = gallery.querySelector(".portfolio-loading")
      if (loadingDiv) {
        loadingDiv.remove()
      }

      gallery.appendChild(imgElement)
      foundImages.push(imagePath)

      completedChecks++
      checkIfComplete()
    }

    img.onerror = () => {
      completedChecks++
      checkIfComplete()
    }

    img.src = imagePath
  }

  function checkIfComplete() {
    if (completedChecks >= totalChecks) {
      const loadingDiv = gallery.querySelector(".portfolio-loading")
      if (loadingDiv) {
        loadingDiv.remove()
      }

      if (foundImages.length === 0) {
        showEmptyPortfolio(gallery, developer)
      } else {
        console.log(`Portfolio loaded for ${developer}: ${foundImages.length} images found`)
      }
    }
  }
}

function showEmptyPortfolio(gallery, developer) {
  gallery.innerHTML = `
    <div class="portfolio-empty">
      <h3>Portfolio Coming Soon!</h3>
      <p>No portfolio images found for ${developer}.</p>
      <div class="portfolio-instructions">
        <p><strong>To add portfolio images:</strong></p>
        <ol>
          <li>Create a folder: <code>${developer}/</code> in your public directory</li>
          <li>Add PNG images named: <code>1.png, 2.png, 3.png, 4.png...</code></li>
          <li>The system will automatically display them in your portfolio</li>
        </ol>
      </div>
    </div>
  `
}

function openImageFullscreen(imagePath) {
  // Create fullscreen overlay
  const overlay = document.createElement("div")
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    cursor: pointer;
  `

  const img = document.createElement("img")
  img.src = imagePath
  img.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
  `

  overlay.appendChild(img)
  document.body.appendChild(overlay)

  // Close on click
  overlay.onclick = () => {
    document.body.removeChild(overlay)
  }

  // Close on escape key
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      document.body.removeChild(overlay)
      document.removeEventListener("keydown", handleEscape)
    }
  }
  document.addEventListener("keydown", handleEscape)
}

function openReviewModal(username, rating, fullText) {
  const modal = document.getElementById("reviewModal")
  const modalUsername = document.getElementById("reviewModalUsername")
  const modalRating = document.getElementById("reviewModalRating")
  const modalText = document.getElementById("reviewModalText")

  modalUsername.textContent = username
  modalRating.innerHTML = rating
  modalText.textContent = fullText

  modal.style.display = "block"
  document.body.style.overflow = "hidden"
}

function closeReviewModal() {
  const modal = document.getElementById("reviewModal")
  modal.style.display = "none"
  document.body.style.overflow = "auto"
}

function initializeReviewTruncation() {
  const reviewTexts = document.querySelectorAll(".review-text")
  const maxLength = 200 // Character limit for reviews

  reviewTexts.forEach((reviewText, index) => {
    const fullText = reviewText.textContent.trim()

    if (fullText.length > maxLength) {
      const truncatedText = fullText.substring(0, maxLength) + "..."
      reviewText.textContent = truncatedText

      // Find the corresponding "Read Full Review" button and show it
      const reviewCard = reviewText.closest(".review-card")
      const readMoreBtn = reviewCard.querySelector(".review-btn")
      if (readMoreBtn) {
        readMoreBtn.style.display = "inline-block"
      }
    } else {
      // Hide the "Read Full Review" button for short reviews
      const reviewCard = reviewText.closest(".review-card")
      const readMoreBtn = reviewCard.querySelector(".review-btn")
      if (readMoreBtn) {
        readMoreBtn.style.display = "none"
      }
    }
  })
}

// Close modal when clicking outside
window.onclick = (event) => {
  const portfolioModal = document.getElementById("portfolioModal")
  const reviewModal = document.getElementById("reviewModal")

  if (event.target === portfolioModal) {
    closePortfolio()
  }

  if (event.target === reviewModal) {
    closeReviewModal()
  }
}

// Close modal on escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const portfolioModal = document.getElementById("portfolioModal")
    const reviewModal = document.getElementById("reviewModal")

    if (portfolioModal.style.display === "block") {
      closePortfolio()
    }

    if (reviewModal.style.display === "block") {
      closeReviewModal()
    }
  }
})
