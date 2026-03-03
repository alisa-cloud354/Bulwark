import "./css/main.css";
import { initHeader } from "./js/header.js";
import { initLanguageSwitcher } from "./js/i18n.js";
import { initNavigation } from "./js/navigation.js";
import { initModalControl } from "./js/modal.js";
import { initCookies } from "./js/cookies.js";
import { initNewsSlider } from "./js/news.js";
import { initFullNewsGrid } from "./js/news-full.js";
import { initFullReportsGrid } from "./js/reports.js";
import { initContacts } from "./js/contacts.js";
import { initZarokVajara } from "./js/zarok-vajara.js";
import { initGallerySlider } from "./js/gallery.js";
import { initMaterials } from "./js/materials.js";
import { initDonationSection } from "./js/donation-section.js";
import { initForms } from "./js/forms.js";
import { initPartners } from "./js/partners.js";

document.addEventListener("DOMContentLoaded", () => {
  // Заўсёды на ўсіх старонках
  initHeader();
  initLanguageSwitcher();
  initNavigation();
  initModalControl();
  initCookies();

  // Толькі калі элемент ёсць на старонцы
  if (document.querySelector(".news-slider")) initNewsSlider();
  if (document.querySelector("#news-grid-full")) initFullNewsGrid();
  if (document.querySelector("#reports-grid-full")) initFullReportsGrid();
  if (document.querySelector(".contact-sidebar")) initContacts();
  if (document.querySelector(".animate-scroll-vertical")) initZarokVajara();
  if (document.querySelector("#gallery-container")) initGallerySlider();
  if (document.querySelector("#materials-container")) initMaterials();
  if (document.querySelector("#donate")) initDonationSection();
  if (document.querySelector("#help-form, #partners-form")) initForms();
  if (document.querySelector("#partners-list")) initPartners();
});
