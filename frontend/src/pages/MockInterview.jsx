import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import useMockInterviewStore from "../store/mockinterviews";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const MockInterview = () => {
  const questionsData = useMockInterviewStore((state) => state.questions);
  console.log(questionsData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [lockedAnswers, setLockedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questionsData[currentQuestionIndex];

  const handleOptionChange = (event) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: event.target.value,
    });
  };

  const lockAnswer = () => {
    setLockedAnswers({
      ...lockedAnswers,
      [currentQuestionIndex]: selectedAnswers[currentQuestionIndex],
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10">
  <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
    {/* Loading State */}
    {questionsData.length === 0 ? (
      <h2 className="text-xl font-semibold text-center text-gray-700">Loading Questions...</h2>
    ) : showResults ? (
      // Results Section
      <div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Quiz Results</h2>
        <div className="space-y-4">
          {questionsData.map((q, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <p className="text-gray-900 font-medium">
                <strong>Q{index + 1}: </strong> {q.question}
              </p>
              <p
                className={`text-sm font-semibold ${
                  lockedAnswers[index] === q.correctAnswer ? "text-green-600" : "text-red-600"
                }`}
              >
                Your Answer: {lockedAnswers[index] || "Not Answered"}
              </p>
              {lockedAnswers[index] !== q.correctAnswer && (
                <p className="text-blue-500 text-sm">
                  Correct Answer: {q.correctAnswer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : (
      // Question Section
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Question {currentQuestionIndex + 1} of {questionsData.length}
        </h2>
        <p className="text-lg text-gray-700 mb-4">{currentQuestion.question}</p>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center bg-white p-3 rounded-lg shadow cursor-pointer transition ${
                selectedAnswers[currentQuestionIndex] === option
                  ? "border-2 border-blue-500 bg-blue-50"
                  : "hover:bg-gray-50"
              } ${lockedAnswers[currentQuestionIndex] ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                value={option}
                name={`question-${currentQuestionIndex}`}
                className="hidden"
                checked={selectedAnswers[currentQuestionIndex] === option}
                onChange={handleOptionChange}
                disabled={lockedAnswers[currentQuestionIndex] !== undefined}
              />
              <span className="w-5 h-5 flex items-center justify-center border-2 border-gray-400 rounded-full mr-3">
                {selectedAnswers[currentQuestionIndex] === option && <span className="w-3 h-3 bg-blue-500 rounded-full"></span>}
              </span>
              {option}
            </label>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="px-6 py-2 text-white font-semibold bg-gray-500 rounded-lg shadow hover:bg-gray-600 transition disabled:opacity-50"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>

          {lockedAnswers[currentQuestionIndex] === undefined ? (
            <button
              className="px-6 py-2 text-white font-semibold bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
              onClick={lockAnswer}
              disabled={!selectedAnswers[currentQuestionIndex]}
            >
              Lock Answer
            </button>
          ) : (
            <button
              className="px-6 py-2 text-white font-semibold bg-green-600 rounded-lg shadow hover:bg-green-700 transition"
              onClick={handleNext}
            >
              {currentQuestionIndex === questionsData.length - 1 ? "Finish" : "Next"}
            </button>
          )}
        </div>
      </div>
    )}
  </div>
</div>

      <Footer />
    </>
  );
};

export default MockInterview;
