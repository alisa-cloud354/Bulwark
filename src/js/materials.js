import { openUniversalModal, closeUniversalModal } from "./modal.js";

export async function initMaterials() {
  const container = document.getElementById("materials-container");
  const nav = document.getElementById("materials-nav");
  const modal = document.getElementById("material-modal");
  const closeBtn = document.getElementById("close-modal");

  if (!container) return;

  try {
    const response = await fetch("/data/materials.json");
    const data = await response.json();

    // 1. Галоўная навігацыя (скрол да картак)
    if (nav) {
      nav.innerHTML = data
        .map(
          (item) => `
          <button onclick="document.getElementById('${item.id}').scrollIntoView({ behavior: 'smooth', block: 'start' })"
                  class="px-4 py-2 border border-white/10 text-[10px] uppercase font-black tracking-widest text-white/50 hover:border-red-600 hover:text-white transition-all bg-black">
              #${item.category}
          </button>
      `,
        )
        .join("");
    }

    // 2. Генерацыя картак матэрыялаў
    container.innerHTML = data
      .map(
        (item) => `
        <div id="${item.id}" class="flex flex-col md:flex-row border border-white/5 bg-[#0a0a0a] hover:border-red-600/30 transition-all group scroll-mt-24">
            <div class="md:w-1/4 p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center bg-white/2">
                <span class="text-red-600 font-black uppercase italic text-2xl tracking-tighter">
                    ${item.category}
                </span>
            </div>
            <div class="md:w-3/4 p-8 flex flex-col justify-between">
                <div>
                    <h4 class="text-white font-bold mb-3 text-xl uppercase tracking-tight group-hover:text-red-600 transition-colors">
                        ${item.title}
                    </h4>
                    <p class="text-gray-500 text-sm mb-8 leading-relaxed line-clamp-2">
                        ${item.short}
                    </p>
                </div>
                <button class="read-more-btn text-white font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-3 hover:text-red-600 transition-all" 
                        data-id="${item.id}">
                    Чытаць матэрыял <i class="fa-solid fa-arrow-right text-[8px]"></i>
                </button>
            </div>
        </div>
    `,
      )
      .join("");

    // 3. Слухачы падзей
    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".read-more-btn");
      if (btn) {
        const item = data.find((m) => String(m.id) === String(btn.dataset.id));
        if (item) openUniversalModal(item);
      }
    });

    // Закрыццё
    if (closeBtn) closeBtn.onclick = closeUniversalModal;

    // Закрыццё па кліку на фон
    if (modal) {
      modal.onclick = (e) => {
        if (
          e.target.id === "material-modal" ||
          e.target.classList.contains("container-custom")
        ) {
          closeUniversalModal();
        }
      };
    }

    // Утыліты (Друк і Капіяванне)
    const printBtn = document.getElementById("print-material");
    if (printBtn) printBtn.onclick = () => window.print();

    const copyBtn = document.getElementById("copy-material");
    if (copyBtn) {
      copyBtn.onclick = async () => {
        const modalContent = document.getElementById("modal-content");
        const copyTextSpan = document.getElementById("copy-text");
        await navigator.clipboard.writeText(modalContent.innerText);
        if (copyTextSpan) {
          copyTextSpan.innerText = "Скапіявана!";
          setTimeout(() => (copyTextSpan.innerText = "Скапіяваць тэкст"), 2000);
        }
      };
    }
  } catch (e) {
    console.error("Error loading materials:", e);
  }
}
