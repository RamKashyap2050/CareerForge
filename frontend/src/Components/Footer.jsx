import React from "react";
import { Box, Typography, Link, Grid } from "@mui/material";
import { styled } from "@mui/system";

// Styled component for footer background color
const FooterContainer = styled(Box)({
  backgroundColor: "#00796b", // Teal green
  color: "#ffffff", // White text color
  padding: "40px 20px",
  position: "relative",
  bottom: 0,
  width: "100%",
  textAlign: "center",
});

const FooterLink = styled(Link)({
  color: "#ffffff", // White text for links
  textDecoration: "none",
  margin: "0 10px",
  "&:hover": {
    color: "#000000", // Black text on hover
  },
});

const Footer = () => {
  return (
    <FooterContainer>
      <Grid container spacing={2}>
        {/* Left Side: Branding and Info */}
        <Grid item xs={12} md={6} textAlign="left">
          <Typography variant="h5" fontWeight="bold">
            Career Forge
          </Typography>
          <Typography variant="body2" mt={2}>
            Your pathway to the next great job opportunity. Build, refine, and
            optimize resumes powered by AI. Transform your job search with ease.
            Tailored resumes. Curated job listings. All in one place. Transform
            your job search with ease. Tailored resumes. Curated job listings.
            All in one place.
          </Typography>
          <Typography variant="body2" mt={1}></Typography>
        </Grid>

        {/* Right Side: Links */}
        <Grid item xs={12} md={6} textAlign="right">
          <Typography variant="h6" fontWeight="bold">
            Quick Links
          </Typography>
          <FooterLink href="#features">Features</FooterLink>
          <FooterLink href="#about">About Us</FooterLink>
          <FooterLink href="#contact">Contact</FooterLink>
          <FooterLink href="#privacy">Privacy Policy</FooterLink>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Career Forge. All rights reserved.
        </Typography>
      </Box>
    </FooterContainer>
  );
};

export default Footer;
