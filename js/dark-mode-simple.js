// Script simple pour le mode sombre
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner le bouton de mode sombre
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Vérifier si le mode sombre était activé précédemment
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Appliquer le mode sombre si nécessaire
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    // Ajouter l'événement de clic pour basculer le mode sombre
    darkModeToggle.addEventListener('click', function() {
        // Basculer la classe dark-mode sur le body
        document.body.classList.toggle('dark-mode');
        
        // Mettre à jour l'icône
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('darkMode', 'true');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('darkMode', 'false');
        }
        
        // Afficher un message pour confirmer le changement
        const mode = document.body.classList.contains('dark-mode') ? 'sombre' : 'clair';
        console.log(`Mode ${mode} activé !`);
        
        // Ajouter une animation pour montrer que le changement a été effectué
        darkModeToggle.classList.add('clicked');
        setTimeout(() => {
            darkModeToggle.classList.remove('clicked');
        }, 500);
    });
});
