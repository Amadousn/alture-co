// Dark Mode and Enhanced Animations for Alture & Co.

document.addEventListener('DOMContentLoaded', function() {
    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Check for saved theme preference or respect OS preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Update icon
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Enhanced Animations
    
    // Intersection Observer for scroll animations
    const animatedElements = document.querySelectorAll('.animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = entry.target.dataset.delay || '0s';
                entry.target.style.animationDuration = entry.target.dataset.duration || '1s';
                entry.target.style.opacity = 1;
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Staggered animations for groups of elements
    const staggeredGroups = document.querySelectorAll('.stagger-animation');
    
    staggeredGroups.forEach(group => {
        const children = Array.from(group.children);
        const baseDelay = parseFloat(group.dataset.baseDelay) || 0;
        const increment = parseFloat(group.dataset.increment) || 0.1;
        
        children.forEach((child, index) => {
            child.classList.add('animate', 'fade-in');
            child.style.animationDelay = `${baseDelay + (index * increment)}s`;
        });
    });
    
    // Parallax effect for sections with .parallax class
    window.addEventListener('scroll', function() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            const speed = element.dataset.speed || 0.5;
            element.style.backgroundPositionY = `${scrollPosition * speed}px`;
        });
    });
});
