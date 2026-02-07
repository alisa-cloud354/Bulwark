import "./css/main.css";
import { initHeader } from "./js/header.js";
import { initLanguageSwitcher } from "./js/i18n.js";
// 1. Імпартуем ініцыялізацыю слайдэраў
import { initNewsSlider } from "./js/news.js";
import { initReportsSlider } from "./js/reports.js";
import { initNavigation } from "./js/navigation.js";

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initLanguageSwitcher();
  initNewsSlider();
  initReportsSlider();
  initNavigation();
});
