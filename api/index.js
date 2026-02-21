export default async function handler(req, res) {
  // 1. Захоўваем функцыянал CORS (Vercel патрабуе ручнога дазволу для метадаў)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Апрацоўка preflight-запыту
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 2. Абмяжоўваем толькі POST (як і было ў app.post)
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = process.env;

  // 3. Твой слоўнік і логіка фарматавання (без змен)
  const labels = {
    user_name: "👤 Імя",
    user_status: "🎖 Статус",
    user_contact: "📱 Кантакт",
    user_needs: "📝 Патрэба",
    org_name: "🏢 Арганізацыя",
    contact: "📱 Кантакт",
    message: "💬 Паведамленне",
  };

  try {
    const { formName, formData } = req.body;

    // Вызначаем загаловак (твая логіка)
    const title =
      formName === "Стаць партнёрам"
        ? "🤝 НОВАЯ ПРАПАНОВА ПАРТНЁРСТВА"
        : "🆘 ЗАПЫТ НА ДАПАМОГУ";

    const lines = Object.entries(formData).map(([key, value]) => {
      const label = labels[key] || key;
      return `<b>${label}:</b> ${value}`;
    });

    const messageText = `<b>${title}</b>\n\n` + lines.join("\n");

    // 4. Адпраўка ў Telegram (твой fetch)
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

    // 5. Вяртаем статус (твой функцыянал)
    return res
      .status(tgResponse.ok ? 200 : 500)
      .json({ success: tgResponse.ok });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ success: false });
  }
}
