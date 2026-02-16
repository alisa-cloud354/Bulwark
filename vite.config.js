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
