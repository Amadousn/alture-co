// JS dynamique pour charger les propriétés, afficher la modale et gérer l'admin plus tard

// 1. Exemple de données (sera remplacé par du JSON externe ou du backend plus tard)
const properties = [
  {
    id: 1,
    title: "Palm Jumeirah Villa",
    price: "Price on Request",
    bedrooms: 5,
    bathrooms: 6,
    area: 420,
    shortDesc: "Exclusive beachfront villa with panoramic sea views.",
    fullDesc: "This luxury villa on Palm Jumeirah offers direct beach access, private pool, and breathtaking sea views. High-end finishes and smart home features throughout.",
    location: "Palm Jumeirah, Dubai",
    images: [
      "images/properties/palm-villa-1.jpg",
      "images/properties/palm-villa-2.jpg",
      "images/properties/palm-villa-3.jpg"
    ]
  },
  {
    id: 2,
    title: "Downtown Penthouse",
    price: "AED 28M",
    bedrooms: 4,
    bathrooms: 5,
    area: 350,
    shortDesc: "Spectacular full-floor penthouse with 360-degree views.",
    fullDesc: "Located in the heart of Downtown Dubai, this penthouse offers floor-to-ceiling windows, private elevator, and luxury amenities. Stunning views of Burj Khalifa.",
    location: "Downtown, Dubai",
    images: [
      "images/properties/penthouse-1.jpg",
      "images/properties/penthouse-2.jpg"
    ]
  },
  {
    id: 3,
    title: "Dubai Marina Residence",
    price: "AED 8.2M",
    bedrooms: 3,
    bathrooms: 3,
    area: 180,
    shortDesc: "Elegant waterfront apartment with marina views.",
    fullDesc: "Modern apartment in Dubai Marina with spacious balcony, open kitchen, and access to pool and gym. Walking distance to the beach.",
    location: "Dubai Marina, Dubai",
    images: [
      "images/properties/marina-1.jpg",
      "images/properties/marina-2.jpg"
    ]
  }
];

// 2. Générer la grille de propriétés
const propertiesList = document.getElementById('properties-list');
function renderProperties() {
  propertiesList.innerHTML = properties.map(prop => `
    <div class="property-card" data-id="${prop.id}">
      <img src="${prop.images[0]}" alt="${prop.title}">
      <div class="property-info">
        <h3>${prop.title}</h3>
        <div class="property-meta">${prop.bedrooms} beds · ${prop.bathrooms} baths · ${prop.area} m²</div>
        <div class="property-price">${prop.price}</div>
        <div class="property-short-desc">${prop.shortDesc}</div>
        <button class="view-more-btn">View More</button>
      </div>
    </div>
  `).join('');
}
renderProperties();

// 3. Gestion de la modale
const modal = document.getElementById('property-modal');
const modalGallery = document.getElementById('modal-gallery');
const modalInfo = document.getElementById('modal-info');
const closeModalBtn = document.querySelector('.close-modal');

propertiesList.addEventListener('click', function(e) {
  let card = e.target.closest('.property-card');
  if (!card) return;
  const propId = parseInt(card.getAttribute('data-id'));
  const prop = properties.find(p => p.id === propId);
  if (!prop) return;
  openModal(prop);
});

function openModal(prop) {
  // Galerie
  modalGallery.innerHTML = prop.images.map((img, idx) => `<img src="${img}" alt="${prop.title} photo ${idx+1}" class="${idx===0?'selected':''}">`).join('');
  // Infos
  modalInfo.innerHTML = `
    <h2>${prop.title}</h2>
    <div class="property-meta">${prop.bedrooms} beds · ${prop.bathrooms} baths · ${prop.area} m²</div>
    <div class="property-price">${prop.price}</div>
    <div class="property-location"><i class="fas fa-map-marker-alt"></i> ${prop.location}</div>
    <div class="property-full-desc">${prop.fullDesc}</div>
  `;
  modal.classList.remove('hidden');
}

closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.add('hidden');
});

// Galerie slider dans la modale
modalGallery.addEventListener('click', function(e) {
  if (e.target.tagName !== 'IMG') return;
  Array.from(modalGallery.children).forEach(img => img.classList.remove('selected'));
  e.target.classList.add('selected');
  // Afficher l'image sélectionnée en grand si besoin (amélioration possible)
});

// 4. (À venir) Gestion admin sécurisée
// ...
