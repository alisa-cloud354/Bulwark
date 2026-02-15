import { openUniversalModal } from "./modal.js";
import { t } from "./i18n.js";

/**
 * Ініцыялізацыя секцыі данатаў
 */
export async function initDonationSection() {
  const donationSection = document.querySelector("#donate");
  if (!donationSection) return;

  // Функцыя загрузкі цяпер запісвае дадзеныя ў window.donationData
  async function loadDonationData() {
    try {
      const lang = localStorage.getItem("preferred-lang") || "be";
      const fetchPath = `/locales/donations-${lang}.json`;

      const response = await fetch(fetchPath);
      let data;

      if (!response.ok) {
        const baseRes = await fetch("/locales/donations-be.json");
        if (!baseRes.ok) throw new Error("Base donation file not found");
        data = await baseRes.json();
      } else {
        data = await response.json();
      }

      // ЗАХОЎВАЕМ ГЛАБАЛЬНА, каб modal.js мог дастаць блок ui
      window.donationData = data;
    } catch (error) {
      console.error("Donation Data Error:", error);
    }
  }

  // 1. Загружаем дадзеныя пры старце
  await loadDonationData();

  // 2. Апрацоўшчык клікаў
  donationSection.addEventListener("click", (e) => {
    const card = e.target.closest("[data-donation-type]");

    if (card) {
      const type = card.dataset.donationType;
      // Бярэм актуальныя дадзеныя з глабальнай пераменнай
      const item = window.donationData ? window.donationData[type] : null;

      if (item) {
        // Выклікаем мадалку. modal.js сам возьме window.donationData.ui
        openUniversalModal(item, "donation");
      }
    }
  });

  // 3. Слухаем змену мовы
  window.addEventListener("languageChanged", async () => {
    await loadDonationData();
  });
}

/**
 * Глабальная функцыя аплаты
 */
window.handlePayment = (donationType) => {
  const amountInput = document.getElementById("custom-amount");
  const amount = amountInput ? amountInput.value : null;

  if (!amount || amount <= 0) {
    alert(t("donate.alert_enter_amount"));
    if (amountInput) amountInput.focus();
    return;
  }

  alert(
    `${t("donate.alert_redirect")} ${amount} UAH. ${t("donate.alert_no_gateway")}`,
  );
};
