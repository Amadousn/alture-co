// Contact Form Handler for Alture & Co.
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const formStatusMessage = document.getElementById('formStatusMessage');
    const submitButton = document.getElementById('submitButton');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Change button state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Send form data to Formspree
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    // Success message
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#4CAF50';
                    formStatusMessage.textContent = 'Thank you for your message. We will be in touch shortly.';
                    contactForm.reset();
                } else {
                    // Error message
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#D14D72';
                    formStatusMessage.textContent = 'There was an error sending your message. Please try again later.';
                }
            })
            .catch(error => {
                // Network error message
                formStatus.style.display = 'block';
                formStatus.style.color = '#D14D72';
                formStatusMessage.textContent = 'There was a network error. Please try again later.';
                console.error('Error:', error);
            })
            .finally(() => {
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
                
                // Scroll to form status message
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Hide status message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            });
        });
    }
});
