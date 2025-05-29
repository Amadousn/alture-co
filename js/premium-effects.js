// Effets premium pour Alture & Co
document.addEventListener('DOMContentLoaded', function() {
    // Animation au défilement
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .team-member, .property-card, .value-item, h2, .section-divider');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight * 0.85) {
                element.classList.add('fade-in-up');
                element.style.opacity = 1;
            }
        });
    };
    
    // Initialiser les éléments comme invisibles
    const elementsToAnimate = document.querySelectorAll('.service-card, .team-member, .property-card, .value-item, h2, .section-divider');
    elementsToAnimate.forEach(element => {
        element.style.opacity = 0;
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Exécuter l'animation au chargement et au défilement
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Effet de parallaxe pour les sections avec la classe parallax-bg
    const parallaxSections = document.querySelectorAll('.parallax-bg');
    
    window.addEventListener('scroll', function() {
        parallaxSections.forEach(section => {
            const scrollPosition = window.pageYOffset;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Vérifier si la section est visible
            if (scrollPosition > sectionTop - window.innerHeight && scrollPosition < sectionTop + sectionHeight) {
                const yPos = (scrollPosition - sectionTop) * 0.2;
                section.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    });
    
    // Effet de hover 3D pour les cartes
    const cards = document.querySelectorAll('.service-card, .property-card, .team-member');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            // Calculer l'angle de rotation basé sur la position de la souris
            const rotateX = (mouseY / (cardRect.height / 2)) * -5; // Max 5 degrés
            const rotateY = (mouseX / (cardRect.width / 2)) * 5; // Max 5 degrés
            
            // Appliquer la transformation
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            // Réinitialiser la transformation
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    // Effet de défilement fluide pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset pour le header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Effet de suivi de curseur pour les éléments interactifs
    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursorFollower);
    
    document.addEventListener('mousemove', function(e) {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    });
    
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .property-card, .team-member');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursorFollower.classList.add('active');
        });
        
        element.addEventListener('mouseleave', function() {
            cursorFollower.classList.remove('active');
        });
    });
    
    // Supprimer la classe dark-mode si elle existe
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
    }
    
    // Effet de texte qui se révèle lettre par lettre pour le hero
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.opacity = 0;
            span.style.transition = `opacity 0.1s ease ${i * 0.05}s`;
            heroTitle.appendChild(span);
        }
        
        // Déclencher l'animation après un court délai
        setTimeout(() => {
            heroTitle.querySelectorAll('span').forEach(span => {
                span.style.opacity = 1;
            });
        }, 500);
    }
    
    // Ajout d'un effet de scintillement pour les éléments dorés
    const addGlitter = () => {
        const glitterElements = document.querySelectorAll('.property-price, .service-icon');
        
        glitterElements.forEach(element => {
            const glitter = document.createElement('span');
            glitter.className = 'glitter';
            glitter.style.left = Math.random() * 100 + '%';
            glitter.style.top = Math.random() * 100 + '%';
            glitter.style.animationDelay = Math.random() * 5 + 's';
            element.appendChild(glitter);
        });
    };
    
    addGlitter();
});
