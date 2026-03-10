import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { openUniversalModal } from "./modal.js";
import { updateAllTranslations } from "./i18n.js";

let swiperInstance = null;
export function newsCardTemplate(news) {
  return `
<div class="bg-black/80 border border-white/10 h-full flex flex-col hover:border-red-600/30 transition-all group w-full overflow-hidden">
  <div class="px-3 pt-3">
    <div class="aspect-video bg-black/80 flex items-center justify-center overflow-hidden relative border border-white/10">
      ${
        news.image
          ? `<img src="${news.image_thumb || news.image}" alt="${news.title}" width="494" height="278"
            class="w-full h-full object-cover grayscale-0 group-hover:grayscale transition-all duration-700">`
          : `<img src="/img/news/temp-thumb.webp" alt="Bulwark Fund"
            class="w-full h-full object-cover grayscale-0 group-hover:grayscale transition-all duration-700">`
      }
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  </div>
  <div class="p-6 pt-4 flex flex-col grow">
    <span class="text-red-600 text-xs font-bold uppercase tracking-widest mb-2">${news.date}</span>
    <h3 class="text-white font-bold mb-3 italic uppercase text-sm tracking-widest group-hover:text-red-600 transition-colors leading-tight min-h-[3rem] md:min-h-[2.5rem] line-clamp-3 md:line-clamp-2">
      ${news.title}
    </h3>
    <p class="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed font-light grow">
      ${news.excerpt}
    </p>
    <button type="button"
      class="open-news-btn mt-auto text-red-600 text-xs font-black uppercase flex items-center gap-1 hover:text-white transition-all group/btn"
      data-id="${news.id}">
      <span data-i18n="news.read_more">Чытаць цалкам</span>
      <i class="fa-solid fa-chevron-right text-xs group-hover/btn:translate-x-1 transition-transform"></i>
    </button>
  </div>
</div>`;
}
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

        if (dateB !== dateA) return dateB - dateA;
        return parseInt(b.id) - parseInt(a.id);
      });

      const latestNews = sortedNews.slice(0, 3);

      sliderWrapper.innerHTML = latestNews
        .map(
          (news) => `
<div class="swiper-slide h-auto flex">
  ${newsCardTemplate(news)}
</div>`,
        )
        .join("");

      updateAllTranslations();

      // Вешаем клікі на кнопкі адкрыцця навіны
      sliderWrapper.querySelectorAll(".open-news-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const newsItem = allNews.find(
            (n) => String(n.id) === String(btn.dataset.id),
          );
          if (newsItem) openUniversalModal(newsItem, "news");
        });
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
