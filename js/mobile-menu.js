document.addEventListener('DOMContentLoaded', () => {
  // Sélection des éléments
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-navigation');
  const overlay = document.querySelector('.nav-overlay');
  const body = document.body;
  const navLinks = document.querySelectorAll('.nav-link');

  // Fonction pour ouvrir le menu
  function openMenu() {
    nav.classList.add('is-open');
    overlay.classList.add('is-visible');
    body.classList.add('menu-open');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    
    // Bloquer le défilement du body
    document.documentElement.style.overflow = 'hidden';
    
    // Mettre à jour l'état du bouton
    menuToggle.setAttribute('aria-label', 'Fermer le menu');
  }

  // Fonction pour fermer le menu
  function closeMenu() {
    nav.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    body.classList.remove('menu-open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    
    // Rétablir le défilement du body
    document.documentElement.style.overflow = '';
    
    // Mettre à jour l'état du bouton
    menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
  }

  // Fonction pour basculer le menu
  function toggleMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (nav.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Vérifier que les éléments existent avant d'ajouter les écouteurs
  if (menuToggle && nav && overlay) {
    // Gestionnaire de clic pour le bouton menu
    menuToggle.addEventListener('click', toggleMenu);
    
    // Fermer le menu en cliquant sur l'overlay
    overlay.addEventListener('click', closeMenu);
    
    // Fermer le menu en cliquant sur un lien
    if (navLinks.length > 0) {
      navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
      });
    }
    
    // Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
      }
    });
    
    // Fermer le menu si la fenêtre est redimensionnée au-dessus de 992px
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 992) {
          closeMenu();
        }
      }, 250);
    });
    
    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', (e) => {
      const isClickInside = nav.contains(e.target) || menuToggle.contains(e.target);
      if (!isClickInside && nav.classList.contains('is-open')) {
        closeMenu();
      }
    });
    
  } else {
    console.error('Éléments du menu non trouvés :', { menuToggle, nav, overlay });
  }
});
