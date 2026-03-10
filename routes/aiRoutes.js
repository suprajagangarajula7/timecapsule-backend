const express = require("express");

const { generateSummary } = require("../controllers/aiController");

const router = express.Router();

router.get("/test", (req,res)=>{
  res.send("AI route working");
});



router.post("/summary", generateSummary);

module.exports = router;