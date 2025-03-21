import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaDownload, FaPrint, FaEdit, FaTrash } from "react-icons/fa";


const ResumeList = ({ onNewResume, onPrint, onDownload, onEdit }) => {
  const [resumes, setResumes] = useState([]);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    axios
      .get("/resume/resumes", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data)
        setResumes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching resumes:", error);
      });
  }, []);


  const onDelete = (id) => {
    // logic for deleting resume
  };

  return (
    <div className="mt-8 max-w-6xl mx-auto">
    {/* Header Section */}
    <div className="flex justify-between items-center bg-gray-800 text-white p-4 rounded-md shadow-lg mb-4">
      <h2 className="text-xl font-bold">My Resumes</h2>
      <button
        className={`px-4 py-2 rounded-md font-semibold tracking-wide uppercase transition-all duration-300 ${
          hover ? "bg-gray-600" : "bg-gray-700"
        }`}
        onClick={onNewResume}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        Create New Resume
      </button>
    </div>

    {/* Resume Cards */}
    {resumes.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <div key={resume.id} className="bg-white shadow-md rounded-lg p-4 relative hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2">
              {resume.resumeBio.FirstName} {resume.resumeBio.LastName}
            </h3>
            <p className="text-gray-600 text-sm">{resume.resumeBio.Email}</p>
            <p className="text-gray-700 text-sm mt-1">
              <strong>Phone:</strong> {resume.resumeBio.PhoneNumber}
            </p>

            {/* Resume Status */}
            <p className={`text-sm font-medium mt-2 italic ${
              resume.Status === "draft" ? "text-orange-500" : "text-green-600"
            }`}>
              {resume.Status === "draft" ? "Draft" : "Completed"}
            </p>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              {resume.Status === "Completed" && (
                <>
                  <button
                    className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-all"
                    onClick={() => onDownload(resume.id)}
                  >
                    <FaDownload className="mr-2" /> Download
                  </button>
                  <button
                    className="flex items-center bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-all"
                    onClick={() => onPrint(resume.id)}
                  >
                    <FaPrint className="mr-2" /> Print
                  </button>
                </>
              )}

              <button
                className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-all"
                onClick={() => onEdit(resume.id)}
              >
                <FaEdit className="mr-2" /> Edit
              </button>

              <button
                className="flex items-center bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all"
                onClick={() => onDelete(resume.id)}
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-600 mt-4">No resumes available. Please create a new resume.</p>
    )}
  </div>
  );
};

export default ResumeList;
