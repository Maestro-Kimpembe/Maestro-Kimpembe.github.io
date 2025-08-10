// Theme Management System
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || this.getSystemTheme();
        this.init();
    }

    init() {
        // Apply saved theme on page load
        document.documentElement.setAttribute('data-theme', this.theme);
        
        // Set up toggle button
        const toggleButton = document.getElementById('themeToggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                if (!localStorage.getItem('theme')) {
                    this.theme = this.getSystemTheme();
                    this.applyTheme();
                }
            });
        }

        // Set initial theme if no preference is saved
        if (!localStorage.getItem('theme')) {
            this.theme = this.getSystemTheme();
            this.applyTheme();
        }
    }

    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        
        // Dispatch custom event for other components that might need to know about theme changes
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: this.theme } 
        }));
    }

    getCurrentTheme() {
        return this.theme;
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

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
    const cards = document.querySelectorAll('.family-card, .place-card, .welcome-card, .trip-section');
    
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
    const images = document.querySelectorAll('.family-image, .place-image, .trip-photo img');

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
document.querySelectorAll('.family-image, .place-image, .trip-photo img').forEach(img => {
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
    
    // Toggle theme with Ctrl/Cmd + Shift + D
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        if (window.themeManager) {
            window.themeManager.toggleTheme();
        }
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Theme change animation
window.addEventListener('themeChanged', function(e) {
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
});

document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Navbar Scroll Functionality
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Image Modal/Lightbox Functionality
    // This check prevents errors on pages without the modal HTML
    const modal = document.getElementById('imageModal');

    if (modal) {
        const modalImage = document.getElementById('modalImage');
        const modalVideo = document.getElementById('modalVideo');
        const modalCaption = document.getElementById('caption');
        const closeBtn = document.querySelector('.close-btn');

        // Get all the images and videos that should trigger the modal
        const mediaItems = document.querySelectorAll('.family-image, .trip-photo img, .trip-video video');

        mediaItems.forEach(item => {
            item.style.cursor = 'pointer';

            item.addEventListener('click', function() {
                let src;
                let altText = '';
                
                // Check if the clicked item is a video
                if (this.tagName === 'VIDEO') {
                    // Find the source from the child <source> tag
                    const sourceElement = this.querySelector('source');
                    if (sourceElement) {
                        src = sourceElement.src;
                        altText = this.getAttribute('alt') || '';
                    }

                    if (src) {
                        modalVideo.src = src;
                        modalVideo.style.display = 'block';
                        modalImage.style.display = 'none';
                        modalVideo.play();
                    }
                } else { // Handle images
                    src = this.tagName === 'IMG' ? this.src : this.getAttribute('data-bg');
                    altText = this.alt || (this.closest('.family-card')?.querySelector('h3')?.textContent) || '';

                    modalImage.src = src;
                    modalImage.style.display = 'block';
                    modalVideo.style.display = 'none';
                    modalVideo.pause();
                    modalVideo.currentTime = 0;
                }
                
                modalCaption.textContent = altText;
                modal.classList.add('visible');
            });
        });

        // Close the modal when the close button is clicked
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('visible');
            modalVideo.pause();
            modalVideo.currentTime = 0;
        });

        // Close the modal if the user clicks anywhere outside the modal content
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.remove('visible');
                modalVideo.pause();
                modalVideo.currentTime = 0;
            }
        });
    }
});
// NEW POP-UP GALLERY FUNCTIONALITY
document.addEventListener('DOMContentLoaded', () => {
    const galleryPhotos = document.querySelectorAll('.trip-photo img');
    if (galleryPhotos.length > 0) {
        let currentImageIndex = 0;
        let imagesArray = Array.from(galleryPhotos);

        // Function to create the lightbox HTML elements
        const createLightbox = () => {
            const lightboxOverlay = document.createElement('div');
            lightboxOverlay.id = 'lightbox-overlay';
            lightboxOverlay.className = 'lightbox-overlay';

            const lightboxContainer = document.createElement('div');
            lightboxContainer.className = 'lightbox-container';

            const lightboxImg = document.createElement('img');
            lightboxImg.id = 'lightbox-img';
            lightboxImg.className = 'lightbox-img';

            const lightboxCaption = document.createElement('span');
            lightboxCaption.className = 'lightbox-caption';
            lightboxCaption.id = 'lightbox-caption';

            const closeBtn = document.createElement('button');
            closeBtn.id = 'lightbox-close-btn';
            closeBtn.className = 'lightbox-close-btn';
            closeBtn.innerHTML = '&times;';

            const prevBtn = document.createElement('button');
            prevBtn.className = 'lightbox-nav-btn prev';
            prevBtn.innerHTML = '&#10094;';

            const nextBtn = document.createElement('button');
            nextBtn.className = 'lightbox-nav-btn next';
            nextBtn.innerHTML = '&#10095;';

            lightboxContainer.appendChild(lightboxImg);
            lightboxContainer.appendChild(lightboxCaption);
            lightboxOverlay.appendChild(lightboxContainer);
            lightboxOverlay.appendChild(closeBtn);
            lightboxOverlay.appendChild(prevBtn);
            lightboxOverlay.appendChild(nextBtn);

            document.body.appendChild(lightboxOverlay);

            return { lightboxOverlay, lightboxImg, lightboxCaption, closeBtn, prevBtn, nextBtn };
        };

        const { lightboxOverlay, lightboxImg, lightboxCaption, closeBtn, prevBtn, nextBtn } = createLightbox();

        // Function to open the lightbox with the correct image source
        const openLightbox = (imgSrc, imgAlt, startIndex) => {
            currentImageIndex = startIndex;
            lightboxImg.src = imgSrc;
            lightboxCaption.textContent = imgAlt;
            lightboxOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
            updateNavButtons();
        };

        // Function to close the lightbox
        const closeLightbox = () => {
            lightboxOverlay.classList.remove('show');
            document.body.style.overflow = '';
        };

        // Function to change the image in the lightbox
        const changeImage = (direction) => {
            currentImageIndex += direction;
            if (currentImageIndex < 0) {
                currentImageIndex = imagesArray.length - 1;
            } else if (currentImageIndex >= imagesArray.length) {
                currentImageIndex = 0;
            }
            const newImage = imagesArray[currentImageIndex];
            // Use src if loaded, fallback to data-src if present
            lightboxImg.src = newImage.src || newImage.dataset.src || '';
            lightboxCaption.textContent = newImage.alt;
            updateNavButtons();
        };

        const updateNavButtons = () => {
            prevBtn.style.display = imagesArray.length > 1 ? 'flex' : 'none';
            nextBtn.style.display = imagesArray.length > 1 ? 'flex' : 'none';
        };

        // Event listeners for opening the lightbox
        imagesArray.forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                const imgSrc = img.src || img.dataset.src || '';
                const imgAlt = img.alt;
                openLightbox(imgSrc, imgAlt, index);
            });
        });

        // Event listeners for closing and navigation
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            changeImage(-1);
        });
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            changeImage(1);
        });

        // Keyboard navigation for lightbox
        document.addEventListener('keydown', (e) => {
            if (!lightboxOverlay.classList.contains('show')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') changeImage(-1);
            if (e.key === 'ArrowRight') changeImage(1);
        });

        // Close lightbox when clicking outside the container
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) closeLightbox();
        });
    }
});
// Error handling for images
document.querySelectorAll('.family-image, .place-image, .trip-photo img').forEach(img => {
    // Store original alt text
    const originalAlt = img.alt;

    img.addEventListener('error', function() {
        this.classList.add('error'); // Add error class for CSS styling
        this.src = ''; // Clear src to prevent broken image icon, if it's an <img> tag
        this.style.backgroundImage = 'none'; // Clear background image, if it's for background-image

        // Check if it's a background-image element or an actual <img> tag
        if (this.classList.contains('family-image') || this.classList.contains('place-image')) {
            this.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 0.9em; text-align: center;">Zdjęcie niedostępne</div>';
        } else if (this.tagName === 'IMG') {
            this.alt = 'Zdjęcie niedostępne'; // Update alt text
        }
    });

    // Restore original alt text on successful load
    img.addEventListener('load', function() {
        if (this.tagName === 'IMG') {
            this.alt = originalAlt;
        }
        this.classList.remove('error');
    });
});
// --- POP-UP VIDEO MODAL FUNCTIONALITY ---
document.addEventListener('DOMContentLoaded', () => {
    // Create modal HTML if not present
    if (!document.getElementById('videoModal')) {
        const modal = document.createElement('div');
        modal.id = 'videoModal';
        modal.className = 'video-modal';

        const closeBtn = document.createElement('span');
        closeBtn.className = 'video-modal-close';
        closeBtn.innerHTML = '&times;';

        const videoPlayer = document.createElement('video');
        videoPlayer.id = 'videoModalPlayer';
        videoPlayer.controls = true;

        modal.appendChild(closeBtn);
        modal.appendChild(videoPlayer);
        document.body.appendChild(modal);
    }

    const modal = document.getElementById('videoModal');
    const modalPlayer = document.getElementById('videoModalPlayer');
    const closeBtn = modal.querySelector('.video-modal-close');

    // Open modal when any .trip-video video is clicked
    document.querySelectorAll('.trip-video video').forEach(video => {
        video.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Use currentSrc if available, fallback to <source> or .src
            let src = video.currentSrc || (video.querySelector('source')?.src) || video.src;
            modalPlayer.src = src;
            modalPlayer.poster = video.poster || '';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            modalPlayer.currentTime = 0;
            modalPlayer.play();
        });
    });

    // Close modal on close button
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        modalPlayer.pause();
        modalPlayer.src = '';
        document.body.style.overflow = '';
    });

    // Close modal when clicking outside video
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            modalPlayer.pause();
            modalPlayer.src = '';
            document.body.style.overflow = '';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('show') && e.key === 'Escape') {
            modal.classList.remove('show');
            modalPlayer.pause();
            modalPlayer.src = '';
            document.body.style.overflow = '';
        }
    });
});