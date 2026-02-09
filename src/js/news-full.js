export async function initFullNewsGrid() {
  const gridContainer = document.getElementById("news-grid-full");
  if (!gridContainer) return;

  try {
    const response = await fetch("/data/news.json");
    const allNews = await response.json();

    // Сартаванне па даце (свежыя зверху)
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split(".").map(Number);
      return new Date(year, month - 1, day);
    };

    const sortedNews = allNews.sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB - dateA || b.id - a.id;
    });

    gridContainer.innerHTML = sortedNews
      .map(
        (news) => `
            <div class="bg-black/20 border border-white/5 h-full flex flex-col hover:border-red-600/30 transition-all group">
                <div class="aspect-video bg-black/40 flex items-center justify-center p-8 overflow-hidden relative">
                    <img src="/src/assets/img/logo.svg" alt="Logo" class="w-20 opacity-20 group-hover:scale-110 transition-transform duration-500">
                </div>
                <div class="p-6 flex flex-col grow">
                    <span class="text-red-600 text-[10px] font-bold uppercase tracking-widest mb-2">${news.date}</span>
                    <h4 class="text-white font-bold mb-3 line-clamp-2 italic uppercase text-sm tracking-widest group-hover:text-red-600 transition-colors">
                        ${news.title}
                    </h4>
                    <p class="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                        ${news.excerpt}
                    </p>
                    <a href="${news.link}" class="mt-auto text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:text-red-600">
                        <span data-i18n="materials.more">Больш</span>
                        <i class="fa-solid fa-chevron-right text-[8px]"></i>
                    </a>
                </div>
            </div>
        `,
      )
      .join("");
  } catch (error) {
    console.error("Памылка загрузкі архіву:", error);
    gridContainer.innerHTML = `<p class="text-white">Не ўдалося загрузіць навіны.</p>`;
  }
}
