const Request = require("../models/Request");
const Operator = require("../models/Operator");
const Counter = require("../models/Counter");

/* ======================
   TICKET ID
====================== */
const generateTicketId = async () => {
  const year = new Date().getFullYear();

  const counter = await Counter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 }, $setOnInsert: { year } },
    { new: true, upsert: true }
  );

  return `REQ-${year}-${String(counter.seq).padStart(6, "0")}`;
};

/* ======================
   GET ALL REQUESTS
====================== */
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("user", "name phone")
      .populate("assignedOperator", "name ward")
      .populate("notes.user", "name role")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Fetch requests failed" });
  }
};

/* ======================
   UPDATE STATUS (AUTO NOTE)
====================== */
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });

    request.status = status;

    request.notes.push({
  text: `Status updated to ${status}`,
  user: req.user._id, // user reference
});


    if (status === "Completed") {
      request.completedAt = new Date();
    }

    await request.save();

    const populated = await Request.findById(request._id)
  .populate("user", "name phone")
  .populate("assignedOperator", "name ward")
  .populate("notes.user", "name role");


    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
};

/* ======================
   ASSIGN OPERATOR (AUTO NOTE)
====================== */
exports.assignOperator = async (req, res) => {
  try {
    const { operatorId } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });

    const operator = await Operator.findById(operatorId);
    if (!operator)
      return res.status(404).json({ message: "Operator not found" });

    request.assignedOperator = operatorId;
    request.status = "Assigned";

    request.notes.push({
      text: `Assigned to operator ${operator.name}`,
      user: req.user._id,
    });

    await request.save();

    const populated = await Request.findById(request._id)
      .populate("user", "name phone")
      .populate("assignedOperator", "name ward")
      .populate("notes.user", "name role");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Assign operator failed" });
  }
};

/* ======================
   ADD NOTE (MANUAL)
====================== */
exports.addNote = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });

    request.notes.push({
      text: req.body.text,
      user: req.user._id,
    });

    await request.save();

    const populated = await Request.findById(request._id)
      .populate("user", "name phone")
      .populate("assignedOperator", "name ward")
      .populate("notes.user", "name role");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Add note failed" });
  }
};

/* ======================
   OTHER GETS
====================== */
exports.getAssignedRequests = async (req, res) => {
  const requests = await Request.find({
    assignedOperator: req.user._id,
  })
    .populate("user", "name phone")
    .populate("assignedOperator", "name ward")
    .populate("notes.user", "name role");

  res.json(requests);
};

exports.getMyRequests = async (req, res) => {
  const requests = await Request.find({ user: req.user._id })
    .populate("assignedOperator", "name ward");

  res.json(requests);
};

exports.getRequestById = async (req, res) => {
  const request = await Request.findById(req.params.id)
    .populate("user", "name phone")
    .populate("assignedOperator", "name ward")
    .populate("notes.user", "name role");

  res.json(request);
};




exports.createRequest = async (req, res) => {
  try {
    const ticketId = await generateTicketId();

    const request = await Request.create({
      ticketId,
      user: req.user._id,

      // ✅ SAVE THESE
      fullName: req.body.fullName,
      mobile: req.body.mobile,

      ward: req.body.ward,
      wasteType: req.body.wasteType,
      description: req.body.description,
      address: req.body.address,
      timeSlot: req.body.timeSlot,
      latitude: req.body.latitude,
      longitude: req.body.longitude,

      status: "Open",
      notes: [
        {
          text: "Request created",
          user: req.user._id,
        },
      ],
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: "Create request failed" });
  }
};



/* CREATE REQUEST */
exports.createRequest = async (req, res) => {
  try {
    const ticketId = await generateTicketId();

    const photos = req.files
      ? req.files.map((f) => `/uploads/${f.filename}`)
      : [];

    const request = await Request.create({
      ticketId,
      user: req.user._id,
      ...req.body,
      photos,
      status: "Open",
      notes: [{ text: "Request created", user: req.user._id }],
    });

    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create request failed" });
  }
};

exports.getAssignedRequests = async (req, res) => {
  try {
    // 1️⃣ find operator for logged-in user
    const operator = await Operator.findOne({ user: req.user._id });

    if (!operator) {
      return res.json([]); // no operator profile
    }

    // 2️⃣ fetch assigned requests
    const requests = await Request.find({
      assignedOperator: operator._id,
    })
      .populate("user", "name phone")
      .populate("assignedOperator", "name ward")
      .populate("notes.user", "name role")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("Assigned requests error:", err);
    res.status(500).json({ message: "Failed to load assigned requests" });
  }
};





