import axios from "axios";
import React, { useEffect, useState } from "react";

const ClientCardInfo = ({ clientId }) => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/client/getClient/${clientId}`);
        setClient(res.data);
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    };
    fetchClient();
  }, [clientId]);

  if (!client) return <p className="text-gray-300">Loading client details...</p>;

  return (
    <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 flex flex-col md:flex-row md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold mb-2">{client.name}</h2>
        <p> {client.contact}</p>
        <p> {client.email}</p>
        <p> {client.address}</p>
        <p className="mt-2">
          <strong>Project Status:</strong> {client.projectStatus}
        </p>
        <p>
          <strong>Capacity:</strong> {client.capacityKW} kWp
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-4 md:mt-0">
        <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded transition-all">
          Add Document
        </button>
        <button className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition-all">
          Set Reminder
        </button>
      </div>
    </div>
  );
};

export default ClientCardInfo;
