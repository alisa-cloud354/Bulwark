/**
 * Навігацыя для гібрыднага сайта (Landing + Pages)
 */

export const initNavigation = () => {
  const navLinks = document.querySelectorAll(".js-nav-link");
  const mobileMenu = document.querySelector(".mobile-menu");

  const closeMenu = () => {
    if (mobileMenu && mobileMenu.classList.contains("is-open")) {
      mobileMenu.classList.remove("is-open");
    }
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // ПРАВЕРКА: ці вядзе спасылка на якар (на гэтай або галоўнай старонцы)
      // Дадаем праверку на /index.html#
      if (
        href.startsWith("#") ||
        href.startsWith("/#") ||
        href.includes("index.html#")
      ) {
        const targetId = href.includes("#") ? "#" + href.split("#")[1] : null;
        const targetElement = targetId
          ? document.querySelector(targetId)
          : null;

        // Калі мы на той жа старонцы, дзе і элемент
        if (targetElement) {
          e.preventDefault();
          closeMenu();

          const offset = 100;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = targetElement.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          history.pushState(null, null, targetId);
        }
        // Калі элемента няма (значыць, мы на іншай старонцы),
        // браўзер проста пяройдзе па спасылцы /index.html#target - гэта нам і трэба.
      }
    });
  });

  // Апрацоўка прызямлення з іншай старонкі (застаецца без зменаў)
  if (window.location.hash) {
    window.scrollTo(0, 0);

    const targetId = window.location.hash;
    const target = document.querySelector(targetId);

    if (target) {
      setTimeout(() => {
        const offset = 100;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = target.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 400);
    }
  }
};

initNavigation();
