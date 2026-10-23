require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();


// ================= MIDDLEWARE =================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json({ limit: "15mb" }));

app.use(cookieParser());


// ================= ROUTES =================

app.use("/api/auth", authRoutes);

app.use("/api/vehicles", vehicleRoutes);

app.use("/api/bookings", bookingRoutes);


// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.send("Backend is running");
});


// ================= DATABASE =================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
