/* src/js/i18n.js */

let currentTranslations = {};
let currentNews = [];
let currentSEO = {};

/**
 * Асноўная функцыя змены мовы
 * Загружае ўсе неабходныя JSON-файлы і абнаўляе старонку
 */
export async function setLanguage(lang) {
  try {
    // 1. Загружаем асноўны файл перакладаў (кантэнт)
    const mainRes = await fetch(`/locales/${lang}.json`);
    if (!mainRes.ok)
      throw new Error(`Асноўны файл перакладаў не знойдзены: ${lang}`);
    currentTranslations = await mainRes.json();

    // 2. Загружаем файл навін для канкрэтнай мовы
    try {
      const newsRes = await fetch(`/locales/news-${lang}.json`);
      currentNews = newsRes.ok ? await newsRes.json() : [];
    } catch (e) {
      console.warn("Файл навін не знойдзены, выкарыстоўваем пусты масіў");
      currentNews = [];
    }

    // 3. Загружаем файл SEO мета-дадзеных
    try {
      const seoRes = await fetch(`/locales/seo-${lang}.json`);
      if (!seoRes.ok)
        throw new Error(`SEO файл не знойдзены: seo-${lang}.json`);
      currentSEO = await seoRes.json();
    } catch (e) {
      console.error("Памылка загрузкі SEO:", e);
      currentSEO = {};
    }

    // 4. Абнаўляем візуальныя тэксты на старонцы (data-i18n)
    updateAllTranslations();

    // 5. Абнаўляем усе 7 SEO мета-тэгаў у <head>
    updateSEO();

    // 6. Абнаўляем індыкатар мовы ў меню
    const langBtnSpan = document.querySelector("#current-lang");
    if (langBtnSpan) langBtnSpan.textContent = lang.toUpperCase();

    // 7. Захоўваем выбар карыстальніка
    localStorage.setItem("preferred-lang", lang);
    document.documentElement.lang = lang;

    // 8. Генерируем падзею для іншых модуляў (напрыклад, для слайдэра навін)
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));

    console.log(`Мова паспяхова зменена на: ${lang}`);
  } catch (error) {
    console.error("I18n Error:", error);
  }
}

/**
 * Функцыя абнаўлення SEO мета-тэгаў
 * Апрацоўвае 7 ключоў для кожнай старонкі
 */
function updateSEO() {
  if (!currentSEO || !currentSEO.seo) return;

  // Вызначаем ключ старонкі на аснове URL (напрыклад, 'projects' ці 'index')
  let pageKey =
    window.location.pathname.split("/").pop().replace(".html", "") || "index";

  // Калі шлях пусты, лічым што гэта галоўная
  if (pageKey === "" || pageKey === "/") pageKey = "index";

  const data = currentSEO.seo[pageKey];

  if (!data) {
    console.warn(`SEO дадзеныя для старонкі "${pageKey}" не знойдзены ў JSON.`);
    return;
  }

  // --- ПРАПІСВАЕМ УСЕ 7 КЛЮЧОЎ ---

  // 1. <title> (Укладка браўзера)
  if (data.title) {
    document.title = data.title;
  }

  // 2. <meta name="description">
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && data.description) {
    metaDesc.setAttribute("content", data.description);
  }

  // 3. <meta property="og:title">
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && data.og_title) {
    ogTitle.setAttribute("content", data.og_title);
  }

  // 4. <meta property="og:description">
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && data.og_description) {
    ogDesc.setAttribute("content", data.og_description);
  }

  // 5. <meta property="og:site_name">
  const ogSiteName = document.querySelector('meta[property="og:site_name"]');
  if (ogSiteName && data.og_site_name) {
    ogSiteName.setAttribute("content", data.og_site_name);
  }

  // 6. <meta name="twitter:title">
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) {
    twTitle.setAttribute("content", data.twitter_title || data.og_title || "");
  }

  // 7. <meta name="twitter:description">
  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) {
    twDesc.setAttribute(
      "content",
      data.twitter_description || data.og_description || "",
    );
  }
}

/**
 * Пошук перакладу па ключы (напрыклад, "nav.about")
 */
export function t(key) {
  return (
    key
      .split(".")
      .reduce((obj, i) => (obj ? obj[i] : null), currentTranslations) || key
  );
}

/**
 * Абнаўленне ўсіх элементаў з атрыбутам data-i18n
 */
export function updateAllTranslations() {
  if (!currentTranslations || Object.keys(currentTranslations).length === 0)
    return;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    let attrValue = el.getAttribute("data-i18n");
    if (!attrValue) return;

    let targetAttr = null;

    // Падтрымка атрыбутаў, напрыклад data-i18n="[placeholder]contacts.name"
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
 * Ініцыялізацыя пераключальніка моў
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

  // Загружаем захаваную мову або "be" па змаўчанні
  const savedLang = localStorage.getItem("preferred-lang") || "be";
  setLanguage(savedLang);
}
