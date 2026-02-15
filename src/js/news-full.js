import { t } from "./i18n.js";
import { openUniversalModal } from "./modal.js";

/**
 * Ініцыялізацыя поўнай сеткі навін (Архіў)
 */
export async function initFullNewsGrid() {
  const gridContainer = document.getElementById("news-grid-full");
  if (!gridContainer) return;

  const loadNews = async () => {
    try {
      const lang = localStorage.getItem("preferred-lang") || "be";

      // Універсальны шлях: цяпер усё ў locales і з працяжнікам
      const fetchPath = `/locales/news-${lang}.json`;

      const response = await fetch(fetchPath);
      if (!response.ok) throw new Error("Failed to load news archive");

      const allNews = await response.json();

      // Сартаванне навін па даце (ад новых да старых)
      const sortedNews = allNews.sort((a, b) => {
        const parse = (d) => new Date(d.split(".").reverse().join("-"));
        return parse(b.date) - parse(a.date);
      });

      gridContainer.innerHTML = sortedNews
        .map(
          (news) => `
            <div class="bg-black/50 border border-white/10 h-full flex flex-col hover:border-red-600/30 transition-all group w-full overflow-hidden">
                <div class="px-3 pt-3"> 
                    <div class="aspect-video bg-black/50 flex items-center justify-center overflow-hidden relative border border-white/5">
                        ${
                          news.image
                            ? `<img src="${news.image}" alt="${news.title}" class="w-full h-full object-cover grayscale-0 group-hover:grayscale transition-all duration-700">`
                            : `<img src="/img/logo.svg" alt="Logo" class="w-20 opacity-20 transition-opacity duration-500">`
                        }
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
                
                <div class="p-6 pt-4 flex flex-col grow text-left">
                    <span class="text-red-600 text-[10px] font-bold uppercase tracking-widest mb-2">${news.date}</span>
                    
                    <h4 class="text-white font-bold mb-3 italic uppercase text-sm tracking-widest group-hover:text-red-600 transition-colors leading-tight min-h-[3rem] md:min-h-[2.5rem] line-clamp-3 md:line-clamp-2">
                        ${news.title}
                    </h4>
                    
                    <p class="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed font-light grow">
                        ${news.excerpt}
                    </p>
                    
                    <button type="button" 
                            class="open-news-btn mt-auto text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:text-red-600 transition-all group/btn" 
                            data-id="${news.id}">
                        <span>${t("news.read_more")}</span>
                        <i class="fa-solid fa-chevron-right text-[8px] group-hover/btn:translate-x-1 transition-transform"></i>
                    </button>
                </div>
            </div>
        `,
        )
        .join("");

      // Ініцыялізацыя клікаў па кнопках "Чытаць цалкам"
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
      gridContainer.innerHTML = `<p class="text-white/50 text-center py-10">Не атрымалася загрузіць навіны.</p>`;
    }
  };

  await loadNews();

  // Перазагружаем сетку пры змене мовы
  window.addEventListener("languageChanged", loadNews);
}
