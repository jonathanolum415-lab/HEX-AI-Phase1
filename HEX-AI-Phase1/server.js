import "dotenv/config";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "30kb" }));
app.use(express.static(path.join(projectRoot, "frontend")));

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a minute and try again." }
});

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "HEX AI", aiConfigured: Boolean(openai) });
});

app.post("/api/chat", chatLimiter, async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({
        error: "HEX AI is not connected yet. Add your OpenAI API key to the .env file and restart the server."
      });
    }

    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!message) return res.status(400).json({ error: "Please enter a message." });
    if (message.length > 8000) {
      return res.status(400).json({ error: "Message is too long. Maximum length is 8,000 characters." });
    }

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6-astra",
      instructions: [
        "You are HEX AI, a helpful, accurate and friendly AI assistant.",
        "Explain complex ideas clearly. Be honest when you are uncertain.",
        "For programming questions, give practical explanations and safe code.",
        "Do not claim to remember users across sessions; persistent memory will be added in a later project phase."
      ].join(" "),
      input: message
    });

    res.json({ reply: response.output_text || "I couldn't produce a text response. Please try again." });
  } catch (error) {
    console.error("HEX AI chat error:", error?.message || error);
    const status = error?.status && Number.isInteger(error.status) ? error.status : 500;
    res.status(status >= 400 && status < 600 ? status : 500).json({
      error: status === 401
        ? "The API key was rejected. Check the key in your .env file."
        : status === 429
          ? "The API rate limit or available balance was reached. Check your API account."
          : "HEX AI couldn't complete that request. Check the server terminal for details."
    });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(projectRoot, "frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`HEX AI is running at http://localhost:${PORT}`);
  if (!openai) console.log("Add OPENAI_API_KEY to .env to enable AI replies.");
});