const expressAsyncHandler = require("express-async-handler");
const OpenAI = require("openai");


const loadMoreTitles = expressAsyncHandler(async(req,res) => {
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
})


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
            content: `Give me insights on the following tools: ${selectedTools.join(", ")}`,
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

module.exports = {loadMoreTitles, getToolInsights}