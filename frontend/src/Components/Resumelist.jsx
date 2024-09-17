import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const ResumeList = ({ onNewResume, onPrint, onDownload, onEdit }) => {
  const [resumes, setResumes] = useState([]);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    axios
      .get("/resume/resumes", {
        withCredentials: true,
      })
      .then((response) => {
        setResumes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching resumes:", error);
      });
  }, []);


  const onDelete = (id) => {
    // logic for deleting resume
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          My Resumes
        </Typography>

        <Button
          variant="contained"
          size="medium"
          sx={{
            backgroundColor: hover ? "#424242" : "#333333",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
          onClick={onNewResume}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Create New Resume
        </Button>
      </Box>

      {resumes.length > 0 ? (
        <Grid container spacing={2}>
          {resumes.map((resume) => (
            <Grid item xs={12} md={6} lg={4} key={resume.id}>
              <Card sx={{ minHeight: "150px" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {resume.resumeBio.FirstName} {resume.resumeBio.LastName}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    gutterBottom
                  >
                    {resume.resumeBio.Email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {resume.resumeBio.PhoneNumber}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: "italic",
                      color: resume.Status === "draft" ? "orange" : "green",
                    }}
                  >
                    {resume.Status === "draft" ? "Draft" : "Completed"}
                  </Typography>
                </CardActions>
                <CardActions>
                  {resume.Status === "Completed" && (
                    <>
                      <Button
                        startIcon={<DownloadIcon />}
                        onClick={() => onDownload(resume.id)}
                        color="primary"
                      >
                        Download
                      </Button>
                      <Button
                        startIcon={<PrintIcon />}
                        onClick={() => onPrint(resume.id)}
                        color="primary"
                      >
                        Print
                      </Button>
                    </>
                  )}
                  <Tooltip title="Edit Resume" arrow>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => onEdit(resume.id)}
                    >
                      Edit
                    </Button>
                  </Tooltip>

                  <Tooltip title="Delete Resume" arrow>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => onDelete(resume.id)}
                    >
                      Delete
                    </Button>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          No resumes available. Please create a new resume.
        </Typography>
      )}
    </div>
  );
};

export default ResumeList;
