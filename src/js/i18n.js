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

    // 4. Абнаўляем візуальны індыкатар мовы
    const langBtnSpan = document.querySelector("#current-lang");
    if (langBtnSpan) langBtnSpan.textContent = lang.toUpperCase();

    // 5. Захоўваем стан
    localStorage.setItem("preferred-lang", lang);
    document.documentElement.lang = lang;

    // 6. Генерируем падзею для іншых скрыптоў
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));
  } catch (error) {
    console.error("I18n Error:", error);
  }
}

/**
 * Функцыя для пошуку і замены тэкстаў па атрыбуце data-i18n
 */
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

/**
 * Функцыя для атрымання перакладу па ключы ў JS кодзе
 */
export function t(key) {
  return (
    key
      .split(".")
      .reduce((obj, i) => (obj ? obj[i] : null), currentTranslations) || key
  );
}

/**
 * Функцыя для атрымання бягучага масіва навін
 */
export function getNews() {
  return currentNews;
}

/**
 * Ініцыялізацыя слухача клікаў
 */
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
