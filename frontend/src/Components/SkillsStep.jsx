import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const SkillsStep = ({ skills, onSkillAdd, onNext, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    // Convert the skills array into an unordered list
    const formattedSkills = skills.length
      ? `<ul>${skills.map((skill) => `<li>${skill}</li>`).join("")}</ul>`
      : "";
    setEditorContent(formattedSkills);
  }, [skills]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(`/users/getskills`, {
          params: { prompt: value },
        });

        const skillsString = response.data.skills || "";

        const skillsArray = skillsString
          .split("\n")
          .map((skill) => skill.replace(/^[\*\#\s]*-*\s*/, "").trim())
          .filter(
            (skill) =>
              skill.length > 0 &&
              !skill.toLowerCase().startsWith("note") &&
              !skill.toLowerCase().includes("you mean")
          );

        setSuggestedSkills(skillsArray);
        console.log(skillsArray);
      } catch (error) {
        console.error("Error fetching skills:", error);
        setSuggestedSkills([]);
      }
    } else {
      setSuggestedSkills([]);
    }
  };

  const handleSkillAdd = (skill) => {
    if (!skills.includes(skill)) {
      onSkillAdd(skill);
    }
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  return (
    <Grid container spacing={4} style={{ padding: "30px" }}>
      {/* Main content area where selected skills are shown */}
      <Grid item xs={12} md={8}>
        {" "}
        {/* Make this section bigger */}
        <Paper elevation={6} style={{ padding: "20px", minHeight: "500px" }}>
          <Typography variant="h6">Edit Your Skills</Typography>
          <ReactQuill
            value={editorContent}
            onChange={handleEditorChange}
            modules={quillModules}
            formats={quillFormats}
            style={{ height: "300px", marginBottom: "20px" }} // Increased height
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              onClick={onBack}
              style={{ marginRight: "10px" }}
            >
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={onNext}>
              Next
            </Button>
          </div>
        </Paper>
      </Grid>

      {/* Sidebar area for skill suggestions */}
      <Grid item xs={12} md={4}>
        {" "}
        {/* Make this section smaller */}
        <Paper elevation={6} style={{ padding: "20px", minHeight: "500px" }}>
          <Typography variant="subtitle1">Search for Skills</Typography>
          <TextField
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search for skills"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <List
            className="hide-scrollbar"
            style={{ maxHeight: "350px", overflow: "auto" }} // Adjusted height for the list
          >
            {Array.isArray(suggestedSkills) && suggestedSkills.length > 0 ? (
              suggestedSkills.map((skill, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => handleSkillAdd(skill)}
                >
                  <ListItemText primary={skill} />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No skills found.
              </Typography>
            )}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

// Quill modules for toolbar customization
const quillModules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

// Quill formats allowed in the editor
const quillFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
];

export default SkillsStep;
