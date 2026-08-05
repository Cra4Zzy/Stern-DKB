const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const openingHours = {
  0: [15 * 60, 23 * 60],
  1: null,
  2: [17 * 60, 23 * 60],
  3: [17 * 60, 23 * 60],
  4: [17 * 60, 25 * 60],
  5: [17 * 60, 26 * 60 + 30],
  6: [15 * 60, 26 * 60 + 30]
};

const now = new Date();
let day = now.getDay();
let minutes = now.getHours() * 60 + now.getMinutes();
if (minutes < 3 * 60) {
  day = (day + 6) % 7;
  minutes += 24 * 60;
}
const today = openingHours[day];
const isOpen = Boolean(today && minutes >= today[0] && minutes < today[1]);
document.querySelectorAll("[data-open-label]").forEach((label) => {
  label.textContent = isOpen ? "Heute geöffnet" : "Aktuell geschlossen";
});
document.querySelectorAll(".open-status .status-dot").forEach((dot) => {
  dot.classList.toggle("is-open", isOpen);
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});
