import React, { useState } from "react";
import { Grid, TextField, Button, MenuItem, Box } from "@mui/material";
import axios from "axios";
import {
  GoogleMap,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useRef, useEffect } from "react";

const libraries = ["places"];
const countries = [
  { code: "+1", label: "USA" },
  { code: "+1", label: "Canada" },
  { code: "+91", label: "India" },
  { code: "+44", label: "UK" },
  { code: "+61", label: "Australia" },
  // add other countries here...
];

const UserBioStep = ({ bio, onBioChange, onNext, onBack, isEditing }) => {
  const inputref = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });
  const [locationInput, setLocationInput] = useState(bio.location || "");

  useEffect(() => {
    // If in edit mode and bio already has data, ensure it is populated correctly
    if (isEditing && bio) {
      console.log("Editing mode - bio data loaded", bio);
    }
  }, [isEditing, bio]);

  const handleOnPlacesChanged = () => {
    const places = inputref.current.getPlaces();
    if (places && places.length > 0) {
      const address = places[0].formatted_address;
      setLocationInput(address); // Set location input with selected place from Google autocomplete
      onBioChange({
        target: {
          name: "location",
          value: address,
        },
      });
    }
  };

  const handleLocationInputChange = (e) => {
    const value = e.target.value;
    setLocationInput(value); // Allow manual typing in the location input
    onBioChange({
      target: {
        name: "location",
        value: value, // Update the location in the parent state
      },
    });
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
          firstName: bio.firstName, // Use camelCase
          lastName: bio.lastName, // Use camelCase
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
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
    <h2 className="text-3xl font-bold mb-6 text-gray-800">User Bio</h2>

    {/* Grid Layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={bio.firstName || ""}
        onChange={onBioChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={bio.lastName || ""}
        onChange={onBioChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* Country Code & Phone Number */}
      <div className="flex gap-4">
        <select
          name="countryCode"
          value={bio.countryCode || ""}
          onChange={onBioChange}
          className="w-1/3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {countries.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label} ({option.code})
            </option>
          ))}
        </select>

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={bio.phoneNumber || ""}
          onChange={onBioChange}
          className="w-2/3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={bio.email || ""}
        onChange={onBioChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* Social Links */}
      <input
        type="text"
        name="linkedinProfile"
        placeholder="LinkedIn Profile"
        value={bio.linkedinProfile || ""}
        onChange={onBioChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <input
        type="text"
        name="githubLink"
        placeholder="GitHub Link"
        value={bio.githubLink || ""}
        onChange={onBioChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <input
        type="text"
        name="websiteLink"
        placeholder="Website Link"
        value={bio.websiteLink || ""}
        onChange={onBioChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    {/* Google Places Autocomplete for Location (Kept Intact) */}
    <div className="mt-6">
      {isLoaded && (
        <div className="w-full">
          <StandaloneSearchBox
            onLoad={(ref) => (inputref.current = ref)}
            onPlacesChanged={handleOnPlacesChanged}
          >
            <input
              type="text"
              placeholder="Location (Start typing your address)"
              value={locationInput}
              onChange={handleLocationInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </StandaloneSearchBox>
        </div>
      )}
    </div>

    {/* Buttons */}
    <div className="mt-8 flex justify-between">
      <button
        onClick={onBack}
        className="px-6 py-3 text-gray-700 font-semibold bg-gray-200 hover:bg-gray-300 rounded-lg transition"
      >
        Back
      </button>

      <button
        onClick={handleSubmit}
        className="px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg transition"
      >
        Next
      </button>
    </div>
  </div>
  );
};

export default UserBioStep;
