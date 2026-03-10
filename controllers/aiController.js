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

    import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function MemoryDetails() {

  const { id } = useParams();

  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");

  const playUnlockSound = () => {
    const audio = new Audio("/unlock.mp3");
    audio.play().catch(() => {});
  };

  useEffect(() => {

    const fetchCapsule = async () => {
      try {

        const res = await api.get(`/capsules/${id}`);
        const data = res.data;

        setCapsule(data);

        const now = new Date().getTime();
        const unlockTime = new Date(data.unlock_at).getTime();

        if (!data.password && now >= unlockTime) {
          setAccessGranted(true);
        }

      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    };

    fetchCapsule();

  }, [id]);

  /* Unlock sound effect */
  useEffect(() => {
    if (accessGranted) {
      playUnlockSound();
    }
  }, [accessGranted]);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!capsule) {
    return <div className="p-10 text-center">Memory not found</div>;
  }

  const now = new Date().getTime();
  const unlockTime = new Date(capsule.unlock_at).getTime();
  const isLockedByTime = now < unlockTime;

  const handleUnlock = () => {

    if (enteredPassword === capsule.password) {
      setAccessGranted(true);
      setError("");
      playUnlockSound();
    } else {
      setError("Incorrect password");
    }

  };

const generateSummary = async () => {

  try {

    const res = await api.post("/ai/summary", {
      text: capsule.message
    });

    setSummary(res.data.summary);

  } catch (error) {

    console.log(error);

  }

};
  return (

    <div className="min-h-screen flex justify-center items-center px-4 bg-[#f8f5f1] dark:bg-[#121212]">

      <div className="w-full max-w-3xl bg-white dark:bg-[#1f1f1f] shadow-xl rounded-3xl p-6 border border-[#ece6df] dark:border-gray-700">

        <h1 className="text-2xl font-serif mb-4 text-[#3e2f26] dark:text-white">
          {capsule.title}
        </h1>

        {isLockedByTime && (
          <div className="text-red-500 mb-4">
            🔒 This memory unlocks at {new Date(capsule.unlock_at).toLocaleString()}
          </div>
        )}

        {!isLockedByTime && capsule.password && !accessGranted && (

          <div className="mt-4 p-6 rounded-2xl border">

            <p className="mb-4">
              🔑 This memory is password protected
            </p>

            <input
              type="password"
              placeholder="Enter password"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-2"
            />

            <button
              onClick={handleUnlock}
              className="mt-4 px-6 py-2 rounded-xl text-white bg-[#b08968]"
            >
              Unlock Memory
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

          </div>

        )}

        {!isLockedByTime && accessGranted && (

          <div className="space-y-6 mt-4">

            <p>{capsule.message}</p>

            {capsule.images && capsule.images.map((img, i) => (
              <img key={i} src={img} className="rounded-xl w-full" />
            ))}

            {capsule.videos && capsule.videos.map((vid, i) => (
              <video key={i} src={vid} controls className="w-full rounded-xl" />
            ))}

            {capsule.audios && capsule.audios.map((aud, i) => (
              <audio key={i} src={aud} controls className="w-full" />
            ))}

            {capsule.latitude && capsule.longitude && (
              <iframe
                title="map"
                width="100%"
                height="300"
                src={`https://maps.google.com/maps?q=${capsule.latitude},${capsule.longitude}&z=15&output=embed`}
              />
            )}

            <button
              onClick={generateSummary}
              className="px-6 py-2 rounded-xl text-white bg-[#b08968]"
            >
              ✨ Generate AI Summary
            </button>

            {summary && (
              <div className="p-6 border rounded-2xl">
                <h2 className="font-semibold mb-3">
                  ✨ AI Memory Summary
                </h2>
                <p>{summary}</p>
              </div>
            )}

          </div>

        )}

      </div>

    </div>

  );
}

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