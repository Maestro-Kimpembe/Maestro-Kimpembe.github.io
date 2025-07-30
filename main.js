// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced hover effects for cards (Already handled by CSS transitions)
// The JS part for transform is removed as CSS handles it better
document.querySelectorAll('.family-card, .place-card, .welcome-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        // This can be purely handled by CSS transform transition
    });
    
    card.addEventListener('mouseleave', function() {
        // This can be purely handled by CSS transform transition
    });
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Family members navigation
let currentFamilyPage = 1;
const totalFamilyPages = 6;

function changeFamilyPage(direction) {
    const newPage = currentFamilyPage + direction;
    
    if (newPage < 1 || newPage > totalFamilyPages) {
        return;
    }
    
    currentFamilyPage = newPage;
    showFamilyPage(currentFamilyPage);
    updateNavigationButtons();
    updatePageIndicator();
}

function showFamilyPage(pageNumber) {
    const familyCards = document.querySelectorAll('.family-card');
    
    // Hide all cards first
    familyCards.forEach(card => {
        card.classList.remove('active');
        card.style.display = 'none';
    });
    
    // Show cards for current page with animation
    setTimeout(() => {
        familyCards.forEach(card => {
            if (card.getAttribute('data-page') == pageNumber) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.classList.add('active');
                }, 50);
            }
        });
    }, 100);
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentFamilyPage === 1;
        nextBtn.disabled = currentFamilyPage === totalFamilyPages;
    }
}

function updatePageIndicator() {
    const dots = document.querySelectorAll('.page-dot');
    dots.forEach((dot, index) => {
        if (index + 1 === currentFamilyPage) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Initialize family page on load
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.family-grid')) {
        showFamilyPage(1);
        updateNavigationButtons();
        updatePageIndicator();
        
        // Add click handlers for page dots
        document.querySelectorAll('.page-dot').forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentFamilyPage = index + 1;
                showFamilyPage(currentFamilyPage);
                updateNavigationButtons();
                updatePageIndicator();
            });
        });
    }
    
    // Fade in animation for cards
    const cards = document.querySelectorAll('.family-card, .place-card, .welcome-card, .trip-section'); // Added .trip-section for fade-in
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Unobserve after animation for performance, unless cards are re-hidden
                // For family cards, they are re-hidden, so not unobserving
                if (!entry.target.classList.contains('family-card')) {
                     observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Image lazy loading for better performance
function lazyLoadImages() {
    // Select all images that need lazy loading. This might include background images set via style.
    const images = document.querySelectorAll('.family-image, .place-image, .trip-photo img'); // Added .trip-photo img

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // For direct img tags
                if (img.tagName === 'IMG' && img.getAttribute('data-src')) {
                    img.src = img.getAttribute('data-src'); // Use data-src for actual image source
                    img.removeAttribute('data-src'); // Remove data-src to prevent re-loading
                } 
                // For background images (family-image, place-image)
                else if (img.style.backgroundImage && img.getAttribute('data-bg')) {
                    img.style.backgroundImage = `url('${img.getAttribute('data-bg')}')`;
                    img.removeAttribute('data-bg');
                }
                
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        // Store original source in data-attributes
        if (img.tagName === 'IMG' && img.src) {
            img.setAttribute('data-src', img.src);
            img.src = ''; // Clear src to prevent eager loading
        } else if (img.style.backgroundImage) {
            const bgUrlMatch = img.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
            if (bgUrlMatch && bgUrlMatch[1]) {
                img.setAttribute('data-bg', bgUrlMatch[1]);
                img.style.backgroundImage = 'none'; // Clear background image
            }
        }
        imageObserver.observe(img);
    });
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lazyLoadImages);
} else {
    lazyLoadImages();
}

// Add click effect for buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        let ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);

        let x = e.clientX - e.target.offsetLeft;
        let y = e.clientY - e.target.offsetTop;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Error handling for images
document.querySelectorAll('.family-image, .place-image, .trip-photo img').forEach(img => { // Added .trip-photo img
    img.addEventListener('error', function() {
        this.classList.add('error'); // Add error class for CSS styling
        this.src = ''; // Clear src to prevent broken image icon, if it's an <img> tag
        this.style.backgroundImage = 'none'; // Clear background image, if it's for background-image
        
        // Check if it's a background-image element or an actual <img> tag
        if (this.classList.contains('family-image') || this.classList.contains('place-image')) {
            this.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 0.9em; text-align: center;">Zdjęcie niedostępne</div>';
        } else if (this.tagName === 'IMG') {
            // For <img> tags, rely on CSS ::after or similar for fallback content
            this.alt = 'Zdjęcie niedostępne'; // Update alt text
        }
    });
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});