let currentTranslations = {};
let currentNews = [];

export async function setLanguage(lang) {
  try {
    // 1. Спрабуем загрузіць асноўны пераклад
    const mainRes = await fetch(`/locales/${lang}.json`);
    if (!mainRes.ok) throw new Error(`Асноўны файл не знойдзены: ${lang}`);
    currentTranslations = await mainRes.json();

    // 2. Спрабуем загрузіць навіны (асобна, каб не зламаць усё астатняе)
    try {
      const newsRes = await fetch(`/locales/news_${lang}.json`);
      if (newsRes.ok) {
        currentNews = await newsRes.json();
      } else {
        console.warn(
          `Файл навін news_${lang}.json не знойдзены, выкарыстоўваем пусты спіс`,
        );
        currentNews = [];
      }
    } catch (e) {
      currentNews = [];
    }

    // 3. Абнаўляем тэксты на старонцы
    updateAllTranslations();

    // 4. Абнаўляем індыкатар мовы ў меню
    const langBtnSpan = document.querySelector("#current-lang");
    if (langBtnSpan) langBtnSpan.textContent = lang.toUpperCase();

    // 5. Захоўваем выбар
    localStorage.setItem("preferred-lang", lang);
    document.documentElement.lang = lang;

    // 6. Генерируем падзею для іншых скрыптоў
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));
  } catch (error) {
    console.error("I18n Error:", error);
  }
}

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

export function getNews() {
  return currentNews;
}

export function initLanguageSwitcher() {
  // Выкарыстоўваем дэлегаванне падзей на ўвесь document
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".lang-switch");
    if (btn) {
      e.preventDefault();
      const lang = btn.getAttribute("data-lang");
      console.log("Switching to:", lang); // Для адладкі ў кансолі
      setLanguage(lang);
    }
  });

  const savedLang = localStorage.getItem("preferred-lang") || "be";
  setLanguage(savedLang);
}
