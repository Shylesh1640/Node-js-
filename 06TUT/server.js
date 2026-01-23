const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;

// Handle both "/" and "/index.html"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/about',(req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new_page.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));