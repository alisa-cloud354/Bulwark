import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "swiper/css";
import "photoswipe/style.css";

let swiperInstance = null;

export async function initGallerySlider() {
  const sliderElement = document.querySelector(".gallery-swiper");
  if (!sliderElement) return;

  // 1. Ініцыялізацыя лайтбокса
  const lightbox = new PhotoSwipeLightbox({
    gallery: "#gallery-container",
    children: "a",
    pswpModule: () => import("photoswipe"),
  });
  lightbox.init();

  // 2. Стварэнне свайпера (без destroy, працуе ўсюды)
  if (!swiperInstance) {
    swiperInstance = new Swiper(".gallery-swiper", {
      modules: [Navigation],
      slidesPerView: 1,
      spaceBetween: 16,
      centeredSlides: false,
      navigation: { nextEl: ".gallery-next", prevEl: ".gallery-prev" },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 24 },
        1280: { slidesPerView: 3, spaceBetween: 30 },
      },
    });
  }
}
