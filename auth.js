// Login Form
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Basic validation
    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate API call
    simulateLogin(email, password)
        .then(user => {
            window.location.href = 'dashboard.html';
        })
        .catch(error => {
            showAlert(error.message, 'error');
        });
});

// Registration Form
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    // Validation
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }
    
    // Simulate registration
    simulateRegistration(name, email, password)
        .then(() => {
            showAlert('Registration successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        })
        .catch(error => {
            showAlert(error.message, 'error');
        });
});

// Password Recovery
document.getElementById('passwordResetForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('reset-email').value;
    
    if (!email) {
        showAlert('Please enter your email', 'error');
        return;
    }
    
    showAlert('Password reset link has been sent to your email', 'success');
});

// Helper functions
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Simulated API functions (replace with real API calls)
async function simulateLogin(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email === 'test@example.com' && password === 'password123') {
                resolve({ name: 'Test User', email });
            } else {
                reject(new Error('Invalid email or password'));
            }
        }, 1000);
    });
}

async function simulateRegistration(name, email, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // In a real app, you would send this to your backend
            console.log('Registered:', { name, email });
            resolve();
        }, 1000);
    });
}