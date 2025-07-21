// Firebase Gallery Integration - Dynamic Version
// This script provides a working gallery for Firebase-powered dynamic properties

(function() {
    'use strict';
    
    // Prevent multiple initializations
    if (window.gallerySimpleInitialized) {
        return;
    }
    window.gallerySimpleInitialized = true;
    
    console.log('🔥 Initializing Firebase gallery integration...');
    
    // Dynamic property data loaded from Firebase
    let galleryData = {};
    
    // Firebase connection
    let db = null;
    
    // Initialize Firebase connection
    function initFirebase() {
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            db = firebase.firestore();
            console.log('🔥 Firebase connected to gallery');
            loadPropertiesFromFirebase();
        } else {
            console.error('❌ Firebase not available in gallery');
            // Use fallback data
            galleryData = {
                'five-palm-jumeirah': {
                    title: 'Five Palm Jumeirah',
                    price: 'AED 10,000,000',
                    bedrooms: 3,
                    bathrooms: 3,
                    area: 2770,
                    view: 'Sea & Palm View',
                    floor: '10th Floor',
                    amenities: ['Jacuzzi', 'Balcony', 'Fully Furnished', 'Corner Unit', '2 Parking Spaces', '2 Large Balconies'],
                    images: [
                        'images/Five palm Jumeirah 3BED/image0.jpeg',
                        'images/Five palm Jumeirah 3BED/image1.jpeg',
                        'images/Five palm Jumeirah 3BED/image2.jpeg'
                    ]
                }
            };
        }
    }
    
    // Load properties from Firebase
    async function loadPropertiesFromFirebase() {
        try {
            const snapshot = await db.collection('properties').get();
            galleryData = {};
            
            snapshot.forEach(doc => {
                const property = { id: doc.id, ...doc.data() };
                galleryData[property.id] = property;
            });
            
            console.log('✅ Loaded', Object.keys(galleryData).length, 'properties for gallery');
        } catch (error) {
            console.error('❌ Error loading properties for gallery:', error);
        }
    }
    
    // Gallery modal HTML
    const galleryModalHTML = `
        <div id="galleryModal" class="gallery-modal" style="display: none;">
            <div class="gallery-modal-content">
                <span class="gallery-close">&times;</span>
                <div class="gallery-container">
                    <div class="gallery-main-image">
                        <img id="galleryMainImage" src="" alt="">
                        <div class="gallery-nav">
                            <button id="galleryPrev" class="gallery-nav-btn">&#8249;</button>
                            <button id="galleryNext" class="gallery-nav-btn">&#8250;</button>
                        </div>
                    </div>
                    <div class="gallery-thumbnails" id="galleryThumbnails"></div>
                    <div class="gallery-info" id="galleryInfo"></div>
                </div>
            </div>
        </div>
    `;
    
    // Gallery modal styles
    const galleryModalCSS = `
        <style>
        .gallery-modal {
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .gallery-modal-content {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            max-width: 90vw;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        
        .gallery-close {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            z-index: 10001;
        }
        
        .gallery-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .gallery-main-image {
            position: relative;
            text-align: center;
        }
        
        .gallery-main-image img {
            max-width: 100%;
            max-height: 60vh;
            object-fit: contain;
        }
        
        .gallery-nav {
            position: absolute;
            top: 50%;
            width: 100%;
            display: flex;
            justify-content: space-between;
            transform: translateY(-50%);
            pointer-events: none;
        }
        
        .gallery-nav-btn {
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            padding: 10px 15px;
            font-size: 24px;
            cursor: pointer;
            border-radius: 5px;
            pointer-events: all;
        }
        
        .gallery-thumbnails {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .gallery-thumbnail {
            width: 80px;
            height: 60px;
            object-fit: cover;
            cursor: pointer;
            border: 2px solid transparent;
            border-radius: 5px;
        }
        
        .gallery-thumbnail.active {
            border-color: #e91e63;
        }
        
        .gallery-info {
            text-align: center;
        }
        
        .gallery-info h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        
        .gallery-features {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 15px 0;
            flex-wrap: wrap;
        }
        
        .gallery-feature {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #e91e63;
            font-weight: 500;
        }
        
        .gallery-amenities {
            margin-top: 15px;
        }
        
        .gallery-amenity {
            display: inline-block;
            background: #e91e63;
            color: white;
            padding: 5px 10px;
            margin: 3px;
            border-radius: 15px;
            font-size: 12px;
        }
        </style>
    `;
    
    // Current gallery state
    let currentPropertyId = null;
    let currentImageIndex = 0;
    let currentImages = [];
    
    // Initialize gallery
    function initGallery() {
        // Add modal HTML to page
        document.body.insertAdjacentHTML('beforeend', galleryModalHTML);
        document.head.insertAdjacentHTML('beforeend', galleryModalCSS);
        
        // Add event listeners
        const modal = document.getElementById('galleryModal');
        const closeBtn = document.querySelector('.gallery-close');
        const prevBtn = document.getElementById('galleryPrev');
        const nextBtn = document.getElementById('galleryNext');
        
        closeBtn.onclick = closeGallery;
        prevBtn.onclick = () => changeImage(-1);
        nextBtn.onclick = () => changeImage(1);
        
        // Close on outside click
        modal.onclick = function(event) {
            if (event.target === modal) {
                closeGallery();
            }
        };
        
        // Keyboard navigation
        document.addEventListener('keydown', function(event) {
            if (modal.style.display === 'flex') {
                if (event.key === 'Escape') closeGallery();
                if (event.key === 'ArrowLeft') changeImage(-1);
                if (event.key === 'ArrowRight') changeImage(1);
            }
        });
    }
    
    // Open gallery for a property
    function openGallery(propertyId) {
        console.log('🖼️ Opening gallery for property:', propertyId);
        
        const property = galleryData[propertyId];
        if (!property) {
            console.error('❌ Property not found:', propertyId);
            return;
        }
        
        currentPropertyId = propertyId;
        currentImages = property.images || [];
        currentImageIndex = 0;
        
        if (currentImages.length === 0) {
            console.error('❌ No images found for property:', propertyId);
            return;
        }
        
        showModal(property);
    }
    
    // Show modal with property data
    function showModal(property) {
        const modal = document.getElementById('galleryModal');
        const mainImage = document.getElementById('galleryMainImage');
        const thumbnails = document.getElementById('galleryThumbnails');
        const info = document.getElementById('galleryInfo');
        
        // Set main image
        mainImage.src = currentImages[currentImageIndex];
        mainImage.alt = property.title;
        
        // Create thumbnails
        thumbnails.innerHTML = '';
        currentImages.forEach((image, index) => {
            const thumb = document.createElement('img');
            thumb.src = image;
            thumb.className = 'gallery-thumbnail' + (index === currentImageIndex ? ' active' : '');
            thumb.onclick = () => {
                currentImageIndex = index;
                updateMainImage();
                updateThumbnails();
            };
            thumbnails.appendChild(thumb);
        });
        
        // Create info section
        const featuresHTML = [];
        if (property.view) {
            featuresHTML.push(`<div class="gallery-feature"><i class="fas fa-eye"></i> ${property.view}</div>`);
        }
        if (property.floor) {
            featuresHTML.push(`<div class="gallery-feature"><i class="fas fa-building"></i> ${property.floor}</div>`);
        }
        
        const amenitiesHTML = property.amenities ? 
            property.amenities.map(amenity => `<span class="gallery-amenity">${amenity}</span>`).join('') : '';
        
        info.innerHTML = `
            <h3>${property.title}</h3>
            <div class="gallery-features">
                ${featuresHTML.join('')}
            </div>
            <div class="gallery-amenities">
                ${amenitiesHTML}
            </div>
        `;
        
        // Show modal
        modal.style.display = 'flex';
    }
    
    // Update main image
    function updateMainImage() {
        const mainImage = document.getElementById('galleryMainImage');
        mainImage.src = currentImages[currentImageIndex];
    }
    
    // Update thumbnails
    function updateThumbnails() {
        const thumbnails = document.querySelectorAll('.gallery-thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.className = 'gallery-thumbnail' + (index === currentImageIndex ? ' active' : '');
        });
    }
    
    // Change image
    function changeImage(direction) {
        currentImageIndex += direction;
        
        if (currentImageIndex < 0) {
            currentImageIndex = currentImages.length - 1;
        } else if (currentImageIndex >= currentImages.length) {
            currentImageIndex = 0;
        }
        
        updateMainImage();
        updateThumbnails();
    }
    
    // Close gallery
    function closeGallery() {
        const modal = document.getElementById('galleryModal');
        modal.style.display = 'none';
        currentPropertyId = null;
        currentImageIndex = 0;
        currentImages = [];
    }
    
    // Make openGallery globally available
    window.openGallery = openGallery;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                initFirebase();
                initGallery();
            }, 1000);
        });
    } else {
        setTimeout(() => {
            initFirebase();
            initGallery();
        }, 1000);
    }
    
    console.log('✅ Firebase gallery integration initialized');
    
})();
