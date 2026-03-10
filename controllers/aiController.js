const axios = require("axios");

const generateSummary = async (req, res) => {

  try {

    const { text } = req.body;

    console.log("Incoming request body:", req.body);

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Summarize this text in 2 short sentences:\n\n${text}`
              }
            ]
          }
        ]
      }
    );

    const summary =
      response.data.candidates[0].content.parts[0].text;

    res.json({ summary });

  } catch (error) {

    console.error("Gemini ERROR:", error.response?.data || error);

    res.status(500).json({
      error: "AI summary failed"
    });

  }

};

module.exports = { generateSummary };