console.log('mobile-menu.js chargé');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM entièrement chargé, initialisation du menu mobile...');
    // Sélection des éléments
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const body = document.body;
    
    // Fonction pour basculer le menu
    function toggleMenu() {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Empêcher le défilement du corps lorsque le menu est ouvert
        if (nav.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }
    
    // Ajouter le gestionnaire d'événements
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
    }
    
    // Fermer le menu lors du clic sur un lien
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Fermer le menu lors d'un clic en dehors
    document.addEventListener('click', function(e) {
        if (nav.classList.contains('active') && !nav.contains(e.target) && e.target !== menuToggle) {
            toggleMenu();
        }
    });
    
    // Éviter la propagation des clics à l'intérieur du menu
    if (nav) {
        nav.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});
    
    // Fermer le menu lors du clic sur un lien
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Fermer le menu lors d'un clic en dehors
    document.addEventListener('click', function(e) {
        if (nav && nav.classList.contains('active') && !nav.contains(e.target) && e.target !== menuToggle) {
            toggleMenu();
        }
    });
    
    // Éviter la propagation des clics à l'intérieur du menu
    if (nav) {
        nav.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        // Si on passe en mode desktop, on réinitialise le menu
        if (window.innerWidth > 768) {
            if (nav && nav.classList.contains('active')) {
                toggleMenu();
            }
        }
    });
});
