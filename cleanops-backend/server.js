const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const operatorRoutes = require("./routes/operatorRoutes");
const communityRoutes = require("./routes/communityRoutes");

const app = express();

/* ======================
   🔥 CORS (CORRECT)
====================== */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://cleanops-lwt1.onrender.com" // backend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.options("*", cors());

/* ======================
   BODY PARSERS (IMPORTANT)
====================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   STATIC FILES
====================== */
app.use("/uploads", express.static("uploads"));

/* ======================
   ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/operators", operatorRoutes);
app.use("/api/community", communityRoutes);

/* ======================
   SERVER
====================== */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
