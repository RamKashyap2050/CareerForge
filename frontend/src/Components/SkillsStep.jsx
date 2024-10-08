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
  CircularProgress,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
let typingTimer;

const SkillsStep = ({
  skills,
  onSkillAdd,
  onNext,
  onBack,
  modifyOrDeleteSkill,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [editorContent, setEditorContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize the editor content based on the skills passed from the parent
  useEffect(() => {
    const formattedSkills = skills.length
      ? `<ul>${skills.map((skill) => `<li>${skill}</li>`).join("")}</ul>`
      : "";
    setEditorContent(formattedSkills);
  }, [skills]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear the previous timer if the user is still typing
    clearTimeout(typingTimer);

    // Only make the API call if the input has 3 or more characters
    if (value.length > 2) {
      // Set loading to true as we are waiting for the API call
      setLoading(true);

      // Start a new timer, wait 4 seconds after the user stops typing
      typingTimer = setTimeout(async () => {
        try {
          // Make the API request after the debounce period
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
        } catch (error) {
          console.error("Error fetching skills:", error);
          setSuggestedSkills([]);
        } finally {
          setLoading(false);
        }
      }, 3500); // Delay of 4000 milliseconds (4 seconds)
    } else {
      // If input has fewer than 3 characters, clear the suggestions
      setSuggestedSkills([]);
    }
  };

  const handleSkillAdd = (skill) => {
    const newContent = `${editorContent}<li>${skill}</li>`;
    setEditorContent(newContent);
    onSkillAdd(skill); // This updates the skills in the parent
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleNext = async () => {
    // Parse the editor content to extract the list of skills
    const parser = new DOMParser();
    const doc = parser.parseFromString(editorContent, "text/html");
    const updatedSkills = Array.from(doc.querySelectorAll("li")).map((li) =>
      li.textContent.trim()
    );

    console.log("Updated skills from editor:", updatedSkills); // Debugging

    // Update the parent component's state with the final list of skills
    modifyOrDeleteSkill(updatedSkills);

    try {
      const savedResumeId = JSON.parse(localStorage.getItem("resumeId"));

      const response = await axios.put(
        "/resume/resume-skills", // Ensure this matches your route
        {
          resumeId: savedResumeId,
          skills: updatedSkills, // Send the updated skills array
        },
        {
          withCredentials: true,
        }
      );

      console.log("Skills updated successfully:", response.data);
      onNext(); // Move to the next step after successfully saving
    } catch (error) {
      console.error("Error updating skills:", error);
      alert("There was an error updating your skills. Please try again.");
    }
  };

  return (
    <Grid container spacing={4} style={{ padding: "30px" }}>
      <Grid item xs={12} md={8}>
        <Paper elevation={6} style={{ padding: "20px", minHeight: "500px" }}>
          <Typography variant="h6">Edit Your Skills</Typography>
          <ReactQuill
            value={editorContent}
            onChange={handleEditorChange}
            modules={quillModules}
            formats={quillFormats}
            style={{ height: "300px", marginBottom: "20px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              onClick={onBack}
              style={{ marginRight: "10px" }}
            >
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          </div>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
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
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <List
              className="hide-scrollbar"
              style={{ maxHeight: "350px", overflow: "auto" }}
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
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

// Quill modules and formats (as before)
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
