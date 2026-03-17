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
    onComplete: () => {
      gsap.ticker.remove(drawGrid);
      gsap.fromTo(
        [
          ".page_1 .poly_1",
          ".page_1 .pro_img",
          ".page_1 .greet",
          ".page_1 .user",
          ".page_1 .known",
          ".page_1 .about",
          ".page_1 .b_footer",
        ],
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
      );
    },
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
ScrollTrigger.config({ ignoreMobileResize: true });

const trapi2 = document.querySelector(".trapi_2");
const page1 = document.querySelector(".page_1");
const page2 = document.querySelector(".page_2");
let VW = window.innerWidth;
let VH = window.innerHeight;

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

// --- Forge (page_2) elements ---
const samuClip = document.getElementById("samurai-clip");
const skillsAreaEl = document.querySelector(".p2-skills");
const skillStageEl = document.getElementById("skill-stage");
const numPanels = skillStageEl ? skillStageEl.children.length : 5;

window.addEventListener("resize", () => {
  VW = window.innerWidth;
  VH = window.innerHeight;
  endPts.bly = VH + 1000;
  endPts.brx = VW + 1000;
  endPts.bry = VH;
  endPts.trx = VW;
  ScrollTrigger.refresh();
});

// Set initial states
trapi2.style.clipPath = wipePath(0);
trapi2.style.opacity = "1";
samuClip.style.clipPath = "inset(0 100% 0 0)";
skillsAreaEl.style.opacity = "0";

ScrollTrigger.create({
  trigger: "#main",
  start: "top top",
  end: "+=750%",
  pin: true,
  anticipatePin: 1,
  scrub: 1,
  onUpdate: (self) => {
    const p = self.progress;

    if (p <= 0.1) {
      // Phase 1: fill trapezoid top → bottom
      trapi2.style.clipPath = wipePath(p / 0.1);
      trapi2.style.transform = "";
      page1.style.transform = "";
      page2.style.transform = `translateX(${-VW}px)`;
      samuClip.style.clipPath = "inset(0 100% 0 0)";
    } else if (p <= 0.2) {
      // Phase 2: trapezoid expands to fullscreen
      trapi2.style.clipPath = trapiPath((p - 0.1) / 0.1);
      trapi2.style.transform = "";
      page1.style.transform = "";
      page2.style.transform = `translateX(${-VW}px)`;
      samuClip.style.clipPath = "inset(0 100% 0 0)";
    } else if (p <= 0.3) {
      // Phase 3: overlay + page_1 slide right, page_2 enters from left
      const slide = (p - 0.2) / 0.1;
      trapi2.style.clipPath = trapiPath(1);
      trapi2.style.transform = `translateX(${VW * slide}px)`;
      page1.style.transform = `translateX(${VW * slide}px)`;
      page2.style.transform = `translateX(${-VW * (1 - slide)}px)`;
      samuClip.style.clipPath = "inset(0 100% 0 0)";
    } else if (p <= 0.4) {
      // Phase 4: samurai clip wipes in left → right
      const wipe = (p - 0.3) / 0.1;
      trapi2.style.clipPath = trapiPath(1);
      trapi2.style.transform = `translateX(${VW}px)`;
      page1.style.transform = `translateX(${VW}px)`;
      page2.style.transform = `translateX(0px)`;
      samuClip.style.clipPath = `inset(0 ${(1 - wipe) * 100}% 0 0)`;
      skillsAreaEl.style.opacity = "0";
    } else {
      // Phase 5: discrete card snap — one scroll step = one panel
      const scroll5 = Math.min(1, (p - 0.4) / 0.4);
      const activeIndex = Math.round(scroll5 * (numPanels - 1));
      trapi2.style.transform = `translateX(${VW}px)`;
      page1.style.transform = `translateX(${VW}px)`;
      page2.style.transform = `translateX(0px)`;
      samuClip.style.clipPath = "inset(0 0% 0 0)";
      skillsAreaEl.style.opacity = "1";
      [...skillStageEl.children].forEach((panel, i) => {
        panel.style.transform = i < activeIndex
          ? "translateX(-100%)"
          : i === activeIndex
          ? "translateX(0)"
          : "translateX(100%)";
      });
    }
  },
});
