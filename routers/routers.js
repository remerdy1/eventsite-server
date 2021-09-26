const express = require('express');
const router = express.Router();
const axios = require('axios');
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
    //TODO Log user in
})

// Sign Up
router.post("/signup", async (req, res) => {
    console.log(req.body);
    //TODO check passwords match
    //TODO check user already exists
    //TODO generate user id 
    //todo? respond????

    // WORKING
    // save user
    const { fullName, username, password, confirmPassword } = req.body;
    const newUser = new User({ fullName, username, password, confirmPassword, user_id: 1 }); //TODO generate user_id
    newUser.save(e => {
        if (e) console.log(e); //TODO should probably return an error or something idk
    })

    //todo? (on client side)
    //todo? if response is 200 then redirect to /login
    //todo? else stay on sign up
})

module.exports = router;