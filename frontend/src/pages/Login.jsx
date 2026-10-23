import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../style/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login Response:", data);

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      console.log("Logged in User:", data.user);

      // Store user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Clear form
      setEmail("");
      setPassword("");

      // Role-based navigation
      if (data.user.role === "owner") {
        navigate("/owner-dashboard");
      } else {
        navigate("/home");
      }

    } catch (error) {
      console.error("Login Error:", error);

      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="login-card">

        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Login to your account</p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

        </form>

        <div className="register-text">
          Don't have an account?
          <a href="/register"> Register</a>
        </div>

      </div>
    </div>
  );
}

export default Login;