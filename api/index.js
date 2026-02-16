require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const rateLimit = require("express-rate-limit");

const app = express();
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());

const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID, PORT = 3000 } = process.env;

// Абарона ад спаму
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: "Занадта шмат запытаў. Паспрабуйце пазней.",
  },
});

app.use("/api/contact", apiLimiter);

// Слоўнік для перакладу тэхнічных палёў у прыгожы выгляд
const fieldLabels = {
  // Палі формы дапамогі
  user_name: "👤 Імя / Пазыўны",
  user_status: "🎖 Статус",
  user_needs: "📝 Патрэба",
  user_contact: "📱 Кантакт",
  // Палі формы партнёрства
  org_name: "🏢 Арганізацыя / Імя",
  contact: "📱 Email / Telegram",
  message: "💬 Паведамленне",
};

app.post("/api/contact", async (req, res) => {
  try {
    const { formName, formData } = req.body;

    // Вызначаем загаловак і эмодзі ў залежнасці ад формы
    let header = "";
    if (formName.includes("Дапамога")) {
      header = "🆘 <b>ЗАПЫТ НА ДАПАМОГУ</b>";
    } else if (formName.includes("партнёр")) {
      header = "🤝 <b>НОВАЯ ПРАПАНОВА ПАРТНЁРСТВА</b>";
    } else {
      header = `📩 <b>НОВАЯ ЗАЯВА: ${formName}</b>`;
    }

    let messageText = `${header}\n\n`;

    // Фармуем спіс палёў
    for (const [key, value] of Object.entries(formData)) {
      const label = fieldLabels[key] || key; // Калі паля няма ў слоўніку, пакідаем як ёсць
      if (value) {
        messageText += `${label}: ${value}\n`;
      }
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: messageText,
        parse_mode: "HTML",
      }),
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errorData = await response.json();
      console.error("TG Error:", errorData);
      return res.status(500).json({ success: false });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
