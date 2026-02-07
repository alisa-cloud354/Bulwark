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
        // Дадай астатнія (projects, reports і г.д.), калі яны гатовыя
      },
    },
  },
});
