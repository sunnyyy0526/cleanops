const Community = require("../models/Community");

/* ======================
   CREATE COMMUNITY
====================== */
exports.createCommunity = async (req, res) => {
  try {
    const project = await Community.create({
      title: req.body.title,
      description: req.body.description,
      ward: req.body.ward,
      address: req.body.address,
      targetDate: req.body.targetDate,
      creator: req.user._id,   // ✅ single field name
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   GET ALL COMMUNITIES
====================== */
exports.getCommunities = async (req, res) => {
  try {
    const projects = await Community.find()
      .populate("creator", "name")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   GET COMMUNITY BY ID
====================== */
exports.getCommunityById = async (req, res) => {
  try {
    const project = await Community.findById(req.params.id)
      .populate("creator", "name")
      .populate("notes.user", "name");

    if (!project) {
      return res.status(404).json({ message: "Community not found" });
    }

    const isJoined = req.user
      ? project.participants.some(
          (p) => p.toString() === req.user._id.toString()
        )
      : false;

    res.json({
      ...project.toObject(),
      isJoined,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   JOIN COMMUNITY
====================== */
exports.joinCommunity = async (req, res) => {
  try {
    const project = await Community.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (!project.participants.includes(req.user._id)) {
      project.participants.push(req.user._id);
      await project.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   LEAVE COMMUNITY
====================== */
exports.leaveCommunity = async (req, res) => {
  try {
    await Community.findByIdAndUpdate(req.params.id, {
      $pull: { participants: req.user._id },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* ======================
   ADD NOTE (FIXED)
====================== */
exports.addNote = async (req, res) => {
  try {
    const project = await Community.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Community not found" });
    }

    project.notes.push({
      text: req.body.text,
      user: req.user._id,
    });

    await project.save();

    const populated = await Community.findById(req.params.id)
      .populate("creator", "name")
      .populate("notes.user", "name");

    res.json(populated);
  } catch (err) {
    console.error("Add note error:", err);
    res.status(500).json({ message: "Failed to add note" });
  }
};