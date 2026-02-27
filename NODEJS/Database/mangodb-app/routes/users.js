const express = require('express');
const db = require('../db');
const User = require('../models/User');
const router = express.Router();



//user routes
//create a new user
router.post('/',async (req, res) => {
    const user =new User(req.body);
    const saved = await user.save();
    res.status(201).json(saved);
});

//curl url = http://localhost:3000/api/users -X POST -H "Content-Type: application/json" -d '{"name":"John Doe", "email":"john@example.com"}

//get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});
//curl url = http://localhost:3000/api/users

//get a user
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if(user){
        res.json(user);
    } else {
        res.status(404).json({message: "User not found"});
    }   
});

//curl url = http://localhost:3000/api/users/{id}

//udate a user 
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(updatedUser){
            res.json(updatedUser);
        } else {
            res.status(404).json({message: "User not found"});
        }
    } catch (error) {
        res.status(400).json({message: "Invalid user ID"});
    }
});

//curl url = http://localhost:3000/api/users/{id} -X PUT -H "Content-Type: application/json" -d '{"name":"Jane Doe", "email":"


//json example for update - {"name":"Jane Doe", "email":"jane@example.com"}
//delete a user
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if(deletedUser){
            res.json({message: "User deleted successfully"});
        } else {
            res.status(404).json({message: "User not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error deleting user"});
    }
});

//curl url = http://localhost:3000/api/users/{id} -X DELETE

module.exports = router;