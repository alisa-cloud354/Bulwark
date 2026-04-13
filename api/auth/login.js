import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false });

  const { email, password } = req.body;
  const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res
      .status(401)
      .json({ success: false, message: "Няправільны лагін або пароль" });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "8h" });
  return res.status(200).json({ success: true, token });
}
//камент каб зрабіць рэдэплойй
