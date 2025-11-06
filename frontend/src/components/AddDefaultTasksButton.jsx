import axios from "axios";
import { useNavigate } from "react-router-dom";

const defaultTasks = [
  "Client Convince",
  "Rate",
  "Loan Cash",
  "Payment Received",
  "Document Received",
  "Portal Login",
  "Material Purchase: Structure",
  "Material Purchase: Panels and Inverter",
  "Material Purchase: BOS Material",
  "Material Purchase: Wiring, Earthing Set, and LA",
  "Installation: Structure",
  "Installation: Complete Installation",
  "Installer Payment",
  "File Preparation",
  "File Reached in Zone",
  "File Reached in Division",
  "Meter Conversion and SRFR",
  "Plant Start",
  "Working",
  "Service",
  "Complaint",
];

const AddDefaultTasksButton = ({ clientId }) => {
  const navigate = useNavigate();

  const handleAddDefaultTasks = async () => {
    if (!clientId) return alert("Client ID missing!");

    try {
      const promises = defaultTasks.map((taskName) => {
        const payload = {
          clientId,
          taskName,
          status: "Pending",
          date: new Date().toISOString().split('T')[0],
          note: "",
        };
        return axios.post(`${import.meta.env.VITE_BASE_URL}/task/addTask`, payload);
      });

      await Promise.all(promises);
      navigate(`/client/${clientId}`);
    } catch (error) {
      console.error("Error adding default tasks:", error);
    }
  };

  return (
    <button
      onClick={handleAddDefaultTasks}
      className="bg-sky-500 hover:bg-sky-600 text-white px-2 py-2 rounded-lg shadow-md transition-all duration-300"
    >
       Add Default Tasks
    </button>
  );
};

export default AddDefaultTasksButton;
