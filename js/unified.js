/**
 * Alture & Co. - Unified JavaScript
 * This file consolidates multiple JS files to improve performance
 * Created: June 2025
 */

// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initBackToTop();
    initServiceCards();
    initContactForm();
    initLoadingAnimation();
});

// Navigation Functions
function initNavigation() {
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    // Sticky header on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    // Reveal elements on scroll
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = function() {
        scrollRevealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('revealed');
            }
        });
    };
    
    // Initial check
    revealOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Service Cards Hover Effects
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('active');
        });
    });
}

// Contact Form Handler
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const formStatusMessage = document.getElementById('formStatusMessage');
    const submitButton = document.getElementById('submitButton');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Change button state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Send form data to Formspree
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    // Success message
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#4CAF50';
                    formStatusMessage.textContent = 'Thank you for your message. We will be in touch shortly.';
                    contactForm.reset();
                } else {
                    // Error message
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#D14D72';
                    formStatusMessage.textContent = 'There was an error sending your message. Please try again later.';
                }
            })
            .catch(error => {
                // Network error message
                formStatus.style.display = 'block';
                formStatus.style.color = '#D14D72';
                formStatusMessage.textContent = 'There was a network error. Please try again later.';
                console.error('Error:', error);
            })
            .finally(() => {
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
                
                // Scroll to form status message
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Hide status message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            });
        });
    }
}

// Loading Animation
function initLoadingAnimation() {
    const loader = document.querySelector('.loader-wrapper');
    
    if (loader) {
        // Hide loader after page load
        window.addEventListener('load', function() {
            setTimeout(function() {
                loader.style.opacity = '0';
                setTimeout(function() {
                    loader.style.display = 'none';
                }, 500);
            }, 500);
        });
    }
}

// Property Gallery Functions (for properties.html)
function initPropertyGallery() {
    // Initialize modal
    const modal = document.getElementById('property-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const closeBtn = document.getElementsByClassName('close-modal')[0];
    
    if (modal) {
        // Add click event to all gallery items
        const galleryItems = document.querySelectorAll('.property-item');
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                modal.style.display = 'flex';
                modalImg.src = this.querySelector('img').src;
                modalTitle.textContent = this.querySelector('h4').textContent;
                modalDesc.textContent = this.querySelector('.property-description').textContent;
                
                // Disable scrolling on body when modal is open
                document.body.style.overflow = 'hidden';
                
                // Add animation class
                setTimeout(() => {
                    modal.classList.add('modal-active');
                }, 10);
            });
        });
        
        // Close modal when clicking the close button
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeModal();
            });
        }
        
        // Close modal when clicking outside the image
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // Function to close the modal
        function closeModal() {
            modal.classList.remove('modal-active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
        
        // Filter gallery items
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filter === 'all') {
                        item.style.display = 'block';
                    } else if (item.classList.contains(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
}

// Check if we're on the properties page and initialize property gallery
if (document.querySelector('.properties-container')) {
    document.addEventListener('DOMContentLoaded', function() {
        initPropertyGallery();
    });
}
