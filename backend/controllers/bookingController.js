const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");

// Create booking
// const createBooking = async (req, res) => {
//   try {
//     const { vehicleId, startDate, endDate } = req.body;

//     // 1. Validate fields
//     if (!vehicleId || !startDate || !endDate) {
//       return res.status(400).json({
//         message: "Vehicle, start date and end date are required"
//       });
//     }

//     // 2. Convert dates
//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     // 3. Validate dates
//     if (isNaN(start) || isNaN(end)) {
//       return res.status(400).json({
//         message: "Invalid date"
//       });
//     }

//     if (end <= start) {
//       return res.status(400).json({
//         message: "End date must be after start date"
//       });
//     }

//     // 4. Find vehicle
//     const vehicle = await Vehicle.findById(vehicleId);

//     if (!vehicle) {
//       return res.status(404).json({
//         message: "Vehicle not found"
//       });
//     }

//     // 5. Check vehicle availability
//     if (!vehicle.isAvailable) {
//       return res.status(400).json({
//         message: "Vehicle is currently unavailable"
//       });
//     }

//     // 6. Check overlapping booking
//     const overlappingBooking = await Booking.findOne({
//       vehicle: vehicleId,
//       status: {
//         $in: ["pending", "confirmed"]
//       },
//       startDate: {
//         $lte: end
//       },
//       endDate: {
//         $gte: start
//       }
//     });

//     if (overlappingBooking) {
//       return res.status(400).json({
//         message: "Vehicle is already booked for these dates"
//       });
//     }

//     // 7. Calculate rental days
//     const millisecondsPerDay =
//       1000 * 60 * 60 * 24;

//     const totalDays = Math.ceil(
//       (end - start) / millisecondsPerDay
//     );

//     // 8. Calculate total cost
//     const totalCost =
//       totalDays * vehicle.dailyPrice;

//     // 9. Create booking
//     const booking = await Booking.create({
//       customer: req.user.userId,
//       vehicle: vehicleId,
//       startDate: start,
//       endDate: end,
//       totalDays,
//       dailyPrice: vehicle.dailyPrice,
//       totalCost,
//       status: "confirmed"
//     });

//     vehicle.isAvailable = false;
//     await vehicle.save();

//     res.status(201).json({
//       message: "Vehicle booked successfully",
//       booking
//     });

//   } catch (error) {
//     console.error("Create Booking Error:", error);

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


const createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({
        message: "Vehicle and dates are required"
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        message: "Invalid dates"
      });
    }

    if (start >= end) {
      return res.status(400).json({
        message: "End date must be after start date"
      });
    }

    // Find vehicle
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    // Vehicle can be generally available
    if (!vehicle.isAvailable) {
      return res.status(400).json({
        message: "Vehicle is currently unavailable"
      });
    }

    // Check date overlap
    const overlappingBooking = await Booking.findOne({
      vehicle: vehicleId,
      status: {
        $in: ["confirmed"]
      },
      startDate: {
        $lte: end
      },
      endDate: {
        $gte: start
      }
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: "Vehicle is already booked for these dates"
      });
    }

    // Calculate rental days
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const totalDays = Math.ceil(
      (end - start) / millisecondsPerDay
    );

    const totalCost = totalDays * vehicle.dailyPrice;

    // Create booking
    const booking = await Booking.create({
      customer: req.user.userId,
      vehicle: vehicleId,
      startDate: start,
      endDate: end,
      totalDays,
      dailyPrice: vehicle.dailyPrice,
      totalCost,
      status: "confirmed"
    });

    res.status(201).json({
      message: "Vehicle booked successfully",
      booking
    });

  } catch (error) {
    console.error("Create Booking Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

//cancel booking ka controller hai
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Find booking belonging to the logged-in customer
    const booking = await Booking.findOne({
      _id: id,
      customer: req.user.userId
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    // Already cancelled?
    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled"
      });
    }

    // Change status instead of deleting
    booking.status = "cancelled";    //save krlo db mai

    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking
    });

  } catch (error) {
    console.error("Cancel Booking Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

// Get booking and earnings totals for the current owner
const getOwnerDashboard = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.userId })
      .sort({ createdAt: -1 });
    const vehicleIds = vehicles.map((vehicle) => vehicle._id);
    const activeBookings = await Booking.find({
      vehicle: { $in: vehicleIds },
      status: { $in: ["pending", "confirmed"] }
    })
      .sort({ createdAt: -1 })
      .populate("customer", "name phone")
      .populate("vehicle", "name");

    const totalEarnings = activeBookings.reduce(
      (total, booking) => total + booking.totalCost,
      0
    );
    const activeVehicleIds = new Set(
      activeBookings
        .filter((booking) => booking.vehicle)
        .map((booking) => booking.vehicle._id.toString())
    );
    const dashboardVehicles = vehicles.map((vehicle) => ({
      ...vehicle.toObject(),
      isAvailable: vehicle.isAvailable && !activeVehicleIds.has(vehicle._id.toString())
    }));
    const rentersByVehicle = activeBookings.reduce((renters, booking) => {
      if (!booking.vehicle) {
        return renters;
      }

      const vehicleId = booking.vehicle._id.toString();
      const customer = booking.customer;

      if (customer) {
        renters[vehicleId] = [
          ...(renters[vehicleId] || []),
          {
            id: booking._id.toString(),
            name: customer.name,
            phone: customer.phone,
            startDate: booking.startDate,
            endDate: booking.endDate
          }
        ];
      }

      return renters;
    }, {});

    res.status(200).json({
      vehicles: dashboardVehicles,
      rentersByVehicle,
      recentBookings: activeBookings.slice(0, 5),
      stats: {
        totalVehicles: vehicles.length,
        availableVehicles: dashboardVehicles.filter((vehicle) => vehicle.isAvailable).length,
        activeBookings: activeBookings.length,
        totalEarnings
      }
    });
  } catch (error) {
    console.error("Get Owner Dashboard Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get customer's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user.userId,
      status: "confirmed"
    })
      .populate(
        "vehicle",
        "name type location dailyPrice images"
      )
      .sort({ createdAt: -1 });  //descending order of creation date

    res.status(200).json({
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error("Get My Bookings Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

// Check vehicle availability
const checkAvailability = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({
        message: "Vehicle and dates are required"
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return res.status(400).json({
        message: "End date must be after start date"
      });
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    if (!vehicle.isAvailable) {
      return res.status(400).json({
        available: false,
        message: "Vehicle is currently unavailable"
      });
    }

    const overlappingBooking = await Booking.findOne({
      vehicle: vehicleId,
      status: {
        $in: [ "confirmed"]
      },
      startDate: {
        $lte: end
      },
      endDate: {
        $gte: start
      }
    });

    if (overlappingBooking) {
      return res.status(400).json({
        available: false,
        message: "Vehicle is already booked for these dates"
      });
    }

    res.status(200).json({
      available: true,
      message: "Vehicle is available"
    });

  } catch (error) {
    console.error(
      "Check Availability Error:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  createBooking,
  getMyBookings,
  checkAvailability,
  getOwnerDashboard,
  cancelBooking
};
