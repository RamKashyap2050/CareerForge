import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
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

  const handleSubmit = async () => {
    console.log("Button clicked!"); // Add this log
    console.log("Calling submitInterviewData with navigate:", navigate);
    submitInterviewData(navigate);
  };
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 my-10">
        {/* Header Section */}
        <h2 className="text-2xl font-bold text-teal-700 text-center mb-2">
          🎤 Mock Interview Panel
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Select your job role, technologies, and customize your interview
          experience.
        </p>

        {/* Job Title Selection */}
        <div className="mb-6">
          <JobTitleSelection />
        </div>

        {/* Tool Selection */}
        <div className="mb-6">
          <ToolSelection />
        </div>

        {/* Interview Settings */}
        <div className="mb-6">
          <InterviewSettings />
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            className="w-full bg-gradient-to-r from-teal-600 to-blue-500 text-white font-semibold text-lg py-3 rounded-md shadow-md hover:scale-105 transition-all duration-300"
            onClick={handleSubmit}
          >
            🚀 Start Interview
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrepareInterviews;
