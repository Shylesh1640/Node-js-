const express = require('express');
const db = require('./db');

const app = express();
const User = require('./models/User');
const userRoutes = require('./routes/users');


app.use(express.json());
app.use('/api/users', userRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});