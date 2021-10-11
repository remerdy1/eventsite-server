const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// Routers
const router = require("./routers/routers")
// Schemas
const eventModel = require("./models/EventModel")
const userModel = require("./models/UserModel")


require('dotenv').config();

const app = express();
app.use(cors());
const port = process.env.PORT || 8050;

// Connect database
mongoose.connect('mongodb://localhost:27017/eventsite', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/", router)
app.listen(port, () => console.log(`App listening on port ${port}`));