/**
 * Script to fetch and display hand statistics.
 * 
 * Architecture:
 * - `handRegistry`: Static configuration mapping hand names (Product Models) to their static assets.
 * - `fetchHandStats`: Fetches data from local JSON file (generated at build time).
 * - `processNotionData`: Calculates statistics based on the raw Notion data.
 * - `updateHandCards`: Merges static config with dynamic data to render the UI.
 */

// Configuration
const CONFIG = {
    // Primary: Local Proxy (for fresh data on every refresh)
    proxyUrl: 'http://localhost:8080/api/hand-stats',
    // Fallback: Static JSON (generated at build time)
    staticUrl: 'data/hand-stats.json'
};

const handRegistry = {
    "V2 Functional Prototype": {
        image: "model-resources/FunctionalHand_V2.webp",
        description: "Our most sophisticated development to date, featuring three grasping types and a realistic silicone glove.",
        link: "#P3"
    },
    "Cosmetic Hand": {
        image: "model-resources/poster_P2.webp",
        description: "Designed for a natural appearance and comfort, with a soft silicone outer layer and a simple gripping mechanism.",
        link: "#P2"
    },
    // Mappings for new Database Schema names
    "Cosmetic V1.0": {
        image: "model-resources/poster_P2.webp",
        description: "First generation cosmetic hand designed for natural appearance and basic comfort.",
        link: "#P2"
    },
    "Cosmetic V1.1": {
        image: "model-resources/poster_P2.webp",
        description: "Improved cosmetic hand with enhanced durability and a refined silicone outer layer.",
        link: "#P2"
    },
    "Functional V1.0": {
        image: "model-resources/poster_P1.webp",
        description: "A functional prosthetic hand capable of the 'pinch grasp' and 'power grasp', enabling users to perform everyday tasks.",
        link: "#P1"
    },
    "Functional V1.1": {
        image: "model-resources/FunctionalHand_V2.webp",
        description: "Advanced functional prototype featuring three grasping types and a realistic silicone glove.",
        link: "#P3"
    }
};

/**
 * Calculates statistics from raw Notion database results.
 * Kept here for reference or client-side fallback if needed, 
 * though main processing happens in build script.
 */
function processNotionData(results) {
    const statsMap = {};

    results.forEach(page => {
        const props = page.properties;
        if (!props) return;

        // Extract Product Model
        const modelSelect = props["Product Model"]?.select;
        const modelName = modelSelect ? modelSelect.name : "Unknown Model";
        
        if (!statsMap[modelName]) {
            statsMap[modelName] = { finished: 0, assigned: 0, sent: 0 };
        }

        const stats = statsMap[modelName];

        // Extract Statuses
        const buildStatus = props["Build Status"]?.status?.name;
        const qcStatus = props["Quality Check Status"]?.status?.name;
        const assigned = props["Assigned To Patient"]?.checkbox;
        
        const deliveredLoc = props["Delivered Location"]?.place; 
        const isDelivered = !!deliveredLoc && (Object.keys(deliveredLoc).length > 0 || typeof deliveredLoc === 'string');

        // Calculation Logic
        if (isDelivered) {
            stats.sent++;
        } else if (assigned) {
            stats.assigned++;
        } else if (buildStatus === "In Stock" && qcStatus === "Passed") {
            stats.finished++;   
        }
    });

    return Object.keys(statsMap).map(name => ({
        name: name,
        stats: statsMap[name]
    }));
}

/**
 * Fetches data from local proxy or falls back to local JSON file.
 */
async function fetchHandStats() {
    // 1. Try fetching from Local Proxy (fresh data)
    try {
        const response = await fetch(CONFIG.proxyUrl);
        if (response.ok) {
            const data = await response.json();
            console.log("Loaded fresh hand stats from local proxy.");
            return data;
        }
    } catch (error) {
        console.log("Local proxy not reachable. Falling back to static data.");
    }

    // 2. Fallback to Static JSON
    try {
        const response = await fetch(CONFIG.staticUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.warn("Failed to fetch local hand stats, falling back to mock data:", error);
        return getMockData();
    }
}

/**
 * Returns mock data for testing/fallback.
 */
function getMockData() {
    const mockNotionResponse = [
        // Cosmetic V1.0 Data
        { properties: { "Product Model": { select: { name: "Cosmetic V1.0" } }, "Build Status": { status: { name: "In Stock" } }, "Quality Check Status": { status: { name: "Passed" } }, "Assigned To Patient": { checkbox: false }, "Delivered Location": { place: null } } },
        { properties: { "Product Model": { select: { name: "Cosmetic V1.0" } }, "Build Status": { status: { name: "In Stock" } }, "Quality Check Status": { status: { name: "Passed" } }, "Assigned To Patient": { checkbox: false }, "Delivered Location": { place: null } } },
        { properties: { "Product Model": { select: { name: "Cosmetic V1.0" } }, "Build Status": { status: { name: "In Production" } }, "Quality Check Status": { status: { name: "Pending" } }, "Assigned To Patient": { checkbox: true }, "Delivered Location": { place: null } } }, // Assigned
        
        // Cosmetic V1.1 Data
        { properties: { "Product Model": { select: { name: "Cosmetic V1.1" } }, "Build Status": { status: { name: "In Stock" } }, "Quality Check Status": { status: { name: "Passed" } }, "Assigned To Patient": { checkbox: false }, "Delivered Location": { place: null } } },
        { properties: { "Product Model": { select: { name: "Cosmetic V1.1" } }, "Build Status": { status: { name: "In Stock" } }, "Quality Check Status": { status: { name: "Passed" } }, "Assigned To Patient": { checkbox: true }, "Delivered Location": { place: { name: "Hospital A" } } } }, // Sent
        { properties: { "Product Model": { select: { name: "Cosmetic V1.1" } }, "Build Status": { status: { name: "In Stock" } }, "Quality Check Status": { status: { name: "Passed" } }, "Assigned To Patient": { checkbox: true }, "Delivered Location": { place: { name: "Clinic B" } } } }, // Sent

        // Functional V1.0 Data
        { properties: { "Product Model": { select: { name: "Functional V1.0" } }, "Build Status": { status: { name: "In Stock" } }, "Quality Check Status": { status: { name: "Passed" } }, "Assigned To Patient": { checkbox: false }, "Delivered Location": { place: null } } },
        
        // Functional V1.1 Data
        { properties: { "Product Model": { select: { name: "Functional V1.1" } }, "Build Status": { status: { name: "In Stock" } }, "Quality Check Status": { status: { name: "Passed" } }, "Assigned To Patient": { checkbox: false }, "Delivered Location": { place: null } } },
        { properties: { "Product Model": { select: { name: "Functional V1.1" } }, "Build Status": { status: { name: "In Stock" } }, "Quality Check Status": { status: { name: "Passed" } }, "Assigned To Patient": { checkbox: true }, "Delivered Location": { place: null } } }, // Assigned
        { properties: { "Product Model": { select: { name: "Functional V1.1" } }, "Build Status": { status: { name: "In Stock" } }, "Quality Check Status": { status: { name: "Passed" } }, "Assigned To Patient": { checkbox: true }, "Delivered Location": { place: { name: "Patient Home" } } } } // Sent
    ];

    return processNotionData(mockNotionResponse);
}

function createHandCard(handData) {
    const registryData = handRegistry[handData.name];
    
    // Fallback if name not found in registry
    if (!registryData) {
        console.warn(`Hand "${handData.name}" not found in registry.`);
        return null;
    }

    const card = document.createElement('div');
    card.className = 'bg-gray-50 rounded-lg shadow-lg overflow-hidden flex flex-col';

    // Image Section
    const imageSection = `<img class="w-full h-56 object-cover object-center" src="${registryData.image}" alt="${handData.name}">`;

    // Stats Section
    const statsSection = `
        <div class="mt-6 grid grid-cols-3 gap-2 text-center text-sm">
            <div class="bg-green-100 p-2 rounded flex flex-col justify-center">
                <span class="block font-bold text-green-800 text-lg">${handData.stats.finished}</span>
                <span class="text-xs text-green-600 font-medium uppercase tracking-wide">Ready</span>
            </div>
            <div class="bg-yellow-100 p-2 rounded flex flex-col justify-center">
                <span class="block font-bold text-yellow-800 text-lg">${handData.stats.assigned}</span>
                <span class="text-xs text-yellow-600 font-medium uppercase tracking-wide">Assigned</span>
            </div>
            <div class="bg-blue-100 p-2 rounded flex flex-col justify-center">
                <span class="block font-bold text-blue-800 text-lg">${handData.stats.sent}</span>
                <span class="text-xs text-blue-600 font-medium uppercase tracking-wide">Sent</span>
            </div>
        </div>`;

    // Button Section
    const buttonSection = `<a href="${registryData.link}" class="mt-6 block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out">Request This Hand</a>`;

    card.innerHTML = `
        ${imageSection}
        <div class="p-6 flex-grow flex flex-col">
            <h3 class="text-lg font-medium text-gray-900 tracking-tight">${handData.name}</h3>
            <p class="mt-4 text-base text-gray-500 flex-grow">
                ${registryData.description}
            </p>
            ${statsSection}
            ${buttonSection}
        </div>
    `;

    return card;
}

function createPlaceholderCard() {
    const card = document.createElement('div');
    card.className = 'bg-gray-50 rounded-lg shadow-lg overflow-hidden flex flex-col';
    card.innerHTML = `
        <div class="w-full h-56 bg-gray-200 flex items-center justify-center">
            <svg class="h-20 w-20 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        </div>
        <div class="p-6 flex-grow flex flex-col">
            <h3 class="text-lg font-medium text-gray-900 tracking-tight">More Coming Soon</h3>
            <p class="mt-4 text-base text-gray-500 flex-grow">
                We are constantly developing new and improved prototypes. Check back later for more options.
            </p>
            <a href="#" class="mt-6 inline-block bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed w-full text-center">Unavailable</a>
        </div>
    `;
    return card;
}

async function updateHandCards() {
    if (typeof document === 'undefined') return; // Guard for Node.js environment

    const container = document.getElementById('available-hands-container');
    if (!container) return;

    try {
        const hands = await fetchHandStats();
        
        // Clear existing content
        container.innerHTML = '';

        // Render available hands from API
        hands.forEach(handData => {
            const card = createHandCard(handData);
            if (card) {
                container.appendChild(card);
            }
        });

        // Append static placeholder
        container.appendChild(createPlaceholderCard());

    } catch (error) {
        console.error("Failed to fetch hand statistics:", error);
        container.innerHTML = '<p class="text-center text-red-500 col-span-full">Failed to load available hands.</p>';
    }
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateHandCards);
    } else {
        updateHandCards();
    }
}

// Export for testing if needed
if (typeof module !== 'undefined') {
    module.exports = { fetchHandStats, updateHandCards, processNotionData };
}
