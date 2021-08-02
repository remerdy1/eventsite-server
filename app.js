const express = require("express");
const axios = require('axios');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 8050

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.post("/events", async (req, res) => {
    const apiKey = process.env.API_KEY;

    city = req.body.city
    countryCode = req.body.country
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${city}&countryCode=${countryCode}`

    // Fetch events using the ticketmaster api
    try {
        const response = await axios.get(url);
        const events = response.data._embedded.events

        res.send(events)
    }
    // TODO: Handle errors
    catch (e) {
        console.log(e)
    }


})

app.listen(port, () => console.log(`App listening on port ${port}`))