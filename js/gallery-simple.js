// Simple Gallery Integration - Fixed Version
// This script provides a working gallery for dynamic properties

(function() {
    'use strict';
    
    // Prevent multiple initializations
    if (window.gallerySimpleInitialized) {
        return;
    }
    window.gallerySimpleInitialized = true;
    
    console.log('Initializing simple gallery integration...');
    
    // Simple property data for gallery with video support
    const galleryData = {
        'five-palm-jumeirah': {
            title: 'Five Palm Jumeirah',
            price: 'AED 10,000,000',
            location: 'Dubai, Palm Jumeirah',
            description: 'Stunning contemporary residence with breathtaking panoramic sea views, offering luxury and elegance in every detail.',
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
            ],
            videos: []
        },
        'jumeirah-islands': {
            title: 'Jumeirah Islands Villa',
            price: 'AED 8,500,000',
            location: 'Dubai, Jumeirah Islands',
            description: 'Luxurious villa in the prestigious Jumeirah Islands community.',
            bedrooms: 4,
            bathrooms: 5,
            area: 3500,
            view: 'Lake View',
            floor: 'Ground Floor',
            amenities: ['Private Pool', 'Garden', 'Maid Room', 'Garage'],
            images: [
                'images/Jumeirah Islands/Main.jpg'
            ],
            videos: []
        },
        'downtown-apartment': {
            title: 'Downtown Dubai Apartment',
            price: 'AED 6,200,000',
            location: 'Dubai, Downtown',
            description: 'Modern apartment in the heart of Downtown Dubai with city views.',
            bedrooms: 2,
            bathrooms: 3,
            area: 1800,
            view: 'City View',
            floor: '25th Floor',
            amenities: ['Gym Access', 'Pool', 'Concierge', 'Valet Parking'],
            images: [
                'images/Downtown/apt1.jpg',
                'images/Downtown/apt2.jpg'
            ],
            videos: []
        }
    };
    
    // Simple gallery open function
    function openSimpleGallery(propertyId) {
        console.log('Opening simple gallery for:', propertyId);
        
        let propertyData = null;
        
        // Try to get from dynamic properties FIRST
        if (window.getDynamicProperty) {
            const dynamicProperty = window.getDynamicProperty(propertyId);
            console.log('Dynamic property found:', dynamicProperty);
            if (dynamicProperty) {
                propertyData = {
                    title: dynamicProperty.title,
                    price: dynamicProperty.price,
                    location: dynamicProperty.location,
                    description: dynamicProperty.description,
                    bedrooms: dynamicProperty.bedrooms,
                    bathrooms: dynamicProperty.bathrooms,
                    area: dynamicProperty.area,
                    view: dynamicProperty.view,
                    floor: dynamicProperty.floor,
                    amenities: dynamicProperty.amenities || [],
                    images: dynamicProperty.images || ['images/properties/default-property.jpg'],
                    videos: dynamicProperty.videos || []
                };
                console.log('Property data prepared for gallery:', propertyData);
                console.log('Videos found:', propertyData.videos);
                console.log('🔍 DEBUG - Area:', propertyData.area);
                console.log('🔍 DEBUG - View:', propertyData.view);
                console.log('🔍 DEBUG - Floor:', propertyData.floor);
                console.log('🔍 DEBUG - Amenities:', propertyData.amenities);
            }
        }
        
        // Fallback to static data if dynamic not found
        if (!propertyData) {
            propertyData = galleryData[propertyId];
            console.log('Using static fallback data for:', propertyId);
        }
        
        if (!propertyData) {
            console.error('Property not found:', propertyId);
            console.log('Available properties:', window.dynamicProperties);
            alert('Property gallery not available');
            return;
        }
        
        console.log('Final property data for gallery:', propertyData);
        console.log('Images count:', propertyData.images.length);
        console.log('Videos count:', propertyData.videos ? propertyData.videos.length : 0);
        
        // Create or update modal
        showSimpleModal(propertyData);
    }
    
    // Show professional gallery modal
    function showSimpleModal(propertyData) {
        // Remove existing modal if any
        const existingModal = document.getElementById('simpleGalleryModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create professional gallery modal HTML
        const modalHTML = `
            <div id="simpleGalleryModal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            ">
                <div style="
                    background: white;
                    border-radius: 15px;
                    width: 95%;
                    max-width: 1400px;
                    max-height: 95vh;
                    overflow-y: auto;
                    position: relative;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                    display: flex;
                    flex-direction: column;
                ">
                    <!-- Close Button -->
                    <button onclick="closeSimpleGallery()" style="
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        background: rgba(0, 0, 0, 0.7);
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 45px;
                        height: 45px;
                        font-size: 24px;
                        cursor: pointer;
                        z-index: 10001;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='rgba(209, 77, 114, 0.9)'" onmouseout="this.style.background='rgba(0, 0, 0, 0.7)'">&times;</button>
                    
                    <!-- Property Info Header -->
                    <div style="
                        padding: 25px 30px 15px;
                        border-bottom: 1px solid #eee;
                        background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
                    ">
                        <h2 style="
                            margin: 0 0 8px 0;
                            color: #333;
                            font-size: 1.8rem;
                            font-weight: 600;
                        ">${propertyData.title}</h2>
                        <p style="
                            color: #D14D72;
                            font-size: 1.4rem;
                            font-weight: bold;
                            margin: 0;
                        ">${propertyData.price}</p>
                    </div>
                    
                    <!-- Main Gallery Container -->
                    <div style="padding: 0; position: relative; flex: 0 0 auto;">
                        <!-- Main Image Display -->
                        <div id="mainImageContainer" style="
                            position: relative;
                            height: 400px;
                            overflow: hidden;
                            background: transparent;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            <img id="mainImage" src="${propertyData.images[0]}" alt="${propertyData.title}" style="
                                max-width: 100%;
                                max-height: 100%;
                                object-fit: contain;
                                transition: all 0.3s ease;
                            " onerror="this.src='images/properties/default-property.jpg'">
                            
                            <video id="mainVideo" style="
                                max-width: 100%;
                                max-height: 100%;
                                object-fit: contain;
                                transition: all 0.3s ease;
                                display: none;
                            " controls>
                                Your browser does not support the video tag.
                            </video>
                            
                            <!-- Navigation Arrows -->
                            ${propertyData.images.length > 1 ? `
                                <button onclick="previousImage()" style="
                                    position: absolute;
                                    left: 20px;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    background: rgba(0, 0, 0, 0.6);
                                    color: white;
                                    border: none;
                                    border-radius: 50%;
                                    width: 50px;
                                    height: 50px;
                                    font-size: 20px;
                                    cursor: pointer;
                                    transition: all 0.3s ease;
                                    z-index: 100;
                                " onmouseover="this.style.background='rgba(209, 77, 114, 0.8)'" onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'">‹</button>
                                
                                <button onclick="nextImage()" style="
                                    position: absolute;
                                    right: 20px;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    background: rgba(0, 0, 0, 0.6);
                                    color: white;
                                    border: none;
                                    border-radius: 50%;
                                    width: 50px;
                                    height: 50px;
                                    font-size: 20px;
                                    cursor: pointer;
                                    transition: all 0.3s ease;
                                    z-index: 100;
                                " onmouseover="this.style.background='rgba(209, 77, 114, 0.8)'" onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'">›</button>
                            ` : ''}
                            
                            <!-- Image Counter -->
                            <div id="imageCounter" style="
                                position: absolute;
                                bottom: 20px;
                                right: 20px;
                                background: rgba(0, 0, 0, 0.7);
                                color: white;
                                padding: 8px 15px;
                                border-radius: 20px;
                                font-size: 14px;
                                font-weight: 500;
                            ">1 / ${propertyData.images.length + (propertyData.videos ? propertyData.videos.length : 0)}</div>
                        </div>
                        
                        <!-- Thumbnails -->
                        ${propertyData.images.length >= 1 ? `
                            <div style="
                                padding: 20px;
                                background: #f8f9fa;
                                border-top: 1px solid #eee;
                            ">
                                <div id="thumbnailsContainer" style="
                                    display: flex;
                                    gap: 12px;
                                    overflow-x: auto;
                                    overflow-y: hidden;
                                    padding: 5px 0;
                                    max-height: 85px;
                                    scrollbar-width: thin;
                                    scrollbar-color: #D14D72 #f8f9fa;
                                ">
                                    ${propertyData.images.map((img, index) => `
                                        <div onclick="showMedia(${index}, 'image')" style="
                                            width: 100px;
                                            height: 75px;
                                            border-radius: 8px;
                                            cursor: pointer;
                                            transition: all 0.3s ease;
                                            border: 3px solid ${index === 0 ? '#D14D72' : 'transparent'};
                                            opacity: ${index === 0 ? '1' : '0.7'};
                                            overflow: hidden;
                                            position: relative;
                                        " onmouseover="this.style.opacity='1'; this.style.transform='scale(1.05)'" onmouseout="this.style.opacity='${index === 0 ? '1' : '0.7'}'; this.style.transform='scale(1)'">
                                            <img src="${img}" alt="Thumbnail ${index + 1}" style="
                                                width: 100%;
                                                height: 100%;
                                                object-fit: cover;
                                            " onerror="this.src='images/properties/default-property.jpg'">
                                        </div>
                                    `).join('')}
                                    ${(propertyData.videos || []).map((video, index) => `
                                        <div onclick="showMedia(${propertyData.images.length + index}, 'video')" style="
                                            width: 100px;
                                            height: 75px;
                                            border-radius: 8px;
                                            cursor: pointer;
                                            transition: all 0.3s ease;
                                            border: 3px solid transparent;
                                            opacity: 0.7;
                                            overflow: hidden;
                                            position: relative;
                                            background: #000;
                                        " onmouseover="this.style.opacity='1'; this.style.transform='scale(1.05)'" onmouseout="this.style.opacity='0.7'; this.style.transform='scale(1)'">
                                            <video style="width: 100%; height: 100%; object-fit: cover;" muted>
                                                <source src="${video}" type="video/mp4">
                                            </video>
                                            <div style="
                                                position: absolute;
                                                top: 50%;
                                                left: 50%;
                                                transform: translate(-50%, -50%);
                                                color: white;
                                                font-size: 20px;
                                                pointer-events: none;
                                            ">▶</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        <!-- Property Details Section -->
                        <div style="
                            padding: 30px;
                            background: white;
                            border-top: 1px solid #eee;
                            flex: 1 1 auto;
                            overflow-y: auto;
                            min-height: 300px;
                        ">
                            <!-- Price and Location -->
                            <div style="
                                display: flex;
                                justify-content: space-between;
                                align-items: flex-start;
                                margin-bottom: 25px;
                                flex-wrap: wrap;
                                gap: 15px;
                            ">
                                <div>
                                    <div style="
                                        font-size: 2rem;
                                        font-weight: bold;
                                        color: #D14D72;
                                        margin-bottom: 8px;
                                    ">${propertyData.price}</div>
                                    <div style="
                                        font-size: 1.1rem;
                                        color: #666;
                                        display: flex;
                                        align-items: center;
                                        gap: 8px;
                                    ">
                                        <i class="fas fa-map-marker-alt" style="color: #D14D72;"></i>
                                        ${propertyData.location || 'Location not specified'}
                                    </div>
                                </div>
                                
                                <!-- Key Features -->
                                <div style="
                                    display: flex;
                                    gap: 20px;
                                    flex-wrap: wrap;
                                ">
                                    ${propertyData.bedrooms ? `
                                        <div style="
                                            display: flex;
                                            align-items: center;
                                            gap: 8px;
                                            background: #f8f9fa;
                                            padding: 10px 15px;
                                            border-radius: 25px;
                                        ">
                                            <i class="fas fa-bed" style="color: #D14D72;"></i>
                                            <span style="font-weight: 500;">${propertyData.bedrooms} Bed${propertyData.bedrooms > 1 ? 's' : ''}</span>
                                        </div>
                                    ` : ''}
                                    ${propertyData.bathrooms ? `
                                        <div style="
                                            display: flex;
                                            align-items: center;
                                            gap: 8px;
                                            background: #f8f9fa;
                                            padding: 10px 15px;
                                            border-radius: 25px;
                                        ">
                                            <i class="fas fa-bath" style="color: #D14D72;"></i>
                                            <span style="font-weight: 500;">${propertyData.bathrooms} Bath${propertyData.bathrooms > 1 ? 's' : ''}</span>
                                        </div>
                                    ` : ''}
                                    ${propertyData.area ? `
                                        <div style="
                                            display: flex;
                                            align-items: center;
                                            gap: 8px;
                                            background: #f8f9fa;
                                            padding: 10px 15px;
                                            border-radius: 25px;
                                        ">
                                            <i class="fas fa-expand-arrows-alt" style="color: #D14D72;"></i>
                                            <span style="font-weight: 500;">${propertyData.area} Sq Ft</span>
                                        </div>
                                    ` : ''}
                                    ${propertyData.view ? `
                                        <div style="
                                            display: flex;
                                            align-items: center;
                                            gap: 8px;
                                            background: #f8f9fa;
                                            padding: 10px 15px;
                                            border-radius: 25px;
                                        ">
                                            <i class="fas fa-eye" style="color: #D14D72;"></i>
                                            <span style="font-weight: 500;">${propertyData.view}</span>
                                        </div>
                                    ` : ''}
                                    ${propertyData.floor ? `
                                        <div style="
                                            display: flex;
                                            align-items: center;
                                            gap: 8px;
                                            background: #f8f9fa;
                                            padding: 10px 15px;
                                            border-radius: 25px;
                                        ">
                                            <i class="fas fa-building" style="color: #D14D72;"></i>
                                            <span style="font-weight: 500;">${propertyData.floor}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <!-- Description -->
                            ${propertyData.description ? `
                                <div style="margin-bottom: 25px;">
                                    <h3 style="
                                        color: #333;
                                        font-size: 1.3rem;
                                        font-weight: 600;
                                        margin-bottom: 15px;
                                    ">Description</h3>
                                    <p style="
                                        color: #666;
                                        line-height: 1.6;
                                        font-size: 1rem;
                                        margin: 0;
                                    ">${propertyData.description}</p>
                                </div>
                            ` : ''}
                            
                            <!-- Amenities (sans titre) -->
                            ${propertyData.amenities && propertyData.amenities.length > 0 ? `
                                <div style="margin-bottom: 20px;">
                                    <div style="
                                        display: flex;
                                        flex-wrap: wrap;
                                        gap: 10px;
                                    ">
                                        ${propertyData.amenities.map(amenity => `
                                            <span style="
                                                background: linear-gradient(135deg, #D14D72 0%, #b13a5c 100%);
                                                color: white;
                                                padding: 8px 16px;
                                                border-radius: 20px;
                                                font-size: 0.9rem;
                                                font-weight: 500;
                                            ">${amenity.trim()}</span>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            <!-- Additional Property Info -->
                            <div style="
                                display: grid;
                                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                                gap: 20px;
                                margin-top: 25px;
                                padding-top: 25px;
                                border-top: 1px solid #eee;
                            ">
                                ${propertyData.view ? `
                                    <div style="
                                        display: flex;
                                        align-items: center;
                                        gap: 12px;
                                    ">
                                        <i class="fas fa-eye" style="
                                            color: #D14D72;
                                            font-size: 1.2rem;
                                        "></i>
                                        <div>
                                            <div style="font-weight: 600; color: #333;">View</div>
                                            <div style="color: #666; font-size: 0.9rem;">${propertyData.view}</div>
                                        </div>
                                    </div>
                                ` : ''}
                                ${propertyData.floor ? `
                                    <div style="
                                        display: flex;
                                        align-items: center;
                                        gap: 12px;
                                    ">
                                        <i class="fas fa-building" style="
                                            color: #D14D72;
                                            font-size: 1.2rem;
                                        "></i>
                                        <div>
                                            <div style="font-weight: 600; color: #333;">Floor</div>
                                            <div style="color: #666; font-size: 0.9rem;">${propertyData.floor}</div>
                                        </div>
                                    </div>
                                ` : ''}
                                <div style="
                                    display: flex;
                                    align-items: center;
                                    gap: 12px;
                                ">
                                    <i class="fas fa-images" style="
                                        color: #D14D72;
                                        font-size: 1.2rem;
                                    "></i>
                                    <div>
                                        <div style="font-weight: 600; color: #333;">Media</div>
                                        <div style="color: #666; font-size: 0.9rem;">${propertyData.images.length} Image${propertyData.images.length > 1 ? 's' : ''}${propertyData.videos && propertyData.videos.length > 0 ? `, ${propertyData.videos.length} Video${propertyData.videos.length > 1 ? 's' : ''}` : ''}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Initialize gallery functionality
        initializeGalleryNavigation(propertyData);
        
        // Close on background click
        const modal = document.getElementById('simpleGalleryModal');
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSimpleGallery();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeSimpleGallery();
            }
        });
    }
    
    // Gallery navigation variables
    let currentMediaIndex = 0;
    let currentPropertyMedia = [];
    
    // Initialize gallery navigation
    function initializeGalleryNavigation(propertyData) {
        currentMediaIndex = 0;
        // Combine images and videos into one media array
        currentPropertyMedia = [
            ...propertyData.images.map(img => ({ type: 'image', src: img })),
            ...(propertyData.videos || []).map(video => ({ type: 'video', src: video }))
        ];
        
        console.log('Gallery navigation initialized:');
        console.log('- Images:', propertyData.images.length);
        console.log('- Videos:', propertyData.videos ? propertyData.videos.length : 0);
        console.log('- Total media:', currentPropertyMedia.length);
        console.log('- Media array:', currentPropertyMedia);
        
        // Make navigation functions globally available
        window.showImage = showImage; // Keep for backward compatibility
        window.showMedia = showMedia;
        window.nextImage = nextMedia;
        window.previousImage = previousMedia;
    }
    
    // Show specific media by index and type
    function showMedia(index, type) {
        if (index < 0 || index >= currentPropertyMedia.length) return;
        
        currentMediaIndex = index;
        const media = currentPropertyMedia[index];
        
        const mainImage = document.getElementById('mainImage');
        const mainVideo = document.getElementById('mainVideo');
        
        if (media.type === 'image') {
            // Show image, hide video
            if (mainImage && mainVideo) {
                mainVideo.style.display = 'none';
                mainVideo.pause();
                mainImage.style.display = 'block';
                mainImage.src = media.src;
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 100);
            }
        } else if (media.type === 'video') {
            // Show video, hide image
            if (mainImage && mainVideo) {
                mainImage.style.display = 'none';
                mainVideo.style.display = 'block';
                mainVideo.src = media.src;
                mainVideo.style.opacity = '0';
                setTimeout(() => {
                    mainVideo.style.opacity = '1';
                }, 100);
            }
        }
        
        // Update counter
        const counter = document.getElementById('imageCounter');
        if (counter) {
            counter.textContent = `${index + 1} / ${currentPropertyMedia.length}`;
        }
        
        // Update thumbnails
        updateThumbnailsSelection(index);
    }
    
    // Show specific image by index (backward compatibility)
    function showImage(index) {
        showMedia(index, 'image');
    }
    
    // Navigate to next media
    function nextMedia() {
        const nextIndex = (currentMediaIndex + 1) % currentPropertyMedia.length;
        const media = currentPropertyMedia[nextIndex];
        showMedia(nextIndex, media.type);
    }
    
    // Navigate to previous media
    function previousMedia() {
        const prevIndex = currentMediaIndex === 0 ? currentPropertyMedia.length - 1 : currentMediaIndex - 1;
        const media = currentPropertyMedia[prevIndex];
        showMedia(prevIndex, media.type);
    }
    
    // Navigate to next image (backward compatibility)
    function nextImage() {
        nextMedia();
    }
    
    // Navigate to previous image (backward compatibility)
    function previousImage() {
        previousMedia();
    }
    
    // Update thumbnails selection
    function updateThumbnailsSelection(activeIndex) {
        const thumbnails = document.querySelectorAll('#thumbnailsContainer > div');
        thumbnails.forEach((thumb, index) => {
            if (index === activeIndex) {
                thumb.style.border = '3px solid #D14D72';
                thumb.style.opacity = '1';
            } else {
                thumb.style.border = '3px solid transparent';
                thumb.style.opacity = '0.7';
            }
        });
    }
    
    // Close gallery function
    function closeSimpleGallery() {
        const modal = document.getElementById('simpleGalleryModal');
        if (modal) {
            modal.remove();
        }
        document.body.style.overflow = '';
        
        // Clean up global functions
        window.showImage = null;
        window.nextImage = null;
        window.previousImage = null;
    }
    
    // Make functions globally available
    window.openSimpleGallery = openSimpleGallery;
    window.closeSimpleGallery = closeSimpleGallery;
    
    // Override the problematic openGallery function
    window.openGallery = openSimpleGallery;
    
    // Initialize gallery buttons
    function initializeGalleryButtons() {
        // Wait for properties to load
        setTimeout(() => {
            const buttons = document.querySelectorAll('.view-gallery-btn');
            console.log('Found gallery buttons:', buttons.length);
            
            buttons.forEach(button => {
                // Remove existing listeners by cloning
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Add new listener
                newButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const propertyId = this.getAttribute('data-property');
                    console.log('Gallery button clicked for:', propertyId);
                    
                    if (propertyId) {
                        openSimpleGallery(propertyId);
                    } else {
                        console.error('No property ID found on button');
                    }
                });
            });
            
            console.log('Gallery buttons initialized successfully');
        }, 1500); // Wait longer for dynamic properties to load
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeGalleryButtons);
    } else {
        initializeGalleryButtons();
    }
    
    console.log('Simple gallery integration loaded');
    
})();
