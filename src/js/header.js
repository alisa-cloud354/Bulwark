export function initHeader() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const openBtn = document.getElementById("open-sidebar");
  const closeBtn = document.getElementById("close-sidebar");
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const header = document.getElementById("main-header");
  const homeLink = document.getElementById("home-link");

  const langDropdown = document.querySelector(".dropdown-lang");
  const langBtn = document.getElementById("lang-btn");

  function openSidebar() {
    sidebar?.classList.remove("translate-x-full");
    overlay?.classList.remove("hidden");
    setTimeout(() => overlay?.classList.remove("opacity-0"), 10);
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar?.classList.add("translate-x-full");
    overlay?.classList.add("opacity-0");
    setTimeout(() => {
      if (sidebar?.classList.contains("translate-x-full")) {
        overlay?.classList.add("hidden");
      }
    }, 300);
    document.body.style.overflow = "";
  }

  // НОВАЕ: Закрыццё пры кліку на спасылкі
  const sidebarLinks = sidebar?.querySelectorAll("a");
  sidebarLinks?.forEach((link) => {
    link.addEventListener("click", () => {
      closeSidebar();
    });
  });

  function handleScroll() {
    if (window.scrollY > 300) {
      // З'яўленне доміка
      homeLink?.classList.remove(
        "opacity-0",
        "translate-x-5",
        "pointer-events-none",
      );
      homeLink?.classList.add("opacity-100", "translate-x-0");

      // Эфект празрыстасці пры скроле
      header?.classList.remove("bg-[#1a1a1a]"); // Прыбіраем шчыльны фон
      header?.classList.add("bg-black/60", "backdrop-blur-md", "shadow-2xl");
    } else {
      // Знікненне доміка
      homeLink?.classList.add(
        "opacity-0",
        "translate-x-5",
        "pointer-events-none",
      );
      homeLink?.classList.remove("opacity-100", "translate-x-0");

      // Вяртаем шчыльны фон на старце
      header?.classList.add("bg-[#1a1a1a]");
      header?.classList.remove("bg-black/60", "backdrop-blur-md", "shadow-2xl");
    }
  }

  function toggleLang(e) {
    e.preventDefault();
    e.stopPropagation();
    langDropdown?.classList.toggle("is-active");
  }

  window.addEventListener("scroll", handleScroll);
  openBtn?.addEventListener("click", openSidebar);
  mobileBtn?.addEventListener("click", openSidebar);
  closeBtn?.addEventListener("click", closeSidebar);
  overlay?.addEventListener("click", closeSidebar);
  langBtn?.addEventListener("click", toggleLang);

  document.addEventListener("click", (e) => {
    if (langDropdown && !langDropdown.contains(e.target)) {
      langDropdown.classList.remove("is-active");
    }
  });

  handleScroll();
}
