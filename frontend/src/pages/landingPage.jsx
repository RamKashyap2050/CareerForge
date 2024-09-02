import React from "react";
import { Container, Box, Typography, Button, Grid, Link } from "@mui/material";
import resumeScreenshot from "../home.jpg"; // Add the correct path to your image

const LandingPage = () => {
  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", padding: 4 }}>
      <Box>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 800, // Make the title bold
            color: "#00796b", // Use a distinct color that contrasts with the rest of the text
            fontSize: { xs: "2.5rem", md: "3.5rem" }, // Adjust the size based on the screen size
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", // Add a subtle shadow for depth
          }}
        >
          CareerForge
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{
            mb: 4,
            color: "#333", // Slightly lighter color for the description
            fontWeight: 400, // Normal font weight for the description
            fontSize: { xs: "1rem", md: "1.25rem" }, // Adjust the font size for different screen sizes
          }}
        >
          Create a professional resume in minutes with our AI-powered builder.
          Harness the intelligence of advanced algorithms to craft a standout
          resume that not only meets market standards but also beats ATS
          systems, ensuring your application gets noticed.
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{
            padding: "12px 24px",
            fontSize: "16px",
            borderRadius: 2,
            backgroundColor: "#00796b", // Dark teal color
            color: "#fff", // White text for contrast
            fontWeight: 700, // Make the text bold
            textTransform: "none", // Keep the text case as it is
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Add a soft shadow
            "&:hover": {
              backgroundColor: "#004d40", // Darker teal on hover
              boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)", // Increase shadow on hover
            },
            "&:active": {
              backgroundColor: "#00332e", // Even darker teal on click
            },
          }}
          href="/signup"
        >
          Build your resume now
        </Button>
      </Box>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <img
          src={resumeScreenshot}
          alt="Resume Builder Interface"
          style={{
            width: "100%",
            // maxWidth: "900px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
      </Box>
    </Container>
  );
};

export default LandingPage;
