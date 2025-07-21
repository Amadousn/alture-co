// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Properties page loaded');
    
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize gallery for each property
    initPropertyGalleries();
});

// Initialize mobile menu functionality
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
}

// Initialize property galleries
function initPropertyGalleries() {
    // Initialize for FIVE PALM JUMEIRAH
    const fivePalmImages = [
        'images/Five%20palm%20Jumeirah%203BED/image0.jpeg',
        'images/Five%20palm%20Jumeirah%203BED/image1.jpeg',
        'images/Five%20palm%20Jumeirah%203BED/image2.jpeg',
        'images/Five%20palm%20Jumeirah%203BED/image3.jpeg',
        'images/Five%20palm%20Jumeirah%203BED/image4.jpeg',
        'images/Five%20palm%20Jumeirah%203BED/image5.jpeg',
        'images/Five%20palm%20Jumeirah%203BED/image6.jpeg',
        'images/Five%20palm%20Jumeirah%203BED/image7.jpeg',
        'images/Five%20palm%20Jumeirah%203BED/image8.jpeg',
        'images/Five%20palm%20Jumeirah%203BED/image10.jpeg',
        'images/Five%20palm%20Jumeirah%203BED/image11.jpeg'
    ];
    
    // Store property data in a global object
    window.propertyData = {
        'five-palm-jumeirah': {
            images: fivePalmImages,
            title: 'FIVE PALM JUMEIRAH - 3 BEDROOM',
            currentIndex: 0
        }
    };
    
    // Initialize thumbnails for the main property
    initThumbnails('five-palm-jumeirah');
}

// Function to initialize thumbnails
function initThumbnails(propertyId) {
    const property = window.propertyData[propertyId];
    if (!property) return;
    
    const thumbnailsContainer = document.querySelector(`#${propertyId} .thumbnails`);
    if (!thumbnailsContainer) return;
    
    // Clear existing thumbnails
    thumbnailsContainer.innerHTML = '';
    
    // Add thumbnails
    property.images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = `Thumbnail ${index + 1}`;
        img.dataset.index = index;
        
        // Set first thumbnail as active
        if (index === 0) {
            img.classList.add('active');
        }
        
        img.addEventListener('click', () => {
            changeMainImage(propertyId, image, index);
        });
        
        thumbnailsContainer.appendChild(img);
    });
}

// Function to change the main image
function changeMainImage(propertyId, imageSrc, index = null) {
    const property = window.propertyData[propertyId];
    if (!property) return;
    
    // Update current index if provided
    if (index !== null) {
        property.currentIndex = index;
    }
    
    // Update main image
    const mainImage = document.querySelector(`#${propertyId} #main-image-1`);
    if (mainImage) {
        mainImage.style.opacity = 0;
        
        // Load the new image
        const img = new Image();
        img.onload = function() {
            mainImage.src = imageSrc;
            mainImage.style.opacity = 1;
            
            // Update active thumbnail
            updateActiveThumbnail(propertyId);
        };
        img.src = imageSrc;
    }
}

// Function to update active thumbnail
function updateActiveThumbnail(propertyId) {
    const property = window.propertyData[propertyId];
    if (!property) return;
    
    const thumbnails = document.querySelectorAll(`#${propertyId} .thumbnails img`);
    thumbnails.forEach((thumb, index) => {
        if (index === property.currentIndex) {
            thumb.classList.add('active');
            // Smooth scroll to active thumbnail
            thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Function to open gallery modal
function openGallery(propertyId) {
    const property = window.propertyData[propertyId];
    if (!property) return;
    
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-main-image');
    const thumbnailsContainer = document.getElementById('modal-thumbnails');
    
    if (!modal || !modalImage || !thumbnailsContainer) return;
    
    // Set the first image
    modalImage.src = property.images[property.currentIndex];
    
    // AJOUT SIMPLE : Remplir uniquement View et Floor (pas de description)
    const featuresElement = document.getElementById('propertyFeatures');
    if (featuresElement && property.view && property.floor) {
        featuresElement.innerHTML = '';
        
        // Ajouter View
        const viewFeature = document.createElement('div');
        viewFeature.className = 'feature';
        viewFeature.innerHTML = `<i class="fas fa-eye"></i><div>${property.view}</div>`;
        featuresElement.appendChild(viewFeature);
        
        // Ajouter Floor
        const floorFeature = document.createElement('div');
        floorFeature.className = 'feature';
        floorFeature.innerHTML = `<i class="fas fa-building"></i><div>${property.floor}</div>`;
        featuresElement.appendChild(floorFeature);
    }
    
    // Supprimer explicitement toute description pour éviter les problèmes
    const descriptionElement = document.getElementById('propertyDescription');
    if (descriptionElement) {
        descriptionElement.textContent = ''; // Pas de description affichée
    }
    
    // Clear existing thumbnails
    thumbnailsContainer.innerHTML = '';
    
    // Add thumbnails to modal
    property.images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = `Thumbnail ${index + 1}`;
        
        if (index === property.currentIndex) {
            img.classList.add('active');
        }
        
        img.addEventListener('click', () => {
            changeModalImage(propertyId, index);
        });
        
        thumbnailsContainer.appendChild(img);
    });
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function closeOnOutsideClick(e) {
        if (e.target === modal) {
            closeGallery();
            modal.removeEventListener('click', closeOnOutsideClick);
        }
    });
    
    // Close on Escape key
    const closeOnEscape = (e) => {
        if (e.key === 'Escape') {
            closeGallery();
            document.removeEventListener('keydown', closeOnEscape);
        }
    };
    
    document.addEventListener('keydown', closeOnEscape);
    
    // Store current property ID on modal for navigation
    modal.dataset.propertyId = propertyId;
}

// Function to change image in modal
function changeModalImage(propertyId, index) {
    const property = window.propertyData[propertyId];
    if (!property) return;
    
    // Update current index
    property.currentIndex = index;
    
    // Update main image
    const modalImage = document.getElementById('modal-main-image');
    if (modalImage) {
        modalImage.style.opacity = 0;
        
        const img = new Image();
        img.onload = function() {
            modalImage.src = property.images[index];
            modalImage.style.opacity = 1;
            
            // Update active thumbnail in modal
            const thumbnails = document.querySelectorAll('#modal-thumbnails img');
            thumbnails.forEach((thumb, i) => {
                if (i === index) {
                    thumb.classList.add('active');
                    thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                } else {
                    thumb.classList.remove('active');
                }
            });
            
            // Update active thumbnail in main view
            updateActiveThumbnail(propertyId);
        };
        img.src = property.images[index];
    }
}

// Function to navigate gallery
function navigateGallery(direction) {
    const modal = document.getElementById('gallery-modal');
    if (!modal || !modal.classList.contains('active')) return;
    
    const propertyId = modal.dataset.propertyId;
    const property = window.propertyData[propertyId];
    if (!property) return;
    
    let newIndex = property.currentIndex + direction;
    
    // Loop around if at the beginning or end
    if (newIndex < 0) {
        newIndex = property.images.length - 1;
    } else if (newIndex >= property.images.length) {
        newIndex = 0;
    }
    
    // Change to the new image
    changeModalImage(propertyId, newIndex);
}

// Function to close gallery
function closeGallery() {
    const modal = document.getElementById('gallery-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking the close button
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('close-modal')) {
        closeGallery();
    }
});

// Handle keyboard navigation in modal
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('gallery-modal');
    if (!modal || !modal.classList.contains('active')) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            navigateGallery(-1);
            e.preventDefault();
            break;
        case 'ArrowRight':
            navigateGallery(1);
            e.preventDefault();
            break;
        case 'Escape':
            closeGallery();
            e.preventDefault();
            break;
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100, // Adjust for fixed header
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const nav = document.querySelector('nav');
            const menuToggle = document.querySelector('.menu-toggle');
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });
});
