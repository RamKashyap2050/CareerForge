import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import axios from "axios"; // Make sure axios is installed and imported

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/users/signup`, {
        email: formData.email,
        password: formData.password,
        profilePhoto:
          "https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-scaled.jpeg", // Default profile photo URL
      });

      if (response.status === 201) {
        // Handle successful registration (e.g., redirect to login page)
        console.log("User registered successfully");
      }
    } catch (error) {
      console.error("There was an error registering the user:", error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
          padding: 3,
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ mt: 1, mb: 2 }}
            href="/auth/google"
          >
            Sign up with Google
          </Button>

          <Typography variant="body2" color="text.secondary" align="center">
            Already have an account?{" "}
            <Link href="/login" variant="body2">
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
