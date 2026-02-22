const express = require('express');
const app = express();

app.get("/",(req,res) => {
    res.status(200).send("Welcome to Express.js!");
})

app.post("/submit",(req,res) => {
    res.status(200).send("Form submitted successfully!");   
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
