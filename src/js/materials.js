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

        nav.addEventListener("click", (e) => {
          const btn = e.target.closest(".category-nav-btn");
          if (btn) {
            const target = document.getElementById(btn.dataset.id);
            if (target) {
              target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }
        });
      }

      // 2. Рэндэр карткаў
      container.innerHTML = currentMaterialsData
        .map(
          (item) => `
          <div id="${item.id}" class="flex flex-col md:flex-row border border-white/5 bg-[#050505] hover:border-red-600/30 transition-all group overflow-hidden">
              <div class="md:w-1/4 p-4 md:p-6 border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-start justify-start bg-[#050505]">
                  <span class="text-red-600 font-black uppercase italic text-sm xl:text-lg tracking-tighter break-words">
                      ${item.category}
                  </span>
              </div>
              
              <div class="md:w-3/4 p-4 md:p-6 flex flex-col justify-between">
                  <div>
                      <h4 class="text-white font-black mb-3 text-sm xl:text-lg uppercase tracking-tight group-hover:text-red-600 transition-colors">
                          ${item.title}
                      </h4>
                      <p class="text-gray-400 text-sm mb-8 leading-relaxed line-clamp-2">
                          ${item.short}
                      </p>
                  </div>
                  <button class="read-more-btn text-red-600 font-black text-xs uppercase tracking-widest flex items-center gap-1 hover:text-white transition-all group/btn" 
        data-id="${item.id}">
    <span data-i18n="materials.read_more">${t("materials.read_more") || "Чытаць матэрыял"}</span> 
    <i class="fa-solid fa-arrow-right text-xs group-hover/btn:translate-x-2 transition-transform"></i>
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
