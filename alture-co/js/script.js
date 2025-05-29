// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
    }, 1500);
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('nav').classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('nav').classList.remove('active');
    });
});

// Smooth reveal animations on scroll
document.addEventListener('DOMContentLoaded', () => {
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });

    // Observe team members
    document.querySelectorAll('.team-member').forEach(member => {
        member.classList.add('fade-in');
        observer.observe(member);
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .service-card, .team-member {
        transition-delay: calc(var(--i, 0) * 0.1s);
    }
`;
document.head.appendChild(style);

// Set transition delays for staggered animations
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.setProperty('--i', index);
});

document.querySelectorAll('.team-member').forEach((member, index) => {
    member.style.setProperty('--i', index);
});

// Form submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send the form data to a server
        // For now, we'll just show a success message
        
        // Clear form
        contactForm.reset();
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for your message. We will get back to you soon.';
        successMessage.style.cssText = `
            background-color: rgba(255, 255, 255, 0.1);
            color: #F4F1EC;
            padding: 15px;
            margin-top: 20px;
            border-radius: 3px;
            text-align: center;
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

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition < window.innerHeight) {
        hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    }
});

// Add subtle hover effects to navigation
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transition = 'color 0.3s ease, transform 0.3s ease';
        link.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
    });
});

// Add elegant cursor effect
const cursorEffect = () => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 1px solid rgba(62, 0, 47, 0.5);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
        transition: width 0.3s, height 0.3s, border-color 0.3s;
        display: none;
    `;
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorDot.style.cssText = `
        position: fixed;
        width: 5px;
        height: 5px;
        background-color: rgba(62, 0, 47, 0.8);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
        display: none;
    `;
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.display = 'block';
        cursorDot.style.display = 'block';
        
        // Smooth follow for main cursor
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        // Immediate follow for dot
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
    });
    
    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .service-card, .team-member');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderColor = 'rgba(176, 93, 130, 0.5)';
            cursorDot.style.backgroundColor = 'rgba(176, 93, 130, 0.8)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderColor = 'rgba(62, 0, 47, 0.5)';
            cursorDot.style.backgroundColor = 'rgba(62, 0, 47, 0.8)';
        });
    });
    
    // Hide on mobile devices
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        cursorDot.style.display = 'none';
    }
};

// Initialize cursor effect only on non-touch devices
if (!('ontouchstart' in window)) {
    cursorEffect();
}

// Add subtle image parallax effect to team section
const teamSection = document.querySelector('.team');
if (teamSection) {
    window.addEventListener('scroll', () => {
        const teamRect = teamSection.getBoundingClientRect();
        if (teamRect.top < window.innerHeight && teamRect.bottom > 0) {
            const scrollPercentage = (window.innerHeight - teamRect.top) / (window.innerHeight + teamRect.height);
            document.querySelectorAll('.team-member').forEach((member, index) => {
                const offset = (index % 2 === 0) ? 1 : -1;
                member.style.transform = `translateY(${scrollPercentage * 20 * offset}px)`;
            });
        }
    });
}

// Add animated underline effect to section headings
document.querySelectorAll('section h2').forEach(heading => {
    const underline = document.createElement('div');
    underline.className = 'heading-underline';
    underline.style.cssText = `
        height: 1px;
        width: 0;
        background-color: currentColor;
        margin: 10px auto 40px;
        transition: width 1.5s ease;
    `;
    
    heading.parentNode.insertBefore(underline, heading.nextSibling);
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                underline.style.width = '80px';
            }
        });
    }, {
        threshold: 0.5
    });
    
    observer.observe(heading);
});
