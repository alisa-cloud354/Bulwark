import { modalTemplates } from "./modalTemplates.js";

export function openUniversalModal(item) {
  const modal = document.getElementById("material-modal");
  const dynamicContainer = document.getElementById("modal-dynamic-container");
  const modalMeta = document.getElementById("modal-meta");

  if (!modal || !dynamicContainer) {
    console.error("Мадалка або кантэйнер не знойдзены ў DOM");
    return;
  }

  // 1. Запаўняем мета-дадзеныя (яны па-за шаблонам, у хедэры)
  if (modalMeta) {
    modalMeta.innerText =
      item.date || (item.category ? "#" + item.category : "");
  }

  // 2. Выбіраем і ўстаўляем шаблон (Цяпер элементы з'яўляюцца ў DOM)
  const template = item.date
    ? modalTemplates.news(item)
    : modalTemplates.material(item);
  dynamicContainer.innerHTML = template;

  // 3. Шляхам пошуку ўнутра ўжо створанага кантэнту наладжваем логіку
  setupInternalLogic(dynamicContainer);

  // 4. Паказваем мадалку
  modal.classList.remove("hidden");
  dynamicContainer.scrollTo(0, 0);
  document.body.style.overflow = "hidden";

  // Калі ёсць i18next ці іншая сістэма перакладу
  if (window.updateContent) window.updateContent();
}

// Унутраная логіка: Навігацыя, Капіяванне і г.д.
function setupInternalLogic(container) {
  const modalContent = container.querySelector("#modal-content");
  const internalNav = container.querySelector("#modal-internal-nav");

  if (!modalContent) return;

  // Навігацыя па H3
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

// Кіраванне мадалкай (закрыццё, друк)
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

  // Друк
  document
    .getElementById("print-material")
    ?.addEventListener("click", () => window.print());

  // Капіяванне (тэкст бярэцца з дынамічнага блока)
  document
    .getElementById("copy-material")
    ?.addEventListener("click", async () => {
      const content = document.getElementById("modal-content")?.innerText;
      if (!content) return;

      try {
        await navigator.clipboard.writeText(content);
        const copyTextSpan = document.getElementById("copy-text");
        if (copyTextSpan) {
          const originalText = copyTextSpan.innerText;
          copyTextSpan.innerText = "COPIED!";
          setTimeout(() => {
            copyTextSpan.innerText = originalText;
            if (window.updateContent) window.updateContent();
          }, 2000);
        }
      } catch (err) {
        console.error("Copy failed:", err);
      }
    });
}
