const API_URL = 'http://localhost:3000/api';

function updateNavbar() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    const loginNavItem = document.getElementById('loginNavItem');
    const userNavItem = document.getElementById('userNavItem');
    const userNameNav = document.getElementById('userNameNav');
    const adminNavLink = document.getElementById('adminNavLink');
    
    if (user && loginNavItem && userNavItem && userNameNav) {
        loginNavItem.style.display = 'none';
        userNavItem.style.display = 'block';
        userNameNav.textContent = user.username;
        
        if (adminNavLink) {
            if (user.role === 'admin') {
                adminNavLink.style.display = 'block';
            } else {
                adminNavLink.style.display = 'none';
            }
        }
    } 
    else if (loginNavItem && userNavItem) {
        loginNavItem.style.display = 'block';
        userNavItem.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', updateNavbar);
