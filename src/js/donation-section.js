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
    // Калі клікнулі на спасылку аплаты — не перахопліваем
    if (e.target.closest("a[href*='wayforpay']")) return;

    const card = e.target.closest("[data-donation-type]");
    if (!card) return;

    const type = card.dataset.donationType;
    const item = window.donationData ? window.donationData[type] : null;
    if (!item) return;

    openUniversalModal(item, "donation");
  });

  window.addEventListener("languageChanged", async () => {
    await loadDonationData();
  });
}
