import { animate } from "motion";

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const avatarSpring = { type: "spring", stiffness: 300, damping: 17 };
const popSpring = { type: "spring", stiffness: 400, damping: 29 };

const fallbackAvatars = [
  { name: "Mina", color: "from-rose-300 to-orange-200" },
  { name: "Theo", color: "from-sky-300 to-indigo-200" },
  { name: "Iris", color: "from-emerald-300 to-lime-200" },
  { name: "Noé", color: "from-amber-300 to-pink-200" },
];

export function createAvatarGroup(root, options = {}) {
  const {
    avatars = fallbackAvatars,
    invertOverlap = false,
    tooltipSideOffset = 8,
    className = "",
  } = options;
  let hovered = null;
  let tipVisible = false;
  let liftControls = [];
  let tipControl;

  root.innerHTML = `
    <div data-slot="avatar-group" class="relative inline-flex items-end ${className}">
      <div class="flex -space-x-3">
        ${avatars
          .map(
            (avatar, index) => `
          <span data-avatar role="img" aria-label="${avatar.name}" tabindex="0"
            style="z-index:${invertOverlap ? 20 - index : index}"
            class="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-gradient-to-br text-[13px] font-medium text-black/70 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${avatar.color || "from-rose-300 to-orange-200"}">
            ${
              avatar.src
                ? `<img src="${avatar.src}" alt="" class="size-full object-cover" />`
                : avatar.name.slice(0, 1)
            }
          </span>`,
          )
          .join("")}
      </div>
      <span data-tip role="tooltip"
        style="left:0;bottom:calc(100% + ${tooltipSideOffset}px);translate:-50% 0;opacity:0;display:none"
        class="pointer-events-none absolute z-30 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[13px] font-medium text-primary-foreground shadow-md"></span>
    </div>`;

  const host = root.querySelector("[data-slot]");
  const tip = root.querySelector("[data-tip]");
  const nodes = Array.from(host.querySelectorAll("[data-avatar]"));

  function lift() {
    liftControls.forEach((control) => control.stop?.());
    liftControls = [];
    nodes.forEach((node, index) => {
      const up = hovered === index;
      liftControls.push(
        animate(
          node,
          { y: up ? "-30%" : "0%" },
          reduce() ? { duration: 0 } : avatarSpring,
        ),
      );
    });
  }

  function position(node) {
    const groupRect = host.getBoundingClientRect();
    const rect = node.getBoundingClientRect();
    tip.style.left = `${rect.left - groupRect.left + rect.width / 2}px`;
  }

  function showTip(name) {
    tip.textContent = name;
    tip.style.bottom = `calc(100% + ${tooltipSideOffset}px)`;
    if (tipVisible) {
      if (!reduce()) {
        tipControl?.stop?.();
        tipControl = animate(tip, { opacity: 1, scale: 1 }, { duration: 0.12 });
      }
      return;
    }
    tipVisible = true;
    tip.style.display = "block";
    tipControl?.stop?.();
    if (reduce()) {
      tip.style.opacity = "1";
      return;
    }
    tipControl = animate(
      tip,
      { opacity: [0, 1], scale: [0.9, 1], filter: ["blur(4px)", "blur(0px)"] },
      popSpring,
    );
  }

  function hideTip() {
    if (!tip) return;
    tipControl?.stop?.();
    if (reduce()) {
      tipVisible = false;
      tip.style.display = "none";
      return;
    }
    tipControl = animate(tip, { opacity: 0, scale: 0.95 }, { duration: 0.12 });
    tipControl.finished.then(() => {
      if (hovered === null) {
        tipVisible = false;
        tip.style.display = "none";
      }
    });
  }

  const listeners = nodes.map((node, index) => {
    const enter = () => {
      position(node);
      if (hovered !== index) {
        hovered = index;
        lift();
      }
      showTip(avatars[index]?.name ?? "");
    };
    node.addEventListener("pointerenter", enter);
    node.addEventListener("focus", enter);
    return { node, enter };
  });

  function leaveGroup() {
    hovered = null;
    lift();
    hideTip();
  }

  host.addEventListener("pointerleave", leaveGroup);

  return {
    element: host,
    destroy() {
      liftControls.forEach((control) => control.stop?.());
      tipControl?.stop?.();
      listeners.forEach(({ node, enter }) => {
        node.removeEventListener("pointerenter", enter);
        node.removeEventListener("focus", enter);
      });
      host.removeEventListener("pointerleave", leaveGroup);
      root.innerHTML = "";
    },
  };
}
