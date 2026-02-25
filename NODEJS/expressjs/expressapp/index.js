const express = require('express');
const app = express();

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get("/",(req,res) => {
    res.status(200).send("Welcome to Express.js!");
})
//url http://localhost:5000/hello

app.post("/",(req,res) => {
    res.status(200).send("Hello from POST request!");   
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
