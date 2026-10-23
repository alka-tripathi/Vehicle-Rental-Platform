import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/vehicleDetails.css";

function VehicleDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [totalDays, setTotalDays] = useState(0);
  const [totalCost, setTotalCost] = useState(0);


  // =====================================================
  // FETCH VEHICLE
  // =====================================================

  useEffect(() => {
    fetchVehicle();
  }, [id]);


  const rentVehicle = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/bookings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          vehicleId: vehicle._id,
          startDate,
          endDate
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Vehicle rented successfully!");

    navigate("/my-bookings");

  } catch (error) {
    console.error("Rent Vehicle Error:", error);
    toast.error("Unable to complete booking");
  }
};

  const handleCheckAvailability = async () => {
  if (!startDate || !endDate) {
    toast.error("Please select both dates");
    return;
  }

  if (invalidDates) {
    toast.error("Please select valid dates");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/bookings/availability",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          vehicleId: vehicle._id,
          startDate,
          endDate
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Vehicle is available!");

    const confirmBooking = window.confirm(
      `Vehicle is available.\n\n` +
      `Rental Days: ${totalDays}\n` +
      `Total Cost: ₹${totalCost}\n\n` +
      `Do you want to rent this vehicle?`
    );

    if (!confirmBooking) {
      return;
    }

    await rentVehicle();

  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};
  const fetchVehicle = async () => {

    try {

      const response = await fetch(
        `http://localhost:5000/api/vehicles/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Vehicle not found");
        navigate("/home");
        return;
      }

      setVehicle(data.vehicle);
      setSelectedImage(data.vehicle.images?.[0] || "");

    } catch (error) {

      console.error(
        "Fetch Vehicle Error:",
        error
      );

      toast.error(
        "Unable to load vehicle details"
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // CALCULATE RENTAL COST
  // =====================================================

  useEffect(() => {

    if (!startDate || !endDate || !vehicle) {
      setTotalDays(0);
      setTotalCost(0);
      return;
    }


    const start = new Date(startDate);
    const end = new Date(endDate);


    // End date must be after start date
    if (end <= start) {
      setTotalDays(0);
      setTotalCost(0);
      return;
    }


    const difference =
      end.getTime() - start.getTime();


    const days = Math.ceil(
      difference /
      (1000 * 60 * 60 * 24)
    );


    setTotalDays(days);

    setTotalCost(
      days * vehicle.dailyPrice
    );

  }, [startDate, endDate, vehicle]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="details-loading">
        Loading vehicle details...
      </div>
    );

  }


  // =====================================================
  // VEHICLE NOT FOUND
  // =====================================================

  if (!vehicle) {

    return (
      <div className="details-error">
        <h2>Vehicle not found</h2>

        <button
          onClick={() => navigate("/home")}
        >
          Back to Home
        </button>
      </div>
    );

  }


  // =====================================================
  // RENTAL DATE VALIDATION
  // =====================================================

  const invalidDates =
    startDate &&
    endDate &&
    new Date(endDate) <= new Date(startDate);


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="vehicle-details-page">

      <div className="details-container">


        {/* ================================================= */}
        {/* BACK BUTTON */}
        {/* ================================================= */}

        <button
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ← Back to Vehicles
        </button>


        {/* ================================================= */}
        {/* VEHICLE MAIN */}
        {/* ================================================= */}

        <div className="vehicle-details-card">


          {/* IMAGE */}

          <div className="details-image">
            {selectedImage ? (
              <>
                <img src={selectedImage} alt={vehicle.name} />
                {vehicle.images.length > 1 && (
                  <div className="image-thumbnails">
                    {vehicle.images.map((image, index) => (
                      <button
                        type="button"
                        key={index}
                        className={selectedImage === image ? "selected-thumbnail" : ""}
                        onClick={() => setSelectedImage(image)}
                        aria-label={`Show vehicle image ${index + 1}`}
                      >
                        <img src={image} alt={`${vehicle.name} ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="details-no-image">No Image Available</div>
            )}
          </div>


          {/* INFORMATION */}

          <div className="details-info">

            <div className="details-title-row">

              <div>

                <h1>
                  {vehicle.name}
                </h1>

                <span className="details-type">
                  {vehicle.type}
                </span>

              </div>

              <div className="details-price">

                <strong>
                  ₹{vehicle.dailyPrice}
                </strong>

                <span>
                  / day
                </span>

              </div>

            </div>


            <p className="details-location">
              📍 {vehicle.location}
            </p>


            <p className="details-description">
              {vehicle.description}
            </p>


            {/* ================================================= */}
            {/* OWNER */}
            {/* ================================================= */}

            <div className="owner-info">

              <h3>
                Vehicle Owner
              </h3>

              <p>
                {vehicle.owner?.name || "Owner"}
              </p>

              {vehicle.owner?.email && (
                <small>
                  {vehicle.owner.email}
                </small>
              )}

              {vehicle.owner?.phone && (
                <small className="owner-phone">
                  Phone: {vehicle.owner.phone}
                </small>
              )}

            </div>


            {/* ================================================= */}
            {/* FEATURES */}
            {/* ================================================= */}

            <div className="features-section">

              <h3>
                Vehicle Features
              </h3>

              <div className="features-list">

                {vehicle.features?.automatic && (
                  <span>✓ Automatic</span>
                )}

                {vehicle.features?.airConditioning && (
                  <span>✓ Air Conditioning</span>
                )}

                {vehicle.features?.gps && (
                  <span>✓ GPS</span>
                )}

                {vehicle.features?.bluetooth && (
                  <span>✓ Bluetooth</span>
                )}

                <span>
                  ✓ {vehicle.features?.seats || 5} Seats
                </span>

              </div>

            </div>


            {/* ================================================= */}
            {/* RENTAL SECTION */}
            {/* ================================================= */}

            <div className="rental-section">

              <h2>
                Rent This Vehicle
              </h2>


              <div className="date-row">


                {/* START DATE */}

                <div className="date-group">

                  <label>
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) =>
                      setStartDate(e.target.value)
                    }
                  />

                </div>


                {/* END DATE */}

                <div className="date-group">

                  <label>
                    End Date
                  </label>

                  <input
                    type="date"
                    value={endDate}
                    min={
                      startDate ||
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) =>
                      setEndDate(e.target.value)
                    }
                  />

                </div>

              </div>


              {/* INVALID DATE */}

              {invalidDates && (

                <p className="date-error">
                  End date must be after start date.
                </p>

              )}


              {/* ================================================= */}
              {/* PRICE SUMMARY */}
              {/* ================================================= */}

              {totalDays > 0 && !invalidDates && (

                <div className="price-summary">

                  <div>
                    <span>
                      Daily Price
                    </span>

                    <strong>
                      ₹{vehicle.dailyPrice}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Rental Days
                    </span>

                    <strong>
                      {totalDays}
                    </strong>
                  </div>


                  <div className="total-row">

                    <span>
                      Total Cost
                    </span>

                    <strong>
                      ₹{totalCost}
                    </strong>

                  </div>

                </div>

              )}


              {/* ================================================= */}
              {/* RENT BUTTON */}
              {/* ================================================= */}

              {/* <button
                className="rent-button"
                disabled={
                  !startDate ||
                  !endDate ||
                  invalidDates
                }
                onClick={() => {

                  toast.info(
                    "Availability checking will be added next."
                  );

                }}
              >
                Check Availability
              </button> */}
              <button
  className="rent-button"
  disabled={
    !startDate ||
    !endDate ||
    invalidDates
  }
  onClick={handleCheckAvailability}
>
  Check Availability
</button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default VehicleDetails;
