const express = require("express");
const router = express.Router();

const {
  createEntry,
  getEntries,
  getSingleEntry,
  deleteEntry
} = require("../controllers/journalController");

const authMiddleware = require("../middleware/authMiddleware");

// CREATE ENTRY
router.post("/", authMiddleware, createEntry);

// GET ALL
router.get("/", authMiddleware, getEntries);

// GET ONE
router.get("/:id", authMiddleware, getSingleEntry);

// DELETE
router.delete("/:id", authMiddleware, deleteEntry);

module.exports = router;