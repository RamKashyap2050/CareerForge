import React, { useState, useEffect } from "react";
import useMockInterviewStore from "../store/mockinterviews";
import { FaClock, FaCheckCircle } from "react-icons/fa";

const MockInterview = () => {
  const { questions, interviewSettings } = useMockInterviewStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [lockedAnswers, setLockedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(interviewSettings.length * 60); // Convert to seconds

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (timeLeft <= 0) {
      handleNext(); // Move to next question when time runs out
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

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
    if (currentQuestionIndex < questions.length - 1) {
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
        {questions.length === 0 ? (
          <h2 className="text-xl font-semibold text-center text-gray-700">
            Loading Questions...
          </h2>
        ) : showResults ? (
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Quiz Results
            </h2>
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm"
                >
                  <p className="text-gray-900 font-medium">
                    <strong>Q{index + 1}: </strong> {q.question}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      lockedAnswers[index] === q.correctAnswer
                        ? "text-green-600"
                        : "text-red-600"
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
          <div>
            {/* Timer UI */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaClock className="text-blue-600" />
                <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
              </div>
            </div>

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
                    {selectedAnswers[currentQuestionIndex] === option && (
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    )}
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
                  {currentQuestionIndex === questions.length - 1
                    ? "Finish"
                    : "Next"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;
