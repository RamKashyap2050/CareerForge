import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Typography } from "@mui/material";

const ResumeList = ({ onNewResume, onPrint, onDownload }) => {
  const [resumes, setResumes] = useState([]);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    axios
      .get("/resumes")
      .then((response) => {
        setResumes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching resumes:", error);
      });
  }, []);

  return (
    <div style={{ marginTop: "2rem" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          My Resumes
        </Typography>

        <Button
          variant="contained"
          size="medium"
          sx={{
            backgroundColor: hover ? "#424242" : "#333333",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
          onClick={onNewResume}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Create New Resume
        </Button>
      </Box>

      {/* Only map resumes if they exist */}
      {resumes.length > 0 && (
        <ul>
          {resumes.map((resume) => (
            <li key={resume.id}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <button onClick={() => onPrint(resume.id)}>🖨️ Print</button>
                  {resume.status === "completed" && (
                    <button onClick={() => onDownload(resume.id)}>
                      📥 Download
                    </button>
                  )}
                </div>
                <span>{resume.name || "Untitled Resume"}</span>
                {resume.status === "draft" ? (
                  <span style={{ fontStyle: "italic", color: "orange" }}>
                    Draft
                  </span>
                ) : (
                  <span style={{ fontStyle: "italic", color: "green" }}>
                    Completed
                  </span>
                )}
                <div>
                  <button>Edit</button>
                  <button>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Optionally, you can add a message if no resumes exist */}
      {resumes.length === 0 && (
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          No resumes available. Please create a new resume.
        </Typography>
      )}
    </div>
  );
};

export default ResumeList;
