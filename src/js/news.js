import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { openUniversalModal } from "./modal.js";
import { updateAllTranslations } from "./i18n.js";

let swiperInstance = null;

export async function initNewsSlider() {
  const sliderWrapper = document.querySelector(".news-slider .swiper-wrapper");
  if (!sliderWrapper) return;

  const loadNews = async () => {
    try {
      const lang = localStorage.getItem("preferred-lang") || "be";
      const fetchPath = `/locales/news-${lang}.json`;

      const response = await fetch(fetchPath);
      if (!response.ok) throw new Error(`Failed to load: ${fetchPath}`);

      const allNews = await response.json();

      // Сартаванне: свежыя даты зверху, пры супадзенні дат — большы ID зверху
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

      const latestNews = sortedNews.slice(0, 3);

      sliderWrapper.innerHTML = latestNews
        .map(
          (news) => `
<div class="swiper-slide h-auto flex">
  <div class="bg-black/50 border border-white/10 h-full flex flex-col hover:border-red-600/30 transition-all group w-full overflow-hidden">
    <div class="px-3 pt-3"> 
      <div class="aspect-video bg-black/50 flex items-center justify-center overflow-hidden relative border border-white/5">
        ${
          news.image
            ? `<img src="${news.image}" alt="${news.title}" 
                class="w-full h-full object-cover grayscale-0 group-hover:grayscale transition-all duration-700">`
            : `<img src="/img/logo.svg" alt="Logo" 
                class="w-20 opacity-20 transition-opacity duration-500">`
        }
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </div>
    <div class="p-6 pt-4 flex flex-col grow">
      <span class="text-red-600 text-[10px] font-bold uppercase tracking-widest mb-2">${news.date}</span>
      
      <h4 class="text-white font-bold mb-3 italic uppercase text-sm tracking-widest group-hover:text-red-600 transition-colors leading-tight min-h-[3rem] md:min-h-[2.5rem] line-clamp-3 md:line-clamp-2">
        ${news.title}
      </h4>

      <p class="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed font-light grow">
        ${news.excerpt}
      </p>
      <button class="bg-black/50 border-white/10 open-news-btn mt-auto text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-red-600 transition-all group/btn" 
              data-id="${news.id}">
        <span data-i18n="news.read_more">Чытаць цалкам</span>
        <i class="fa-solid fa-chevron-right text-[8px] group-hover/btn:translate-x-1 transition-transform"></i>
      </button>
    </div>
  </div>
</div>`,
        )
        .join("");

      updateAllTranslations();

      sliderWrapper.querySelectorAll(".open-news-btn").forEach((btn) => {
        btn.onclick = () => {
          const newsItem = allNews.find(
            (n) => String(n.id) === String(btn.dataset.id),
          );
          if (newsItem) openUniversalModal(newsItem, "news");
        };
      });

      manageSwiper();
    } catch (error) {
      console.error("Slider Load Error:", error);
    }
  };

  await loadNews();
  window.addEventListener("languageChanged", () => loadNews());
  window.addEventListener("resize", manageSwiper);
}

function manageSwiper() {
  const sliderElement = document.querySelector(".news-slider");
  if (!sliderElement) return;

  if (window.innerWidth >= 1280) {
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }
  } else {
    if (!swiperInstance) {
      swiperInstance = new Swiper(".news-slider", {
        modules: [Navigation],
        slidesPerView: 1,
        spaceBetween: 16,
        navigation: { nextEl: ".news-next", prevEl: ".news-prev" },
        breakpoints: { 768: { slidesPerView: 2, spaceBetween: 24 } },
      });
    } else {
      swiperInstance.update();
    }
  }
}
