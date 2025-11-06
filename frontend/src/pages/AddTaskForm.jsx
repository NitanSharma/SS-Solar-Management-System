import { useState } from "react";
import axios from "axios";
import { useNavigate , useSearchParams } from "react-router-dom";


const AddTaskForm = () => {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("clientId"); // get from query 
  
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    taskName: "",
    status: "Pending",
    date: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...taskData, clientId };
      console.log(payload)
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/task/addTask`, payload);
      if (res.status === 201) {
        // onSuccess?.(res.data.task);
        navigate(`/client/${clientId}`);
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1623] px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transition-all duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Add Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Name
            </label>
            <input
              type="text"
              name="taskName"
              value={taskData.taskName}
              onChange={handleChange}
              required
              placeholder="Enter task name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={taskData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option>Pending</option>
              <option>Ongoing</option>
              <option>Completed</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={taskData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note
            </label>
            <textarea
              name="note"
              value={taskData.note}
              onChange={handleChange}
              rows="3"
              placeholder="Write any additional details..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-sky-600 text-white px-6 py-2 rounded-lg shadow hover:bg-sky-700 transition-all duration-300"
            >
              Submit
            </button>
            {/* <button
              type="button"
              onClick={onCancel}
              className="border border-gray-400 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              Cancel
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;
