import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // 1. Налады CORS — больш строгія для бяспекі
  const origin = req.headers.origin;
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH, JWT_SECRET } = process.env;
  const authHeader = req.headers.authorization;

  // ПРАВЕРКА 1: Ці ёсць токен увогуле
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Больш надзейны спосаб атрымаць токен

  try {
    // ПРАВЕРКА 2: Валідацыя токена
    jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("JWT Verify Error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid session" });
  }

  const { path } = req.query;
  const branch = GITHUB_BRANCH || "main";
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;

  const githubHeaders = {
    Authorization: `token ${GITHUB_TOKEN}`, // Для GitHub лепш выкарыстоўваць "token" замест "Bearer"
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };

  try {
    if (req.method === "GET") {
      const response = await fetch(`${url}?ref=${branch}`, {
        headers: githubHeaders,
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    if (req.method === "PUT" || req.method === "DELETE") {
      const response = await fetch(url, {
        method: req.method,
        headers: githubHeaders,
        body: JSON.stringify({ ...req.body, branch }),
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
