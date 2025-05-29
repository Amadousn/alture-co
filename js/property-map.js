// Interactive property map for Alture & Co.

document.addEventListener('DOMContentLoaded', function() {
    // Create map container if it doesn't exist
    if (!document.getElementById('property-map-container') && document.querySelector('.properties-section')) {
        const propertiesSection = document.querySelector('.properties-section');
        const container = document.querySelector('.properties-section .container');
        
        // Create map container
        const mapContainer = document.createElement('div');
        mapContainer.id = 'property-map-container';
        mapContainer.className = 'property-map-container';
        mapContainer.innerHTML = `
            <h3>Explore Our Properties</h3>
            <div id="property-map" class="property-map"></div>
        `;
        
        // Insert map container before property cards
        container.insertBefore(mapContainer, document.querySelector('.properties-showcase'));
        
        // Add styles for map
        const mapStyles = document.createElement('style');
        mapStyles.textContent = `
            .property-map-container {
                margin: 40px 0;
                text-align: center;
            }
            
            .property-map-container h3 {
                font-family: var(--primary-font);
                font-size: 1.8rem;
                margin-bottom: 20px;
                color: var(--deep-plum);
            }
            
            .property-map {
                width: 100%;
                height: 400px;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                transition: all 0.5s ease;
            }
            
            .property-map:hover {
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            }
            
            .property-map iframe {
                width: 100%;
                height: 100%;
                border: none;
            }
            
            @media (max-width: 768px) {
                .property-map {
                    height: 300px;
                }
            }
        `;
        document.head.appendChild(mapStyles);
        
        // Create iframe with Dubai map
        const mapIframe = document.createElement('iframe');
        mapIframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230818.60133781583!2d55.08335971789384!3d25.07575944872308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sus!4v1590588090657!5m2!1sen!2sus';
        mapIframe.allowFullscreen = true;
        mapIframe.loading = 'lazy';
        
        // Add iframe to map container
        document.getElementById('property-map').appendChild(mapIframe);
    }
    
    // Add property markers to the map (for future enhancement)
    // This would require integration with a mapping API like Google Maps or Mapbox
    
    // For now, we'll add a simple animation to the map container
    const propertyMap = document.getElementById('property-map');
    if (propertyMap) {
        propertyMap.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.5s ease';
        });
        
        propertyMap.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
});
