import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddDefaultTasksButton from "./AddDefaultTasksButton";

const ClientTableTask = ({ clientId }) => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/task/getTasks/${clientId}`
        );
        setTasks(res.data.tasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, [clientId]);

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/task/deleteTask/${taskId}`
      );
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="bg-white text-gray-800 rounded-lg shadow-lg p-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Tasks</h3>

        <div className="">
          <AddDefaultTasksButton clientId={clientId}  />

          <button
            onClick={() => navigate(`/addTask?clientId=${clientId}`)}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded transition-all"
          >
            Add Task
          </button>
        </div>
      </div>

      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-2 px-3 text-left">Task</th>
            <th className="py-2 px-3 text-left">Status</th>
            <th className="py-2 px-3 text-left">Date</th>
            <th className="py-2 px-3 text-left">Note</th>
            <th className="py-2 px-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-3">{task.taskName}</td>
              <td className="py-2 px-3">{task.status}</td>
              <td className="py-2 px-3">{task.date}</td>
              <td className="py-2 px-3">{task.note || "—"}</td>
              <td className="py-2 px-3 flex gap-2">
                <button
                  onClick={() => navigate(`/editTask/${task._id}`)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTableTask;
