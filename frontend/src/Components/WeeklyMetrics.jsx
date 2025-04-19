import React, { useState } from "react";
import { MessageCircle, Briefcase, CheckCircle } from "lucide-react";

const WeeklyMetrics = () => {
  const [metrics, setMetrics] = useState({
    messages: 3,
    jobs: 18,
    connections: 22,
  });

  const targets = {
    messages: 5,
    jobs: 20,
    connections: 20,
  };

  const handleChange = (key, value) => {
    setMetrics((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const getCurveMessage = () => {
    const totalPercent =
      (metrics.messages / targets.messages +
        metrics.jobs / targets.jobs +
        metrics.connections / targets.connections) /
      3;

    if (totalPercent >= 1) return "🔥 You're ahead of 95% of job seekers!";
    if (totalPercent >= 0.75) return "🚀 You're in the top 25% – keep going!";
    if (totalPercent >= 0.5) return "⚡ Solid progress – you're halfway there!";
    return "🧭 Let's pick up the pace. You're warming up!";
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">📊 Weekly Metrics Overview</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <MetricCard
          icon={<MessageCircle size={20} />}
          label="Messages Sent"
          value={metrics.messages}
          target={targets.messages}
          onChange={(val) => handleChange("messages", val)}
        />
        <MetricCard
          icon={<Briefcase size={20} />}
          label="Jobs Applied"
          value={metrics.jobs}
          target={targets.jobs}
          onChange={(val) => handleChange("jobs", val)}
        />
        <MetricCard
          icon={<CheckCircle size={20} />}
          label="Connections Made"
          value={metrics.connections}
          target={targets.connections}
          onChange={(val) => handleChange("connections", val)}
        />
      </div>

      {/* Curve Indicator */}
      <div className="mt-6 text-center bg-blue-50 p-4 rounded-xl shadow border border-blue-200">
        <p className="text-lg font-semibold text-blue-700">{getCurveMessage()}</p>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value, target, onChange }) => {
  const percentage = Math.min((value / target) * 100, 100);

  return (
    <div className="p-4 bg-white rounded-xl shadow flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-medium">
          {icon}
          <span>{label}</span>
        </div>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 px-2 py-1 border rounded text-sm"
          min={0}
        />
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-sm text-gray-500">
        {value} of {target} completed
      </div>
    </div>
  );
};

export default WeeklyMetrics;
