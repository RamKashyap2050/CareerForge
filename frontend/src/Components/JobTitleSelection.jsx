import React, { useState } from "react";
import useMockInterviewStore from "../store/mockinterviews";
const JobTitleSelection = () => {
  const { jobTitle, setJobTitle } = useMockInterviewStore();
  const [jobTitles, setJobTitles] = useState([
    "Full Stack Developer",
    "QA Analyst",
    "Site Reliability Engineer",
    "Data Scientist",
    "Cloud Engineer",
    "Backend Developer",
    "Frontend Developer",
    "Project Manager",
    "DevOps Engineer",
    "Data Engineer",
    "Mobile Developer",
    "Security Engineer",
    "UX/UI Designer",
    "Systems Engineer",
    "Network Engineer",
    "More...",
  ]);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchMoreJobTitles = async () => {
    setLoadingMore(true);
    const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
    console.log(VITE_OPENAI_API_KEY)
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${VITE_OPENAI_API_KEY }`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "Suggest 5 job titles related strictly to IT & Computing. Format them as a plain list without numbers or bullets.",
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!data.choices || data.choices.length === 0) {
        throw new Error("No valid job titles received from AI.");
      }

      const suggestions = data.choices[0]?.message?.content
        .split("\n") // Split by new line
        .map((s) => s.trim()) // Remove extra spaces
        .filter((s) => s.length > 3 && !/^\d/.test(s)); // Remove numbers like "1. Title"

      setJobTitles((prevTitles) => {
        const updatedTitles = [
          ...new Set([
            ...prevTitles.filter((t) => t !== "More..."),
            ...suggestions,
          ]),
        ];
        return updatedTitles.includes("More...")
          ? updatedTitles
          : [...updatedTitles, "More..."];
      });
    } catch (error) {
      console.error("Error fetching job titles:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-green-700">Select Job Title</h2>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Enter job title..."
        className="w-full border border-gray-300 rounded-md p-3 my-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
      />

      {/* Job Titles Grid */}
      <div className="flex flex-wrap gap-3 mt-2">
        {jobTitles.map((title, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
              jobTitle === title
                ? "bg-green-700 text-white shadow-md ring-2 ring-green-500"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
            onClick={
              title === "More..."
                ? fetchMoreJobTitles
                : () => setJobTitle(title)
            }
          >
            {title === "More..." && loadingMore ? (
              <span className="animate-spin border-4 border-white border-t-transparent rounded-full w-5 h-5 inline-block"></span>
            ) : (
              title
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobTitleSelection;
