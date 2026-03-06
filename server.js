const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const capsuleRoutes = require("./routes/capsuleRoutes");
const journalRoutes = require("./routes/journalRoutes");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

app.use(cors());
app.use(express.json());

/* ---------------- ROUTES ---------------- */

app.use("/api/auth", authRoutes);

app.use("/api/capsules", capsuleRoutes);

app.use("/api/journal", journalRoutes);

/* ---------------- TEST ROUTE ---------------- */

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});