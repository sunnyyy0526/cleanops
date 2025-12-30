const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  createRequest,
  getAllRequests,
  getAssignedRequests,
  updateRequestStatus,
  assignOperator,
  addNote,
  getMyRequests,
  getRequestById,
} = require("../controllers/requestController");

// router.post("/raise", authMiddleware, createRequest);
router.post(
  "/raise",
  authMiddleware,
  upload.array("photos", 5), // 🔥 REQUIRED
  createRequest
);

router.get("/", authMiddleware, getAllRequests);
router.get("/assigned", authMiddleware, getAssignedRequests);
router.get("/my", authMiddleware, getMyRequests);

router.put("/:id/status", authMiddleware, updateRequestStatus);
router.put("/:id/assign", authMiddleware, assignOperator);
router.post("/:id/notes", authMiddleware, addNote);

router.get("/:id", authMiddleware, getRequestById);

module.exports = router;
