/**
 * Alture & Co. - Mobile Navigation Script
 * Script pour gérer la navigation mobile
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner les éléments nécessaires
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    
    // Si le bouton de navigation existe
    if (navToggle) {
        // Ajouter un écouteur d'événement pour le clic
        navToggle.addEventListener('click', function() {
            // Basculer la classe active sur la navigation
            nav.classList.toggle('active');
            // Basculer la classe active sur le bouton
            this.classList.toggle('active');
        });
        
        // Fermer le menu lorsqu'on clique sur un lien
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Fermer le menu lorsqu'on clique en dehors
        document.addEventListener('click', function(event) {
            if (nav.classList.contains('active') && 
                !nav.contains(event.target) && 
                !event.target.classList.contains('nav-toggle') &&
                !event.target.closest('.nav-toggle')) {
                nav.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
});
