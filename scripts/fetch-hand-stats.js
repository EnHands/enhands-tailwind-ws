const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env manually
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.error('Error: NOTION_API_KEY or NOTION_DATABASE_ID not found in environment variables.');
    process.exit(1);
}

const NOTION_VERSION = '2022-06-28';

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

const options = {
    hostname: 'api.notion.com',
    path: `/v1/databases/${NOTION_DATABASE_ID}/query`,
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
                const jsonResponse = JSON.parse(data);
                const processedData = processNotionData(jsonResponse.results);
                
                const outputPath = path.join(__dirname, '..', 'data', 'hand-stats.json');
                fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2));
                console.log(`Successfully fetched and saved hand stats to ${outputPath}`);
            } catch (e) {
                console.error('Error parsing JSON response:', e);
                process.exit(1);
            }
        } else {
            console.error(`Notion API Error: ${res.statusCode} ${res.statusMessage}`);
            console.error(data);
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    process.exit(1);
});

req.write(JSON.stringify({ page_size: 100 }));
req.end();