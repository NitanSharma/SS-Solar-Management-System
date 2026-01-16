import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200) {
          setLoading(false); // ✅ allow access
        }
      } catch (error) {
        console.log("Auth error:", error);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    verifyUser();
  }, [navigate]);

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
