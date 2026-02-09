import { defineConfig } from "vite";
import injectHTML from "vite-plugin-html-inject";
import { resolve } from "path";

export default defineConfig({
  root: "./",
  plugins: [injectHTML()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        history: resolve(__dirname, "src/pages/history.html"),
        zarok: resolve(__dirname, "src/pages/zarok-vajara.html"),
        projects: resolve(__dirname, "src/pages/projects.html"),
        reports: resolve(__dirname, "src/pages/reports.html"),
        materials: resolve(__dirname, "src/pages/materials.html"),
        contacts: resolve(__dirname, "src/pages/contacts.html"),
        gallery: resolve(__dirname, "src/pages/gallery.html"),
        partners: resolve(__dirname, "src/pages/partners-full.html"),
        news: resolve(__dirname, "src/pages/news-full.html"),
        get_help: resolve(__dirname, "src/pages/get-help.html"),
        donate: resolve(__dirname, "src/pages/donate.html"),
        news_full: resolve(__dirname, "src/pages/news-full.html"),

        // Дадай астатнія (projects, reports і г.д.), калі яны гатовыя
      },
    },
  },
});
