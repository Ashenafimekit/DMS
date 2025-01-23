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
const diaspora = require('./routes/diasporaInfoRoute');
const company = require('./routes/companyRoute');

app.use('/auth',auth);
app.use('/diaspora', diaspora)
app.use('/company', company);

module.exports = app;
