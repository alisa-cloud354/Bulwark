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
          // Мяняем іконку на галачку
          icon.className = "fa-solid fa-check text-green-500";
          button.classList.add("scale-110");

          setTimeout(() => {
            icon.className = originalClass;
            button.classList.remove("scale-110");
          }, 2000);
        })
        .catch((err) => {
          console.error("Не ўдалося скапіяваць:", err);
        });
    });
  });

  // 2. Анімацыя з'яўлення блокаў (Scroll Reveal)
  // Дадаем клас reveal-item для ўсіх блокаў, якія павінны з'яўляцца
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px", // спрацоўвае крыху загадзя
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("opacity-100", "translate-y-0");
        entry.target.classList.remove("opacity-0", "translate-y-10");
      }
    });
  }, observerOptions);

  // Шукаем усе кантэйнеры ў мэйн, каб аніміраваць іх
  const itemsToAnimate = document.querySelectorAll(
    ".lg\\:col-span-4, .lg\\:col-span-8, .bg-white\\/5",
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
