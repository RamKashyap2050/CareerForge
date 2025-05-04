import React, { useEffect, useState } from "react";
import axios from "axios";

const JobTrackerWithResume = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/resume/getresumesforuser", { withCredentials: true })
      .then((res) => {
        setData(res.data.data);
        console.log(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">
        Applied Jobs & AI-Generated Resumes
      </h1>
      {data.length === 0 ? (
        <p className="text-gray-600">No resumes found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {data.map((item) => {
            return (
              <div
                key={item._id}
                className="border rounded-lg shadow bg-white p-4 space-y-4"
              >
                <div>
                  <h2 className="text-xl font-semibold text-blue-700">
                    {item.jobId.jobTitle} at {item.jobId.company}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">
                    Location: {item.jobId.location}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Salary: {item.jobId.pay || "Not disclosed"}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Benefits: {item.jobId.benefits || "N/A"}
                  </p>
                  <p className="text-xs text-gray-400 italic">
                    URL:{" "}
                    <a
                      href={item.sourceJobUrl}
                      className="underline text-blue-500"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Job
                    </a>
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="font-bold mb-1">Resume Summary</h3>
                  <p className="text-sm text-gray-700">
                    {item.resumeJSON.summary}
                  </p>

                  <h3 className="font-bold mt-3">Top Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.resumeJSON.skills.slice(0, 8).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 text-sm text-green-600 font-semibold">
                    Estimated ATS Score: {item.atsScore}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobTrackerWithResume;
