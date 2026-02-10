// js/modal.js

export function openUniversalModal(item) {
  const modal = document.getElementById("material-modal");
  const modalContent = document.getElementById("modal-content");
  const modalInternalNav = document.getElementById("modal-internal-nav");

  if (!modal || !modalContent) return;

  // Напаўняем кантэнт
  modalContent.innerHTML = `
        <div class="mb-10">
            <span class="text-red-600 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                ${item.date ? item.date : "#" + item.category}
            </span>
            <h2 class="text-2xl md:text-4xl lg:text-5xl font-black uppercase italic text-white mt-2 leading-none tracking-tighter wrap-break-words">
                ${item.title}
            </h2>
        </div>
        <div class="material-text text-gray-300 mb-20">
            ${item.content}
        </div>
    `;

  // Апрацоўка ўнутранай навігацыі (калі ёсць h3 з id)
  if (modalInternalNav) {
    const headings = modalContent.querySelectorAll("h3[id]");
    if (headings.length > 0) {
      modalInternalNav.innerHTML = Array.from(headings)
        .map(
          (h3) => `
                    <button data-anchor="${h3.id}" 
                            class="px-3 py-2 bg-black border border-white/10 text-[8px] md:text-[10px] uppercase font-black tracking-widest text-white/50 hover:text-red-600 hover:border-red-600 transition-all">
                        ${h3.innerText}
                    </button>
                `,
        )
        .join("");
      modalInternalNav.classList.remove("hidden");
    } else {
      modalInternalNav.innerHTML = "";
      modalInternalNav.classList.add("hidden");
    }
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

export function closeUniversalModal() {
  const modal = document.getElementById("material-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}
