import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Box,
  List,
  FormControlLabel,
  ListItem,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const degreeOptions = [
  "AEC",
  "DEC",
  "Bachelors",
  "Masters",
  "Doctorate",
  "Post Grad Diploma",
  "Other",
];

const EducationStep = ({ education, setEducation, onNext, onBack }) => {
  const [newEducation, setNewEducation] = useState({
    instituteName: "",
    startDate: "",
    endDate: "",
    currentlyEnrolled: false,
    degreeType: "",
    gradesAchievements: "",
  });

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEducationChange = (e) => {
    try {
      const { name, value } = e.target;
      setNewEducation({ ...newEducation, [name]: value });
      setHasError(false);
      setErrorMessage("");
    } catch (error) {
      setHasError(true);
      setErrorMessage("An error occurred while updating education data.");
      console.error("Error during education change:", error);
    }
  };

  const handleCheckboxChange = () => {
    try {
      setNewEducation({
        ...newEducation,
        currentlyEnrolled: !newEducation.currentlyEnrolled,
        endDate: "",
      });
      setHasError(false);
      setErrorMessage("");
    } catch (error) {
      setHasError(true);
      setErrorMessage("An error occurred while updating checkbox data.");
      console.error("Error during checkbox change:", error);
    }
  };

  const handleQuillChange = (value) => {
    try {
      setNewEducation({ ...newEducation, gradesAchievements: value });
      setHasError(false);
      setErrorMessage("");
    } catch (error) {
      setHasError(true);
      setErrorMessage("An error occurred while updating rich text data.");
      console.error("Error during Quill change:", error);
    }
  };

  const handleAddEducation = (e) => {
    e.preventDefault();
    try {
      setEducation([...education, newEducation]);
      setNewEducation({
        instituteName: "",
        startDate: "",
        endDate: "",
        currentlyEnrolled: false,
        degreeType: "",
        gradesAchievements: "",
      });
      setHasError(false);
      setErrorMessage("");
    } catch (error) {
      setHasError(true);
      setErrorMessage("An error occurred while adding education data.");
      console.error("Error adding education:", error);
    }
  };

  return (
    <Grid container spacing={4} style={{ marginTop: "20px" }}>
      {/* Left Side: Add Education Form */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px" }}>
          <Typography variant="h5" gutterBottom>
            Add Education
          </Typography>
          {hasError && (
            <>
              <Typography color="error" gutterBottom>
                {errorMessage} You can navigate back or forward to fix it.
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                marginTop="20px"
              >
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
            </>
          )}
          <form onSubmit={handleAddEducation}>
            <TextField
              label="Institute Name"
              name="instituteName"
              value={newEducation.instituteName}
              onChange={handleEducationChange}
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
                  value={newEducation.startDate}
                  onChange={handleEducationChange}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                {!newEducation.currentlyEnrolled && (
                  <TextField
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={newEducation.endDate}
                    onChange={handleEducationChange}
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                  />
                )}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newEducation.currentlyEnrolled}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Currently Enrolled"
                  style={{
                    marginTop: newEducation.currentlyEnrolled ? "15px" : "0",
                  }}
                />
              </Grid>
            </Grid>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Degree Type</InputLabel>
              <Select
                name="degreeType"
                value={newEducation.degreeType}
                onChange={handleEducationChange}
                label="Degree Type"
              >
                {degreeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography
              variant="body1"
              gutterBottom
              style={{ marginTop: "20px" }}
            >
              Grades and Achievements
            </Typography>
            <ReactQuill
              value={newEducation.gradesAchievements}
              onChange={handleQuillChange}
              style={{ height: "150px", marginBottom: "20px" }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "20px", padding: "10px 0" }}
            >
              Add Education
            </Button>
          </form>
        </Paper>
      </Grid>

      {/* Right Side: Education Summary */}
      <Grid item xs={12} md={6}>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Education Summary
          </Typography>
          <List style={{ maxHeight: "300px", overflow: "auto" }}>
            {Array.isArray(education) &&
              education.map((edu, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${edu.instituteName} - ${edu.degreeType} (${
                      edu.startDate
                    } - ${edu.currentlyEnrolled ? "Present" : edu.endDate})`}
                    secondary={
                      <div
                        dangerouslySetInnerHTML={{
                          __html: edu.gradesAchievements,
                        }}
                      />
                    }
                  />
                </ListItem>
              ))}
          </List>
        </Paper>
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
      </Grid>
    </Grid>
  );
};

export default EducationStep;
