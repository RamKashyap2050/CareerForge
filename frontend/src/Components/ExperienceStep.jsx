import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const ExperienceStep = ({
  experiences,
  setResumeData,
  resumeData,
  onNext,
  onBack,
}) => {
  console.log("Experiences are", experiences);
  const [newExperience, setNewExperience] = useState({
    companyName: "",
    startDate: "",
    endDate: "",
    occupation: "",
    summary: "",
    currentlyWorking: false,
  });

  const [suggestedDuties, setSuggestedDuties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const handleDeleteExperience = async (id) => {
    try {
      const updatedExperiences = experiences.filter((exp) => exp.id !== id);

      setNewExperience(updatedExperiences);

      const response = await axios.delete(`/resume/deleteresumeexperience/${id}`);

      console.log("Deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting experience:", error);
      setNewExperience((prevExperiences) => [
        ...prevExperiences,
        experiences.find((exp) => exp.id === id),
      ]);
    }
  };
  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setNewExperience({ ...newExperience, [name]: value });
  };

  const handleCurrentlyWorkingChange = () => {
    setNewExperience((prevExperience) => ({
      ...prevExperience,
      currentlyWorking: !prevExperience.currentlyWorking,
      endDate: prevExperience.currentlyWorking
        ? "Present"
        : prevExperience.endDate, // Clear end date if currently working
    }));
  };

  const handleAddExperience = async () => {
    try {
      const savedResumeId = JSON.parse(localStorage.getItem("resumeId"));
      console.log("New Experience in Experience Step", newExperience);
      const response = await axios.put(
        "/resume/resume-experience",
        {
          resumeId: savedResumeId, // Pass the resume ID if it's available
          experience: newExperience, // Pass the new experience data
        },
        { withCredentials: true } // Ensure cookies are sent
      );

      // Update frontend data with the new or updated experience
      setResumeData({
        ...resumeData,
        experiences: [...resumeData.experiences, newExperience],
      });

      // Clear form fields
      setNewExperience({
        companyName: "",
        startDate: "",
        endDate: "",
        occupation: "",
        summary: "",
        currentlyWorking: false,
      });

      console.log("Response:", response.data.message);
    } catch (error) {
      console.error("Error adding experience:", error);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(`/users/getexperience`, {
          params: { title: value },
        });

        let dutiesArray = response.data.duties || "";

        if (typeof dutiesArray === "string") {
          dutiesArray = dutiesArray
            .split("\n")
            .map((duty) => duty.replace(/\*\*/g, "").trim()) // Remove ** and trim whitespace
            .filter((duty) => duty.length > 0); // Filter out empty duties
        }

        setSuggestedDuties(dutiesArray);
      } catch (error) {
        console.error("Error fetching job duties:", error);
        setSuggestedDuties([]); // Clear suggestions on error
      }
    } else {
      setSuggestedDuties([]); // Clear suggestions if search term is too short
    }
  };

  const handleDutyAdd = (duty) => {
    setNewExperience({
      ...newExperience,
      summary: `${newExperience.summary}\n${duty}`,
    });
  };

  return (
    <Grid container spacing={4} style={{ marginTop: "20px" }}>
      {/* Left Side: Add Experience Form */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px" }}>
          <Typography variant="h5" gutterBottom>
            Add Experience
          </Typography>
          <TextField
            label="Company Name"
            name="companyName"
            value={newExperience.companyName}
            onChange={handleExperienceChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                value={newExperience.startDate}
                onChange={handleExperienceChange}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              {!newExperience.currentlyWorking && (
                <TextField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={newExperience.endDate}
                  onChange={handleExperienceChange}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                />
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newExperience.currentlyWorking}
                    onChange={handleCurrentlyWorkingChange}
                  />
                }
                label="Currently Working Here"
                style={{
                  marginTop: newExperience.currentlyWorking ? "15px" : "0",
                }}
              />
            </Grid>
          </Grid>
          <TextField
            label="Occupation"
            name="occupation"
            value={newExperience.occupation}
            onChange={handleExperienceChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Experience Summary"
            name="summary"
            value={newExperience.summary}
            onChange={handleExperienceChange}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddExperience}
            fullWidth
            style={{ marginTop: "20px", padding: "10px 0" }}
          >
            Add Experience
          </Button>
        </Paper>
      </Grid>

      {/* Right Side: Experience Summary and Search Job Duties */}
      <Grid item xs={12} md={6}>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "14px",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Search Job Duties
          </Typography>
          <TextField
            label="Search for Job Duties"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Enter job title"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <List style={{ maxHeight: "200px", overflow: "auto" }}>
            {suggestedDuties.map((duty, index) => (
              <ListItem button key={index} onClick={() => handleDutyAdd(duty)}>
                <ListItemText primary={duty} />
              </ListItem>
            ))}
          </List>
        </Paper>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Experience Summary
          </Typography>
          <List style={{ maxHeight: "200px", overflow: "auto" }}>
            {/* Check if experiences is an array */}
            {Array.isArray(experiences) && experiences.length > 0
              ? experiences.map((experience, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteExperience(experience.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${
                        experience.companyName || experience.CompanyName || ""
                      } - ${
                        experience.RoleTitle || experience.occupation || ""
                      } (${
                        experience.startDate || experience.StartDate
                          ? new Date(
                              experience.startDate || experience.StartDate
                            ).toLocaleDateString()
                          : " "
                      } - ${
                        experience.endDate === null ||
                        experience.EndDate === null
                          ? "Present"
                          : experience.endDate
                          ? new Date(experience.endDate).toLocaleDateString()
                          : "Present"
                      })`}
                      secondary={
                        experience.summary ||
                        experience.ExperienceSummary ||
                        " "
                      }
                    />
                  </ListItem>
                ))
              : // Handle case where experiences is a single object
                experiences && (
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteExperience(experiences.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${
                        experiences.companyName ||
                        experiences.CompanyName ||
                        " "
                      } - ${
                        experiences.occupation || experiences.RoleTitle || " "
                      } (${
                        experiences.startDate || experiences.StartDate
                          ? new Date(
                              experiences.startDate || experiences.StartDate
                            ).toLocaleDateString()
                          : " "
                      } - ${
                        experiences.endDate === null ||
                        experiences.EndDate === null
                          ? "Present"
                          : experiences.endDate
                          ? new Date(experiences.endDate).toLocaleDateString()
                          : " "
                      })`}
                      secondary={
                        experiences.summary ||
                        experiences.ExperienceSummary ||
                        " "
                      }
                    />
                  </ListItem>
                )}

            {/* If there are no experiences at all */}
            {(!experiences || experiences.length === 0) && (
              <ListItem>
                <ListItemText primary="No experience available" />
              </ListItem>
            )}

            {/* For the new experience being added */}
            {newExperience.CompanyName && (
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteExperience(newExperience.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${newExperience.CompanyName || " "} - ${
                    newExperience.RoleTitle || " "
                  } (${newExperience.startDate || " "} - ${
                    newExperience.currentlyWorking || " "
                      ? "Present"
                      : newExperience.endDate
                  })`}
                  secondary={newExperience.summary || ""}
                />
              </ListItem>
            )}
          </List>
          <Box display="flex" justifyContent="space-between" marginTop="20px">
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
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ExperienceStep;
