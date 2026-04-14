import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // 1. Налада CORS - дазваляем адмінцы звяртацца да сайта
  const origin = req.headers.origin;
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });

  try {
    const { email, password } = req.body;
    const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env;

    // 2. Праверка наяўнасці налад на сервері (для адладкі)
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) {
      console.error(
        "Крытычная памылка: Пераменныя асяроддзя не настроены на Vercel",
      );
      return res.status(500).json({
        success: false,
        message:
          "Памылка канфігурацыі сервера. Праверце Environment Variables.",
      });
    }

    // 3. Валідацыя ўваходу (дадаем trim() для пошты)
    if (email?.trim() !== ADMIN_EMAIL.trim() || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Няправільны лагін або пароль",
      });
    }

    // 4. Стварэнне токена
    const token = jwt.sign({ email: ADMIN_EMAIL }, JWT_SECRET, {
      expiresIn: "8h",
    });

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Унутраная памылка сервера" });
  }
}
