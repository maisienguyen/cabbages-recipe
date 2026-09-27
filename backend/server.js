const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const router = express.Router();
const mongoose = require("mongoose");


dotenv.config();

// connect mongodb atlas
const connectDB = async () => {
  try {
     mongoose.set('strictQuery', false);
     await mongoose.connect(process.env.MONGODB_URI);
     console.log("MongoDB Connected");
  } catch (error) {
     console.error("Error connecting to MongoDB:", error);
     process.exit(1);
  }
};

connectDB();

const app = express();
app.use(express.json());
app.use(express.json());
app.use(
   cors({
       origin: process.env.ORIGIN,
       methods: ["GET", "PUT", "POST", "DELETE"],
       credentials: true,
   })
);



app.get('/', (req, res) => {
   res.send('Hello World from Express 1!');
});
app.use(router);
app.use("/api/users", require("./routes/userRoutes"));


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

