import { openUniversalModal } from "./modal.js";

export async function initDonatePage() {
  async function loadDonationData() {
    const lang = localStorage.getItem("preferred-lang") || "be";
    const res = await fetch(`/locales/donations-${lang}.json`);
    const data = res.ok
      ? await res.json()
      : await fetch("/locales/donations-be.json").then((r) => r.json());
    window.donationData = data;
    return data;
  }

  const data = await loadDonationData();

  document.getElementById("btn-open-payment")?.addEventListener("click", () => {
    openUniversalModal(data.foundation, "payment");
  });

  window.addEventListener("languageChanged", async () => {
    await loadDonationData();
  });

  // Вызначаем handlePayment на donate-старонцы
  window.handlePayment = async () => {
    const amountInput = document.getElementById("payment-amount");
    const typeSelect = document.getElementById("payment-type");
    const submitBtn = document.querySelector(
      "#wayforpay-form button[type='button']",
    );
    const loader = submitBtn?.querySelector(".loader-icon");

    const amount = amountInput?.value;
    const donationType = typeSelect?.value || "foundation";

    if (!amount || parseFloat(amount) <= 0) {
      amountInput?.focus();
      amountInput?.classList.add("border-red-600");
      setTimeout(() => amountInput?.classList.remove("border-red-600"), 2000);
      return;
    }

    const purpose =
      window.donationData?.[donationType]?.purpose || "Благодійний внесок";

    if (loader) loader.style.display = "inline-block";
    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch("/api/wayforpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "UAH",
          purpose,
          donationType,
        }),
      });

      const data = await res.json();

      if (!data.success || !data.params) {
        throw new Error("API не вярнуў параметры");
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://secure.wayforpay.com/pay";

      const fields = {
        ...data.params,
        "productName[]": data.params.productName,
        "productCount[]": data.params.productCount,
        "productPrice[]": data.params.productPrice,
      };

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
}
