import React from "react";
import { Grid, TextField, Button, MenuItem, Box } from "@mui/material";
import axios from "axios";
import {
  GoogleMap,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useRef } from "react";

const libraries = ["places"];
const countries = [
  { code: "+1", label: "USA" },
  { code: "+1", label: "Canada" },
  { code: "+91", label: "India" },
  { code: "+44", label: "UK" },
  { code: "+61", label: "Australia" },
  // add other countries here...
];

const UserBioStep = ({ bio, onBioChange, onNext, onBack }) => {
  const inputref = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const handleOnPlacesChanged = () => {
    const places = inputref.current.getPlaces();
    if (places && places.length > 0) {
      const address = places[0].formatted_address;
      onBioChange({
        target: {
          name: "location",
          value: address, // Set location field
        },
      });
    }
  };

  const handleSubmit = async () => {
    onNext(); // Proceed to the next step, you can keep this as per your flow

    try {
      // Fetch resumeId from localStorage if it exists
      const savedResumeId = JSON.parse(localStorage.getItem("resumeId"));

      const response = await axios.put(
        "/resume/resume-bio",
        {
          resumeId: savedResumeId || null, // Send resumeId if it exists, otherwise send null for creation
          firstName: bio.firstName,
          lastName: bio.lastName,
          countryCode: bio.countryCode,
          phoneNumber: bio.phoneNumber,
          email: bio.email,
          linkedinProfile: bio.linkedinProfile,
          githubLink: bio.githubLink,
          websiteLink: bio.websiteLink,
          location: bio.location,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Response from backend:", response.data);

      if (response.data.resumeId) {
        localStorage.setItem(
          "resumeId",
          JSON.stringify(response.data.resumeId)
        );
      }

    } catch (error) {
      console.error("Error submitting user bio:", error);
      alert(
        "There was an error submitting your information. Please try again."
      );
    }
  };

  return (
    <Box sx={{ padding: "2rem" }}>
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
            label="Website Link"
            name="websiteLink"
            value={bio.websiteLink}
            onChange={onBioChange}
            variant="outlined"
          />
        </Grid>

        {/* Location field using Google Places Autocomplete */}
        <Grid item xs={12}>
          {isLoaded && (
            <StandaloneSearchBox
              onLoad={(ref) => (inputref.current = ref)}
              onPlacesChanged={handleOnPlacesChanged}
            >
              <TextField
                fullWidth
                label="Location"
                variant="outlined"
                placeholder="Start typing your address"
                inputProps={{
                  style: {
                    padding: "12px",
                  },
                }}
              />
            </StandaloneSearchBox>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ marginTop: "20px" }}>
        <Grid item>
          <Button variant="contained" onClick={onBack}>
            Back
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Next
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserBioStep;
