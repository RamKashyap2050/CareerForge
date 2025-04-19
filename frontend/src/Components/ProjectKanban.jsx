import React, { useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus, X } from "lucide-react";

const ProjectKanban = () => {
  const [kanban, setKanban] = useState({
    todo: [
      {
        title: "Portfolio Redesign",
        priority: "High",
        dueDate: "2025-04-30",
        subtasks: ["Design layout", "Implement Figma to Code"],
      },
    ],
    progress: [
      {
        title: "LinkedIn Scraper",
        priority: "Medium",
        dueDate: "",
        subtasks: ["Set up Puppeteer", "Handle pagination"],
      },
    ],
    done: [
      {
        title: "Job Scraper Core",
        priority: "Low",
        dueDate: "",
        subtasks: [],
      },
    ],
  });

  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [subtasks, setSubtasks] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [modalTask, setModalTask] = useState(null); // for modal
  const [dueDate, setDueDate] = useState("");
  const moveTask = (from, to, index) => {
    if (from === to) return;
    const task = kanban[from][index];
    setKanban((prev) => {
      const updated = { ...prev };
      updated[from] = updated[from].filter((_, i) => i !== index);
      updated[to] = [...updated[to], task];
      return updated;
    });
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const taskObj = {
      title: newTask.trim(),
      priority,
      dueDate: "", // we’re hiding due date now
      subtasks: subtasks
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    };
    setKanban((prev) => ({
      ...prev,
      todo: [...prev.todo, taskObj],
    }));
    setNewTask("");
    setPriority("Medium");
    setSubtasks("");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">
          📁 Personal Task Manager
        </h2>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(kanban).map(([status, items]) => (
            <KanbanColumn
              key={status}
              title={status}
              items={items}
              moveTask={moveTask}
              onCardClick={setModalTask}
            />
          ))}
        </div>

        {/* Toggle Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="text-blue-600 font-medium hover:underline"
          >
            {showForm ? "Hide Task Form" : "+ Add New Task"}
          </button>
        </div>

        {/* Add Task Form */}
        {showForm && (
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-inner grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="col-span-full">
              <label className="text-sm font-medium block mb-1">
                Task Title
              </label>
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="e.g. Dashboard UI"
                className="border px-4 py-2 rounded w-full shadow-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="border px-4 py-2 rounded w-full"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="col-span-full">
              <label className="text-sm font-medium block mb-1">
                Subtasks (comma separated)
              </label>
              <input
                value={subtasks}
                onChange={(e) => setSubtasks(e.target.value)}
                placeholder="e.g. Setup, UI, Deploy"
                className="border px-4 py-2 rounded w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border px-4 py-2 rounded w-full"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={addTask}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Task
              </button>
            </div>
          </div>
        )}

        {/* Modal for Task Details */}
        {modalTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 w-[90%] md:w-[400px] shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{modalTask.title}</h3>
                <button onClick={() => setModalTask(null)}>
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="mb-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    modalTask.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : modalTask.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {modalTask.priority}
                </span>
                <br />
              </div>
              {modalTask.dueDate && (
                <div className="text-xs text-gray-500 font-medium">
                  📅 {new Date(modalTask.dueDate).toLocaleDateString()}
                </div>
              )}
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-1">Subtasks</h4>
                {modalTask.subtasks.length === 0 ? (
                  <p className="text-sm text-gray-500">No subtasks.</p>
                ) : (
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {modalTask.subtasks.map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default ProjectKanban;

// --------------------------------------------
// 🧩 Kanban Column & Draggable Card
const KanbanColumn = ({ title, items, moveTask, onCardClick }) => {
  const [, drop] = useDrop({
    accept: "task",
    drop: (item) => moveTask(item.from, title, item.index),
  });

  return (
    <div ref={drop} className="bg-white p-4 rounded-xl shadow min-h-[200px]">
      <h3 className="font-semibold text-lg mb-2 capitalize">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <DraggableCard
            key={index}
            item={item}
            from={title}
            index={index}
            onClick={() => onCardClick(item)}
          />
        ))}
      </div>
    </div>
  );
};

const DraggableCard = ({ item, from, index, onClick }) => {
  const [, drag] = useDrag({
    type: "task",
    item: { from, index },
  });

  const getPriorityColor = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <div
      ref={drag}
      onClick={onClick}
      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
    >
      <div className="text-sm font-medium">{item.title}</div>
      <div
        className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block font-medium ${
          getPriorityColor[item.priority]
        }`}
      >
        {item.priority}
      </div>
    </div>
  );
};
