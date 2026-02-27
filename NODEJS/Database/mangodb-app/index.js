const express = require('express');
const db = require('./db');

const app = express();
const User = require('./models/User');
//user routes
//create a new user
app.post('/api/users',(req, res) => {
    const data = req.body;
    console.log(data);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});