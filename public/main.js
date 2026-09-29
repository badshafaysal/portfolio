/* =========================================================
   Badsha Faysal Portfolio — Main JS
   Theme · Nav · Filters · Animations · Video · Form
   ========================================================= */

(function () {
  "use strict";

  const html = document.documentElement;
  const nav = document.getElementById("nav");
  const backTop = document.getElementById("to-top");
  const themeToggle = document.getElementById("theme-toggle");
  const mobileBtn = document.getElementById("mobile-btn");
  const mobileOverlay = document.getElementById("mobile-overlay");
  const mobileDrawer = document.getElementById("mobile-drawer");

  /* ---------- Theme ---------- */
  function applyTheme(isDark) {
    html.classList.toggle("dark", isDark);
    try { localStorage.theme = isDark ? "dark" : "light"; } catch (e) {}
    const sun = themeToggle?.querySelector(".icon-sun");
    const moon = themeToggle?.querySelector(".icon-moon");
    if (sun && moon) {
      sun.style.display = isDark ? "block" : "none";
      moon.style.display = isDark ? "none" : "block";
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDark ? "#070b14" : "#f6f5f1");
  }

  let stored = null;
  try { stored = localStorage.theme; } catch (e) {}
  if (stored === "light") applyTheme(false);
  else if (stored === "dark") applyTheme(true);
  else applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);

  themeToggle?.addEventListener("click", () => {
    applyTheme(!html.classList.contains("dark"));
  });

  /* ---------- Mobile drawer ---------- */
  function openDrawer() {
    if (!mobileDrawer || !mobileOverlay) return;
    mobileDrawer.hidden = false;
    mobileOverlay.hidden = false;
    requestAnimationFrame(() => {
      mobileDrawer.classList.add("open");
      mobileOverlay.classList.add("open");
    });
    mobileBtn?.setAttribute("aria-expanded", "true");
  }

  function closeDrawer() {
    if (!mobileDrawer || !mobileOverlay) return;
    mobileDrawer.classList.remove("open");
    mobileOverlay.classList.remove("open");
    mobileBtn?.setAttribute("aria-expanded", "false");
    setTimeout(() => {
      if (!mobileDrawer.classList.contains("open")) {
        mobileDrawer.hidden = true;
        mobileOverlay.hidden = true;
      }
    }, 250);
  }

  mobileBtn?.addEventListener("click", () => {
    mobileDrawer?.classList.contains("open") ? closeDrawer() : openDrawer();
  });
  mobileOverlay?.addEventListener("click", closeDrawer);
  mobileDrawer?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeDrawer);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  /* ---------- Scroll: nav, back-top, active section ---------- */
  const sections = ["home", "services", "projects", "process", "faq", "about", "contact"];
  const isHome = !!document.getElementById("projects"); // false on project pages
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-drawer a[data-section]");

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    nav?.classList.toggle("scrolled", y > 24);
    backTop?.classList.toggle("visible", y > 300);

    if (!navLinks.length || !isHome) return; // project pages keep their static "Projects" highlight
    let current = "home";
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 120) current = id;
    }
    navLinks.forEach((a) => {
      const sec = a.getAttribute("data-section") || (a.getAttribute("href") || "").replace(/^.*#/, "");
      a.classList.toggle("active", sec === current);
    });
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
  onScroll();

  document.getElementById("to-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Project filter + search ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  const searchInput = document.getElementById("project-search");
  const noResults = document.getElementById("no-results");
  let activeFilter = "all";

  function applyFilters() {
    const q = (searchInput?.value || "").trim().toLowerCase();
    let shown = 0;
    cards.forEach((card) => {
      const okCat = activeFilter === "all" || (card.dataset.category || "").split(" ").includes(activeFilter);
      const okQ = !q || (card.dataset.search || "").includes(q);
      const show = okCat && okQ;
      card.classList.toggle("hidden", !show);
      if (show) shown++;
    });
    if (noResults) noResults.hidden = shown > 0;
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter || "all";
      applyFilters();
    });
  });
  searchInput?.addEventListener("input", applyFilters);

  /* ---------- Remember position when opening a project ---------- */
  const grid = document.getElementById("projects-grid");
  function saveState() {
    try {
      sessionStorage.setItem("pf:state", JSON.stringify({
        y: window.scrollY,
        filter: activeFilter,
        q: searchInput?.value || "",
      }));
    } catch (e) {}
  }
  grid?.addEventListener("click", (e) => {
    if (e.target.closest("a.project-card")) saveState();
  });

  // Coming back via "← All projects": restore filter, search and exact scroll spot
  (function restoreState() {
    if (!grid) return;
    let st = null, back = false;
    try {
      back = sessionStorage.getItem("pf:return") === "1";
      st = JSON.parse(sessionStorage.getItem("pf:state") || "null");
      sessionStorage.removeItem("pf:return");
    } catch (e) {}
    if (!back || !st) return;

    if (st.filter && st.filter !== "all") {
      const btn = [...filterBtns].find((b) => b.dataset.filter === st.filter);
      if (btn) {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = st.filter;
      }
    }
    if (searchInput && st.q) searchInput.value = st.q;
    applyFilters();
    // reveal everything above/at the target so nothing is left invisible
    cards.forEach((c) => c.classList.add("visible"));

    const go = () => window.scrollTo({ top: st.y, behavior: "auto" });
    go();
    requestAnimationFrame(go);
    window.addEventListener("load", go, { once: true });
  })();

  /* ---------- Video ---------- */
  const video = document.getElementById("hero-video");
  const playBtn = document.getElementById("video-play");
  const muteBtn = document.getElementById("video-mute");

  const svg = (d) => '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const ICON_PLAY = svg('<path d="M7 4l13 8-13 8z" fill="currentColor"/>');
  const ICON_PAUSE = svg('<path d="M8 5v14M16 5v14"/>');
  const ICON_MUTED = svg('<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/>');
  const ICON_SOUND = svg('<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13"/>');

  if (video) {
    playBtn && (playBtn.innerHTML = ICON_PLAY);
    muteBtn && (muteBtn.innerHTML = ICON_MUTED);
    function syncPlayUI() {
      if (!playBtn) return;
      playBtn.innerHTML = video.paused ? ICON_PLAY : ICON_PAUSE;
      playBtn.setAttribute("aria-label", video.paused ? "Play" : "Pause");
    }

    playBtn?.addEventListener("click", () => {
      if (video.paused) video.play().catch(() => {});
      else video.pause();
      syncPlayUI();
    });

    muteBtn?.addEventListener("click", () => {
      video.muted = !video.muted;
      muteBtn.innerHTML = video.muted ? ICON_MUTED : ICON_SOUND;
      muteBtn.setAttribute("aria-label", video.muted ? "Unmute" : "Mute");
    });

    video.addEventListener("play", syncPlayUI);
    video.addEventListener("pause", syncPlayUI);

    // Only autoplay where it is welcome: not on phones, not with reduced motion or data saver
    const conn = navigator.connection || {};
    const canAutoplay =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !window.matchMedia("(max-width: 767px)").matches &&
      !conn.saveData;

    if (canAutoplay && "IntersectionObserver" in window) {
      const videoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) video.play().catch(() => {});
            else video.pause();
            syncPlayUI();
          });
        },
        { threshold: 0.35 }
      );
      videoObserver.observe(video);
    }
  }

  /* ---------- Map: load only when asked ---------- */
  const mapWrap = document.getElementById("map-wrap");
  const mapLoad = document.getElementById("map-load");
  mapLoad?.addEventListener("click", () => {
    if (!mapWrap) return;
    const iframe = document.createElement("iframe");
    iframe.src = mapWrap.dataset.src || "";
    iframe.title = "Map — " + (mapWrap.dataset.title || "Dhaka, Bangladesh");
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.setAttribute("allowfullscreen", "");
    mapWrap.insertBefore(iframe, mapLoad);
    mapLoad.remove();
  });

  /* ---------- "Get a quote" from a project page: prefill the form ---------- */
  (function prefillFromProject() {
    const params = new URLSearchParams(window.location.search);
    const proj = (params.get("project") || "").trim().slice(0, 120);
    if (!proj) return;
    const msg = document.getElementById("message");
    if (msg && !msg.value) msg.value = "I'm interested in a project similar to: " + proj + "\n\n";
    const subject = document.querySelector('#contact-form input[name="subject"]');
    if (subject) subject.value = "Project review request (similar to " + proj + ") — Badsha Portfolio";
  })();

  /* ---------- Before / after slider ---------- */
  const compare = document.getElementById("compare");
  const compareRange = compare?.querySelector(".compare-range");
  compareRange?.addEventListener("input", () => {
    compare.style.setProperty("--pos", compareRange.value + "%");
  });

  /* ---------- Mobile WhatsApp button: step aside on the contact section ---------- */
  const waFab = document.getElementById("wa-fab");
  const contactSection = document.getElementById("contact");
  if (waFab && contactSection && "IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => entries.forEach((e) => waFab.classList.toggle("is-hidden", e.isIntersecting)),
      { threshold: 0.25 }
    ).observe(contactSection);
  }

  /* ---------- Contact form (Web3Forms) ---------- */
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const formSubmit = document.getElementById("form-submit");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!formStatus || !formSubmit) return;

    formSubmit.disabled = true;
    formSubmit.textContent = "Sending…";
    formStatus.hidden = false;
    formStatus.textContent = "";
    formStatus.className = "form-status";

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || res.status === 200)) {
        formStatus.textContent = "Thanks — message sent. I’ll reply soon.";
        formStatus.classList.add("ok");
        form.reset();
      } else {
        throw new Error(json.message || "Send failed");
      }
    } catch (err) {
      formStatus.textContent = "Could not send. Please use WhatsApp or LinkedIn instead.";
      formStatus.classList.add("err");
    } finally {
      formSubmit.disabled = false;
      formSubmit.textContent = "Send request";
    }
  });

  /* ---------- Responsive ---------- */
  function handleResize() {
    if (window.innerWidth >= 1024) closeDrawer();
  }
  window.addEventListener("resize", handleResize, { passive: true });
})();
