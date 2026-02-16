/**
 * Навігацыя для гібрыднага сайта (Landing + Pages)
 */

export const initNavigation = () => {
  const navLinks = document.querySelectorAll(".js-nav-link");
  const mobileMenu = document.querySelector(".mobile-menu");
  const menuBurger = document.querySelector(".burger-button");

  // 1. Функцыя закрыцця мабільнага меню
  const closeMenu = () => {
    if (mobileMenu && mobileMenu.classList.contains("is-open")) {
      mobileMenu.classList.remove("is-open");
    }
  };

  // 2. Апрацоўка клікаў па спасылках
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // Калі гэта спасылка на якар (на гэтай або іншай старонцы)
      if (href.startsWith("/#") || href.startsWith("#")) {
        const targetId = href.includes("#") ? "#" + href.split("#")[1] : null;
        const targetElement = targetId
          ? document.querySelector(targetId)
          : null;

        // Калі элемент ёсць на бягучай старонцы
        if (targetElement) {
          e.preventDefault();
          closeMenu();

          const offset = 100; // Вышыня хэдэра
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = targetElement.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Абнаўляем URL без перазагрузкі
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // 3. Апрацоўка пераходу з іншай старонкі (пры загрузцы)
  if (window.location.hash) {
    // 1. Адразу скідаем скрол у нуль, каб не было "дзёргання"
    window.scrollTo(0, 0);

    const targetId = window.location.hash;
    const target = document.querySelector(targetId);

    if (target) {
      // 2. Чакаем, пакуль пачнецца CSS-анімацыя fadeIn (300-400мс)
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

// Выклікаем функцыю
initNavigation();
