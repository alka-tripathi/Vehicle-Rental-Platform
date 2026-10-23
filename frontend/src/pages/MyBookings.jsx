import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/myBookings.css";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch customer's bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings/my",
        {
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      setBookings(data.bookings);

    } catch (error) {
      console.error(error);
      toast.error("Unable to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Booking cancelled successfully");

      // Remove cancelled booking from the page
      setBookings((prevBookings) =>
        prevBookings.filter(
          (booking) => booking._id !== bookingId
        )
      );

    } catch (error) {
      console.error("Cancel Booking Error:", error);
      toast.error("Something went wrong");
    }
  };

  // Loading
  if (loading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div className="bookings-page">
      <div className="bookings-container">

        <button onClick={() => navigate("/home")}>
          ← Back to Vehicles
        </button>

        <h1>My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="no-bookings">
            <h2>No bookings yet</h2>

            <button onClick={() => navigate("/home")}>
              Browse Vehicles
            </button>
          </div>
        ) : (
          <div className="bookings-grid">

            {bookings.map((booking) => (
              <div
                className="booking-card"
                key={booking._id}
              >

                {/* Vehicle Image */}
                <div className="booking-image">
                  {booking.vehicle?.images?.length > 0 ? (
                    <img
                      src={booking.vehicle.images[0]}
                      alt={booking.vehicle.name}
                    />
                  ) : (
                    <div>No Image</div>
                  )}
                </div>

                {/* Booking Details */}
                <div className="booking-content">

                  <h2>
                    {booking.vehicle?.name}
                  </h2>

                  <p>
                    Type: {booking.vehicle?.type}
                  </p>

                  <p>
                    Location: {booking.vehicle?.location}
                  </p>

                  <hr />

                  <p>
                    Start Date:{" "}
                    {new Date(
                      booking.startDate
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    End Date:{" "}
                    {new Date(
                      booking.endDate
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    Rental Days: {booking.totalDays}
                  </p>

                  <p>
                    Daily Price: ₹{booking.dailyPrice}
                  </p>

                  <h3>
                    Total: ₹{booking.totalCost}
                  </h3>

                  <span>
                    Status: {booking.status}
                  </span>

                  {/* Cancel Button */}
                  {/* <button
                    className="cancel-button"
                    onClick={() =>
                      handleCancelBooking(booking._id)
                    }
                  >
                    Cancel Booking
                  </button> */}
                  
<button
  className={`cancel-button ${
    booking.status === "cancelled" ? "cancelled" : ""
  }`}
  onClick={() => handleCancelBooking(booking._id)}
  disabled={booking.status === "cancelled"}
>
  {booking.status === "cancelled"
    ? "Booking Cancelled"
    : "Cancel Booking"}
</button>


                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default MyBookings;