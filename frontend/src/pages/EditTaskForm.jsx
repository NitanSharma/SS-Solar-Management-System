import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const EditTaskForm = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    taskName: "",
    status: "Pending",
    date: "",
    note: "",
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/task/tasks/${taskId}`
        );
        setFormData(res.data.task);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    if (taskId) fetchTask();
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/task/editTask/${taskId}`,
        formData
      );
      navigate(-1);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1623] px-8 py-6">
      <Navbar />
      <div className="fixed inset-0 bg-[#0B1623] bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl w-[450px] p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Edit Task —{" "}
            <span className="text-sky-600">
              {formData.taskName || "[Task Name]"}
            </span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Task Name</label>
              <input
                type="text"
                name="taskName"
                value={formData.taskName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option>Pending</option>
                  <option>Ongoing</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date ? formData.date.split("T")[0] : ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Note</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 rounded-lg text-[15px] font-medium transition border border-gray-400 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-[15px] font-medium transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTaskForm;
