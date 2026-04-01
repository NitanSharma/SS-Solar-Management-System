import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ClientDocuments = () => {
  const { clientId } = useParams();
  const token = localStorage.getItem("token");
  const fileRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/documents/${clientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDocuments(response.data);
    } catch (error) {
      console.error("Fetch documents error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) fetchDocuments();
  }, [clientId]);

  const uploadDocuments = async () => {
    if (!selectedFiles.length) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("clientId", clientId);

      selectedFiles.forEach((file) =>
        formData.append("files", file)
      );

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/documents/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedFiles([]);
      fileRef.current.value = "";
      fetchDocuments();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Documents</h2>

        <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
          Add Document
          <input
            ref={fileRef}
            type="file"
            multiple
            hidden
            onChange={(e) =>
              setSelectedFiles([...e.target.files])
            }
          />
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <button
          onClick={uploadDocuments}
          disabled={uploading}
          className="mb-4 bg-blue-500 text-white px-5 py-2 rounded"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      )}

      {loading && <p>Loading documents...</p>}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc._id} className="border p-3 rounded">
              <p className="text-sm font-medium truncate">
                {doc.originalName}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(doc.uploadedAt).toLocaleDateString()}
              </p>

              <a
                href={doc.fileUrl}
                target="_blank"
                className="text-blue-600 text-sm underline"
              >
                View
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientDocuments;
