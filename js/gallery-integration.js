// Gallery Integration for Dynamic Properties
// This script enhances the existing gallery functionality to work with dynamic properties

// Prevent multiple initializations
if (window.galleryIntegrationInitialized) {
    console.log('Gallery integration already initialized');
} else {
    window.galleryIntegrationInitialized = true;

// Property data mapping for gallery integration
const propertyGalleryData = {
    'five-palm-jumeirah': {
        title: 'Five Palm Jumeirah',
        price: 'AED 10,000,000',
        location: 'Dubai, Palm Jumeirah',
        description: 'Stunning contemporary residence with breathtaking panoramic sea views, offering luxury and elegance in every detail.',
        features: {
            bedrooms: '3',
            bathrooms: '4',
            area: '2,500 Sq Ft',
            view: 'Pool View'
        },
        images: [
            'images/Five palm Jumeirah 3BED/image0.jpeg',
            'images/Five palm Jumeirah 3BED/image1.jpeg',
            'images/Five palm Jumeirah 3BED/image2.jpeg',
            'images/Five palm Jumeirah 3BED/image3.jpeg',
            'images/Five palm Jumeirah 3BED/image4.jpeg'
        ],
        videos: []
    },
    'jumeirah-islands': {
        title: 'Jumeirah Islands Villa',
        price: 'AED 8,500,000',
        location: 'Dubai, Jumeirah Islands',
        description: 'Luxurious waterfront villa with private beach access and stunning lake views in the prestigious Jumeirah Islands community.',
        features: {
            bedrooms: '4',
            bathrooms: '5',
            area: '3,200 Sq Ft',
            view: 'Lake View'
        },
        images: [
            'images/Jumeirah Islands/Main.jpg',
            'images/Jumeirah Islands/villa1.jpg',
            'images/Jumeirah Islands/villa2.jpg'
        ],
        videos: []
    },
    'downtown-apartment': {
        title: 'Downtown Dubai Apartment',
        price: 'AED 6,200,000',
        location: 'Dubai, Downtown',
        description: 'Modern high-rise apartment with spectacular city views and world-class amenities in the heart of Downtown Dubai.',
        features: {
            bedrooms: '2',
            bathrooms: '3',
            area: '1,800 Sq Ft',
            view: 'City View'
        },
        images: [
            'images/Downtown/apt1.jpg',
            'images/Downtown/apt2.jpg'
        ],
        videos: []
    }
};

// Enhanced openGallery function that works with both static and dynamic properties
function openGalleryEnhanced(propertyId) {
    console.log('Opening gallery for property:', propertyId);
    
    let propertyData = null;
    
    // First, try to get property from dynamic properties
    if (window.getDynamicProperty) {
        const dynamicProperty = window.getDynamicProperty(propertyId);
        if (dynamicProperty) {
            propertyData = {
                title: dynamicProperty.title,
                price: dynamicProperty.price,
                location: dynamicProperty.location,
                description: dynamicProperty.description,
                features: {
                    bedrooms: dynamicProperty.bedrooms?.toString() || '0',
                    bathrooms: dynamicProperty.bathrooms?.toString() || '0',
                    area: dynamicProperty.area ? `${dynamicProperty.area} Sq Ft` : 'N/A',
                    view: dynamicProperty.view || 'N/A'
                },
                images: dynamicProperty.images || [],
                videos: dynamicProperty.videos || []
            };
        }
    }
    
    // Fallback to static property data
    if (!propertyData && propertyGalleryData[propertyId]) {
        propertyData = propertyGalleryData[propertyId];
    }
    
    if (!propertyData) {
        console.error('Property data not found for:', propertyId);
        return;
    }
    
    // Update modal content
    updateGalleryModal(propertyData);
    
    // Show modal
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Initialize gallery with first image
        if (propertyData.images.length > 0) {
            showMedia(0, 'image');
        }
    }
}

// Update gallery modal with property data
function updateGalleryModal(propertyData) {
    // Update property title
    const titleElement = document.getElementById('propertyTitle');
    if (titleElement) {
        titleElement.textContent = propertyData.title;
    }
    
    // Update property price
    const priceElement = document.getElementById('propertyPrice');
    if (priceElement) {
        priceElement.textContent = propertyData.price.replace('AED ', '');
    }
    
    // Update property features
    const featuresContainer = document.querySelector('.property-info .property-features');
    if (featuresContainer) {
        featuresContainer.innerHTML = `
            <div class="feature-item">
                <i class="fas fa-bed"></i>
                <span>${propertyData.features.bedrooms} Bedroom${propertyData.features.bedrooms !== '1' ? 's' : ''}</span>
            </div>
            <div class="feature-item">
                <i class="fas fa-bath"></i>
                <span>${propertyData.features.bathrooms} Bathroom${propertyData.features.bathrooms !== '1' ? 's' : ''}</span>
            </div>
            <div class="feature-item">
                <i class="fas fa-expand-arrows-alt"></i>
                <span>${propertyData.features.area}</span>
            </div>
            <div class="feature-item">
                <i class="fas fa-eye"></i>
                <span>${propertyData.features.view}</span>
            </div>
        `;
    }
    
    // Update thumbnails
    const thumbnailsContainer = document.getElementById('galleryThumbnails');
    if (thumbnailsContainer) {
        thumbnailsContainer.innerHTML = '';
        
        propertyData.images.forEach((imageSrc, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail';
            thumbnail.innerHTML = `<img src="${imageSrc}" alt="Property ${index + 1}" onerror="this.src='images/properties/default-property.jpg'">`;
            thumbnail.addEventListener('click', () => showMedia(index, 'image'));
            thumbnailsContainer.appendChild(thumbnail);
        });
        
        // Add video thumbnails if any
        propertyData.videos.forEach((videoSrc, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail video-thumbnail';
            thumbnail.innerHTML = `
                <video muted>
                    <source src="${videoSrc}" type="video/mp4">
                </video>
                <div class="play-icon"><i class="fas fa-play"></i></div>
            `;
            thumbnail.addEventListener('click', () => showMedia(propertyData.images.length + index, 'video'));
            thumbnailsContainer.appendChild(thumbnail);
        });
    }
}

// Override the original openGallery function
if (typeof window !== 'undefined') {
    window.openGallery = openGalleryEnhanced;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Gallery integration initialized');
    
    // Ensure the enhanced openGallery function is available globally
    window.openGallery = openGalleryEnhanced;
    
    // Re-initialize gallery buttons after a short delay to ensure dynamic properties are loaded
    setTimeout(() => {
        const galleryButtons = document.querySelectorAll('.view-gallery-btn');
        galleryButtons.forEach(button => {
            // Remove existing listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add new listener
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                const propertyId = this.getAttribute('data-property');
                if (propertyId) {
                    openGalleryEnhanced(propertyId);
                }
            });
        });
        
        console.log('Gallery buttons re-initialized:', galleryButtons.length);
    }, 1000);
});

} // End of galleryIntegrationInitialized check
