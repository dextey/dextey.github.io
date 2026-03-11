// --- Grid canvas ---
const canvas = document.getElementById("grid-canvas");

const ctx = canvas.getContext("2d");
const W = (canvas.width = window.innerWidth);
const H = (canvas.height = window.innerHeight);
const SPACING = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue("--grid"),
);
// dark → soft: animated after grid completes
const color = { r: 67, g: 84, b: 96 }; // rgb(139, 145, 148)

const vLines = [];
const hLines = [];
for (let x = SPACING; x < W; x += SPACING) vLines.push({ x, p: 0 });
for (let y = SPACING; y < H; y += SPACING) hLines.push({ y, p: 0 });

// Interleave: v1, h1, v2, h2 ...
const allLines = [];
const maxLen = Math.max(vLines.length, hLines.length);
for (let i = 0; i < maxLen; i++) {
  if (i < vLines.length) allLines.push(vLines[i]);
  if (i < hLines.length) allLines.push(hLines[i]);
}

function drawGrid() {
  ctx.clearRect(0, 0, W, H);
  ctx.lineWidth = 1;

  const r = color.r | 0,
    g = color.g | 0,
    b = color.b | 0;

  const fadeStart = 0;

  for (let i = 0; i < vLines.length; i++) {
    const l = vLines[i];
    const y1 = H * l.p;
    if (y1 === 0) continue;
    const t = Math.max(0, i - fadeStart) / (vLines.length - 12 - fadeStart);
    const alpha = Math.max(0, 1 - t);
    const grad = ctx.createLinearGradient(l.x, 0, l.x, y1);
    grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.moveTo(l.x, 0);
    ctx.lineTo(l.x, y1);
    ctx.stroke();
  }

  for (let i = 0; i < hLines.length; i++) {
    const l = hLines[i];
    const x1 = W * l.p;
    if (x1 === 0) continue;
    const t = Math.max(0, i - fadeStart) / (hLines.length - fadeStart - 5);
    const alpha = Math.max(0, 1 - t);

    const grad = ctx.createLinearGradient(0, l.y, x1, l.y);
    grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, l.y);
    ctx.lineTo(x1, l.y);
    ctx.stroke();
  }
}

gsap.ticker.add(drawGrid);

// // --- UI entrance (runs after grid finishes) ---
function startUI() {
  // fade lines from dark to soft (#E4EBF1 = 228, 235, 241)
  gsap.to(color, {
    r: 228,
    g: 235,
    b: 241,
    duration: 0.5,
    ease: "power2.out",
    onComplete: () => gsap.ticker.remove(drawGrid),
  });
}

// Draw lines one at a time, interleaved — then kick off UI
gsap.to(allLines, {
  p: 1,
  duration: 0.35,
  stagger: 0.07,
  ease: "power2.inOut",
  onComplete: startUI,
});

// --- Scroll: trapezoid fill → fullscreen → slide ---
gsap.registerPlugin(ScrollTrigger);

const trapi2 = document.querySelector(".trapi_2");
const page1 = document.querySelector(".page_1");
const page2 = document.querySelector(".page_2");
const VW = window.innerWidth;
const VH = window.innerHeight;

// Position page_2 fixed and off-screen left for the slide-in effect
page2.style.position = "fixed";
page2.style.top = "0";
page2.style.left = "0";
page2.style.zIndex = "5";
page2.style.width = "100vw";
page2.style.height = "100vh";
page2.style.transform = `translateX(${-VW}px)`;

// Get SVG screen coordinates to match clip-path to the trapezoid's position
const trapiRect = document.querySelector(".trapi_svg").getBoundingClientRect();
const ox = trapiRect.left;
const oy = trapiRect.top;
// Scale factors: viewBox is 365×239, rendered size may differ on small screens
const sx = trapiRect.width / 365;
const sy = trapiRect.height / 239;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Phase 1: reveal fill inside trapezoid top → bottom
function wipePath(t) {
  const topY = oy + 0.5 * sy;
  const botY = oy + 0.5 * sy + 237.24 * sy * t;
  const tlx = ox + 245.938 * sx;
  const trx = ox + 363.036 * sx;
  const blx = ox + 245.938 * sx - 244.704 * sx * t;
  const brx = ox + 363.036 * sx - 242.202 * sx * t;
  return `path('M${trx} ${topY}L${tlx} ${topY}L${blx} ${botY}L${brx} ${botY}Z')`;
}

// Phase 2: trapezoid shape → full viewport rectangle
const startPts = {
  blx: ox + 1.23407 * sx,
  bly: oy + 237.74 * sy,
  brx: ox + 120.834 * sx,
  bry: oy + 237.74 * sy,
  trx: ox + 363.036 * sx,
  try_: oy + 0.5 * sy,
  tlx: ox + 245.938 * sx,
  tly: oy + 0.5 * sy,
};
const endPts = {
  blx: 0,
  bly: VH + 1000,
  brx: VW + 1000,
  bry: VH,
  trx: VW,
  try_: 0,
  tlx: 0,
  tly: 0,
};

function trapiPath(t) {
  const blx = lerp(startPts.blx, endPts.blx, t);
  const bly = lerp(startPts.bly, endPts.bly, t);
  const brx = lerp(startPts.brx, endPts.brx, t);
  const bry = lerp(startPts.bry, endPts.bry, t);
  const trx = lerp(startPts.trx, endPts.trx, t);
  const tr_ = lerp(startPts.try_, endPts.try_, t);
  const tlx = lerp(startPts.tlx, endPts.tlx, t);
  const tly = lerp(startPts.tly, endPts.tly, t);
  return `path('M${brx} ${bry}L${blx} ${bly}L${tlx} ${tly}L${trx} ${tr_}Z')`;
}

const samu = document.querySelector(".samu");

// --- Modules scroll measurements ---
const modulesEl = document.querySelector(".modules");
const highlighterEl = document.querySelector(".highlighter");
const moduleItems = [
  ...document.querySelectorAll(".modules div:not(.highlighter)"),
];

let modulesStartY = 0;
let modulesEndY = 0;

function measureModules() {
  const highlighterTop = highlighterEl.offsetTop;
  const firstItemTop = moduleItems[0].offsetTop;
  const lastItemTop = moduleItems[moduleItems.length - 1].offsetTop;
  modulesStartY = highlighterTop - firstItemTop;
  modulesEndY = highlighterTop - lastItemTop;
}

measureModules();

window.addEventListener("resize", () => {
  measureModules();
  ScrollTrigger.refresh();
});

// Phase 6 state
let phase6Ready = false;
let hlStartRect = null;
let devStartLeft = 0;
let devStartTop = 0;
let devStartWidth = 0;

// Buildstack setup — fixed off-screen right
const buildstackEl = document.querySelector(".page_3");
buildstackEl.style.position = "fixed";
buildstackEl.style.top = "0";
buildstackEl.style.left = "0";
buildstackEl.style.width = "100vw";
buildstackEl.style.height = "100vh";
buildstackEl.style.zIndex = "4";
buildstackEl.style.transform = `translateX(${VW}px)`;
buildstackEl.style.backgroundColor = "var(--color-white)";

// Endnode setup — fixed off-screen below
const endnodeEl = document.querySelector(".page_4");
endnodeEl.style.position = "fixed";
endnodeEl.style.top = "0";
endnodeEl.style.left = "0";
endnodeEl.style.width = "100vw";
endnodeEl.style.height = "100vh";
endnodeEl.style.zIndex = "15";
endnodeEl.style.transform = `translateY(${VH}px)`;

// Set initial states
trapi2.style.clipPath = wipePath(0);
trapi2.style.opacity = "1";
samu.style.clipPath = "inset(0 100% 0 0)";
modulesEl.style.opacity = "0";
moduleItems.forEach((item) => {
  item.style.transform = `translateY(${modulesStartY}px)`;
});

// Re-measure after fonts load — Fugaz One affects item heights and offsetTop
document.fonts.ready.then(() => {
  measureModules();
  moduleItems.forEach((item) => {
    item.style.transform = `translateY(${modulesStartY}px)`;
  });
});

ScrollTrigger.create({
  trigger: "#main",
  start: "top top",
  end: "+=750%",
  pin: true,
  scrub: 1,
  onUpdate: (self) => {
    const p = self.progress;

    if (p <= 0.1) {
      // Phase 1: fill trapezoid top → bottom
      trapi2.style.clipPath = wipePath(p / 0.1);
      trapi2.style.transform = "";
      page1.style.transform = "";
      page2.style.transform = `translateX(${-VW}px)`;
      samu.style.clipPath = "inset(0 100% 0 0)";
    } else if (p <= 0.2) {
      // Phase 2: trapezoid expands to fullscreen
      trapi2.style.clipPath = trapiPath((p - 0.1) / 0.1);
      trapi2.style.transform = "";
      page1.style.transform = "";
      page2.style.transform = `translateX(${-VW}px)`;
      samu.style.clipPath = "inset(0 100% 0 0)";
    } else if (p <= 0.3) {
      // Phase 3: overlay + page_1 slide right, page_2 enters from left
      const slide = (p - 0.2) / 0.1;
      trapi2.style.clipPath = trapiPath(1);
      trapi2.style.transform = `translateX(${VW * slide}px)`;
      page1.style.transform = `translateX(${VW * slide}px)`;
      page2.style.transform = `translateX(${-VW * (1 - slide)}px)`;
      samu.style.clipPath = "inset(0 100% 0 0)";
    } else if (p <= 0.4) {
      // Phase 4: samu image wipes in left → right
      const wipe = (p - 0.3) / 0.1;
      trapi2.style.clipPath = trapiPath(1);
      trapi2.style.transform = `translateX(${VW}px)`;
      page1.style.transform = `translateX(${VW}px)`;
      page2.style.transform = `translateX(0px)`;
      samu.style.clipPath = `inset(0 ${(1 - wipe) * 100}% 0 0)`;
      modulesEl.style.opacity = "0";
    } else if (p <= 0.8) {
      // Phase 5: modules list scrolls through the highlighter band
      // Range 0.4–0.8 = 0.4 × 750% = 300% scroll
      const scroll5 = (p - 0.4) / 0.4;
      const y = lerp(modulesStartY, modulesEndY, scroll5);
      trapi2.style.transform = `translateX(${VW}px)`;
      page1.style.transform = `translateX(${VW}px)`;
      page2.style.transform = `translateX(0px)`;
      samu.style.clipPath = "inset(0 0% 0 0)";
      modulesEl.style.opacity = "1";
      buildstackEl.style.transform = `translateX(${VW}px)`;
      // Reset phase 6/7 state if scrolling back
      if (phase6Ready) {
        const devItem = moduleItems[moduleItems.length - 1];
        highlighterEl.style.cssText = "";
        devItem.style.position = "";
        devItem.style.left = "";
        devItem.style.width = "";
        devItem.style.top = "";
        devItem.style.zIndex = "";
        devItem.style.color = "";
        devItem.style.transform = `translateY(${y}px)`;
        phase6Ready = false;
      }
      moduleItems.forEach((item) => {
        item.style.transform = `translateY(${y}px)`;
      });
    } else if (p <= 0.88) {
      // Phase 6: 3 sub-phases
      //   6a (0.00–0.33): Developer moves to screen center
      //   6b (0.33–0.67): Highlighter width expands to full VW
      //   6c (0.67–1.00): Highlighter height expands to full VH + orange → red
      const phase6 = (p - 0.8) / 0.08;
      const p6a = Math.min(1, phase6 / 0.33);
      const p6b = Math.max(0, Math.min(1, (phase6 - 0.33) / 0.34));
      const p6c = Math.max(0, Math.min(1, (phase6 - 0.67) / 0.33));
      const devItem = moduleItems[moduleItems.length - 1];
      trapi2.style.transform = `translateX(${VW}px)`;
      page1.style.transform = `translateX(${VW}px)`;
      page2.style.transform = `translateX(0px)`;
      samu.style.clipPath = "inset(0 0% 0 0)";
      modulesEl.style.opacity = "1";
      buildstackEl.style.transform = `translateX(${VW}px)`;
      // Capture actual visual positions once on first entry
      if (!phase6Ready) {
        hlStartRect = highlighterEl.getBoundingClientRect();
        const devRect = devItem.getBoundingClientRect();
        devStartLeft = devRect.left;
        devStartTop = devRect.top;
        devStartWidth = devRect.width;
        phase6Ready = true;
      }
      // Pin all items at phase 5 end
      moduleItems.forEach((item) => {
        item.style.transform = `translateY(${modulesEndY}px)`;
      });
      // --- Developer moves to center (6a) ---
      const devTargetTop = VH / 2 - devItem.offsetHeight / 2;
      devItem.style.position = "fixed";
      devItem.style.transform = "none";
      devItem.style.zIndex = "7";
      devItem.style.color = "rgb(255,255,255)";
      devItem.style.left = `${lerp(devStartLeft, 0, p6a)}px`;
      devItem.style.top = `${lerp(devStartTop, devTargetTop, p6a)}px`;
      devItem.style.width = `${lerp(devStartWidth, VW, p6a)}px`;
      // --- Highlighter: width then height (6b → 6c) ---
      highlighterEl.style.position = "fixed";
      highlighterEl.style.margin = "0";
      highlighterEl.style.zIndex = "6";
      highlighterEl.style.mixBlendMode = "normal";
      highlighterEl.style.transform = "";
      highlighterEl.style.left = `${lerp(hlStartRect.left, 0, p6b)}px`;
      highlighterEl.style.width = `${lerp(hlStartRect.width, VW, p6b)}px`;
      highlighterEl.style.top = `${lerp(hlStartRect.top, 0, p6c)}px`;
      highlighterEl.style.height = `${lerp(hlStartRect.height, VH, p6c)}px`;
      // Color: orange #FFB473 (255,180,115) → red #FF3B30 (255,59,48)
      const gVal = Math.round(lerp(180, 59, p6c));
      const bVal = Math.round(lerp(115, 48, p6c));
      highlighterEl.style.backgroundColor = `rgb(255,${gVal},${bVal})`;
    } else {
      // Phase 7: push slide — red screen exits left, buildstack enters from right
      // Range 0.88–1.0 = 0.12 × 750% = 90% scroll
      const phase7 = (p - 0.88) / 0.12;
      const devItem = moduleItems[moduleItems.length - 1];
      trapi2.style.transform = `translateX(${VW}px)`;
      page1.style.transform = `translateX(${VW}px)`;
      samu.style.clipPath = "inset(0 0% 0 0)";
      modulesEl.style.opacity = "1";
      // page_2 slides left
      page2.style.transform = `translateX(${-VW * phase7}px)`;
      // Red full-screen overlay slides left
      highlighterEl.style.position = "fixed";
      highlighterEl.style.margin = "0";
      highlighterEl.style.zIndex = "6";
      highlighterEl.style.mixBlendMode = "normal";
      highlighterEl.style.top = "0px";
      highlighterEl.style.left = "0px";
      highlighterEl.style.width = `${VW}px`;
      highlighterEl.style.height = `${VH}px`;
      highlighterEl.style.backgroundColor = "rgb(255,59,48)";
      highlighterEl.style.transform = `translateX(${-VW * phase7}px)`;
      // Developer text slides left with overlay
      devItem.style.position = "fixed";
      devItem.style.zIndex = "7";
      devItem.style.color = "rgb(255,255,255)";
      devItem.style.left = "0";
      devItem.style.width = `${VW}px`;
      devItem.style.top = `${VH / 2 - devItem.offsetHeight / 2}px`;
      devItem.style.transform = `translateX(${-VW * phase7}px)`;
      // Buildstack slides in from right
      buildstackEl.style.transform = `translateX(${VW * (1 - phase7)}px)`;
      moduleItems.forEach((item) => {
        item.style.transform = `translateY(${modulesEndY}px)`;
      });
    }
  },
});

// --- Buildstack: wipe slide transitions ---
const bsSlides = [...document.querySelectorAll(".page_3 .pin-slide")];
const bsProgress = document.querySelector(".page_3 .pin-progress");
const bsCurrent = document.querySelector(".page_3 .pin-current");
const bsCounter = document.querySelector(".page_3 .pin-counter");

// z-index layering and initial clip state
bsSlides.forEach((slide, i) => {
  slide.style.zIndex = String(i + 1);
  slide.style.clipPath = i === 0 ? "inset(0 0 0 0)" : "inset(0 0 0 100%)";
});

// Wipe transitions: each defines which slide reveals and at what progress range
const bsTransitions = [
  { slide: 1, start: 0.08, end: 0.30 },
  { slide: 2, start: 0.38, end: 0.60 },
  { slide: 3, start: 0.68, end: 0.90 },
];

const bsCounterColors = ["#ffffff", "#0f1c6b", "#1a1a1a", "#e6edf3"];

ScrollTrigger.create({
  trigger: ".bs-space",
  start: "top top",
  end: "bottom bottom",
  scrub: 1,
  onLeave: () => {
    gsap.to(buildstackEl, { x: -VW, duration: 0.5, ease: "power2.inOut" });
  },
  onEnterBack: () => {
    gsap.to(buildstackEl, { x: 0, duration: 0.4, ease: "power2.out" });
  },
  onUpdate: (self) => {
    const p = self.progress;

    bsProgress.style.width = p * 100 + "%";

    let activeSlide = 0;

    bsTransitions.forEach((t) => {
      if (p >= t.end) {
        bsSlides[t.slide].style.clipPath = "inset(0 0 0 0)";
        activeSlide = t.slide;
      } else if (p >= t.start) {
        const wt = (p - t.start) / (t.end - t.start);
        bsSlides[t.slide].style.clipPath = `inset(0 0 0 ${(1 - wt) * 100}%)`;
        if (wt >= 0.5) activeSlide = t.slide;
      } else {
        bsSlides[t.slide].style.clipPath = "inset(0 0 0 100%)";
      }
    });

    bsCurrent.textContent = String(activeSlide + 1).padStart(2, "0");
    bsCounter.style.color = bsCounterColors[activeSlide];

    // Slide endnode up from bottom after last slide (p 0.90 → 1.0)
    if (p >= 0.90) {
      const endSlide = (p - 0.90) / 0.10;
      endnodeEl.style.transform = `translateY(${VH * (1 - endSlide)}px)`;
    } else {
      endnodeEl.style.transform = `translateY(${VH}px)`;
    }
  },
});
