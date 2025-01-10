const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const connectDB = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch(() => console.log("unable to connect DB!"));
};

module.exports = connectDB;
