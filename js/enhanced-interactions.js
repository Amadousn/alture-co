// Enhanced interactions for Alture & Co.

document.addEventListener('DOMContentLoaded', function() {
    // Create scroll progress indicator
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    // Update scroll progress indicator
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    });

    // Add scroll reveal animations
    const revealElements = document.querySelectorAll('.who-we-are h2, .who-we-are .section-divider, .who-we-are .intro-text, .value-item, .what-we-offer h2, .what-we-offer .section-divider, .service-card, .strategic-vision h2, .strategic-vision .section-divider, .strategic-vision p, .women-wealth h2, .women-wealth .section-divider, .women-wealth p, .team h2, .team .section-divider, .team-member, .properties-section h2, .properties-section .section-divider, .properties-section .intro-text, .property-card, .contact h2, .contact .section-divider, .contact-form');
    
    revealElements.forEach(element => {
        element.classList.add('scroll-reveal');
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.scroll-reveal').forEach(element => {
        observer.observe(element);
    });

    // Enhanced form interactions
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    formInputs.forEach(input => {
        // Add focus animation
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Enhanced form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Clear form
            contactForm.reset();
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you for your message. We will get back to you soon.';
            successMessage.style.cssText = `
                background-color: rgba(62, 0, 47, 0.1);
                color: var(--deep-plum);
                padding: 20px;
                margin-top: 20px;
                border-radius: 5px;
                text-align: center;
                border-left: 4px solid var(--deep-plum);
            `;
            
            contactForm.appendChild(successMessage);
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.style.opacity = '0';
                successMessage.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    contactForm.removeChild(successMessage);
                }, 500);
            }, 5000);
        });
    }

    // Enhanced navigation
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            if (scrollPosition < window.innerHeight) {
                hero.style.backgroundPositionY = `calc(50% + ${scrollPosition * 0.4}px)`;
            }
        });
    }

    // Add background image to hero section if not already present
    if (hero && !hero.style.backgroundImage) {
        hero.style.backgroundImage = 'url("https://images.unsplash.com/photo-1582672060674-bc2bd808a8f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")';
        hero.style.backgroundSize = 'cover';
        hero.style.backgroundPosition = 'center';
    }

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
});
