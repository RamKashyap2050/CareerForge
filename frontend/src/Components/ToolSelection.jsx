import React, { useState } from "react";
import { FaPlus, FaCheck, FaRobot } from "react-icons/fa";
import useMockInterviewStore from "../store/mockinterviews"; // Import Zustand store

const toolsList = [
  "React",
  "Angular",
  "Node.js",
  "Django",
  "Spring Boot",
  "Kubernetes",
  "Docker",
  "Nagios",
  "Chef",
  "Ansible",
  "Apache Kafka",
  "RabbitMQ",
  "Prometheus",
  "Grafana",
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Redis",
  "Elasticsearch",
  "Terraform",
  "Jenkins",
  "Git",
  "GitHub",
  "GitLab",
  "AWS",
  "GCP",
  "Azure",
  "Splunk",
  "New Relic",
];

const ToolSelection = () => {
  const { selectedTools, setSelectedTools } = useMockInterviewStore(); // Use Zustand store
  const [tools, setTools] = useState(toolsList);
  const [newTool, setNewTool] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Sync selectedTools using Zustand (Fix)
  const handleSelectTool = (tool) => {
    setSelectedTools((prevSelected) =>
      prevSelected.includes(tool)
        ? prevSelected.filter((t) => t !== tool)
        : [...prevSelected, tool]
    );
  };

  // ✅ Sync new tool addition with Zustand store (Fix)
  const handleAddTool = () => {
    if (newTool.trim() && !tools.includes(newTool)) {
      setTools([...tools, newTool]);
      setSelectedTools((prevSelected) => [...prevSelected, newTool]);
      setNewTool("");
    }
  };

  // Fetch AI insights
  const fetchAiSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/mock/getinsights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedTools }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setAiResponse(data.insights);
    } catch (error) {
      console.error("AI Fetch Error:", error);
      setAiResponse("Error fetching AI insights.");
    } finally {
      setLoading(false);
    }
  };

  const parseAiResponse = (response) => {
    if (!response) return "";
    response = response
      .split(/\n\s*\n/)
      .map((para) => `<p>${para.trim()}</p>`)
      .join("");
    response = response.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    response = response.replace(/\*(.*?)\*/g, "<em>$1</em>");
    response = response.replace(/###\s?(.*?)(\n|$)/g, "<h3>$1</h3>");
    response = response.replace(/##\s?(.*?)(\n|$)/g, "<h2>$1</h2>");
    response = response.replace(/(?:<p>)?- (.*?)<\/p>/g, "<li>$1</li>");
    response = response.replace(/(<li>.*<\/li>)+/g, "<ul>$&</ul>");
    response = response.replace(/(?:<p>)?\d+\.\s(.*?)<\/p>/g, "<li>$1</li>");
    response = response.replace(/(<li>.*<\/li>)+/g, "<ol>$&</ol>");
    response = response.replace(/(?<!<\/h\d>|\n)<br\s*\/?>/g, "<br>");

    return response;
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🔧 Select Technologies & Tools
        </h2>

        {/* Tool Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {tools.map((tool) => (
            <button
              key={tool}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                selectedTools.includes(tool)
                  ? "bg-blue-500 text-white shadow-md scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => handleSelectTool(tool)}
            >
              {selectedTools.includes(tool) ? (
                <FaCheck className="inline mr-1" />
              ) : (
                ""
              )}{" "}
              {tool}
            </button>
          ))}
        </div>

        {/* Add New Tool */}
        <div className="flex items-center space-x-3 mb-6">
          <input
            type="text"
            placeholder="Add a new tool..."
            className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={newTool}
            onChange={(e) => setNewTool(e.target.value)}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 transition-all"
            onClick={handleAddTool}
          >
            <FaPlus />
          </button>
        </div>

        {/* AI Suggestions Button */}
        <button
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all"
          onClick={fetchAiSuggestions}
          disabled={selectedTools.length === 0}
        >
          <FaRobot />{" "}
          <span>
            {loading ? "Fetching AI Insights..." : "Get AI Insights on Tools"}
          </span>
        </button>

        {/* AI Response */}
        {aiResponse && (
          <div className="bg-gray-50 mt-6 p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🤖 AI Insights:
            </h3>
            <div
              className="text-gray-700 space-y-3"
              dangerouslySetInnerHTML={{ __html: parseAiResponse(aiResponse) }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolSelection;
