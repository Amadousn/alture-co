console.log('🔍 Mobile menu script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM is ready');
    
    // Éléments du DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-navigation');
    const body = document.body;
    
    // Log pour vérifier que les éléments sont bien sélectionnés
    console.log('Menu toggle element:', menuToggle);
    console.log('Navigation element:', nav);
    
    if (!menuToggle) console.error('❌ Menu toggle button not found!');
    if (!nav) console.error('❌ Navigation element not found!');

    // Créer l'overlay s'il n'existe pas
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }

    // Fonction pour ouvrir/fermer le menu
    function toggleMenu() {
        const isMobile = window.innerWidth <= 992;
        if (!isMobile) return;

        const isOpening = !nav.classList.contains('is-open');
        
        // Basculer les classes
        nav.classList.toggle('is-open');
        overlay.classList.toggle('is-visible');
        menuToggle.setAttribute('aria-expanded', isOpening);
        
        // Empêcher le défilement du corps quand le menu est ouvert
        body.style.overflow = isOpening ? 'hidden' : '';
        
        // Focus management pour l'accessibilité
        if (isOpening) {
            const firstLink = nav.querySelector('a');
            if (firstLink) firstLink.focus();
        } else {
            menuToggle.focus();
        }
    }
    
    // Vérifier que les éléments existent avant d'ajouter les écouteurs
    if (menuToggle && nav) {
        console.log('✅ Menu toggle et nav trouvés');
        
        // Fonction pour gérer le clic sur les liens
        function handleLinkClick(e) {
            console.log('🔗 Clic sur un lien du menu détecté');
            if (nav.classList.contains('is-open')) {
                console.log('🔄 Fermeture du menu après clic sur lien');
                toggleMenu();
            }
            // Laisser le navigateur suivre le lien normalement
        }
        
        // Événement de clic sur le bouton du menu
        menuToggle.addEventListener('click', function(e) {
            console.log('🎯 Clic sur le bouton menu détecté');
            e.preventDefault();
            e.stopPropagation();
            console.log('🔁 Appel de toggleMenu()');
            toggleMenu();
        }, false);
        
        // Ajouter les écouteurs sur les liens de navigation
        const navLinks = document.querySelectorAll('.nav-link');
        console.log(`🔗 ${navLinks.length} liens de navigation trouvés`);
        
        navLinks.forEach(link => {
            // Supprimer d'abord tous les écouteurs existants pour éviter les doublons
            link.removeEventListener('click', handleLinkClick);
            // Puis ajouter le nouvel écouteur
            link.addEventListener('click', handleLinkClick, false);
        });
        
        // Gérer le clic sur l'overlay
        overlay.addEventListener('click', function(e) {
            console.log('🌑 Clic sur l\'overlay détecté');
            toggleMenu();
            e.stopPropagation();
        }, false);
        
        // Fermer avec la touche Échap
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                console.log('⎋ Touche Échap détectée, fermeture du menu');
                toggleMenu();
            }
        }, false);
        
        // Empêcher la propagation des clics à l'intérieur du menu
        nav.addEventListener('click', function(e) {
            e.stopPropagation();
        }, false);
    }
    
    // Gérer le redimensionnement de la fenêtre
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 992 && nav && nav.classList.contains('is-open')) {
                nav.classList.remove('is-open');
                overlay.classList.remove('is-visible');
                body.style.overflow = '';
                menuToggle.setAttribute('aria-expanded', false);
            }
        }, 100);
    });
});
