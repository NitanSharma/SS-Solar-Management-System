import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";
import AddDefaultTasksButton from "./AddDefaultTasksButton";


const statusStyles = {
  Pending: "bg-gray-200 text-gray-700",
  Ongoing: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

const ClientTableTask = ({ clientId }) => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const [showDefaultBtn, setShowDefaultBtn] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState({});

  useEffect(() => {
    const used = localStorage.getItem(`defaultTasksAdded_${clientId}`);
    if (!used) setShowDefaultBtn(true);
  }, [clientId]);

  useEffect(() => {
  const storedChecked = JSON.parse(localStorage.getItem("checkedTasks")) || {};
  setCheckedTasks(storedChecked);
}, []);

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

  const handleSuccessDefaultTasks = () => {
    localStorage.setItem(`defaultTasksAdded_${clientId}`, "true");
    setShowDefaultBtn(false); 
  };

  const handleCheckboxChange = (taskId) => {
  const updatedChecked = {
    ...checkedTasks,
    [taskId]: !checkedTasks[taskId],
  };

  setCheckedTasks(updatedChecked);
  localStorage.setItem("checkedTasks", JSON.stringify(updatedChecked));
};

  return (
    <div className="bg-white text-gray-800 rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Tasks</h2>

        <div className="flex gap-3">
          {showDefaultBtn && (
            <AddDefaultTasksButton
              clientId={clientId}
              onSuccess={handleSuccessDefaultTasks}
            />
          )}

          <button
            onClick={() => navigate(`/addTask?clientId=${clientId}`)}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-all"
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px] divide-y divide-gray-200">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 transition"
            >
              {/* Checkbox */}
              <input type="checkbox" className="mr-3 w-4 h-4"
              checked={!!checkedTasks[task._id]}
              onChange={() => handleCheckboxChange(task._id)}
              />

              {/* Task Name */}
              <div className="w-1/3 font-medium">{task.taskName}</div>

              {/* Status Pill */}
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  statusStyles[task.status] || "bg-gray-200 text-gray-700"
                }`}
              >
                {task.status}
              </div>

              {/* Date */}
              <div className="flex items-center gap-1 text-sm text-gray-600 w-28">
                <FiCalendar className="text-gray-500" />
                {task.date ? new Date(task.date).toLocaleDateString() : "--"}
              </div>

              {/* Note */}
              <div className="text-gray-400 text-sm italic w-1/4 truncate">
                {task.note ? task.note : "──────────"}
              </div>

              {/* Actions */}
              <div className="flex gap-3 text-lg">
                <FiEdit2
                  className="text-blue-600 cursor-pointer hover:scale-110 transition"
                  onClick={() => navigate(`/editTask/${task._id}`)}
                />

                <FiTrash2
                  className="text-red-600 cursor-pointer hover:scale-110 transition"
                  onClick={() => handleDelete(task._id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientTableTask;
