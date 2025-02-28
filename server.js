const express = require('express');
const path = require('path');
const client = require('prom-client');

const app = express();
const register = new client.Registry();

// Enable default metrics collection (CPU, memory, event loop lag, etc.)
client.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests received',
    labelNames: ['method', 'route']
});

const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Histogram for HTTP request durations in seconds',
    labelNames: ['method', 'route'],
    buckets: [0.1, 0.3, 0.5, 1, 2, 5]
});

// Register metrics
register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);

// Middleware to track requests
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        httpRequestCounter.inc({ method: req.method, route: req.path });
        httpRequestDuration.observe({ method: req.method, route: req.path }, duration);
    });
    next();
});

// Serve static files from the "html" folder
app.use(express.static(path.join(__dirname, 'html')));

// Catch-all route for single-page applications
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// Expose Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`📊 Metrics available at http://localhost:${port}/metrics`);
});




// // server.js
// const express = require('express');
// const path = require('path');

// const app = express();

// // Serve static files from the "html" folder
// app.use(express.static(path.join(__dirname, 'html')));

// // Optionally, add a catch-all route to serve index.html for unmatched routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'html', 'index.html'));
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

