import { create } from "zustand";
import axios from "axios";

const useMockInterviewStore = create((set, get) => ({
  jobTitle: "",
  selectedTools: [],
  interviewSettings: {
    style: "",
    length: 30,
    difficulty: 1,
  },
  questions: [], // Store for generated questions
  setJobTitle: (title) => set({ jobTitle: title }),
  setSelectedTools: (updateFn) =>
    set((state) => {
      const newTools =
        typeof updateFn === "function"
          ? updateFn(state.selectedTools)
          : updateFn;
      console.log("Updated tools:", newTools);
      return { selectedTools: newTools };
    }),
  setInterviewSettings: (settings) => set({ interviewSettings: settings }),
  submitInterviewData: (navigate) => {
    const { jobTitle, selectedTools, interviewSettings } = get();

    if (!jobTitle || !selectedTools.length || !interviewSettings.style) {
      alert("Please complete all fields before submitting!");
      return;
    }

    const payload = {
      jobTitle,
      selectedTools,
      interviewSettings,
    };

    console.log("Sending payload:", payload);

    axios
      .post(`/resume/mockinterviews`, payload)
      .then((response) => {
        console.log("Response:", response.data);
        console.log(response.data.questions)
        set({ questions: response.data.data.questions }); // Store the generated questions
        navigate("/interviews"); // Redirect after storing questions
      })
      .catch((error) => {
        console.error("Error creating mock interview:", error);
        alert("There was an error. Please try again.");
      });
  },
}));


export default useMockInterviewStore;
