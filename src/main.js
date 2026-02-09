import "./css/main.css";
import { initHeader } from "./js/header.js";
import { initLanguageSwitcher } from "./js/i18n.js";

import { initNewsSlider } from "./js/news.js";
import { initReportsSlider } from "./js/reports.js";
import { initNavigation } from "./js/navigation.js";
import { initContacts } from "./js/contacts.js";
import { initZarokVajara } from "./js/zarok-vajara.js";

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initLanguageSwitcher();
  initNewsSlider();
  initReportsSlider();
  initNavigation();
  initContacts();
  initZarokVajara();
});
