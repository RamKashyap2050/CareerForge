import React, { useState } from "react";
import axios from "axios"; // Import axios for fetching job details
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
} from "@mui/material";
import Filters from "../Components/Filters";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const JobListings = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobData, setJobData] = useState([]); // Initialize jobData state
  const [loading, setLoading] = useState(false); // Loading state for job details

  // Fetch job details when a job is clicked
  const handleJobClick = async (job) => {
    setLoading(true); // Start loading
    try {
      // Make a request to your backend to scrape job details from the URL
      const response = await axios.get(
        `/scrapping/jobDetails?url=${encodeURIComponent(
          job.url
        )}&jobSite=${encodeURIComponent(job.jobSite)}`
      );

      console.log(response.data.data);
      // Update the selected job with detailed information from the backend
      setSelectedJob({
        ...job, // Keep the existing job info
        ...response.data.data,
      });
      console.log(selectedJob);
    } catch (error) {
      console.error("Error fetching job details:", error);
      setSelectedJob(null); // Reset if error occurs
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Callback function to receive data from Filters component
  const handleJobListingsFetched = (data) => {
    setJobData(data.data); // Set the job listings fetched from the backend
  };
console.log(selectedJob)
  return (
    <>
      <Navbar />
      {/* Pass the callback function to Filters */}
      <Filters onJobListingsFetched={handleJobListingsFetched} />
      <div className="flex flex-col md:flex-row h-screen bg-gray-100">
        {/* Left Side - Job Listings */}
        <div className="w-full md:w-1/2 overflow-auto border-b md:border-b-0 md:border-r border-gray-300 p-6 bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Job Listings
          </h2>
          <div className="space-y-4">
            {jobData.length > 0 ? (
              jobData.map((job) => (
                <div
                  key={job.id}
                  className="p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-md cursor-pointer hover:bg-blue-100 transition"
                  onClick={() => handleJobClick(job)}
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {job.company} - {job.location}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">
                No job listings found. Adjust filters and try again.
              </p>
            )}
          </div>
        </div>

        {/* Right Side - Job Details as a Modal on Mobile */}
        {selectedJob && (
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition ${
              selectedJob ? "visible" : "invisible"
            } md:static md:w-1/2 md:p-6 md:bg-transparent md:shadow-xl md:rounded-lg md:border md:border-gray-300`}
          >
            <div className="bg-white w-11/12 md:w-full p-6 shadow-xl rounded-lg border border-gray-300 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 md:hidden"
                onClick={() => setSelectedJob(null)}
              >
                ✖️
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedJob.title}
              </h2>
              <h3 className="text-xl text-gray-700 mb-4">
                {selectedJob.company} - {selectedJob.location}
              </h3>

              {/* Job Type */}
              <p className="text-gray-800 text-lg">
                <strong>Job Type:</strong>{" "}
                {selectedJob.jobType || "Not specified"}
              </p>

              {/* Apply Button */}
              <button
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition transform"
                onClick={() => window.open(selectedJob.url, "_blank")}
              >
                Apply Now
              </button>

              {/* Job Description */}
              <h3 className="text-xl font-semibold text-gray-900 mt-6">
                Job Description
              </h3>
              {selectedJob.jobDescription ? (
                selectedJob.jobDescription.split("\n").map((line, index) => (
                  <p key={index} className="text-gray-700 text-md mt-2">
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-gray-600">No description available.</p>
              )}

              {/* Skills */}
              {selectedJob.skills && (
                <p className="text-gray-800 mt-4">
                  <strong>Skills:</strong> {selectedJob.skills}
                </p>
              )}

              {/* Pay Information */}
              <p className="text-gray-800 mt-4">
                <strong>Pay:</strong> {selectedJob.pay || "Not specified"}
              </p>

              {/* Benefits */}
              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Benefits
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700">
                    {Array.isArray(selectedJob.benefits) && selectedJob.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default JobListings;
