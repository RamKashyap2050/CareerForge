import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaDownload,
  FaPrint,
  FaEdit,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import ResumeCard from "./ResumeCard";
const ResumeList = ({ onNewResume, onPrint, onDownload, onEdit }) => {
  const [resumes, setResumes] = useState([]);
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/resume/resumes", { withCredentials: true })
      .then((response) => {
        setResumes(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching resumes:", error);
        setLoading(false);
      });
  }, []);

  const onDelete = (id) => {
    // Your delete logic
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-3xl text-blue-600 mr-3" />
        <span className="text-gray-600 text-lg font-medium">
          Loading resumes...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      {/* Header */}
      <div className="w-full mb-6  border-b border-gray-200 pb-4">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h2 className="text-3xl font-semibold tracking-tight text-gray-900">My Resumes</h2>
      <p className="text-sm text-gray-500 mt-1">Create, update, and manage your resumes below.</p>
    </div>

    <button
      onClick={onNewResume}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`px-5 py-2.5 rounded-md font-medium text-sm border transition duration-200
        ${hover ? "border-gray-300 bg-gray-50" : "border-gray-200 bg-white"}`}
    >
      + Create Resume
    </button>
  </div>
</div>


      {/* Resume Cards */}
      {resumes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume, index) => (
            <ResumeCard key={resume.id} resume={resume} onEdit={onEdit} onPrint={onDownload} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-8 text-lg">
          No resumes found. Click "Create Resume" to start building.
        </p>
      )}
    </div>
  );
};

export default ResumeList;
