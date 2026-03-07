import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false });

  const { JWT_SECRET } = process.env;
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ success: false, message: "Няма токена" });

  try {
    jwt.verify(authHeader.replace("Bearer ", ""), JWT_SECRET);
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Токен несапраўдны" });
  }

  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res
      .status(400)
      .json({ success: false, message: "Пароль занадта кароткі" });
  }

  // У Vercel env нельга мяняць праграмна — вяртаем новы пароль каб адмін уручную абнавіў
  return res.status(200).json({
    success: true,
    message: `Новы пароль: ${newPassword}. Абнавіце ADMIN_PASSWORD у Vercel Environment Variables.`,
  });
}
