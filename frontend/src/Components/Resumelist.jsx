import React, { useState } from "react";

const ResumeList = ({ resumes, onNewResume, onPrint, onDownload }) => {
  const [hover, setHover] = useState(false);

  const styles = {
    button: {
      backgroundColor: "#424242", // Dark Grey
      color: "#ffffff", // White text for contrast
      padding: "12px 24px",
      fontSize: "16px",
      borderRadius: "30px",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      transition: "all 0.3s ease",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    buttonHover: {
      backgroundColor: "#333333", // Slightly darker grey on hover
      transform: "scale(1.05)",
    },
  };

  return (
    <div>
      <button
        style={
          hover ? { ...styles.button, ...styles.buttonHover } : styles.button
        }
        onClick={onNewResume}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        Create New Resume
      </button>
      <h2>My Resumes</h2>
      <ul>
        {resumes.map((resume) => (
          <li key={resume.id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <button onClick={() => onPrint(resume.id)}>🖨️ Print</button>
                <button onClick={() => onDownload(resume.id)}>
                  📥 Download
                </button>
              </div>
              <span>{resume.name}</span>
              <div>
                <button>Edit</button>
                <button>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumeList;
