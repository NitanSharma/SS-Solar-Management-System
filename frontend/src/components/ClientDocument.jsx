import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ClientDocuments = () => {
  const { clientId } = useParams();

  const [documents, setDocuments] = useState([]);
  const [files, setFiles] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchDocs = async () => {
    try {
      setLoadingDocs(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/documents/${clientId}`
      );
      console.log(res.data)
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [clientId]);

  const uploadDocs = async () => {
    if (!files.length || uploading) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("clientId", clientId);

      for (let file of files) {
        formData.append("files", file);
      }

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/documents/upload`,
        formData
      );

      setFiles([]);
      fetchDocs();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">Documents</h2>

        <label
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 
          rounded-lg text-[15px] font-medium transition 
          w-full sm:w-auto sm:px-5 sm:py-2 sm:text-[14px]"
        >
          Add Document
          <input
            type="file"
            multiple
            hidden
            disabled={uploading}
            onChange={(e) => setFiles(e.target.files)}
          />
        </label>
      </div>

      {/* Upload Button */}
      {files.length > 0 && (
        <button
          onClick={uploadDocs}
          disabled={uploading}
          className={`mb-4 text-white font-medium transition rounded-lg
            px-6 py-2.5 w-full sm:w-auto
            ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }
          `}
        >
          {uploading ? "Uploading..." : "Upload Selected"}
        </button>
      )}

      {/* Loading */}
      {loadingDocs && (
        <p className="text-center text-gray-500">Loading documents...</p>
      )}

      {/* Documents */}
      {!loadingDocs && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="border rounded-lg p-3 bg-gray-50 hover:shadow-md transition"
            >
              <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                {doc.fileType?.startsWith("image") ? (
                  <img
                    src={doc.fileUrl}
                    alt="document"
                    className="w-full h-48 object-cover rounded"
                  />
                ) : doc.fileType === "application/pdf" ? (
                  <iframe
                    src={doc.fileUrl}
                    className="w-full h-48 rounded"
                    title="PDF Preview"
                  />
                ) : (
                  <div className="h-48 flex items-center justify-center text-4xl">
                    📄
                  </div>
                )}
              </a>

              <div className="mt-2">
                <p className="text-sm font-medium truncate">
                  {doc.originalName || "Document"}
                </p>

                <p className="text-xs text-gray-500">
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientDocuments;
