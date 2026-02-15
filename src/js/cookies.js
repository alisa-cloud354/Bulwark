export function initCookies() {
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");

  // Калі карыстальнік яшчэ не націскаў "Accept", паказваем банэр
  if (!localStorage.getItem("cookie-accepted")) {
    // Невялікая затрымка, каб банэр выехаў прыгожа пасля загрузкі
    setTimeout(() => {
      banner.classList.remove("translate-y-full");
    }, 1000);
  }

  acceptBtn?.addEventListener("click", () => {
    // Запісваем у памяць браўзера, што згода дадзена
    localStorage.setItem("cookie-accepted", "true");
    // Хаваем банэр
    banner.classList.add("translate-y-full");
  });
}
