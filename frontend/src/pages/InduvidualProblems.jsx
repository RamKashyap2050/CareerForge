import { useParams } from "react-router-dom";
import data from "../Tagged_LeetCode_Problems.json";
import { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import axios from "axios";

export default function IndividualProblem() {
  const { problemID } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("// Write your code here");
  const [output, setOutput] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const selected = data.find((p) => p.id == problemID);
    setProblem(selected);
  }, [problemID]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput("Running...");

    try {
      const res = await axios.post(`/api/mock/execute`, {
        code,
        language: "javascript",
        input: ""
      });

      setOutput(res.data.output || res.data.error || "No output");
      console.log(res.data && res.data.output)
    } catch (err) {
      console.error(err);
      setOutput("Error running code.");
    }

    setIsSubmitting(false);
  };

  if (!problem) return <div className="p-6">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen p-4 gap-4 bg-gray-100">
        {/* Left Panel: Problem Description */}
        <div className="bg-white rounded-xl shadow-md overflow-auto p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{problem.title}</h1>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{problem.description}</pre>

          <div className="mt-4 space-y-1 text-sm text-gray-600">
            <div><span className="font-semibold">Difficulty:</span> {problem.difficulty}</div>
            <div><span className="font-semibold">Acceptance:</span> {problem.acceptance_rate}%</div>
            <div><span className="font-semibold">Pattern:</span> {problem.Primary_Pattern || "N/A"}</div>
          </div>
        </div>

        {/* Right Panel: Code Editor + Controls */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
          <div className="bg-gray-800 text-white px-4 py-2 font-semibold text-sm">Code Editor (JavaScript)</div>

          <div className="flex-1">
            <Editor
              height="100%"
              language="javascript"
              value={code}
              onChange={(value) => setCode(value)}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                formatOnType: true,
                fontFamily: "Fira Code, monospace"
              }}
            />
          </div>

          <div className="bg-gray-100 p-3 border-t text-right">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded"
            >
              {isSubmitting ? "Running..." : "Submit Code"}
            </button>
          </div>

          <div className="bg-gray-100 border-t p-4 h-32 overflow-auto text-sm font-mono text-gray-700">
            {output || "Submit your code to see output."}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
