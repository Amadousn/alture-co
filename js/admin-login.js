// Admin Login Integration for Properties Page
// Allows admin to login directly from properties page and edit properties

(function() {
    'use strict';
    
    let isAdminLoggedIn = false;
    
    // Check if admin is already logged in
    function checkAdminAuth() {
        const token = localStorage.getItem('adminToken');
        const loginTime = localStorage.getItem('loginTime');
        const currentTime = Date.now();
        
        if (token && token === 'authenticated' && (currentTime - loginTime < 24 * 60 * 60 * 1000)) {
            isAdminLoggedIn = true;
            showAdminControls();
            return true;
        }
        
        isAdminLoggedIn = false;
        hideAdminControls();
        return false;
    }
    
    // Show admin login modal
    function showAdminLogin() {
        const modalHTML = `
            <div id="adminLoginModal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 20000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            ">
                <div style="
                    background: white;
                    border-radius: 15px;
                    width: 100%;
                    max-width: 400px;
                    padding: 30px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                    position: relative;
                ">
                    <button onclick="closeAdminLogin()" style="
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #666;
                    ">&times;</button>
                    
                    <h2 style="
                        margin: 0 0 20px 0;
                        color: #333;
                        text-align: center;
                        font-size: 1.5rem;
                    ">Admin Access</h2>
                    
                    <form id="adminLoginForm" style="display: flex; flex-direction: column; gap: 15px;">
                        <input 
                            type="text" 
                            id="adminUsername" 
                            placeholder="Username" 
                            required
                            style="
                                padding: 12px 15px;
                                border: 2px solid #ddd;
                                border-radius: 8px;
                                font-size: 16px;
                                outline: none;
                                transition: border-color 0.3s;
                            "
                        >
                        <input 
                            type="password" 
                            id="adminPassword" 
                            placeholder="Password" 
                            required
                            style="
                                padding: 12px 15px;
                                border: 2px solid #ddd;
                                border-radius: 8px;
                                font-size: 16px;
                                outline: none;
                                transition: border-color 0.3s;
                            "
                        >
                        <button 
                            type="submit" 
                            style="
                                background: #D14D72;
                                color: white;
                                border: none;
                                padding: 12px 20px;
                                border-radius: 8px;
                                font-size: 16px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: background-color 0.3s;
                            "
                            onmouseover="this.style.background='#b13a5c'"
                            onmouseout="this.style.background='#D14D72'"
                        >Login</button>
                    </form>
                    
                    <div id="loginError" style="
                        color: #dc3545;
                        text-align: center;
                        margin-top: 15px;
                        display: none;
                    "></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';
        
        // Handle form submission
        document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
        
        // Focus on username field
        document.getElementById('adminUsername').focus();
    }
    
    // Handle admin login
    function handleAdminLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        const errorDiv = document.getElementById('loginError');
        
        // Simple authentication (in production, use proper authentication)
        if (username === 'admin' && password === 'admin123') {
            // Set authentication
            localStorage.setItem('adminToken', 'authenticated');
            localStorage.setItem('loginTime', Date.now().toString());
            
            isAdminLoggedIn = true;
            closeAdminLogin();
            showAdminControls();
            showNotification('Admin logged in successfully!', 'success');
        } else {
            errorDiv.textContent = 'Invalid username or password';
            errorDiv.style.display = 'block';
            
            // Clear error after 3 seconds
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        }
    }
    
    // Close admin login modal
    function closeAdminLogin() {
        const modal = document.getElementById('adminLoginModal');
        if (modal) {
            modal.remove();
        }
        document.body.style.overflow = '';
    }
    
    // Show admin controls
    function showAdminControls() {
        // Update the permanent admin button
        addPermanentAdminButton();
        
        // Add edit buttons to property cards
        addEditButtonsToProperties();
    }
    
    // Hide admin controls
    function hideAdminControls() {
        // Update the permanent admin button to show login state
        addPermanentAdminButton();
        
        // Remove edit buttons from property cards
        document.querySelectorAll('.admin-edit-btn').forEach(btn => btn.remove());
    }
    
    // Add edit buttons to property cards
    function addEditButtonsToProperties() {
        setTimeout(() => {
            const propertyCards = document.querySelectorAll('.property-card');
            propertyCards.forEach(card => {
                // Check if edit button already exists
                if (card.querySelector('.admin-edit-btn')) return;
                
                const propertyId = card.getAttribute('data-property-id');
                if (propertyId) {
                    const editBtn = document.createElement('button');
                    editBtn.className = 'admin-edit-btn';
                    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                    editBtn.style.cssText = `
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        background: rgba(209, 77, 114, 0.9);
                        color: white;
                        border: none;
                        width: 35px;
                        height: 35px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 14px;
                        z-index: 10;
                        transition: all 0.3s ease;
                    `;
                    editBtn.onmouseover = () => editBtn.style.background = 'rgba(177, 58, 92, 0.9)';
                    editBtn.onmouseout = () => editBtn.style.background = 'rgba(209, 77, 114, 0.9)';
                    editBtn.onclick = (e) => {
                        e.stopPropagation();
                        window.open(`admin/dashboard.html#edit-${propertyId}`, '_blank');
                    };
                    
                    const imageContainer = card.querySelector('.property-image-container');
                    if (imageContainer) {
                        imageContainer.style.position = 'relative';
                        imageContainer.appendChild(editBtn);
                    }
                }
            });
        }, 1000);
    }
    
    // Admin logout
    function adminLogout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('loginTime');
        isAdminLoggedIn = false;
        hideAdminControls();
        showNotification('Admin logged out', 'success');
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 21000;
            max-width: 300px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        notification.style.background = type === 'success' ? '#28a745' : '#dc3545';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Initialize admin system
    function initAdminSystem() {
        checkAdminAuth();
        
        // Add admin login trigger (Ctrl+Shift+A)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                if (!isAdminLoggedIn) {
                    showAdminLogin();
                } else {
                    adminLogout();
                }
            }
        });
        
        // Add permanent admin button in header (visible BEFORE login)
        addPermanentAdminButton();
        
        // Add admin login button to footer as backup
        const footer = document.querySelector('footer');
        if (footer) {
            const adminLink = document.createElement('div');
            adminLink.style.cssText = `
                text-align: center;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #333;
                opacity: 0.5;
                font-size: 12px;
            `;
            adminLink.innerHTML = `
                <a href="#" onclick="window.adminLogin.showLogin(); return false;" style="
                    color: #666;
                    text-decoration: none;
                    transition: color 0.3s;
                " onmouseover="this.style.color='#D14D72'" onmouseout="this.style.color='#666'">
                    Admin Access
                </a>
            `;
            footer.appendChild(adminLink);
        }
    }
    
    // Add permanent admin button that's always visible
    function addPermanentAdminButton() {
        // Remove existing admin button if any
        const existingBtn = document.getElementById('permanentAdminBtn');
        if (existingBtn) existingBtn.remove();
        
        const adminBtn = document.createElement('button');
        adminBtn.id = 'permanentAdminBtn';
        adminBtn.innerHTML = isAdminLoggedIn ? 
            '<i class="fas fa-user-shield"></i> Admin Panel' : 
            '<i class="fas fa-key"></i> Admin Login';
        
        adminBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isAdminLoggedIn ? '#28a745' : '#D14D72'};
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        adminBtn.onmouseover = () => {
            adminBtn.style.transform = 'translateY(-2px)';
            adminBtn.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
        };
        
        adminBtn.onmouseout = () => {
            adminBtn.style.transform = 'translateY(0)';
            adminBtn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        };
        
        adminBtn.onclick = () => {
            if (isAdminLoggedIn) {
                // If logged in, open admin dashboard
                window.open('admin/dashboard.html', '_blank');
            } else {
                // If not logged in, show login modal
                showAdminLogin();
            }
        };
        
        document.body.appendChild(adminBtn);
    }
    
    // Make functions globally available
    window.adminLogin = {
        showLogin: showAdminLogin,
        closeLogin: closeAdminLogin,
        logout: adminLogout,
        isLoggedIn: () => isAdminLoggedIn
    };
    
    window.closeAdminLogin = closeAdminLogin;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdminSystem);
    } else {
        initAdminSystem();
    }
    
})();
