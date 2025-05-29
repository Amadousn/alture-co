// Loading animation script for Alture & Co.

document.addEventListener('DOMContentLoaded', function() {
    // Add 'loaded' class to body after DOM is loaded
    document.body.classList.add('loaded');
    
    // Hide preloader after a short delay
    setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
        }
    }, 800);
    
    // Handle page transitions
    const links = document.querySelectorAll('a[href^="/"]:not([target]), a[href^="./"]:not([target]), a[href^="../"]:not([target])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle internal links
            if (this.hostname === window.location.hostname) {
                e.preventDefault();
                const href = this.getAttribute('href');
                
                // Create transition element if it doesn't exist
                let transition = document.querySelector('.page-transition');
                if (!transition) {
                    transition = document.createElement('div');
                    transition.className = 'page-transition';
                    document.body.appendChild(transition);
                }
                
                // Activate transition
                transition.classList.add('active');
                
                // Navigate to new page after transition
                setTimeout(function() {
                    window.location.href = href;
                }, 600);
            }
        });
    });
    
    // Initialize scroll reveal animations
    const scrollRevealItems = document.querySelectorAll('.scroll-reveal');
    
    // Create observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all scroll reveal items
    scrollRevealItems.forEach(item => {
        observer.observe(item);
    });
    
    // Update scroll progress indicator
    const scrollProgress = document.querySelector('.scroll-progress');
    
    if (scrollProgress) {
        window.addEventListener('scroll', function() {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            
            scrollProgress.style.width = scrollPercentage + '%';
        });
    }
});
