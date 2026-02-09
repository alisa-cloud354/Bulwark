export async function initMaterials() {
  const container = document.getElementById("materials-container");
  const nav = document.getElementById("materials-nav");
  const modal = document.getElementById("material-modal");
  const modalContent = document.getElementById("modal-content");
  const closeBtn = document.getElementById("close-modal");
  const modalInternalNav = document.getElementById("modal-internal-nav");

  if (!container) return;

  try {
    const response = await fetch("/data/materials.json");
    const data = await response.json();

    // 1. Галоўная навігацыя (унізе старонкі)
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

    // 2. Генерацыя картак
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

    // 3. Мадальнае вакно
    const openModal = (id) => {
      const item = data.find((m) => m.id === id);
      if (item) {
        modalContent.innerHTML = `
            <div class="mb-10">
                <span class="text-red-600 font-bold uppercase tracking-widest text-xs">#${item.category}</span>
                <h2 class="text-3xl md:text-4xl font-black uppercase italic text-white mt-2">${item.title}</h2>
            </div>
            <div class="material-text text-gray-300">
                ${item.content}
            </div>
        `;

        if (modalInternalNav) {
          const anchors = [
            { id: "legal-who", text: "Хто лічыцца" },
            { id: "legal-why", text: "Навошта" },
            { id: "legal-vnj", text: "ВНЖ" },
            { id: "legal-pmj", text: "ПМЖ" },
            { id: "legal-citizen", text: "Грамадзянства" },
            { id: "legal-refusal", text: "Адмова" },
          ];

          modalInternalNav.innerHTML = anchors
            .map(
              (a) => `
              <button data-anchor="${a.id}" class="px-3 py-2 bg-black border border-white/10 text-[9px] uppercase font-black tracking-widest text-white/50 hover:text-red-600 hover:border-red-600 transition-all">
                ${a.text}
              </button>
            `,
            )
            .join("");

          modalInternalNav.onclick = (e) => {
            const btn = e.target.closest("button");
            if (btn) {
              const targetId = btn.dataset.anchor;
              const targetElement = document.getElementById(targetId);
              const scrollContainer = modal.querySelector(".overflow-y-auto");
              if (targetElement && scrollContainer) {
                scrollContainer.scrollTo({
                  top: targetElement.offsetTop - 40,
                  behavior: "smooth",
                });
              }
            }
          };
        }

        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      }
    };

    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".read-more-btn");
      if (btn) openModal(btn.dataset.id);
    });

    const closeModal = () => {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    };

    closeBtn.onclick = closeModal;

    // Кнопкі ўтыліт
    document.getElementById("print-material").onclick = () =>
      setTimeout(() => window.print(), 250);
    document.getElementById("copy-material").onclick = async () => {
      const copyTextSpan = document.getElementById("copy-text");
      await navigator.clipboard.writeText(modalContent.innerText);
      copyTextSpan.innerText = "Скапіявана!";
      setTimeout(() => (copyTextSpan.innerText = "Скапіяваць тэкст"), 2000);
    };

    modal.onclick = (e) => {
      if (
        e.target.id === "material-modal" ||
        e.target.classList.contains("container-custom")
      )
        closeModal();
    };
  } catch (e) {
    console.error("Error:", e);
  }
}
