(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
const g = window.gsap, ST = window.ScrollTrigger;
if (g && ST) g.registerPlugin(ST);

/* ── hero name: per-character stagger ─────────── */
$$('[data-split]').forEach(el => {
  const words = el.textContent.split(' ');
  el.textContent = '';
  let i = 0;
  words.forEach((w, wi) => {
    const wrap = document.createElement('span');
    wrap.className = 'wd';
    [...w].forEach(c => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.style.setProperty('--i', i++);
      s.textContent = c;
      wrap.appendChild(s);
    });
    el.appendChild(wrap);
    if (wi < words.length - 1) {
      const sp = document.createElement('span');
      sp.className = 'ch sp';
      sp.style.setProperty('--i', i++);
      sp.textContent = '\u00A0';
      el.appendChild(sp);
    }
  });
});
requestAnimationFrame(() => { document.body.classList.add('ready'); document.querySelector('.hero')?.classList.add('in'); });
$$('.sect, .hero').forEach(sec => $$('[data-r]', sec).forEach((el, i) => {
  if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', i % 9);
}));

/* ── dock ─────────────────────────────────────── */
const dock = $('.dock'), pill = $('.dock-liquid'), links = $$('.dock a');
let squish;
function movePill(el, animate = true) {
  if (!el || !pill) return;
  const a = el.getBoundingClientRect(), b = dock.getBoundingClientRect();
  pill.style.opacity = 1;
  pill.style.width = a.width + 'px';
  const x = a.left - b.left;
  if (animate && !reduce) {
    pill.style.transform = `translateX(${x}px) scaleX(1.14) scaleY(.9)`;
    clearTimeout(squish);
    squish = setTimeout(() => { pill.style.transform = `translateX(${x}px)`; }, 190);
  } else pill.style.transform = `translateX(${x}px)`;
}
function setActive(id) {
  links.forEach(l => {
    const on = l.getAttribute('href') === '#' + id;
    l.setAttribute('aria-current', on ? 'true' : 'false');
    if (on) movePill(l);
  });
}
links.forEach(l => l.addEventListener('mouseenter', () => movePill(l)));
dock?.addEventListener('mouseleave', () => movePill(links.find(l => l.getAttribute('aria-current') === 'true')));
const curLink = () => links.find(l => l.getAttribute('aria-current') === 'true') || links[0];

/* ── work accordion ───────────────────────────── */
$$('.wrow-head').forEach(btn => btn.addEventListener('click', () => {
  const row = btn.closest('.wrow'), open = row.classList.contains('open');
  $$('.wrow.open').forEach(r => { r.classList.remove('open'); $('.wrow-head', r).setAttribute('aria-expanded', 'false'); });
  if (!open) { row.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
}));

/* ── liquid colour reveal on the portrait ─────── */
const slot = $('.hero-fig .slot');
if (slot) {
  if (reduce) { slot.style.setProperty('--rx', '260%'); slot.style.setProperty('--ry', '260%'); }
  else {
    let tx = .52, tyv = .46, x = tx, y = tyv, tr = 0, r = 0, t = 0, over = false;
    slot.addEventListener('pointermove', e => {
      const b = slot.getBoundingClientRect();
      tx = (e.clientX - b.left) / b.width; tyv = (e.clientY - b.top) / b.height;
      if (!over) { over = true; x = tx; y = tyv; }
      tr = 1;
    }, { passive: true });
    slot.addEventListener('pointerleave', () => { tr = 0; over = false; });
    const tick = () => {
      t += 1 / 60;
      x = lerp(x, tx, .11); y = lerp(y, tyv, .11); r = lerp(r, tr, .07);
      slot.style.setProperty('--bx', (x * 100).toFixed(2) + '%');
      slot.style.setProperty('--by', (y * 100).toFixed(2) + '%');
      slot.style.setProperty('--rx', (54 * r * (1 + Math.sin(t * 1.9) * .12)).toFixed(2) + '%');
      slot.style.setProperty('--ry', (44 * r * (1 + Math.cos(t * 1.45 + 1) * .14)).toFixed(2) + '%');
    };
    g ? g.ticker.add(tick) : setInterval(tick, 16);
  }
}

/* ── cursor wash + trail ──────────────────────── */
const wash = $('.wash'), trail = $('.cursor-layer'), DOTS = 15, dots = [];
if (trail && !reduce && matchMedia('(hover:hover)').matches) {
  for (let i = 0; i < DOTS; i++) {
    const d = document.createElement('div');
    d.className = 'cursor-dot';
    trail.appendChild(d);
    dots.push({ el: d, x: innerWidth / 2, y: innerHeight / 2 });
  }
}
let mx = innerWidth * .7, my = innerHeight * .4, wx = mx, wy = my;
if (!reduce) addEventListener('pointermove', e => {
  mx = e.clientX; my = e.clientY;
  wash?.classList.add('on'); trail?.classList.add('on');
}, { passive: true });
function frame() {
  wx = lerp(wx, mx, .055); wy = lerp(wy, my, .055);
  if (wash) wash.style.transform = `translate3d(${wx}px,${wy}px,0)`;
  for (let i = 0; i < dots.length; i++) {
    const d = dots[i], tg = i === 0 ? { x: mx, y: my } : dots[i - 1];
    d.x = lerp(d.x, tg.x, i === 0 ? .34 : .4); d.y = lerp(d.y, tg.y, i === 0 ? .34 : .4);
    const s = 1 - i * (.8 / DOTS);
    d.el.style.transform = `translate(${d.x}px,${d.y}px) scale(${s.toFixed(3)})`;
    d.el.style.opacity = s.toFixed(3);
  }
  requestAnimationFrame(frame);
}
if (!reduce) requestAnimationFrame(frame);

/* ── terminal ticker (night act) ──────────────── */
const term = $('#termOut');
if (term && !reduce) {
  const LINES = [
    ['p', '$ ', 'kubectl rollout status deploy/api'],
    ['g', '', 'deployment "api" successfully rolled out'],
    ['p', '$ ', 'curl -sw "%{time_total}" https://api.internal/health'],
    ['g', '', '{"ok":true,"db":"mongo:primary","cache":"hit"}  0.041s'],
    ['p', '$ ', 'tail -f /var/log/traces | jq .p95'],
    ['d', '', 'span=render.pedigree  p95=182ms  err=0.00%'],
    ['p', '$ ', 'tcpdump -ni eth0 "tcp port 443" -c 3'],
    ['d', '', '10:24:07.118 IP 10.0.2.14.443 > 10.0.9.31 [S.] win 65535'],
    ['p', '$ ', 'terraform apply -auto-approve'],
    ['g', '', 'Apply complete. 4 added, 1 changed, 0 destroyed.']
  ];
  let li = 0, ci = 0, buf = [];
  const caret = '<span class="caret"></span>';
  const paint = (partial) => {
    const rows = buf.map(l => `<span class="${l[0]}">${l[1]}</span>${l[2]}`);
    if (partial !== null) rows.push(`<span class="${LINES[li][0]}">${LINES[li][1]}</span>${partial}${caret}`);
    term.innerHTML = rows.join('\n');
  };
  const step = () => {
    const line = LINES[li], txt = line[2];
    if (ci <= txt.length) {
      paint(txt.slice(0, ci));
      ci++;
      setTimeout(step, line[0] === 'p' ? 26 + Math.random() * 34 : 8);
    } else {
      buf.push(line);
      if (buf.length > 6) buf.shift();
      li = (li + 1) % LINES.length; ci = 0;
      paint(null);
      setTimeout(step, line[0] === 'p' ? 320 : 720);
    }
  };
  step();
}

/* ── scroll narrative ─────────────────────────── */
const bar = $('.progress'), cue = $('.cue');
if (bar) {
  const upd = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    if (cue) cue.style.opacity = max > 0 && scrollY / max > .93 ? 0 : 1;
  };
  addEventListener('scroll', upd, { passive: true });
  upd();
}

if (g && ST && !reduce && innerWidth > 900) {
  const built = $('#built'), work = $('#work'), lab = $('#lab');
  const cover1 = $('[data-cover="1"]'), shape = $('.shape', cover1), line = $('.shape-line', cover1);
  const meta = $('#fillPct'), ttl = $('.cover-ttl', cover1);
  const rows = $$('#built [data-fill]');
  const view = $('.built-view'), col = $('.built-col');

  /* the ledger window advances so the filling line sits in the reading zone */
  let ys = [];
  const measure = () => {
    const vh2 = view.clientHeight, colH = col.scrollHeight, line = vh2 * .44, floor = Math.min(0, -(colH - vh2 * .72));
    ys = rows.map(r => Math.max(floor, Math.min(0, line - r.offsetTop - r.offsetHeight / 2)));
  };
  g.set(col, { y: 0 });

  /* act 02 — polygon fills, floods, slides right; then the spec fills line by line */
  const t2 = g.timeline({ scrollTrigger: { trigger: built, start: 'top top', end: '+=800%', pin: true, scrub: .55, anticipatePin: 1, onRefresh: measure, onToggle: s => s.isActive && setActive('built') } });
  const f = { v: 0 };
  t2.to(f, { v: 100, duration: 2.4, ease: 'none', onUpdate: () => {
      shape.style.setProperty('--f', f.v.toFixed(2));
      if (meta) meta.textContent = String(Math.round(f.v)).padStart(3, '0') + '%';
    } })
    .to(cover1, { '--gx': '0%', '--gy': '0%', '--gh': '100%', duration: .95, ease: 'power2.inOut' })
    .to(shape, { clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)', duration: .95, ease: 'power2.inOut' }, '<')
    .to(line, { opacity: 0, duration: .35 }, '<')
    .to(ttl, { opacity: 1, duration: .45, ease: 'power2.out' }, '<+=.45')
    .to({}, { duration: .4 })
    .add(() => built.classList.add('in'))
    .to(cover1, { xPercent: 104, duration: 1.15, ease: 'power3.inOut' })
    .to(ttl, { opacity: 0, duration: .3 }, '<');
  /* one continuous pass: the window glides, each line fills as it crosses the reading line,
     and the previous line clears — a single driver, so there is no stop between the two */
  const q = { v: 0 }, n = rows.length, sstep = t => t * t * (3 - 2 * t);
  t2.to(q, { v: n, duration: n * 1.05, ease: 'none', onUpdate: () => {
      if (!ys.length) measure();
      const v = q.v, i = Math.min(n - 1, Math.floor(v)), lp = Math.max(0, Math.min(1, v - i));
      const p = sstep(Math.min(1, lp / .78));
      for (let k = 0; k < n; k++) {
        const on = k === i;
        rows[k].style.setProperty('--p', on ? p.toFixed(3) : '0');
        rows[k].classList.toggle('on', on);
      }
      const t = Math.max(0, Math.min(n - 1, v - .5)), a = Math.floor(t), b = Math.min(n - 1, a + 1);
      g.set(col, { y: ys[a] + (ys[b] - ys[a]) * (t - a) });
    } })
    .to({}, { duration: .8 });

  /* act 03 — technical developer */
  ST.create({ trigger: work, start: 'top 70%', onEnter: () => work.classList.add('in') });
  ST.create({ trigger: work, start: 'top 55%', end: 'bottom 45%', onToggle: s => s.isActive && setActive('work') });
  g.to($('.bigtype'), { xPercent: -5, ease: 'none', scrollTrigger: { trigger: work, start: 'top bottom', end: 'bottom top', scrub: .6 } });

  /* act 04 — night slab wipes up as it arrives, content riding in with it */
  g.timeline({ scrollTrigger: { trigger: lab, start: 'top bottom', end: 'top top', scrub: .5, onToggle: s => s.isActive && setActive('lab') } })
    .fromTo(lab, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'none' })
    .fromTo($$('#lab [data-l]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .55, stagger: .1, ease: 'power2.out' }, .34);
  ST.create({ trigger: lab, start: 'top 50%', end: 'bottom 50%', onToggle: s => s.isActive && setActive('lab') });

  /* act 05 — words rises in */
  ST.create({ trigger: '#words', start: 'top 72%', onEnter: () => $('#words').classList.add('in') });
  g.from($$('#words .pcard, #words .words-cut, #words .hi-grid, #words .foot-bar'), {
    opacity: 0, y: 30, duration: .9, stagger: .11, ease: 'power2.out',
    scrollTrigger: { trigger: '#words', start: 'top 72%' }
  });

  /* dock state for the unpinned book-ends */
  ST.create({ trigger: '#intro', start: 'top top', end: 'bottom 55%', onToggle: s => s.isActive && setActive('intro') });
  ST.create({ trigger: '#words', start: 'top 40%', end: 'bottom bottom', onToggle: s => s.isActive && setActive('words') });
} else {
  /* reduced motion / small screens: everything on, plain scroll */
  document.documentElement.classList.add('flat');
  $$('.cover').forEach(c => c.remove());
  $$('#built [data-fill]').forEach(c => { c.classList.add('on'); c.style.setProperty('--p', 1); });
  $$('.sect, .hero, .act').forEach(s => s.classList.add('in'));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .18 });
  $$('.sect').forEach(s => io.observe(s));
}

/* nav clicks */
links.forEach(l => l.addEventListener('click', e => {
  e.preventDefault();
  const el = $(l.getAttribute('href'));
  if (el) scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: 'smooth' });
}));

setActive('intro');
addEventListener('resize', () => movePill(curLink(), false));
document.fonts?.ready.then(() => { movePill(curLink(), false); window.ScrollTrigger?.refresh(); });
})();
