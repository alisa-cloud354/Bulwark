import { modalTemplates } from "./modalTemplates.js";
import { t, updateAllTranslations } from "./i18n.js";

// Захоўваем элемент які адкрыў мадал — для вяртання фокуса пры закрыцці
let previousFocus = null;

export function openUniversalModal(item, type = null) {
  const modal = document.getElementById("material-modal");
  const dynamicContainer = document.getElementById("modal-dynamic-container");
  const modalMeta = document.getElementById("modal-meta");

  if (!modal || !dynamicContainer) {
    console.error("Мадалка або кантэйнер не знойдзены ў DOM");
    return;
  }

  // Запамінаем адкуль адкрылі — каб вярнуць фокус пры закрыцці
  previousFocus = document.activeElement;

  // 1. Запаўняем мета-дадзеныя (дата або катэгорыя зверху)
  if (modalMeta) {
    modalMeta.textContent =
      item.date || (item.category ? "#" + item.category : "");
  }

  // 2. ПАДРЫХТОЎКА ДАДЗЕНЫХ UI
  const uiData =
    type === "payment"
      ? window.donationData
        ? window.donationData.payment_ui
        : null
      : item.ui || (window.donationData ? window.donationData.ui : null);

  // 3. ВЫБАР ШАБЛОНА
  const template =
    type && modalTemplates[type]
      ? modalTemplates[type](item, uiData)
      : item.date
        ? modalTemplates.news(item)
        : modalTemplates.material(item);

  dynamicContainer.innerHTML = template;

  // 4. Наладжваем логіку (якарная навігацыя для доўгіх тэкстаў)
  setupInternalLogic(dynamicContainer);

  // 5. Паказваем мадалку
  modal.classList.remove("hidden");
  dynamicContainer.scrollTo(0, 0);
  document.body.style.overflow = "hidden";

  // Пераводзім фокус на кнопку закрыцця
  document.getElementById("close-modal")?.focus({ preventScroll: true });

  // Прымусова абнаўляем пераклады ўнутры мадалкі пасля ўстаўкі шаблона
  updateAllTranslations();
}

function setupInternalLogic(container) {
  const modalContent = container.querySelector("#modal-content");
  const internalNav = container.querySelector("#modal-internal-nav");

  if (modalContent) {
    const headings = modalContent.querySelectorAll("h3");
    if (internalNav && headings.length > 0) {
      internalNav.innerHTML = Array.from(headings)
        .map((h3, i) => {
          const id = `nav-anchor-${i}`;
          h3.id = id;
          return `<button data-anchor="${id}" class="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-white/40 hover:text-red-600 transition-all text-left py-1">${h3.textContent}</button>`;
        })
        .join("");

      internalNav.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (btn) {
          const target = document.getElementById(btn.dataset.anchor);
          if (target) {
            const containerRect = container.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            container.scrollTo({
              top:
                container.scrollTop + targetRect.top - containerRect.top - 20,
              behavior: "smooth",
            });
          }
        }
      });
    } else if (internalNav) {
      internalNav.classList.add("hidden");
    }
  }

  container.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy;
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        const icon = btn.querySelector("i");
        if (icon) {
          icon.className = "fa-solid fa-check text-green-500";
          setTimeout(() => {
            icon.className = "fa-regular fa-copy";
          }, 2000);
        }
      } catch (err) {
        console.error("Copy failed:", err);
      }
    });
  });
}

export function closeUniversalModal() {
  const modal = document.getElementById("material-modal");
  if (!modal) return;

  modal.classList.add("hidden");
  document.body.style.overflow = "";

  // Вяртаем фокус на элемент які адкрыў мадал
  previousFocus?.focus();
  previousFocus = null;
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

  // Закрыццё па кліку на оверлей або фон мадала
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("modal-overlay")) {
      closeUniversalModal();
    }
  });

  // Закрыццё па Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeUniversalModal();
    }
  });

  document
    .getElementById("print-material")
    ?.addEventListener("click", () => window.print());

  document
    .getElementById("copy-material")
    ?.addEventListener("click", async () => {
      const content = document.getElementById("modal-content")?.innerText;
      if (!content) return;

      const copyTextSpan = document.getElementById("copy-text");

      try {
        await navigator.clipboard.writeText(content);

        if (copyTextSpan) {
          copyTextSpan.textContent = t("modal.copied");
          setTimeout(() => {
            copyTextSpan.textContent = t("modal.copy");
            updateAllTranslations();
          }, 2000);
        }
      } catch (err) {
        console.error("Copy failed:", err);
        if (copyTextSpan) {
          copyTextSpan.textContent = t("modal.copy_error") ?? "Памылка";
          setTimeout(() => {
            copyTextSpan.textContent = t("modal.copy");
            updateAllTranslations();
          }, 2000);
        }
      }
    });
}
