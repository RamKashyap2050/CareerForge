import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import ResumeList from "../Components/Resumelist";
import UserBioStep from "../Components/UserBioStep";
import SummaryStep from "../Components/SummaryStep";
import SkillsStep from "../Components/SkillsStep";
import ExperienceStep from "../Components/ExperienceStep";
import Paper from "../Components/Paper";
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

  const handleNewResume = () => {
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

    switch (currentStep) {
      case 0:
        newContent = `Phone: ${resumeData.bio.phoneNumber}, Email: ${resumeData.bio.email}, LinkedIn: ${resumeData.bio.linkedinProfile}, Github: ${resumeData.bio.githubLink}, Location: ${resumeData.bio.location}, ${resumeData.bio.city}, ${resumeData.bio.province}, ${resumeData.bio.country}`;
        break;
      case 1:
        newContent = `${resumeData.summary}`;
        break;
      case 2:
        newContent = `Skills: ${resumeData.skills.join(", ")}`;
        break;
      case 3:
        newContent = `Experience: ${resumeData.experiences
          .map(
            (exp) =>
              `<strong>${exp.companyName} (${exp.startDate} - ${
                exp.endDate
              }): ${exp.occupation}</strong><ul>${exp.summary
                .split("\n")
                .map((point) => `<li>${point}</li>`)
                .join("")}</ul>`
          )
          .join("")}`;
        break;
      case 4: // New case for EducationStep
        newContent = `Education: ${resumeData.education
          .map(
            (edu) =>
              `${edu.instituteName} - ${edu.degreeType} (${edu.startDate} - ${
                edu.currentlyEnrolled ? "Present" : edu.endDate
              }): ${edu.gradesAchievements}`
          )
          .join(", ")}`;
        break;
      default:
        break;
    }

    setPaperContent([...paperContent, newContent]);
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setPaperContent(paperContent.slice(0, -1)); // Remove the last step's content
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleBioChange = (e) => {
    const { name, value } = e.target;
    setResumeData({ ...resumeData, bio: { ...resumeData.bio, [name]: value } });
  };

  const handleSummaryChange = (e) => {
    setResumeData({ ...resumeData, summary: e.target.value });
  };

  const handleSkillAdd = (skill) => {
    setResumeData({ ...resumeData, skills: [...resumeData.skills, skill] });
  };

  const handleEducationChange = (newEducation) => {
    setResumeData({ ...resumeData, education: newEducation });
  };

  const generatePDF = async () => {
    console.log(resumeData);
    try {
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([595, 842]); // A4 size in points: 595x842
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

      const { width, height } = page.getSize();
      const fontSize = 12;
      let yPosition = height - 50;
      const lineHeight = 14;
      const margin = 50;
      const maxWidth = width - margin * 2;
      const parseSummary = (
        html,
        pdfDoc,
        page,
        yPosition,
        margin,
        maxWidth,
        lineHeight,
        font,
        boldFont,
        italicFont
      ) => {
        const parseHtml = (html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          return doc.body;
        };

        const drawText = (text, font, fontSize, x, y, options = {}) => {
          const { color = rgb(0, 0, 0), backgroundColor = null } = options;
          const lines = wrapText(text, maxWidth, font, fontSize);

          lines.forEach((line) => {
            if (backgroundColor) {
              const textWidth = font.widthOfTextAtSize(line, fontSize);
              page.drawRectangle({
                x,
                y: y - lineHeight + 2,
                width: textWidth,
                height: lineHeight + 4,
                color: backgroundColor,
              });
            }

            page.drawText(line, {
              x,
              y,
              size: fontSize,
              font,
              color,
            });

            y -= lineHeight;
          });

          return y;
        };

        const element = parseHtml(html);

        element.childNodes.forEach((node) => {
          let currentFont = font;
          let currentFontSize = 12;
          let color = rgb(0, 0, 0);
          let backgroundColor = null;

          if (node.nodeType === Node.TEXT_NODE) {
            yPosition = drawText(
              node.textContent,
              currentFont,
              currentFontSize,
              margin,
              yPosition,
              { color, backgroundColor }
            );
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            switch (node.tagName.toLowerCase()) {
              case "strong":
                currentFont = boldFont;
                yPosition = drawText(
                  node.textContent,
                  currentFont,
                  currentFontSize,
                  margin,
                  yPosition,
                  { color, backgroundColor }
                );
                break;
              case "em":
                currentFont = italicFont;
                yPosition = drawText(
                  node.textContent,
                  currentFont,
                  currentFontSize,
                  margin,
                  yPosition,
                  { color, backgroundColor }
                );
                break;
              case "span":
                if (node.style.color) {
                  const hexColor = node.style.color.replace("#", "");
                  color = rgb(
                    parseInt(hexColor.slice(0, 2), 16) / 255,
                    parseInt(hexColor.slice(2, 4), 16) / 255,
                    parseInt(hexColor.slice(4, 6), 16) / 255
                  );
                }
                if (node.style.backgroundColor) {
                  const bgColor = node.style.backgroundColor.replace("#", "");
                  backgroundColor = rgb(
                    parseInt(bgColor.slice(0, 2), 16) / 255,
                    parseInt(bgColor.slice(2, 4), 16) / 255,
                    parseInt(bgColor.slice(4, 6), 16) / 255
                  );
                }
                yPosition = drawText(
                  node.textContent,
                  currentFont,
                  currentFontSize,
                  margin,
                  yPosition,
                  { color, backgroundColor }
                );
                break;
              case "br":
                yPosition -= lineHeight;
                break;
              case "p":
                yPosition = drawText(
                  node.textContent,
                  currentFont,
                  currentFontSize,
                  margin,
                  yPosition,
                  { color, backgroundColor }
                );
                yPosition -= 8;
                break;
              default:
                yPosition = parseSummary(
                  node.outerHTML,
                  pdfDoc,
                  page,
                  yPosition,
                  margin,
                  maxWidth,
                  lineHeight,
                  font,
                  boldFont,
                  italicFont
                );
                break;
            }
          }
        });

        return yPosition;
      };

      const wrapText = (text, maxWidth, font, fontSize) => {
        const words = text.split(" ");
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

      const drawText = (text, font, fontSize, options = {}) => {
        const { x = margin, align = "left", color = rgb(0, 0, 0) } = options;
        const paragraphs = text.split("\n");
        paragraphs.forEach((paragraph) => {
          const lines = wrapText(paragraph, maxWidth, font, fontSize);

          lines.forEach((line) => {
            if (yPosition < margin + lineHeight) {
              page = pdfDoc.addPage([595, 842]);
              yPosition = height - margin;
            }
            const xPosition =
              align === "center"
                ? (width - font.widthOfTextAtSize(line, fontSize)) / 2
                : x;

            page.drawText(line, {
              x: xPosition,
              y: yPosition,
              size: fontSize,
              font: font,
              color: color,
            });
            yPosition -= lineHeight;
          });

          yPosition -= 8;
        });
      };

      const parseHtmlAndDraw = (element) => {
        element.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            drawText(node.textContent, font, fontSize);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            let currentFont = font;
            let currentFontSize = fontSize;
            let color = rgb(0, 0, 0);
            let backgroundColor = null;

            if (
              node.tagName.toLowerCase() === "strong" ||
              node.style.fontWeight === "bold"
            ) {
              currentFont = boldFont;
            }
            if (
              node.tagName.toLowerCase() === "em" ||
              node.style.fontStyle === "italic"
            ) {
              currentFont = italicFont;
            }
            if (node.style.color) {
              const hexColor = node.style.color.replace("#", "");
              color = rgb(
                parseInt(hexColor.slice(0, 2), 16) / 255,
                parseInt(hexColor.slice(2, 4), 16) / 255,
                parseInt(hexColor.slice(4, 6), 16) / 255
              );
            }
            if (node.style.backgroundColor) {
              const bgColor = node.style.backgroundColor.replace("#", "");
              backgroundColor = rgb(
                parseInt(bgColor.slice(0, 2), 16) / 255,
                parseInt(bgColor.slice(2, 4), 16) / 255,
                parseInt(bgColor.slice(4, 6), 16) / 255
              );
            }

            switch (node.tagName.toLowerCase()) {
              case "p":
                if (backgroundColor) {
                  page.drawRectangle({
                    x: margin,
                    y: yPosition - lineHeight,
                    width: maxWidth,
                    height: lineHeight + 4,
                    color: backgroundColor,
                  });
                }
                drawText(node.textContent, currentFont, currentFontSize, {
                  color,
                });
                yPosition -= 8;
                break;
              case "strong":
              case "em":
              case "span":
                if (backgroundColor) {
                  page.drawRectangle({
                    x: margin,
                    y: yPosition - lineHeight,
                    width: maxWidth,
                    height: lineHeight + 4,
                    color: backgroundColor,
                  });
                }
                drawText(node.textContent, currentFont, currentFontSize, {
                  color,
                });
                break;
              case "br":
                yPosition -= lineHeight;
                break;
              case "ul":
              case "ol":
                node.childNodes.forEach((li) => {
                  if (li.tagName.toLowerCase() === "li") {
                    drawText(
                      `• ${li.textContent}`,
                      currentFont,
                      currentFontSize,
                      { color, x: margin + 10 }
                    );
                    yPosition -= 4;
                  }
                });
                yPosition -= 8;
                break;
              default:
                parseHtmlAndDraw(node);
            }
          }
        });
      };

      const drawSeparator = () => {
        if (yPosition < margin + lineHeight * 2) {
          page = pdfDoc.addPage([595, 842]);
          yPosition = height - margin;
        }
        yPosition -= lineHeight;
        page.drawLine({
          start: { x: margin, y: yPosition },
          end: { x: width - margin, y: yPosition },
          thickness: 1,
          color: rgb(0.6, 0.6, 0.6),
        });
        yPosition -= lineHeight;
      };

      const parseHtml = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        return doc.body;
      };

      // Bio Section
      parseHtmlAndDraw(
        parseHtml(
          `<p><strong>${resumeData.bio.firstName} ${resumeData.bio.lastName}</strong></p>`
        )
      );
      parseHtmlAndDraw(
        parseHtml(`<p>Phone: ${resumeData.bio.phoneNumber}</p>`)
      );
      parseHtmlAndDraw(parseHtml(`<p>Email: ${resumeData.bio.email}</p>`));
      parseHtmlAndDraw(
        parseHtml(`<p>LinkedIn: ${resumeData.bio.linkedinProfile}</p>`)
      );
      parseHtmlAndDraw(
        parseHtml(`<p>Github: ${resumeData.bio.githubLink}</p>`)
      );
      parseHtmlAndDraw(
        parseHtml(
          `<p>Location: ${resumeData.bio.location}, ${resumeData.bio.city}, ${resumeData.bio.province}, ${resumeData.bio.country}</p>`
        )
      );

      drawSeparator();

      // Professional Summary Section
      // Professional Summary Section
      drawText("Professional Summary:", boldFont, fontSize, {
        align: "center",
      });
      yPosition = parseSummary(
        resumeData.summary,
        pdfDoc,
        page,
        yPosition,
        margin,
        maxWidth,
        lineHeight,
        font,
        boldFont,
        italicFont
      );

      drawSeparator();

      // Skills Section
      drawText("Skills:", boldFont, fontSize, { align: "center" });
      parseHtmlAndDraw(parseHtml(resumeData.skills.join(", ")));

      drawSeparator();

      // Experience Section
      drawText("Experience:", boldFont, fontSize, { align: "center" });
      resumeData.experiences.forEach((exp) => {
        parseHtmlAndDraw(
          parseHtml(
            `<p>${exp.companyName} (${exp.startDate} - ${exp.endDate}): ${exp.occupation}</p>`
          )
        );
        parseHtmlAndDraw(parseHtml(exp.summary));
        yPosition -= 8;
      });

      drawSeparator();

      // Education Section
      drawText("Education:", boldFont, fontSize, { align: "center" });
      resumeData.education.forEach((edu) => {
        parseHtmlAndDraw(
          parseHtml(
            `<p>${edu.instituteName} - ${edu.degreeType} (${edu.startDate} - ${
              edu.currentlyEnrolled ? "Present" : edu.endDate
            })</p>`
          )
        );
        parseHtmlAndDraw(parseHtml(edu.gradesAchievements));
        yPosition -= 8;
      });

      // Save PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "resume.pdf";
      link.click();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "There was an error generating the PDF. Please check your data and try again."
      );
    }
  };

  return (
    <div>
      <Navbar />
      {!isCreatingResume && (
        <ResumeList resumes={resumes} onNewResume={handleNewResume} />
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
