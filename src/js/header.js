export function initHeader() {
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("mobile-menu-overlay");
  const closeBtn = document.getElementById("close-mobile-menu");
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const header = document.getElementById("main-header");
  const homeLink = document.getElementById("home-link");
  const langDropdown = document.getElementById("lang-dropdown");
  const langBtn = document.getElementById("lang-btn");

  // ─── ПАЧАТКОВЫ СТАН ───────────────────────────────────────────────────────
  // aria-expanded павінен быць выстаўлены адразу пры загрузцы
  langBtn?.setAttribute("aria-expanded", "false");

  // Дынамічная вышыня хедара для меню і оверлея
  function updateHeaderHeight() {
    const h = header?.offsetHeight ?? 128;
    document.documentElement.style.setProperty("--header-h", h + "px");
  }
  updateHeaderHeight();
  window.addEventListener("resize", updateHeaderHeight);

  // ─── МОВА ─────────────────────────────────────────────────────────────────
  function openLang() {
    langDropdown?.classList.add("is-active");
    langBtn?.setAttribute("aria-expanded", "true");
  }

  function closeLang() {
    langDropdown?.classList.remove("is-active");
    langBtn?.setAttribute("aria-expanded", "false");
  }

  // Hover працуе толькі на прыладах з мышай
  if (window.matchMedia("(hover: hover)").matches) {
    langDropdown?.addEventListener("mouseenter", openLang);
    langDropdown?.addEventListener("mouseleave", closeLang);
  }

  // Клік — для touch-прылад і клавіятуры
  langBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = langDropdown?.classList.contains("is-active");
    isOpen ? closeLang() : openLang();
  });

  // Закрыць пры выбары мовы
  langDropdown?.addEventListener("click", (e) => {
    if (e.target.closest(".lang-switch")) {
      closeLang();
    }
  });

  // Закрыць пры кліку па-за дропдаўнам
  document.addEventListener("click", (e) => {
    if (langDropdown && !langDropdown.contains(e.target)) {
      closeLang();
    }
  });

  // ─── МАБАЙЛ-МЕНЮ ──────────────────────────────────────────────────────────
  function openMobileMenu() {
    mobileMenu?.classList.remove("-translate-y-[120%]");
    mobileMenu?.classList.add("translate-y-0");
    mobileBtn?.setAttribute("aria-expanded", "true");
    overlay?.classList.remove("hidden");
    // невялікі дэлей, каб transition спрацаваў
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay?.classList.remove("opacity-0");
      });
    });
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    mobileMenu?.classList.remove("translate-y-0");
    mobileMenu?.classList.add("-translate-y-[120%]");
    mobileBtn?.setAttribute("aria-expanded", "false");
    overlay?.classList.add("opacity-0");
    setTimeout(() => {
      // толькі хаваем калі меню сапраўды закрыта (не адкрылі зноў за 300мс)
      if (mobileMenu?.classList.contains("-translate-y-[120%]")) {
        overlay?.classList.add("hidden");
      }
    }, 300);
    document.body.style.overflow = "";
  }

  // Закрыць пры кліку на любую спасылку ў меню
  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // ─── ESCAPE ───────────────────────────────────────────────────────────────
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileMenu();
      closeLang();
    }
  });

  // ─── СКРОЛ ────────────────────────────────────────────────────────────────
  function handleScroll() {
    const isScrolled = window.scrollY > 300;

    // Хатняя іконка
    homeLink?.classList.toggle("opacity-0", !isScrolled);
    homeLink?.classList.toggle("translate-x-5", !isScrolled);
    homeLink?.classList.toggle("pointer-events-none", !isScrolled);
    homeLink?.classList.toggle("opacity-100", isScrolled);
    homeLink?.classList.toggle("translate-x-0", isScrolled);

    // Фон хедара
    // УВАГА: кіруем класамі на самім #main-header,
    // упэўніся, што ў HTML на <header> ёсць bg-[#050505] як дэфолт
    if (isScrolled) {
      header?.classList.remove("bg-[#050505]");
      header?.classList.add("bg-black/50", "backdrop-blur-md", "shadow-2xl");
    } else {
      header?.classList.add("bg-[#050505]");
      header?.classList.remove("bg-black/50", "backdrop-blur-md", "shadow-2xl");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  // ─── ПРЫВЯЗКА ПАДЗЕЙ ──────────────────────────────────────────────────────
  mobileBtn?.addEventListener("click", openMobileMenu);
  closeBtn?.addEventListener("click", closeMobileMenu);
  overlay?.addEventListener("click", closeMobileMenu);

  // ─── ІНІЦЫЯЛІЗАЦЫЯ ────────────────────────────────────────────────────────
  handleScroll();
}
