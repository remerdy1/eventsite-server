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
    token: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;