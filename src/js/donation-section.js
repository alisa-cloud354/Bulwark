import { openUniversalModal } from "./modal.js";
import { t } from "./i18n.js"; // Выкарыстоўваем нашу функцыю замест i18next

/**
 * Ініцыялізацыя секцыі данатаў
 */
export async function initDonationSection() {
  const donationSection = document.querySelector("#donate");
  if (!donationSection) return;

  // Сховішча для дадзеных, каб яны былі даступныя ў апрацоўшчыку клікаў
  let donationData = {};

  // Функцыя для загрузкі дадзеных
  async function loadDonationData() {
    try {
      const lang = localStorage.getItem("preferred-lang") || "be";

      // Вызначаем шлях: беларуская ў /data/, астатнія ў /locales/
      const fetchPath =
        lang === "be"
          ? "/data/donations.json"
          : `/locales/donations-${lang}.json`;

      const response = await fetch(fetchPath);

      if (!response.ok) {
        console.warn(`Файл ${fetchPath} не знойдзены, загружаем базавы.`);
        const baseRes = await fetch("/data/donations.json");
        donationData = await baseRes.json();
      } else {
        donationData = await response.json();
      }

      console.log(`Donation data loaded for: ${lang}`);
    } catch (error) {
      console.error("Не атрымалася загрузіць дадзеныя данатаў:", error);
    }
  }

  // 1. Загружаем дадзеныя пры старце
  await loadDonationData();

  // 2. Вешаем апрацоўшчык клікаў
  donationSection.addEventListener("click", (e) => {
    const card = e.target.closest("[data-donation-type]");

    if (card) {
      const type = card.dataset.donationType;
      const item = donationData[type];

      if (item) {
        // Адкрываем мадалку. Шаблон у modalTemplates падхопіць тэксты праз t()
        openUniversalModal(item, "donation");
      }
    }
  });

  // 3. Слухаем змену мовы, каб перазагрузіць JSON (на выпадак, калі мадалка адкрыецца зноў)
  window.addEventListener("languageChanged", async () => {
    await loadDonationData();
  });

  console.log("Donation section initialized");
}

/**
 * Глабальная функцыя аплаты
 */
window.handlePayment = (donationType) => {
  const amountInput = document.getElementById("custom-amount");
  const amount = amountInput ? amountInput.value : null;

  if (!amount || amount <= 0) {
    // Выкарыстоўваем нашу t() для алертаў
    alert(t("donate.alert_enter_amount"));
    if (amountInput) amountInput.focus();
    return;
  }

  console.log(`Рыхтуем аплату: ${amount} UAH для ${donationType}`);

  // Імітацыя пераходу з перакладзенымі паведамленнямі
  alert(
    `${t("donate.alert_redirect")} ${amount} UAH. ${t("donate.alert_no_gateway")}`,
  );
};
