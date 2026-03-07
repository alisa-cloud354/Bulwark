export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false });

  const { email } = req.body;
  const { ADMIN_EMAIL, ADMIN_PASSWORD, TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } =
    process.env;

  if (email !== ADMIN_EMAIL) {
    return res.status(200).json({ success: true }); // не раскрываем ці існуе пошта
  }

  const message = `🔐 <b>Нагадванне пароля</b>\n\nПароль: <code>${ADMIN_PASSWORD}</code>`;

  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML",
    }),
  });

  return res
    .status(200)
    .json({ success: true, message: "Пароль адпраўлены ў Telegram" });
}
