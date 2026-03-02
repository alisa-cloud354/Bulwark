import { t, updateAllTranslations } from "./i18n.js";
import { openUniversalModal } from "./modal.js";
import { newsCardTemplate } from "./news.js";

/**
 * Ініцыялізацыя поўнай сеткі навін (Архіў)
 */
export async function initFullNewsGrid() {
  const gridContainer = document.getElementById("news-grid-full");
  if (!gridContainer) return;

  const loadNews = async () => {
    try {
      const lang = localStorage.getItem("preferred-lang") || "be";
      const fetchPath = `/locales/news-${lang}.json`;

      const response = await fetch(fetchPath);
      if (!response.ok) throw new Error("Failed to load news archive");

      const allNews = await response.json();

      // Сартаванне: спачатку свежыя даты, пры аднолькавых датах — большы ID зверху
      const sortedNews = allNews.sort((a, b) => {
        const dateToNum = (d) => {
          const parts = d.split(".");
          const day = parts[0].padStart(2, "0");
          const month = parts[1].padStart(2, "0");
          const year = parts[2];
          return parseInt(year + month + day);
        };

        const dateA = dateToNum(a.date);
        const dateB = dateToNum(b.date);

        if (dateB !== dateA) {
          return dateB - dateA;
        }
        return parseInt(b.id) - parseInt(a.id);
      });

      gridContainer.innerHTML = sortedNews
        .map((news) => newsCardTemplate(news))
        .join("");
      updateAllTranslations();
      gridContainer.querySelectorAll(".open-news-btn").forEach((btn) => {
        btn.onclick = (e) => {
          e.preventDefault();
          const item = allNews.find(
            (n) => String(n.id) === String(btn.dataset.id),
          );
          if (item) openUniversalModal(item, "news");
        };
      });
    } catch (error) {
      console.error("Archive Load Error:", error);
      gridContainer.innerHTML = `<p class="text-white/50 text-center py-10">${t("news-full.error_load")}</p>`;
    }
  };

  await loadNews();
  window.addEventListener("languageChanged", loadNews);
}
