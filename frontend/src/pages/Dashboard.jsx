import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserPlus } from "lucide-react";

import { FaPhoneAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      setFetchData();
    }
  }, [token]);

  const setFetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/client/clients`
      );
      if (response.status === 200) {
        setData(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0B1623] text-white px-8 py-6">
      {/* Navbar */}
      <Navbar />
      {/* Clients Section */}
      <div className="flex justify-between align-center mb-5">
        <h1 className="text-3xl font-semibold">Clients</h1>
        <Link
          to="/addClient"
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg shadow-lg text-sm font-medium space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Client</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.length === 0 ? (
          <p className="text-gray-400">No clients found.</p>
        ) : (
          data.map((client) => (
            <Link to={`/client/${client._id}`} key={client._id}>
             <div
              key={client._id}
              className="bg-[#12293F] rounded-2xl p-6 shadow-md border border-[#1C314F]/30"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">{client.name}</h2>

                <span className="text-white font-medium">
                  {client.capacityKW} kWp
                </span>
              </div>

              <div className="flex items-center text-gray-300 mb-2">
                <FaPhoneAlt className="mr-2 text-gray-400" />
                <span>{client.contact}</span>
              </div>

              <div className="flex justify-between text-gray-400 text-sm border-t border-gray-700 pt-2">
                <span>Project status</span>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    client.projectStatus === "Ongoing"
                      ? "bg-blue-500/20 text-blue-400"
                      : client.projectStatus === "Completed"
                      ? "bg-sky-500/20 text-sky-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {client.projectStatus}
                </span>
              </div>
            </div>
            </Link>
           

          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
