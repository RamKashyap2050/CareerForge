// ✅ Updated JobListings UI with Responsive & Scrollable Right Panel
import React, { useState } from "react";
import axios from "axios";
import Filters from "../Components/Filters";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const JobListings = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleJobClick = async (job) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/scrapping/jobDetails?url=${encodeURIComponent(
          job.url
        )}&jobSite=${encodeURIComponent(job.jobSite)}`
      );

      setSelectedJob({ ...job, ...response.data.data });
    } catch (error) {
      console.error("Error fetching job details:", error);
      setSelectedJob(null);
    } finally {
      setLoading(false);
    }
  };

  const handleJobListingsFetched = (data) => {
    setJobData(data.data);
  };

  return (
    <>
      <Navbar />
      <Filters onJobListingsFetched={handleJobListingsFetched} />
      <div className="flex flex-col md:flex-row h-[calc(100vh-180px)] bg-gray-100">
        {/* Left Side */}
        <div className="w-full md:w-1/2 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-300 p-6 bg-white shadow-inner">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Listings</h2>
          <div className="space-y-4">
            {jobData.length > 0 ? (
              jobData.map((job) => (
                <div
                  key={job.id || job.url}
                  className="p-4 bg-gray-50 border border-gray-300 rounded-lg shadow cursor-pointer hover:bg-blue-100 transition"
                  onClick={() => handleJobClick(job)}
                >
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">
                    {job.company} - {job.location}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No job listings found. Adjust filters and try again.</p>
            )}
          </div>
        </div>

        {/* Right Side - Job Details */}
        <div className={`w-full md:w-1/2 bg-white border-t md:border-t-0 md:border-l border-gray-300 overflow-y-auto transition-all duration-300 ${selectedJob ? "block" : "hidden md:block"}`}>
          {selectedJob ? (
            <div className="p-6 max-w-3xl mx-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">{selectedJob.title}</h2>
                  <h3 className="text-xl text-gray-700">{selectedJob.company} - {selectedJob.location}</h3>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700 md:hidden"
                  onClick={() => setSelectedJob(null)}
                >✖️</button>
              </div>

              <div className="mb-4">
                <p className="text-gray-800"><strong>Job Type:</strong> {selectedJob.jobType || "Not specified"}</p>
                <p className="text-gray-800 mt-2"><strong>Pay:</strong> {selectedJob.pay || "Not specified"}</p>
                {selectedJob.skills && (
                  <p className="text-gray-800 mt-2"><strong>Skills:</strong> {selectedJob.skills}</p>
                )}
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Job Description</h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {selectedJob.jobDescription ? (
                    selectedJob.jobDescription.split("\n").map((line, index) => (
                      <p key={index} className="text-gray-700 text-sm">{line}</p>
                    ))
                  ) : (
                    <p className="text-gray-600">No description available.</p>
                  )}
                </div>
              </div>

              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900">Benefits</h3>
                  <ul className="list-disc pl-6 text-gray-700">
                    {Array.isArray(selectedJob.benefits)
                      ? selectedJob.benefits.map((benefit, index) => <li key={index}>{benefit}</li>)
                      : <li>{selectedJob.benefits}</li>}
                  </ul>
                </div>
              )}

              <div className="mt-6">
                <button
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg shadow hover:scale-105 transition"
                  onClick={() => window.open(selectedJob.url, "_blank")}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-gray-500 text-center">Select a job to see details</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobListings;
