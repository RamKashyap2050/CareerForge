import React, { useState } from "react";
import { Button, Grid } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles for Quill
import axios from "axios";
import MagicIcon from "@mui/icons-material/AutoAwesome"; // Magic symbol icon from MUI

const SummaryStep = ({ summary, onSummaryChange, onNext }) => {
  const [loadingAI, setLoadingAI] = useState(false); // For AI loading state

  const handleSummaryChange = (value) => {
    onSummaryChange({ target: { value } }); // 'value' is the HTML content from Quill
  };

  // Handle AI content generation
  const handleAIClick = async () => {
    const value = summary || "Write a professional summary."; // Default summary prompt
    setLoadingAI(true); // Show loading indicator

    try {
      // Making the API request to fetch AI-generated content
      const response = await axios.get(`/users/getsummary`, {
        params: { prompt: value }, // Passing the prompt to the backend
        withCredentials: true, // Ensure cookies are sent for authentication
      });

      // Process the response from the backend
      const aiGeneratedContent = response.data.summary || ""; // Assuming the response contains 'generatedSummary'

      console.log("AI Response:", aiGeneratedContent);

      // Update the editor's content with the AI-generated summary
      handleSummaryChange(aiGeneratedContent); // No need to create a target object
    } catch (error) {
      console.error("Error generating summary with AI:", error);
      alert("There was an error generating the summary. Please try again.");
    } finally {
      setLoadingAI(false); // Stop the loading indicator
    }
  };

  const handleSubmit = async () => {
    onNext();
    try {
      const savedResumeId = JSON.parse(localStorage.getItem("resumeId"));
      console.log(savedResumeId);

      const response = await axios.put(
        "/resume/resume-summary",
        {
          resumeId: savedResumeId,
          summary,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Response from backend:", response.data);
    } catch (error) {
      console.error("Error submitting summary:", error);
      alert("There was an error submitting your summary. Please try again.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "2rem" }}>Professional Summary</h2>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ReactQuill
            value={summary}
            onChange={handleSummaryChange}
            modules={modules}
            formats={formats}
            placeholder="Enter your professional summary (up to 1000 characters)"
          />
          <p style={{ marginTop: "10px", textAlign: "right" }}>
            {summary.length}/1000 characters
          </p>
        </Grid>

        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            variant="outlined"
            color="primary"
            startIcon={<MagicIcon />} // Add the magic symbol icon
            onClick={handleAIClick}
            disabled={loadingAI} // Disable while loading
          >
            {loadingAI ? "Generating..." : "Write with AI"}
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginTop: "20px" }}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

// Quill modules for toolbar customization
const modules = {
  toolbar: [
    [{ font: [] }, { size: [] }], // Font and size options
    ["bold", "italic", "underline", "strike"], // Bold, italic, underline, strike-through
    [{ color: [] }, { background: [] }], // Text color and background color
    [{ align: [] }], // Text alignment
    ["link"], // Link option
    [{ list: "ordered" }, { list: "bullet" }], // Lists
    ["clean"], // Clear formatting
  ],
};

// Quill formats allowed in the editor
const formats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "align",
  "link",
  "list",
];

export default SummaryStep;
