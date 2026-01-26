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
    "Cosmetic V1.0": {
        image: "images/product/CosmeticV1-0.png",
        description: "First generation cosmetic hand designed for natural appearance and customizable hand poses.",
        link: "mailto:info@enhands.de?subject=%F0%9F%8C%8D%F0%9F%A6%BE%F0%9F%96%90%EF%B8%8F%20Request%20a%20Cosmetic%20Prototype!%20%F0%9F%96%90%EF%B8%8F%F0%9F%A6%BE%F0%9F%8C%8D&body=(Hi%2C%20thank%20you%20for%20your%20interest%20in%20our%20Cosmetic%20Prototypes.%20We%20would%20love%20to%20help%20you%20with%20your%20request.%0A%0APlease%20fill%20out%20the%20details%20below%20so%20we%20can%20better%20understand%20your%20needs.)%0A%0AHi%20EnHands%20Team%2C%0A%0AI%20am%20interested%20in%20requesting%20a%20Cosmetic%20Prototype.%0A%0AHere%20are%20some%20details%20about%20my%20request%3A%0A%0AName%3A%0AProject%20Description%3A%0ADeadline%3A%0AAdditional%20Notes%3A`"
    },
    "Cosmetic V1.1": {
        image: "",
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
    card.className = 'bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden';

    // Image Section
    const imageSection = `
        <div class="overflow-hidden h-64 w-full relative">
            <img class="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500" src="${registryData.image}" alt="${handData.name}">
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>`;

    // Stats Section - Process Flow
    const statsSection = `
        <div class="mt-6 pt-6 border-t border-gray-100">
            <div class="flex items-center justify-between px-2">
                
                <!-- Step 1: Ready -->
                <div class="flex flex-col items-center group/stat">
                    <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2 transition-colors group-hover/stat:bg-blue-100">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    </div>
                    <span class="text-xl font-bold text-gray-900 leading-none">${handData.stats.finished}</span>
                    <span class="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-1">Ready</span>
                </div>

                <!-- Arrow -->
                <div class="text-gray-300 pb-6">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </div>

                <!-- Step 2: Assigned -->
                <div class="flex flex-col items-center group/stat">
                    <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 transition-colors group-hover/stat:bg-indigo-100">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                    <span class="text-xl font-bold text-gray-900 leading-none">${handData.stats.assigned}</span>
                    <span class="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-1">Assigned</span>
                </div>

                <!-- Arrow -->
                <div class="text-gray-300 pb-6">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </div>

                <!-- Step 3: Sent -->
                <div class="flex flex-col items-center group/stat">
                    <div class="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-2 transition-colors group-hover/stat:bg-green-100">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    </div>
                    <span class="text-xl font-bold text-gray-900 leading-none">${handData.stats.sent}</span>
                    <span class="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-1">Sent</span>
                </div>

            </div>
        </div>`;

    // Button Section
    const buttonSection = `
        <a href="${registryData.link}" class="mt-8 block w-full text-center bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Request Prototype
        </a>`;

    card.innerHTML = `
        ${imageSection}
        <div class="p-8 flex-grow flex flex-col">
            <h3 class="text-2xl font-bold text-gray-900 tracking-tight mb-3">${handData.name}</h3>
            <p class="text-gray-600 leading-relaxed flex-grow">
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
    card.className = 'bg-gray-50 rounded-2xl border border-dashed border-gray-300 flex flex-col overflow-hidden group hover:bg-gray-100 transition-colors duration-300';
    card.innerHTML = `
        <div class="w-full h-64 flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300">
            <svg class="h-16 w-16 text-gray-400 group-hover:text-gray-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        </div>
        <div class="p-8 flex-grow flex flex-col text-center justify-center">
            <h3 class="text-xl font-bold text-gray-900 mb-2">More Coming Soon</h3>
            <p class="text-gray-500 leading-relaxed">
                We are constantly developing new and improved prototypes.
            </p>
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

        // Adjust grid columns based on card count
        if (container.children.length <= 2) {
            container.classList.remove('lg:grid-cols-3');
            container.classList.add('lg:grid-cols-2');
        } else {
            container.classList.remove('lg:grid-cols-2');
            container.classList.add('lg:grid-cols-3');
        }

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
