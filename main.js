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

// Enhanced hover effects for cards
document.querySelectorAll('.family-card, .place-card, .welcome-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Family members navigation
let currentFamilyPage = 1;
const totalFamilyPages = 5;

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
    const cards = document.querySelectorAll('.family-card, .place-card, .welcome-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
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
    const images = document.querySelectorAll('.family-image, .place-image');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
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
document.querySelectorAll('.family-image, .place-image').forEach(img => {
    img.addEventListener('error', function() {
        this.style.backgroundColor = '#f0f0f0';
        this.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">Zdjęcie niedostępne</div>';
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