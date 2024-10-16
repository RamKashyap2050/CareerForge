import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import CreateCustomResume from "./pages/CreateCustomResume";
import JobListings from "./pages/JobListings";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customresume" element={<CreateCustomResume />} />
        <Route path="/joblistings" element={<JobListings />} />
      </Routes>
    </Router>
  );
};

export default App;
