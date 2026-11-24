import { animate } from "motion";

const DEFAULT_GRADIENT =
  "linear-gradient(120deg, #312e81 0%, #6d28d9 24%, #be185d 48%, #c2410c 72%, #0f766e 100%)";

export function createGradient(root, options = {}) {
  const {
    content = "",
    speed = 1,
    paused = false,
    gradient = DEFAULT_GRADIENT,
    className = "",
  } = options;
  let inView = false;
  let pageVisible = true;
  let reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const controls = [];
  let observer;

  root.innerHTML = `
    <div data-slot="gradient-background" class="relative size-full overflow-hidden bg-[#0a0910] ${className}">
      <div data-sheet aria-hidden="true" class="absolute -inset-[35%] opacity-90 blur-[10px]"
        style="background-image:${gradient};background-size:400% 400%;will-change:background-position"></div>
      <div data-glow-one aria-hidden="true" class="absolute left-[8%] top-[4%] size-[70%] rounded-full opacity-70 blur-[60px]"
        style="background:radial-gradient(circle, rgba(45,212,191,0.75), transparent 68%);will-change:transform"></div>
      <div data-glow-two aria-hidden="true" class="absolute bottom-[2%] right-[2%] size-[74%] rounded-full opacity-70 blur-[70px]"
        style="background:radial-gradient(circle, rgba(249,115,22,0.72), transparent 66%);will-change:transform"></div>
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(5,4,10,0.6))]"></div>
      ${content}
    </div>`;
  const host = root.querySelector("[data-slot]");
  const sheet = root.querySelector("[data-sheet]");
  const glowOne = root.querySelector("[data-glow-one]");
  const glowTwo = root.querySelector("[data-glow-two]");

  function duration() {
    return 16 / Math.max(0.1, speed);
  }

  function playing() {
    return inView && pageVisible && !reduce && !paused;
  }

  function stopControls() {
    while (controls.length) controls.pop()?.stop?.();
  }

  function start() {
    stopControls();
    if (!playing()) {
      controls.push(
        animate(
          sheet,
          { backgroundPosition: reduce ? "35% 50%" : "0% 50%" },
          { duration: 0 },
        ),
      );
      controls.push(animate(glowOne, { x: "-12%", y: "-8%" }, { duration: 0 }));
      controls.push(animate(glowTwo, { x: "10%", y: "12%" }, { duration: 0 }));
      return;
    }
    const span = duration();
    controls.push(
      animate(
        sheet,
        { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] },
        { duration: span, ease: "easeInOut", repeat: Infinity },
      ),
    );
    controls.push(
      animate(
        glowOne,
        { x: ["-12%", "14%", "-12%"], y: ["-8%", "10%", "-8%"], scale: [1, 1.25, 1] },
        { duration: span * 1.6, ease: "easeInOut", repeat: Infinity },
      ),
    );
    controls.push(
      animate(
        glowTwo,
        { x: ["10%", "-16%", "10%"], y: ["12%", "-10%", "12%"], scale: [1.1, 0.9, 1.1] },
        { duration: span * 2.1, ease: "easeInOut", repeat: Infinity },
      ),
    );
  }

  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMedia = () => {
    reduce = media.matches;
    start();
  };
  media.addEventListener?.("change", onMedia);
  pageVisible = document.visibilityState !== "hidden";
  const onVisibility = () => {
    pageVisible = document.visibilityState !== "hidden";
    start();
  };
  document.addEventListener("visibilitychange", onVisibility);
  observer = new IntersectionObserver(
    (entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
      start();
    },
    { threshold: 0 },
  );
  observer.observe(host);
  start();

  return {
    element: host,
    destroy() {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener?.("change", onMedia);
      stopControls();
      root.innerHTML = "";
    },
  };
}
