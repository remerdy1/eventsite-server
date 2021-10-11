const express = require('express');
const router = express.Router();
const axios = require('axios');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

    //TODO some JWT bullshit idk yet
    //TODO https://www.youtube.com/watch?v=mbsmsi7l3r4
    /*     const user = { username }
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        res.json({ accessToken }); */
})

//TODO Authenticate tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null) res.status(401).send();

    //AAAAAAAAAAAAAAAAA
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
    });
}

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
    const newUser = new User({ fullName, username, password: hash, token });

    newUser.save(e => {
        if (e) {
            console.log(e);
            res.status(500).send("Error creating account.");
        }
    })

    res.send();
})

module.exports = router;