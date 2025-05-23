document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login page
        window.location.href = 'index.html';
        return;
    }

    // Setup navigation
    setupNavigation();

    // Setup logout functionality
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});

function setupNavigation() {
    // Show admin nav if user is admin
    const role = localStorage.getItem('role');
    const adminNav = document.getElementById('admin-nav');
    if (adminNav && role === 'ADMIN') {
        adminNav.style.display = 'block';
    }
}

function logout() {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    
    // Redirect to login page
    window.location.href = 'index.html';
} 