import { useState } from "react";
import { MessageCircle, Briefcase, CheckCircle } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ProjectKanban from "../Components/ProjectKanban";
import WeeklyMetrics from "../Components/WeeklyMetrics";

const JobStrategyBoard = () => {
  const appliedJobs = [
    { company: "Google", title: "Frontend Engineer", status: "Applied" },
    { company: "Meta", title: "Full Stack Developer", status: "Interview in Progress" },
    { company: "Amazon", title: "Backend Developer", status: "Rejected" },
    { company: "Netflix", title: "Software Engineer I", status: "Applied" },
    { company: "Airbnb", title: "Platform Engineer", status: "Interview in Progress" },
    { company: "Stripe", title: "DevOps Engineer", status: "Rejected" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800";
      case "Interview in Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
  {/* Weekly Metrics */}
  <div className="bg-white rounded-xl shadow p-6">
    <WeeklyMetrics />
  </div>

  {/* Project Kanban */}
  <div className="bg-white rounded-xl shadow p-6">
    <ProjectKanban />
  </div>

  {/* DSA + Jobs in Responsive Grid */}
  <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
    {/* DSA Tracker */}
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">📚 DSA Pattern Tracker</h2>
      <div className="space-y-4">
        {[
          { name: "Sliding Window", progress: 66 },
          { name: "Sorting", progress: 33 },
          { name: "Subarrays", progress: 100 },
          { name: "Dynamic Programming", progress: 0 },
          { name: "Two Pointers", progress: 100 },
          { name: "Binary Search", progress: 33 },
          { name: "Graphs", progress: 25 },
          { name: "Backtracking", progress: 0 },
        ].map((item) => (
          <div key={item.name}>
            <div className="flex justify-between mb-1">
              <span>{item.name}</span>
              <span className="text-sm text-gray-500">{item.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Applied Jobs */}
    <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">💼 Applied Jobs</h2>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {appliedJobs.map((job, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="font-semibold text-lg text-gray-800 mb-1">
              {job.title}
            </div>
            <div className="text-sm text-gray-600 mb-2">{job.company}</div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                job.status
              )}`}
            >
              {job.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

      <Footer />
    </>
  );
};

export default JobStrategyBoard;
