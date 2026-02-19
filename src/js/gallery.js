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

    container.innerHTML = galleryData
      .map((photo) => {
        // Гэтыя памеры пойдуць ТОЛЬКІ ў лайтбокс (PhotoSwipe)
        const w = photo.width || 1000;
        const h = photo.height || 1000;

        return `
      <div class="swiper-slide !h-auto">
          <a href="/img/gallery/${photo.src}" 
             data-pswp-width="${w}" 
             data-pswp-height="${h}"
             target="_blank"
             class="pswp-link block group relative overflow-hidden border border-white/10 bg-gray-900 aspect-square">
              <img src="/img/gallery/${photo.src}" 
                   alt="${photo.alt}" 
                   class="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
          </a>
      </div>
    `;
      })
      .join("");

    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery-container",
      children: "a",
      pswpModule: () => import("photoswipe"),
      padding: { top: 40, bottom: 40, left: 20, right: 20 },
    });

    // МАГІЯ ТУТ: Аўтаматычнае вызначэнне памераў
    lightbox.addFilter("itemData", (itemData) => {
      const img = new Image();
      img.src = itemData.src;
      img.onload = () => {
        itemData.width = img.width;
        itemData.height = img.height;
      };
      return itemData;
    });

    lightbox.init();

    // Swiper застаецца без змен...
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
