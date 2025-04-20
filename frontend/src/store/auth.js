import create from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
  user: null,

  // Signup function
  signup: async (formData) => {
    try {
      const response = await axios.post("/users/register", {
        email: formData.email,
        password: formData.password,
        profilePhoto:
          "https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-scaled.jpeg", // The profile photo URL
      });

      const userData = response.data.user; // Assuming the backend returns user data in the response
      console.log(userData);
      // Set the user data in the Zustand store
      set({ user: userData });
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
    }
  },

  // Login function
  login: async (formData, navigate) => {
    console.log(formData.email, formData.password);
    try {
      const response = await axios.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log(response.data);
      const { user, token } = response.data;
      set({ user });

      // Store the token
      localStorage.setItem("token", user.id);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  },

  // Logout function
  logout: async () => {
    try {
      await axios.post("/users/logout");

      // Clear the user data in the Zustand store
      set({ user: null });
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  },
}));

export default useAuthStore;
