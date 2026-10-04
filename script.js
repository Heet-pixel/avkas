/* =========================================================
   script.js – page behaviour (header, animations, filters)
   ========================================================= */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- footer year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- header: compact "pill only" state after scrolling ---------- */
  var header = $("#siteHeader");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 70); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = $$(".reveal");
  if (reveals.length) {
    if (!("IntersectionObserver" in window) || reduce) {
      reveals.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- count-up numbers (stats card) ---------- */
  var stats = $("#stats");
  if (stats) {
    var counters = $$("[data-count]", stats);
    var pad = function (n, d) { var s = String(n); while (s.length < d) s = "0" + s; return s; };
    counters.forEach(function (el) { el.textContent = pad(0, el.getAttribute("data-count").length); });
    var runCount = function () {
      counters.forEach(function (el) {
        var to = parseInt(el.getAttribute("data-count"), 10), digits = String(to).length;
        if (reduce) { el.textContent = pad(to, digits); return; }
        var start = performance.now(), dur = 1600;
        (function tick(t) {
          var p = Math.min((t - start) / dur, 1);
          el.textContent = pad(Math.round(to * (1 - Math.pow(1 - p, 3))), digits);
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    };
    if ("IntersectionObserver" in window) {
      var sio = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { runCount(); sio.disconnect(); }
      }, { threshold: 0.3 });
      sio.observe(stats);
    } else runCount();
  }

  /* ---------- rotating hero headline ---------- */
  var rot = $("#heroRot");
  if (rot && !reduce) {
    var words = ["Trusted Governance", "Future-Ready Advisory"], i = 0;
    setInterval(function () {
      rot.classList.add("out");
      setTimeout(function () { i = (i + 1) % words.length; rot.textContent = words[i]; rot.classList.remove("out"); }, 350);
    }, 3800);
  }

  /* ---------- hero video: play only while visible ---------- */
  var vid = $("#heroVideo");
  if (vid) {
    if (reduce) vid.pause();
    else if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); } else vid.pause();
      }, { threshold: 0.05 }).observe(vid);
    }
  }

  /* ---------- "Why we exists": cards stack while scrolling ---------- */
  var wraps = $$(".why-wrap");
  if (wraps.length && !reduce) {
    var raf = 0;
    var update = function () {
      raf = 0;
      var vh = window.innerHeight, stick = window.innerWidth >= 768 ? 110 : 70;
      wraps.forEach(function (w, idx) {
        var card = w.firstElementChild, top = w.getBoundingClientRect().top;
        var enter = Math.min(1, Math.max(0, (vh * 0.96 - top) / (vh * 0.5)));   // fades in while rising into view
        var cover = 0, next = wraps[idx + 1];
        if (next) {                                                             // fades back + shrinks as the next card slides over
          var nt = next.getBoundingClientRect().top;
          cover = Math.min(1, Math.max(0, 1 - (nt - stick) / (card.offsetHeight * 0.95)));
        }
        card.style.opacity = String((0.18 + 0.82 * enter) * (1 - 0.7 * cover));
        card.style.transform = "scale(" + (1 - 0.05 * cover) + ")";
      });
    };
    var onWhy = function () { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onWhy, { passive: true });
    window.addEventListener("resize", onWhy);
  }

  /* ---------- blog category filter ---------- */
  var filters = $(".filters");
  if (filters) {
    var cards = $$(".post-card[data-cat]");
    $$("button", filters).forEach(function (b) {
      b.addEventListener("click", function () {
        var cat = b.getAttribute("data-cat");
        $$("button", filters).forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); });
        cards.forEach(function (c) { c.hidden = !(cat === "All" || c.getAttribute("data-cat") === cat); });
      });
    });
  }

  /* ---------- quietly preload the main pages so navigation feels instant ---------- */
  var idle = window.requestIdleCallback || function (cb) { return setTimeout(cb, 1500); };
  idle(function () {
    ["index.html", "about.html", "services.html", "events.html", "careers.html", "reach-us.html", "blog.html"].forEach(function (h, n) {
      setTimeout(function () {
        var l = document.createElement("link");
        l.rel = "prefetch"; l.href = h; l.as = "document";
        document.head.appendChild(l);
      }, n * 120);
    });
  }, { timeout: 3000 });
})();
