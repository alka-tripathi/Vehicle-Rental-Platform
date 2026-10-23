import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/addVehicle.css";

function AddVehicle() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Car",
    registrationNumber: "",
    dailyPrice: "",
    location: "",
    automatic: false,
    airConditioning: false,
    gps: false,
    seats: 5,
    bluetooth: false,
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==============================
  // Handle input changes
  // ==============================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ==============================
  // Handle images
  // ==============================

  const handleImages = async (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 4) {
      toast.error("You can upload up to 4 images.");
      e.target.value = "";
      return;
    }

    if (files.some((file) => !file.type.startsWith("image/") || file.size > 2 * 1024 * 1024)) {
      toast.error("Each image must be an image file smaller than 2 MB.");
      e.target.value = "";
      return;
    }

    try {
      const imageData = await Promise.all(files.map((file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      })));
      setImages(imageData);
    } catch (error) {
      toast.error("Unable to read the selected images.");
    }
  };

  // ==============================
  // Submit form
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const vehicleData = {
        name: formData.name,
        description: formData.description,
        images,
        type: formData.type,
        registrationNumber: formData.registrationNumber,
        dailyPrice: Number(formData.dailyPrice),
        location: formData.location,

        features: {
          automatic: formData.automatic,
          airConditioning: formData.airConditioning,
          gps: formData.gps,
          seats: Number(formData.seats),
          bluetooth: formData.bluetooth,
        },
      };

      const response = await fetch(
        "http://localhost:5000/api/vehicles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(vehicleData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
        }
        toast.error(data.message || "Failed to add vehicle");
        return;
      }

      toast.success("Vehicle added successfully!");

      // Clear form
      setFormData({
        name: "",
        description: "",
        type: "Car",
        registrationNumber: "",
        dailyPrice: "",
        location: "",
        automatic: false,
        airConditioning: false,
        gps: false,
        seats: 5,
        bluetooth: false,
      });

      setImages([]);

      // Go to dashboard
      navigate("/owner-dashboard");

    } catch (error) {
      console.error("Add Vehicle Error:", error);

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-vehicle-page">

      <div className="add-vehicle-container">

        <div className="form-header">
          <h1>Add Vehicle</h1>

          <p>
            Add your vehicle and make it available
            for customers to rent.
          </p>
        </div>

        <form
          className="vehicle-form"
          onSubmit={handleSubmit}
        >

          {/* ================= BASIC DETAILS ================= */}

          <h2>Basic Details</h2>

          <div className="form-group">
            <label>Vehicle Name / Model</label>

            <input
              type="text"
              name="name"
              placeholder="e.g. Honda City"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              placeholder="Describe your vehicle..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Vehicle Type</label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Car">Car</option>
                <option value="SUV">SUV</option>
                <option value="Bike">Bike</option>
                <option value="Van">Van</option>
              </select>
            </div>

            <div className="form-group">
              <label>Registration Number</label>

              <input
                type="text"
                name="registrationNumber"
                placeholder="UP70AB1234"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          {/* ================= PRICE & LOCATION ================= */}

          <h2>Rental Details</h2>

          <div className="form-row">

            <div className="form-group">
              <label>Daily Rental Price (₹)</label>

              <input
                type="number"
                name="dailyPrice"
                placeholder="1500"
                min="0"
                value={formData.dailyPrice}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                placeholder="Prayagraj"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          {/* ================= IMAGES ================= */}

          <h2>Vehicle Images</h2>

          <div className="form-group">

            <label>Upload Images</label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
            />

            <small>
              Upload up to 4 images, 2 MB each.
            </small>

            {images.length > 0 && (
              <div className="image-preview-grid">
                {images.map((image, index) => (
                  <img key={index} src={image} alt={`Vehicle preview ${index + 1}`} />
                ))}
              </div>
            )}

          </div>

          {/* ================= FEATURES ================= */}

          <h2>Vehicle Features</h2>

          <div className="features-grid">

            <label className="feature-checkbox">

              <input
                type="checkbox"
                name="automatic"
                checked={formData.automatic}
                onChange={handleChange}
              />

              Automatic
            </label>

            <label className="feature-checkbox">

              <input
                type="checkbox"
                name="airConditioning"
                checked={formData.airConditioning}
                onChange={handleChange}
              />

              Air Conditioning
            </label>

            <label className="feature-checkbox">

              <input
                type="checkbox"
                name="gps"
                checked={formData.gps}
                onChange={handleChange}
              />

              GPS
            </label>

            <label className="feature-checkbox">

              <input
                type="checkbox"
                name="bluetooth"
                checked={formData.bluetooth}
                onChange={handleChange}
              />

              Bluetooth
            </label>

          </div>

          <div className="form-group seats-input">

            <label>Number of Seats</label>

            <input
              type="number"
              name="seats"
              min="1"
              max="20"
              value={formData.seats}
              onChange={handleChange}
            />

          </div>

          {/* ================= SUBMIT ================= */}

          <button
            type="submit"
            className="submit-vehicle-btn"
            disabled={loading}
          >
            {loading
              ? "Adding Vehicle..."
              : "Add Vehicle"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddVehicle;
