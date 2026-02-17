import { openUniversalModal } from "./modal.js";
import { updateAllTranslations, t } from "./i18n.js";

export async function initMaterials() {
  const container = document.getElementById("materials-container");
  const nav = document.getElementById("materials-nav");

  if (!container) return;

  let currentMaterialsData = []; // Сховішча для дадзеных, каб не фетчыць двойчы

  const loadAndRender = async () => {
    try {
      const lang =
        document.documentElement.lang ||
        localStorage.getItem("preferred-lang") ||
        "be";

      const response = await fetch(`/locales/materials-${lang}.json`);
      if (!response.ok) throw new Error(`Materials file not found: ${lang}`);

      currentMaterialsData = await response.json();

      // 1. Рэндэр навігацыі
      if (nav) {
        nav.innerHTML = currentMaterialsData
          .map(
            (item) =>
              `<button data-id="${item.id}" class="category-nav-btn">#${item.category}</button>`,
          )
          .join("");

        // (Логіка скролу застаецца без зменаў)
      }

      // 2. Рэндэр карткаў
      container.innerHTML = currentMaterialsData
        .map(
          (item) => `
          <div id="${item.id}" class="flex flex-col md:flex-row border border-white/5 bg-[#050505] hover:border-red-600/30 transition-all group overflow-hidden">
              <div class="md:w-1/4 p-4 lg:p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center bg-[#050505]">
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
                      <span data-i18n="materials.read_more">${t("materials.read_more") || "Чытаць матэрыял"}</span> 
                      <i class="fa-solid fa-arrow-right text-[8px]"></i>
                  </button>
              </div>
          </div>
        `,
        )
        .join("");

      updateAllTranslations();
    } catch (e) {
      console.error("Error loading materials:", e);
    }
  };

  // Слухач клікаў (цяпер бярэ дадзеныя з памяці)
  container.onclick = (e) => {
    const btn = e.target.closest(".read-more-btn");
    if (btn) {
      const item = currentMaterialsData.find(
        (m) => String(m.id) === String(btn.dataset.id),
      );
      if (item) openUniversalModal(item, "material"); // Дадаем тып "material" для мадалкі, калі трэба
    }
  };

  await loadAndRender();
  window.addEventListener("languageChanged", loadAndRender);
}
