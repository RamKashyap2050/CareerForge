import React from "react";
import useMockInterviewStore from "../store/mockinterviews";

const InterviewSettings = () => {
  const { interviewSettings, setInterviewSettings } = useMockInterviewStore();

  const handleLengthChange = (e) => {
    setInterviewSettings((prev) => ({ ...prev, length: Number(e.target.value) }));
  };

  const handleDifficultyChange = (e) => {
    setInterviewSettings((prev) => ({ ...prev, difficulty: Number(e.target.value) }));
  };

  const handleStyleChange = (e) => {
    setInterviewSettings((prev) => ({ ...prev, style: e.target.value }));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        🎯 Customize Interview Experience
      </h2>

      {/* Interview Style Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Interview Style
        </label>
        <select
          value={interviewSettings.style}
          onChange={handleStyleChange}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
        >
          <option value="">Select Style</option>
          <option value="Technical Round">Technical Round</option>
          <option value="Theoretical Round">Theoretical Round</option>
          <option value="HR Round">HR Round</option>
          <option value="Behavioral Round">Behavioral Round</option>
        </select>
      </div>

      {/* Interview Length Slider */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Interview Length (minutes): {interviewSettings.length}
        </label>
        <input
          type="range"
          min="15"
          max="60"
          step="15"
          value={interviewSettings.length}
          onChange={handleLengthChange}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>15 min</span>
          <span>30 min</span>
          <span>45 min</span>
          <span>60 min</span>
        </div>
      </div>

      {/* Difficulty Level Slider */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Difficulty Level:{" "}
          {interviewSettings.difficulty === 1
            ? "Beginner"
            : interviewSettings.difficulty === 2
            ? "Intermediate"
            : "Advanced"}
        </label>
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          value={interviewSettings.difficulty}
          onChange={handleDifficultyChange}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>Beginner</span>
          <span>Intermediate</span>
          <span>Advanced</span>
        </div>
      </div>
    </div>
  );
};

export default InterviewSettings;
