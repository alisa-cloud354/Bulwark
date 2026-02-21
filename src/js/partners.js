export function initPartners() {
  const render = () => {
    const container = document.getElementById("partners-list");
    if (!container) return;

    const translations = window.currentTranslations;
    const partners = translations?.donate_page?.partners;

    if (partners && Array.isArray(partners)) {
      container.innerHTML = partners
        .map(partner => `
          <div class="flex flex-col items-center justify-center p-4 border border-white/5 bg-black/80 hover:bg-white/[0.02] transition-all duration-300 group rounded-sm">
            
            <div class="h-16 w-full flex items-center justify-center mb-4">
              ${partner.logo 
                ? `<img src="${partner.logo}" 
                        alt="${partner.name}" 
                        class="max-h-full max-w-[100%] object-contain opacity-100 transition-all duration-300 filter brightness-1 invert" 
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                   <span class="hidden text-white/50 text-[12px] font-bold">${partner.name}</span>` 
                : `<span class="text-white/80 text-[12px] font-bold tracking-widest uppercase italic">${partner.name}</span>`
              }
            </div>

            <div class="text-[9px] font-black uppercase italic tracking-[0.2em] text-white/20 group-hover:text-white/60 transition-colors">
              ${partner.logo ? partner.name : ''}
            </div>
            
          </div>
        `)
        .join("");
    }
  };

  window.addEventListener("languageChanged", render);
  render();
}