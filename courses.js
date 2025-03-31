function openCourseModal(courseId) {
    const courseData = getCourseData(courseId); // You'll need to implement getCourseData()
    const modal = document.getElementById('courseModal');
    const modalContent = document.getElementById('courseModalContent');
    
    if (!modal || !modalContent) return;

    // Generate modal content (similar to your existing code)
    modalContent.innerHTML = generateModalContent(courseData);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('courseModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function switchTab(event, tabId) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Remove active class from all contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to clicked tab and corresponding content
    event.target.classList.add('active');
    const tabContent = document.getElementById(tabId);
    if (tabContent) {
        tabContent.classList.add('active');
    }
}

// Close modal when clicking outside content
window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('courseModal')) {
        closeModal();
    }
});