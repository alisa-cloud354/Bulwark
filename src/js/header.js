export function initHeader() {
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("mobile-menu-overlay");
  const closeBtn = document.getElementById("close-mobile-menu");
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const header = document.getElementById("main-header");
  const homeLink = document.getElementById("home-link");
  const langDropdown = document.getElementById("lang-dropdown");
  const langBtn = document.getElementById("lang-btn");

  // --- МОВЫ ---
  // Унутры функцыі initHeader знайсці секцыю МОВЫ:
  function toggleLang(e) {
    e.preventDefault();
    e.stopPropagation();
    // Гэта прымусова паказвае меню
    langDropdown?.classList.toggle("is-active");
  }

  // Дадай гэты апрацоўшчык, каб меню не закрывалася, калі ты водзіш унутры яго
  langDropdown?.addEventListener("mouseenter", () => {
    langDropdown.classList.add("is-active");
  });

  // Закрываем меню пры выбары мовы
  langDropdown?.addEventListener("click", (e) => {
    if (e.target.closest(".lang-switch")) {
      langDropdown.classList.remove("is-active");
    }
  });

  // Закрываем меню пры кліку па-за ім
  document.addEventListener("click", (e) => {
    if (langDropdown && !langDropdown.contains(e.target)) {
      langDropdown.classList.remove("is-active");
    }
  });

  // --- МАБАЙЛ-МЕНЮ ---
  function openMobileMenu() {
    mobileMenu?.classList.remove("-translate-y-[120%]");
    mobileMenu?.classList.add("translate-y-0");
    overlay?.classList.remove("hidden");
    setTimeout(() => overlay?.classList.remove("opacity-0"), 10);
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    mobileMenu?.classList.remove("translate-y-0");
    mobileMenu?.classList.add("-translate-y-[120%]");
    overlay?.classList.add("opacity-0");
    setTimeout(() => {
      if (mobileMenu?.classList.contains("-translate-y-[120%]")) {
        overlay?.classList.add("hidden");
      }
    }, 300);
    document.body.style.overflow = "";
  }

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // --- СКРОЛ ---
  function handleScroll() {
    const isScrolled = window.scrollY > 300;
    homeLink?.classList.toggle("opacity-0", !isScrolled);
    homeLink?.classList.toggle("translate-x-5", !isScrolled);
    homeLink?.classList.toggle("pointer-events-none", !isScrolled);
    homeLink?.classList.toggle("opacity-100", isScrolled);
    homeLink?.classList.toggle("translate-x-0", isScrolled);

    if (isScrolled) {
      header?.classList.remove("bg-[#1a1a1a]");
      header?.classList.add("bg-black/60", "backdrop-blur-md", "shadow-2xl");
    } else {
      header?.classList.add("bg-[#1a1a1a]");
      header?.classList.remove("bg-black/60", "backdrop-blur-md", "shadow-2xl");
    }
  }

  window.addEventListener("scroll", handleScroll);
  mobileBtn?.addEventListener("click", openMobileMenu);
  closeBtn?.addEventListener("click", closeMobileMenu);
  overlay?.addEventListener("click", closeMobileMenu);
  langBtn?.addEventListener("click", toggleLang);

  handleScroll();
}
