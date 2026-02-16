/**
 * Навігацыя для гібрыднага сайта (Lending + Pages)
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

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (href.startsWith("/#") || href.startsWith("#")) {
        const targetId = href.includes("#") ? "#" + href.split("#")[1] : null;
        const targetElement = targetId
          ? document.querySelector(targetId)
          : null;

        if (targetElement) {
          e.preventDefault();
          closeMenu();

          // ПРАВІЛЬНЫ СКРОЛ:
          const offset = 120; // Вышыня хэдэра з запасам
          // Вылічваем абсалютную пазіцыю элемента адносна верху старонкі
          const elementTop = targetElement.offsetTop;

          window.scrollTo({
            top: elementTop - offset,
            behavior: "smooth",
          });

          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // 3. Апрацоўка пераходу з іншай старонкі
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        const offset = 120;
        const elementTop = target.offsetTop;

        window.scrollTo({
          top: elementTop - offset,
          behavior: "smooth",
        });
      }, 300); // Крыху больш часу для ініцыялізацыі
    }
  }
};

// Выклікаем функцыю
initNavigation();
