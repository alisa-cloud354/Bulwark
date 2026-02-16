import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/contact", async (req, res) => {
  const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = process.env;

  try {
    const { formName, formData } = req.body;

    // Праверка токенаў у логах Vercel
    if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("Tokens missing!");
      return res.status(500).json({ success: false, error: "Config missing" });
    }

    const messageText =
      `<b>${formName}</b>\n\n` +
      Object.entries(formData)
        .map(([key, value]) => `<b>${key}:</b> ${value}`)
        .join("\n");

    const tgResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: messageText,
          parse_mode: "HTML",
        }),
      },
    );

    if (tgResponse.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errorData = await tgResponse.json();
      console.error("Telegram API error:", errorData);
      return res.status(500).json({ success: false });
    }
  } catch (error) {
    console.error("Server Crash:", error);
    return res.status(500).json({ success: false });
  }
});

export default app;
