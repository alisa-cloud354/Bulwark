export function initHeader() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const openBtn = document.getElementById("open-sidebar");
  const closeBtn = document.getElementById("close-sidebar");
  const mobileBtn = document.getElementById("mobile-menu-btn");

  const langDropdown = document.querySelector(".dropdown-lang");
  const langBtn = document.getElementById("lang-btn"); // выкарыстоўваем ID

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

  function toggleLang(e) {
    e.preventDefault();
    e.stopPropagation();
    langDropdown?.classList.toggle("is-active");
  }

  openBtn?.addEventListener("click", openSidebar);
  mobileBtn?.addEventListener("click", openSidebar);
  closeBtn?.addEventListener("click", closeSidebar);
  overlay?.addEventListener("click", closeSidebar);

  langBtn?.addEventListener("click", toggleLang);

  document.addEventListener("click", (e) => {
    // Калі клікнулі па-за межамі дропдаўна — закрываем яго
    if (langDropdown && !langDropdown.contains(e.target)) {
      langDropdown.classList.remove("is-active");
    }
  });
}
