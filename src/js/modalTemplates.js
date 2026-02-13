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

  donation: (item) => `
    <div class="flex flex-col text-left">
      <div class="px-5 md:px-9 xl:px-[60px] py-8">
        <div class="mb-8 border-l-4 border-red-600 pl-6">
          <h2 class="text-3xl md:text-5xl font-black uppercase italic text-white leading-none tracking-tighter mb-4">
            ${item.title}
          </h2>
          <p class="text-gray-400 text-sm md:text-base font-light italic uppercase tracking-wider">
            ${item.description}
          </p>
        </div>

        <div class="mb-12 bg-zinc-900/50 border border-white/5 p-6 md:p-8">
          <h3 data-i18n="donate.quick_payment" class="text-xs font-black uppercase tracking-[0.3em] text-red-600 mb-6 italic">Хуткая аплата (UAH)</h3>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            ${[100, 200, 500]
              .map(
                (amount) => `
              <button onclick="document.getElementById('custom-amount').value = ${amount};" 
                      class="py-3 border border-white/10 hover:border-red-600 transition-all font-mono text-white font-bold hover:bg-red-600/10">
                ${amount}
              </button>
            `,
              )
              .join("")}
            <input type="number" id="custom-amount" data-i18n="[placeholder]donate.custom_amount" placeholder="Свая сума" 
                   class="bg-black border border-white/10 px-4 py-3 text-white font-mono focus:outline-none focus:border-red-600 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
          </div>

          <button onclick="window.handlePayment('${item.id}')" 
                  class="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase italic py-4 tracking-widest transition-all flex items-center justify-center gap-3 group">
            <span data-i18n="donate.pay_now">Аплаціць зараз</span>
            <i class="fa-solid fa-credit-card group-hover:translate-x-1 transition-transform"></i>
          </button>
          
          <p data-i18n="donate.redirect_note" class="text-[9px] text-gray-500 uppercase mt-4 tracking-wider italic text-center">
            * вы будзеце перанакіраваны на старонку плацёжнага шлюза
          </p>
        </div>

        <div class="space-y-4 mb-12">
          <h3 data-i18n="donate.bank_details" class="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-6 italic">Банкаўскія рэквізіты</h3>
          ${
            item.accounts
              ? item.accounts
                  .map(
                    (acc) => `
            <details class="group bg-zinc-900/30 border border-white/5 open:border-red-600/30 transition-all">
              <summary class="flex items-center justify-between p-5 cursor-pointer list-none">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 flex items-center justify-center bg-red-600/10 text-red-600 border border-red-600/20 rounded-full font-black text-xs group-open:bg-red-600 group-open:text-white transition-all">
                    ${acc.currency}
                  </div>
                  <span class="font-bold uppercase tracking-widest text-sm text-gray-200 italic group-hover:text-white transition-colors">
                    ${acc.label}
                  </span>
                </div>
                <i class="fa-solid fa-chevron-down text-[10px] text-gray-600 group-open:rotate-180 transition-transform"></i>
              </summary>
              <div class="px-5 pb-6 pt-2 space-y-4 border-t border-white/5 bg-black/20 text-left">
                ${acc.details
                  .map(
                    (detail) => `
                  <div class="flex flex-col gap-1.5 text-left">
                    <span class="text-[9px] text-gray-600 uppercase font-black tracking-[0.2em] italic text-left">${detail.name}</span>
                    <div class="flex items-center justify-between bg-zinc-900 p-3 border border-white/5 group/copy relative text-left">
                      <code class="text-[11px] md:text-sm text-red-500 font-mono break-all pr-10 text-left">${detail.value}</code>
                      <button onclick="navigator.clipboard.writeText('${detail.value.replace(/\s/g, "")}'); const i = this.querySelector('i'); i.classList.replace('fa-copy', 'fa-check'); this.classList.add('text-green-500'); setTimeout(() => { i.classList.replace('fa-check', 'fa-copy'); this.classList.remove('text-green-500'); }, 2000);" 
                              class="absolute right-3 text-gray-500 hover:text-white transition-all p-2">
                        <i class="fa-regular fa-copy"></i>
                      </button>
                    </div>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </details>
          `,
                  )
                  .join("")
              : ""
          }
        </div>

        <div class="p-6 bg-red-600/5 border border-red-600/10 italic">
          <h4 data-i18n="donate.purpose_title" class="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2 italic">Абавязкова да запаўнення:</h4>
          <p class="text-sm text-gray-300">
            <span data-i18n="donate.purpose_label">Прызначэнне плацяжу:</span> <span class="text-white font-bold select-all">${item.purpose}</span>
          </p>
        </div>
      </div>
    </div>
  `,
};
