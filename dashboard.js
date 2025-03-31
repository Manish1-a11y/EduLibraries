// Resource download handling
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('download-btn') || 
        e.target.closest('.download-btn')) {
        e.preventDefault();
        const resourceId = e.target.dataset.resourceId || 
                          e.target.closest('[data-resource-id]').dataset.resourceId;
        downloadResource(resourceId);
    }
});

async function downloadResource(resourceId) {
    // Simulate download
    showAlert('Preparing your download...', 'info');
    
    // In a real app, this would fetch the file from your server
    setTimeout(() => {
        showAlert('Download started', 'success');
        // window.location.href = `/download/${resourceId}`;
    }, 1500);
}

// Bookmark functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('bookmark-btn')) {
        e.preventDefault();
        const resourceId = e.target.dataset.resourceId;
        toggleBookmark(resourceId, e.target);
    }
});

function toggleBookmark(resourceId, button) {
    const isBookmarked = button.classList.contains('bookmarked');
    
    if (isBookmarked) {
        button.classList.remove('bookmarked');
        button.innerHTML = '<i class="far fa-bookmark"></i> Bookmark';
        showAlert('Removed from bookmarks', 'info');
    } else {
        button.classList.add('bookmarked');
        button.innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked';
        showAlert('Added to bookmarks', 'success');
    }
    
    // In a real app, you would update this in your database
    // via an API call
}