import { defineConfig } from "vite";
import injectHTML from "vite-plugin-html-inject";
import { resolve } from "path";

export default defineConfig({
  root: "./",
  plugins: [injectHTML()],
  build: {
    rollupOptions: {
      input: {
        // Галоўная старонка (тут знаходзіцца секцыя #news)
        main: resolve(__dirname, "index.html"),

        // Асобныя старонкі ў src/pages/
        history: resolve(__dirname, "src/pages/history.html"),
        zarok: resolve(__dirname, "src/pages/zarok-vajara.html"),
        projects: resolve(__dirname, "src/pages/projects.html"),
        reports: resolve(__dirname, "src/pages/reports.html"),
        materials: resolve(__dirname, "src/pages/materials.html"),
        contacts: resolve(__dirname, "src/pages/contacts.html"),
        gallery: resolve(__dirname, "src/pages/gallery.html"),
        get_help: resolve(__dirname, "src/pages/get-help.html"),
        donate: resolve(__dirname, "src/pages/donate.html"),

        // Твая поўная старонка навін
        news_full: resolve(__dirname, "src/pages/news-full.html"),
        privacy: resolve(__dirname, "privacy.html"),
      },
    },
  },
});
