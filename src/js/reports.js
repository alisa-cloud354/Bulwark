import { t } from "./i18n.js";
import { openUniversalModal } from "./modal.js";

export async function initFullReportsGrid() {
  const gridContainer = document.getElementById("reports-grid-full");
  if (!gridContainer) return;

  // Ствараем функцыю загрузкі, якую будзем выклікаць пры кожнай змене мовы
  const loadReports = async () => {
    try {
      const lang = localStorage.getItem("preferred-lang") || "be";
      // Вызначаем шлях да патрэбнага JSON-файла
      const fetchPath =
        lang === "be" ? "/data/reports.json" : `/locales/reports-${lang}.json`;

      const response = await fetch(fetchPath);
      if (!response.ok)
        throw new Error(`Не атрымалася загрузіць справаздачы: ${fetchPath}`);

      const allReports = await response.json();

      // Сартаванне: самыя свежыя па даце заўсёды зверху
      const sortedReports = allReports.sort((a, b) => {
        const parse = (d) => new Date(d.split(".").reverse().join("-"));
        return parse(b.date) - parse(a.date);
      });

      // Гнеруй сетку карткаў
      gridContainer.innerHTML = sortedReports
        .map(
          (report) => `
          <div class="bg-black/20 border border-white/5 h-full flex flex-col hover:border-red-600/30 transition-all group">
            <div class="aspect-video bg-black/40 flex items-center justify-center overflow-hidden relative border-b border-white/5">
              <img src="${report.image || "/img/logo.svg"}" 
                   alt="${report.title}" 
                   class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            <div class="p-6 flex flex-col grow">
              <span class="text-red-600 text-[10px] font-bold uppercase tracking-widest mb-2">
                ${report.date}
              </span>
              
              <h4 class="text-white font-bold mb-3 italic uppercase text-sm tracking-widest group-hover:text-red-600 transition-colors leading-tight">
                ${report.title}
              </h4>
              
              <p class="text-gray-400 text-xs mb-6 line-clamp-3 font-light grow leading-relaxed text-left">
                ${report.excerpt}
              </p>
              
              <button type="button" 
                      class="open-report-btn mt-auto text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:text-red-600 transition-all" 
                      data-id="${report.id}">
                <span>${report.more || "Больш"}</span>
                <i class="fa-solid fa-chevron-right text-[8px] group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        `,
        )
        .join("");

      // Навешваем падзею кліку на кожную кнопку
      gridContainer.querySelectorAll(".open-report-btn").forEach((btn) => {
        btn.onclick = (e) => {
          e.preventDefault();
          const item = allReports.find(
            (r) => String(r.id) === String(btn.dataset.id),
          );
          if (item) {
            openUniversalModal(item, "report");
          }
        };
      });
    } catch (error) {
      console.error("Памылка пры загрузцы сеткі справаздач:", error);
      gridContainer.innerHTML = `<p class="text-white">Памылка загрузкі дадзеных.</p>`;
    }
  };

  // Першы запуск пры загрузцы старонкі
  await loadReports();

  // Гэта ключавы момант: слухаем падзею змены мовы, каб перамаляваць кантэнт без рэфрэшу старонкі
  window.addEventListener("languageChanged", loadReports);
}
