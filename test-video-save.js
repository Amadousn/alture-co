// Test script to verify video saving functionality
console.log('=== Video Save Test ===');

// Check current localStorage
const properties = JSON.parse(localStorage.getItem('properties')) || [];
console.log('Current properties in localStorage:', properties.length);

properties.forEach((property, index) => {
    console.log(`Property ${index + 1}: ${property.title}`);
    console.log(`  - Images: ${property.images ? property.images.length : 0}`);
    console.log(`  - Videos: ${property.videos ? property.videos.length : 0}`);
    
    if (property.videos && property.videos.length > 0) {
        property.videos.forEach((video, vIndex) => {
            console.log(`    Video ${vIndex + 1}: ${video.substring(0, 50)}... (length: ${video.length})`);
        });
    }
});

// Test the getUploadedVideos function from dashboard.js
function testGetUploadedVideos() {
    const videos = [];
    const previewContainer = document.getElementById('videoPreview');
    
    if (!previewContainer) {
        console.log('ERROR: videoPreview container not found');
        return [];
    }
    
    const videoElements = previewContainer.querySelectorAll('video');
    console.log(`Found ${videoElements.length} video elements in preview`);
    
    videoElements.forEach((video, index) => {
        console.log(`Video ${index + 1}:`);
        console.log(`  - src: ${video.src ? 'Present' : 'Missing'} (length: ${video.src ? video.src.length : 0})`);
        console.log(`  - currentSrc: ${video.currentSrc ? 'Present' : 'Missing'}`);
        
        if (video.src) {
            videos.push(video.src);
        }
    });
    
    return videos;
}

// Make function available globally for testing
window.testGetUploadedVideos = testGetUploadedVideos;

console.log('Test script loaded. Use testGetUploadedVideos() to test video retrieval.');
