/**
 * Alture & Co. - Properties Interaction Script
 * Script pour améliorer l'interaction avec les propriétés immobilières
 */

document.addEventListener('DOMContentLoaded', function() {
    // Filtrage des propriétés
    const filterButtons = document.querySelectorAll('.filter-btn');
    const propertyItems = document.querySelectorAll('.property-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Obtenir le filtre sélectionné
            const filter = this.getAttribute('data-filter');
            
            // Filtrer les propriétés
            propertyItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    // Animation subtile pour les éléments qui apparaissent
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Modal pour les propriétés
    const propertyImages = document.querySelectorAll('.property-image img');
    const modal = document.getElementById('property-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeModal = document.querySelector('.close-modal');
    
    propertyImages.forEach(image => {
        image.addEventListener('click', function() {
            const propertyItem = this.closest('.property-item');
            const title = propertyItem.querySelector('h4').textContent;
            const description = propertyItem.querySelector('.property-description').textContent;
            
            modalImg.src = this.src;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 50);
        });
    });
    
    closeModal.addEventListener('click', function() {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
    
    // Fermer la modal en cliquant en dehors
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });
    
    // Animation au défilement pour les propriétés
    const animateOnScroll = function() {
        const items = document.querySelectorAll('.stagger-animation > *');
        
        items.forEach((item, index) => {
            const baseDelay = parseFloat(item.closest('.stagger-animation').getAttribute('data-base-delay') || '0');
            const increment = parseFloat(item.closest('.stagger-animation').getAttribute('data-increment') || '0.1');
            const delay = baseDelay + (index * increment);
            
            if (isElementInViewport(item) && !item.classList.contains('animated')) {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    item.classList.add('animated');
                }, delay * 1000);
            }
        });
    };
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Exécuter l'animation au chargement et au défilement
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
});
