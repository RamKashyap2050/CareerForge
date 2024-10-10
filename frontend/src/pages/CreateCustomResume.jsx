import React, { useState } from "react";
import { Grid, TextField, Button, Paper, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import Navbar from "../Components/Navbar";
import FlutterDashIcon from "@mui/icons-material/FlutterDash";
import axios from "axios";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

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

    const sanitizeText = (text) => text.replace(/\n/g, " ");

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
        [{ text: `Location: ${modifiedResume.bio.linkedin}`, isBold: false }],
        font,
        fontSize
      );
    modifiedResume.bio.github &&
      drawText(
        [{ text: `Location: ${modifiedResume.bio.github}`, isBold: false }],
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
      drawHeading(`${edu.institution} - ${edu.degreeType}`, fontSize);
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
      <RootContainer>
        <Grid container spacing={3}>
          {/* Job Description Section */}
          <Grid item xs={12} md={5} lg={4}>
            <Paper sx={{ padding: "1rem", height: "100%" }} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Paste Job Description Here
              </Typography>
              <TextField
                label="Job Description"
                multiline
                rows={10}
                variant="outlined"
                fullWidth
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </Paper>
          </Grid>

          {/* Resume Upload Section */}
          <Grid item xs={12} md={5} lg={4}>
            <Paper sx={{ padding: "1rem", height: "100%" }} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Copy & Paste Your Resume or Upload
              </Typography>
              <TextField
                label="Paste Your Resume"
                multiline
                rows={10}
                variant="outlined"
                fullWidth
                value={typeof resume === "string" ? resume : resume.name || ""}
                onChange={(e) => setResume(e.target.value)}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    marginTop: "1rem",
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem",
                    minWidth: "120px",
                  }}
                >
                  Upload Resume
                  <input type="file" hidden onChange={handleFileUpload} />
                </Button>
                &nbsp;
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    marginTop: "1rem",
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem",
                    minWidth: "120px",
                  }}
                  onClick={handleResumeModification}
                >
                  Create a Custom Resume
                  {/* <input type="file" hidden onChange={handleFileUpload} /> */}
                </Button>
              </div>
            </Paper>
          </Grid>

          {/* Chat Section */}
          <Grid item xs={12} md={2} lg={4}>
            <ChatBox elevation={3}>
              <Typography variant="h6" gutterBottom>
                <FlutterDashIcon />
                Ask Swiftlet!
              </Typography>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  overflowY: "auto",
                  marginBottom: "1rem",
                }}
              >
                {chatHistory.map((chat, index) => (
                  <div key={index} style={{ marginBottom: "1rem" }}>
                    {/* User prompt styling */}
                    <p
                      style={{
                        padding: "1rem",
                        color: "#ffffff", // White text for contrast
                        marginBottom: "0.5rem",
                        fontSize: "1rem",
                        borderRadius: "15px 15px 0 15px",
                        backgroundColor: "#004d40", // Softer dark teal background
                        textAlign: "right",
                        justifyContent: "flex-end",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // Softer shadow for depth
                        maxWidth: "75%",
                        marginLeft: "auto",
                      }}
                    >
                      {chat.prompt}
                    </p>

                    {/* Response styling */}
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                      <FlutterDashIcon
                      // style={{ color: "#00796b", marginRight: "0.5rem" }}
                      />
                      <div
                        style={{
                          padding: "1rem",
                          color: "#ffffff", // White text for better readability
                          marginBottom: "0.5rem",
                          borderRadius: "15px 15px 0 15px",
                          backgroundColor: "#00796b", // Matching navbar color with slightly lighter tone
                          textAlign: "left",
                          justifyContent: "flex-start",
                          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                          maxWidth: "75%",
                        }}
                      >
                        {formatResponse(chat.response)}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="loading-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </div>
                )}
              </div>

              {/* Buttons for predefined queries */}
              <Box sx={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    marginBottom: "0.5rem",
                    borderRadius: "15px 15px 0 15px",
                    backgroundColor: "#004d40", // Softer dark teal background
                    textAlign: "right",
                    justifyContent: "flex-end",
                    boxShadow: "none",
                    maxWidth: "75%",
                    marginLeft: "auto",
                  }}
                  onClick={() => handleChatSubmit("Create a cover letter")}
                >
                  Create Cover Letter
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    marginBottom: "0.5rem",
                    borderRadius: "15px 15px 0 15px",
                    backgroundColor: "#004d40", // Softer dark teal background
                    textAlign: "right",
                    justifyContent: "flex-end",
                    boxShadow: "none",
                    maxWidth: "75%",
                    marginLeft: "auto",
                  }}
                  onClick={() => handleChatSubmit("Why am I a good fit?")}
                >
                  Why Am I A Good Fit?
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    borderRadius: "15px 15px 0 15px",
                    backgroundColor: "#004d40", // Softer dark teal background
                    textAlign: "right",
                    justifyContent: "flex-end",
                    boxShadow: "none",
                    maxWidth: "75%",
                    marginLeft: "auto",
                  }}
                  onClick={() => handleChatSubmit("Suggest similar roles")}
                >
                  Similar Roles
                </Button>
              </Box>

              {/* Text input for user typing */}
              <Box
                component="form"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChatSubmit(userInput);
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Type your message..."
                  sx={{ marginRight: "0.5rem" }}
                  value={userInput}
                  onChange={(e) => setuserinput(e.target.value)}
                />
                <Button type="submit" variant="contained">
                  Send
                </Button>
              </Box>
            </ChatBox>
          </Grid>
        </Grid>
      </RootContainer>
    </>
  );
};

export default CreateCustomResume;
