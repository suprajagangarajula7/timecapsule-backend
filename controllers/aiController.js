const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateSummary = async (req, res) => {
  try {
    const { text } = req.body;

    console.log("Incoming request body:", req.body);

    if (!text) {
      return res.status(400).json({
        error: "Text is required"
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-pro"
    });

    const prompt = `Summarize this text in 2 short sentences:\n\n${text}`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    const summary = response.text();

    res.json({ summary });

  } catch (error) {
    console.error("Gemini ERROR:", error);

    res.status(500).json({
      error: "AI summary failed"
    });
  }
};

module.exports = { generateSummary };