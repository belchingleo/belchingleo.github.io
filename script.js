document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");
const depthHero = document.querySelector("[data-depth-hero]");
const depthLayers = depthHero
  ? [...depthHero.querySelectorAll("[data-depth-layer]")]
  : [];
const cloudProject = document.querySelector(".project-cloud");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
};

const activateDepthHero = () => {
  if (!depthHero || !depthLayers.length) return;

  const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (reducedMotion.matches || !precisePointer.matches || window.innerWidth < 960) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frame = 0;
  let visible = true;

  const render = () => {
    frame = 0;
    if (!visible) return;

    currentX += (targetX - currentX) * 0.09;
    currentY += (targetY - currentY) * 0.09;

    depthLayers.forEach((layer) => {
      const depth = Number(layer.dataset.depth) || 0;
      layer.style.setProperty("--layer-x", `${(currentX * depth).toFixed(2)}px`);
      layer.style.setProperty("--layer-y", `${(currentY * depth).toFixed(2)}px`);
    });

    const unsettled = Math.abs(targetX - currentX) > 0.08
      || Math.abs(targetY - currentY) > 0.08;

    if (unsettled) {
      depthHero.classList.add("is-depth-moving");
      frame = window.requestAnimationFrame(render);
    } else {
      depthHero.classList.remove("is-depth-moving");
    }
  };

  const requestRender = () => {
    if (!frame && visible) frame = window.requestAnimationFrame(render);
  };

  depthHero.addEventListener("pointermove", (event) => {
    const bounds = depthHero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    targetX = x * 34;
    targetY = y * 22;
    requestRender();
  }, { passive: true });

  depthHero.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
    requestRender();
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) requestRender();
    }, { threshold: 0.01 });
    observer.observe(depthHero);
  }
};

const activateReveals = () => {
  const targets = [...document.querySelectorAll("[data-reveal]")];
  if (!targets.length) return;

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    let batchIndex = 0;
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.setProperty("--reveal-delay", `${batchIndex * 60}ms`);
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
      batchIndex += 1;
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -6% 0px",
  });

  targets.forEach((target) => observer.observe(target));
};

const activateVideoPlayback = () => {
  const videos = [...document.querySelectorAll(".project-proof video")];
  if (!videos.length || reducedMotion.matches || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => {});
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.2 });

  videos.forEach((video) => observer.observe(video));
};

const closeMenu = () => {
  menuButton?.setAttribute("aria-expanded", "false");
  const menuLabel = menuButton?.querySelector(".sr-only");
  if (menuLabel) menuLabel.textContent = "打开导航";
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
  const menuLabel = menuButton.querySelector(".sr-only");
  if (menuLabel) menuLabel.textContent = open ? "打开导航" : "关闭导航";
  navigation?.classList.toggle("is-open", !open);
  document.body.classList.toggle("menu-open", !open);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", () => {
  updateHeader();
}, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
  updateHeader();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

if (reducedMotion.matches) {
  document.querySelectorAll("video[autoplay]").forEach((video) => {
    video.pause();
  });
}

updateHeader();
activateDepthHero();
activateCloudMotion();
activateReveals();
activateVideoPlayback();
