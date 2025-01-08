const app = require('./app')
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const MONGO_URI =  process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(()=>console.log("DB Connected"))
.catch(()=>console.log("unable to connect DB!"))

app.listen(PORT,()=>{console.log(`Server Running on Port ${PORT}`)})