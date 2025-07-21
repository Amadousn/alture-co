// Firebase Configuration for Production Deployment
// This ensures the site works even after hosting

(function() {
    'use strict';
    
    // Firebase configuration (production)
    const firebaseConfig = {
        apiKey: "AIzaSyAhK9Pn4l1T5r7I_LP2xHxTqfGYV2HwXRYc",
        authDomain: "alture-co.firebaseapp.com",
        projectId: "alture-co",
        storageBucket: "alture-co.appspot.com",
        messagingSenderId: "52265164460",
        appId: "1:52265164460:web:547162a187281d591dc909"
    };
    
    // Initialize Firebase only if not already initialized
    if (!window.firebase || !firebase.apps.length) {
        try {
            // Load Firebase SDK dynamically
            const script1 = document.createElement('script');
            script1.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
            script1.onload = () => {
                const script2 = document.createElement('script');
                script2.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
                script2.onload = () => {
                    const script3 = document.createElement('script');
                    script3.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
                    script3.onload = initializeFirebase;
                    document.head.appendChild(script3);
                };
                document.head.appendChild(script2);
            };
            document.head.appendChild(script1);
        } catch (error) {
            console.log('Firebase not available, using localStorage fallback');
            initializeLocalStorage();
        }
    }
    
    function initializeFirebase() {
        try {
            firebase.initializeApp(firebaseConfig);
            const db = firebase.firestore();
            const storage = firebase.storage();
            
            console.log('✅ Firebase initialized successfully');
            
            // Make Firebase available globally
            window.firebaseDB = db;
            window.firebaseStorage = storage;
            window.firebaseInitialized = true;
            
            // Migrate existing localStorage data to Firebase if needed
            migrateLocalStorageToFirebase();
            
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            initializeLocalStorage();
        }
    }
    
    function initializeLocalStorage() {
        console.log('🔄 Using localStorage fallback mode');
        window.firebaseInitialized = false;
        
        // Enhanced localStorage with better error handling
        window.enhancedLocalStorage = {
            setItem: function(key, value) {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (error) {
                    console.error('LocalStorage error:', error);
                    return false;
                }
            },
            
            getItem: function(key) {
                try {
                    const item = localStorage.getItem(key);
                    return item ? JSON.parse(item) : null;
                } catch (error) {
                    console.error('LocalStorage error:', error);
                    return null;
                }
            },
            
            removeItem: function(key) {
                try {
                    localStorage.removeItem(key);
                    return true;
                } catch (error) {
                    console.error('LocalStorage error:', error);
                    return false;
                }
            }
        };
    }
    
    function migrateLocalStorageToFirebase() {
        if (!window.firebaseDB) return;
        
        try {
            // Migrate properties from localStorage to Firebase
            const localProperties = localStorage.getItem('mainSiteProperties');
            if (localProperties) {
                const properties = JSON.parse(localProperties);
                if (properties.length > 0) {
                    console.log('🔄 Migrating localStorage data to Firebase...');
                    
                    properties.forEach(property => {
                        window.firebaseDB.collection('properties').doc(property.id).set(property)
                            .then(() => console.log('✅ Property migrated:', property.title))
                            .catch(error => console.error('❌ Migration error:', error));
                    });
                }
            }
        } catch (error) {
            console.error('Migration error:', error);
        }
    }
    
    // Universal data management functions that work with both Firebase and localStorage
    window.dataManager = {
        // Save property
        saveProperty: async function(property) {
            if (window.firebaseInitialized && window.firebaseDB) {
                try {
                    await window.firebaseDB.collection('properties').doc(property.id).set(property);
                    console.log('✅ Property saved to Firebase');
                    return true;
                } catch (error) {
                    console.error('Firebase save error:', error);
                    return this.saveToLocalStorage(property);
                }
            } else {
                return this.saveToLocalStorage(property);
            }
        },
        
        // Load properties
        loadProperties: async function() {
            if (window.firebaseInitialized && window.firebaseDB) {
                try {
                    const snapshot = await window.firebaseDB.collection('properties').get();
                    const properties = [];
                    snapshot.forEach(doc => {
                        properties.push({ id: doc.id, ...doc.data() });
                    });
                    console.log('✅ Properties loaded from Firebase:', properties.length);
                    return properties;
                } catch (error) {
                    console.error('Firebase load error:', error);
                    return this.loadFromLocalStorage();
                }
            } else {
                return this.loadFromLocalStorage();
            }
        },
        
        // Delete property
        deleteProperty: async function(propertyId) {
            if (window.firebaseInitialized && window.firebaseDB) {
                try {
                    await window.firebaseDB.collection('properties').doc(propertyId).delete();
                    console.log('✅ Property deleted from Firebase');
                    return true;
                } catch (error) {
                    console.error('Firebase delete error:', error);
                    return this.deleteFromLocalStorage(propertyId);
                }
            } else {
                return this.deleteFromLocalStorage(propertyId);
            }
        },
        
        // LocalStorage fallback methods
        saveToLocalStorage: function(property) {
            try {
                const properties = JSON.parse(localStorage.getItem('mainSiteProperties') || '[]');
                const index = properties.findIndex(p => p.id === property.id);
                
                if (index >= 0) {
                    properties[index] = property;
                } else {
                    properties.push(property);
                }
                
                localStorage.setItem('mainSiteProperties', JSON.stringify(properties));
                console.log('✅ Property saved to localStorage');
                return true;
            } catch (error) {
                console.error('LocalStorage save error:', error);
                return false;
            }
        },
        
        loadFromLocalStorage: function() {
            try {
                const properties = JSON.parse(localStorage.getItem('mainSiteProperties') || '[]');
                console.log('✅ Properties loaded from localStorage:', properties.length);
                return properties;
            } catch (error) {
                console.error('LocalStorage load error:', error);
                return [];
            }
        },
        
        deleteFromLocalStorage: function(propertyId) {
            try {
                const properties = JSON.parse(localStorage.getItem('mainSiteProperties') || '[]');
                const filtered = properties.filter(p => p.id !== propertyId);
                localStorage.setItem('mainSiteProperties', JSON.stringify(filtered));
                console.log('✅ Property deleted from localStorage');
                return true;
            } catch (error) {
                console.error('LocalStorage delete error:', error);
                return false;
            }
        }
    };
    
    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🚀 Data management system initialized');
        });
    }
    
})();
