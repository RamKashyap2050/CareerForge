import React from "react";
import { Typography, Box } from "@mui/material";
import DOMPurify from "dompurify";

const PaperComponent = ({ content, resumeData, style }) => {
  const styles = {
    paper: {
      backgroundColor: "#ffffff",
      padding: "10px",
      width: "100%",
      margin: "0 auto",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", // Enhanced shadow
      borderRadius: "10px",
      minHeight: "600px",
      position: "relative",
      zIndex: 1,
      fontFamily: "'Roboto', sans-serif",
      lineHeight: "1.6",
      ...style, // Spread custom style prop
    },
    section: {
      marginBottom: "30px",
    },
    heading: {
      fontSize: "1rem",
      fontWeight: "bold",
      color: "#333333",
      margin: "auto",
      textAlign: "center", // Corrected the property name
    },
    stepContent: {
      marginBottom: "20px",
      paddingLeft: "15px",
      //   borderLeft: "4px solid #00796b",
      fontSize: "0.8rem", // Consistent font size for body text
    },
    separator: {
      border: "none",
      borderTop: "2px solid #e0e0e0",
      margin: "20px 0",
    },
  };

  return (
    <div id="resumeContent" style={styles.paper}>
      {content.map((step, index) => (
        <Box key={index} style={styles.section}>
          <Typography variant="h6" style={styles.heading}>
            {getSectionTitle(index, resumeData)} {/* Adds section title */}
          </Typography>
          <Typography
            variant="body1"
            style={styles.stepContent}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(step) }} // Sanitizes the HTML content
          />
          {index < content.length - 1 && <hr style={styles.separator} />}
        </Box>
      ))}
    </div>
  );
};

// Helper function to determine section titles
const getSectionTitle = (index, resumeData) => {
  switch (index) {
    case 0:
      return `${resumeData.bio.firstName || resumeData.bio.FirstName} ${resumeData.bio.lastName || resumeData.bio.LastName}`;
    case 1:
      return "Professional Summary";
    case 2:
      return "Skills";
    case 3:
      return "Experience";
    case 4:
      return "Education";
    default:
      return "";
  }
};

export default PaperComponent;
