const app = require('./app')
const User = require('./models/userModel')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 3000;

connectDB();
User.createAdminAccount();


app.listen(PORT,()=>{console.log(`Server Running on Port ${PORT}`)})