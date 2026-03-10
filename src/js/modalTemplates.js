import { t, updateAllTranslations } from "./i18n.js"; // Імпартуем нашы інструменты

export const modalTemplates = {
  news: (item) => `
    <div class="flex flex-col">
      <div class="px-5 md:px-9 xl:px-[60px] py-8 grid grid-cols-1 xl:grid-cols-[1fr_570px] gap-8 xl:gap-12 items-start">
        
        <div class="order-1 flex flex-col min-w-0">
          <h2 class="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black uppercase italic text-white leading-[1.1] tracking-tighter mb-6 break-words">
            ${item.title}
          </h2>
          <nav id="modal-internal-nav" class="flex flex-wrap gap-3 border-t border-white/5 pt-4 justify-start mt-auto"></nav>
        </div>

        <div class="order-2 w-full flex justify-end">
          <div class="border border-white/10 bg-black overflow-hidden w-full max-w-[696px]">
             <img src="${item.image || "/img/news/temp.webp"}" 
     class="w-full h-auto object-cover grayscale-0 hover:grayscale transition-all duration-700" 
     alt="${item.title}">
          </div>
        </div>
      </div>

      <div id="modal-content" class="px-5 md:px-9 xl:px-[60px] pb-20 prose prose-invert max-w-none text-gray-300 leading-relaxed font-light">
        ${item.content}
      </div>
    </div>
  `,

  material: (item) => `
    <div class="px-5 md:px-9 xl:px-[60px] py-8">
      <h2 class="text-3xl md:text-5xl font-black uppercase italic text-white leading-none tracking-tighter mb-6">
        ${item.title}
      </h2>
      <nav id="modal-internal-nav" class="flex flex-wrap gap-4 border-t border-white/5 py-4 mb-8 justify-start"></nav>
      <div id="modal-content" class="prose prose-invert max-w-none text-gray-300">
        ${item.content}
      </div>
    </div>
  `,

  donation: (item, ui) => `
<div class="flex flex-col text-left">
  <div class="px-5 md:px-9 py-8">
    
    <div class="mb-6 pl-2">
      <h2 class="text-2xl md:text-3xl xl:text-5xl text-red-600 font-black uppercase tracking-tighter mb-4">
        ${item.title}
      </h2>
      <p class="text-gray-400 text-xs font-bold tracking-[0.3em] italic">
        ${item.description}
      </p>
    </div>

    <div class="bg-black/80 border border-white/5 p-2 mb-4">
      <h3 class="text-white text-xs font-black uppercase tracking-[0.3em] mb-4 italic">${ui.bank_title}</h3>
      <div class="space-y-2 text-xs md:text-sm">
        <div class="flex flex-col md:flex-row md:justify-between border-b border-t border-white/5 py-1 gap-1">
          <span class="text-gray-400 uppercase text-xs font-bold">${ui.recipient}</span>
          <span class="text-white font-mono">${item.bank_details.recipient}</span>
        </div>
        <div class="flex flex-col md:flex-row md:justify-between border-b border-white/5 py-1 gap-1">
          <span class="text-gray-400 uppercase text-xs font-bold">${ui.edrpou}</span>
          <span class="text-white font-mono">${item.bank_details.edrpou}</span>
        </div>
        <div class="flex flex-col md:flex-row md:justify-between border-b border-white/5 py-1 gap-1">
          <span class="text-gray-400 uppercase text-xs font-bold">${ui.bank_name}</span>
          <span class="text-white font-mono">${item.bank_details.bank_name}</span>
        </div>
        <div class="flex flex-col md:flex-row md:justify-between py-1">
          <span class="text-gray-400 uppercase text-xs font-bold">${ui.swift}</span>
          <span class="text-white font-mono">${item.bank_details.swift}</span>
        </div>
      </div>
    </div>

    <div class="mb-4 bg-black/80 border border-white/5 p-2 flex items-center justify-between gap-4">
      <div class="grow">
        <h3 class="text-gray-400 uppercase text-xs font-bold mb-2">${ui.purpose_label}</h3>
        <p class="text-white font-mono leading-tight select-all">${item.purpose}</p>
      </div>
      <button data-copy="${item.purpose}" 
        class="copy-btn text-red-600 hover:text-white transition-colors px-2">
  <i class="fa-regular fa-copy"></i>
</button>
    </div>

    <h3 class="text-white text-xs font-black uppercase tracking-[0.3em] mb-4 italic pl-2">${ui.accounts_title}</h3>
    <div class="grid grid-cols-1 gap-2 mb-6">
      ${item.accounts
        .map((acc) => {
          if (acc.type === "header") {
            return `<h3 class="text-white text-xs font-black uppercase tracking-[0.3em] mt-4 mb-2 italic pl-2">${acc.label}</h3>`;
          }
          return `
          <div class="flex flex-col md:flex-row md:items-center bg-[#050505] border border-white/5">
            <span class="text-xs font-black text-gray-400 md:uppercase md:w-32 p-2">${acc.currency}</span>
            <div class="flex items-center justify-between grow bg-black/80 p-2 border border-white/5">
              <code class="text-[9px] md:text-xs text-white font-mono">${acc.value}</code>
             <button data-copy="${acc.value.replace(/\s/g, "")}" 
        class="copy-btn text-red-600 hover:text-white transition-colors px-2">
  <i class="fa-regular fa-copy"></i>
</button>
            </div>
          </div>
        `;
        })
        .join("")}
    </div>
  </div>
</div>
`,
  report: (item) => `
    <div class="flex flex-col h-full">
      <div class="px-5 md:px-9 xl:px-[60px] py-8 border-b border-white/5 bg-black/20">
        <h2 class="text-2xl md:text-3xl xl:text-4xl font-black uppercase italic text-white leading-tight tracking-tighter">
          ${item.title}
        </h2>
      </div>

      <div class="px-5 md:px-9 xl:px-[60px] py-10 grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-8 xl:gap-16 items-start overflow-y-auto">
        
        <div class="order-1 w-full flex justify-center xl:justify-start">
          <div class="group/img border border-white/10 bg-black overflow-hidden w-full max-w-[400px] aspect-square">
             <img src="${item.image || "/img/logo.svg"}" 
                  class="w-full h-full object-cover grayscale-0 hover:grayscale transition-all duration-700" 
                  alt="${item.title}">
          </div>
        </div>

        <div class="order-2 flex flex-col">
          <div class="flex items-center gap-3 mb-6">
             <span class="text-red-600 text-[10px] font-black uppercase tracking-[0.3em] italic border-b border-red-600/40 pb-1">
               ${item.date}
             </span>
          </div>
          <div id="modal-content" class="prose prose-invert max-w-none text-gray-300 leading-relaxed font-light">
            ${item.content}
          </div>
        </div>

      </div>
    </div>
  `,
};
