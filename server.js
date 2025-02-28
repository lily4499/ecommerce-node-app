// server.js
const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the "html" folder
app.use(express.static(path.join(__dirname, 'html')));

// Optionally, add a catch-all route to serve index.html for unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

