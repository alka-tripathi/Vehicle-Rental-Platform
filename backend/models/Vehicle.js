const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    // Vehicle owner
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Vehicle information
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    images: [
      {
        type: String
      }
    ],

    type: {
      type: String,
      enum: ["Car", "SUV", "Bike", "Van"],
      required: true
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    dailyPrice: {
      type: Number,
      required: true,
      min: 0
    },

    location: {
      type: String,
      required: true
    },

    // Vehicle availability
    isAvailable: {
      type: Boolean,
      default: true
    },

    // Vehicle features
    features: {
      automatic: {
        type: Boolean,
        default: false
      },

      airConditioning: {
        type: Boolean,
        default: false
      },

      gps: {
        type: Boolean,
        default: false
      },

      seats: {
        type: Number,
        default: 5
      },

      bluetooth: {
        type: Boolean,
        default: false
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);