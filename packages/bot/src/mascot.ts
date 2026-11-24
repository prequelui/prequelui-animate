import type { MascotState, Position } from "./types";
import { writePosition } from "./config";

const INK = "#0b0b0f";
const RING = "#0d0d10";
const GRAY = "#8e8e93";
const EASE_OUT = "cubic-bezier(.23,1,.32,1)";
const SPHERE_R = 0.5;
const EYE_ANGLE = (20 * Math.PI) / 180;
const ARCH_STROKE = 0.07;
const ARCH_OPEN = 0.06;

const LOOK_TARGETS = [
  { x: 0.19, y: -0.25 },
  { x: -0.17, y: -0.13 },
  { x: 0.17, y: 0.07 },
  { x: -0.16, y: 0.05 },
];

type Step = { state: MascotState; ms: number; blink?: boolean; look?: { x: number; y: number } };

const AUTO_SEQUENCE: Step[] = [
  { state: "dots", ms: 300 },
  { state: "think", ms: 720 },
  { state: "pills", ms: 1000, blink: true },
  { state: "tilt", ms: 240 },
  { state: "wink", ms: 200 },
  { state: "pills", ms: 420 },
  { state: "happy", ms: 300 },
  { state: "look", ms: 2900, look: { x: 0.19, y: -0.25 } },
  { state: "dots", ms: 560 },
  { state: "think", ms: 700 },
  { state: "pills", ms: 950, blink: true },
  { state: "tilt", ms: 240 },
  { state: "wink", ms: 200 },
  { state: "pills", ms: 380 },
  { state: "happy", ms: 300 },
  { state: "look", ms: 2500, look: { x: -0.16, y: 0.05 } },
];

const REDUCED_SEQUENCE: Step[] = [
  { state: "dots", ms: 5600 },
  { state: "pills", ms: 4600 },
  { state: "happy", ms: 3600 },
  { state: "dots", ms: 4400 },
];

type EyeTarget = {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  holeW: number;
  holeH: number;
  holeX: number;
  holeY: number;
  arch: boolean;
};

type FaceTarget = {
  gazeX: number;
  gazeY: number;
  roll: number;
  w: number;
  h: number;
  hole: number;
  spread: number;
  headX: number;
  headY: number;
  sx: number;
  sy: number;
};

export type MascotOptions = {
  size: number;
  label: string | null;
  showLabel: boolean;
  position: Position;
  reduced: boolean;
  draggable?: boolean;
  onActivate: () => void;
  onHelp: () => void;
  onStateChange?: (state: MascotState) => void;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function jitter(ms: number): number {
  return Math.round(ms * (0.8 + Math.random() * 0.4));
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  style?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (style) node.style.cssText = style;
  return node;
}

function rollForGaze(gazeX: number, gazeY: number): number {
  const yaw = Math.asin(clamp(gazeX / SPHERE_R, -0.9, 0.9));
  const upness = clamp(-gazeY / 0.22, 0, 1);
  return -((yaw * 180) / Math.PI) * upness;
}

function faceFor(state: MascotState, look: { x: number; y: number }, D: number): FaceTarget {
  const gazeX = look.x / D;
  const gazeY = look.y / D;
  const upness = clamp(-gazeY / 0.22, 0, 1);
  const roll = rollForGaze(gazeX, gazeY);

  switch (state) {
    case "tilt":
      return {
        gazeX: -0.13,
        gazeY: -0.105,
        roll: rollForGaze(-0.13, -0.105),
        w: 0.223,
        h: 0.432,
        hole: 0,
        spread: 1,
        headX: -0.042,
        headY: -0.058,
        sx: 1.02,
        sy: 0.99,
      };
    case "blink":
      return {
        gazeX: -0.144,
        gazeY: -0.136,
        roll: rollForGaze(-0.144, -0.136),
        w: 0.212,
        h: 0.112,
        hole: 0,
        spread: 1.03,
        headX: -0.043,
        headY: -0.061,
        sx: 1.02,
        sy: 0.99,
      };
    case "happy":
      return {
        gazeX: -0.015,
        gazeY: -0.05,
        roll: 0,
        w: 0.23,
        h: 0.16,
        hole: 1,
        spread: 0.9,
        headX: 0,
        headY: 0.075,
        sx: 1.045,
        sy: 0.965,
      };
    case "wink":
      return {
        gazeX: 0,
        gazeY: 0,
        roll: 0,
        w: 0.12,
        h: 0.12,
        hole: 0,
        spread: 1,
        headX: 0,
        headY: 0,
        sx: 1.01,
        sy: 0.995,
      };
    case "look":
      return {
        gazeX: gazeX - 0.005,
        gazeY,
        roll: roll + (gazeY > 0.02 ? -2 : 0),
        w: 0.115 + 0.07 * upness,
        h: 0.278 - 0.04 * upness,
        hole: 0,
        spread: 0.97,
        headX: gazeX * 0.32,
        headY: gazeY * 0.45,
        sx: 1.008,
        sy: 0.996,
      };
    case "dots":
      return {
        gazeX: 0,
        gazeY: 0,
        roll: 0,
        w: 0.218,
        h: 0.218,
        hole: 0,
        spread: 1.04,
        headX: 0,
        headY: 0,
        sx: 1,
        sy: 1,
      };
    case "think":
    case "pills":
    default:
      return {
        gazeX: 0,
        gazeY: 0,
        roll: 0,
        w: 0.207,
        h: 0.424,
        hole: 0,
        spread: 0.97,
        headX: 0,
        headY: 0,
        sx: 1,
        sy: 1,
      };
  }
}

function projectFace(face: FaceTarget): EyeTarget[] {
  const yaw = Math.asin(clamp(face.gazeX / SPHERE_R, -0.9, 0.9));
  const yawDeg = (yaw * 180) / Math.PI;
  const rollRad = (face.roll * Math.PI) / 180;
  const centroid = SPHERE_R * Math.sin(yaw);

  return ([-1, 1] as const).map((side) => {
    const theta = EYE_ANGLE * face.spread * side + yaw;
    const depth = clamp(Math.cos(theta), 0, 1);
    const persp = 0.7 + 0.3 * depth;
    const base = SPHERE_R * Math.sin(theta);
    const dx = base - centroid;
    const x = centroid + dx * Math.cos(rollRad);
    const y = dx * Math.sin(rollRad) + face.gazeY;
    return {
      x,
      y,
      w: Math.max(0.02, face.w * persp),
      h: Math.max(0.02, face.h * (0.86 + 0.14 * depth)),
      rot: face.roll * 1.25 - yawDeg * 0.1,
      holeW: face.hole * Math.max(0, face.w * persp - ARCH_STROKE * 2),
      holeH: face.hole * Math.max(0, face.h * (0.86 + 0.14 * depth) - ARCH_STROKE + ARCH_OPEN),
      holeX: 0,
      holeY: (ARCH_STROKE + ARCH_OPEN) / 2,
      arch: false,
    };
  });
}

function eyesFor(face: FaceTarget, state: MascotState): EyeTarget[] {
  let projected = projectFace(face);
  if (state === "happy") {
    return projected.map((eye, index) => ({
      ...eye,
      x: index === 0 ? -0.17 : 0.14,
      y: -0.05,
      w: 0.23,
      h: 0.16,
      rot: 0,
      holeW: 0,
      holeH: 0,
      arch: true,
    }));
  }
  if (state === "look") {
    const up = clamp((-face.gazeY - 0.15) / 0.06, 0, 1);
    const right = clamp((face.gazeX - 0.11) / 0.05, 0, 1);
    const strength = up * right;
    if (strength > 0) {
      const goals = [
        { x: 0.04, y: -0.19, w: 0.1, h: 0.22, rot: -30 },
        { x: 0.27, y: -0.28, w: 0.09, h: 0.2, rot: -32 },
      ] as const;
      projected = projected.map((eye, index) => {
        const goal = goals[index]!;
        return {
          ...eye,
          x: eye.x + (goal.x - eye.x) * strength,
          y: eye.y + (goal.y - eye.y) * strength,
          w: eye.w + (goal.w - eye.w) * strength,
          h: eye.h + (goal.h - eye.h) * strength,
          rot: eye.rot + (goal.rot - eye.rot) * strength,
        };
      });
    }
  }
  if (state === "wink") {
    return projected.map((eye, index) =>
      index === 1
        ? { ...eye, w: 0.118, h: 0.118 }
        : { ...eye, w: 0.17, h: 0.05 },
    );
  }
  if (state === "tilt") {
    return projected.map((eye, index) => (index === 0 ? { ...eye, w: eye.w * 0.84 } : eye));
  }
  if (state === "blink") {
    return projected.map((eye, index) =>
      index === 0 ? { ...eye, w: eye.w * 0.8, rot: eye.rot * 0.3 } : eye,
    );
  }
  return projected;
}

export class Mascot {
  readonly dock: HTMLDivElement;
  readonly element: HTMLDivElement;
  private options: MascotOptions;
  private D: number;
  private halo: HTMLDivElement;
  private ring: HTMLDivElement;
  private stage: HTMLDivElement;
  private head: HTMLDivElement;
  private headInner: HTMLDivElement;
  private whiteDot: HTMLDivElement;
  private labelEl: HTMLSpanElement | null = null;
  private eyes: {
    wrap: HTMLDivElement;
    ink: HTMLDivElement;
    hole: HTMLDivElement;
    arch: SVGSVGElement;
    path: SVGPathElement;
  }[] = [];
  private grayDots: HTMLDivElement[] = [];
  private explicit: MascotState | null = null;
  private autoState: MascotState = "dots";
  private autoLook = { x: 0.175, y: 0.062 };
  private hovered = false;
  private focused = false;
  private pointerLook: { x: number; y: number } | null = null;
  private propLook: { x: number; y: number } | null = null;
  private saccade = { x: 0, y: 0 };
  private reduced: boolean;
  private hidden = false;
  private destroyed = false;
  private seqIndex = 0;
  private timer = 0;
  private blinkTimer = 0;
  private saccadeTimer = 0;
  private idleTimer = 0;
  private frame = 0;
  private clickTimers: number[] = [];
  private clickTimer = 0;
  private longPressTimer = 0;
  private dragCandidate = false;
  private dragging = false;
  private dragStart = { x: 0, y: 0, left: 0, top: 0 };
  private suppressClick = false;
  private headAnimation: Animation | null = null;
  private pulseAnimation: Animation | null = null;
  private detach: (() => void)[] = [];

  constructor(options: MascotOptions) {
    this.options = options;
    this.D = Math.max(12, options.size);
    this.reduced = options.reduced;

    this.dock = el("div", "pb-dock");
    this.dock.dataset.corner = options.position;
    this.element = el("div", "pb-mascot");
    this.element.setAttribute("role", "button");
    this.element.setAttribute("tabindex", "0");
    this.element.setAttribute("aria-label", "Prequel Bot. Press Enter to choose an element.");
    this.element.dataset.state = this.autoState;

    const width = this.D * 2.1;
    const labelFont = Math.max(13, this.D * 0.172);
    const labelHeight = labelFont * 1.44;
    const height = options.showLabel && options.label ? this.D * 2.075 + labelHeight : this.D * 2.1;
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;

    this.halo = el(
      "div",
      "pb-halo",
      `width:${this.D * 2.1}px;height:${this.D * 2.1}px;`,
    );
    this.ring = el(
      "div",
      "pb-ring",
      `top:${this.D * 1.05}px;width:${this.D * 1.55}px;height:${this.D * 1.55}px;background:${RING};`,
    );
    this.stage = el("div", "pb-stage", `width:${this.D}px;height:${this.D}px;`);
    this.head = el("div", "pb-head", `width:${this.D}px;height:${this.D}px;`);
    this.headInner = el("div", "pb-head-inner");
    this.whiteDot = el("div", "pb-white-dot", `background:#fff;`);
    this.headInner.appendChild(this.whiteDot);
    this.head.appendChild(this.headInner);
    this.stage.appendChild(this.head);

    for (let index = 0; index < 2; index += 1) {
      const wrap = el("div", "pb-eye", `width:${this.D}px;height:${this.D}px;margin-left:${-this.D / 2}px;margin-top:${-this.D / 2}px;`);
      wrap.dataset.prequelEye = String(index);
      const ink = el("div", "pb-eye-ink", `background:${INK};`);
      const hole = el("div", "pb-eye-hole", "background:#fff;");
      ink.appendChild(hole);
      const svgNS = "http://www.w3.org/2000/svg";
      const arch = document.createElementNS(svgNS, "svg");
      arch.setAttribute("class", "pb-eye-arch");
      arch.setAttribute("fill", "none");
      arch.setAttribute("aria-hidden", "true");
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("stroke", INK);
      path.setAttribute("stroke-linecap", "round");
      arch.appendChild(path);
      wrap.appendChild(ink);
      wrap.appendChild(arch);
      this.head.appendChild(wrap);
      this.eyes.push({ wrap, ink, hole, arch, path });
    }

    for (let index = 0; index < 2; index += 1) {
      const dot = el("div", "pb-think-dot", `width:${this.D * 0.2}px;height:${this.D * 0.2}px;margin-left:${-this.D * 0.1}px;margin-top:${-this.D * 0.1}px;background:${GRAY};`);
      dot.dataset.thinkDot = String(index === 0 ? -1 : 1);
      this.stage.appendChild(dot);
      this.grayDots.push(dot);
    }

    this.ring.appendChild(this.stage);

    if (options.showLabel && options.label) {
      const label = el(
        "span",
        "pb-label",
        `top:${this.D * 2.075}px;height:${labelHeight}px;font-size:${labelFont}px;`,
      );
      label.textContent = options.label;
      this.labelEl = label;
    }

    this.element.appendChild(this.halo);
    this.element.appendChild(this.ring);
    if (this.labelEl) this.element.appendChild(this.labelEl);
    this.dock.appendChild(this.element);
    this.bind();
    this.render();
  }

  private bind() {
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      this.hovered = true;
      this.render();
    };
    const onLeave = () => {
      this.hovered = false;
      this.render();
    };
    const onFocus = () => {
      this.focused = true;
      this.render();
    };
    const onBlur = () => {
      this.focused = false;
      this.render();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        this.activate();
      }
      if (event.key === "?") {
        event.preventDefault();
        this.options.onHelp();
      }
    };
    const onDouble = (event: MouseEvent) => {
      event.preventDefault();
      if (this.clickTimer) {
        window.clearTimeout(this.clickTimer);
        this.clickTimer = 0;
      }
      this.options.onHelp();
    };
    const onClick = (event: MouseEvent) => {
      if (this.suppressClick) {
        this.suppressClick = false;
        return;
      }
      if (event.detail > 1) return;
      if (this.clickTimer) window.clearTimeout(this.clickTimer);
      this.clickTimer = window.setTimeout(() => {
        this.clickTimer = 0;
        this.activate();
      }, 180);
    };

    this.element.addEventListener("pointerenter", onEnter);
    this.element.addEventListener("pointerleave", onLeave);
    this.element.addEventListener("focus", onFocus);
    this.element.addEventListener("blur", onBlur);
    this.element.addEventListener("keydown", onKey);
    this.element.addEventListener("dblclick", onDouble);
    this.element.addEventListener("click", onClick);
    this.element.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("pointercancel", this.onPointerUp);
    document.addEventListener("visibilitychange", this.onVisibility);

    this.detach.push(
      () => this.element.removeEventListener("pointerenter", onEnter),
      () => this.element.removeEventListener("pointerleave", onLeave),
      () => this.element.removeEventListener("focus", onFocus),
      () => this.element.removeEventListener("blur", onBlur),
      () => this.element.removeEventListener("keydown", onKey),
      () => this.element.removeEventListener("dblclick", onDouble),
      () => this.element.removeEventListener("click", onClick),
      () => this.element.removeEventListener("pointerdown", this.onPointerDown),
      () => window.removeEventListener("pointermove", this.onPointerMove),
      () => window.removeEventListener("pointerup", this.onPointerUp),
      () => window.removeEventListener("pointercancel", this.onPointerUp),
      () => document.removeEventListener("visibilitychange", this.onVisibility),
    );
  }

  private onVisibility = () => {
    this.hidden = document.visibilityState === "hidden";
    if (this.hidden) {
      this.clearTimer();
      if (this.headAnimation) this.headAnimation.pause();
    } else {
      this.headAnimation?.play();
      this.scheduleNext(80);
    }
  };

  private onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    if (this.options.draggable === false) return;
    this.dragCandidate = true;
    this.dragging = false;
    this.dragStart = {
      x: event.clientX,
      y: event.clientY,
      left: this.dock.getBoundingClientRect().left,
      top: this.dock.getBoundingClientRect().top,
    };
    try {
      this.element.setPointerCapture(event.pointerId);
    } catch {}
    if (this.longPressTimer) window.clearTimeout(this.longPressTimer);
    this.longPressTimer = window.setTimeout(() => {
      if (event.pointerType === "touch" && !this.dragging) {
        this.suppressClick = true;
        this.activate();
      }
    }, 450);
  };

  private onPointerMove = (event: PointerEvent) => {
    this.trackPointer(event.clientX, event.clientY);
    if (!this.dragCandidate) return;
    const dx = event.clientX - this.dragStart.x;
    const dy = event.clientY - this.dragStart.y;
    if (!this.dragging && Math.hypot(dx, dy) > 6) {
      this.dragging = true;
      if (this.longPressTimer) {
        window.clearTimeout(this.longPressTimer);
        this.longPressTimer = 0;
      }
      this.dock.classList.add("is-dragging");
    }
    if (!this.dragging) return;
    const rect = this.dock.getBoundingClientRect();
    const left = clamp(
      this.dragStart.left + dx,
      8,
      window.innerWidth - rect.width - 8,
    );
    const top = clamp(this.dragStart.top + dy, 8, window.innerHeight - rect.height - 8);
    this.dock.style.left = `${left}px`;
    this.dock.style.top = `${top}px`;
    this.dock.style.right = "auto";
    this.dock.style.bottom = "auto";
  };

  private onPointerUp = () => {
    if (this.longPressTimer) {
      window.clearTimeout(this.longPressTimer);
      this.longPressTimer = 0;
    }
    if (!this.dragCandidate) return;
    this.dragCandidate = false;
    if (this.dragging) {
      this.dragging = false;
      this.dock.classList.remove("is-dragging");
      this.snap();
      this.suppressClick = true;
      window.setTimeout(() => {
        this.suppressClick = false;
      }, 260);
    }
  };

  private snap() {
    const rect = this.dock.getBoundingClientRect();
    const margin = 16;
    const left = rect.left + rect.width / 2 < window.innerWidth / 2 ? margin : window.innerWidth - rect.width - margin;
    const top = rect.top + rect.height / 2 < window.innerHeight / 2 ? margin : window.innerHeight - rect.height - margin;
    this.dock.style.transition = "left 220ms cubic-bezier(.23,1,.32,1), top 220ms cubic-bezier(.23,1,.32,1)";
    this.dock.style.left = `${left}px`;
    this.dock.style.top = `${top}px`;
    this.dock.style.right = "auto";
    this.dock.style.bottom = "auto";
    const corner: Position =
      left < window.innerWidth / 2
        ? top < window.innerHeight / 2
          ? "tl"
          : "bl"
        : top < window.innerHeight / 2
          ? "tr"
          : "br";
    this.dock.dataset.corner = corner;
    writePosition(corner);
    window.setTimeout(() => {
      this.dock.style.transition = "";
    }, 240);
  }

  private trackPointer(clientX: number, clientY: number) {
    if (this.reduced) {
      this.pointerLook = null;
      this.render();
      return;
    }
    if (this.frame) return;
    this.frame = window.requestAnimationFrame(() => {
      this.frame = 0;
      const rect = this.dock.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const distance = Math.hypot(dx, dy);
      if (distance < 1) {
        this.pointerLook = { x: 0, y: 0 };
      } else {
        const strength = clamp(distance / (this.D * 3.4), 0.35, 1);
        const reach = this.D * 0.18 * strength;
        this.pointerLook = { x: (dx / distance) * reach, y: (dy / distance) * reach };
      }
      this.render();
    });
    if (this.idleTimer) window.clearTimeout(this.idleTimer);
    this.idleTimer = window.setTimeout(() => {
      this.pointerLook = null;
      this.render();
    }, 2200);
  }

  activate() {
    this.options.onActivate();
    this.clickSequence();
  }

  private clickSequence() {
    for (const timer of this.clickTimers) window.clearTimeout(timer);
    this.clickTimers = [];
    if (this.reduced) {
      this.flash("happy", 1200);
      return;
    }
    this.explicit = "think";
    this.render();
    this.clickTimers.push(
      window.setTimeout(() => {
        this.explicit = "pills";
        this.render();
      }, 900),
      window.setTimeout(() => {
        this.explicit = "happy";
        this.render();
      }, 1080),
      window.setTimeout(() => {
        this.explicit = null;
        this.render();
      }, 1700),
    );
  }

  setState(state: MascotState | "auto") {
    for (const timer of this.clickTimers) window.clearTimeout(timer);
    this.clickTimers = [];
    if (this.clickTimer) {
      window.clearTimeout(this.clickTimer);
      this.clickTimer = 0;
    }
    if (state === "auto") this.explicit = null;
    else this.explicit = state;
    this.render();
  }

  setLookAt(point: { x: number; y: number } | null) {
    this.propLook = point;
    this.render();
  }

  setReduced(reduced: boolean) {
    if (this.reduced === reduced) return;
    this.reduced = reduced;
    this.clearTimer();
    this.seqIndex = 0;
    this.saccade = { x: 0, y: 0 };
    this.render();
    if (!this.hidden) this.scheduleNext(180);
  }

  setCorner(position: Position) {
    this.dock.dataset.corner = position;
    this.dock.style.left = "";
    this.dock.style.top = "";
    this.dock.style.right = "";
    this.dock.style.bottom = "";
  }

  setAnchor(rect: { left: number; top: number; width: number; height: number } | null) {
    if (!rect) {
      delete this.dock.dataset.anchored;
      this.dock.style.left = "";
      this.dock.style.top = "";
      this.dock.style.right = "";
      this.dock.style.bottom = "";
      return;
    }
    this.dock.dataset.anchored = "true";
    const box = this.dock.getBoundingClientRect();
    const width = box.width || this.element.offsetWidth;
    const height = box.height || this.element.offsetHeight;
    const margin = 16;
    const left = clamp(
      rect.left + rect.width - width - margin,
      Math.max(8, rect.left + margin),
      Math.max(8, window.innerWidth - width - 8),
    );
    const top = clamp(
      rect.top + rect.height - height - margin,
      Math.max(8, rect.top + margin),
      Math.max(8, window.innerHeight - height - 8),
    );
    this.dock.style.left = `${Math.round(left)}px`;
    this.dock.style.top = `${Math.round(top)}px`;
    this.dock.style.right = "auto";
    this.dock.style.bottom = "auto";
  }

  flash(state: MascotState, ms: number) {
    this.explicit = state;
    this.render();
    if (this.blinkTimer) window.clearTimeout(this.blinkTimer);
    this.blinkTimer = window.setTimeout(() => {
      this.blinkTimer = 0;
      if (this.explicit === state) {
        this.explicit = null;
        this.render();
      }
    }, ms);
  }

  private clearTimer() {
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = 0;
  }

  private scheduleNext(ms: number) {
    this.clearTimer();
    if (this.hidden || this.destroyed) return;
    this.timer = window.setTimeout(() => this.advance(), ms);
  }

  private advance() {
    if (this.hidden || this.destroyed) return;
    const sequence = this.reduced ? REDUCED_SEQUENCE : AUTO_SEQUENCE;
    const step = sequence[this.seqIndex % sequence.length]!;
    this.seqIndex += 1;
    this.autoState = step.state;
    this.autoLook = step.look ?? { x: 0.15, y: -0.15 };
    if (step.blink && !this.reduced) this.blink();
    this.render();
    const ms = this.reduced ? step.ms * 1.8 : jitter(step.ms);
    this.scheduleNext(ms);
  }

  private blink() {
    if (this.reduced) return;
    this.explicit = "blink";
    this.render();
    if (this.blinkTimer) window.clearTimeout(this.blinkTimer);
    this.blinkTimer = window.setTimeout(() => {
      this.blinkTimer = 0;
      if (this.explicit === "blink") {
        this.explicit = null;
        this.render();
      }
    }, 110);
  }

  private effective(): MascotState {
    const pointerTarget = this.pointerLook ?? this.propLook;
    const pointerActive = Boolean(pointerTarget) && !this.reduced;
    if (this.explicit) {
      if (
        pointerActive &&
        (this.explicit === "dots" || this.explicit === "pills" || this.explicit === "look")
      ) {
        return "look";
      }
      return this.explicit;
    }
    if (this.hovered || this.focused) return "happy";
    if (pointerActive) return "look";
    return this.autoState;
  }

  private configureSaccade(state: MascotState) {
    if (this.saccadeTimer) {
      window.clearTimeout(this.saccadeTimer);
      this.saccadeTimer = 0;
    }
    if (this.reduced || state !== "look") {
      this.saccade = { x: 0, y: 0 };
      return;
    }
    const tick = () => {
      if (this.destroyed) return;
      const magnitude = (0.01 + Math.random() * 0.02) * this.D;
      const angle = Math.random() * Math.PI * 2;
      this.saccade = { x: Math.cos(angle) * magnitude, y: Math.sin(angle) * magnitude };
      this.render();
      this.saccadeTimer = window.setTimeout(tick, 280 + Math.random() * 320);
    };
    this.saccadeTimer = window.setTimeout(tick, 280 + Math.random() * 320);
  }

  private render() {
    if (this.destroyed) return;
    const state = this.effective();
    this.element.dataset.state = state;
    const pointerTarget = this.pointerLook ?? this.propLook;
    let look = { x: 0, y: 0 };
    if (state === "look") {
      look = pointerTarget ?? { x: this.autoLook.x * this.D, y: this.autoLook.y * this.D };
      look = { x: look.x + this.saccade.x, y: look.y + this.saccade.y };
    }
    const face = faceFor(state, look, this.D);
    const eyes = eyesFor(face, state);
    const thinking = state === "think";
    const happy = state === "happy" && !this.reduced;

    this.head.style.transform = `translate(${face.headX * this.D}px, ${face.headY * this.D}px) scale(${face.sx}, ${face.sy})`;
    this.headInner.style.transform = `scale(${thinking ? 0.34 : 1})`;
    this.headInner.style.opacity = "1";
    this.whiteDot.style.opacity = "1";

    eyes.forEach((target, index) => {
      const eye = this.eyes[index]!;
      const w = target.w * this.D;
      const h = target.h * this.D;
      const stroke = ARCH_STROKE * this.D;
      const radius = Math.max(0.01, (w - stroke) / 2);
      const x0 = stroke / 2;
      const x1 = Math.max(x0 + 0.01, w - stroke / 2);
      const curveY = stroke / 2 + radius;
      const bottomY = h - stroke / 2;
      eye.wrap.style.transform = `translate(${target.x * this.D}px, ${target.y * this.D}px) rotate(${target.rot}deg)`;
      eye.wrap.style.opacity = thinking ? "0" : "1";
      eye.ink.style.width = `${w}px`;
      eye.ink.style.height = `${h}px`;
      eye.ink.style.borderRadius = `${Math.min(w, h) / 2}px`;
      eye.ink.style.marginLeft = `${-w / 2}px`;
      eye.ink.style.marginTop = `${-h / 2}px`;
      eye.ink.style.opacity = target.arch ? "0" : "1";
      eye.hole.style.width = `${target.holeW * this.D}px`;
      eye.hole.style.height = `${target.holeH * this.D}px`;
      eye.hole.style.borderRadius = `${Math.min(target.holeW, target.holeH) * this.D / 2}px`;
      eye.hole.style.marginLeft = `${-target.holeW * this.D / 2 + target.holeX * this.D}px`;
      eye.hole.style.marginTop = `${-target.holeH * this.D / 2 + target.holeY * this.D}px`;
      eye.arch.style.width = `${w + 4}px`;
      eye.arch.style.height = `${h + 4}px`;
      eye.arch.setAttribute("viewBox", `-2 -2 ${w + 4} ${h + 4}`);
      eye.arch.style.marginLeft = `${-(w + 4) / 2}px`;
      eye.arch.style.marginTop = `${-(h + 4) / 2}px`;
      eye.arch.style.opacity = target.arch ? "1" : "0";
      eye.path.setAttribute(
        "d",
        `M ${x0} ${bottomY} L ${x0} ${curveY} A ${radius} ${radius} 0 0 1 ${x1} ${curveY} L ${x1} ${bottomY}`,
      );
      eye.path.setAttribute("stroke-width", String(stroke));
    });

    this.grayDots.forEach((dot, index) => {
      const side = index === 0 ? -1 : 1;
      dot.style.transform = thinking
        ? `translate(${side * this.D * 0.42}px, 0) scale(1)`
        : "translate(0,0) scale(.6)";
      dot.style.opacity = thinking ? (index === 0 ? "0.45" : "0.9") : "0";
    });

    this.configureSaccade(state);
    this.animateThink(thinking);
    this.animateHappy(happy);
    this.options.onStateChange?.(state);
  }

  private animateThink(thinking: boolean) {
    if (this.pulseAnimation) {
      this.pulseAnimation.cancel();
      this.pulseAnimation = null;
    }
    if (!thinking || this.reduced) return;
    this.pulseAnimation = this.whiteDot.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.15)" }, { transform: "scale(1)" }],
      { duration: 700, iterations: Number.POSITIVE_INFINITY, easing: "ease-in-out" },
    );
  }

  private animateHappy(happy: boolean) {
    if (this.headAnimation) {
      this.headAnimation.cancel();
      this.headAnimation = null;
    }
    if (!happy || this.reduced) return;
    this.headAnimation = this.head.animate(
      [
        { transform: `${this.head.style.transform} translateY(0px)` },
        { transform: `${this.head.style.transform} translateY(${this.D * 0.028}px)` },
        { transform: `${this.head.style.transform} translateY(0px)` },
      ],
      { duration: 620, iterations: Number.POSITIVE_INFINITY, easing: "ease-in-out" },
    );
  }

  destroy() {
    this.destroyed = true;
    this.clearTimer();
    if (this.blinkTimer) window.clearTimeout(this.blinkTimer);
    if (this.saccadeTimer) window.clearTimeout(this.saccadeTimer);
    if (this.idleTimer) window.clearTimeout(this.idleTimer);
    if (this.clickTimer) window.clearTimeout(this.clickTimer);
    if (this.longPressTimer) window.clearTimeout(this.longPressTimer);
    for (const timer of this.clickTimers) window.clearTimeout(timer);
    if (this.frame) cancelAnimationFrame(this.frame);
    this.headAnimation?.cancel();
    this.pulseAnimation?.cancel();
    for (const detach of this.detach) detach();
    this.dock.remove();
  }
}
