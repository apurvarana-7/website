/* ============================================================
   Apurva Rana — Marketing portfolio (vanilla JS, no deps)
   ============================================================ */
(function () {
  "use strict";
  const C = window.PORTFOLIO_CONFIG || {};
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Bind config into the page ---------- */
  $$("[data-bind]").forEach((el) => { const v = C[el.dataset.bind]; if (v) el.textContent = v; });
  $$("[data-bind-href]").forEach((el) => {
    const k = el.dataset.bindHref; let v = C[k]; if (!v) return;
    if (k === "email") v = "mailto:" + v;
    el.setAttribute("href", v);
  });
  document.title = (C.name ? C.name + " — " : "") + "Marketing Portfolio";
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add("in-view"));

  /* ---------- Count-up numbers ---------- */
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const dur = 1500, start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }
  const nums = $$("[data-count]");
  if ("IntersectionObserver" in window && !reduced) {
    const nio = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { countUp(e.target); nio.unobserve(e.target); } }),
      { threshold: 0.5 }
    );
    nums.forEach((n) => nio.observe(n));
  } else nums.forEach((n) => (n.textContent = parseFloat(n.dataset.count).toLocaleString()));

  /* ---------- Nav: progress, scrolled state, mobile menu ---------- */
  const nav = $("#nav"), progress = $("#progress"), navLinks = $("#navLinks"), burger = $("#burger");
  function onScroll() {
    const sy = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (docH > 0 ? (sy / docH) * 100 : 0) + "%";
    if (nav) nav.classList.toggle("is-scrolled", sy > window.innerHeight - 90);
  }
  window.addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
  onScroll();
  if (burger && navLinks) {
    burger.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.addEventListener("click", (e) => { if (e.target.tagName === "A") navLinks.classList.remove("open"); });
  }

  /* ---------- Videos: autoplay (muted) when in view, pause when out ---------- */
  const playables = $$("video.reelvid, #featureVideo");
  if ("IntersectionObserver" in window) {
    const vio = new IntersectionObserver(
      (es) => es.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) { v.play().catch(() => {}); }
        else { v.pause(); }
      }),
      { threshold: 0.35 }
    );
    playables.forEach((v) => vio.observe(v));
  } else {
    playables.forEach((v) => v.play().catch(() => {}));
  }

  /* Featured video sound toggle */
  const video = $("#featureVideo"), soundBtn = $("#soundBtn");
  if (video && soundBtn) {
    soundBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      if (!video.muted) video.play().catch(() => {});
      soundBtn.textContent = video.muted ? "🔊 Sound on" : "🔇 Mute";
    });
  }

  /* ---------- Scrollspy: highlight active nav link ---------- */
  const spyLinks = $$('#navLinks a[href^="#"]');
  const spyMap = {};
  spyLinks.forEach((a) => { const id = a.getAttribute("href").slice(1); const sec = document.getElementById(id); if (sec) spyMap[id] = a; });
  const spySections = Object.keys(spyMap).map((id) => document.getElementById(id));
  if ("IntersectionObserver" in window && spySections.length) {
    const spyIO = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) {
          spyLinks.forEach((a) => a.classList.remove("active"));
          const a = spyMap[e.target.id]; if (a) a.classList.add("active");
        }
      }),
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    spySections.forEach((s) => spyIO.observe(s));
  }

  /* ---------- Lightbox (images + videos) ---------- */
  const lb = $("#lb"), lbStage = $("#lbStage"), lbClose = $("#lbClose");
  function openLB(type, src) {
    if (!lb) return;
    lbStage.innerHTML = "";
    if (type === "video") {
      const v = document.createElement("video");
      v.src = src; v.controls = true; v.autoplay = true; v.loop = true; v.playsInline = true; v.muted = false;
      lbStage.appendChild(v); v.play().catch(() => {});
    } else {
      const img = document.createElement("img");
      img.src = src; img.alt = ""; lbStage.appendChild(img);
    }
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLB() {
    if (!lb) return;
    lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true");
    lbStage.innerHTML = ""; document.body.style.overflow = "";
  }
  $$("[data-lb]").forEach((el) => el.addEventListener("click", () => openLB(el.dataset.lb, el.dataset.src)));
  if (lbClose) lbClose.addEventListener("click", closeLB);
  if (lb) lb.addEventListener("click", (e) => { if (e.target === lb) closeLB(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLB(); });

  /* ---------- Contact form → opens email app ---------- */
  const form = $("#contactForm");
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const to = C.email || "you@example.com";
    const subject = encodeURIComponent(`Portfolio enquiry from ${d.get("name") || ""}`);
    const body = encodeURIComponent(`${d.get("message") || ""}\n\n— ${d.get("name") || ""} (${d.get("email") || ""})`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
})();
