import { openUniversalModal } from "./modal.js";
import i18next from "i18next";

/**
 * Ініцыялізацыя секцыі данатаў
 * Слухае клікі па картках і адкрывае адпаведныя рэквізіты
 */
export async function initDonationSection() {
  const donationSection = document.querySelector("#donate");
  if (!donationSection) return;

  try {
    // 1. Загружаем дадзеныя (перакананася, што файл існуе па гэтым адрасе)
    const response = await fetch("/data/donations.json");
    if (!response.ok) throw new Error("Не атрымалася загрузіць donations.json");

    const donationData = await response.json();

    // 2. Вешаем апрацоўшчык клікаў
    donationSection.addEventListener("click", (e) => {
      // Шукаем картку, па якой клікнулі (або яе дзяцей)
      const card = e.target.closest("[data-donation-type]");

      if (card) {
        const type = card.dataset.donationType; // 'foundation' або 'soldiers'
        const item = donationData[type];

        if (item) {
          // Выклікаем універсальную мадалку з тыпам 'donation'
          // Другі аргумент 'donation' скажа modal.js выкарыстоўваць патрэбны шаблон
          openUniversalModal(item, "donation");
        }
      }
    });

    console.log("Donation section initialized");
  } catch (error) {
    console.error("Памылка ініцыялізацыі секцыі аплаты:", error);
  }
}

// Гэта функцыя будзе даступная глабальна для кнопкі ў шаблоне
window.handlePayment = (donationType) => {
  const amountInput = document.getElementById("custom-amount");
  const amount = amountInput.value;

  if (!amount || amount <= 0) {
    alert(i18next.t("donate.alert_enter_amount"));
    amountInput.focus();
    return;
  }

  console.log(`Рыхтуем аплату: ${amount} UAH для ${donationType}`);

  // Калі будзе ключ сервіса (напрыклад, WayForPay ці Fondy),
  // тут будзе фармавацца спасылка або адкрывацца іх віджэт.
  // Зараз проста імітуем пераход:

  const targetUrl = "https://your-payment-gateway.com/pay";
  // window.location.href = `${targetUrl}?amount=${amount}&type=${donationType}`;

  alert(
    `${i18next.t("donate.alert_redirect")} ${amount} UAH. ${i18next.t("donate.alert_no_gateway")}`,
  );
};
