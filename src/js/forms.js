import { t } from "./i18n.js";

const API_URL = import.meta.env.VITE_API_URL || "";

/**
 * Валідацыя кантакту:
 * - Калі ёсць '@' (Пошта, ТГ, Signal) — мінімум 3 сімвалы.
 * - Калі няма '@', патрабуем пачатак з '+' і лічбы (Тэлефон, Signal).
 */
function isValidContact(value) {
  const val = value.trim();

  // 1. Калі ёсць '@' — дазваляем нікі з кропкамі, лічбамі і цірэ (Signal, TG, Email)
  if (val.includes("@")) {
    // Для ніка дастаткова 3 сімвалаў (напрыклад, @a.1)
    return val.length >= 3;
  }

  // 2. Калі '@' няма, патрабуем пачатак з '+' для тэлефона
  if (val.startsWith("+")) {
    const cleanPhone = val.replace(/[^\d+]/g, "");
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
  }

  return false;
}

export function initForms() {
  setupForm("help-form", "Дапамога добраахвотнікам");
  setupForm("partners-form", "Стаць партнёрам");

  // --- Форма Дапамогі (4 крокі) ---
  const helpForm = document.getElementById("help-form");
  if (helpForm) {
    const inputName = helpForm.querySelector('[name="user_name"]');
    const inputStatus = helpForm.querySelector('[name="user_status"]');
    const inputNeeds = helpForm.querySelector('[name="user_needs"]');
    const inputContact = helpForm.querySelector('[name="user_contact"]');
    const submitBtn = helpForm.querySelector('button[type="submit"]');

    if (inputContact) inputContact.placeholder = "@username | +380XXXXXXXXX";

    helpForm.addEventListener("input", () => {
      // 1. Праверка Імя (мін 2 сімвалы)
      const isNameOk = inputName?.value.trim().length >= 2;
      const step2 = document.getElementById("help-step-2");
      step2?.classList.toggle("opacity-40", !isNameOk);
      step2?.classList.toggle("pointer-events-none", !isNameOk);

      // 2. Праверка Статусу
      const isStatusOk = isNameOk && inputStatus?.value !== "";
      const step3 = document.getElementById("help-step-3");
      step3?.classList.toggle("opacity-40", !isStatusOk);
      step3?.classList.toggle("pointer-events-none", !isStatusOk);

      // 3. Праверка Патрэбаў (мін 10 сімвалаў)
      const isNeedsOk = isStatusOk && inputNeeds?.value.trim().length >= 10;
      const step4 = document.getElementById("help-step-4");
      step4?.classList.toggle("opacity-40", !isNeedsOk);
      step4?.classList.toggle("pointer-events-none", !isNeedsOk);

      // 4. Праверка Кантакту для актывацыі кнопкі
      const isContactOk =
        isNeedsOk && inputContact && isValidContact(inputContact.value);
      submitBtn?.classList.toggle("opacity-40", !isContactOk);
      submitBtn?.classList.toggle("pointer-events-none", !isContactOk);
    });
  }

  // --- Форма Партнёраў (3 крокі) ---
  const partnersForm = document.getElementById("partners-form");
  if (partnersForm) {
    const inputOrg = partnersForm.querySelector('[name="org_name"]');
    const inputContact = partnersForm.querySelector('[name="contact"]');
    const inputMsg = partnersForm.querySelector('[name="message"]');
    const submitBtn = partnersForm.querySelector('button[type="submit"]');

    if (inputContact) inputContact.placeholder = "@username | +XXXXXXXXXXXX";

    partnersForm.addEventListener("input", () => {
      // 1. Праверка Арганізацыі (мін 2 сімвалы)
      const isOrgOk = inputOrg?.value.trim().length >= 2;
      const step2 = document.getElementById("partner-step-2");
      step2?.classList.toggle("opacity-40", !isOrgOk);
      step2?.classList.toggle("pointer-events-none", !isOrgOk);

      // 2. Праверка Кантакту (з @ ці +лічбы)
      const isContactOk =
        isOrgOk && inputContact && isValidContact(inputContact.value);
      const step3 = document.getElementById("partner-step-3");
      step3?.classList.toggle("opacity-40", !isContactOk);
      step3?.classList.toggle("pointer-events-none", !isContactOk);

      // 3. Праверка Паведамлення (мін 10 сімвалаў) для кнопкі
      const isMsgOk = isContactOk && inputMsg?.value.trim().length >= 10;
      submitBtn?.classList.toggle("opacity-40", !isMsgOk);
      submitBtn?.classList.toggle("pointer-events-none", !isMsgOk);
    });
  }
}

function setupForm(formId, formDisplayName) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const loader = form.querySelector(".loader-icon");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-not-allowed");
    if (loader) loader.classList.remove("hidden");

    const success = await sendToBackend(formDisplayName, data);

    if (success) {
      const msg = t("forms.success_toast");
      showToast(msg === "forms.success_toast" ? "✅ Адпраўлена!" : msg);
      form.reset();
      // Поўны скід крокаў пасля адпраўкі
      form.querySelectorAll('[id*="-step-"]').forEach((s) => {
        if (!s.id.includes("step-1")) {
          s.classList.add("opacity-40", "pointer-events-none");
        }
      });
    } else {
      const errMsg = t("forms.error_toast");
      showToast(
        errMsg === "forms.error_toast" ? "❌ Памылка." : errMsg,
        "error",
      );
    }

    btn.disabled = false;
    btn.classList.remove("opacity-50", "cursor-not-allowed");
    if (loader) loader.classList.add("hidden");
  });
}

async function sendToBackend(formName, formData) {
  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formName, formData }),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

function showToast(message, type = "success") {
  let container =
    document.getElementById("toast-container") || createToastContainer();
  const toast = document.createElement("div");
  toast.innerText = message;
  const color = type === "success" ? "#059669" : "#dc2626";

  Object.assign(toast.style, {
    background: "#1a1a1a",
    color: "white",
    padding: "12px 20px",
    borderLeft: `5px solid ${color}`,
    borderRadius: "4px",
    marginBottom: "10px",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "all 0.4s ease",
    opacity: "0",
    transform: "translateX(20px)",
  });

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  }, 10);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

function createToastContainer() {
  const c = document.createElement("div");
  c.id = "toast-container";
  Object.assign(c.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: "1000",
    display: "flex",
    flexDirection: "column",
  });
  document.body.appendChild(c);
  return c;
}
