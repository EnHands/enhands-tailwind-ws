/**
 * Script to fetch and display supporters from data/supporter.json
 * This replaces the missing js/importSupporter.js
 */

async function loadSupporters() {
    // The container where partners/supporters should be displayed.
    // Based on index.html, there is a "partners-slideshow" section with a "partners-track".
    // However, there might be another place for supporters if this file was named 'importSupporter.js'.
    // Looking at index.html, there is no explicit ID like "supporter-container".
    // But there is `js/partners-slideshow.js` which likely handles the slideshow.
    // This script might have been intended for a different section or to populate the slideshow data.
    
    // Let's check if there is a specific container for this script.
    // If not, we might just log the data for now or try to find a suitable container.
    // Given the file name 'importSupporter.js', it likely imports data.
    
    // NOTE: Since `js/partners-slideshow.js` exists, it probably handles the visual part.
    // This script might be redundant or was intended to fetch data for it.
    // However, to fix the 404 error and potentially restore functionality, 
    // I will implement a basic fetch and check if there's a global variable or container to use.
    
    try {
        const response = await fetch('data/supporter.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const supporters = await response.json();
        
        // If there is a global function or array expected by other scripts, we could set it here.
        // For now, let's just log it to confirm it works.
        console.log('Supporters loaded:', supporters);

        // OPTIONAL: If we find a container that looks like it needs supporters, we can populate it.
        // But without knowing the exact original intent, avoiding DOM manipulation is safer 
        // to prevent conflicts with `partners-slideshow.js`.
        
    } catch (error) {
        console.error('Failed to load supporters:', error);
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSupporters);
} else {
    loadSupporters();
}
