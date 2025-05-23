document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const userRole = localStorage.getItem('role');
    if (userRole !== 'ADMIN') {
        window.location.href = 'calendar.html';
        return;
    }

    // DOM Elements
    const usersList = document.getElementById('users-list');
    const addUserBtn = document.getElementById('add-user-btn');
    const userModal = document.getElementById('user-modal');
    const closeUserModal = document.getElementById('close-user-modal');
    const userForm = document.getElementById('user-form');
    const saveUserBtn = document.getElementById('save-user-btn');
    const userModalTitle = document.getElementById('user-modal-title');
    const passwordGroup = document.getElementById('password-group');
    
    // Current user being edited
    let currentUserId = null;
    
    // Fetch users on load
    fetchUsers();
    
    // Add event listeners
    addUserBtn.addEventListener('click', showAddUserModal);
    closeUserModal.addEventListener('click', closeModal);
    userForm.addEventListener('submit', saveUser);
    
    // Functions
    function fetchUsers() {
        const token = localStorage.getItem('token');
        
        fetch('/api/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(users => {
            renderUsers(users);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
    }
    
    function renderUsers(users) {
        usersList.innerHTML = '';
        
        users.forEach(user => {
            const li = document.createElement('li');
            li.className = 'user-item';
            
            const userInfo = document.createElement('div');
            userInfo.className = 'user-info';
            userInfo.innerHTML = `
                <h3>${user.username}</h3>
                <p>${user.fullName} (${user.email})</p>
                <p>Role: ${user.role}</p>
                <p>Status: ${user.active ? 'Active' : 'Inactive'}</p>
            `;
            
            const userActions = document.createElement('div');
            userActions.className = 'user-actions';
            
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => showEditUserModal(user));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteUser(user.id));
            
            userActions.appendChild(editBtn);
            userActions.appendChild(deleteBtn);
            
            li.appendChild(userInfo);
            li.appendChild(userActions);
            usersList.appendChild(li);
        });
    }
    
    function showAddUserModal() {
        userModalTitle.textContent = 'Add User';
        userForm.reset();
        currentUserId = null;
        passwordGroup.style.display = 'block';
        userModal.style.display = 'block';
    }
    
    function showEditUserModal(user) {
        userModalTitle.textContent = 'Edit User';
        
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        document.getElementById('fullName').value = user.fullName;
        document.getElementById('role').value = user.role;
        document.getElementById('active').value = user.active.toString();
        
        // Hide password field for editing
        passwordGroup.style.display = 'none';
        
        currentUserId = user.id;
        userModal.style.display = 'block';
    }
    
    function closeModal() {
        userModal.style.display = 'none';
    }
    
    function saveUser(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const fullName = document.getElementById('fullName').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        const active = document.getElementById('active').value === 'true';
        
        const token = localStorage.getItem('token');
        
        let userData = {
            username,
            email,
            fullName,
            role,
            active
        };
        
        if (!currentUserId) {
            // Adding a new user
            userData.password = password;
            
            fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create user');
                }
                return response.json();
            })
            .then(() => {
                closeModal();
                fetchUsers();
            })
            .catch(error => {
                console.error('Error creating user:', error);
            });
        } else {
            // Updating an existing user
            fetch(`/api/users/${currentUserId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update user');
                }
                return response.json();
            })
            .then(() => {
                closeModal();
                fetchUsers();
            })
            .catch(error => {
                console.error('Error updating user:', error);
            });
        }
    }
    
    function deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }
        
        const token = localStorage.getItem('token');
        
        fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            return response.text();
        })
        .then(() => {
            fetchUsers();
        })
        .catch(error => {
            console.error('Error deleting user:', error);
        });
    }
}); 