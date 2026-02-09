import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";

// Выносім зменную за межы функцый, каб яна была даступная ўсім
let swiperInstance = null;

export async function initNewsSlider() {
  const sliderWrapper = document.querySelector(".news-slider .swiper-wrapper");
  if (!sliderWrapper) return;

  try {
    const response = await fetch("/src/data/news.json");
    const allNews = await response.json();

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split(".").map(Number);
      return new Date(year, month - 1, day);
    };

    const sortedNews = allNews.sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB - dateA || b.id - a.id;
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
              <a href="${news.link}" class="mt-auto text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:text-red-600">
                <span data-i18n="materials.more">Больш</span>
                <i class="fa-solid fa-chevron-right text-[8px]"></i>
              </a>
            </div>
          </div>
        </div>
      `,
      )
      .join("");

    // Запускаем логіку кіравання свайперам
    manageSwiper();
    window.addEventListener("resize", manageSwiper);
  } catch (error) {
    console.error("Памылка загрузкі навін:", error);
  }
}

function manageSwiper() {
  const sliderElement = document.querySelector(".news-slider");
  if (!sliderElement) return;

  const isDesktop = window.innerWidth >= 1280;

  if (isDesktop) {
    if (swiperInstance) {
      // Гэта выдаліць усе стылі і класы Swiper
      swiperInstance.destroy(true, true);
      swiperInstance = null;
      window.dispatchEvent(new Event("resize"));
    }
  } else {
    if (!swiperInstance) {
      swiperInstance = new Swiper(".news-slider", {
        modules: [Navigation],
        slidesPerView: 1,
        spaceBetween: 16,
        navigation: {
          nextEl: ".news-next",
          prevEl: ".news-prev",
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
        },
      });
    }
  }
}
