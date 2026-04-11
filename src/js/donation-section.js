import { openUniversalModal } from "./modal.js";

export async function initDonationSection() {
  const donationSection = document.querySelector("#donate");
  if (!donationSection) return;

  async function loadDonationData() {
    try {
      const lang = localStorage.getItem("preferred-lang") || "be";
      const fetchPath = `/locales/donations-${lang}.json`;

      const response = await fetch(fetchPath);
      const data = response.ok
        ? await response.json()
        : await (async () => {
            const baseRes = await fetch("/locales/donations-be.json");
            if (!baseRes.ok) throw new Error("Base donation file not found");
            return baseRes.json();
          })();

      window.donationData = data;
    } catch (error) {
      console.error("Donation Data Error:", error);
    }
  }

  await loadDonationData();

  donationSection.addEventListener("click", (e) => {
    const card = e.target.closest("[data-donation-type]");
    if (!card) return;

    const type = card.dataset.donationType;
    const action = e.target.closest("[data-action]")?.dataset.action;
    const item = window.donationData ? window.donationData[type] : null;
    if (!item) return;

    if (action === "pay") {
      const paymentUi = window.donationData?.payment_ui;
      if (!paymentUi) return;
      openUniversalModal(item, "payment");
    } else {
      openUniversalModal(item, "donation");
    }
  });

  window.addEventListener("languageChanged", async () => {
    await loadDonationData();
  });
}

// ── Глабальная функцыя аплаты праз WayForPay ──────────────────
window.handlePayment = async () => {
  const amountInput = document.getElementById("payment-amount");
  const typeSelect = document.getElementById("payment-type");
  const submitBtn = document.querySelector(
    "#wayforpay-form button[type='submit']",
  );
  const loader = submitBtn?.querySelector(".loader-icon");

  const amount = amountInput?.value;
  const donationType = typeSelect?.value || "foundation";

  // Валідацыя сумы
  if (!amount || parseFloat(amount) <= 0) {
    amountInput?.focus();
    amountInput?.classList.add("border-red-600");
    setTimeout(() => amountInput?.classList.remove("border-red-600"), 2000);
    return;
  }

  // Вызначаем назву плацяжу паводле тыпу
  const donationData = window.donationData;
  const purpose = donationData?.[donationType]?.purpose || "Благодійний внесок";

  // Паказваем лоадэр
  if (loader) loader.style.display = "inline-block";
  if (submitBtn) submitBtn.disabled = true;

  try {
    // 1. Запытваем подпіс з нашага API
    const res = await fetch("/api/wayforpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency: "UAH", purpose, donationType }),
    });

    const data = await res.json();

    if (!data.success || !data.params) {
      throw new Error("API не вярнуў параметры");
    }

    // 2. Ствараем форму і адпраўляем на WayForPay
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://secure.wayforpay.com/pay";

    const fields = {
      ...data.params,
      "productName[]": data.params.productName,
      "productCount[]": data.params.productCount,
      "productPrice[]": data.params.productPrice,
    };

    // Выдаляем не-масіўныя версіі
    delete fields.productName;
    delete fields.productCount;
    delete fields.productPrice;

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  } catch (error) {
    console.error("WayForPay error:", error);
    if (loader) loader.style.display = "none";
    if (submitBtn) submitBtn.disabled = false;
  }
};
