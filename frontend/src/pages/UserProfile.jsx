import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import ResumeCard from "../Components/ResumeCard";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import heic2any from "heic2any";
import JobTrackerWithResume from "../Components/JobTrackerWithResume";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [editField, setEditField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoApplyEnabled, setAutoApplyEnabled] = useState(false);
  const [autoApplyStatus, setAutoApplyStatus] = useState(null); // 'loading' | 'success' | 'error'

  useEffect(() => {
    // Simulate fetching MongoDB user profile
    axios.get(`/users/getprofile`, { withCredentials: true }).then((res) => {
      setProfile({
        ...res.data,
        jobPreferences: res.data.jobPreferences || {},
        linkedAccounts: res.data.linkedAccounts || {},
      });
    });

    // Fetch PostgreSQL resumes
    axios.get("/resume/resumes", { withCredentials: true }).then((res) => {
      setResumes(res.data);
      setLoading(false);
    });
  }, []);

  const handleFieldChange = (path, value) => {
    const parts = path.split(".");
    setProfile((prev) => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] = current[parts[i]] || {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return updated;
    });
  };

  const saveProfile = () => {
    axios.put("/users/profileupdate", profile).catch(console.error);
    setEditField(null);
  };

  const handleImageUpload = async (e) => {
    let file = e.target.files[0];

    if (!file) return;

    console.log("Original file:", file);

    if (
      file.type === "image/heic" ||
      file.name.toLowerCase().endsWith(".heic")
    ) {
      console.log("Detected HEIC image. Converting to JPEG...");
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
        });
        file = new File(
          [convertedBlob],
          file.name.replace(/\.heic$/i, ".jpg"),
          {
            type: "image/jpeg",
          }
        );
        console.log("Conversion successful. New file:", file);
      } catch (err) {
        console.error("HEIC conversion failed:", err);
        return;
      }
    }

    const formData = new FormData();
    formData.append("profilePhoto", file);
    console.log("Uploading image to server:", file);

    try {
      const response = await axios.put("/users/profilephotoupdate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  if (loading || !profile) return <div className="p-6">Loading...</div>;

  const fields = [
    { label: "Role", path: "jobPreferences.role" },
    { label: "Location", path: "jobPreferences.location" },
    { label: "Salary Range", path: "jobPreferences.salaryRange" },
    { label: "GitHub", path: "linkedAccounts.github" },
    { label: "LinkedIn", path: "linkedAccounts.linkedin" },
  ];

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="relative group w-28 h-28">
            <img
              src={profile.profilePhoto}
              alt="Profile"
              className="w-28 h-28 object-cover rounded-full border shadow"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
              <input
                type="file"
                onChange={handleImageUpload}
                className="hidden"
              />
              <FaPencilAlt className="text-white text-sm" />
            </label>
          </div>

          <div className="flex-1">
            {editField === "username" ? (
              <input
                type="text"
                value={profile.username}
                onChange={(e) => handleFieldChange("username", e.target.value)}
                onBlur={saveProfile}
                className="text-3xl font-bold border-b-2 border-blue-500 outline-none w-full"
                autoFocus
              />
            ) : (
              <h1
                className="text-3xl font-bold flex items-center gap-2 cursor-pointer"
                onClick={() => setEditField("username")}
              >
                {profile.username}
                <FaPencilAlt className="text-gray-500 text-sm" />
              </h1>
            )}

            {editField === "bio" ? (
              <textarea
                value={profile.bio}
                onChange={(e) => handleFieldChange("bio", e.target.value)}
                onBlur={saveProfile}
                className="w-full mt-2 text-sm border-b-2 border-blue-500 outline-none"
                autoFocus
              />
            ) : (
              <p
                className="text-sm text-gray-600 mt-2 cursor-pointer flex items-center gap-2"
                onClick={() => setEditField("bio")}
              >
                {profile.bio || "Click to add a bio"}
                <FaPencilAlt className="text-gray-400 text-xs" />
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(({ label, path }) => {
            const value =
              path.split(".").reduce((acc, cur) => acc?.[cur], profile) || "";
            return (
              <div key={path}>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  {label}
                </label>
                {editField === path ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleFieldChange(path, e.target.value)}
                    onBlur={saveProfile}
                    className="w-full border-b-2 border-blue-500 px-2 py-1 outline-none"
                    autoFocus
                  />
                ) : (
                  <div
                    className="bg-gray-100 px-3 py-2 rounded flex justify-between items-center cursor-pointer"
                    onClick={() => setEditField(path)}
                  >
                    <span>{value || "Not set"}</span>
                    <FaPencilAlt className="text-gray-500 text-sm" />
                  </div>
                )}
              </div>
            );
          })}

          <div>
            <label className="text-sm font-semibold text-gray-700 block">
              Open to Remote?
            </label>
            <select
              value={profile.jobPreferences?.remote ? "Yes" : "No"}
              onChange={(e) =>
                handleFieldChange(
                  "jobPreferences.remote",
                  e.target.value === "Yes"
                )
              }
              className="w-full mt-1 border px-3 py-2 rounded"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 p-8">
        <h2 className="text-xl font-bold mb-4">Your Resumes</h2>
        {resumes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => {
              const fullName = `${resume.resumeBio?.FirstName || ""} ${
                resume.resumeBio?.LastName || ""
              }`;
              const recentJob =
                resume.resumeExperiences?.[0]?.RoleTitle || "No job title";
              const summarySnippet =
                resume.resumeSummary?.Summary?.replace(/<[^>]+>/g, "")?.slice(
                  0,
                  80
                ) || "No summary provided";

              return (
                <div
                  key={resume.id}
                  className={`p-4 border rounded-lg shadow transition hover:shadow-md bg-white ${
                    profile.defaultResumeId === resume.id
                      ? "border-blue-600"
                      : "border-gray-200"
                  }`}
                >
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold">{fullName}</h3>
                    <p className="text-sm text-gray-600">{recentJob}</p>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    {summarySnippet}...
                  </p>

                  <button
                    onClick={() => {
                      axios
                        .put("/users/profileupdate", {
                          ...profile,
                          defaultResumeId: resume.id,
                        })
                        .then(() => {
                          setProfile((prev) => ({
                            ...prev,
                            defaultResumeId: resume.id,
                          }));
                        });
                    }}
                    className={`px-4 py-2 rounded text-sm font-medium ${
                      profile.defaultResumeId === resume.id
                        ? "bg-blue-600 text-white cursor-default"
                        : "bg-gray-100 hover:bg-blue-50 text-blue-700"
                    }`}
                    disabled={profile.defaultResumeId === resume.id}
                  >
                    {profile.defaultResumeId === resume.id
                      ? "Default Resume"
                      : "Set as Default"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-md">
            No resumes found. Click "Create Resume" to get started.
          </p>
        )}
      </div>
      <div className="max-w-6xl mx-auto mt-10 mb-6 p-8">
        <h2 className="text-xl font-bold mb-4">Auto Apply</h2>
        <div className="bg-white p-6 rounded shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Automatically apply to 20 new jobs daily using your default
              resume.
            </p>
            <p className="text-xs text-gray-500">
              Make sure your <strong>Job Role</strong> and{" "}
              <strong>Location</strong> are filled and{" "}
              <strong>Default Resume</strong> is selected before enabling.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={async () => {
                const role = profile.jobPreferences?.role?.trim();
                const location = profile.jobPreferences?.location?.trim();

                if (!role || !location) {
                  alert(
                    "⚠️ Please fill in your desired Role and Location in Job Preferences before enabling Auto Apply."
                  );
                  return;
                }

                try {
                  setAutoApplyStatus("loading");
                  const res = await axios.post(
                    "/scrapping/auto-apply",
                    {},
                    { withCredentials: true }
                  );
                  setAutoApplyStatus("success");
                  setAutoApplyEnabled(true);
                } catch (error) {
                  console.error("Auto Apply failed:", error);
                  setAutoApplyStatus("error");
                }
              }}
              disabled={autoApplyStatus === "loading"}
              className={`px-4 py-2 rounded font-medium text-sm transition ${
                autoApplyStatus === "loading"
                  ? "bg-gray-400 text-white cursor-wait"
                  : autoApplyEnabled
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {autoApplyStatus === "loading"
                ? "Running..."
                : autoApplyEnabled
                ? "Auto Apply Enabled"
                : "Enable Auto Apply"}
            </button>

            {autoApplyStatus === "success" && (
              <span className="text-green-600 text-sm">
                ✅ Applied successfully!
              </span>
            )}
            {autoApplyStatus === "error" && (
              <span className="text-red-500 text-sm">
                ❌ Failed. Try again.
              </span>
            )}
          </div>
        </div>
      </div>
      <JobTrackerWithResume />
      <Footer />
    </>
  );
};

export default UserProfile;
