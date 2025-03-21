import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import CreateCustomResume from "./pages/CreateCustomResume";
import JobListings from "./pages/JobListings";
import PrepareInterviews from "./pages/PrepareInterviews";
import MockInterview from "./pages/MockInterview";

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
        <Route path="/mockinterviews" element={<PrepareInterviews />} />
        <Route path="/interviews" element={<MockInterview />} />
      </Routes>
    </Router>
  );
};

export default App;
