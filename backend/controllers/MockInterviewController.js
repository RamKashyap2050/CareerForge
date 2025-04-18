const expressAsyncHandler = require("express-async-handler");
const OpenAI = require("openai");
const fs = require("fs");
const { exec } = require("child_process");
const { v4: uuid } = require("uuid");
const path = require("path");

const loadMoreTitles = expressAsyncHandler(async (req, res) => {
  const openai = new OpenAI();
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content:
            "Suggest 5 job titles related strictly to IT & Computing. Format them as a plain list without numbers or bullets.",
        },
      ],
    });

    if (!response.choices || response.choices.length === 0) {
      return res.status(500).json({ error: "No job titles received" });
    }

    const jobTitles = response.choices[0].message.content
      .split("\n") // Split by new line
      .map((s) => s.trim()) // Trim spaces
      .filter((s) => s.length > 3 && !/^\d/.test(s)); // Ensure clean output

    res.json({ jobTitles });
  } catch (error) {
    console.error("Error fetching job titles:", error);
    res.status(500).json({ error: "Failed to fetch job titles" });
  }
});

const getToolInsights = expressAsyncHandler(async (req, res) => {
  const openai = new OpenAI();
  const { selectedTools } = req.body;

  if (!selectedTools || selectedTools.length === 0) {
    return res.status(400).json({ error: "No tools provided" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `Give me insights on the following tools: ${selectedTools.join(
            ", "
          )}`,
        },
      ],
    });

    if (!response.choices || response.choices.length === 0) {
      return res.status(500).json({ error: "No insights received from AI" });
    }

    res.json({ insights: response.choices[0].message.content });
  } catch (error) {
    console.error("Error fetching tool insights:", error);
    res.status(500).json({ error: "Failed to fetch tool insights" });
  }
});

const CodeSandbox = expressAsyncHandler(async (req, res) => {
  const startTime = Date.now();

  const { code, language, input, problemID } = req.body;
  const id = uuid();
  const folderPath = path.join(__dirname, "..", "codes");
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

  const extension = language === "javascript" ? "js" : "txt"; // fallback for now
  const filePath = path.join(folderPath, `${id}.${extension}`);

  const image = "node:18"; // support only JS for now
  const runCommand = `node /app/${id}.${extension}`;
  const dockerCmd = `docker run --rm -i -v ${folderPath}:/app ${image} ${runCommand}`;

  console.log(`🚀 [Request] Received Submission`);
  console.log(`> Language: ${language}`);
  console.log(`> Problem ID: ${problemID || "N/A"}`);
  console.log(`> Code Size: ${code.length} chars, ${code.split("\n").length} lines`);
  console.log(`> Input provided: ${!!input}`);

  fs.writeFileSync(filePath, code);

  const child = exec(dockerCmd, (error, stdout, stderr) => {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    const result = {
      executionTime: `${duration}s`,
      output: stdout || null,
      error: stderr || null,
      success: !error,
      problemID: problemID || null,
      language,
      codeSize: {
        chars: code.length,
        lines: code.split("\n").length,
      },
    };

    console.log(`✅ Execution complete in ${duration}s`);
    if (error) console.log(`❌ Error:`, stderr.trim());
    else console.log(`📤 Output:`, stdout.trim());

    res.json(result);
  });

  if (input) {
    child.stdin.write(input);
    child.stdin.end();
  }
});

module.exports = { loadMoreTitles, getToolInsights, CodeSandbox };
