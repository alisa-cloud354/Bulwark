/* src/js/i18n.js */
let currentTranslations = {};
let currentNews = [];

/**
 * Асноўная функцыя змены мовы
 */
export async function setLanguage(lang) {
  try {
    // 1. Загружаем асноўны файл перакладаў
    const mainRes = await fetch(`/locales/${lang}.json`);
    if (!mainRes.ok) throw new Error(`Translation file not found: ${lang}`);
    currentTranslations = await mainRes.json();

    // 2. Загружаем файл навін
    try {
      const newsRes = await fetch(`/locales/news-${lang}.json`);
      if (newsRes.ok) {
        currentNews = await newsRes.json();
      } else {
        currentNews = [];
      }
    } catch (e) {
      currentNews = [];
    }

    // 3. Абнаўляем тэксты на старонцы
    updateAllTranslations();

    // 4. АБНАЎЛЕННЕ SEO (НОВАЕ)
    // Шукаем ключы seo.title і seo.description у вашым JSON
    const pageTitle = t("seo.title");
    const pageDesc = t("seo.description");

    if (pageTitle && pageTitle !== "seo.title") {
      document.title = pageTitle;
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && pageDesc && pageDesc !== "seo.description") {
      metaDesc.setAttribute("content", pageDesc);
    }

    // 5. Абнаўляем візуальны індыкатар мовы
    const langBtnSpan = document.querySelector("#current-lang");
    if (langBtnSpan) langBtnSpan.textContent = lang.toUpperCase();

    // 6. Захоўваем стан
    localStorage.setItem("preferred-lang", lang);
    document.documentElement.lang = lang;

    // 7. Генерируем падзею для іншых скрыптоў
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));
  } catch (error) {
    console.error("I18n Error:", error);
  }
}

// ... астатнія функцыі (updateAllTranslations, t, getNews, initLanguageSwitcher) пакідаем без зменаў
export function updateAllTranslations() {
  if (!currentTranslations || Object.keys(currentTranslations).length === 0)
    return;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    let attrValue = el.getAttribute("data-i18n");
    if (!attrValue) return;

    let targetAttr = null;

    if (attrValue.startsWith("[")) {
      const match = attrValue.match(/^\[(.+?)\](.+)$/);
      if (match) {
        targetAttr = match[1];
        attrValue = match[2];
      }
    }

    const translation = attrValue
      .split(".")
      .reduce((obj, i) => (obj ? obj[i] : null), currentTranslations);

    if (translation) {
      if (targetAttr) {
        el.setAttribute(targetAttr, translation);
      } else {
        el.innerHTML = translation;
      }
    }
  });
}

export function t(key) {
  return (
    key
      .split(".")
      .reduce((obj, i) => (obj ? obj[i] : null), currentTranslations) || key
  );
}

export function initLanguageSwitcher() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".lang-switch");
    if (btn) {
      e.preventDefault();
      const lang = btn.getAttribute("data-lang");
      setLanguage(lang);
    }
  });

  const savedLang = localStorage.getItem("preferred-lang") || "be";
  setLanguage(savedLang);
}
