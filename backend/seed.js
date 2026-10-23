require("dotenv").config();

const mongoose = require("mongoose");
const Vehicle = require("./models/Vehicle");
const User = require("./models/User");

const vehicles = [
  {
    name: "Honda City",
    description:
      "Comfortable and stylish sedan, perfect for city rides and long trips.",
    images: [
     "https://www.safarcabby.com/lucknow/self-drive-cars-in-lucknow"
    ],
    type: "Car",
    registrationNumber: "UP70AB1234",
    dailyPrice: 2200,
    location: "Prayagraj",
    isAvailable: true,
    features: {
      automatic: true,
      airConditioning: true,
      gps: true,
      seats: 5,
      bluetooth: true
    }
  },

  {
    name: "Hyundai Creta",
    description:
      "Spacious SUV with excellent comfort and modern features for family trips.",
    images: [
      "https://www.olx.in/item/tours-travel-c356-taxi-services-in-bhandewadi-near-pardi-nagpur-iid-1856178064"
    ],
    type: "SUV",
    registrationNumber: "UP70CD5678",
    dailyPrice: 2800,
    location: "Civil Lines, Prayagraj",
    isAvailable: true,
    features: {
      automatic: true,
      airConditioning: true,
      gps: true,
      seats: 5,
      bluetooth: true
    }
  },

  {
    name: "Maruti Swift",
    description:
      "Affordable and fuel-efficient car suitable for daily travel and city rides.",
    images: [
      "https://www.carbooking.org/car-booking-rate-list/"
    ],
    type: "Car",
    registrationNumber: "UP70EF9012",
    dailyPrice: 1600,
    location: "Naini, Prayagraj",
    isAvailable: true,
    features: {
      automatic: false,
      airConditioning: true,
      gps: false,
      seats: 5,
      bluetooth: true
    }
  },

  {
    name: "Royal Enfield Classic 350",
    description:
      "Powerful and comfortable motorcycle, ideal for city rides and weekend trips.",
    images: [
      "https://www.justdial.com/Hindaun/Car-Rental/nct-10076456"
    ],
    type: "Bike",
    registrationNumber: "UP70GH3456",
    dailyPrice: 900,
    location: "Allahabad University, Prayagraj",
    isAvailable: true,
    features: {
      automatic: false,
      airConditioning: false,
      gps: false,
      seats: 2,
      bluetooth: false
    }
  },

  {
    name: "Toyota Innova Crysta",
    description:
      "Premium and spacious vehicle suitable for family trips and group travel.",
    images: [
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c"
    ],
    type: "Van",
    registrationNumber: "UP70IJ7890",
    dailyPrice: 3500,
    location: "Tagore Town, Prayagraj",
    isAvailable: true,
    features: {
      automatic: true,
      airConditioning: true,
      gps: true,
      seats: 7,
      bluetooth: true
    }
  },

  {
    name: "Kia Seltos",
    description:
      "Modern SUV offering a smooth driving experience with advanced features.",
    images: [
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7"
    ],
    type: "SUV",
    registrationNumber: "UP70KL2345",
    dailyPrice: 3000,
    location: "George Town, Prayagraj",
    isAvailable: true,
    features: {
      automatic: true,
      airConditioning: true,
      gps: true,
      seats: 5,
      bluetooth: true
    }
  },

  {
    name: "TVS Apache RTR 160",
    description:
      "Sporty and economical bike for quick city travel and daily commuting.",
    images: [
      "https://images.unsplash.com/photo-1558980664-10ea69e4e5e5"
    ],
    type: "Bike",
    registrationNumber: "UP70MN6789",
    dailyPrice: 700,
    location: "Ashok Nagar, Prayagraj",
    isAvailable: true,
    features: {
      automatic: false,
      airConditioning: false,
      gps: false,
      seats: 2,
      bluetooth: false
    }
  },

  {
    name: "Tata Nexon",
    description:
      "Compact SUV with good space, safety features and comfortable interiors.",
    images: [
      "https://www.justdial.com/Hindaun/Car-Rental/nct-10076456"
    ],
    type: "SUV",
    registrationNumber: "UP70OP1122",
    dailyPrice: 2400,
    location: "Beli Road, Prayagraj",
    isAvailable: true,
    features: {
      automatic: false,
      airConditioning: true,
      gps: true,
      seats: 5,
      bluetooth: true
    }
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Find an owner
    const owner = await User.findOne({
      role: "owner"
    });

    if (!owner) {
      console.log(
        "No owner found. Please register an owner first."
      );

      process.exit(1);
    }

    console.log("Owner found:", owner.name);

    // Remove old vehicle data
    await Vehicle.deleteMany({});

    // Add owner ID to every vehicle
    const vehiclesWithOwner = vehicles.map(
      (vehicle) => ({
        ...vehicle,
        owner: owner._id
      })
    );

    // Insert vehicles
    await Vehicle.insertMany(vehiclesWithOwner);

    console.log(
      `${vehiclesWithOwner.length} vehicles inserted successfully`
    );

    process.exit(0);

  } catch (error) {
    console.error(
      "Seeding failed:",
      error
    );

    process.exit(1);
  }
};

seedDatabase();