import React, { useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  FormGroup,
} from "@mui/material";

const Filters = ({ onFilterChange }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");
  const [salaryRange, setSalaryRange] = useState([50000, 150000]);
  const [datePosted, setDatePosted] = useState("");
  const [remote, setRemote] = useState(false);
  const [skills, setSkills] = useState([]);

  const handleFilterChange = () => {
    const filters = {
      jobTitle,
      location,
      jobType,
      experience,
      salaryRange,
      datePosted,
      remote,
      skills,
    };
    onFilterChange(filters);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      p={2}
      bgcolor="white"
      boxShadow={3}
      borderRadius={4}
      mb={4}
    >
      {/* Job Title Filter */}
      <TextField
        label="Job Title"
        variant="outlined"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        placeholder="Full Stack Developer"
        sx={{ minWidth: "200px", mr: 2 }}
      />

      {/* Location Filter */}
      <TextField
        label="Location"
        variant="outlined"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Montreal, Remote"
        sx={{ minWidth: "200px", mr: 2 }}
      />

      {/* Job Type Filter */}
      <FormControl sx={{ minWidth: "150px", mr: 2 }}>
        <InputLabel>Job Type</InputLabel>
        <Select value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="Full-time">Full-time</MenuItem>
          <MenuItem value="Part-time">Part-time</MenuItem>
          <MenuItem value="Contract">Contract</MenuItem>
          <MenuItem value="Internship">Internship</MenuItem>
          <MenuItem value="Freelance">Freelance</MenuItem>
        </Select>
      </FormControl>

      {/* Experience Level Filter */}
      <FormControl sx={{ minWidth: "150px", mr: 2 }}>
        <InputLabel>Experience</InputLabel>
        <Select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="Entry">Entry-level</MenuItem>
          <MenuItem value="Mid">Mid-level</MenuItem>
          <MenuItem value="Senior">Senior-level</MenuItem>
        </Select>
      </FormControl>

      {/* Salary Range Filter */}
      <Box sx={{ width: "200px", mr: 2 }}>
        <Typography variant="body2" gutterBottom>
          Salary Range
        </Typography>
        <Slider
          value={salaryRange}
          onChange={(e, newValue) => setSalaryRange(newValue)}
          valueLabelDisplay="auto"
          min={30000}
          max={200000}
          step={10000}
        />
        <Typography variant="caption">
          ${salaryRange[0]} - ${salaryRange[1]}
        </Typography>
      </Box>

      {/* Remote Filter */}
      <FormControlLabel
        control={
          <Checkbox
            checked={remote}
            onChange={(e) => setRemote(e.target.checked)}
          />
        }
        label="Remote Only"
        sx={{ mr: 2 }}
      />

      {/* Apply Filters Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleFilterChange}
        sx={{ whiteSpace: "nowrap" }}
      >
        Apply Filters
      </Button>
    </Box>
  );
};

export default Filters;
