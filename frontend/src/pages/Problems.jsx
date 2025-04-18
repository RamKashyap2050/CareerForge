import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import data from "../Tagged_LeetCode_Problems.json";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState("All");
  const [selectedSort, setSelectedSort] = useState("None");
  const navigate = useNavigate();

  useEffect(() => {
    setProblems(data);
  }, []);

  // Extract unique patterns
  const uniquePatterns = ["All", ...new Set(data.map(p => p.Primary_Pattern || "Uncategorized"))];

  // Filter problems by pattern
  let filteredProblems = selectedPattern === "All"
    ? problems
    : problems.filter(p => p.Primary_Pattern === selectedPattern);

  // Sort problems by difficulty
  if (selectedSort === "EasyToHard") {
    filteredProblems = [...filteredProblems].sort((a, b) =>
      difficultyValue(a.difficulty) - difficultyValue(b.difficulty)
    );
  } else if (selectedSort === "HardToEasy") {
    filteredProblems = [...filteredProblems].sort((a, b) =>
      difficultyValue(b.difficulty) - difficultyValue(a.difficulty)
    );
  }

  function difficultyValue(diff) {
    if (diff === "Easy") return 1;
    if (diff === "Medium") return 2;
    if (diff === "Hard") return 3;
    return 0;
  }

  const handleNavigate = (problemId) => {
    navigate(`/InduvidualProblem/${problemId}`);
  };

  return (
    <>
      <Navbar />

      {/* Pattern Filter */}
      <div className="flex flex-wrap gap-2 px-6 pt-6">
        {uniquePatterns.map((pattern, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedPattern(pattern)}
            className={`px-4 py-2 text-sm rounded-full border transition font-medium ${
              selectedPattern === pattern
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {pattern}
          </button>
        ))}
      </div>

      {/* Sort Control */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-sm text-gray-600 font-medium">
          Showing: {filteredProblems.length} problems
        </div>
        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          className="border border-gray-300 text-sm rounded-md px-3 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="None">Sort by Difficulty</option>
          <option value="EasyToHard">Easy → Hard</option>
          <option value="HardToEasy">Hard → Easy</option>
        </select>
      </div>

      {/* Problem Cards */}
      <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 bg-gray-50 min-h-screen">
        {filteredProblems.map((problem, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition cursor-pointer border border-gray-100 hover:border-blue-300"
            onClick={() => handleNavigate(problem.id)}
          >
            <h3 className="font-semibold text-lg mb-2 text-gray-800">
              {problem.title}
            </h3>

            {/* Difficulty Badge */}
            <div className="text-sm mb-1">
              <span
                className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${
                  problem.difficulty === "Easy"
                    ? "bg-green-100 text-green-800"
                    : problem.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {problem.difficulty}
              </span>
            </div>

            {/* Acceptance Rate */}
            <div className="text-xs text-gray-500 mb-2">
              Acceptance: {problem.acceptance_rate}%
            </div>

            {/* Pattern Tag */}
            {problem.Primary_Pattern && (
              <div className="text-xs text-blue-600 font-medium">
                #{problem.Primary_Pattern}
              </div>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
}
