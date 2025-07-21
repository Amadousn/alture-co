# 🚀 Guide de Déploiement - Alture & Co. Website

## 📋 Résumé
Ce site web immobilier utilise **Firebase** pour la synchronisation temps réel entre le dashboard admin et le site public. Toutes les modifications faites via le dashboard admin sont immédiatement visibles sur le site public.

## 🔥 Configuration Firebase

### 1. Créer un projet Firebase
1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Créer un nouveau projet nommé `alture-co-properties`
3. Activer Firestore Database
4. Activer Firebase Hosting

### 2. Configuration Firestore
- **Collection**: `properties`
- **Règles de sécurité**: Lecture publique, écriture autorisée (voir `firestore.rules`)
- **Index**: Tri par `createdAt` descendant (voir `firestore.indexes.json`)

### 3. Clés de configuration
Les clés Firebase sont déjà configurées dans :
- `admin/dashboard.html`
- `properties.html`

**⚠️ Important**: Remplacer les clés de configuration par les vraies clés du projet Firebase.

## 🌐 Déploiement

### Option 1: Firebase Hosting (Recommandé)
```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter à Firebase
firebase login

# Déployer
firebase deploy
```

### Option 2: Netlify/Vercel
1. Connecter le dépôt GitHub
2. Configurer le dossier racine comme source
3. Déployer automatiquement

## 📁 Structure du Projet

```
alture-co-master/
├── index.html              # Page d'accueil
├── properties.html         # Page des propriétés (publique)
├── admin/
│   ├── index.html          # Login admin
│   ├── dashboard.html      # Dashboard admin
│   └── dashboard.js        # Logique admin (Firebase)
├── js/
│   ├── properties-loader.js # Chargement dynamique (Firebase)
│   └── gallery-simple.js   # Galerie dynamique (Firebase)
├── firebase.json           # Configuration Firebase
├── firestore.rules         # Règles Firestore
└── firestore.indexes.json  # Index Firestore
```

## 🔧 Fonctionnalités

### Dashboard Admin
- **URL**: `/admin/dashboard.html`
- **Login**: admin / admin123
- **Fonctionnalités**:
  - Ajouter/modifier/supprimer des propriétés
  - Upload d'images
  - Gestion des amenities et caractéristiques
  - Synchronisation temps réel avec Firebase

### Site Public
- **Pages**: `/` et `/properties.html`
- **Fonctionnalités**:
  - Affichage dynamique des propriétés
  - Galerie d'images interactive
  - Mise à jour temps réel depuis Firebase
  - Design responsive

## 🔄 Synchronisation Temps Réel

1. **Admin ajoute une propriété** → Sauvegarde dans Firebase
2. **Site public** → Mise à jour automatique via listener Firebase
3. **Galerie** → Images et données chargées dynamiquement

## 📱 URLs de Production

Une fois déployé, le site sera accessible via :
- **Site public**: `https://alture-co-properties.web.app/`
- **Dashboard admin**: `https://alture-co-properties.web.app/admin/dashboard.html`

## 🛠️ Maintenance

### Ajouter une nouvelle propriété
1. Aller sur le dashboard admin
2. Cliquer "Add New Property"
3. Remplir les informations
4. Uploader les images
5. Sauvegarder → Visible immédiatement sur le site public

### Modifier une propriété existante
1. Aller sur le dashboard admin
2. Cliquer "Edit" sur la propriété
3. Modifier les informations
4. Sauvegarder → Mise à jour immédiate

## 🔒 Sécurité

- **Dashboard admin**: Protégé par login
- **Firebase**: Règles de sécurité configurées
- **HTTPS**: Automatique avec Firebase Hosting

## 📞 Support

Pour toute question technique, contacter le développeur avec ce guide et les fichiers de configuration.

---

✅ **Site prêt pour la production et la livraison client !**
