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
        `/scrapping/jobDetails?url=${encodeURIComponent(job.url)}&jobSite=${encodeURIComponent(job.jobSite)}`
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

  return (
    <>
      <Navbar />
      {/* Pass the callback function to Filters */}
      <Filters onJobListingsFetched={handleJobListingsFetched} />
      <Box display="flex" height="100vh">
        {/* Left Side - Job Listings */}
        <Box
          width="50%"
          overflow="auto"
          borderRight="1px solid #ddd"
          bgcolor="#f4f6f8"
          p={2}
        >
          <Typography variant="h5" gutterBottom>
            Job Listings
          </Typography>
          <Grid container spacing={2}>
            {jobData.length > 0 ? (
              jobData.map((job) => (
                <Grid item xs={12} key={job.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#e3f2fd" },
                    }}
                    onClick={() => handleJobClick(job)} // Fetch job details on click
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">
                        {job.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {job.company} - {job.location}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1">
                No job listings found. Please adjust your filters and try again.
              </Typography>
            )}
          </Grid>
        </Box>
        <Box width="50%" p={4}>
          {loading ? (
            <Typography variant="h6" color="textSecondary">
              Loading job details...
            </Typography>
          ) : selectedJob ? (
            <Card>
              <CardContent>
                {/* Job Title and Company */}
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {selectedJob.title}
                  {console.log(selectedJob.title)}
                </Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {selectedJob.company} - {selectedJob.location}
                </Typography>

                {/* Job Type */}
                <Typography variant="body1" mt={2}>
                  <strong>Job Type:</strong>{" "}
                  {selectedJob.jobType || "Not specified"}
                </Typography>
                {/* Apply Button */}
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 4 }}
                  onClick={() => window.open(selectedJob.url, "_blank")} // Open the job URL in a new tab
                >
                  Apply Now
                </Button>

                {/* Job Description */}
                <Typography variant="body1" mt={2}>
                  <strong>Job Description:</strong>
                </Typography>
                {selectedJob.jobDescription
                  ? selectedJob.jobDescription
                      .split("\n")
                      .map((line, index) => (
                        <Typography key={index} variant="body2" style={{fontSize:"1rem"}} mt={1}>
                          {line}
                        </Typography>
                      ))
                  : "No description available."}

                {/* Skills */}
                {selectedJob.skills && (
                  <Typography variant="body1" mt={2}>
                    <strong>Skills:</strong> {selectedJob.skills}
                  </Typography>
                )}
                {/* Pay Information */}
                <Typography variant="body1" mt={2}>
                  <strong>Pay:</strong> {selectedJob.pay || "Not specified"}
                  {console.log(selectedJob.pay)}
                </Typography>
                {/* Benefits */}
                {Array.isArray(selectedJob) &&
                  selectedJob.benefits &&
                  selectedJob.benefits.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="body1">
                        <strong>Benefits:</strong>
                      </Typography>
                      <ul>
                        {selectedJob.benefits.map((benefit, index) => (
                          <li key={index}>
                            <Typography variant="body2">{benefit}</Typography>
                          </li>
                        ))}
                      </ul>
                    </Box>
                  )}
              </CardContent>
            </Card>
          ) : (
            <Typography variant="h6" color="textSecondary">
              Select a job to see the details.
            </Typography>
          )}
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default JobListings;
