import React, { useState } from "react";
import { CircularProgress } from "@mui/material"; // Spinner
import JobTitleSelection from "../Components/JobTitleSelection";
import ToolSelection from "../Components/ToolSelection";
import InterviewSettings from "../Components/InterviewSettings";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import useMockInterviewStore from "../store/mockinterviews";
import { useNavigate } from "react-router-dom";

const PrepareInterviews = () => {
  const navigate = useNavigate();
  const submitInterviewData = useMockInterviewStore(
    (state) => state.submitInterviewData
  );

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    console.log(loading)
    console.log("Button clicked!");
    console.log("Calling submitInterviewData with navigate:", navigate);
    try {
     await submitInterviewData(navigate); 
    } catch (err) {
      console.error("Interview start error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 my-10">
        <h2 className="text-2xl font-bold text-teal-700 text-center mb-2">
          🎤 Mock Interview Panel
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Select your job role, technologies, and customize your interview
          experience.
        </p>

        <div className="mb-6">
          <JobTitleSelection />
        </div>

        <div className="mb-6">
          <ToolSelection />
        </div>

        <div className="mb-6">
          <InterviewSettings />
        </div>

        {/* Button with Spinner */}
        <div className="mt-6 text-center">
          <button
            className={`w-full bg-gradient-to-r from-teal-600 to-blue-500 text-white font-semibold text-lg py-3 rounded-md shadow-md hover:scale-105 transition-all duration-300 flex justify-center items-center ${
              loading ? "cursor-not-allowed opacity-75" : ""
            }`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ color: "white", marginRight: 1 }} />
                Preparing your interview...
              </>
            ) : (
              "🚀 Start Interview"
            )}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrepareInterviews;
