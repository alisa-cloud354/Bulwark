import "./css/main.css";

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const openBtn = document.getElementById("open-sidebar");
  const closeBtn = document.getElementById("close-sidebar");
  const mobileBtn = document.getElementById("mobile-menu-btn");

  function openSidebar() {
    sidebar.classList.remove("translate-x-full");
    overlay.classList.remove("hidden");
    setTimeout(() => overlay.classList.remove("opacity-0"), 10);
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.add("translate-x-full");
    overlay.classList.add("opacity-0");
    setTimeout(() => {
      // Калі пасля анімацыі сайдбар усё яшчэ закрыты — хаваем оверлэй
      if (sidebar.classList.contains("translate-x-full")) {
        overlay.classList.add("hidden");
      }
    }, 300);
    document.body.style.overflow = "";
  }

  openBtn?.addEventListener("click", openSidebar);
  mobileBtn?.addEventListener("click", openSidebar);
  closeBtn?.addEventListener("click", closeSidebar);
  overlay?.addEventListener("click", closeSidebar);
});
