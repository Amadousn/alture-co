// Gallery functionality for Alture & Co.
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the gallery modal
    const modal = document.getElementById('property-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const closeBtn = document.getElementsByClassName('close-modal')[0];
    
    // Add click event to all gallery items
    const galleryItems = document.querySelectorAll('.property-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            modal.style.display = 'flex';
            modalImg.src = this.querySelector('img').src;
            modalTitle.textContent = this.querySelector('h4').textContent;
            modalDesc.textContent = this.querySelector('.property-description').textContent;
            
            // Disable scrolling on body when modal is open
            document.body.style.overflow = 'hidden';
            
            // Add animation class
            modal.classList.add('modal-active');
        });
    });
    
    // Close modal when clicking the close button
    closeBtn.addEventListener('click', function() {
        closeModal();
    });
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Function to close the modal
    function closeModal() {
        modal.classList.remove('modal-active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    // Filter gallery items
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                } else if (item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});
