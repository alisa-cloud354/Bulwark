import crypto from "crypto";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const url = req.url || "";

  // ── WAYFORPAY: вылічэнне подпісу ──────────────────────────────
  if (url.includes("/api/wayforpay")) {
    const { WAYFORPAY_MERCHANT_LOGIN, WAYFORPAY_MERCHANT_SECRET } = process.env;

    try {
      const { amount, currency = "UAH", purpose, donationType } = req.body;

      if (!amount || !purpose) {
        return res
          .status(400)
          .json({ success: false, message: "amount і purpose абавязковыя" });
      }

      const merchantAccount = WAYFORPAY_MERCHANT_LOGIN;
      const merchantDomain = "bulwark-fund.org";
      const orderReference = `bulwark_${donationType}_${Date.now()}`;
      const orderDate = Math.floor(Date.now() / 1000).toString();
      const orderCurrency = currency;
      const orderAmount = parseFloat(amount).toFixed(2);
      const productName = purpose;
      const productCount = "1";
      const productPrice = orderAmount;

      // Радок для подпісу паводле дакументацыі WayForPay
      const signString = [
        merchantAccount,
        merchantDomain,
        orderReference,
        orderDate,
        orderAmount,
        orderCurrency,
        productName,
        productCount,
        productPrice,
      ].join(";");

      const signature = crypto
        .createHmac("md5", WAYFORPAY_MERCHANT_SECRET)
        .update(signString)
        .digest("hex");

      return res.status(200).json({
        success: true,
        params: {
          merchantAccount,
          merchantDomain,
          orderReference,
          orderDate,
          orderCurrency,
          orderAmount,
          productName,
          productCount,
          productPrice,
          merchantSignature: signature,
          returnUrl:
            "https://bulwark-fund.org/pages/donate.html?payment=success",
          returnUrlMethod: "GET",
          serviceUrl: "https://bulwark-fund.org/api/wayforpay-callback",
          language: "UA",
        },
      });
    } catch (error) {
      console.error("WayForPay sign error:", error);
      return res.status(500).json({ success: false });
    }
  }

  // ── WAYFORPAY CALLBACK: вынік аплаты ад WayForPay ─────────────
  if (url.includes("/api/wayforpay-callback")) {
    const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID, WAYFORPAY_MERCHANT_SECRET } =
      process.env;

    try {
      const data = req.body;

      // Верыфікацыя подпісу ад WayForPay
      const signString = [
        data.merchantAccount,
        data.orderReference,
        data.amount,
        data.currency,
        data.authCode,
        data.cardPan,
        data.transactionStatus,
        data.reasonCode,
      ].join(";");

      const expectedSignature = crypto
        .createHmac("md5", WAYFORPAY_MERCHANT_SECRET)
        .update(signString)
        .digest("hex");

      if (data.merchantSignature !== expectedSignature) {
        console.error("WayForPay: няправільны подпіс у callback");
        return res.status(400).json({ success: false });
      }

      // Адпраўляем у Telegram толькі паспяховыя аплаты
      if (data.transactionStatus === "Approved") {
        const messageText =
          `<b>💳 НОВАЯ АПЛАТА ПРАЗ WAYFORPAY</b>\n\n` +
          `<b>💰 Сума:</b> ${data.amount} ${data.currency}\n` +
          `<b>📋 Заказ:</b> ${data.orderReference}\n` +
          `<b>🏦 Карта:</b> ${data.cardPan}\n` +
          `<b>✅ Статус:</b> ${data.transactionStatus}`;

        await fetch(
          `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: messageText,
              parse_mode: "HTML",
            }),
          },
        );
      }

      // WayForPay патрабуе такі адказ
      return res.status(200).json({
        orderReference: data.orderReference,
        status: "accept",
        time: Math.floor(Date.now() / 1000),
        signature: crypto
          .createHmac("md5", WAYFORPAY_MERCHANT_SECRET)
          .update(
            `${data.orderReference};accept;${Math.floor(Date.now() / 1000)}`,
          )
          .digest("hex"),
      });
    } catch (error) {
      console.error("WayForPay callback error:", error);
      return res.status(500).json({ success: false });
    }
  }

  // ── ІСНУЮЧЫ КОД: Telegram формы ───────────────────────────────
  const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = process.env;

  const labels = {
    user_name: "👤 Імя",
    user_status: "🎖 Статус",
    user_contact: "📱 Кантакт",
    user_needs: "📝 Патрэба",
    org_name: "🏢 Арганізацыя",
    contact: "📱 Кантакт",
    message: "💬 Паведамленне",
  };

  try {
    const { formName, formData } = req.body;

    const title =
      formName === "Стаць партнёрам"
        ? "🤝 НОВАЯ ПРАПАНОВА ПАРТНЁРСТВА"
        : "🆘 ЗАПЫТ НА ДАПАМОГУ";

    const lines = Object.entries(formData).map(([key, value]) => {
      const label = labels[key] || key;
      return `<b>${label}:</b> ${value}`;
    });

    const messageText = `<b>${title}</b>\n\n` + lines.join("\n");

    const tgResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: messageText,
          parse_mode: "HTML",
        }),
      },
    );

    return res
      .status(tgResponse.ok ? 200 : 500)
      .json({ success: tgResponse.ok });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ success: false });
  }
}
