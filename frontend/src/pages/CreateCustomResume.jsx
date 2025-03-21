import React, { useState } from "react";
import { Grid, TextField, Button, Paper, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import Navbar from "../Components/Navbar";
import FlutterDashIcon from "@mui/icons-material/FlutterDash";
import axios from "axios";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import Footer from "../Components/Footer";

const RootContainer = styled(Box)(({ theme }) => ({
  padding: "2rem",
  [theme.breakpoints.down("sm")]: {
    padding: "1rem",
  },
}));
const ChatBox = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "1rem",
  height: "100%",
}));

const CreateCustomResume = () => {
  const [userInput, setuserinput] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modifiedResumeInUse, setModifiedResume] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setResume(file);
  };

  //Resume Parser Function
  const handleResumeModification = async () => {
    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      formData.append("resumeText", resume);

      // API call to get the modified resume from the backend
      const response = await axios.post("/resume/parseresume", formData);

      let modifiedResume = response.data.data;
      console.log(modifiedResume);
      // Check if the response starts with backticks and remove them
      if (typeof modifiedResume === "string") {
        console.log("Received string with backticks, removing them...");
        modifiedResume = modifiedResume.replace(/```json|```/g, "");
        modifiedResume = JSON.parse(modifiedResume); // Now parse the cleaned string
      }

      // Check if the modifiedResume is correctly formatted as JSON
      console.log("Modified Resume after parsing", modifiedResume);

      // Now pass the modifiedResume to the PDF generator
      generatePDF(modifiedResume);
    } catch (error) {
      console.error("Error modifying resume:", error);
    }
  };

  const generatePDF = async (modifiedResume) => {
    console.log("I am Modified Resume entering generate PDF", modifiedResume);

    if (!modifiedResume.bio) {
      console.error("Missing Bio");
      return;
    }

    const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]); // A4 size in points: 595x842
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = 12;
    let yPosition = 800;
    const lineHeight = 14;
    const margin = 50;
    const { width, height } = page.getSize();
    const maxWidth = width - margin * 2;

    const sanitizeText = (text) => {
      return text
        .replace(/\n/g, " ") // Replace newlines with spaces
        .replace(/[^\x00-\x7F]/g, ""); // Remove all non-ASCII characters (including emojis)
    };

    const wrapText = (text, maxWidth, font, fontSize) => {
      const sanitizedText = sanitizeText(text);
      const words = sanitizedText.split(" ");
      let lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = font.widthOfTextAtSize(
          currentLine + " " + word,
          fontSize
        );
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    const drawText = (textElements, font, fontSize, options = {}) => {
      const { x = margin, color = rgb(0, 0, 0) } = options;
      let xPosition = x;

      textElements.forEach((element) => {
        const { text, isBold, isItalic } = element;
        const currentFont = isBold ? boldFont : font;

        const words = wrapText(text, maxWidth, currentFont, fontSize);
        words.forEach((line) => {
          if (yPosition < margin + lineHeight) {
            page = pdfDoc.addPage([595, 842]); // Add new page if necessary
            yPosition = height - margin;
          }

          page.drawText(line, {
            x: xPosition,
            y: yPosition,
            size: fontSize,
            font: currentFont,
            color: color,
          });
          yPosition -= lineHeight;
        });
      });
    };

    const drawHeading = (heading, fontSize, options = {}) => {
      const { align = "left", color = rgb(0, 0, 0) } = options;
      const headingWidth = boldFont.widthOfTextAtSize(heading, fontSize);
      let xPosition = margin;

      if (align === "center") {
        xPosition = (width - headingWidth) / 2;
      } else if (align === "right") {
        xPosition = width - margin - headingWidth;
      }

      page.drawText(heading, {
        x: xPosition,
        y: yPosition,
        size: fontSize,
        font: boldFont,
        color: color,
      });

      yPosition -= lineHeight * 1.5;
    };

    // Drawing Bio
    drawHeading(
      `${modifiedResume.bio.firstName} ${modifiedResume.bio.lastName}`,
      fontSize + 2,
      { align: "left", color: rgb(0, 0, 0) }
    );
    drawText(
      [{ text: `Email: ${modifiedResume.bio.email}`, isBold: false }],
      font,
      fontSize
    );
    drawText(
      [{ text: `Phone: ${modifiedResume.bio.phoneNumber}`, isBold: false }],
      font,
      fontSize
    );
    modifiedResume.bio.location &&
      drawText(
        [{ text: `Location: ${modifiedResume.bio.location}`, isBold: false }],
        font,
        fontSize
      );
    modifiedResume.bio.linkedin &&
      drawText(
        [{ text: `LinkedIn: ${modifiedResume.bio.linkedin}`, isBold: false }],
        font,
        fontSize
      );
    modifiedResume.bio.github &&
      drawText(
        [{ text: `GitHub: ${modifiedResume.bio.github}`, isBold: false }],
        font,
        fontSize
      );

    modifiedResume.bio.website &&
      drawText(
        [{ text: `Website: ${modifiedResume.bio.website}`, isBold: false }],
        font,
        fontSize
      );
    yPosition -= lineHeight * 2;

    // Drawing Summary
    drawHeading("Summary", fontSize + 2, { align: "left" });
    const summaryLines = wrapText(
      modifiedResume.summary,
      maxWidth,
      font,
      fontSize
    );
    summaryLines.forEach((line) => drawText([{ text: line }], font, fontSize));
    yPosition -= lineHeight * 2;

    // Drawing Skills
    drawHeading("Skills", fontSize + 2, { align: "left" });
    const skillsText = modifiedResume.skills.join(", ");
    drawText([{ text: skillsText }], font, fontSize);
    yPosition -= lineHeight * 2;

    // Drawing Experiences with bullet points
    drawHeading("Experience", fontSize + 2, { align: "left" });
    modifiedResume.experiences.forEach((exp) => {
      drawHeading(`${exp.companyName} - ${exp.roleTitle}`, fontSize);
      drawHeading(`${exp.startDate} - ${exp.endDate}`, fontSize);
      exp.experienceDetails.forEach((detail) => {
        // Adding a bullet point before each experience detail
        const wrappedDetails = wrapText(
          `• ${detail}`,
          maxWidth,
          font,
          fontSize
        );
        wrappedDetails.forEach((line) =>
          drawText([{ text: line }], font, fontSize)
        );
      });
      yPosition -= lineHeight * 2;
    });

    drawHeading("Education", fontSize + 2, { align: "left" });

    modifiedResume.education.forEach((edu) => {
      drawHeading(`${edu.institution}`, fontSize);
      drawHeading(`${edu.degreeType}`, fontSize);

      edu.educationDetails.forEach((detail) => {
        // Adding a bullet point before each experience detail
        const wrappedDetails = wrapText(
          `• ${detail}`,
          maxWidth,
          font,
          fontSize
        );
        wrappedDetails.forEach((line) =>
          drawText([{ text: line }], font, fontSize)
        );
      });

      // Adjust yPosition and check if a new page is needed for the next entry
      yPosition -= lineHeight * 2;
      if (yPosition < margin + lineHeight) {
        page = pdfDoc.addPage([595, 842]); // Add new page if necessary
        yPosition = height - margin;
      }
    });

    // Saving PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${modifiedResume.bio.lastName}_Resume.pdf`;
    link.click();
  };

  const handleChatSubmit = async (prompt) => {
    setLoading(true); // Start the loading animation

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("jobDescription", jobDescription);

      if (resume) {
        // Check if resume is a string (pasted text) or a file
        if (typeof resume === "string") {
          formData.append("resumeText", resume); // Append as text
        } else {
          formData.append("resume", resume); // Append as a file
        }
      }

      const response = await axios.post(`/resume/chats`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newChatEntry = {
        prompt,
        response: response.data.message,
      };

      setChatHistory((prevHistory) => [...prevHistory, newChatEntry]);
      setLoading(false); // Stop the loading animation
      setuserinput(""); // Clear the input field after sending
    } catch (error) {
      console.error("Error submitting chat:", error);
      setLoading(false); // Stop the loading animation even in case of error
    }
  };

  const formatResponse = (responseText) => {
    const lines = responseText.split("\n");

    return lines.map((line, index) => {
      if (line.startsWith("##")) {
        // Render as a heading
        return (
          <Typography variant="h6" gutterBottom key={index}>
            {line.replace("##", "").trim()}
          </Typography>
        );
      } else if (line.startsWith("* ")) {
        // Handle list items
        const boldMatch = line.match(/\*\*(.*?)\*\*/);
        const boldText = boldMatch ? boldMatch[1] : null;
        const remainingText = boldText
          ? line.replace(`**${boldText}**`, "").replace("*", "").trim()
          : line.replace("*", "").trim();

        return (
          <li key={index}>
            {boldText ? (
              <Typography variant="body1" component="span">
                <strong>{boldText}</strong> {remainingText}
              </Typography>
            ) : (
              <Typography variant="body1">{remainingText}</Typography>
            )}
          </li>
        );
      } else if (line.startsWith("**")) {
        // Render as bold text
        return (
          <Typography
            variant="body1"
            key={index}
            style={{ fontWeight: "bold" }}
          >
            {line.replace(/\*\*/g, "").trim()}
          </Typography>
        );
      } else {
        // Render as regular text
        return (
          <Typography variant="body1" key={index}>
            {line.trim()}
          </Typography>
        );
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left Panel - Job & Resume */}
          <div className="col-span-2 flex flex-col gap-6">
            {/* Job Description Section */}
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Paste Job Description
              </h2>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-4 h-40 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 resize-none"
                placeholder="Enter job description..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {/* Resume Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Upload or Paste Your Resume
              </h2>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-4 h-40 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 resize-none"
                placeholder="Paste your resume..."
                value={typeof resume === "string" ? resume : resume.name || ""}
                onChange={(e) => setResume(e.target.value)}
              />
              <div className="flex flex-col md:flex-row gap-4 mt-6 items-center justify-center">
                {/* Upload Button */}
                <label className="relative flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white font-semibold text-lg rounded-lg shadow-md cursor-pointer transition-all duration-300 transform hover:scale-102 hover:shadow-lg">
                  📂 Upload Resume
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                {/* Generate Resume Button */}
                <button
                  className="relative flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500 text-white font-semibold text-lg rounded-lg shadow-md transition-all duration-300 transform hover:scale-102 hover:shadow-lg"
                  onClick={handleResumeModification}
                >
                  ⚡ Generate Resume
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Chat Section */}
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
              🦜 Ask Swiftlet!
            </h2>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[300px]">
              {chatHistory.map((chat, index) => (
                <div key={index} className="space-y-2">
                  <p className="bg-teal-700 text-white p-3 rounded-xl max-w-xs ml-auto shadow-md">
                    {chat.prompt}
                  </p>
                  <div className="flex items-start space-x-2">
                    🦜
                    <p className="bg-teal-500 text-white p-3 rounded-xl max-w-xs shadow-md">
                      {formatResponse(chat.response)}
                    </p>
                  </div>
                </div>
              ))}
              {loading && <p className="text-gray-500">Loading...</p>}
            </div>

            {/* Predefined Queries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                className="w-full bg-teal-700 text-white p-3 rounded-lg hover:bg-teal-800 transition shadow-md"
                onClick={() => handleChatSubmit("Create a cover letter")}
              >
                ✍️ Create Cover Letter
              </button>
              <button
                className="w-full bg-teal-700 text-white p-3 rounded-lg hover:bg-teal-800 transition shadow-md"
                onClick={() => handleChatSubmit("Why am I a good fit?")}
              >
                🔍 Why Am I A Good Fit?
              </button>
              <button
                className="w-full bg-teal-700 text-white p-3 rounded-lg hover:bg-teal-800 transition shadow-md"
                onClick={() => handleChatSubmit("Suggest similar roles")}
              >
                📌 Similar Roles
              </button>
            </div>

            {/* User Input */}
            <form
              className="mt-4 flex"
              onSubmit={(e) => {
                e.preventDefault();
                handleChatSubmit(userInput);
              }}
            >
              <input
                type="text"
                className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md"
                placeholder="Type your message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button
                type="submit"
                className="ml-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CreateCustomResume;
