/**
 * Alture & Co. - Corrections JavaScript pour mobile
 * Ce script s'assure que les corrections sont appliquées même si le CSS échoue
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour vérifier si l'appareil est mobile
    function isMobile() {
        return window.innerWidth <= 767 || 
               navigator.userAgent.match(/Android/i) || 
               navigator.userAgent.match(/iPhone|iPad|iPod/i);
    }
    
    // Fonction pour masquer la section Who We Are sur mobile
    function hideWhoWeAreOnMobile() {
        if (isMobile()) {
            // Masquer la section Who We Are
            const whoWeAreSection = document.getElementById('who-we-are');
            if (whoWeAreSection) {
                whoWeAreSection.style.display = 'none';
                whoWeAreSection.style.visibility = 'hidden';
                whoWeAreSection.style.height = '0';
                whoWeAreSection.style.overflow = 'hidden';
                whoWeAreSection.style.opacity = '0';
                whoWeAreSection.style.position = 'absolute';
                whoWeAreSection.style.left = '-9999px';
            }
            
            // Masquer tous les éléments avec la classe who-we-are
            const whoWeAreElements = document.querySelectorAll('.who-we-are');
            whoWeAreElements.forEach(function(element) {
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                element.style.height = '0';
                element.style.overflow = 'hidden';
            });
            
            // Masquer les liens vers la section Who We Are
            const whoWeAreLinks = document.querySelectorAll('a[href="#who-we-are"]');
            whoWeAreLinks.forEach(function(link) {
                link.style.display = 'none';
                link.style.visibility = 'hidden';
                link.style.width = '0';
                link.style.height = '0';
                link.style.overflow = 'hidden';
            });
            
            // Ajuster le titre pour qu'il s'affiche correctement
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                heroTitle.style.fontSize = '2rem';
                heroTitle.style.lineHeight = '1.3';
                heroTitle.style.whiteSpace = 'normal';
                heroTitle.style.overflowWrap = 'break-word';
                heroTitle.style.wordWrap = 'break-word';
                heroTitle.style.wordBreak = 'normal';
                heroTitle.style.maxWidth = '100%';
                heroTitle.style.width = '100%';
                heroTitle.style.padding = '0 15px';
                heroTitle.style.margin = '0 auto 15px auto';
                heroTitle.style.textAlign = 'center';
                
                // Forcer l'affichage des mots du titre sur des lignes séparées
                const titleSpans = heroTitle.querySelectorAll('span');
                titleSpans.forEach(function(span) {
                    if (!span.classList.contains('mobile-break')) {
                        span.style.display = 'block';
                        span.style.marginBottom = '5px';
                    }
                });
            }
        }
    }
    
    // Appliquer les corrections immédiatement
    hideWhoWeAreOnMobile();
    
    // Réappliquer les corrections lors du redimensionnement de la fenêtre
    window.addEventListener('resize', hideWhoWeAreOnMobile);
    
    // Réappliquer les corrections après le chargement complet de la page
    window.addEventListener('load', hideWhoWeAreOnMobile);
});
