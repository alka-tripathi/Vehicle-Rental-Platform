
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/ownerDashboard.css";

function OwnerDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    vehicles: [],
    rentersByVehicle: {},
    recentBookings: [],
    stats: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let isFetching = false;
    let hasLoaded = false;

    const fetchDashboard = async () => {
      if (isFetching) {
        return;
      }

      isFetching = true;

      try {
        const response = await fetch(
          "http://localhost:5000/api/bookings/owner-dashboard",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load your dashboard"
          );
        }

        if (isMounted) {
          setDashboard({
            vehicles: data.vehicles || [],
            rentersByVehicle: data.rentersByVehicle || {},
            recentBookings: data.recentBookings || [],
            stats: data.stats || null,
          });
          hasLoaded = true;
        }
      } catch (error) {
        console.error("Fetch Owner Dashboard Error:", error);
        if (!hasLoaded) {
          toast.error(error.message || "Unable to load dashboard");
        }
      } finally {
        isFetching = false;
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        fetchDashboard();
      }
    };

    fetchDashboard();
    const refreshInterval = window.setInterval(fetchDashboard, 5000);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    window.addEventListener("focus", refreshWhenVisible);

    return () => {
      isMounted = false;
      window.clearInterval(refreshInterval);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener("focus", refreshWhenVisible);
    };
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }

      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const { vehicles, rentersByVehicle, recentBookings, stats } = dashboard;

  return (
    <div className="owner-dashboard">

      {/* Header */}
      <header className="owner-header">
        <div className="owner-brand-logo">
          <Link to="/owner-dashboard">
            Vehicle<span>-Rental</span>
          </Link>
        </div>

        <div className="owner-header-content">
          <div>
            <h1>Owner Dashboard</h1>
            <p>Manage your vehicles and rental bookings</p>
          </div>

          <Link to="/add-vehicle" className="add-vehicle-btn">
            + Add Vehicle
          </Link>

          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Vehicles</h3>
          <p>{loading ? "..." : stats?.totalVehicles ?? vehicles.length}</p>
        </div>

        <div className="stat-card">
          <h3>Available Vehicles</h3>
          <p>{loading ? "..." : stats?.availableVehicles ?? 0}</p>
        </div>

        <div className="stat-card">
          <h3>Active Bookings</h3>
          <p>{loading ? "..." : stats?.activeBookings ?? 0}</p>
        </div>

        <div className="stat-card">
          <h3>Total Earnings</h3>
          <p>
            {loading
              ? "..."
              : `₹${Number(stats?.totalEarnings ?? 0).toLocaleString("en-IN")}`}
          </p>
        </div>
      </div>

      {/* My Vehicles */}
      <section className="owner-section">
        <div className="section-header">
          <h2>My Vehicles</h2>

          <Link to="/my-vehicles">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>Loading your vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="empty-state">
            <h3>No vehicles added yet</h3>
            <p>Add your first vehicle and start earning.</p>

            <Link to="/add-vehicle">
              Add Vehicle
            </Link>
          </div>
        ) : (
          <div className="owner-vehicle-grid">
            {vehicles.slice(0, 3).map((vehicle) => (
              <div
                className="owner-vehicle-card"
                key={vehicle._id}
              >
                <div className="owner-vehicle-image">
                  {vehicle.images?.length > 0 ? (
                    <img
                      src={vehicle.images[0]}
                      alt={vehicle.name}
                    />
                  ) : (
                    <div className="owner-no-image">
                      No Image Available
                    </div>
                  )}
                </div>

                <div className="owner-vehicle-content">
                  <h3>{vehicle.name}</h3>

                  <p>Type: {vehicle.type}</p>

                  <p>Location: {vehicle.location}</p>

                  <h4>₹{vehicle.dailyPrice} / day</h4>

                  <span
                    className={
                      vehicle.isAvailable
                        ? "vehicle-status available"
                        : "vehicle-status unavailable"
                    }
                  >
                    {vehicle.isAvailable
                      ? "Available"
                      : "Unavailable"}
                  </span>

                  {(rentersByVehicle[vehicle._id] || []).length > 0 && (
                    <div className="owner-renter-details">
                      <h4>Booked by</h4>
                      {rentersByVehicle[vehicle._id].map((renter) => (
                        <div key={renter.id} className="owner-renter">
                          <p>Name: {renter.name || "Name unavailable"}</p>
                          <p>Phone: {renter.phone || "Phone unavailable"}</p>
                          <p>
                            Booked:{" "}
                            {new Date(renter.startDate).toLocaleDateString()} to{" "}
                            {new Date(renter.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Bookings */}
      <section className="owner-section">
        <div className="section-header">
          <h2>Recent Bookings</h2>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>Loading bookings...</p>
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="empty-state">
            <h3>No active bookings</h3>
            <p>Your vehicle bookings will appear here.</p>
          </div>
        ) : (
          <div className="owner-booking-list">
            {recentBookings.map((booking) => (
              <article className="owner-booking-card" key={booking._id}>
                <div>
                  <h3>{booking.vehicle?.name || "Vehicle"}</h3>
                  <p>Booked by: {booking.customer?.name || "Name unavailable"}</p>
                  <p>Phone: {booking.customer?.phone || "Phone unavailable"}</p>
                </div>
                <div className="owner-booking-meta">
                  <span className="vehicle-status unavailable">Unavailable</span>
                  <p>
                    {new Date(booking.startDate).toLocaleDateString()} –{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                  <strong>₹{Number(booking.totalCost || 0).toLocaleString("en-IN")}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

export default OwnerDashboard;
