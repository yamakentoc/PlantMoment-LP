(() => {
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const progressOf = (el) => {
    const r = el.getBoundingClientRect();
    return clamp(-r.top / (r.height - innerHeight));
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal, .reveal-scale").forEach((el) => io.observe(el));

  const statement = document.querySelector("[data-word-reveal]");
  const chars = [...statement.textContent].map((c) => {
    const s = document.createElement("span");
    s.textContent = c;
    return s;
  });
  statement.replaceChildren(...chars);

  const counters = document.querySelectorAll("[data-count]");
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, to = +el.dataset.count, start = performance.now();
      const tick = (t) => {
        const p = clamp((t - start) / 1600);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => countIO.observe(el));

  const nav = document.getElementById("nav");
  const darkSections = [...document.querySelectorAll(".dark, .days")];
  const heroDevice = document.querySelector("[data-hero-device]");
  const heroTitle = document.querySelector("[data-hero-title]");
  const parallax = [...document.querySelectorAll("[data-parallax]")];
  const days = document.querySelector("[data-days]");
  const dayFrames = [...days.querySelectorAll(".days-frames img")];
  const dayCaps = [...days.querySelectorAll(".days-captions p")];
  const dayNumber = days.querySelector("[data-day-number]");
  const dayBar = days.querySelector("[data-days-bar]");
  const dayStops = [1, 10, 30, 50, 100];
  const care = document.querySelector("[data-care]");
  const careSteps = [...care.querySelectorAll(".care-step")];
  const careImgs = [...care.querySelector(".care-phone").children];
  const photo = document.querySelector("[data-photo]");
  const photoFrame = photo.querySelector("[data-photo-frame]");
  const photoCopy = photo.querySelector("[data-photo-copy]");
  const photoOverlay = photo.querySelector(".photo-overlay");
  const ctaBg = document.querySelector("[data-parallax-bg]");

  let lastCare = -1;
  const vidIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const v = e.target;
      if (v.closest(".care-phone")) return;
      if (e.isIntersecting) v.play().catch(() => {}); else v.pause();
    });
  }, { threshold: 0.25 });
  document.querySelectorAll("video").forEach((v) => vidIO.observe(v));

  const setActive = (list, i) => list.forEach((el, j) => el.classList.toggle("is-active", i === j));

  const update = () => {
    const vh = innerHeight;

    const navY = 26;
    nav.classList.toggle("is-dark", darkSections.some((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= navY && r.bottom >= navY;
    }));

    if (!reduced) {
      const y = scrollY;
      const hp = clamp(y / vh);
      heroDevice.style.transform = `translateY(${lerp(0, -80, hp)}px) scale(${lerp(1, 1.08, hp)})`;
      heroTitle.style.transform = `translateY(${y * 0.25}px)`;
      heroTitle.style.opacity = 1 - clamp(y / (vh * 0.7));
      parallax.forEach((el) => { el.style.transform = `translateY(${y * +el.dataset.parallax}px)`; });
    }

    const sr = statement.getBoundingClientRect();
    const sp = clamp((vh * 0.85 - sr.top) / (sr.height + vh * 0.35));
    const lit = Math.floor(sp * chars.length);
    chars.forEach((c, i) => c.classList.toggle("on", i < lit));

    const dp = progressOf(days);
    const seg = dp * (dayStops.length - 1);
    const idx = Math.min(dayStops.length - 1, Math.round(seg));
    setActive(dayFrames, idx);
    setActive(dayCaps, idx);
    const lo = Math.floor(seg), hi = Math.min(dayStops.length - 1, lo + 1);
    dayNumber.textContent = Math.round(lerp(dayStops[lo], dayStops[hi], seg - lo));
    dayBar.style.transform = `scaleX(${dp})`;

    let careIdx = 0;
    careSteps.forEach((s, i) => { if (s.getBoundingClientRect().top < vh * 0.55) careIdx = i; });
    setActive(careSteps, careIdx);
    if (careIdx !== lastCare) {
      setActive(careImgs, careIdx);
      careImgs.forEach((el, i) => {
        const v = el.querySelector("video");
        if (!v) return;
        if (i === careIdx) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause();
      });
      lastCare = careIdx;
    }

    const pp = clamp(progressOf(photo) * 1.4);
    const wide = innerWidth > 860;
    const e = 1 - Math.pow(1 - pp, 3);
    if (wide) {
      const w = lerp(innerWidth, Math.min(460, innerWidth * 0.38), e);
      const h = lerp(vh, Math.min(575, vh * 0.72), e);
      const shift = lerp(0, Math.min(280, innerWidth * 0.22), e);
      photoFrame.style.width = `${w}px`;
      photoFrame.style.height = `${h}px`;
      photoFrame.style.transform = `translateX(${shift}px)`;
      photoFrame.style.borderRadius = `${lerp(0, 32, e)}px`;
      photoFrame.style.boxShadow = `0 40px 80px rgba(30,50,35,${0.25 * e})`;
      photoOverlay.style.opacity = "";
      photoCopy.style.opacity = clamp((pp - 0.55) / 0.35);
      photoCopy.style.transform = `translateY(calc(-50% + ${lerp(40, 0, clamp((pp - 0.55) / 0.35))}px))`;
    } else {
      photoFrame.style.cssText = "";
      const cp = clamp((pp - 0.3) / 0.4);
      photoCopy.style.opacity = cp;
      photoCopy.style.transform = "";
      photoOverlay.style.opacity = 1 - cp;
    }

    if (ctaBg && !reduced) {
      const r = ctaBg.parentElement.getBoundingClientRect();
      ctaBg.style.transform = `translateY(${(r.top / vh) * -60}px) scale(1.05)`;
    }
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  update();
})();
