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
             <img src="${item.image || "/img/logo.svg"}" 
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
    
    <div class="mb-8 border-l-4 border-red-600 pl-6">
      <h2 class="text-3xl md:text-5xl font-black uppercase italic text-white leading-none tracking-tighter mb-2">
        ${item.title}
      </h2>
      <p class="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] italic">
        ${item.description}
      </p>
    </div>

    <div class="bg-[#050505] border border-white/10 p-6 mb-6 relative overflow-hidden group">
      <h3 class="text-red-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4 italic">${ui.bank_title}</h3>
      <div class="space-y-3 text-xs md:text-sm">
        <div class="flex flex-col md:flex-row md:justify-between border-b border-white/5 pb-2">
          <span class="text-gray-500 uppercase text-[9px] font-bold">${ui.recipient}</span>
          <span class="text-white font-mono text-right">${item.bank_details.recipient}</span>
        </div>
        <div class="flex flex-col md:flex-row md:justify-between border-b border-white/5 pb-2">
          <span class="text-gray-500 uppercase text-[9px] font-bold">${ui.edrpou}</span>
          <span class="text-white font-mono text-right">${item.bank_details.edrpou}</span>
        </div>
        <div class="flex flex-col md:flex-row md:justify-between border-b border-white/5 pb-2">
          <span class="text-gray-500 uppercase text-[9px] font-bold">${ui.bank_name}</span>
          <span class="text-white font-mono text-right">${item.bank_details.bank_name}</span>
        </div>
        <div class="flex flex-col md:flex-row md:justify-between">
          <span class="text-gray-500 uppercase text-[9px] font-bold">${ui.swift}</span>
          <span class="text-white font-mono text-right">${item.bank_details.swift}</span>
        </div>
      </div>
    </div>

    <div class="mb-8 bg-[#050505] border border-white/10 p-4 flex items-center justify-between gap-4">
      <div class="grow">
        <span class="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-1">${ui.purpose_label}</span>
        <p class="text-sm text-white italic font-bold leading-tight select-all">${item.purpose}</p>
      </div>
      <button onclick="navigator.clipboard.writeText('${item.purpose}');" 
              class="text-red-600 hover:text-white transition-colors p-2">
        <i class="fa-regular fa-copy"></i>
      </button>
    </div>

    <h3 class="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 italic">${ui.accounts_title}</h3>
    <div class="space-y-2">
      ${item.accounts
        .map((acc) => {
          if (acc.type === "header") {
            return `<h3 class="text-red-600 text-[10px] font-black uppercase tracking-[0.3em] mt-8 mb-4 italic border-b border-red-600/20 pb-2">${acc.label}</h3>`;
          }
          return `
          <div class="flex flex-col md:flex-row md:items-center bg-[#050505] border border-white/10 p-3 gap-3">
            <div class="flex items-center gap-3 md:w-40 shrink-0">
              <span class="text-[9px] font-black text-gray-300 uppercase italic">${acc.currency}</span>
            </div>
            <div class="flex items-center justify-between grow bg-black/40 p-2 border border-white/5">
              <code class="text-[10px] md:text-xs text-red-500 font-mono">${acc.value}</code>
              <button onclick="navigator.clipboard.writeText('${acc.value.replace(/\s/g, "")}');" class="text-gray-600 hover:text-white px-2">
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
