// gallery-modal.js
console.log('Gallery Modal JS loaded successfully');

// Variables globales
let currentSlideIndex = 0;
let currentProperty = null;

// Fonction pour ouvrir la modale avec la propriété sélectionnée
function openModal(property) {
    console.log('=== gallery-modal.js: openModal appelée ===');
    console.log('Propriété reçue:', property);
    console.log('ID de la propriété:', property ? property.id : 'non défini');
    
    if (!property) {
        console.error('Erreur: Aucune propriété fournie à openModal');
        return;
    }
    
    currentProperty = property;
    
    // Mettre à jour le contenu de la modale avec les données de la propriété
    document.getElementById('modal-property-title').textContent = property.title;
    document.getElementById('modal-property-price').textContent = property.price;
    document.getElementById('modal-property-location').textContent = property.location;
    document.getElementById('modal-property-description').textContent = property.fullDesc || property.description;
    
    // Mettre à jour les caractéristiques
    updateFeatures(property);
    
    // Mettre à jour la galerie d'images
    updateGallery(property);
    
    // Mettre à jour le bouton WhatsApp
    updateWhatsAppButton(property);
    
    // Afficher la modale
    showModal();
    
    // Initialiser les événements
    initModalEvents();
}

// Mettre à jour les caractéristiques de la propriété
function updateFeatures(property) {
    const featuresContainer = document.getElementById('modal-property-features');
    featuresContainer.innerHTML = `
        <div class="feature-item">
            <i class="fas fa-bed"></i>
            <span>${property.bedrooms} Chambres</span>
        </div>
        <div class="feature-item">
            <i class="fas fa-bath"></i>
            <span>${property.bathrooms} SDB</span>
        </div>
        <div class="feature-item">
            <i class="fas fa-ruler-combined"></i>
            <span>${property.surface}</span>
        </div>
        ${property.parking ? `
        <div class="feature-item">
            <i class="fas fa-car"></i>
            <span>${property.parking} Parking</span>
        </div>` : ''}
        ${property.year ? `
        <div class="feature-item">
            <i class="far fa-calendar-alt"></i>
            <span>${property.year}</span>
        </div>` : ''}
    `;
}

// Mettre à jour la galerie d'images
function updateGallery(property) {
    const mainImage = document.getElementById('modal-main-image');
    const thumbnailsContainer = document.getElementById('modal-thumbnails');
    
    // Vider les miniatures existantes
    thumbnailsContainer.innerHTML = '';
    
    // Ajouter les nouvelles miniatures
    if (property.images && property.images.length > 0) {
        property.images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail' + (index === 0 ? ' active' : '');
            thumbnail.innerHTML = `<img src="${image}" alt="${property.title} - Image ${index + 1}">`;
            
            // Ajouter un gestionnaire d'événements pour changer l'image principale au clic
            thumbnail.addEventListener('click', () => {
                goToSlide(index);
            });
            
            thumbnailsContainer.appendChild(thumbnail);
        });
        
        // Définir la première image comme image principale
        goToSlide(0);
    } else {
        // Afficher une image par défaut si aucune image n'est disponible
        mainImage.src = 'path/to/default-image.jpg';
        mainImage.alt = 'Image non disponible';
    }
}

// Mettre à jour le bouton WhatsApp
function updateWhatsAppButton(property) {
    const whatsappBtn = document.getElementById('whatsapp-button');
    if (whatsappBtn) {
        const message = encodeURIComponent(`Bonjour, je suis intéressé(e) par la propriété "${property.title}" (${property.price}). Pourriez-vous m'en dire plus ?`);
        whatsappBtn.href = `https://wa.me/971509845622?text=${message}`;
        console.log('Bouton WhatsApp mis à jour avec le lien:', whatsappBtn.href);
    } else {
        console.error('Bouton WhatsApp non trouvé');
    }
}

// Afficher la modale
function showModal() {
    console.log('=== gallery-modal.js: showModal appelée ===');
    
    try {
        // Récupérer l'élément modal
        const modal = document.getElementById('property-modal');
        
        // Vérifier que la modale existe
        if (!modal) {
            console.error('ERREUR: Élément avec l\'ID "property-modal" non trouvé dans le DOM');
            console.log('Contenu du body:', document.body.innerHTML);
            return;
        }
        
        console.log('Élément modal trouvé:', modal);
        console.log('Classes avant ajout de "active":', modal.className);
        
        // Ajouter la classe active
        modal.classList.add('active');
        
        // Désactiver le défilement de la page
        document.body.style.overflow = 'hidden';
        
        // Vérifier si nous sommes sur un appareil mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            // Prévenir le défilement sur mobile
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${window.scrollY}px`;
        }
        
        console.log('Classes après ajout de "active":', modal.className);
        console.log('Style overflow du body:', document.body.style.overflow);
        
        // Vérifier si la classe a bien été ajoutée
        const hasActiveClass = modal.classList.contains('active');
        console.log('La classe "active" est-elle présente?', hasActiveClass);
        
        if (!hasActiveClass) {
            console.error('ERREUR: La classe "active" n\'a pas pu être ajoutée à l\'élément modal');
        }
        
        // Donner le focus à la modale pour la navigation au clavier
        modal.setAttribute('aria-hidden', 'false');
        modal.setAttribute('tabindex', '-1');
        modal.focus();
        
        // Envoyer un événement personnalisé pour indiquer que la modale est ouverte
        const modalOpenedEvent = new CustomEvent('modalOpened', { detail: { property: currentProperty } });
        document.dispatchEvent(modalOpenedEvent);
        
        console.log('Modale affichée avec succès');
        
    } catch (error) {
        console.error('Erreur lors de l\'affichage de la modale:', error);
    }
}

// Fermer la modale
function closeModal() {
    console.log('Fermeture de la modale...');
    
    const modal = document.getElementById('property-modal');
    if (!modal) {
        console.error('La modale n\'a pas pu être trouvée dans le DOM');
        return;
    }
    
    // Retirer la classe active
    modal.classList.remove('active');
    console.log('Classe "active" retirée de la modale');
    
    // Réactiver le défilement de la page
    document.body.style.overflow = 'auto';
    console.log('Défilement de la page réactivé');
    
    // Nettoyer les écouteurs d'événements
    if (typeof modal._cleanup === 'function') {
        console.log('Nettoyage des écouteurs d\'événements...');
        try {
            modal._cleanup();
            console.log('Nettoyage des écouteurs d\'événements terminé');
        } catch (error) {
            console.error('Erreur lors du nettoyage des écouteurs d\'événements:', error);
        }
    } else {
        console.log('Aucune fonction de nettoyage à exécuter');
    }
    
    console.log('Modale fermée avec succès');
    
    // Réinitialiser l'index du slide
    currentSlideIndex = 0;
}

// Gestionnaire d'événements clavier
function handleKeyDown(e) {
    // Vérifier si la modale est ouverte
    const modal = document.getElementById('property-modal');
    if (!modal || !modal.classList.contains('active')) {
        return; // Ne rien faire si la modale n'est pas ouverte
    }
    
    console.log('Touche pressée:', e.key);
    
    // Gérer les touches fléchées et Échap
    switch (e.key) {
        case 'Escape':
            console.log('Touche Échap détectée, fermeture de la modale');
            closeModal();
            e.preventDefault();
            break;
            
        case 'ArrowLeft':
            console.log('Flèche gauche détectée, passage au slide précédent');
            prevSlide();
            e.preventDefault();
            break;
            
        case 'ArrowRight':
            console.log('Flèche droite détectée, passage au slide suivant');
            nextSlide();
            e.preventDefault();
            break;
    }
}

// Aller à un slide spécifique
function goToSlide(index) {
    console.log(`goToSlide appelé avec l'index: ${index}`);
    
    // Vérifier les prérequis
    if (!currentProperty || !currentProperty.images || currentProperty.images.length === 0) {
        console.error('Erreur: Aucune propriété ou images disponibles');
        return;
    }
    
    // Vérifier que l'index est valide
    if (index < 0 || index >= currentProperty.images.length) {
        console.error(`Erreur: L'index ${index} est en dehors des limites`);
        return;
    }
    
    // Récupérer les éléments du DOM
    const mainImage = document.getElementById('modal-main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (!mainImage) {
        console.error('Erreur: Image principale non trouvée');
        return;
    }
    
    console.log(`Changement vers l'image ${index + 1}/${currentProperty.images.length}`);
    
    try {
        // Mettre à jour l'index courant
        currentSlideIndex = index;
        
        // Précharger l'image avant de l'afficher
        const img = new Image();
        img.onload = function() {
            console.log(`Image chargée: ${currentProperty.images[currentSlideIndex]}`);
            // Mettre à jour la source de l'image principale
            mainImage.src = currentProperty.images[currentSlideIndex];
            mainImage.alt = `${currentProperty.title} - Image ${currentSlideIndex + 1}`;
            
            // Animation de transition
            mainImage.style.opacity = 0;
            setTimeout(() => {
                mainImage.style.opacity = 1;
                console.log('Transition terminée');
            }, 50);
        };
        
        img.onerror = function() {
            console.error(`Erreur de chargement de l'image: ${currentProperty.images[currentSlideIndex]}`);
        };
        
        img.src = currentProperty.images[currentSlideIndex];
        
        // Mettre à jour les miniatures actives
        thumbnails.forEach((thumb, i) => {
            if (i === currentSlideIndex) {
                thumb.classList.add('active');
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                thumb.classList.remove('active');
            }
        });
        
        console.log(`Slide ${currentSlideIndex + 1} affiché avec succès`);
        
    } catch (error) {
        console.error('Erreur lors du changement de slide:', error);
    }
}

// Aller au slide précédent
function prevSlide() {
    goToSlide(currentSlideIndex - 1);
}

// Aller au slide suivant
function nextSlide() {
    goToSlide(currentSlideIndex + 1);
}

// Gestionnaire d'événements clavier
function handleKeyDown(e) {
    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
}

// Initialiser les événements de la modale
function initModalEvents() {
    console.log('Initialisation des événements de la modale...');
    
    const modal = document.getElementById('property-modal');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const closeBtn = document.querySelector('.close-modal');
    
    // Vérifier que tous les éléments nécessaires existent
    if (!modal || !prevBtn || !nextBtn || !closeBtn) {
        console.error('Éléments de la modale non trouvés:', {
            modal: !!modal,
            prevBtn: !!prevBtn,
            nextBtn: !!nextBtn,
            closeBtn: !!closeBtn
        });
        return;
    }
    
    console.log('Tous les éléments de la modale ont été trouvés');
    
    // Gestionnaires d'événements
    function handlePrevClick(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Bouton précédent cliqué');
        prevSlide();
    }
    
    function handleNextClick(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Bouton suivant cliqué');
        nextSlide();
    }
    
    // Ajouter les écouteurs d'événements
    try {
        prevBtn.addEventListener('click', handlePrevClick);
        nextBtn.addEventListener('click', handleNextClick);
        closeBtn.addEventListener('click', closeModal);
        document.addEventListener('keydown', handleKeyDown);
        
        // Fermer en cliquant en dehors du contenu
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                console.log('Clic en dehors de la modale détecté');
                closeModal();
            }
        });
        
        console.log('Tous les écouteurs d\'événements ont été ajoutés');
        
        // Fonction de nettoyage
        modal._cleanup = function() {
            console.log('Nettoyage des écouteurs d\'événements de la modale');
            prevBtn.removeEventListener('click', handlePrevClick);
            nextBtn.removeEventListener('click', handleNextClick);
            closeBtn.removeEventListener('click', closeModal);
            document.removeEventListener('keydown', handleKeyDown);
            modal.removeEventListener('click', arguments.callee);
        };
    } catch (error) {
        console.error('Erreur lors de l\'ajout des écouteurs d\'événements:', error);
    }
}

// Aller au slide précédent
function prevSlide() {
    console.log('Passage au slide précédent');
    if (!currentProperty || !currentProperty.images || currentProperty.images.length === 0) {
        console.error('Aucune propriété ou images disponibles pour la navigation');
        return;
    }
    
    // Aller au slide précédent (avec boucle si nécessaire)
    const newIndex = (currentSlideIndex - 1 + currentProperty.images.length) % currentProperty.images.length;
    console.log('Nouvel index:', newIndex);
    goToSlide(newIndex);
}

// Aller au slide suivant
function nextSlide() {
    console.log('Passage au slide suivant');
    if (!currentProperty || !currentProperty.images || currentProperty.images.length === 0) {
        console.error('Aucune propriété ou images disponibles pour la navigation');
        return;
    }
    
    // Aller au slide suivant (avec boucle si nécessaire)
    const newIndex = (currentSlideIndex + 1) % currentProperty.images.length;
    console.log('Nouvel index:', newIndex);
    goToSlide(newIndex);
}

// Exporter les fonctions nécessaires
window.GalleryModal = {
    open: openModal,
    close: closeModal
};

// Message de débogage pour confirmer le chargement du fichier
console.log('GalleryModal module initialized', {
    open: typeof openModal,
    close: typeof closeModal,
    isGalleryModalDefined: window.GalleryModal !== undefined
});

// S'assurer que le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM entièrement chargé - GalleryModal prêt');
    console.log('Élément modal:', document.getElementById('property-modal'));
});
