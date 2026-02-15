import { modalTemplates } from "./modalTemplates.js";
import { t, updateAllTranslations } from "./i18n.js"; // Выкарыстоўваем нашы функцыі

export function openUniversalModal(item, type = null) {
  const modal = document.getElementById("material-modal");
  const dynamicContainer = document.getElementById("modal-dynamic-container");
  const modalMeta = document.getElementById("modal-meta");

  if (!modal || !dynamicContainer) {
    console.error("Мадалка або кантэйнер не знойдзены ў DOM");
    return;
  }

  // 1. Запаўняем мета-дадзеныя (дата або катэгорыя зверху)
  if (modalMeta) {
    modalMeta.innerText =
      item.date || (item.category ? "#" + item.category : "");
  }

  // 2. ПАДРЫХТОЎКА ДАДЗЕНЫХ UI (для перакладу подпісаў унутры шаблона)
  // Спрабуем знайсці блок 'ui' альбо ў самім item, альбо ў глабальнай зменнай window.donationData
  const uiData =
    item.ui || (window.donationData ? window.donationData.ui : null);

  // 3. ВЫБАР ШАБЛОНА
  let template;
  if (type && modalTemplates[type]) {
    // Перадаем item і uiData. Калі uiData будзе undefined,
    // шаблон donation выкарыстае свае значэнні па змаўчанні (дзякуючы нашай праверцы ў шаблоне).
    template = modalTemplates[type](item, uiData);
  } else {
    // Логіка для навін і звычайных матэрыялаў
    template = item.date
      ? modalTemplates.news(item)
      : modalTemplates.material(item);
  }

  dynamicContainer.innerHTML = template;

  // 4. Наладжваем логіку (якарная навігацыя для доўгіх тэкстаў)
  setupInternalLogic(dynamicContainer);

  // 5. Паказваем мадалку
  modal.classList.remove("hidden");
  dynamicContainer.scrollTo(0, 0);
  document.body.style.overflow = "hidden";

  // Прымусова абнаўляем пераклады ўнутры мадалкі пасля ўстаўкі шаблона
  updateAllTranslations();
}

function setupInternalLogic(container) {
  const modalContent = container.querySelector("#modal-content");
  const internalNav = container.querySelector("#modal-internal-nav");

  if (!modalContent) return;

  const headings = modalContent.querySelectorAll("h3");
  if (internalNav && headings.length > 0) {
    internalNav.innerHTML = Array.from(headings)
      .map((h3, i) => {
        const id = `nav-anchor-${i}`;
        h3.id = id;
        return `<button data-anchor="${id}" class="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-white/40 hover:text-red-600 transition-all text-left py-1">${h3.innerText}</button>`;
      })
      .join("");

    internalNav.onclick = (e) => {
      const btn = e.target.closest("button");
      if (btn) {
        const target = document.getElementById(btn.dataset.anchor);
        if (target)
          container.scrollTo({
            top: target.offsetTop - 20,
            behavior: "smooth",
          });
      }
    };
  } else if (internalNav) {
    internalNav.classList.add("hidden");
  }
}

export function closeUniversalModal() {
  const modal = document.getElementById("material-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

export function initModalControl() {
  const modal = document.getElementById("material-modal");
  if (!modal) return;

  document
    .getElementById("close-modal")
    ?.addEventListener("click", closeUniversalModal);
  document
    .getElementById("close-modal-text")
    ?.addEventListener("click", closeUniversalModal);

  modal.onclick = (e) => {
    if (e.target === modal || e.target.classList.contains("modal-overlay")) {
      closeUniversalModal();
    }
  };

  document
    .getElementById("print-material")
    ?.addEventListener("click", () => window.print());

  document
    .getElementById("copy-material")
    ?.addEventListener("click", async () => {
      const content = document.getElementById("modal-content")?.innerText;
      if (!content) return;

      try {
        await navigator.clipboard.writeText(content);
        const copyTextSpan = document.getElementById("copy-text");
        if (copyTextSpan) {
          // Выкарыстоўваем нашу t() для тэксту "Скапіявана"
          copyTextSpan.innerText = t("modal.copied");

          setTimeout(() => {
            // Вяртаем зыходны тэкст "Капіяваць"
            copyTextSpan.innerText = t("modal.copy");
            updateAllTranslations();
          }, 2000);
        }
      } catch (err) {
        console.error("Copy failed:", err);
      }
    });
}
