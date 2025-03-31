document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.querySelector('.search-box input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchBox && searchResults) {
        searchBox.addEventListener('input', debounce(function(e) {
            performSearch(e.target.value);
        }, 300));
    }
});

async function performSearch(query) {
    if (!query.trim()) {
        // Show popular resources or clear results
        return;
    }
    
    try {
        // Simulate API call
        const results = await simulateSearch(query);
        displaySearchResults(results);
    } catch (error) {
        console.error('Search failed:', error);
    }
}

function displaySearchResults(results) {
    const container = document.querySelector('.search-results');
    if (!container) return;
    
    if (results.length === 0) {
        container.innerHTML = '<p class="no-results">No results found. Try a different search term.</p>';
        return;
    }
    
    container.innerHTML = results.map(result => `
        <div class="search-result-card">
            <div class="search-result-content">
                <h3 class="search-result-title">${result.title}</h3>
                <div class="search-result-meta">
                    <span>${result.category}</span>
                    <span>${result.semester}</span>
                </div>
                <p>${result.description}</p>
                <a href="#" class="btn btn-secondary">View Details</a>
            </div>
        </div>
    `).join('');
}

// Utility function to limit how often search is performed
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Simulated search (replace with real API call)
async function simulateSearch(query) {
    return new Promise(resolve => {
        setTimeout(() => {
            const mockResults = [
                {
                    title: 'Data Structures Notes',
                    category: 'Computer Science',
                    semester: 'Semester 3',
                    description: 'Comprehensive notes covering all major data structures with code examples.'
                },
                // More mock results...
            ];
            
            // Filter mock results based on query
            resolve(mockResults.filter(item => 
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.category.toLowerCase().includes(query.toLowerCase())
            ));
        }, 500);
    });
}