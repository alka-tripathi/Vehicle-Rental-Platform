import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../style/register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      console.log("Register Response:", data);

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      // Clear form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("customer");

      navigate("/login");

    } catch (error) {
      console.error("Registration Error:", error);

      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <div className="register-header">
          <h2>Create Account</h2>
          <p>Register to get started</p>
        </div>

        <form onSubmit={handleRegister}>

          {/* Name */}
          <div className="register-input-group">
            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="register-input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="register-input-group">
            <label>Phone Number</label>

            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              required
            />
          </div>

          {/* Password */}
          <div className="register-input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role */}
          <div className="register-input-group">
            <label>I want to</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="customer">
                Rent a vehicle
              </option>

              <option value="owner">
                List my vehicle
              </option>
            </select>
          </div>

          {/* Submit */}
          <button type="submit" className="register-btn">
            Create Account
          </button>

        </form>

        <div className="login-text">
          Already have an account?
          <a href="/login"> Login</a>
        </div>

      </div>
    </div>
  );
}

export default Register;
