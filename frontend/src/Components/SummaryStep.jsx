import React from "react";
import { Button, Grid } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles for Quill

const SummaryStep = ({ summary, onSummaryChange, onNext }) => {
  const handleSummaryChange = (value) => {
    onSummaryChange({ target: { value } });
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
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={onNext}
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
