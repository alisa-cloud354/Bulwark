import { openUniversalModal } from "./modal.js";
import { updateAllTranslations } from "./i18n.js"; // Імпартуем функцыю перакладу

export async function initMaterials() {
  const container = document.getElementById("materials-container");
  const nav = document.getElementById("materials-nav");

  if (!container) return;

  /**
   * Асноўная функцыя загрузкі і рэндэру кантэнту
   */
  const loadAndRender = async () => {
    try {
      // Бярэм мову з тэга html (якую ўсталяваў твой i18n.js) або з localStorage
      const lang =
        document.documentElement.lang ||
        localStorage.getItem("preferred-lang") ||
        "be";

      const response = await fetch(`/locales/materials-${lang}.json`);
      if (!response.ok) throw new Error(`Materials file not found: ${lang}`);

      const data = await response.json();

      // 1. Рэндэр навігацыі (катэгорыі)
      if (nav) {
        nav.innerHTML = data
          .map(
            (item) => `
              <button data-id="${item.id}" class="category-nav-btn">
                  #${item.category}
              </button>
            `,
          )
          .join("");

        nav.onclick = (e) => {
          const btn = e.target.closest(".category-nav-btn");
          if (btn) {
            const target = document.getElementById(btn.dataset.id);
            if (target) {
              const headerOffset = 280;
              const elementPosition = target.getBoundingClientRect().top;
              const offsetPosition =
                elementPosition + window.pageYOffset - headerOffset;

              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              });
            }
          }
        };
      }

      // 2. Рэндэр картак матэрыялаў
      container.innerHTML = data
        .map(
          (item) => `
          <div id="${item.id}" class="flex flex-col md:flex-row border border-white/5 bg-[#050505] hover:border-red-600/30 transition-all group overflow-hidden">
              <div class="md:w-1/4 p-4 md:p-4 lg:p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center bg-[#050505]">
                  <span class="text-red-600 font-black uppercase italic text-xl md:text-sm xl:text-2xl tracking-tighter break-words">
                      ${item.category}
                  </span>
              </div>
              
              <div class="md:w-3/4 p-4 md:p-8 flex flex-col justify-between">
                  <div>
                      <h4 class="text-white font-bold mb-3 text-lg md:text-xl uppercase tracking-tight group-hover:text-red-600 transition-colors">
                          ${item.title}
                      </h4>
                      <p class="text-gray-500 text-sm mb-8 leading-relaxed line-clamp-2">
                          ${item.short}
                      </p>
                  </div>
                  <button class="read-more-btn text-white font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-3 hover:text-red-600 transition-all" 
                          data-id="${item.id}">
                      <span data-i18n="materials.read_more">Чытаць матэрыял</span> 
                      <i class="fa-solid fa-arrow-right text-[8px]"></i>
                  </button>
              </div>
          </div>
        `,
        )
        .join("");

      // 3. Прымусова абнаўляем тэксты кнопак праз твой i18n
      updateAllTranslations();
    } catch (e) {
      console.error("Error loading materials:", e);
    }
  };

  // Слухач клікаў для кнопак "Чытаць матэрыял" (дэлегаванне падзей)
  container.addEventListener("click", async (e) => {
    const btn = e.target.closest(".read-more-btn");
    if (btn) {
      const lang = document.documentElement.lang || "be";
      // Каб не рабіць лішні fetch, мы можам атрымаць дадзеныя з актуальнага файла
      const res = await fetch(`/locales/materials-${lang}.json`);
      const currentData = await res.json();
      const item = currentData.find(
        (m) => String(m.id) === String(btn.dataset.id),
      );
      if (item) openUniversalModal(item);
    }
  });

  // Ініцыялізацыя (першая загрузка)
  await loadAndRender();

  // СЛУХАЧ ПАДЗЕЙ: рэагуем на змену мовы з твайго i18n.js
  window.addEventListener("languageChanged", async (e) => {
    console.log("Materials: language changed to", e.detail);
    await loadAndRender();
  });
}
