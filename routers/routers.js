const express = require('express');
const router = express.Router();
const axios = require('axios');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/auth")
const User = require("../models/UserModel");


// Fetch events using the ticketmaster api
router.post("/events", async (req, res) => {
    const apiKey = process.env.API_KEY;

    city = req.body.city;
    countryCode = req.body.country;
    // TODO: Filter results, remove duplicates, remove cancelled events etc
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${city}&countryCode=${countryCode}`;

    // Fetch events
    try {
        const response = await axios.get(url);
        const events = response.data._embedded.events;

        res.send(events);
    } catch (e) {
        res.status(404).send("Unable to find events")
    }
})

// Login
router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check user exists
    const userFound = await User.findOne({ username });
    if (userFound === null) return res.status(400).send("Unable to find user with those credentials.");

    // Check password
    const passwordMatch = await bcrypt.compare(password, userFound.password);
    if (!passwordMatch) return res.status(400).send("Unable to find user with those credentials.");

    // Create JWT token
    const token = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

    res.send({ username, token });
})

// Sign Up
router.post("/signup", async (req, res) => {
    const { fullName, username, password, confirmPassword } = req.body;

    // Make sure form was filled
    if (!fullName || !username || !password || !confirmPassword) return res.status(400).send("Please fill the form.");

    // Check passwords match
    if (password !== confirmPassword) return res.status(400).send("Passwords do not match.");

    //TODO password criteria  

    // hash password 
    const hash = await bcrypt.hash(password, 10);

    // Check if username is taken
    const userTaken = await User.findOne({ username, }).exec();
    if (userTaken !== null) return res.status(400).send("Username taken.");

    // create JWT token
    const token = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

    // save user
    const newUser = new User({ fullName, username, password: hash });

    newUser.save(e => {
        if (e) {
            res.status(500).send("Error creating account.");
        }
    })

    res.status(201).send({ username, token });
})

// User profile 
router.get("/:username/profile", authenticateToken, async (req, res) => {
    const { username } = req.params;

    const userFound = await User.findOne({ username: username }).exec();

    if (!userFound) {
        return res.status(400).send();
    }

    res.send(userFound);
})

// Add to favourites
router.post("/:username/profile/favourites", authenticateToken, async (req, res) => {
    const username = req.user.username;
    const event = req.body;

    // respond with 400 if event data is invalid 
    if (!event.name || !event.date || !event.time || !event.image || !event.url) {
        res.status(400).send("Unable to add to favourites");
    }

    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(400).send();

    // Check if event is already in favourites
    if (user.favourites.some(e => e.name === event.name && e.date === event.date && e.time === event.time)) {
        return res.status(400).send("Event already in favourites");
    }

    user.favourites.push(event);

    try {
        await user.save();
    } catch (e) {
        res.status(400).send("You have reached the maximum number of favourites");
    }

    res.send();
})

// Remove from favourites 
router.delete("/:username/profile/favourites", authenticateToken, async (req, res) => {
    const username = req.user.username;
    const event = req.body;

    // respond with 400 if event data is invalid 
    if (!event.name || !event.date || !event.time || !event.image || !event.url) {
        res.status(400).send("Unable to add to favourites");
    }

    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(400).send();

    // remove event
    const filtered = user.favourites.filter(e => e.url !== event.url);

    user.favourites = filtered;
    user.save();

    res.send();
})

module.exports = router;