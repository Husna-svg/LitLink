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
const express = require("express");
const dotenv=require("dotenv").config();
const app = express();
app.use('/api/books', require('./routes/BookRoutes'));

const port=process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});