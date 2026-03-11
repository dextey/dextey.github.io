const s = "color: #ffb347; font-weight: bold;";
console.log(
  `%c
 ██████╗ ███████╗██╗  ██╗████████╗███████╗██╗   ██╗
 ██╔══██╗██╔════╝╚██╗██╔╝╚══██╔══╝██╔════╝╚██╗ ██╔╝
 ██║  ██║█████╗   ╚███╔╝    ██║   █████╗   ╚████╔╝
 ██║  ██║██╔══╝   ██╔██╗    ██║   ██╔══╝    ╚██╔╝
 ██████╔╝███████╗██╔╝ ██╗   ██║   ███████╗   ██║
 ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝   ╚═╝

 ██████╗ ███████╗██╗   ██╗███████╗██╗      ██████╗ ██████╗ ███████╗██████╗
 ██╔══██╗██╔════╝██║   ██║██╔════╝██║     ██╔═══██╗██╔══██╗██╔════╝██╔══██╗
 ██║  ██║█████╗  ██║   ██║█████╗  ██║     ██║   ██║██████╔╝█████╗  ██████╔╝
 ██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔═══╝ ██╔══╝  ██╔══██╗
 ██████╔╝███████╗ ╚████╔╝ ███████╗███████╗╚██████╔╝██║     ███████╗██║  ██║
 ╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝
`,
  s,
);

// // --- Trapezoid scroll animation ---
// gsap.registerPlugin(ScrollTrigger);

// const trapi2 = document.querySelector(".trapi_2");
// const VW = window.innerWidth;
// const VH = window.innerHeight;

// // Start: trapezoid points offset to match .trapi_1's screen position
// const trapiRect = document
//   .querySelector(".trapi_1 svg")
//   .getBoundingClientRect();
// const ox = trapiRect.left;
// const oy = trapiRect.top;
// const startPts = {
//   blx: ox + 1.23407,
//   bly: oy + 237.74,
//   brx: ox + 120.834,
//   bry: oy + 237.74,
//   trx: ox + 363.036,
//   try_: oy + 0.5,
//   tlx: ox + 245.938,
//   tly: oy + 0.5,
// };
// // End: full viewport rectangle
// const endPts = {
//   blx: 0,
//   bly: VH,
//   brx: VW,
//   bry: VH,
//   trx: VW,
//   try_: 0,
//   tlx: 0,
//   tly: 0,
// };

// function lerp(a, b, t) {
//   return a + (b - a) * t;
// }

// // Wipe fill: top-to-bottom within the trapezoid shape (t: 0=empty, 1=full shape)
// function wipePath(t) {
//   const topY = oy + 0.5;
//   const botY = oy + 0.5 + 237.24 * t;
//   const tlx = ox + 245.938;
//   const trx = ox + 363.036;
//   const blx = ox + 245.938 - 244.704 * t;
//   const brx = ox + 363.036 - 242.202 * t;
//   return `path('M${trx} ${topY}L${tlx} ${topY}L${blx} ${botY}L${brx} ${botY}Z')`;
// }

// // Grow: trapezoid shape → full viewport (t: 0=shape, 1=full screen)
// function trapiPath(t) {
//   const blx = lerp(startPts.blx, endPts.blx, t);
//   const bly = lerp(startPts.bly, endPts.bly, t);
//   const brx = lerp(startPts.brx, endPts.brx, t);
//   const bry = lerp(startPts.bry, endPts.bry, t);
//   const trx = lerp(startPts.trx, endPts.trx, t);
//   const tr_ = lerp(startPts.try_, endPts.try_, t);
//   const tlx = lerp(startPts.tlx, endPts.tlx, t);
//   const tly = lerp(startPts.tly, endPts.tly, t);
//   return `path('M${brx} ${bry}L${blx} ${bly}L${tlx} ${tly}L${trx} ${tr_}Z')`;
// }

// // Start invisible (empty top edge)
// trapi2.style.clipPath = wipePath(0);

// const leftEls = document.querySelectorAll(
//   ".left-block-line, .left-line, .brick-sm, .b_footer, .pro_hero, .head_a",
// );

// ScrollTrigger.create({
//   trigger: "#prop_2",
//   start: "top bottom",
//   once: true,
//   onEnter: () => {
//     gsap.to("#prop_2", { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" });
//   },
// });

// ScrollTrigger.create({
//   trigger: "#main",
//   start: "top top",
//   end: "+=250%",
//   pin: true,
//   scrub: 1,
//   onLeave: () => gsap.ticker.remove(drawGrid),
//   onUpdate: (self) => {
//     const p = self.progress;

//     trapi2.style.opacity = "1";

//     if (p <= 0.3) {
//       // Phase 1: fill trapezoid top → bottom
//       trapi2.style.clipPath = wipePath(p / 0.3);
//       canvas.style.opacity = "1";
//       leftEls.forEach((el) => {
//         el.style.opacity = "1";
//       });
//     } else if (p <= 0.7) {
//       // Phase 2: grow → full screen, fade UI out
//       const grow = (p - 0.3) / 0.4;
//       trapi2.style.clipPath = trapiPath(grow);
//       canvas.style.opacity = "1";
//       leftEls.forEach((el) => {
//         el.style.opacity = String(1 - grow);
//       });
//     } else {
//       // Phase 3: full screen → fade out, reveal next section
//       const fadeOut = 1 - (p - 0.7) / 0.3;
//       trapi2.style.clipPath = trapiPath(1);
//       trapi2.style.opacity = String(fadeOut);
//       canvas.style.opacity = String(fadeOut);
//       leftEls.forEach((el) => {
//         el.style.opacity = "0";
//       });
//     }
//   },
// });

// gsap.to(".modules div", {
//   opacity: 1,
//   y: 0,
//   duration: 0.6,
//   stagger: 0.15,
//   ease: "power2.out",
//   scrollTrigger: {
//     trigger: ".modules",
//     start: "top 80%",
//   },
// });
