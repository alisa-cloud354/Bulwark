import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "swiper/css";
import "photoswipe/style.css";

let swiperInstance = null;

export async function initGallerySlider() {
  const container = document.getElementById("gallery-container");
  if (!container) return;

  try {
    const response = await fetch("/data/gallery.json");
    const galleryData = await response.json();

    // ГЕНЕРАЦЫЯ HTML
    // Ставім 1024x1024 - гэта "залаты стандарт", які PhotoSwipe праглыне на любым экране
    container.innerHTML = galleryData
      .map(
        (photo) => `
      <div class="swiper-slide h-auto">
          <a href="/img/gallery/${photo.src}" 
             data-pswp-width="700" 
             data-pswp-height="700"
             target="_blank"
             class="pswp-link block group relative overflow-hidden border border-white/10 bg-gray-900 aspect-square">
              <img src="/img/gallery/${photo.src}" 
                   alt="${photo.alt}" 
                   class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
          </a>
      </div>
    `,
      )
      .join("");

    // ІНІЦЫЯЛІЗАЦЫЯ PHOTOSWIPE
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery-container",
      children: "a",
      pswpModule: () => import("photoswipe"),

      // Гэта верне кнопку закрыцця і стрэлкі нават калі памеры "крывыя"
      padding: { top: 40, bottom: 40, left: 20, right: 20 },
    });

    lightbox.init();

    // SWIPER
    if (!swiperInstance) {
      swiperInstance = new Swiper(".gallery-swiper", {
        modules: [Navigation],
        slidesPerView: 1,
        spaceBetween: 16,
        navigation: {
          nextEl: ".gallery-next",
          prevEl: ".gallery-prev",
        },
        breakpoints: {
          768: { slidesPerView: 2, spaceBetween: 24 },
          1280: { slidesPerView: 3, spaceBetween: 30 },
        },
      });
    }
  } catch (err) {
    console.error("Gallery initialization failed:", err);
  }
}
