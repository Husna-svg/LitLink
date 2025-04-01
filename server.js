/*const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/book-exchange";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Compass"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));
*/
const cors=require('cors');
const express = require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv").config();
const connectDB = require("./config/dbConnection");
connectDB();
const errorHandler = require('./middleware/errorHandler');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/books', require('./routes/BookRoutes'));
app.use('/api/users', require('./routes/UserRoutes'));
app.use('/api/chat', require('./routes/ChatRoutes'));

//const chatRoutes=require('./Router/chatRoutes')
//const messageRoutes=require('./Router/messageRoute')


const cookieParser=require('cookie-parser')


app.use(errorHandler);
const port=process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});