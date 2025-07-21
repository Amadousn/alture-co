// Loading animation script for Alture & Co.

// Attendre que TOUS les CSS et ressources soient chargés
window.addEventListener('load', function() {
    // Add 'loaded' class to body after ALL resources are loaded
    document.body.classList.add('loaded');
    
    // Hide preloader after ALL CSS files and resources are fully loaded
    setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
        }
    }, 1500); // Délai réduit car on attend déjà le 'load' complet
});

// Backup: si le load prend trop de temps, forcer l'affichage après 5 secondes
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        if (preloader && !preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
        }
    }, 5000); // Sécurité: maximum 5 secondes
    
    // Simplified page transitions - OPTIMIZED
    const links = document.querySelectorAll('a[href^="/"]:not([target]), a[href^="./"]:not([target]), a[href^="../"]:not([target])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle internal links
            if (this.hostname === window.location.hostname) {
                // Direct navigation without complex transitions
                // This eliminates the instability and movements
                window.location.href = this.getAttribute('href');
            }
        });
    });
    
    // Scroll reveal animations SUPPRIMÉES pour éliminer l'instabilité
    // Les animations sont maintenant gérées par CSS uniquement
    
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
