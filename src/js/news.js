import { openUniversalModal } from "./modal.js";

export async function initNewsSlider() {
  const sliderWrapper = document.querySelector(".news-slider .swiper-wrapper");
  if (!sliderWrapper) return;

  try {
    const response = await fetch("/data/news.json");
    const allNews = await response.json();

    // Сартаванне (самыя свежыя зверху)
    const sortedNews = allNews.sort((a, b) => {
      const dateA = new Date(a.date.split(".").reverse().join("-"));
      const dateB = new Date(b.date.split(".").reverse().join("-"));
      return dateB - dateA;
    });

    const latestNews = sortedNews.slice(0, 3);

    sliderWrapper.innerHTML = latestNews
      .map(
        (news) => `
        <div class="swiper-slide h-auto flex">
          <div class="bg-black/20 border border-white/5 h-full flex flex-col hover:border-red-600/30 transition-all group w-full">
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
              <button class="open-news-btn mt-auto text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-red-600 transition-all" 
                      data-id="${news.id}">
                <span data-i18n="news.read_more">Чытаць цалкам</span>
                <i class="fa-solid fa-chevron-right text-[8px]"></i>
              </button>
            </div>
          </div>
        </div>
      `,
      )
      .join("");

    // Слухач падзей (выкарыстоўваем імпартаваную функцыю)
    sliderWrapper.addEventListener("click", (e) => {
      const btn = e.target.closest(".open-news-btn");
      if (btn) {
        const newsId = btn.dataset.id;
        const newsItem = allNews.find((n) => String(n.id) === String(newsId));
        if (newsItem) {
          openUniversalModal(newsItem);
        }
      }
    });

    if (typeof manageSwiper === "function") manageSwiper();
  } catch (error) {
    console.error("Памылка загрузкі навін:", error);
  }
}
