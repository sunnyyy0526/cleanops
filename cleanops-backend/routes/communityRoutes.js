const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");

const {
  createCommunity,
  getCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  addNote,
} = require("../controllers/communityController");

/* ======================
   PUBLIC
====================== */
router.get("/", getCommunities);
router.get("/:id", optionalAuth, getCommunityById);

/* ======================
   PROTECTED
====================== */
router.post("/", authMiddleware, createCommunity);
router.post("/:id/join", authMiddleware, joinCommunity);
router.post("/:id/leave", authMiddleware, leaveCommunity);
router.post("/:id/notes", authMiddleware, addNote);

module.exports = router;
