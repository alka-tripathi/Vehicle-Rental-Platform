
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VehicleDetails from "./pages/VehicleDetails";
import MyBookings from "./pages/MyBookings";

// import Home from "./pages/Home";


import OwnerDashboard from "./pages/OwnerDashboard";
import AddVehicle from "./pages/AddVehicle";
import Home from "./pages/Home";
import "./App.css";

function OwnerRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || user.role !== "owner") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function CustomerRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || user.role !== "customer") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route
  path="/vehicles/:id"
  element={<VehicleDetails />}
/>

        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/home" element={<CustomerRoute><Home /></CustomerRoute>} />
        <Route path="/owner-dashboard" element={<OwnerRoute><OwnerDashboard /></OwnerRoute>} />
        <Route path="/add-vehicle" element={<OwnerRoute><AddVehicle /></OwnerRoute>} />
        <Route path="/my-bookings" element={<CustomerRoute><MyBookings /></CustomerRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

