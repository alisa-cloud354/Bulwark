import { t } from "./i18n.js";

const API_URL = import.meta.env.VITE_API_URL || "";

// Функцыя для праверкі кантакту (тэлефон АБО прысутнасць @)
function isValidContact(value) {
  const val = value.trim();
  // 1. Праверка на тэлефон: толькі лічбы, можа пачынацца з + (мін. 7 лічбаў)
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  // 2. Праверка на нік/пошту: павінна быць сабачка @
  const hasAtSymbol = val.includes("@") && val.length >= 3;

  return phoneRegex.test(val) || hasAtSymbol;
}

export function initForms() {
  setupForm("help-form", "Дапамога добраахвотнікам");
  setupForm("partners-form", "Стаць партнёрам");

  // --- Валідацыя формы Дапамогі ---
  const helpForm = document.getElementById("help-form");
  if (helpForm) {
    const inputName = helpForm.querySelector('[name="user_name"]');
    const inputStatus = helpForm.querySelector('[name="user_status"]');
    const inputNeeds = helpForm.querySelector('[name="user_needs"]');
    const inputContact = helpForm.querySelector('[name="user_contact"]');
    const submitBtn = helpForm.querySelector('button[type="submit"]');

    const steps = {
      2: document.getElementById("help-step-2"),
      3: document.getElementById("help-step-3"),
      4: document.getElementById("help-step-4"),
    };

    helpForm.addEventListener("input", () => {
      // Крок 2: Імя
      const isNameOk = inputName && inputName.value.trim().length >= 2;
      isNameOk
        ? steps[2]?.classList.remove("opacity-40", "pointer-events-none")
        : steps[2]?.classList.add("opacity-40", "pointer-events-none");

      // Крок 3: Статус
      const isStatusOk = inputStatus && inputStatus.value !== "";
      if (isStatusOk)
        steps[3]?.classList.remove("opacity-40", "pointer-events-none");

      // Крок 4: Патрэбы
      const isNeedsOk = inputNeeds && inputNeeds.value.trim().length >= 10;
      isNeedsOk
        ? steps[4]?.classList.remove("opacity-40", "pointer-events-none")
        : steps[4]?.classList.add("opacity-40", "pointer-events-none");

      // Кнопка адпраўкі: разблакуецца толькі калі кантакт валідны
      if (isNeedsOk && inputContact && isValidContact(inputContact.value)) {
        submitBtn?.classList.remove("opacity-40", "pointer-events-none");
      } else {
        submitBtn?.classList.add("opacity-40", "pointer-events-none");
      }
    });
  }

  // --- Валідацыя формы Партнёраў ---
  const partnersForm = document.getElementById("partners-form");
  if (partnersForm) {
    const inputOrg = partnersForm.querySelector('[name="org_name"]');
    const inputContact = partnersForm.querySelector('[name="contact"]');
    const step2 = document.getElementById("partner-step-2");
    const submitBtn = partnersForm.querySelector('button[type="submit"]');

    partnersForm.addEventListener("input", () => {
      const isOrgOk = inputOrg && inputOrg.value.trim().length >= 2;
      isOrgOk
        ? step2?.classList.remove("opacity-40", "pointer-events-none")
        : step2?.classList.add("opacity-40", "pointer-events-none");

      if (isOrgOk && inputContact && isValidContact(inputContact.value)) {
        submitBtn?.classList.remove("opacity-40", "pointer-events-none");
      } else {
        submitBtn?.classList.add("opacity-40", "pointer-events-none");
      }
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

      // Скідваем крокі (акрамя першага)
      form.querySelectorAll('[id*="-step-"]').forEach((s) => {
        if (!s.id.includes("step-1"))
          s.classList.add("opacity-40", "pointer-events-none");
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
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    Object.assign(container.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: "1000",
      display: "flex",
      flexDirection: "column",
    });
    document.body.appendChild(container);
  }

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
