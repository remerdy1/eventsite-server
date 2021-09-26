const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    favourites: {
        type: Array,
        required: true
    },
})

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

/* 
    USER:
        User ID: Number unique
        Username: String, unique
        Password: String, cannot contain "password"
        Favourites: Array, max length of 3 
    
    Event:
        Name: String,
        Date: String
        Time: String
        Ticket URL: String
        Image URL: String
*/