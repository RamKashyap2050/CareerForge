// JobListings.js
import React, { useState } from "react";
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

const jobData = [
  {
    id: 1,
    title: "Full Stack Developer",
    company: "Company A",
    location: "Remote",
    description:
      "Developing backend services and frontend UI with React and NodeJS.",
  },
  {
    id: 2,
    title: "Java Full Stack Developer",
    company: "Company B",
    location: "Vancouver, Canada",
    description: "Developing with Spring Boot and React.",
  },
  // Add more job listings here...
];

const JobListings = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  return (
    <>
      <Navbar />
      <Filters />
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
            {jobData.map((job) => (
              <Grid item xs={12} key={job.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#e3f2fd" },
                  }}
                  onClick={() => handleJobClick(job)}
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
            ))}
          </Grid>
        </Box>

        {/* Right Side - Job Details */}
        <Box width="50%" p={4}>
          {selectedJob ? (
            <Card>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {selectedJob.title}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  {selectedJob.company} - {selectedJob.location}
                </Typography>
                <Typography variant="body1" mt={2}>
                  {selectedJob.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 4 }}
                  onClick={() => window.alert("Apply button clicked!")}
                >
                  Apply Now
                </Button>
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
