import { useEffect, useState } from "react";
import api from "./api";

function Profile() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const getUser = async () => {

      try {

        const response = await api.get("/auth/me");

        setUser(response.data.user);

      } catch (error) {

        console.log("Not authenticated");

      } finally {

        setLoading(false);

      }
    };

    getUser();

  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return <h2>Please login</h2>;
  }

  const handleLogout = async () => {

  try {

    await api.post("/auth/logout");

    alert("Logged out");

    window.location.href = "/login";

  } catch (error) {

    console.log(error);

  }
};

  return (
    <div>

      <h1>Welcome {user.name}</h1>

      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>
  Logout
</button>

    </div>
  );
}

export default Profile;