export const modalTemplates = {
  news: (item) => `
    <div class="flex flex-col">
      <div class="px-5 md:px-9 xl:px-[60px] py-8 grid grid-cols-1 xl:grid-cols-[1fr_minmax(auto,696px)] gap-8 xl:gap-12 items-start">
        
        <div class="order-1">
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-black uppercase italic text-white leading-tight tracking-tighter mb-6">
            ${item.title}
          </h2>
          <nav id="modal-internal-nav" class="flex flex-wrap gap-3 border-t border-white/5 pt-4 justify-start"></nav>
        </div>

        <div class="order-2 w-full">
          <div class="group/img border border-white/10 bg-black overflow-hidden cursor-crosshair">
             <img src="${item.image || "/src/assets/img/logo.svg"}" 
                  class="${
                    item.image
                      ? "w-full h-auto object-cover transition-all duration-700 grayscale-0 hover:grayscale"
                      : "w-full h-auto p-20 opacity-10"
                  }" 
                  alt="${item.title}">
          </div>
        </div>
      </div>

      <div id="modal-content" class="px-5 md:px-9 xl:px-[60px] pb-20 prose prose-invert max-w-none text-gray-300">
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
};
