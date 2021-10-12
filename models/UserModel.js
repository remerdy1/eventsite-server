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

// Returns public information about the user. .toJSON is called whenever an object is converted to JSON (like when res.send is used)
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.token;

    return userObject;
}

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;