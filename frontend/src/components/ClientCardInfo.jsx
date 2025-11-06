import { useEffect, useState } from "react";
import axios from "axios";

const ClientCardInfo = ({ clientId }) => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/client/getClient/${clientId}`
        );
        setClient(res.data);
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    };
    fetchClient();
  }, [clientId]);

  if (!client)
    return <p className="text-gray-400 text-sm">Loading client details...</p>;

  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-6 md:p-8 w-full 
                    flex flex-col md:flex-row md:justify-between md:items-center"
    >
      {/* Left Side */}
      <div className="space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          {client.name}
        </h2>

        <p className="text-[15px] text-gray-700">
          <span className="font-medium text-gray-600">Contact Number</span>
          <span className="ml-4 text-gray-800">{client.contact}</span>
        </p>

        <p className="text-[15px] text-gray-700">
          <span className="font-medium text-gray-600 block">Email</span>
          <span className="text-gray-800 break-all">{client.email}</span>
        </p>

        <p className="text-[15px] text-gray-700">
          <span className="font-medium text-gray-600">Project Status</span>
          <span className="ml-6 text-blue-600 font-medium">
            {client.projectStatus}
          </span>
        </p>
      </div>

      {/* Right Side (Buttons + Capacity) */}
      <div className="flex flex-col items-end gap-4 mt-6 md:mt-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0 w-full">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 
               rounded-lg text-[15px] font-medium transition 
               w-full sm:w-auto sm:px-5 sm:py-2 sm:text-[14px] 
               xs:px-4 xs:py-2 xs:text-[13px]"
          >
            Add Document
          </button>

          <button
            className="border border-blue-400 text-blue-600 px-6 py-2.5 
               rounded-lg text-[15px] font-medium hover:bg-blue-50 transition 
               w-full sm:w-auto sm:px-5 sm:py-2 sm:text-[14px] 
               xs:px-4 xs:py-2 xs:text-[13px]"
          >
            Set Reminder
          </button>
        </div>

        <p className="text-[15px] text-gray-700 font-medium flex justify-between w-full md:w-auto">
          Capacity
          <span className="ml-4 text-gray-900 font-semibold">
            {client.capacityKW} kWp
          </span>
        </p>
      </div>
    </div>
  );
};

export default ClientCardInfo;
