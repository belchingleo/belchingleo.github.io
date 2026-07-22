const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");
const companion = document.querySelector("[data-companion]");
const hero = document.querySelector(".hero");
const heroNavigation = document.querySelector(".hero-nav");
const workSection = document.querySelector("#work");
const workTitle = document.querySelector("#work-title");
const cloudProject = document.querySelector(".project-cloud");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let companionFrame = 0;

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
  if (header && workTitle) {
    const showCompactNavigation = workTitle.getBoundingClientRect().top < window.innerHeight * 0.82;
    header.classList.toggle("has-compact-nav", showCompactNavigation);
    if (!showCompactNavigation && navigation?.classList.contains("is-open")) {
      menuButton?.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    }
  }
};

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (value) => {
  const progress = clamp01(value);
  return progress * progress * (3 - 2 * progress);
};
const documentTop = (node) => node.getBoundingClientRect().top + window.scrollY;
const textBounds = (node) => {
  const range = document.createRange();
  range.selectNodeContents(node);
  return range.getBoundingClientRect();
};
const cubicPoint = (start, controlA, controlB, end, progress) => {
  const inverse = 1 - progress;
  return (inverse ** 3 * start)
    + (3 * inverse ** 2 * progress * controlA)
    + (3 * inverse * progress ** 2 * controlB)
    + (progress ** 3 * end);
};

const setCompanionPose = ({ x, y, rotation }) => {
  companion.style.setProperty("--peanut-x", `${Math.round(x)}px`);
  companion.style.setProperty("--peanut-y", `${Math.round(y)}px`);
  companion.style.setProperty("--peanut-rotation", `${rotation.toFixed(2)}deg`);
  companion.classList.add("is-positioned");
};

const setCompanionState = (state) => {
  companion.dataset.state = state;
  companion.classList.toggle("is-landed", state === "landed");
};

const updateCompanion = () => {
  if (!companion) return;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const companionBounds = companion.getBoundingClientRect();
  const size = companionBounds.width || 80;
  const companionHeight = companionBounds.height || size;
  const scroll = window.scrollY;
  const isCompact = viewportWidth <= 760;

  if (reducedMotion.matches || !hero || !heroNavigation || !workSection || !workTitle) {
    const navigationRect = heroNavigation?.getBoundingClientRect();
    const fallback = hero && navigationRect ? {
      x: isCompact
        ? viewportWidth - size - 18
        : navigationRect.left + navigationRect.width * 0.72,
      y: documentTop(heroNavigation) + (isCompact ? navigationRect.height + 28 : navigationRect.height - companionHeight - 10),
      rotation: 0,
    } : {
      x: viewportWidth - size * 0.56,
      y: viewportHeight * 0.62,
      rotation: reducedMotion.matches ? 0 : Math.sin(scroll / 440) * 2,
    };
    setCompanionPose(fallback);
    setCompanionState("ready");
    return;
  }

  const workTop = documentTop(workSection);
  const startScroll = isCompact ? 36 : 18;
  const endScroll = Math.max(250, workTop - viewportHeight * (isCompact ? 0.68 : 0.7));
  const navigationRect = heroNavigation.getBoundingClientRect();
  const titleBounds = textBounds(workTitle);
  const start = {
    x: isCompact
      ? viewportWidth - size - 18
      : navigationRect.left + navigationRect.width * 0.72,
    y: documentTop(heroNavigation) + (isCompact ? navigationRect.height + 28 : navigationRect.height - companionHeight - 10),
    rotation: -1.8,
  };
  const end = {
    x: Math.min(
      viewportWidth - size - (isCompact ? 18 : 26),
      titleBounds.right + (isCompact ? 14 : 70),
    ),
    y: documentTop(workTitle) - endScroll,
    rotation: 1.4,
  };
  const path = {
    start,
    controlA: { x: start.x - (isCompact ? 12 : 38), y: start.y + 58 },
    controlB: { x: end.x - (isCompact ? 8 : 24), y: end.y - 48 },
    end,
  };
  const progress = smoothstep((scroll - startScroll) / (endScroll - startScroll));
  let pose;

  if (scroll <= endScroll) {
    pose = {
      x: cubicPoint(path.start.x, path.controlA.x, path.controlB.x, path.end.x, progress),
      y: cubicPoint(path.start.y, path.controlA.y, path.controlB.y, path.end.y, progress),
      rotation: path.start.rotation + (path.end.rotation - path.start.rotation) * progress,
    };
    setCompanionState(scroll <= startScroll ? "ready" : "moving");
  } else {
    pose = {
      ...path.end,
      y: documentTop(workTitle),
    };
    setCompanionState("landed");
  }

  setCompanionPose(pose);
};

const requestCompanionUpdate = () => {
  if (companionFrame) return;
  companionFrame = window.requestAnimationFrame(() => {
    companionFrame = 0;
    updateCompanion();
  });
};

const closeMenu = () => {
  menuButton?.setAttribute("aria-expanded", "false");
  navigation?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

const activateCloudMotion = () => {
  if (!cloudProject) return;

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    cloudProject.classList.add("is-in-view");
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    cloudProject.classList.add("is-in-view");
    observer.disconnect();
  }, {
    threshold: 0.24,
    rootMargin: "0px 0px -8% 0px",
  });

  observer.observe(cloudProject);
};

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  navigation?.classList.toggle("is-open", !open);
  document.body.classList.toggle("menu-open", !open);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", () => {
  updateHeader();
  requestCompanionUpdate();
}, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
  updateHeader();
  requestCompanionUpdate();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

updateHeader();
updateCompanion();
activateCloudMotion();
