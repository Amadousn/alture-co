/**
 * SCRIPT DE RESTAURATION D'URGENCE
 * Ce script force le design original et le titre complet sur mobile
 * avec le niveau de priorité le plus élevé possible (modification directe du DOM)
 */

// S'exécute immédiatement
(function() {
    // Force l'application instantanée au chargement
    function forceOriginalDesign() {
        if (window.innerWidth <= 768) {
            console.log("🔄 Application du design original sur mobile");
            
            // RESTAURATION DU TITRE COMPLET
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                // Assurer que le contenu est correct
                if (!heroTitle.innerHTML.toLowerCase().includes('strategic') || !heroTitle.innerHTML.toLowerCase().includes('portfolio')) {
                    heroTitle.innerHTML = '<span class="title-part-1">Strategic</span> <span class="title-part-2">Portfolio</span> <span class="title-part-3">Management</span>';
                }
                
                // Appliquer les styles directement au DOM
                heroTitle.style.cssText = `
                    display: block !important;
                    visibility: visible !important;
                    position: relative !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    text-align: center !important;
                    padding: 20px 15px !important;
                    margin: 60px auto 20px !important;
                    font-size: 1.8rem !important;
                    line-height: 1.2 !important;
                    color: #FFFFFF !important;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7) !important;
                    z-index: 100 !important;
                    font-weight: 500 !important;
                    opacity: 1 !important;
                `;
                
                // Style pour chaque partie du titre
                const spans = heroTitle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.cssText = `
                        display: block !important;
                        width: 100% !important;
                        text-align: center !important;
                        margin-bottom: 5px !important;
                        color: #FFFFFF !important;
                    `;
                });
            }
            
            // RESTAURATION DU FOND AVEC IMAGE
            const hero = document.querySelector('.hero');
            if (hero) {
                // Forcer le style de fond d'origine
                hero.style.cssText = `
                    background-image: url('images/hero-bg.jpg') !important;
                    background-color: transparent !important;
                    background-size: cover !important;
                    background-position: center center !important;
                    height: auto !important;
                    min-height: 100vh !important;
                    position: relative !important;
                    z-index: 1 !important;
                    padding-top: 60px !important;
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: flex-start !important;
                `;
                
                // Ajouter un overlay pour la lisibilité
                if (!hero.querySelector('.hero-overlay')) {
                    const overlay = document.createElement('div');
                    overlay.className = 'hero-overlay';
                    overlay.style.cssText = `
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        background: rgba(0, 0, 0, 0.5) !important;
                        z-index: 0 !important;
                    `;
                    hero.insertBefore(overlay, hero.firstChild);
                }
            }
            
            // S'assurer que la section hero-content est bien positionnée
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.cssText = `
                    width: 100% !important;
                    max-width: 100% !important;
                    padding: 20px 15px !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    position: relative !important;
                    z-index: 10 !important;
                `;
            }
            
            // Masquer "WHAT WE OFFER" s'il apparaît en haut
            const whatWeOffer = document.querySelector('h2:contains("WHAT WE OFFER")');
            if (whatWeOffer && whatWeOffer.offsetTop < 100) {
                whatWeOffer.style.display = 'none';
            }
            
            // Supprimer tout fond violet qui pourrait être appliqué
            document.querySelectorAll('section, div, body').forEach(el => {
                const computedStyle = window.getComputedStyle(el);
                const bgColor = computedStyle.backgroundColor;
                
                // Si c'est un fond violet/pourpre, le rendre transparent
                if (bgColor.includes('rgb') && 
                    parseInt(bgColor.split(',')[0].replace(/[^\d]/g, '')) > 100 &&
                    parseInt(bgColor.split(',')[1].replace(/[^\d]/g, '')) < 50 &&
                    parseInt(bgColor.split(',')[2].replace(/[^\d]/g, '')) < 100) {
                    el.style.backgroundColor = 'transparent !important';
                }
            });
            
            // WHO WE ARE toujours masqué
            const whoWeAre = document.getElementById('who-we-are') || document.querySelector('.who-we-are');
            if (whoWeAre) {
                whoWeAre.style.display = 'none';
                whoWeAre.style.visibility = 'hidden';
            }
            
            console.log("✅ Design original appliqué sur mobile");
        }
    }
    
    // Exécuter immédiatement
    forceOriginalDesign();
    
    // Exécuter à nouveau après chargement complet
    if (document.readyState === 'complete') {
        forceOriginalDesign();
    } else {
        window.addEventListener('DOMContentLoaded', forceOriginalDesign);
        window.addEventListener('load', forceOriginalDesign);
    }
    
    // Exécuter plusieurs fois pour s'assurer que les styles ne sont pas écrasés
    setTimeout(forceOriginalDesign, 100);
    setTimeout(forceOriginalDesign, 500);
    setTimeout(forceOriginalDesign, 1000);
    setTimeout(forceOriginalDesign, 2000);
    
    // Observer les changements et réappliquer si nécessaire
    const observer = new MutationObserver(forceOriginalDesign);
    observer.observe(document.documentElement, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
    
    // Réappliquer lors du redimensionnement
    window.addEventListener('resize', forceOriginalDesign);
})();
