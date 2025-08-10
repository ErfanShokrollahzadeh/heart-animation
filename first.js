// Global playful click-to-open animation for gift boxes
(function () {
  const NAV_DELAY = 1100; // ms
  const CONFETTI_COUNT = 26;
  let busy = false;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makeConfetti(x, y) {
    const overlay = ensureOverlay();
    const colors = [
      "#ff6e7f",
      "#ffd83d",
      "#7afcff",
      "#b983ff",
      "#6effa0",
      "#ff9ecd",
    ];
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const p = document.createElement("div");
      p.className = "confetti-piece";
      const color = colors[i % colors.length];
      p.style.background = color;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      // trajectory
      const angle = rand(0, Math.PI * 2);
      const dist = rand(120, 260);
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - rand(30, 80); // pop upward a bit
      const rot = rand(-540, 540);
      p.style.setProperty("--dx", `${dx}px`);
      p.style.setProperty("--dy", `${dy}px`);
      p.style.setProperty("--rot", `${rot}deg`);
      p.style.animation = `confetti-burst ${rand(
        600,
        1000
      )}ms cubic-bezier(.11,.75,.3,1) forwards`;
      overlay.appendChild(p);
      setTimeout(() => p.remove(), 1100);
    }
  }

  function ensureOverlay() {
    let overlay = document.querySelector(".box-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "box-overlay";
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function showMiniBox(x, y) {
    const overlay = ensureOverlay();
    const box = document.createElement("div");
    box.className = "mini-box laugh-wiggle";
    // set start near the gift click
    box.style.left = `${x}px`;
    box.style.top = `${y}px`;
    overlay.appendChild(box);
    setTimeout(() => box.remove(), 1200);
  }

  function say(text, x, y) {
    const overlay = ensureOverlay();
    const bubble = document.createElement("div");
    bubble.className = "speech-pop";
    bubble.textContent = text;
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
    overlay.appendChild(bubble);
    setTimeout(() => bubble.remove(), 900);
  }

  function findGiftImageLink(el) {
    // finds nearest <a> with an <img src="images/1f381.png">
    let node = el;
    while (node && node !== document.body) {
      if (node.tagName === "A" && node.querySelector('img[src*="1f381"]')) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  function onClick(e) {
    const a = findGiftImageLink(e.target);
    if (!a || busy) return;
    e.preventDefault();
    busy = true;

    const img = a.querySelector("img");
    const rect = img.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    showMiniBox(cx, cy);
    makeConfetti(cx, cy);
    const giggles = [
      "هه هه 😜",
      "بوو! 🎁",
      "نه بازم جعبه! 🤭",
      "های! 😆",
      "جا خوردی؟ 🙃",
    ];
    say(giggles[Math.floor(Math.random() * giggles.length)], cx, cy - 10);

    const href = a.getAttribute("href");
    setTimeout(() => {
      window.location.href = href;
      // fallback reset if navigation blocked
      setTimeout(() => {
        busy = false;
      }, 1500);
    }, NAV_DELAY);
  }

  window.addEventListener("click", onClick, { passive: false });
})();
