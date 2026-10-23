const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createBooking,
  getMyBookings,
  checkAvailability,
  getOwnerDashboard,
  cancelBooking
} = require("../controllers/bookingController");

const router = express.Router();

// Owner dashboard
router.get(
  "/owner-dashboard",
  protect,
  authorizeRoles("owner"),
  getOwnerDashboard
);

// Check availability
router.post(
  "/availability",
  protect,
  authorizeRoles("customer"),
  checkAvailability
);

// Create booking
router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  createBooking
);

// Customer's bookings
router.get(
  "/my",
  protect,
  authorizeRoles("customer"),
  getMyBookings
);

// Cancel booking
router.patch(
  "/:id/cancel",
  protect,
  authorizeRoles("customer"),
  cancelBooking
);

module.exports = router;