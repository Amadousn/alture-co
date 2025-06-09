/**
 * Alture & Co. - Enhanced Gallery Script
 * Script pour la galerie de propriétés améliorée avec fonctionnalités d'upload
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de la galerie
    initGallery();
    
    // Initialisation de la modal
    initModal();
    
    // Initialisation de l'interface d'upload (si l'utilisateur est connecté)
    initUploadInterface();
});

/**
 * Initialise la galerie de propriétés avec filtrage et animations
 */
function initGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const propertyItems = document.querySelectorAll('.property-item');
    
    // Animation au défilement
    const animateOnScroll = function() {
        propertyItems.forEach((item, index) => {
            if (isElementInViewport(item) && !item.classList.contains('animated')) {
                setTimeout(() => {
                    item.classList.add('animated');
                }, index * 100); // Délai progressif pour l'effet de cascade
            }
        });
    };
    
    // Vérifier si un élément est visible dans la fenêtre
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Filtrage des propriétés
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
                    setTimeout(() => {
                        item.classList.add('animated');
                    }, 50);
                } else {
                    item.classList.remove('animated');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Exécuter l'animation au chargement et au défilement
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Déclencher l'animation initiale
    setTimeout(animateOnScroll, 300);
}

/**
 * Initialise la modal de détail des propriétés avec galerie d'images
 */
function initModal() {
    const propertyItems = document.querySelectorAll('.property-item');
    const modal = document.getElementById('property-modal');
    const closeModal = document.querySelector('.close-modal');
    
    // Ouvrir la modal au clic sur une propriété
    propertyItems.forEach(item => {
        item.addEventListener('click', function() {
            // Récupérer les données de la propriété
            const title = this.querySelector('h4').textContent;
            const description = this.querySelector('.property-description').textContent;
            const price = this.querySelector('.property-price').textContent;
            const mainImage = this.querySelector('.property-image img').src;
            const category = this.classList.contains('luxury') ? 'Luxury' : 
                            this.classList.contains('residential') ? 'Residential' : 'Commercial';
            
            // Récupérer les caractéristiques (si disponibles)
            let features = [];
            const metaItems = this.querySelectorAll('.property-meta span');
            metaItems.forEach(meta => {
                features.push(meta.textContent);
            });
            
            // Afficher la modal avec les données de la propriété
            displayPropertyModal(title, description, price, mainImage, category, features);
            
            // Afficher la modal
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 50);
        });
    });
    
    // Fermer la modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
    }
    
    // Fermer la modal en cliquant en dehors
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });
}

/**
 * Affiche les détails d'une propriété dans la modal
 */
function displayPropertyModal(title, description, price, mainImage, category, features) {
    // Mettre à jour le contenu de la modal
    const modalContent = document.querySelector('.modal-content');
    
    // Créer le HTML pour la modal
    let modalHTML = `
        <div class="modal-gallery">
            <img src="${mainImage}" alt="${title}" class="modal-main-image">
            <div class="modal-thumbnails">
                <div class="modal-thumbnail active">
                    <img src="${mainImage}" alt="${title}">
                </div>
                <!-- Les autres miniatures seront ajoutées dynamiquement si disponibles -->
            </div>
        </div>
        <div class="modal-details">
            <h3 class="modal-title">${title}</h3>
            <div class="modal-price">${price}</div>
            <div class="modal-features">
                <h4>Property Details</h4>
                <div class="features-list">
    `;
    
    // Ajouter les caractéristiques
    features.forEach(feature => {
        modalHTML += `
            <div class="feature-item">
                <i class="fas fa-check-circle"></i>
                <span>${feature}</span>
            </div>
        `;
    });
    
    // Ajouter la catégorie
    modalHTML += `
                <div class="feature-item">
                    <i class="fas fa-tag"></i>
                    <span>${category}</span>
                </div>
            </div>
        </div>
        <p class="modal-description">${description}</p>
        <a href="#contact" class="modal-cta">Enquire Now</a>
    </div>
    `;
    
    // Mettre à jour le contenu de la modal
    modalContent.innerHTML = modalHTML;
    
    // Initialiser les miniatures si elles existent
    initThumbnails();
}

/**
 * Initialise les miniatures dans la modal
 */
function initThumbnails() {
    const thumbnails = document.querySelectorAll('.modal-thumbnail');
    const mainImage = document.querySelector('.modal-main-image');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Retirer la classe active de toutes les miniatures
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            
            // Ajouter la classe active à la miniature cliquée
            this.classList.add('active');
            
            // Mettre à jour l'image principale
            mainImage.src = this.querySelector('img').src;
        });
    });
}

/**
 * Initialise l'interface d'upload pour les clients
 */
function initUploadInterface() {
    // Vérifier si l'élément d'upload existe
    const uploadSection = document.querySelector('.admin-upload-section');
    if (!uploadSection) return;
    
    const fileInput = document.getElementById('property-images');
    const uploadContainer = document.querySelector('.image-upload-container');
    const previewContainer = document.querySelector('.upload-preview');
    const propertyForm = document.getElementById('property-upload-form');
    
    // Gérer le glisser-déposer
    if (uploadContainer) {
        uploadContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#D14D72';
        });
        
        uploadContainer.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
        });
        
        uploadContainer.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
            
            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                updateImagePreview(fileInput.files);
            }
        });
        
        uploadContainer.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // Mettre à jour l'aperçu des images
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            updateImagePreview(this.files);
        });
    }
    
    // Fonction pour mettre à jour l'aperçu des images
    function updateImagePreview(files) {
        if (!previewContainer) return;
        
        // Vider le conteneur d'aperçu
        previewContainer.innerHTML = '';
        
        // Ajouter chaque image à l'aperçu
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Vérifier si le fichier est une image
            if (!file.type.startsWith('image/')) continue;
            
            // Créer un élément d'aperçu
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            // Créer l'image
            const img = document.createElement('img');
            img.file = file;
            previewItem.appendChild(img);
            
            // Créer le bouton de suppression
            const removeBtn = document.createElement('div');
            removeBtn.className = 'preview-remove';
            removeBtn.innerHTML = '×';
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                previewItem.remove();
                // Note: La suppression réelle du fichier nécessiterait un FileList mutable,
                // ce qui n'est pas directement possible. Dans une implémentation réelle,
                // on utiliserait un tableau de fichiers personnalisé.
            });
            previewItem.appendChild(removeBtn);
            
            // Ajouter l'élément d'aperçu au conteneur
            previewContainer.appendChild(previewItem);
            
            // Lire le fichier et afficher l'aperçu
            const reader = new FileReader();
            reader.onload = (function(aImg) {
                return function(e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);
        }
    }
    
    // Gérer la soumission du formulaire
    if (propertyForm) {
        propertyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Dans une implémentation réelle, on enverrait les données au serveur
            // Pour cette démo, on affiche simplement un message de confirmation
            alert('Property submitted successfully! In a real implementation, this would be saved to a database.');
            
            // Réinitialiser le formulaire
            this.reset();
            if (previewContainer) previewContainer.innerHTML = '';
        });
    }
}
