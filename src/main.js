import "./css/main.css";
import { initHeader } from "./js/header.js";
import { initLanguageSwitcher } from "./js/i18n.js";

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initLanguageSwitcher();
});
