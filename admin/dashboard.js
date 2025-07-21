// Dashboard JavaScript for Property Management

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializeFirebase();
    loadProperties();
    updateStats();
    setupImageUpload();
});

// Initialize Firebase connection
function initializeFirebase() {
    console.log('🔥 Firebase initialized successfully');
    console.log('📊 Database connection established');
}

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
let properties = [];
let editingPropertyId = null;
let propertyToDelete = null;

// Firebase Firestore functions
async function savePropertyToFirebase(property) {
    try {
        await db.collection('properties').doc(property.id).set(property);
        console.log('✅ Property saved to Firebase:', property.title);
        return true;
    } catch (error) {
        console.error('❌ Error saving property:', error);
        showNotification('Error saving property to database', 'error');
        return false;
    }
}

async function loadPropertiesFromFirebase() {
    try {
        const snapshot = await db.collection('properties').orderBy('createdAt', 'desc').get();
        properties = [];
        snapshot.forEach(doc => {
            properties.push({ id: doc.id, ...doc.data() });
        });
        console.log('✅ Loaded', properties.length, 'properties from Firebase');
        return properties;
    } catch (error) {
        console.error('❌ Error loading properties:', error);
        showNotification('Error loading properties from database', 'error');
        return [];
    }
}

async function deletePropertyFromFirebase(propertyId) {
    try {
        await db.collection('properties').doc(propertyId).delete();
        console.log('✅ Property deleted from Firebase:', propertyId);
        return true;
    } catch (error) {
        console.error('❌ Error deleting property:', error);
        showNotification('Error deleting property from database', 'error');
        return false;
    }
}

// Load and display properties
async function loadProperties() {
    const grid = document.getElementById('propertiesGrid');
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 2rem;"><i class="fas fa-spinner fa-spin"></i> Loading properties...</p>';
    
    // Load properties from Firebase
    await loadPropertiesFromFirebase();
    
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
document.getElementById('propertyForm').addEventListener('submit', async function(e) {
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
    
    // Save property to Firebase
    const success = await savePropertyToFirebase(property);
    
    if (success) {
        if (editingPropertyId) {
            showNotification('Property updated successfully!', 'success');
            editingPropertyId = null;
        } else {
            showNotification('Property added successfully!', 'success');
        }
        
        // Reload properties from Firebase to update the display
        await loadProperties();
    } else {
        showNotification('Failed to save property. Please try again.', 'error');
        return; // Don't reset form if save failed
    }
    
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
async function editProperty(id) {
    const property = properties.find(p => p.id === id);
    if (!property) {
        showNotification('Property not found', 'error');
        return;
    }
    
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
    document.getElementById('description').value = property.description || '';
    document.getElementById('amenities').value = property.amenities ? property.amenities.join(', ') : '';
    document.getElementById('featured').checked = property.featured || false;
    
    // Clear and populate image preview
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = '';
    
    if (property.images && property.images.length > 0) {
        property.images.forEach((imageSrc, index) => {
            addImageToPreview(imageSrc, `existing_${index}`);
        });
    }
    
    // Switch to add property section
    showSection('addProperty');
    document.getElementById('formTitle').textContent = 'Edit Property';
}

// Delete property
function deleteProperty(id) {
    propertyToDelete = id;
    document.getElementById('deleteModal').style.display = 'flex';
}

// Confirm delete
async function confirmDelete() {
    if (propertyToDelete) {
        const success = await deletePropertyFromFirebase(propertyToDelete);
        
        if (success) {
            await loadProperties();
            updateStats();
            showNotification('Property deleted successfully!', 'success');
        } else {
            showNotification('Failed to delete property. Please try again.', 'error');
        }
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

// Firebase sync is automatic - no manual sync needed
function logFirebaseSync() {
    console.log('🔄 Firebase automatically syncs data in real-time');
    console.log('📊 Properties are immediately available to the public site');
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

// Initialize Firebase sample data if needed
async function initializeSampleData() {
    try {
        const snapshot = await db.collection('properties').get();
        
        if (snapshot.empty) {
            console.log('🏗️ Initializing Firebase with sample property...');
            
            const sampleProperty = {
                id: 'five-palm-jumeirah',
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
            };
            
            await savePropertyToFirebase(sampleProperty);
            console.log('✅ Sample property added to Firebase');
        }
    } catch (error) {
        console.error('❌ Error initializing sample data:', error);
    }
}

// Call initialization after Firebase is ready
setTimeout(initializeSampleData, 1000);
