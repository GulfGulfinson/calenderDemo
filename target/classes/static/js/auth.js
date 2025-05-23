document.addEventListener('DOMContentLoaded', function() {
    // Tab elements
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Login elements
    const loginButton = document.getElementById('login-button');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');

    // Register elements
    const registerButton = document.getElementById('register-button');
    const regUsernameInput = document.getElementById('reg-username');
    const regEmailInput = document.getElementById('reg-email');
    const regFullNameInput = document.getElementById('reg-fullname');
    const regPasswordInput = document.getElementById('reg-password');
    const registerError = document.getElementById('register-error');

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'calendar.html';
    }

    // Tab navigation
    loginTab.addEventListener('click', function() {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    registerTab.addEventListener('click', function() {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    });

    // Handle login
    loginButton.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            loginError.textContent = 'Please enter both username and password';
            return;
        }

        loginError.textContent = '';
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';

        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid username or password');
            }
            return response.json();
        })
        .then(data => {
            // Store token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.id);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            
            // Redirect to calendar page
            window.location.href = 'calendar.html';
        })
        .catch(error => {
            loginError.textContent = error.message;
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
        });
    });

    // Handle registration
    registerButton.addEventListener('click', function() {
        const username = regUsernameInput.value.trim();
        const email = regEmailInput.value.trim();
        const fullName = regFullNameInput.value.trim();
        const password = regPasswordInput.value;

        if (!username || !email || !fullName || !password) {
            registerError.textContent = 'Please fill in all fields';
            return;
        }

        registerError.textContent = '';
        registerButton.disabled = true;
        registerButton.textContent = 'Registering...';

        fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                fullName: fullName,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 400) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Registration failed. Username or email already exists.');
                    });
                }
                throw new Error('Registration failed. Please try again.');
            }
            return response.json();
        })
        .then(() => {
            // Show success message and switch to login tab
            registerForm.innerHTML = '<div class="success-message">Registration successful! You can now log in.</div>';
            setTimeout(() => {
                loginTab.click();
            }, 2000);
        })
        .catch(error => {
            registerError.textContent = error.message;
            registerButton.disabled = false;
            registerButton.textContent = 'Register';
        });
    });

    // Add event listener for Enter key
    passwordInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            loginButton.click();
        }
    });

    regPasswordInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            registerButton.click();
        }
    });
}); 