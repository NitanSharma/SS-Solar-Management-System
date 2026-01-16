import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const AddClient = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    projectStatus: "Ongoing",
    capacityKW: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
        capacityKW: parseFloat(formData.capacityKW),
      };
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/client/addClient`,
        payload , {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      //   console.log(res);
      setMessage("✅ Client added successfully!");
      setFormData({
        name: "",
        email: "",
        contact: "",
        address: "",
        projectStatus: "Ongoing",
        capacityKW: "",
      });
      navigate("/dashboard");
    } catch (err) {
      setMessage(
        "Error adding client: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1623] px-4 py-4">
      <div className="flex flex-col items-center justify-center px-3 sm:px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-5 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5 text-center">
            Add Client
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 text-sm sm:text-base">
                Client Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contact + Email */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-gray-700 mb-1 text-sm sm:text-base">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex-1">
                <label className="block text-gray-700 mb-1 text-sm sm:text-base">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Address + Status */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-gray-700 mb-1 text-sm sm:text-base">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex-1">
                <label className="block text-gray-700 mb-1 text-sm sm:text-base">
                  Project Status
                </label>
                <select
                  name="projectStatus"
                  value={formData.projectStatus}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm sm:text-base">
                Solar Installation Capacity (kW)
              </label>
              <input
                type="number"
                name="capacityKW"
                value={formData.capacityKW}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm sm:text-[15px] font-medium transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 rounded-lg text-sm sm:text-[15px] font-medium transition border border-gray-400 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>

          {message && (
            <p className="text-center mt-4 text-sm font-medium text-gray-700">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddClient;
