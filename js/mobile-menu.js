console.log('mobile-menu.js chargé');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM entièrement chargé, initialisation du menu mobile...');
    
    // Sélection des éléments
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-navigation'); // Modifié pour cibler la bonne classe
    const body = document.body;
    
    // Créer l'overlay s'il n'existe pas
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }
    
    // Fonction pour basculer le menu
    function toggleMenu() {
        const isOpening = !nav.classList.contains('is-open');
        
        // Basculer les classes
        nav.classList.toggle('is-open');
        overlay.classList.toggle('is-visible');
        menuToggle.setAttribute('aria-expanded', isOpening);
        
        // Empêcher le défilement du corps lorsque le menu est ouvert
        if (isOpening) {
            body.style.overflow = 'hidden';
            // Focus sur le premier lien du menu pour l'accessibilité
            const firstLink = nav.querySelector('a');
            if (firstLink) firstLink.focus();
        } else {
            body.style.overflow = '';
            // Remettre le focus sur le bouton menu
            menuToggle.focus();
        }
    }
    
    // Vérifier que les éléments existent avant d'ajouter les écouteurs
    if (menuToggle && nav) {
        console.log('Éléments du menu trouvés');
        
        // Gestionnaire de clic pour le bouton menu
        menuToggle.addEventListener('click', function(e) {
            console.log('Clic sur le bouton menu');
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
        
        // Fermer le menu lors du clic sur un lien
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                console.log('Clic sur un lien du menu');
                if (nav.classList.contains('is-open')) {
                    toggleMenu();
                }
            });
        });
        
        // Fermer le menu lors d'un clic sur l'overlay
        overlay.addEventListener('click', function(e) {
            console.log('Clic sur l\'overlay');
            if (nav.classList.contains('is-open')) {
                toggleMenu();
            }
        });
        
        // Fermer avec la touche Échap
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                console.log('Touche Échap pressée');
                toggleMenu();
            }
        });
        
        // Gérer le redimensionnement de la fenêtre
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 992 && nav.classList.contains('is-open')) {
                    console.log('Redimensionnement détecté, fermeture du menu');
                    toggleMenu();
                }
            }, 100);
        });
    } else {
        console.error('Erreur: Éléments du menu non trouvés');
        if (!menuToggle) console.error('Bouton menu (.menu-toggle) non trouvé');
        if (!nav) console.error('Navigation (.main-navigation) non trouvée');
    }
});
