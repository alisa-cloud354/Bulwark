import { defineConfig } from "vite";
import injectHTML from "vite-plugin-html-inject";
import { resolve } from "path";

export default defineConfig({
  root: "./",
  plugins: [
    injectHTML(),
    {
      name: "dev-rewrite",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Спіс нашых старонак для рэрайта
          const pages = [
            "/history",
            "/zarok-vajara",
            "/projects",
            "/reports",
            "/materials",
            "/contacts",
            "/gallery",
            "/get-help",
            "/donate",
            "/news-full",
            "/privacy",
          ];

          // Калі запыт супадае з адной са старонак — дадаем шлях да файла
          if (pages.includes(req.url)) {
            if (req.url === "/privacy") {
              req.url = "/privacy.html";
            } else {
              req.url = `/pages${req.url}.html`;
            }
          }
          next();
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        history: resolve(__dirname, "pages/history.html"),
        zarok: resolve(__dirname, "pages/zarok-vajara.html"),
        projects: resolve(__dirname, "pages/projects.html"),
        reports: resolve(__dirname, "pages/reports.html"),
        materials: resolve(__dirname, "pages/materials.html"),
        contacts: resolve(__dirname, "pages/contacts.html"),
        gallery: resolve(__dirname, "pages/gallery.html"),
        get_help: resolve(__dirname, "pages/get-help.html"),
        donate: resolve(__dirname, "pages/donate.html"),
        news_full: resolve(__dirname, "pages/news-full.html"),
        privacy: resolve(__dirname, "privacy.html"),
      },
    },
  },
});
