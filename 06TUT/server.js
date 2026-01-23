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
    res.redirect(301,'/new-page.html');
});

//route handlers
app.get('/hello', (req, res, next) => {
    console.log('attempted to load hello.html');
    next();
}, (req, res) => {
    res.send("Hello world!")
});

//changing route managers
const one = (req, res, next) => {
    console.log('one');
    next();
}
const two = (req, res, next) => {
    console.log('two');
    next();
}   
const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
}

app.get('/chain', [one, two, three]);

// 404 catch-all handler - must be last
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));