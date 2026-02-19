import { updateAllTranslations } from "./i18n.js";

export async function initContacts() {
  // --- НОВАЕ: Функцыя загрузкі моўных дадзеных ---
  async function loadContactsData() {
    try {
      const lang = localStorage.getItem("preferred-lang") || "be";
      const response = await fetch(`/locales/contacts/contacts-${lang}.json`);

      if (!response.ok)
        throw new Error(`Файл кантактаў не знойдзены для мовы: ${lang}`);

      const data = await response.json();

      // ЗАХОЎВАЕМ ГЛАБАЛЬНА: зліваем новыя ключы (contacts, ui, foundation і г.д.)
      // у агульны аб'ект window.currentTranslations
      window.currentTranslations = {
        ...(window.currentTranslations || {}),
        ...data,
      };

      // Выклікаем рэндэр тэкстаў, каб яны замяніліся ў HTML
      updateAllTranslations();
    } catch (error) {
      console.error("Contacts Data Error:", error);
    }
  }

  // 1. Загружаем дадзеныя пры ініцыялізацыі старонкі
  await loadContactsData();

  // 2. Слухаем змену мовы (калі карыстальнік клікнуў на пераключальнік у шапцы)
  window.addEventListener("languageChanged", async () => {
    await loadContactsData();
  });

  // --- Твая існуючая логіка (без зменаў) ---

  // 1. Капіяванне рэквізітаў
  const copyButtons = document.querySelectorAll(".copy-btn");
  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const textToCopy = button.getAttribute("data-copy");
      if (!textToCopy) return;

      const icon = button.querySelector("i");
      const originalClass = icon.className;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          icon.className = "fa-solid fa-check text-green-500";
          button.classList.add("scale-110");

          setTimeout(() => {
            icon.className = originalClass;
            button.classList.remove("scale-110");
          }, 2000);
        })
        .catch((err) => console.error("Error copying:", err));
    });
  });

  // 2. Анімацыя з'яўлення
  const observerOptions = {
    threshold: 0.05,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("opacity-100", "translate-y-0");
        entry.target.classList.remove("opacity-0", "translate-y-10");
      }
    });
  }, observerOptions);

  const itemsToAnimate = document.querySelectorAll(
    ".contact-sidebar > div, .contact-main-content > div",
  );

  itemsToAnimate.forEach((item) => {
    item.classList.add(
      "transition-all",
      "duration-700",
      "opacity-0",
      "translate-y-10",
    );
    observer.observe(item);
  });
}
