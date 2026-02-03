// Функцыя для загрузкі і змены мовы
export async function setLanguage(lang) {
  try {
    const response = await fetch(`./locales/${lang}.json`);
    if (!response.ok)
      throw new Error(`Не атрымалася загрузіць файл: ${lang}.json`);

    const translations = await response.json();

    // Знаходзім усе элементы з атрыбутам data-i18n
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      // Дазваляе выкарыстоўваць кропкі ў ключах, напрыклад "nav.projects"
      const translation = key
        .split(".")
        .reduce((obj, i) => (obj ? obj[i] : null), translations);

      if (translation) {
        // Выкарыстоўваем innerHTML, каб працавалі тэгі <br> і <strong>
        el.innerHTML = translation;
      }
    });

    // Абнаўляем бачны тэкст бягучай мовы ў хэдэры
    const langBtnSpan = document.querySelector("#current-lang");
    if (langBtnSpan) langBtnSpan.textContent = lang.toUpperCase();

    // Захоўваем мову ў браўзеры
    localStorage.setItem("preferred-lang", lang);
    document.documentElement.lang = lang;
  } catch (error) {
    console.error("I18n Error:", error);
  }
}

// Ініцыялізацыя пераключальніка
export function initLanguageSwitcher() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".lang-switch");
    if (btn) {
      const lang = btn.getAttribute("data-lang");
      setLanguage(lang);
    }
  });

  // Загрузка пры старце (па змаўчанні беларуская)
  const savedLang = localStorage.getItem("preferred-lang") || "be";
  setLanguage(savedLang);
}
