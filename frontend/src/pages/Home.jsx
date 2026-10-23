import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/home.css";

function Home() {

  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & filter states
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);


  // ================= FETCH VEHICLES =================

  useEffect(() => {
    fetchVehicles();
  }, []);


  const fetchVehicles = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/vehicles"
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      setVehicles(data.vehicles);

    } catch (error) {

      console.error(
        "Fetch Vehicles Error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }

      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.message || "Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };


  // ================= FILTER =================

  const filteredVehicles = vehicles.filter(
    (vehicle) => {

      const matchesSearch =
        vehicle.name
          .toLowerCase()
          .includes(search.toLowerCase());


      const matchesType =
        type === "" ||
        vehicle.type === type;


      const matchesLocation =
        location === "" ||
        vehicle.location
          .toLowerCase()
          .includes(location.toLowerCase());


      const matchesPrice =
        maxPrice === "" ||
        vehicle.dailyPrice <= Number(maxPrice);


      return (
        matchesSearch &&
        matchesType &&
        matchesLocation &&
        matchesPrice
      );
    }
  );


  // ================= LOADING =================

  if (loading) {
    return (
      <div className="loading">
        Loading vehicles...
      </div>
    );
  }


  // ================= UI =================

  return (
    <div className="home-page">

      {/* <header className="customer-header">
        <button className="bookings-button" onClick={() => navigate("/my-bookings")}>
          My Bookings
        </button>
        <button className="customer-logout-button" onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </header> */}

      
<header className="customer-header">
  <div
    className="brand-logo"
    onClick={() => navigate("/")}
  >
    Vehicle<span>-Rental</span>
  </div>

  <div className="header-actions">
    <button
      className="bookings-button"
      onClick={() => navigate("/my-bookings")}
    >
      My Bookings
    </button>

    <button
      className="customer-logout-button"
      onClick={handleLogout}
      disabled={loggingOut}
    >
      {loggingOut ? "Logging out..." : "Logout"}
    </button>
  </div>
</header>


      {/* ================= HERO ================= */}

      <section className="hero-section">

        <div className="hero-content">

          <h1>
            Find Your Perfect Ride
          </h1>

          <p>
            Rent cars, SUVs, bikes and vans
            at affordable prices.
          </p>

        </div>

      </section>


      {/* ================= SEARCH ================= */}

      <section className="search-section">

        <div className="search-container">

          <input
            type="text"
            placeholder="Search vehicle name or model..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >

            <option value="">
              All Types
            </option>

            <option value="Car">
              Car
            </option>

            <option value="SUV">
              SUV
            </option>

            <option value="Bike">
              Bike
            </option>

            <option value="Van">
              Van
            </option>

          </select>


          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />


          <input
            type="number"
            placeholder="Max price/day"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value)
            }
          />

        </div>

      </section>


      {/* ================= VEHICLES ================= */}

      <main className="vehicles-section">

        <div className="section-heading">

          <div>
            <h2>
              Available Vehicles
            </h2>

            <p>
              {filteredVehicles.length} vehicles found
            </p>
          </div>

        </div>


        {filteredVehicles.length === 0 ? (

          <div className="no-results">

            <h3>
              No vehicles found
            </h3>

            <p>
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          <div className="vehicle-grid">

            {filteredVehicles.map(
              (vehicle) => (

                <div
                  className="vehicle-card"
                  key={vehicle._id}
                >

                  {/* Image */}

                  <div className="vehicle-image">

                    {vehicle.images &&
                    vehicle.images.length > 0 ? (

                      <img
                        src={vehicle.images[0]}
                        alt={vehicle.name}
                      />

                    ) : (

                      <div className="no-image">
                        No Image
                      </div>

                    )}

                  </div>


                  {/* Content */}

                  <div className="vehicle-content">

                    <div className="vehicle-title">

                      <h3>
                        {vehicle.name}
                      </h3>

                      <span>
                        {vehicle.type}
                      </span>

                    </div>


                    <p className="location">
                      📍 {vehicle.location}
                    </p>


                    <p className="description">
                      {vehicle.description}
                    </p>

                    <p className="owner-contact">
                      Owner: {vehicle.owner?.name || "Owner"}
                      {vehicle.owner?.phone ? ` · ${vehicle.owner.phone}` : ""}
                    </p>


                    <div className="vehicle-footer">

                      <div className="price">

                        <strong>
                          ₹{vehicle.dailyPrice}
                        </strong>

                        <span>
                          / day
                        </span>

                      </div>


                      <button
                        onClick={() =>
                          navigate(
                            `/vehicles/${vehicle._id}`
                          )
                        }
                      >
                        View Details
                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </main>

    </div>
  );
}

export default Home;
