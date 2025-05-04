const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const { format } = require("date-fns");

const generatePDFBuffer = async (resumeData) => {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const { width, height } = page.getSize();
  const fontSize = 12;
  let yPosition = height - 50;
  const lineHeight = 14;
  const margin = 50;
  const maxWidth = width - margin * 2;

  const sanitizeText = (text) => text?.replace(/\n/g, " ").trim() || "";

  const wrapText = (text, maxWidth, font, fontSize) => {
    const words = sanitizeText(text).split(" ");
    let lines = [],
      currentLine = words[0] || "";
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = font.widthOfTextAtSize(currentLine + " " + word, fontSize);
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

  const drawText = (
    textElements,
    fontSize,
    { x = margin, color = rgb(0, 0, 0) } = {}
  ) => {
    let xPosition = x;
    textElements.forEach(({ text, isBold, isItalic }) => {
      const currentFont = isBold ? boldFont : isItalic ? italicFont : font;
      const words = sanitizeText(text).split(" ");
      words.forEach((word) => {
        const wordWidth = currentFont.widthOfTextAtSize(word, fontSize);
        if (xPosition + wordWidth > width - margin) {
          yPosition -= lineHeight;
          xPosition = margin;
        }
        page.drawText(word, {
          x: xPosition,
          y: yPosition,
          size: fontSize,
          font: currentFont,
          color,
        });
        xPosition += wordWidth + currentFont.widthOfTextAtSize(" ", fontSize);
      });
    });
    yPosition -= 8;
  };

  const drawHeading = (heading, size, { align = "left" } = {}) => {
    const headingWidth = boldFont.widthOfTextAtSize(heading, size);
    let x = margin;
    if (align === "center") x = (width - headingWidth) / 2;
    if (align === "right") x = width - margin - headingWidth;
    page.drawText(heading, {
      x,
      y: yPosition,
      size,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= lineHeight * 1.5;
  };

  const drawPoints = (points, fontSize) => {
    points.forEach((point) => {
      const wrapped = wrapText("• " + point, maxWidth, font, fontSize);
      wrapped.forEach((line) => {
        if (yPosition < margin + lineHeight) {
          page = pdfDoc.addPage([595, 842]);
          yPosition = height - margin;
        }
        page.drawText(line, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        yPosition -= lineHeight;
      });
      yPosition -= 4;
    });
  };

  // === START DRAWING CONTENT BASED ON resumeJSON STRUCTURE ===

  // --- BIO + LINKS + LOCATION ---
  drawHeading(`${resumeData.bio.firstName} ${resumeData.bio.lastName}`, fontSize + 2);
  drawText(
    [{ text: `Phone: ${resumeData.bio.phoneNumber} | Email: ${resumeData.bio.email}` }],
    fontSize
  );
  yPosition -= 4;

  const links = [];
  if (resumeData.bio.linkedin) links.push(`LinkedIn: ${resumeData.bio.linkedin}`);
  if (resumeData.bio.github) links.push(`GitHub: ${resumeData.bio.github}`);
  if (resumeData.bio.website) links.push(`Website: ${resumeData.bio.website}`);
  if (links.length > 0) {
    drawText([{ text: links.join(" | ") }], fontSize);
    yPosition -= 4;
  }

  drawText([{ text: `Location: ${resumeData.bio.location}` }], fontSize);
  yPosition -= lineHeight * 1.5; // << Add spacing after bio block

  // --- PROFESSIONAL SUMMARY ---
  drawHeading("Professional Summary", fontSize + 2, { align: "center" });
  drawText([{ text: sanitizeText(resumeData.summary) }], fontSize);
  yPosition -= lineHeight; // << Space between summary and skills

  drawHeading("Skills", fontSize + 2, { align: "center" });
  drawText([{ text: resumeData.skills.join(", ") }], fontSize);
  yPosition -= lineHeight;

  drawHeading("Experience", fontSize + 2, { align: "center" });
  for (const exp of resumeData.experiences) {
    const start = exp.startDate?.$date || exp.startDate;
    const end = exp.endDate?.$date || exp.endDate || "Present";
    const startFmt = start ? format(new Date(start), "MMMM yyyy") : "";
    const endFmt =
      end !== "Present" ? format(new Date(end), "MMMM yyyy") : "Present";
    drawHeading(
      `${exp.companyName} (${startFmt} - ${endFmt}): ${exp.roleTitle}`,
      fontSize
    );
    drawPoints(exp.experienceDetails, fontSize);
  }

  drawHeading("Education", fontSize + 2, { align: "center" });
  for (const edu of resumeData.education) {
    const start = edu.startDate?.$date || edu.startDate;
    const end = edu.endDate?.$date || edu.endDate || "Present";
    const startFmt = start ? format(new Date(start), "MMMM yyyy") : "";
    const endFmt =
      end !== "Present" ? format(new Date(end), "MMMM yyyy") : "Present";
    drawHeading(
      `${edu.institution} - ${edu.degreeType} (${startFmt} - ${endFmt})`,
      fontSize
    );
    drawPoints(edu.educationDetails || [], fontSize);
  }

  return await pdfDoc.save();
};

module.exports = generatePDFBuffer;
