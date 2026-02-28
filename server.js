const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes =
 require("./routes/authRoutes");

const capsuleRoutes =
 require("./routes/capsuleRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/capsules",
 capsuleRoutes);

app.listen(5000,()=>{
 console.log(
  "Server running on 5000"
 );
});