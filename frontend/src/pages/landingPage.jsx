import React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Avatar,
} from "@mui/material";

// Header component with CTA button
const Header = () => (
  <header style={{ padding: "1rem 0", backgroundColor: "#004d40" }}>
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h5" style={{ color: "#fff", fontWeight: "bold" }}>
        ResumePro
      </Typography>
      <ul
        style={{
          display: "flex",
          listStyle: "none",
          gap: "1.5rem",
          margin: 0,
          padding: 0,
          flexWrap: "wrap", // For responsive wrapping
        }}
      >
        <li>
          <a
            href="#features"
            style={{ color: "#fff", textDecoration: "none", fontSize: "1rem" }}
          >
            Features
          </a>
        </li>
        <li>
          <a
            href="#pricing"
            style={{ color: "#fff", textDecoration: "none", fontSize: "1rem" }}
          >
            Pricing
          </a>
        </li>
        <li>
          <a
            href="#testimonials"
            style={{ color: "#fff", textDecoration: "none", fontSize: "1rem" }}
          >
            Testimonials
          </a>
        </li>
        <li>
          <a
            href="#contact"
            style={{ color: "#fff", textDecoration: "none", fontSize: "1rem" }}
          >
            Contact
          </a>
        </li>
      </ul>
      <Button
        variant="contained"
        style={{
          backgroundColor: "#fff",
          color: "#004d40",
          fontWeight: "bold",
          textTransform: "none",
        }}
      >
        Sign Up
      </Button>
    </nav>
  </header>
);

// Hero section with tagline and CTA
const Hero = () => (
  <section
    style={{
      padding: "4rem 1.5rem",
      textAlign: "center",
      backgroundColor: "#e0f2f1",
    }}
  >
    <Container maxWidth="md">
      <Typography
        variant="h3"
        style={{ fontWeight: 700, marginBottom: "1.5rem", color: "#004d40" }}
      >
        Build Your Perfect Resume in Minutes!
      </Typography>
      <Typography
        variant="h6"
        style={{ marginBottom: "2rem", color: "#004d40" }}
      >
        AI-powered, ATS-friendly resumes tailored to each job listing.
      </Typography>
      <Button
        variant="contained"
        size="large"
        style={{
          padding: "12px 24px",
          backgroundColor: "#004d40",
          color: "#fff",
          fontWeight: "bold",
          textTransform: "none",
        }}
        href="/login"
      >
        Create My Resume Now
      </Button>
    </Container>
  </section>
);

// Features section
const Features = () => (
  <section
    id="features"
    style={{ padding: "4rem 1.5rem", backgroundColor: "#fff" }}
  >
    <Container maxWidth="lg" style={{ textAlign: "center" }}>
      <Typography
        variant="h4"
        style={{ fontWeight: 700, marginBottom: "2rem", color: "#004d40" }}
      >
        Features
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Typography
            variant="h6"
            style={{ fontWeight: 700, marginBottom: "1rem", color: "#004d40" }}
          >
            AI-Generated Resumes
          </Typography>
          <Typography>
            Our AI creates a tailored resume that matches the job description in
            minutes.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography
            variant="h6"
            style={{ fontWeight: 700, marginBottom: "1rem", color: "#004d40" }}
          >
            ATS-Friendly
          </Typography>
          <Typography>
            Ensure your resume gets past the filters with optimized formatting.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography
            variant="h6"
            style={{ fontWeight: 700, marginBottom: "1rem", color: "#004d40" }}
          >
            Automated Job Applications
          </Typography>
          <Typography>
            Let our system apply for jobs on your behalf once activated.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography
            variant="h6"
            style={{ fontWeight: 700, marginBottom: "1rem", color: "#004d40" }}
          >
            Real-Time Dashboard
          </Typography>
          <Typography>
            Track your job applications in real-time with a clear, user-friendly
            dashboard.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  </section>
);

const Testimonials = () => (
  <section
    id="testimonials"
    style={{
      padding: "4rem 1.5rem",
      textAlign: "center",
      backgroundColor: "#f5f5f5",
    }}
  >
    <Container maxWidth="md">
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          marginBottom: "2rem",
          color: "#004d40",
        }}
      >
        What Our Users Say
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* User Image */}
            <Avatar
              alt="John D."
              src="/path-to-john-image.jpg" // Replace with actual image path
              sx={{
                width: 80,
                height: 80,
                marginBottom: 2,
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
              }}
            />
            {/* User Testimonial */}
            <Typography variant="body1" sx={{ fontStyle: "italic", mb: 1 }}>
              "I landed my dream job thanks to CareerForge!"
            </Typography>
            {/* User Name */}
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "#00796b" }}
            >
              - John D.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* User Image */}
            <Avatar
              alt="Sarah K."
              src="/path-to-sarah-image.jpg" // Replace with actual image path
              sx={{
                width: 80,
                height: 80,
                marginBottom: 2,
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
              }}
            />
            {/* User Testimonial */}
            <Typography variant="body1" sx={{ fontStyle: "italic", mb: 1 }}>
              "Fast, efficient, and reliable. The best resume builder out
              there."
            </Typography>
            {/* User Name */}
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "#00796b" }}
            >
              - Sarah K.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* User Image */}
            <Avatar
              alt="Emily R."
              src="/path-to-emily-image.jpg" // Replace with actual image path
              sx={{
                width: 80,
                height: 80,
                marginBottom: 2,
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
              }}
            />
            {/* User Testimonial */}
            <Typography variant="body1" sx={{ fontStyle: "italic", mb: 1 }}>
              "This tool helped me apply to multiple jobs with ease!"
            </Typography>
            {/* User Name */}
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "#00796b" }}
            >
              - Emily R.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </section>
);
// Pricing section
const Pricing = () => (
  <section id="pricing" style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
    <Container maxWidth="md">
      <Typography
        variant="h4"
        style={{ fontWeight: 700, marginBottom: "2rem", color: "#004d40" }}
      >
        Pricing
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="h6"
            style={{ fontWeight: 700, marginBottom: "1rem", color: "#004d40" }}
          >
            Basic
          </Typography>
          <Typography>Free resume builder with limited features.</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="h6"
            style={{ fontWeight: 700, marginBottom: "1rem", color: "#004d40" }}
          >
            Premium
          </Typography>
          <Typography>
            All features unlocked, including job applications and the real-time
            dashboard.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  </section>
);

// Main Landing Page component
const landingPage = () => {
  return (
    <Container maxWidth={false} disableGutters>
      <Hero />
      <Features />
      <Testimonials />
    </Container>
  );
};

export default landingPage;
