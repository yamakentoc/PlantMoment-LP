(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-solid", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const revealTargets = document.querySelectorAll(".section-head, .hero-text, .hero-media, .howto-body, .templates li, .story-grid, .days, .care-grid, .more, .pricing, .cta");
  revealTargets.forEach((el) => el.classList.add("reveal"));
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); revealer.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  revealTargets.forEach((el) => revealer.observe(el));

  // 画面内にある間だけ再生する。視差効果を減らす設定ではヒーロー動画を自動再生しない。
  const hero = document.querySelector(".hero-video");
  const howto = document.getElementById("howto-video");
  if (reduce) { hero.removeAttribute("autoplay"); hero.pause(); }
  const player = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting && !(reduce && v === hero)) v.play().catch(() => {});
      else v.pause();
    });
  }, { threshold: 0.4 });
  [hero, howto].forEach((v) => player.observe(v));

  // ヒーロー動画の再生位置に合わせて、中央のDAYとひとこと、左下の日付、サムネイルの進み具合を切り替える。
  const clips = [...document.querySelectorAll("#film-thumbs li")];
  const day = document.getElementById("film-day");
  const note = document.getElementById("film-note");
  const date = document.getElementById("film-date");
  let current = -1;
  const syncFilm = () => {
    const t = hero.currentTime;
    const i = Math.max(0, clips.findLastIndex((li) => t >= +li.dataset.from));
    const li = clips[i];
    if (i !== current) {
      current = i;
      clips.forEach((c, k) => c.classList.toggle("is-active", k === i));
      day.textContent = `DAY ${li.dataset.day}`;
      note.textContent = li.dataset.note;
      date.textContent = li.dataset.date;
    }
    const p = (t - li.dataset.from) / (li.dataset.to - li.dataset.from);
    li.querySelector(".bar i").style.width = `${Math.min(Math.max(p, 0), 1) * 100}%`;
  };
  const tick = () => { syncFilm(); if (!hero.paused) requestAnimationFrame(tick); };
  hero.addEventListener("play", () => requestAnimationFrame(tick));
  hero.addEventListener("seeked", syncFilm);
  syncFilm();

  // 操作動画の再生位置に合わせてステップを強調し、ステップのクリックでその位置へ移動する。
  const steps = [...document.querySelectorAll("#steps li")];
  const setActive = (t) => steps.forEach((li) => {
    li.classList.toggle("is-active", t >= +li.dataset.from && t < +li.dataset.to);
  });
  howto.addEventListener("timeupdate", () => setActive(howto.currentTime));
  howto.addEventListener("ended", () => {
    setTimeout(() => { howto.currentTime = 0; howto.play().catch(() => {}); }, 1500);
  });
  steps.forEach((li) => li.querySelector("button").addEventListener("click", () => {
    howto.currentTime = +li.dataset.from;
    setActive(howto.currentTime);
    howto.play().catch(() => {});
  }));
  setActive(0);
})();
