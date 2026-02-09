export function initZarokVajara() {
  const scrollElement = document.querySelector(".animate-scroll-vertical");

  if (scrollElement) {
    const pauseScroll = () => scrollElement.classList.add("is-paused");
    const resumeScroll = () => scrollElement.classList.remove("is-paused");

    // Мыш (Дэсктоп)
    scrollElement.addEventListener("mouseenter", pauseScroll);
    scrollElement.addEventListener("mouseleave", resumeScroll);

    // Тач (Мабільныя і планшэты)
    scrollElement.addEventListener("touchstart", pauseScroll, {
      passive: true,
    });
    scrollElement.addEventListener("touchend", resumeScroll, { passive: true });
    scrollElement.addEventListener("touchcancel", resumeScroll, {
      passive: true,
    });
  }
}
