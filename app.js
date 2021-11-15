const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// Routers
const router = require("./routers/routers")


require('dotenv').config();

const app = express();
app.use(cors());
const port = process.env.PORT || 8050;

// Connect database
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/", router)
app.listen(port, () => console.log(`App listening on port ${port}`));