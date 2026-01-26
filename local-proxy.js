const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// Load environment variables from .env manually
const envPath = path.join(__dirname, '.env');
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

function fetchNotionStats(clientRes) {
    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
        clientRes.writeHead(500, { 'Content-Type': 'application/json' });
        clientRes.end(JSON.stringify({ error: 'Server configuration error: Missing API keys' }));
        return;
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
                    
                    clientRes.writeHead(200, { 'Content-Type': 'application/json' });
                    clientRes.end(JSON.stringify(processedData));
                } catch (e) {
                    console.error('Error parsing JSON response:', e);
                    clientRes.writeHead(500, { 'Content-Type': 'application/json' });
                    clientRes.end(JSON.stringify({ error: 'Failed to parse Notion response' }));
                }
            } else {
                console.error(`Notion API Error: ${res.statusCode} ${res.statusMessage}`);
                clientRes.writeHead(res.statusCode, { 'Content-Type': 'application/json' });
                clientRes.end(data);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
        clientRes.writeHead(500, { 'Content-Type': 'application/json' });
        clientRes.end(JSON.stringify({ error: e.message }));
    });

    req.write(JSON.stringify({ page_size: 100 }));
    req.end();
}

const server = http.createServer((clientReq, clientRes) => {
    const parsedUrl = url.parse(clientReq.url);

    // CORS headers
    clientRes.setHeader('Access-Control-Allow-Origin', '*');
    clientRes.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    clientRes.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Notion-Version');

    // Handle preflight OPTIONS request
    if (clientReq.method === 'OPTIONS') {
        clientRes.writeHead(204);
        clientRes.end();
        return;
    }

    // Specific route for fetching hand stats securely
    if (parsedUrl.pathname === '/api/hand-stats' && clientReq.method === 'GET') {
        fetchNotionStats(clientRes);
        return;
    }

    // Only forward requests meant for Notion
    // We expect the client to request /v1/...
    const options = {
        hostname: 'api.notion.com',
        port: 443,
        path: parsedUrl.path, // Forward the exact path (e.g., /v1/data_sources/.../query)
        method: clientReq.method,
        headers: {
            ...clientReq.headers,
            host: 'api.notion.com' // Update host header
        }
    };

    const proxyReq = https.request(options, (proxyRes) => {
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(clientRes, {
            end: true
        });
    });

    proxyReq.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
        clientRes.writeHead(500);
        clientRes.end();
    });

    // Pipe client request body to proxy request
    clientReq.pipe(proxyReq, {
            end: true
        });
});

server.listen(PORT, () => {
    console.log(`Local CORS Proxy running at http://localhost:${PORT}`);
    console.log(`- Endpoint: http://localhost:${PORT}/api/hand-stats (Securely fetches stats)`);
    console.log(`- Forwarding other requests to https://api.notion.com`);
});
