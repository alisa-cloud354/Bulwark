import "./css/main.css";
import { initHeader } from "./js/header.js";
import { initLanguageSwitcher } from "./js/i18n.js";

import { initNewsSlider } from "./js/news.js";
import { initFullReportsGrid } from "./js/reports.js";
import { initNavigation } from "./js/navigation.js";
import { initContacts } from "./js/contacts.js";
import { initZarokVajara } from "./js/zarok-vajara.js";
import { initFullNewsGrid } from "./js/news-full.js";
import { initGallerySlider } from "./js/gallery.js";
import { initMaterials } from "./js/materials.js";
import { initProjects } from "./js/projects.js";
import { initModalControl } from "./js/modal.js";
import { initDonationSection } from "./js/donation-section.js";
import { initForms } from "./js/forms.js";
import { initCookies } from "./js/cookies.js";

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initLanguageSwitcher();
  initNewsSlider();
  initFullReportsGrid();
  initNavigation();
  initContacts();
  initZarokVajara();
  initFullNewsGrid();
  initGallerySlider();
  initMaterials();
  initProjects();
  initModalControl();
  initDonationSection();
  initForms();
  initCookies();
});
