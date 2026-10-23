const Vehicle = require("../models/Vehicle");
// const Booking = require("../models/Booking");

// =====================================================
// CREATE VEHICLE
// =====================================================

const createVehicle = async (req, res) => {
  try {
    const {
      name,
      description,
      images,
      type,
      registrationNumber,
      dailyPrice,
      location,
      features
    } = req.body;

    // Check required fields
    if (
      !name ||
      !description ||
      !type ||
      !registrationNumber ||
      dailyPrice === undefined ||
      !location
    ) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    // Check duplicate registration number
    const existingVehicle = await Vehicle.findOne({
      registrationNumber: registrationNumber.toUpperCase()
    });

    if (existingVehicle) {
      return res.status(400).json({
        message: "Vehicle with this registration number already exists"
      });
    }

    // Create vehicle
    const vehicle = await Vehicle.create({
      owner: req.user.userId,
      name,
      description,
      images: images || [],
      type,
      registrationNumber: registrationNumber.toUpperCase(),
      dailyPrice,
      location,
      features: features || {}
    });

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle
    });

  } catch (error) {
    console.error("Create Vehicle Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================================
// GET MY VEHICLES
// =====================================================


// =====================================================
// GET ALL AVAILABLE VEHICLES
// =====================================================

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      isAvailable: true
    })
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: vehicles.length,
      vehicles
    });

  } catch (error) {
    console.error("Get All Vehicles Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};
const getMyVehicles = async (req, res) => {
  try {

    const vehicles = await Vehicle.find({
      owner: req.user.userId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: vehicles.length,
      vehicles
    });

  } catch (error) {
    console.error("Get My Vehicles Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================================
// GET VEHICLE BY ID
// =====================================================

const getVehicleById = async (req, res) => {
  try {

    const vehicle = await Vehicle.findById(req.params.id)
      .populate("owner", "name email phone");

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    res.status(200).json({
      vehicle
    });

  } catch (error) {
    console.error("Get Vehicle Error:", error);

    // Invalid MongoDB ID
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid vehicle ID"
      });
    }

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================================
// UPDATE VEHICLE
// =====================================================

const updateVehicle = async (req, res) => {
  try {

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    // Check ownership
    if (vehicle.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only update your own vehicle"
      });
    }

    const {
      name,
      description,
      images,
      type,
      registrationNumber,
      dailyPrice,
      location,
      features
    } = req.body;

    // Update only provided fields
    if (name !== undefined) {
      vehicle.name = name;
    }

    if (description !== undefined) {
      vehicle.description = description;
    }

    if (images !== undefined) {
      vehicle.images = images;
    }

    if (type !== undefined) {
      vehicle.type = type;
    }

    if (registrationNumber !== undefined) {

      const newRegistrationNumber =
        registrationNumber.toUpperCase();

      // Check if another vehicle already uses it
      const existingVehicle = await Vehicle.findOne({
        registrationNumber: newRegistrationNumber,
        _id: { $ne: vehicle._id }
      });

      if (existingVehicle) {
        return res.status(400).json({
          message: "Another vehicle already uses this registration number"
        });
      }

      vehicle.registrationNumber = newRegistrationNumber;
    }

    if (dailyPrice !== undefined) {
      vehicle.dailyPrice = dailyPrice;
    }

    if (location !== undefined) {
      vehicle.location = location;
    }

    if (features !== undefined) {
      vehicle.features = features;
    }

    await vehicle.save();

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle
    });

  } catch (error) {
    console.error("Update Vehicle Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid vehicle ID"
      });
    }

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================================
// UPDATE VEHICLE AVAILABILITY
// =====================================================

const updateAvailability = async (req, res) => {
  try {

    const { isAvailable } = req.body;

    // Validate availability
    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        message: "isAvailable must be true or false"
      });
    }

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    // Check ownership
    if (vehicle.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only change availability of your own vehicle"
      });
    }

    vehicle.isAvailable = isAvailable;

    await vehicle.save();

    res.status(200).json({
      message: isAvailable
        ? "Vehicle marked as available"
        : "Vehicle marked as unavailable",
      vehicle
    });

  } catch (error) {
    console.error("Update Availability Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid vehicle ID"
      });
    }

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================================
// DELETE VEHICLE
// =====================================================

// const deleteVehicle = async (req, res) => {
//   try {

//     const vehicle = await Vehicle.findById(req.params.id);

//     if (!vehicle) {
//       return res.status(404).json({
//         message: "Vehicle not found"
//       });
//     }

//     // Check ownership
//     if (vehicle.owner.toString() !== req.user.userId) {
//       return res.status(403).json({
//         message: "You can only delete your own vehicle"
//       });
//     }

//     // Check active bookings
//     const activeBooking = await Booking.findOne({
//       vehicle: vehicle._id,
//       status: {
//         $in: ["pending", "confirmed"]
//       }
//     });

//     if (activeBooking) {
//       return res.status(400).json({
//         message: "Vehicle cannot be deleted because it has active bookings"
//       });
//     }

//     await Vehicle.findByIdAndDelete(vehicle._id);

//     res.status(200).json({
//       message: "Vehicle deleted successfully"
//     });

//   } catch (error) {
//     console.error("Delete Vehicle Error:", error);

//     if (error.name === "CastError") {
//       return res.status(400).json({
//         message: "Invalid vehicle ID"
//       });
//     }

//     res.status(500).json({
//       message: "Server error"
//     });
//   }
// };
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    if (vehicle.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only delete your own vehicle"
      });
    }

    await Vehicle.findByIdAndDelete(vehicle._id);

    res.status(200).json({
      message: "Vehicle deleted successfully"
    });

  } catch (error) {
    console.error("Delete Vehicle Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
  createVehicle,
  getMyVehicles,
  getVehicleById,
   getAllVehicles,
  updateVehicle,
  updateAvailability,
  deleteVehicle
};
