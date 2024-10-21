import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Grid,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const Filters = ({ onJobListingsFetched }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // for mobile responsiveness

  const handleFilterChange = async () => {
    const filters = { jobTitle, location };

    try {
      const response = await axios.post(`/scrapping/scrape-jobs`, filters);
      if (onJobListingsFetched) {
        onJobListingsFetched(response.data);
      }
    } catch (error) {
      console.error("Error fetching job listings:", error);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: "12px",
        width: "100%",
        maxWidth: "800px", // Limit max width
        margin: "0 auto", // Center the filter box
      }}
    >
      <Grid
        container
        spacing={isSmallScreen ? 2 : 3}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Job Title Filter */}
        <Grid item xs={12} sm={5}>
          <TextField
            label="Job Title"
            variant="outlined"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Full Stack Developer"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Grid>

        {/* Location Filter */}
        <Grid item xs={12} sm={5}>
          <TextField
            label="Location"
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Montreal, Remote"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Grid>

        {/* Apply Filters Button */}
        <Grid item xs={12} sm={2} sx={{ textAlign: isSmallScreen ? "center" : "right" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFilterChange}
            sx={{
              backgroundColor: "#3b82f6", // Modern blue color
              "&:hover": {
                backgroundColor: "#2563eb", // Darker on hover
              },
            }}
          >
            Apply
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Filters;

