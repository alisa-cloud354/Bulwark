import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // 1. Налады CORS — дазваляем адмінцы звяртацца да гэтага API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Апрацоўка папярэдняга запыту (Preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH, JWT_SECRET } = process.env;
  const authHeader = req.headers.authorization;

  // 2. Праверка аўтарызацыі (ці ёсць JWT токен адміна)
  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    jwt.verify(authHeader.replace("Bearer ", ""), JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid session" });
  }

  const { path } = req.query;
  const branch = GITHUB_BRANCH || "main";
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;

  // Загалоўкі для GitHub API
  const githubHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };

  try {
    // 3. Апрацоўка GET (чытанне файла)
    if (req.method === "GET") {
      const response = await fetch(`${url}?ref=${branch}`, {
        headers: githubHeaders,
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    // 4. Апрацоўка PUT (стварэнне/абнаўленне) і DELETE (выдаленне)
    if (req.method === "PUT" || req.method === "DELETE") {
      const response = await fetch(url, {
        method: req.method,
        headers: githubHeaders,
        body: JSON.stringify({
          ...req.body,
          branch: branch,
        }),
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("GitHub Proxy Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
