import { NAV_SECTIONS } from "./nav-config.js";
import { filterNavByRole, getActiveIds } from "./nav-utils.js";

const COLLAPSED_KEY = "fintech-sidebar-collapsed";

const sidebar = document.querySelector(".sidebar");
const scrollContainer = document.querySelector(".sidebar-scroll");
const roleSelect = document.querySelector("#roleSelect");
const collapseButton = document.querySelector(".collapse-btn");
const mobileMenuButton = document.querySelector(".mobile-menu-btn");
const overlay = document.querySelector(".sidebar-overlay");

let previousFocus = null;
let role = roleSelect.value;

const ensureHash = () => {
  if (!window.location.hash) {
    window.location.hash = "#/overview";
  }
};

const updateScrollShadows = () => {
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
  scrollContainer.classList.toggle("has-top-shadow", scrollTop > 0);
  scrollContainer.classList.toggle("has-bottom-shadow", scrollTop + clientHeight < scrollHeight);
};

const createNavList = (items, activeIds, depth = 0) => {
  const list = document.createElement("ul");
  if (depth > 0) {
    list.className = "nested-list";
  }

  for (const item of items) {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = item.path;
    link.className = "nav-link";
    link.dataset.id = item.id;
    link.setAttribute("title", item.label);
    if (activeIds.has(item.id)) {
      link.setAttribute("aria-current", "page");
    }

    link.innerHTML = `<span class="icon" aria-hidden="true">${item.icon}</span><span class="label">${item.label}</span>`;
    if (typeof item.badge === "number") {
      const badge = document.createElement("span");
      badge.className = "nav-badge";
      badge.textContent = String(item.badge);
      badge.setAttribute("aria-label", `${item.badge} items`);
      link.appendChild(badge);
    }

    li.appendChild(link);

    if (item.children && item.children.length > 0) {
      li.appendChild(createNavList(item.children, activeIds, depth + 1));
    }

    list.appendChild(li);
  }

  return list;
};

const renderNavigation = () => {
  const filteredSections = filterNavByRole(NAV_SECTIONS, role);
  const activeIds = getActiveIds(
    filteredSections.flatMap((section) => section.items),
    window.location.hash || "#/overview"
  );

  scrollContainer.textContent = "";
  for (const section of filteredSections) {
    const heading = document.createElement("h2");
    heading.className = "nav-section-title";
    heading.textContent = section.label;
    scrollContainer.appendChild(heading);
    scrollContainer.appendChild(createNavList(section.items, activeIds));
  }
  updateScrollShadows();
};

const closeMobileNav = () => {
  sidebar.classList.remove("is-open");
  overlay.hidden = true;
  if (previousFocus) {
    previousFocus.focus();
  }
};

const openMobileNav = () => {
  previousFocus = document.activeElement;
  sidebar.classList.add("is-open");
  overlay.hidden = false;
  const firstLink = sidebar.querySelector(".nav-link");
  if (firstLink) {
    firstLink.focus();
  }
};

mobileMenuButton.addEventListener("click", openMobileNav);
overlay.addEventListener("click", closeMobileNav);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
    closeMobileNav();
  }
});

document.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement && event.target.classList.contains("nav-link")) {
    if (window.matchMedia("(max-width: 1024px)").matches) {
      closeMobileNav();
    }
  }
});

roleSelect.addEventListener("change", () => {
  role = roleSelect.value;
  renderNavigation();
});

collapseButton.addEventListener("click", () => {
  sidebar.classList.toggle("is-collapsed");
  const collapsed = sidebar.classList.contains("is-collapsed");
  localStorage.setItem(COLLAPSED_KEY, String(collapsed));
  collapseButton.textContent = collapsed ? "⇥" : "⇤";
  collapseButton.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
});

scrollContainer.addEventListener("scroll", updateScrollShadows);
window.addEventListener("hashchange", renderNavigation);

if (localStorage.getItem(COLLAPSED_KEY) === "true") {
  sidebar.classList.add("is-collapsed");
  collapseButton.textContent = "⇥";
  collapseButton.setAttribute("aria-label", "Expand sidebar");
}

ensureHash();
renderNavigation();
