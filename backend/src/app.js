const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
    origin:"http://localhost:4000",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const auth = require('./routes/authRoute');

app.use('/auth',auth)

module.exports = app;
