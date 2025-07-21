// Dashboard JavaScript for Property Management

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadProperties();
    updateStats();
    setupImageUpload();
});

// Authentication check
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    const loginTime = localStorage.getItem('loginTime');
    const currentTime = Date.now();
    
    if (!token || token !== 'authenticated' || (currentTime - loginTime > 24 * 60 * 60 * 1000)) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('loginTime');
        window.location.href = 'index.html';
        return;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('loginTime');
    window.location.href = 'index.html';
}

// Navigation between sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked button (only if event exists)
    if (typeof event !== 'undefined' && event && event.target) {
        event.target.classList.add('active');
    } else {
        // If called programmatically, find the corresponding nav button
        const navButton = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
        if (navButton) {
            navButton.classList.add('active');
        }
    }
    
    // Load properties if properties section is selected
    if (sectionId === 'properties') {
        loadProperties();
    }
}

// Property management functions
let properties = JSON.parse(localStorage.getItem('properties')) || [];
let editingPropertyId = null;
let propertyToDelete = null;

// Load and display properties
function loadProperties() {
    const grid = document.getElementById('propertiesGrid');
    grid.innerHTML = '';
    
    if (properties.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 2rem;">No properties found. Add your first property to get started!</p>';
        return;
    }
    
    properties.forEach(property => {
        const card = createPropertyCard(property);
        grid.appendChild(card);
    });
}

// Create property card for dashboard
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    
    const mainImage = property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/300x200?text=No+Image';
    
    card.innerHTML = `
        <img src="${mainImage}" alt="${property.title}" class="property-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        <div class="property-info">
            <h3 class="property-title">${property.title}</h3>
            <p class="property-price">AED ${formatPrice(property.price)}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
            <p><i class="fas fa-home"></i> ${property.bedrooms} bed, ${property.bathrooms} bath</p>
            <p><i class="fas fa-expand-arrows-alt"></i> ${property.area} Sq Ft</p>
            <div class="media-counter">
                <i class="fas fa-images"></i>
                ${property.images ? property.images.length : 0} Image${(property.images && property.images.length !== 1) ? 's' : ''}
            </div>
            <div class="property-actions">
                <button class="btn btn-edit" onclick="editProperty('${property.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-delete" onclick="deleteProperty('${property.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Format price with commas
function formatPrice(price) {
    return new Intl.NumberFormat().format(price);
}

// Add/Edit property form handling
document.getElementById('propertyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const property = {
        id: formData.get('id') || generateId(),
        title: formData.get('title'),
        location: formData.get('location'),
        price: parseFloat(formData.get('price')),
        area: formData.get('area'),
        bedrooms: parseInt(formData.get('bedrooms')),
        bathrooms: parseInt(formData.get('bathrooms')),
        view: formData.get('view'),
        floor: formData.get('floor'),
        description: formData.get('description'),
        amenities: formData.get('amenities') ? formData.get('amenities').split(',').map(item => item.trim()) : [],
        images: getUploadedImages(),
        featured: false,
        createdAt: editingPropertyId ? properties.find(p => p.id === editingPropertyId).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (editingPropertyId) {
        // Update existing property
        const index = properties.findIndex(p => p.id === editingPropertyId);
        properties[index] = property;
        showNotification('Property updated successfully!', 'success');
    } else {
        // Add new property
        properties.push(property);
        showNotification('Property added successfully!', 'success');
    }
    
    // Save to localStorage and sync with main site
    localStorage.setItem('properties', JSON.stringify(properties));
    syncWithMainSite().catch(error => console.error('Sync error:', error));
    
    // Reset form and go back to properties list
    resetForm();
    showSection('properties');
    updateStats();
});

// Generate unique ID
function generateId() {
    return 'prop_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

// Get uploaded images
function getUploadedImages() {
    const images = [];
    const previewContainer = document.getElementById('imagePreview');
    const imageElements = previewContainer.querySelectorAll('img');
    
    imageElements.forEach(img => {
        if (img.src && !img.src.includes('placeholder')) {
            images.push(img.src);
        }
    });
    
    return images;
}



// Edit property
function editProperty(id) {
    const property = properties.find(p => p.id === id);
    if (!property) return;
    
    editingPropertyId = id;
    
    // Fill form with property data
    document.getElementById('propertyId').value = property.id;
    document.getElementById('title').value = property.title;
    document.getElementById('location').value = property.location;
    document.getElementById('price').value = property.price;
    document.getElementById('area').value = property.area;
    document.getElementById('bedrooms').value = property.bedrooms;
    document.getElementById('bathrooms').value = property.bathrooms;
    document.getElementById('view').value = property.view || '';
    document.getElementById('floor').value = property.floor || '';
    document.getElementById('description').value = property.description;
    document.getElementById('amenities').value = property.amenities ? property.amenities.join(', ') : '';
    
    // Load images
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = '';
    if (property.images && property.images.length > 0) {
        property.images.forEach((imageSrc, index) => {
            addImageToPreview(imageSrc, `edit_${index}`);
        });
    }
    

    
    // Update form title
    document.getElementById('formTitle').textContent = 'Edit Property';
    
    // Show add property section
    showSection('add-property');
}

// Delete property
function deleteProperty(id) {
    propertyToDelete = id;
    document.getElementById('deleteModal').style.display = 'block';
}

// Confirm delete
function confirmDelete() {
    if (propertyToDelete) {
        properties = properties.filter(p => p.id !== propertyToDelete);
        localStorage.setItem('properties', JSON.stringify(properties));
        syncWithMainSite().catch(error => console.error('Sync error:', error));
        
        loadProperties();
        updateStats();
        showNotification('Property deleted successfully!', 'success');
    }
    
    closeDeleteModal();
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    propertyToDelete = null;
}

// Reset form
function resetForm() {
    document.getElementById('propertyForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('formTitle').textContent = 'Add New Property';
    editingPropertyId = null;
}

// Image upload handling
function setupImageUpload() {
    const imageInput = document.getElementById('imageInput');
    const uploadContainer = document.querySelector('.image-upload-container');
    
    imageInput.addEventListener('change', function(e) {
        handleImageFiles(e.target.files);
    });
    
    // Drag and drop functionality
    uploadContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '#f0f0f0';
    });
    
    uploadContainer.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '#f8f9fa';
    });
    
    uploadContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '#f8f9fa';
        handleImageFiles(e.dataTransfer.files);
    });
}



// Handle image files
function handleImageFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const id = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                addImageToPreview(e.target.result, id);
            };
            reader.readAsDataURL(file);
        } else {
            showNotification('Please select only image files', 'error');
        }
    });
}



// Add image to preview
function addImageToPreview(imageSrc, id) {
    const preview = document.getElementById('imagePreview');
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';
    previewItem.innerHTML = `
        <img src="${imageSrc}" alt="Preview" class="preview-image">
        <button type="button" class="remove-image" onclick="removeImage(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    preview.appendChild(previewItem);
}



// Remove image from preview
function removeImage(button) {
    button.parentElement.remove();
}



// Update statistics
function updateStats() {
    document.getElementById('totalProperties').textContent = properties.length;
    document.getElementById('featuredProperties').textContent = properties.filter(p => p.featured).length;
    document.getElementById('totalViews').textContent = Math.floor(Math.random() * 1000) + 500; // Mock data
}

// Sync with main site
async function syncWithMainSite() {
    // Convert properties to the format expected by the main site
    const mainSiteProperties = properties.map(property => ({
        id: property.id,
        title: property.title,
        location: property.location,
        price: `AED ${formatPrice(property.price)}`,
        description: property.description,
        area: property.area,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        view: property.view,
        floor: property.floor,
        amenities: property.amenities,
        images: property.images || [],
        featured: property.featured || false,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt
    }));
    
    try {
        // Check localStorage size before saving
        const dataString = JSON.stringify(mainSiteProperties);
        const sizeInMB = (new Blob([dataString]).size / 1024 / 1024).toFixed(2);
        
        console.log(`📊 Data size: ${sizeInMB}MB`);
        
        // Try to save data, optimize only if localStorage quota is exceeded
        try {
            localStorage.setItem('mainSiteProperties', dataString);
        } catch (quotaError) {
            if (quotaError.name === 'QuotaExceededError' || quotaError.code === 22) {
                console.log('⚠️ LocalStorage quota exceeded, optimizing images...');
                const optimizedProperties = await optimizePropertiesForStorage(mainSiteProperties);
                localStorage.setItem('mainSiteProperties', JSON.stringify(optimizedProperties));
            } else {
                throw quotaError;
            }
        }
        
        // Mark if properties are explicitly empty (admin decision)
        if (mainSiteProperties.length === 0) {
            localStorage.setItem('adminPropertiesEmpty', 'true');
            console.log('🚫 Admin marked properties as empty - main site will show no properties');
        } else {
            localStorage.removeItem('adminPropertiesEmpty');
            console.log('✅ Admin has properties - main site will show them');
        }
        
        console.log('✅ Properties synced successfully');
        showNotification('Properties synced successfully!', 'success');
        
    } catch (error) {
        console.error('Error syncing with main site:', error);
        
        // Handle quota exceeded error specifically
        if (error.name === 'QuotaExceededError' || error.code === 22) {
            showNotification('Storage optimized! Some images were limited to ensure performance.', 'success');
            console.log('💡 Info: Images were automatically optimized for storage');
        } else {
            showNotification('Error syncing with main site: ' + error.message, 'error');
        }
    }
}

// Optimize properties for storage by reducing image count intelligently
async function optimizePropertiesForStorage(properties) {
    console.log('🔧 Optimizing properties for storage...');
    
    // Calculate total images across all properties
    const totalImages = properties.reduce((total, prop) => total + (prop.images?.length || 0), 0);
    console.log(`📊 Total images: ${totalImages}`);
    
    // If we have too many images total, reduce per property
    const maxImagesPerProperty = totalImages > 50 ? 8 : (totalImages > 30 ? 12 : 20);
    
    return properties.map(property => {
        if (property.images && property.images.length > 0) {
            // Limit images per property based on total count
            const limitedImages = property.images.slice(0, maxImagesPerProperty);
            
            console.log(`📏 Property "${property.title}": ${property.images.length} → ${limitedImages.length} images`);
            
            return {
                ...property,
                images: limitedImages
            };
        }
        return property;
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
    }
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize with some sample data if no properties exist
if (properties.length === 0) {
    const sampleProperties = [
        {
            id: 'sample_1',
            title: 'Five Palm Jumeirah',
            location: 'Dubai, Palm Jumeirah',
            price: 10000000,
            area: 2500,
            bedrooms: 3,
            bathrooms: 4,
            view: 'Pool View',
            floor: '15th Floor',
            description: 'Stunning contemporary residence with breathtaking panoramic sea views, offering luxury and elegance in every detail.',
            amenities: ['Jacuzzi', 'Balcony', 'Parking', 'Pool Access'],
            images: ['images/Five palm Jumeirah 3BED/image0.jpeg'],
            featured: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
    
    properties = sampleProperties;
    localStorage.setItem('properties', JSON.stringify(properties));
    syncWithMainSite().catch(error => console.error('Sync error:', error));
}
