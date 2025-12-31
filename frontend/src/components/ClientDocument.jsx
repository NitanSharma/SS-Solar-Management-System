import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ClientDocuments = () => {
  const { clientId } = useParams();
  const fileInputRef = useRef(null);

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
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    if (clientId) fetchDocs();
  }, [clientId]);

  const uploadDocs = async () => {
    if (!files.length || uploading) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("clientId", clientId);
      files.forEach((file) => formData.append("files", file));

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/documents/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchDocs();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
        <h2 className="text-base sm:text-lg font-semibold">Documents</h2>

        <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer">
          Add Document
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            disabled={uploading}
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
        </label>
      </div>

      {files.length > 0 && (
        <button
          onClick={uploadDocs}
          disabled={uploading}
          className={`mb-4 px-6 py-2.5 rounded-lg text-white font-medium
            ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {uploading ? "Uploading..." : "Upload Selected"}
        </button>
      )}

      {loadingDocs && (
        <p className="text-center text-gray-500">Loading documents...</p>
      )}

      {!loadingDocs && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <div key={doc._id} className="border rounded-lg p-3 bg-gray-50">
              {doc.fileType?.startsWith("image") ? (
                <img
                  src={doc.fileUrl}
                  alt="document"
                  className="w-full h-48 object-cover rounded"
                />
              ) : doc.fileType === "application/pdf" ? (
                <div className="h-48 flex flex-col items-center justify-center border bg-white">
                  <span className="text-4xl">📄</span>
                  <a
                    href={doc.fileUrl.replace("/upload/", "/raw/upload/")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-sm text-blue-600 underline"
                  >
                    View PDF
                  </a>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-4xl">
                  📄
                </div>
              )}

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
