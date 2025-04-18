import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function LinkedInResumeParser() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    // Check if user has saved profile
    async function fetchSavedProfile() {
      try {
        const res = await axios.get("/api/user/profile");
        if (res.data) setResponse(res.data);
      } catch (err) {
        console.error("No saved profile found");
      }
    }
    fetchSavedProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(`scrapping/ScrapeProfile`, { url });
      setResponse(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await axios.post("/api/user/save-profile", response);
      alert("Profile saved successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const handleEdit = (field, currentValue) => {
    setEditField(field);
    setEditValue(currentValue);
  };

  const handleEditSave = () => {
    setResponse((prev) => ({ ...prev, [editField]: editValue }));
    setEditField(null);
    setEditValue("");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🔗 LinkedIn Resume Parser
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter LinkedIn Profile URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold py-3 rounded-xl disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Parsing..." : "Generate Resume"}
            </button>
          </form>

          {response && (
            <div className="mt-8 bg-gray-50 p-6 rounded-xl text-gray-800 space-y-4 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">📝 Extracted Info:</h2>

              {["name", "headline", "location", "education"].map((field) => (
                <div
                  key={field}
                  className="flex justify-between items-center gap-2"
                >
                  {editField === field ? (
                    <>
                      <input
                        className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-800 w-full"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                      <button
                        className="text-green-600 hover:underline"
                        onClick={handleEditSave}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong className="capitalize">{field}:</strong>{" "}
                        {response[field]}
                      </p>
                      <button
                        onClick={() => handleEdit(field, response[field])}
                      >
                        <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                      </button>
                    </>
                  )}
                </div>
              ))}

              <div className="mt-4">
                <h3 className="font-semibold">Experience:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {response.experiences?.map((exp, idx) => (
                    <li key={idx}>
                      {exp.jobTitle} @ {exp.companyName} ({exp.dateRange})
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleSaveProfile}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl"
              >
                Save to Profile
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
