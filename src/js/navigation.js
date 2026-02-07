/**
 * Навігацыя для гібрыднага сайта (Lending + Pages)
 */

export const initNavigation = () => {
  const navLinks = document.querySelectorAll(".js-nav-link");
  const mobileMenu = document.querySelector(".mobile-menu"); // Замяні на свой клас
  const menuBurger = document.querySelector(".burger-button"); // Кнопка адкрыцця/закрыцця

  // 1. Функцыя закрыцця мабільнага меню
  const closeMenu = () => {
    if (mobileMenu && mobileMenu.classList.contains("is-open")) {
      mobileMenu.classList.remove("is-open");
      // Калі ты мяняеш абразок бургер-кнопкі, дадай лагіку сюды
    }
  };

  // 2. Апрацоўка клікаў
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // Правяраем, ці гэта спасылка на якар на галоўнай старонцы
      if (href.startsWith("/#") || href.startsWith("#")) {
        const targetId = href.includes("#") ? "#" + href.split("#")[1] : null;
        const targetElement = targetId
          ? document.querySelector(targetId)
          : null;

        // Калі мы на галоўнай і элемент існуе
        if (targetElement) {
          e.preventDefault();
          closeMenu();

          // Плаўная пракрутка
          const offset = 80; // Вышыня твайго хэдэра
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Абнаўляем URL без перазагрузкі (апцыянальна)
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // 3. Апрацоўка пераходу з іншай старонкі (пры загрузцы)
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      // Чакаем крыху, каб Vite/браўзер паспелі ўсё адрэндэрыць
      setTimeout(() => {
        const offset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 200);
    }
  }
};

// Выклікаем функцыю
initNavigation();
