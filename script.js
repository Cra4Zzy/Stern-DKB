const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const mobileMenuQuery = window.matchMedia("(max-width: 980px)");

const setMenuState = (isOpen, returnFocus = false) => {
  if (!menuButton || !navigation) return;

  navigation.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Navigation schließen" : "Navigation öffnen");
  document.documentElement.classList.toggle("menu-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);

  if (mobileMenuQuery.matches) {
    navigation.inert = !isOpen;
  } else {
    navigation.inert = false;
  }

  if (isOpen) {
    window.requestAnimationFrame(() => navigation.querySelector("a")?.focus());
  } else if (returnFocus) {
    menuButton.focus();
  }
};

menuButton?.setAttribute("aria-controls", "main-navigation");
if (navigation) navigation.id = "main-navigation";

menuButton?.addEventListener("click", () => {
  setMenuState(!navigation?.classList.contains("is-open"));
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation?.classList.contains("is-open")) {
    setMenuState(false, true);
  }
});

const resetMenuForViewport = () => setMenuState(false);
if (typeof mobileMenuQuery.addEventListener === "function") {
  mobileMenuQuery.addEventListener("change", resetMenuForViewport);
} else {
  mobileMenuQuery.addListener(resetMenuForViewport);
}

window.addEventListener("pageshow", () => setMenuState(false));
setMenuState(false);

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
