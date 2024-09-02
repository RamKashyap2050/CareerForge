import React from "react";
import { Grid, TextField, Button, MenuItem } from "@mui/material";

const countries = [
  { code: "+1", label: "USA" },
  { code: "+91", label: "India" },
  { code: "+44", label: "UK" },
  // Add more countries as needed
];

const UserBioStep = ({ bio, onBioChange, onNext, onBack }) => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "2rem" }}>User Bio</h2>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={bio.firstName}
            onChange={onBioChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={bio.lastName}
            onChange={onBioChange}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                label="Country Code"
                name="countryCode"
                value={bio.countryCode || ""}
                onChange={onBioChange}
                variant="outlined"
              >
                {countries.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.label} ({option.code})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={bio.phoneNumber}
                onChange={onBioChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={bio.email}
            onChange={onBioChange}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="LinkedIn Profile"
            name="linkedinProfile"
            value={bio.linkedinProfile}
            onChange={onBioChange}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="GitHub Link"
            name="githubLink"
            value={bio.githubLink}
            onChange={onBioChange}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={bio.location}
            onChange={onBioChange}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={bio.city}
            onChange={onBioChange}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Province"
            name="province"
            value={bio.province}
            onChange={onBioChange}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={bio.country}
            onChange={onBioChange}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item>
          <Button variant="contained" onClick={onBack}>
            Back
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={onNext}>
            Next
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserBioStep;
