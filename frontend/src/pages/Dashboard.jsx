import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import ResumeList from "../Components/Resumelist";
import UserBioStep from "../Components/UserBioStep";
import SummaryStep from "../Components/SummaryStep";
import SkillsStep from "../Components/SkillsStep";
import ExperienceStep from "../Components/ExperienceStep";
import Paper from "../Components/Paper";
import { format } from "date-fns";
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import EducationStep from "../Components/EducationStep";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import axios from "axios";
const Dashboard = () => {
  // Use this function in your component or trigger it with a button click

  const [resumes, setResumes] = useState([]);
  const [isCreatingResume, setIsCreatingResume] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState({
    bio: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      githubLink: "",
      linkedinProfile: "",
      location: "",
    },
    summary: "",
    skills: [],
    experiences: [],
    education: [],
  });

  const [paperContent, setPaperContent] = useState([]);
  const [isActiveStep, setIsActiveStep] = useState(false); // New state to track whether an active step is in progress
  //New Code for Editing Resumes

  const [isEditing, setIsEditing] = useState(false); // Control whether in edit mode
  const [resumeId, setResumeId] = useState(null); // Track the selected resume ID
  const [loading, setLoading] = useState(false); // For handling loading state
  const [isStepInitialized, setIsStepInitialized] = useState(false);
  const [isCompleted, setisCompleted] = useState(false);
  // UseEffect to clean up localStorage when the component unmounts
  useEffect(() => {
    return () => {
      // Clear resumeId from localStorage when the component unmounts or reloads
      localStorage.removeItem("resumeId");
    };
  }, []); // This runs only when the component unmounts
  // useEffect that only runs when a resume is selected for editing
  useEffect(() => {
    if (isEditing && resumeId) {
      setLoading(true);
      setIsCreatingResume(true); // Mark as editing/creating mode

      axios
        .get(`/resume/resumes/${resumeId}`, { withCredentials: true })
        .then((response) => {
          const data = response.data;
          console.log("Fetched resume data:", data);

          // Set resume data in state
          setResumeData({
            bio: data.resumeBio || {},
            summary: data.resumeSummary?.Summary || "",
            skills:
              data.resumeSkills?.Skills?.split(",").map((skill) =>
                skill.trim()
              ) || [], // Ensures skills are stored as an array
            experiences: data.experiences || [],
            education: data.education || [],
          });

          // Initialize paper content based on the fetched resume data
          const initializedPaperContent = [
            // Contact information
            `Phone: ${data.resumeBio?.PhoneNumber || ""}, Email: ${
              data.resumeBio?.Email || ""
            }, LinkedIn: ${data.resumeBio?.LinkedInLink || ""}, Github: ${
              data.resumeBio?.GithubLink || ""
            }, Location: ${data.resumeBio?.Location || ""}`,

            // Summary
            data.resumeSummary?.Summary || "",

            // Skills as a list
            `<ul>${(data.resumeSkills?.Skills || "")
              .split(",")
              .map((skill) => `<li>${skill.trim()}</li>`)
              .join("")}</ul>`,

            // Experiences formatted into a list
            (data.resumeExperience || [])
              .map(
                (exp) =>
                  `<strong>${exp?.CompanyName || exp.companyName || ""} (${
                    exp?.StartDate || exp.startDate || ""
                  } - ${exp.EndDate || exp.endDate || "Present"}): ${
                    exp?.RoleTitle || exp.occupation || ""
                  }</strong><ul>${(exp?.ExperienceSummary || exp.summary || "")
                    .split("\n")
                    .map((point) => `<li>${point}</li>`)
                    .join("")}</ul>`
              )
              .join(""),

            // Education section
            (data.education || [])
              .map(
                (edu) =>
                  `${edu.instituteName || ""} - ${edu.degreeType || ""} (${
                    edu.startDate || ""
                  } - ${
                    edu.currentlyEnrolled ? "Present" : edu.endDate || ""
                  }): ${edu.gradesAchievements || ""}`
              )
              .join(", "),
          ];

          // Set paper content in state
          setPaperContent(initializedPaperContent);

          // Set the initial step based on available data (ensure this runs only once)
          if (!isStepInitialized) {
            if (data.resumeEducation) {
              setCurrentStep(4);
            } else if (
              data.resumeExperience?.length > 0 ||
              data.experiences?.length > 0
            ) {
              setCurrentStep(3);
            } else if (data.resumeSkills?.Skills?.length > 0) {
              setCurrentStep(2);
            } else if (data.resumeSummary?.Summary) {
              setCurrentStep(1);
            } else {
              setCurrentStep(0);
            }
            setIsStepInitialized(true); // Mark steps as initialized
          }
        })
        .catch((error) => {
          console.error("Error fetching resume data:", error);
        })
        .finally(() => {
          setLoading(false); // Stop loading once data is fetched
        });
    }
  }, [isEditing, resumeId, isStepInitialized]);

  const handleEditResume = (id) => {
    console.log("Editing Resume with ID:", id);
    localStorage.setItem("resumeId", id);
    setResumeId(id);
    setIsEditing(true);
  };

  useEffect(() => {
    console.log("Updated resumeId:", resumeId);
    console.log("Updated isEditing:", isEditing);
  }, [resumeId, isEditing]);

  // UseEffect to handle the page refresh or close alert based on active steps
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isActiveStep) {
        // Only show the alert if the user is in an active step
        event.preventDefault();
        event.returnValue = ""; // Display a browser-native warning
        localStorage.removeItem("resumeId");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload); // Cleanup on unmount
    };
  }, [isActiveStep]); // Re-run whenever the active state changes

  console.log(paperContent);
  console.log(resumeData);
  const handleNewResume = () => {
    setIsActiveStep(true); // Set step as active when advancing
    setIsCreatingResume(true);
    setCurrentStep(0);
    setResumeData({
      bio: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        githubLink: "",
        linkedinProfile: "",
        location: "",
        city: "",
        province: "",
        country: "",
      },
      summary: "",
      skills: [],
      experiences: [],
      education: [],
    });
    setPaperContent([]);
  };

  const handleNextStep = () => {
    let newContent = "";
    console.log("In Next Step I am Resume Data", resumeData);
    switch (currentStep) {
      case 0:
        newContent = `Phone: ${
          resumeData.bio.phoneNumber || resumeData.bio.PhoneNumber || ""
        }, Email: ${
          resumeData.bio.email || resumeData.bio.Email || ""
        }, LinkedIn: ${
          resumeData.bio.linkedinProfile || resumeData.bio.LinkedInLink || ""
        }, Github: ${
          resumeData.bio.githubLink || resumeData.bio.GithubLink || ""
        }, Location: ${
          resumeData.bio.location || resumeData.bio.Location || ""
        }`;
        break;
      case 1:
        newContent = resumeData.summary || "";
        break;
      case 2:
        newContent = `<ul>${(
          resumeData.skills ||
          resumeData.Skills.skills ||
          []
        )
          .map((skill) => `<li>${skill}</li>`)
          .join("")}</ul>`;
        break;
      case 3:
        newContent = resumeData.experiences
          .map(
            (exp) =>
              `<strong>${exp.CompanyName || exp.companyName || ""} (${
                exp.StartDate || exp.startDate || ""
              } - ${
                exp.currentlyWorking ? "Present" : exp.endDate || "Present"
              }): ${exp.RoleTitle || exp.occupation || ""}</strong><ul>${(
                exp.ExperienceSummary ||
                exp.summary ||
                ""
              )
                .split("\n")
                .map((point) => `<li>${point}</li>`)
                .join("")}</ul>`
          )
          .join("");
        break;

      case 4: // EducationStep
        newContent = (resumeData.education || [])
          .map(
            (edu) =>
              `${edu.instituteName || edu.InstitueName || ""} - ${
                edu.degreeType || edu.DegreeType || ""
              } (${edu.startDate || edu.StartDate || ""} - ${
                edu.currentlyEnrolled
                  ? "Present"
                  : edu.endDate || edu.EndDate || ""
              }): ${edu.gradesAchievements || edu.EducationSummary || ""}`
          )
          .join(", ");
        break;
      default:
        break;
    }

    // Update paper content and advance to the next step
    setPaperContent((prevContent) => {
      const updatedContent = [...prevContent];
      updatedContent[currentStep] = newContent; // Replace the content for the current step
      return updatedContent;
    });

    // Prevent navigation beyond the last step (e.g., step 4 in your case)
    if (currentStep < 4) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setPaperContent(paperContent.slice(0, -1)); // Remove the last step's content
      setCurrentStep((prevStep) => prevStep - 1); // Move to the previous step
    }
  };

  const handleBioChange = (e) => {
    const { name, value } = e.target;
    setResumeData({ ...resumeData, bio: { ...resumeData.bio, [name]: value } });
    setIsActiveStep(true); // Set step as active when advancing
  };

  const handleSummaryChange = (e) => {
    setResumeData({ ...resumeData, summary: e.target.value });
    setIsActiveStep(true); // Set step as active when advancing
  };

  // const handleSkillAdd = (skill) => {
  //   setResumeData({ ...resumeData, skills: [...resumeData.skills, skill] });
  // };
  // const handleSkillAdd = (skill) => {
  //   setResumeData((prevData) => ({
  //     ...prevData,
  //     skills: [...prevData.skills, skill],
  //   }));
  // };

  // // Function to update the skills array
  // const updateSkills = (updatedSkills) => {
  //   console.log("Updating skills in parent:", updatedSkills); // Debugging
  //   setResumeData((prevData) => ({
  //     ...prevData,
  //     skills: updatedSkills,
  //   }));
  // };

  // Add a new skill and update paper content
  const handleSkillAdd = (skill) => {
    setIsActiveStep(true); // Set step as active when advancing
    setResumeData((prevData) => {
      const updatedSkills = [...prevData.skills, skill];
      const updatedResumeData = {
        ...prevData,
        skills: updatedSkills,
      };

      // Immediately update the paper content for skills
      setPaperContent((prevContent) => {
        const updatedContent = [...prevContent];
        updatedContent[2] = `<ul>${updatedSkills
          .map((skill) => `<li>${skill}</li>`)
          .join("")}</ul>`;
        return updatedContent;
      });

      return updatedResumeData;
    });
  };

  // Function to update the skills array
  const updateSkills = (updatedSkills) => {
    console.log("Updating skills in parent:", updatedSkills);
    setResumeData((prevData) => {
      const updatedResumeData = {
        ...prevData,
        skills: updatedSkills,
      };

      // Immediately update the paper content for skills
      setPaperContent((prevContent) => {
        const updatedContent = [...prevContent];
        updatedContent[2] = `<ul>${updatedSkills
          .map((skill) => `<li>${skill}</li>`)
          .join("")}</ul>`;
        return updatedContent;
      });

      return updatedResumeData;
    });
  };

  const handleEducationChange = (newEducation) => {
    setIsActiveStep(true); // Set step as active when advancing
    setResumeData({ ...resumeData, education: newEducation });
  };

  const generatePDF = async () => {
    setIsActiveStep(false); // Disable active state when generating PDF (final step)
    console.log("Starting PDF generation...");
    console.log("Resume Data:", resumeData);

    try {
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([595, 842]); // A4 size in points: 595x842
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
      const sanitizeText = (text) => text.replace(/\n/g, " ");

      const { width, height } = page.getSize();
      const fontSize = 12;
      let yPosition = height - 50;
      const lineHeight = 14;
      const margin = 50;
      const maxWidth = width - margin * 2;

      const wrapText = (text, maxWidth, font, fontSize) => {
        console.log("Wrapping text:", text);
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
        console.log("Wrapped lines:", lines);
        return lines;
      };

      const drawHeading = async (heading, fontSize, options = {}) => {
        const { x = margin, align = "left", color = rgb(0, 0, 0) } = options;
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold); // Embedding bold font

        // Calculate x position based on alignment
        let xPosition = x; // Default to left alignment
        const headingWidth = boldFont.widthOfTextAtSize(heading, fontSize);

        if (align === "center") {
          xPosition = (width - headingWidth) / 2; // Center the heading on the page
        } else if (align === "right") {
          xPosition = width - margin - headingWidth; // Align to the right
        }

        // Draw the heading text
        page.drawText(heading, {
          x: xPosition,
          y: yPosition,
          size: fontSize,
          font: boldFont, // Use bold font for heading
          color: color,
        });

        // Adjust yPosition to add spacing after the heading
        yPosition -= lineHeight * 1.5; // Add extra space after the heading
      };

      const parseHtmlAndDraw = (element) => {
        let textElements = []; // Initialize an array to hold all text elements in a block

        element.childNodes.forEach((node) => {
          let currentFont = font; // Default font
          let currentFontSize = fontSize; // Default font size
          let color = rgb(0, 0, 0); // Default color

          // Handle Text Nodes (Plain text)
          if (node.nodeType === Node.TEXT_NODE) {
            const textContent = node.textContent.trim();
            if (textContent) {
              // Add plain text to the textElements array
              textElements.push({
                text: textContent,
                isBold: false,
                isItalic: false,
              });
            }
          }

          // Handle Element Nodes (HTML tags)
          else if (node.nodeType === Node.ELEMENT_NODE) {
            switch (node.tagName.toLowerCase()) {
              case "strong": // Bold text
                const boldText = node.textContent.trim();
                if (boldText) {
                  // Add bold text to the textElements array
                  textElements.push({
                    text: boldText,
                    isBold: true,
                    isItalic: false,
                  });
                }
                break;

              case "em": // Italic text
                const italicText = node.textContent.trim();
                if (italicText) {
                  // Add italic text to the textElements array
                  textElements.push({
                    text: italicText,
                    isBold: false,
                    isItalic: true,
                  });
                }
                break;

              case "br": // Line break
                // Draw all accumulated text before handling the line break
                if (textElements.length > 0) {
                  drawText(textElements, currentFontSize, { color });
                  textElements = []; // Clear the array after drawing
                }
                yPosition -= lineHeight; // Move to the next line
                break;

              case "p": // Paragraphs
                // Recursively process the paragraph and its contents
                if (textElements.length > 0) {
                  drawText(textElements, currentFontSize, { color });
                  textElements = []; // Clear the array after drawing the paragraph
                }
                parseHtmlAndDraw(node); // Recursively process child nodes
                yPosition -= lineHeight * 1.5; // Add space after the paragraph
                break;
              case "ul": // Unordered List
              case "ol": // Ordered List
                // Draw each list item in the unordered/ordered list
                node.childNodes.forEach((li) => {
                  if (li.tagName.toLowerCase() === "li") {
                    const bullet =
                      node.tagName.toLowerCase() === "ul"
                        ? "• "
                        : `${listItemNumber++}. `;
                    const liText = li.textContent.trim();

                    // Accumulate and draw each list item
                    textElements.push({
                      text: bullet + liText,
                      isBold: false,
                      isItalic: false,
                    });
                    drawText(textElements, fontSize, { color });
                    textElements = [];
                    yPosition -= lineHeight;
                  }
                });
                yPosition -= 8; // Add extra spacing after the list
                break;
              default:
                // Recursively handle other nested elements
                parseHtmlAndDraw(node);
                break;
            }
          }
        });

        // After all nodes are processed, draw the remaining text
        if (textElements.length > 0) {
          drawText(textElements, fontSize, { color: rgb(0, 0, 0) });
        }
      };

      const drawText = (textElements, fontSize, options = {}) => {
        // Ensure textElements is an array before proceeding
        if (!Array.isArray(textElements)) {
          console.error("Error: textElements is not an array:", textElements);
          return; // Stop execution if it's not an array
        }

        const { x = margin, align = "left", color = rgb(0, 0, 0) } = options;
        let xPosition = x;

        textElements.forEach((element) => {
          const { text, isBold, isItalic } = element;
          const currentFont = isBold ? boldFont : isItalic ? italicFont : font;

          // Sanitize text to remove newlines and split text into paragraphs
          const sanitizedText = text.replace(/\n/g, " ");
          const words = sanitizedText.split(" ");
          words.forEach((word) => {
            const wordWidth = currentFont.widthOfTextAtSize(word, fontSize);

            if (xPosition + wordWidth > maxWidth) {
              // Line break if word exceeds max width
              yPosition -= lineHeight;
              xPosition = margin; // Reset x position after line break
            }

            page.drawText(word, {
              x: xPosition,
              y: yPosition,
              size: fontSize,
              font: currentFont,
              color: color,
            });

            // Move xPosition to the right after drawing the word
            xPosition +=
              wordWidth + currentFont.widthOfTextAtSize(" ", fontSize);
          });
        });

        // Move yPosition for spacing between paragraphs or elements
        yPosition -= 8;
      };

      const parseHtml = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        console.log("Parsed HTML Body:", doc.body);
        return doc.body;
      };

      // const drawSeparator = () => {
      //   if (yPosition < margin + lineHeight * 2) {
      //     page = pdfDoc.addPage([595, 842]);
      //     yPosition = height - margin;
      //   }
      //   yPosition -= lineHeight;
      //   page.drawLine({
      //     start: { x: margin, y: yPosition },
      //     end: { x: width - margin, y: yPosition },
      //     thickness: 1,
      //     color: rgb(0.6, 0.6, 0.6),
      //   });
      //   yPosition -= lineHeight;
      // };

      const drawPoints = async (pointsArray, fontSize, options = {}) => {
        const { x = margin, align = "left", color = rgb(0, 0, 0) } = options;
        const bulletPointFont = await pdfDoc.embedFont(StandardFonts.Helvetica); // Regular font for points

        pointsArray.forEach((point) => {
          // Handle line wrapping and ensure each point starts with a bullet
          const wrappedLines = wrapText(
            point,
            maxWidth,
            bulletPointFont,
            fontSize
          );
          wrappedLines.forEach((line) => {
            if (yPosition < margin + lineHeight) {
              page = pdfDoc.addPage([595, 842]); // Add new page if text overflows
              yPosition = height - margin;
            }

            let xPosition =
              align === "center"
                ? (width - bulletPointFont.widthOfTextAtSize(line, fontSize)) /
                  2
                : x;

            // Add bullet point at the beginning
            page.drawText(`${line}`, {
              x: xPosition,
              y: yPosition,
              size: fontSize,
              font: bulletPointFont,
              color: color,
            });

            yPosition -= lineHeight; // Move down after drawing each line
          });
          yPosition -= 8; // Add extra spacing after each point
        });
      };

      await drawHeading(
        `${resumeData.bio.FirstName} ${resumeData.bio.LastName}`,
        fontSize + 2, // Larger font size for headings
        {
          align: "left", // Left alignment
          color: rgb(0, 0, 0), // Black color for heading
        }
      );

      parseHtmlAndDraw(
        parseHtml(
          `<p>Phone: ${resumeData.bio.PhoneNumber} | Email: ${resumeData.bio.Email}</p>`
        )
      );
      let linksHtml = "<p>"; // Start of the paragraph

      // Check and append LinkedIn link if it exists
      if (resumeData.bio.LinkedInLink) {
        linksHtml += `LinkedIn: ${resumeData.bio.LinkedInLink}`;
      }

      // Check and append GitHub link if it exists, with separator if LinkedIn exists
      if (resumeData.bio.GithubLink) {
        if (resumeData.bio.LinkedInLink) {
          linksHtml += " | "; // Separator if LinkedIn was printed
        }
        linksHtml += `GitHub: ${resumeData.bio.GithubLink}`;
      }

      // Check and append Website link if it exists, with separator if either LinkedIn or GitHub exists
      if (resumeData.bio.WebsiteLink) {
        if (resumeData.bio.LinkedInLink || resumeData.bio.GithubLink) {
          linksHtml += " | "; // Separator if LinkedIn or GitHub was printed
        }
        linksHtml += `Website: ${resumeData.bio.WebsiteLink}`;
      }

      linksHtml += "</p>"; // End of the paragraph

      // Now pass the dynamically created HTML string to your parseHtml function
      parseHtmlAndDraw(parseHtml(linksHtml));

      parseHtmlAndDraw(
        parseHtml(`<p>Location: ${resumeData.bio.Location}</p>`)
      );

      // drawSeparator();
      // Professional Summary Section
      await drawHeading(
        "Professional Summary",
        fontSize + 2, // Larger font size for headings
        {
          align: "center", // Center alignment
          color: rgb(0, 0, 0), // Black color for heading
        }
      );

      // Parse and draw the summary with HTML tags
      console.log("Raw Summary:", resumeData.summary);
      const parsedSummary = parseHtml(resumeData.summary);
      console.log("Parsed Summary:", parsedSummary);
      parseHtmlAndDraw(parsedSummary);

      // drawSeparator();

      await drawHeading(
        "Skills",
        fontSize + 2, // Larger font size for headings
        {
          align: "center", // Center alignment
          color: rgb(0, 0, 0), // Black color for heading
        }
      );
      parseHtmlAndDraw(parseHtml(resumeData.skills.join(", ")));

      yPosition -= lineHeight * 2; // Adjust the multiplier based on how much space you want

      // Experience Section
      await drawHeading(
        "Experience",
        fontSize + 2, // Larger font size for headings
        {
          align: "center", // Center alignment for heading
          color: rgb(0, 0, 0), // Black color for heading
        }
      );

      resumeData.experiences.forEach((exp) => {
        const formattedStartDate =
          exp.StartDate || exp.startDate
            ? format(
                new Date(exp.StartDate),
                "MMMM yyyy" || new Date(exp.startDate),
                "MMMM yyyy"
              )
            : " ";
        const formattedEndDate =
          exp.EndDate || exp.endDate
            ? format(
                new Date(exp.EndDate),
                "MMMM yyyy" || new Date(exp.endDate),
                "MMMM yyyy"
              )
            : "Present";

        // Draw the company name, role, and dates
        drawHeading(
          `${exp.CompanyName} (${formattedStartDate} - ${formattedEndDate}): ${exp.RoleTitle}`,
          fontSize,
          { align: "left", color: rgb(0, 0, 0) }
        );

        // Split the summary into bullet points and draw them
        const experiencePoints = exp.ExperienceSummary.split("\n");
        drawPoints(experiencePoints, fontSize, { color: rgb(0, 0, 0) });
      });

      // drawSeparator();

      // Education Section
      await drawHeading(
        "Education",
        fontSize + 2, // Larger font size for headings
        {
          align: "center", // Center alignment for heading
          color: rgb(0, 0, 0), // Black color for heading
        }
      );

      resumeData.education.forEach(async (edu) => {
        const formattedStartDate =
          edu.StartDate || edu.startDate
            ? format(
                new Date(edu.StartDate),
                "MMMM yyyy" || new Date(edu.startDate),
                "MMMM yyyy"
              )
            : " ";
        const formattedEndDate =
          edu.EndDate || edu.endDate
            ? format(
                new Date(edu.EndDate),
                "MMMM yyyy" || new Date(edu.endDate),
                "MMMM yyyy"
              )
            : "Present";

        // Draw the education institute, degree, and dates
        await drawHeading(
          `${edu.InstitueName} - ${edu.DegreeType} (${formattedStartDate} - ${formattedEndDate})`,
          fontSize,
          { align: "left", color: rgb(0, 0, 0) }
        );

        // Parse and draw the education summary (with list support)
        await parseHtmlAndDraw(
          parseHtml(edu.gradesAchievements || edu.EducationSummary)
        );
      });

      // Save PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${
        resumeData.bio.LastName || resumeData.bio.lastName
      }.pdf`;
      link.click();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "There was an error generating the PDF. Please check your data and try again."
      );
    }
  };
  const handleCompleted = () => {
    console.log("Handle Completed");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      {!isCreatingResume && (
        <ResumeList
          resumes={resumes}
          onNewResume={handleNewResume}
          onEdit={handleEditResume}
        />
      )}
      {isCreatingResume && (
        <Grid
          container
          spacing={2}
          style={{ marginLeft: "0px", marginRight: "0px" }}
        >
          <Grid
            item
            xs={12}
            md={7}
            style={{ paddingRight: "10px", paddingLeft: "0px" }}
          >
            {currentStep === 0 && (
              <UserBioStep
                isEditing={isEditing}
                bio={resumeData.bio}
                onBioChange={handleBioChange}
                onNext={handleNextStep}
              />
            )}
            {currentStep === 1 && (
              <SummaryStep
                summary={resumeData.summary}
                onSummaryChange={handleSummaryChange}
                onNext={handleNextStep}
                onBack={handlePrevStep}
              />
            )}
            {currentStep === 2 && (
              <SkillsStep
                skills={resumeData.skills}
                onSkillAdd={handleSkillAdd}
                onNext={handleNextStep}
                onBack={handlePrevStep}
                modifyOrDeleteSkill={updateSkills} // Pass the function to the child
              />
            )}
            {currentStep === 3 && (
              <ExperienceStep
                experiences={resumeData.experiences}
                setResumeData={setResumeData}
                resumeData={resumeData}
                onNext={handleNextStep}
                onBack={handlePrevStep}
              />
            )}
            {currentStep === 4 && (
              <EducationStep
                education={resumeData.education}
                setEducation={(newEducation) =>
                  setResumeData({ ...resumeData, education: newEducation })
                }
                onNext={handleNextStep}
                onBack={handlePrevStep}
              />
            )}
            {/* Additional steps for education, hobbies, etc. */}
          </Grid>

          {/* Resume Preview Section */}
          <Grid item xs={12} md={5}>
            <Card
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "10px",
                marginTop: "10px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                marginRight: "3rem",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: "bold",
                    color: "#00796b",
                    marginBottom: "10px",
                  }}
                >
                  Resume Preview
                </Typography>
                <Paper
                  content={paperContent}
                  resumeData={resumeData}
                  style={{
                    padding: "8px",
                    minHeight: "450px", // Reduced height
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                    marginBottom: "8px", // Reduced bottom margin
                    overflowY: "auto", // Added scroll in case of overflow
                  }}
                />
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={generatePDF}
                  >
                    Download PDF
                  </Button>
                  &nbsp;
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handlePrevStep}
                  >
                    Back
                  </Button>
                  &nbsp;
                  {isCompleted ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCompleted}
                    >
                      Mark as Completed
                    </Button>
                  ) : (
                    ""
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Dashboard;
