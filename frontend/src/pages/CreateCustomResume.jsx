import React, { useState } from "react";
import { Grid, TextField, Button, Paper, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import Navbar from "../Components/Navbar";
import FlutterDashIcon from "@mui/icons-material/FlutterDash";
import axios from "axios";

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setResume(file);
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
              <Button
                variant="contained"
                component="label"
                sx={{ marginTop: "1rem" }}
              >
                Upload Resume
                <input type="file" hidden onChange={handleFileUpload} />
              </Button>
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
