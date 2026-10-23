const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createVehicle,
  getAllVehicles,
  getMyVehicles,
  getVehicleById,
  updateVehicle,
  updateAvailability,
  deleteVehicle
} = require("../controllers/vehicleController");

const router = express.Router();

// ================= CUSTOMER ROUTES =================

// Get all available vehicles
router.get(
  "/",
  getAllVehicles
);


// ================= OWNER ROUTES =================

// Add vehicle
router.post(
  "/",
  protect,
  authorizeRoles("owner"),
  createVehicle
);

// View my vehicles
router.get(
  "/my",
  protect,
  authorizeRoles("owner"),
  getMyVehicles
);


// ================= COMMON ROUTE =================

// View single vehicle
router.get(
  "/:id",
  getVehicleById
);


// ================= OWNER ROUTES =================

// Edit vehicle
router.put(
  "/:id",
  protect,
  authorizeRoles("owner"),
  updateVehicle
);

// Change availability
router.patch(
  "/:id/availability",
  protect,
  authorizeRoles("owner"),
  updateAvailability
);

// Delete vehicle
router.delete(
  "/:id",
  protect,
  authorizeRoles("owner"),
  deleteVehicle
);

module.exports = router;
