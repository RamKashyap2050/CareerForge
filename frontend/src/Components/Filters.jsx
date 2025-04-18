// ✅ Compact Inline TailwindCSS Job Filter UI
import React, { useState } from "react";
import axios from "axios";

const Filters = ({ onJobListingsFetched }) => {
  const [filters, setFilters] = useState({
    jobTitle: "software engineer",
    location: "Remote",
    jobType: "",
    experience: "",
    salaryRange: "",
    datePosted: "",
    remote: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApply = async () => {
    try {
      const response = await axios.post("/scrapping/scrape-jobs", filters);
      if (onJobListingsFetched) onJobListingsFetched(response.data);
    } catch (error) {
      console.error("Error fetching job listings:", error);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 bg-white shadow-lg rounded-xl">
      <div className="flex flex-wrap items-center gap-4 justify-center">
        <input
          type="text"
          name="jobTitle"
          placeholder="Job Title"
          value={filters.jobTitle}
          onChange={handleChange}
          className="px-3 py-2 w-52 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
          className="px-3 py-2 w-52 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="jobType"
          value={filters.jobType}
          onChange={handleChange}
          className="px-3 py-2 w-40 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
        <select
          name="experience"
          value={filters.experience}
          onChange={handleChange}
          className="px-3 py-2 w-36 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Exp</option>
          <option value="Entry">Entry</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
        </select>
        <select
          name="salaryRange"
          value={filters.salaryRange}
          onChange={handleChange}
          className="px-3 py-2 w-36 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Salary</option>
          <option value="<50k">&lt; $50k</option>
          <option value="50k-100k">$50k-$100k</option>
          <option value=">100k">&gt; $100k</option>
        </select>
        <select
          name="datePosted"
          value={filters.datePosted}
          onChange={handleChange}
          className="px-3 py-2 w-32 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Posted</option>
          <option value="1">24h</option>
          <option value="3">3d</option>
          <option value="7">7d</option>
          <option value="30">30d</option>
        </select>
        <select
          name="remote"
          value={filters.remote}
          onChange={handleChange}
          className="px-3 py-2 w-32 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Remote</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Onsite">Onsite</option>
        </select>
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default Filters;
