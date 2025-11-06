import AddDefaultTasksButton from "../components/AddDefaultTasksButton";
import ClientCardInfo from "../components/ClientCardInfo";
import ClientTableTask from "../components/ClientTableTask";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const ClientDetailsPage = () => {
  const { clientId } = useParams();

  return (
    <div className="min-h-screen bg-[#0B1623] px-8 py-6">
      <Navbar />
      <div className="flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-6xl">
          {/* Client Info */}
          <ClientCardInfo clientId={clientId} />

          {/* Task Table */}
          <div className="mt-10">
            <ClientTableTask clientId={clientId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsPage;
