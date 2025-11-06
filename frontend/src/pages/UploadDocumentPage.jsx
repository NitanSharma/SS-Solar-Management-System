import React, { useState } from "react";
import { FaArrowLeft, FaUpload, FaTrashAlt, FaEye } from "react-icons/fa";

const UploadDocumentPage: React.FC = () => {
  const [client] = useState({
    name: "John Doe",
    contact: "+91 9876543210",
    email: "john.doe@gmail.com",
    capacity: "5 kW",
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...uploaded]);
  };

  const handleDelete = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Please upload at least one document.");
      return;
    }
    const formData = new FormData();
    files.forEach((file) => formData.append("documents", file));

    // Example POST (replace with actual API)
    console.log("Uploading files:", files);
    alert("Documents uploaded successfully!");
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white font-[Inter] px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-semibold">
          Upload Documents —{" "}
          <span className="text-sky-400">{client.name}</span>
        </h1>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-300 hover:text-white border border-gray-500 px-4 py-2 rounded-lg transition"
        >
          <FaArrowLeft />
          Back
        </button>
      </div>

      {/* Card */}
      <div className="bg-[#F9FBFF] text-gray-800 rounded-2xl p-6 shadow-lg">
        {/* Client Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Client Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
            <p>
              <span className="font-medium">Name:</span> {client.name}
            </p>
            <p>
              <span className="font-medium">Contact:</span> {client.contact}
            </p>
            <p>
              <span className="font-medium">Email:</span> {client.email}
            </p>
            <p>
              <span className="font-medium">Capacity:</span> {client.capacity}
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <h2 className="text-lg font-semibold mb-3 text-gray-900">
          Upload Documents
        </h2>
        <div className="border-2 border-dashed border-blue-400 bg-[#F0F9FF] rounded-xl h-44 flex flex-col justify-center items-center text-gray-500 mb-6 transition hover:bg-blue-50">
          <FaUpload className="text-3xl text-blue-500 mb-3" />
          <p className="text-sm mb-2">Drag & drop files here or</p>
          <label className="cursor-pointer text-blue-500 font-medium hover:underline">
            Choose Files
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Uploaded Files Table */}
        {files.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-[#F1F5F9] text-gray-700">
                <tr>
                  <th className="py-2 px-3 text-left">Document Name</th>
                  <th className="py-2 px-3 text-left">Upload Date</th>
                  <th className="py-2 px-3 text-left">Size</th>
                  <th className="py-2 px-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"
                    } border-t text-gray-700`}
                  >
                    <td className="py-2 px-3">{file.name}</td>
                    <td className="py-2 px-3">
                      {new Date().toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3">
                      {(file.size / 1024).toFixed(1)} KB
                    </td>
                    <td className="py-2 px-3 flex items-center gap-3">
                      <button className="text-blue-500 hover:text-blue-700">
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => window.history.back()}
            className="border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 rounded-lg px-4 py-2 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-4 py-2 transition"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentPage;
