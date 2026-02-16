import { t } from "./i18n.js";

// Выдаляем токен і ID адсюль. Выкарыстоўваем адрас вашага бекенда.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function initForms() {
  // 1. Форма Дапамогі
  setupForm("help-form", "Дапамога добраахвотнікам");

  // 2. Форма Партнёраў
  setupForm("partners-form", "Стаць партнёрам");

  // 3. Жывая валідацыя Дапамогі
  const helpForm = document.getElementById("help-form");
  if (helpForm) {
    const inputs = {
      name: helpForm.querySelector('[name="user_name"]'),
      status: helpForm.querySelector('[name="user_status"]'),
      needs: helpForm.querySelector('[name="user_needs"]'),
    };
    const steps = {
      2: document.getElementById("help-step-2"),
      3: document.getElementById("help-step-3"),
      4: document.getElementById("help-step-4"),
    };

    helpForm.addEventListener("input", () => {
      if (inputs.name.value.trim().length >= 2)
        steps[2]?.classList.remove("opacity-40", "pointer-events-none");
      else steps[2]?.classList.add("opacity-40", "pointer-events-none");

      if (inputs.status.value !== "")
        steps[3]?.classList.remove("opacity-40", "pointer-events-none");
      if (inputs.needs.value.trim().length >= 10)
        steps[4]?.classList.remove("opacity-40", "pointer-events-none");
    });
  }

  // 4. Жывая валідацыя Партнёраў
  const partnersForm = document.getElementById("partners-form");
  if (partnersForm) {
    const inputs = {
      org: partnersForm.querySelector('[name="org_name"]'),
      contact: partnersForm.querySelector('[name="contact"]'),
    };
    const steps = {
      2: document.getElementById("partner-step-2"),
      3: document.getElementById("partner-step-3"),
    };

    partnersForm.addEventListener("input", () => {
      if (inputs.org.value.trim().length >= 2)
        steps[2]?.classList.remove("opacity-40", "pointer-events-none");
      else steps[2]?.classList.add("opacity-40", "pointer-events-none");

      if (inputs.contact.validity.valid && inputs.contact.value.length > 3) {
        steps[3]?.classList.remove("opacity-40", "pointer-events-none");
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
    if (loader) {
      loader.classList.remove("hidden");
      loader.style.display = "inline-block";
    }

    // Адпраўляем на ваш бекенд
    const success = await sendToBackend(formDisplayName, data);

    if (success) {
      showToast(t("forms.success_toast"), "success");
      form.reset();
      [
        "help-step-2",
        "help-step-3",
        "help-step-4",
        "partner-step-2",
        "partner-step-3",
      ].forEach((id) => {
        document
          .getElementById(id)
          ?.classList.add("opacity-40", "pointer-events-none");
      });
      form
        .querySelectorAll("input, textarea, select")
        .forEach((el) => el.blur());
    } else {
      showToast(t("forms.error_toast"), "error");
    }

    btn.disabled = false;
    btn.classList.remove("opacity-50", "cursor-not-allowed");
    if (loader) {
      loader.classList.add("hidden");
      loader.style.display = "none";
    }
  });
}

async function sendToBackend(formName, formData) {
  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formName,
        formData,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Backend connection error:", error);
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
      gap: "10px",
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
