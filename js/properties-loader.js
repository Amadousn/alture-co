// Properties Loader - Dynamically load properties from Firebase Firestore
// This script maintains the exact visual appearance while making the content dynamic

class PropertiesLoader {
    constructor() {
        this.properties = [];
        this.propertiesContainer = null;
        this.isLoading = false;
        this.db = null;
    }

    // Initialize the loader
    async init() {
        this.propertiesContainer = document.querySelector('.properties-grid');
        if (!this.propertiesContainer) {
            console.error('Properties container not found');
            return;
        }

        // Initialize Firebase connection
        this.initFirebase();
        
        // Wait a bit for Firebase to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Load properties from Firebase
        await this.loadProperties();
        
        // Replace static content with dynamic content
        this.renderProperties();
        
        // Set up real-time listener for Firebase updates
        this.setupFirebaseListener();
    }
    
    // Initialize Firebase connection
    initFirebase() {
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            this.db = firebase.firestore();
            console.log('🔥 Firebase connected to properties loader');
        } else {
            console.error('❌ Firebase not available in properties loader');
        }
    }

    // Load properties from Firebase Firestore
    async loadProperties() {
        this.isLoading = true;
        
        try {
            if (!this.db) {
                throw new Error('Firebase not initialized');
            }
            
            console.log('🔍 Loading properties from Firebase...');
            
            const snapshot = await this.db.collection('properties').orderBy('createdAt', 'desc').get();
            this.properties = [];
            
            snapshot.forEach(doc => {
                this.properties.push({ id: doc.id, ...doc.data() });
            });
            
            console.log('✅ Loaded', this.properties.length, 'properties from Firebase');
            console.log('📋 Properties data:', this.properties);
            
            // Make properties available globally for gallery integration
            this.exposePropertiesGlobally();
            
        } catch (error) {
            console.error('❌ Error loading properties from Firebase:', error);
            // Use fallback static data if Firebase fails
            this.properties = this.getFallbackProperties();
            console.log('⚠️ Using fallback properties');
        } finally {
            this.isLoading = false;
        }
    }
    
    // Force reload properties (for debugging)
    async forceReload() {
        console.log('🔄 Force reloading properties...');
        localStorage.removeItem('mainSiteProperties');
        await this.loadProperties();
        this.renderProperties();
    }

    // Render properties maintaining the exact visual structure
    renderProperties() {
        if (!this.propertiesContainer) {
            return;
        }

        // Remove loading placeholder
        const loadingPlaceholder = this.propertiesContainer.querySelector('.loading-placeholder');
        if (loadingPlaceholder) {
            loadingPlaceholder.remove();
        }

        // Clear existing dynamic content but keep any static content
        const dynamicCards = this.propertiesContainer.querySelectorAll('[data-dynamic="true"]');
        dynamicCards.forEach(card => card.remove());
        
        if (this.properties.length === 0) {
            this.propertiesContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #666;"><p>No properties available. Add properties through the admin dashboard.</p></div>';
            return;
        }

        // Create property cards with the exact same structure as the original
        this.properties.forEach(property => {
            const propertyCard = this.createPropertyCard(property);
            this.propertiesContainer.appendChild(propertyCard);
        });

        // Reinitialize gallery functionality for new cards
        this.initializeGalleryButtons();
        
        // Expose properties globally for gallery integration
        this.exposePropertiesGlobally();
    }

    // Create property card with exact same structure as original
    createPropertyCard(property) {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.setAttribute('data-dynamic', 'true');
        card.setAttribute('data-property-id', property.id);

        // Get main image
        const mainImage = property.images && property.images.length > 0 
            ? property.images[0] 
            : 'images/properties/default-property.jpg';

        // Create features HTML
        const featuresHTML = this.createFeaturesHTML(property);

        card.innerHTML = `
            <div class="property-image-container">
                <img src="${mainImage}" alt="${property.title}" class="property-image" 
                     onerror="this.src='images/properties/default-property.jpg'">
                <button class="view-gallery-btn" data-property="${property.id}">View Gallery</button>
            </div>
            <div class="property-details">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-location">
                    <i class="fas fa-map-marker-alt"></i> ${property.location}
                </p>
                <p class="property-price">${property.price}</p>
                <p class="property-description">${property.description}</p>
                <div class="property-features">
                    ${featuresHTML}
                </div>
            </div>
        `;

        // Add fade-in animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        
        // Trigger animation after a short delay
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);

        return card;
    }

    // Create features HTML matching the original structure
    createFeaturesHTML(property) {
        const features = [];

        // Add bedrooms
        if (property.bedrooms) {
            features.push(`
                <div class="feature">
                    <i class="fas fa-bed"></i>
                    <div>${property.bedrooms} Bedroom${property.bedrooms > 1 ? 's' : ''}</div>
                </div>
            `);
        }

        // Add bathrooms
        if (property.bathrooms) {
            features.push(`
                <div class="feature">
                    <i class="fas fa-bath"></i>
                    <div>${property.bathrooms} Bathroom${property.bathrooms > 1 ? 's' : ''}</div>
                </div>
            `);
        }

        // Add area
        if (property.area) {
            features.push(`
                <div class="feature">
                    <i class="fas fa-expand-arrows-alt"></i>
                    <div>${property.area} Sq Ft</div>
                </div>
            `);
        }

        // Add view
        if (property.view) {
            const viewIcon = this.getViewIcon(property.view);
            features.push(`
                <div class="feature">
                    <i class="${viewIcon}"></i>
                    <div>${property.view}</div>
                </div>
            `);
        }

        return features.join('');
    }

    // Get appropriate icon for view type
    getViewIcon(view) {
        const viewIcons = {
            'Pool View': 'fas fa-swimming-pool',
            'Sea View': 'fas fa-water',
            'Lake View': 'fas fa-water',
            'City View': 'fas fa-city',
            'Garden View': 'fas fa-tree'
        };
        
        return viewIcons[view] || 'fas fa-eye';
    }

    // Initialize gallery buttons for dynamic content
    initializeGalleryButtons() {
        const galleryButtons = document.querySelectorAll('.view-gallery-btn[data-property]');
        
        galleryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const propertyId = button.getAttribute('data-property');
                const property = this.properties.find(p => p.id === propertyId);
                
                if (property) {
                    // Use the existing openGallery function with property ID
                    if (window.openGallery) {
                        window.openGallery(propertyId);
                    } else {
                        console.error('openGallery function not found');
                    }
                } else {
                    console.error('Property not found:', propertyId);
                }
            });
        });
        
        console.log('Gallery buttons initialized for', galleryButtons.length, 'dynamic properties');
    }

    // Setup Firebase real-time listener for instant updates
    setupFirebaseListener() {
        if (!this.db) {
            console.error('❌ Firebase not available for real-time listener');
            return;
        }
        
        console.log('🔄 Setting up Firebase real-time listener...');
        
        // Listen for real-time changes in the properties collection
        this.db.collection('properties').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
            console.log('🔥 Firebase real-time update received');
            
            const newProperties = [];
            snapshot.forEach(doc => {
                newProperties.push({ id: doc.id, ...doc.data() });
            });
            
            // Only update if properties actually changed
            if (JSON.stringify(newProperties) !== JSON.stringify(this.properties)) {
                console.log('✅ Properties updated in real-time:', newProperties.length);
                this.properties = newProperties;
                this.renderProperties();
                this.exposePropertiesGlobally();
            }
        }, (error) => {
            console.error('❌ Firebase listener error:', error);
        });
    }

    // Fallback properties if everything fails
    getFallbackProperties() {
        return [
            {
                id: 'fallback-1',
                title: 'Luxury Property',
                location: 'Dubai, UAE',
                price: 'AED 5,000,000',
                description: 'Beautiful luxury property with stunning views.',
                area: 2000,
                bedrooms: 3,
                bathrooms: 3,
                view: 'City View',
                images: ['images/properties/default-property.jpg'],
                featured: true
            }
        ];
    }

    // Public method to refresh properties
    async refresh() {
        await this.loadProperties();
        this.renderProperties();
    }

    // Public method to get property by ID
    getProperty(id) {
        return this.properties.find(p => p.id === id);
    }
    
    // Make properties available globally for gallery integration
    exposePropertiesGlobally() {
        window.dynamicProperties = this.properties;
        
        // Create a property lookup function for the gallery
        window.getDynamicProperty = (id) => {
            return this.properties.find(p => p.id === id);
        };
    }
}

// Initialize properties loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.propertiesLoader = new PropertiesLoader();
        window.propertiesLoader.init();
    }, 500);
});

// Export for use in other scripts
window.PropertiesLoader = PropertiesLoader;
