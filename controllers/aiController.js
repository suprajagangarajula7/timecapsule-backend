const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateSummary = async (req, res) => {

  try {

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Text is required"
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
Summarize the following memory in 2 short sentences.

Memory:
${text}
`;

    const result = await model.generateContent(prompt);

    const summary = result.response.text();

    res.json({ summary });

  } catch (error) {

    console.error("Gemini ERROR:", error);

    res.status(500).json({
      error: "AI summary failed"
    });

  }

};

module.exports = { generateSummary };