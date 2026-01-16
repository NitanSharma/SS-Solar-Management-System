
import { Sun } from "lucide-react";
import { FaUserCircle} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/logout`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
     <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 space-y-4 md:space-y-0 px-4">
      {/* Left Section */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center space-x-2">
          <img src="/companyLogo.png" alt="logo" className="text-center m-0 md:w-60" />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3 justify-end w-full md:w-auto">
        <button
          onClick={handleLogout}
          className="hidden bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium md:block"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar