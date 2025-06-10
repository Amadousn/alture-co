// Service Cards Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Add hover effects and touch support for mobile
    serviceCards.forEach(card => {
        // For desktop hover
        card.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('active');
        });
        
        // For mobile touch
        card.addEventListener('touchstart', function(e) {
            // Prevent default only if this card doesn't have active class yet
            if (!this.classList.contains('active')) {
                e.preventDefault();
                
                // Remove active class from all cards
                serviceCards.forEach(c => c.classList.remove('active'));
                
                // Add active class to this card
                this.classList.add('active');
            }
        });
    });
    
    // Close active card when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.service-card')) {
            serviceCards.forEach(card => card.classList.remove('active'));
        }
    });
});
