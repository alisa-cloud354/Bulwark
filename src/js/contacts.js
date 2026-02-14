export function initContacts() {
  // 1. Капіяванне рэквізітаў
  const copyButtons = document.querySelectorAll(".copy-btn");

  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const textToCopy = button.getAttribute("data-copy");
      if (!textToCopy) return;

      const icon = button.querySelector("i");
      const originalClass = icon.className;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          icon.className = "fa-solid fa-check text-green-500";
          button.classList.add("scale-110");

          setTimeout(() => {
            icon.className = originalClass;
            button.classList.remove("scale-110");
          }, 2000);
        })
        .catch((err) => console.error("Error copying:", err));
    });
  });

  // 2. Анімацыя з'яўлення (Intersection Observer)
  const observerOptions = {
    threshold: 0.05,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("opacity-100", "translate-y-0");
        entry.target.classList.remove("opacity-0", "translate-y-10");
      }
    });
  }, observerOptions);

  // Селектар для ўсіх картак у сайдбары і асноўным кантэнце
  const itemsToAnimate = document.querySelectorAll(
    ".contact-sidebar > div, .contact-main-content > div",
  );

  itemsToAnimate.forEach((item) => {
    item.classList.add(
      "transition-all",
      "duration-700",
      "opacity-0",
      "translate-y-10",
    );
    observer.observe(item);
  });
}
