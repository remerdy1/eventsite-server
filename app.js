const express = require("express");
const axios = require('axios');
const cors = require("cors");

require('dotenv').config();

const app = express();
app.use(cors());
const port = process.env.PORT || 8050;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/events", async (req, res) => {
    const apiKey = process.env.API_KEY;

    city = req.body.city;
    countryCode = req.body.country;
    // TODO: Filter results, remove duplicates, remove cancelled events etc
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${city}&countryCode=${countryCode}`;

    // Fetch events using the ticketmaster api
    try {
        const response = await axios.get(url);
        const events = response.data._embedded.events;

        res.send(events);
    } catch (e) {
        res.status(404).send("Unable to find events")
    }


})

app.listen(port, () => console.log(`App listening on port ${port}`));