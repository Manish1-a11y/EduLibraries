// main.js - Core functionality for EduLibraries

// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const courseModal = document.getElementById('courseModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const searchForm = document.querySelector('.search-box');
const contactForm = document.getElementById('contactForm');

// Global State
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
const users = JSON.parse(localStorage.getItem('users')) || [];
const courses = {
    // (Same course data structure as before)
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication state
    checkAuthState();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load appropriate content based on page
    loadPageContent();
});

function checkAuthState() {
    if (currentUser) {
        updateAuthUI(true);
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('register.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        updateAuthUI(false);
    }
}

function updateAuthUI(isLoggedIn) {
    const loginBtn = document.querySelector('.nav-buttons .btn-secondary');
    const registerBtn = document.querySelector('.nav-buttons .btn-primary');
    
    if (isLoggedIn) {
        loginBtn.textContent = 'Dashboard';
        loginBtn.href = 'dashboard.html';
        registerBtn.textContent = 'Logout';
        registerBtn.href = '#';
        registerBtn.onclick = handleLogout;
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.href = 'login.html';
        registerBtn.textContent = 'Register';
        registerBtn.href = 'register.html';
        registerBtn.onclick = null;
    }
}

function setupEventListeners() {
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Modal close button
    document.querySelector('.close-modal')?.addEventListener('click', closeModal);
    
    // Course card clicks
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course-id');
            openCourseModal(courseId);
        });
    });
    
    // Form submissions
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (searchForm) searchForm.addEventListener('submit', handleSearch);
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
    
    // Download buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('download-btn')) {
            e.preventDefault();
            handleDownload(e.target);
        }
    });
}

function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
}

// Course Modal Functions
function openCourseModal(courseId) {
    const course = courses[courseId];
    const modalContent = document.getElementById('courseModalContent');
    
    // Generate modal content
    let content = `
        <div class="course-details-header">
            <div class="course-details-img">
                <i class="${course.icon}" style="font-size: 3rem;"></i>
            </div>
            <div class="course-details-info">
                <h2>${course.title}</h2>
                <p>${course.description}</p>
                <p><strong>Faculty:</strong> ${course.faculty}</p>
                <p><strong>Duration:</strong> ${course.duration}</p>
                <p><strong>Credits:</strong> ${course.credits}</p>
            </div>
        </div>
        
        <div class="course-details-tabs">
            ${Object.keys(course.semesters).map((semester, index) => `
                <div class="tab-btn ${index === 0 ? 'active' : ''}" 
                     onclick="switchTab(event, 'semester${index + 1}')">
                    ${semester}
                </div>
            `).join('')}
            <div class="tab-btn" onclick="switchTab(event, 'details')">Course Details</div>
        </div>
        
        ${Object.entries(course.semesters).map(([semester, resources], index) => `
            <div id="semester${index + 1}" class="tab-content ${index === 0 ? 'active' : ''}">
                <h3>${semester} Resources</h3>
                <div class="semester-resources-list">
                    ${resources.map(resource => `
                        <div class="resource-item">
                            <div>
                                <div class="resource-name">${resource.name}</div>
                                <small>${resource.type} • ${resource.format}</small>
                            </div>
                            <a href="#" class="download-btn" data-resource-id="${resource.id}">Download</a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}
        
        <div id="details" class="tab-content">
            <h3>Course Details</h3>
            <p><strong>Program Overview:</strong> ${course.details.overview}</p>
            <p><strong>Learning Outcomes:</strong> ${course.details.outcomes}</p>
            <p><strong>Assessment Methods:</strong> ${course.details.assessment}</p>
        </div>
    `;
    
    modalContent.innerHTML = content;
    courseModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    courseModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchTab(event, tabId) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    event.target.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid email or password');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        alert('Email already registered');
        return;
    }
    
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        enrolledCourses: [],
        downloadedResources: [],
        bookmarks: []
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    window.location.href = 'dashboard.html';
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Resource Functions
function handleDownload(button) {
    if (!currentUser) {
        alert('Please login to download resources');
        window.location.href = 'login.html';
        return;
    }
    
    const resourceId = button.getAttribute('data-resource-id');
    const resource = findResourceById(resourceId);
    
    if (resource) {
        // In a real app, this would trigger an actual download
        // For demo, we'll just track it
        if (!currentUser.downloadedResources.includes(resourceId)) {
            currentUser.downloadedResources.push(resourceId);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update users array
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
        
        alert(`Downloading: ${resource.name}`);
    }
}

function findResourceById(resourceId) {
    // Search through all courses to find the resource
    for (const course of Object.values(courses)) {
        for (const semester of Object.values(course.semesters)) {
            const resource = semester.find(r => r.id === resourceId);
            if (resource) return resource;
        }
    }
    return null;
}

// Search Functionality
function handleSearch(e) {
    e.preventDefault();
    const query = document.querySelector('.search-box input').value.toLowerCase();
    
    if (!query.trim()) {
        alert('Please enter a search term');
        return;
    }
    
    const results = [];
    
    // Search through all resources
    for (const [courseId, course] of Object.entries(courses)) {
        for (const [semester, resources] of Object.entries(course.semesters)) {
            for (const resource of resources) {
                if (resource.name.toLowerCase().includes(query) || 
                    resource.type.toLowerCase().includes(query)) {
                    results.push({
                        ...resource,
                        course: course.title,
                        semester
                    });
                }
            }
        }
    }
    
    displaySearchResults(results);
}

function displaySearchResults(results) {
    const resultsContainer = document.querySelector('.search-results');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found. Try a different search term.</p>';
        return;
    }
    
    resultsContainer.innerHTML = results.map(result => `
        <div class="search-result-card">
            <div class="search-result-content">
                <h3 class="search-result-title">${result.name}</h3>
                <div class="search-result-meta">
                    <span>${result.course}</span>
                    <span>${result.semester}</span>
                </div>
                <p>${result.type} • ${result.format}</p>
                <a href="#" class="btn btn-secondary download-btn" 
                   data-resource-id="${result.id}" style="margin-top: 15px;">
                    Download
                </a>
            </div>
        </div>
    `).join('');
}

// Dashboard Functions
function loadDashboard() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    document.querySelector('.dashboard-header h2').textContent = `Welcome, ${currentUser.name}`;
    document.querySelector('.dashboard-card:nth-child(1) p').textContent = 
        currentUser.enrolledCourses.length;
    document.querySelector('.dashboard-card:nth-child(2) p').textContent = 
        currentUser.downloadedResources.length;
    document.querySelector('.dashboard-card:nth-child(3) p').textContent = 
        currentUser.bookmarks.length;
    
    // Load recent downloads (last 3)
    const recentDownloads = currentUser.downloadedResources
        .slice(-3)
        .map(id => findResourceById(id))
        .filter(Boolean);
    
    const downloadsContainer = document.querySelector('.dashboard-content > div:last-child');
    downloadsContainer.innerHTML = recentDownloads.map(resource => `
        <div style="display: flex; justify-content: space-between; padding: 15px; 
                    border-bottom: 1px solid #eee; align-items: center;">
            <div>
                <div style="font-weight: 500;">${resource.name}</div>
                <small style="color: var(--text-light);">
                    ${resource.course} • ${resource.semester} • ${resource.format}
                </small>
            </div>
            <a href="#" class="download-btn" data-resource-id="${resource.id}">Download</a>
        </div>
    `).join('');
}

// Contact Form
function handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;
    
    // In a real app, this would send to a server
    alert(`Thank you, ${name}! Your message has been sent. We'll respond to ${email} soon.`);
    contactForm.reset();
}

// Page Loader
function loadPageContent() {
    const path = window.location.pathname.split('/').pop();
    
    switch(path) {
        case 'dashboard.html':
            loadDashboard();
            break;
        case 'resources.html':
            // Could preload some resources
            break;
        case 'login.html':
        case 'register.html':
            if (currentUser) window.location.href = 'dashboard.html';
            break;
        default:
            // Home page - no special loading needed
            break;
    }
}

// Make functions available globally for HTML onclick attributes
window.openCourseModal = openCourseModal;
window.closeModal = closeModal;
window.switchTab = switchTab;