"use client";

import * as React from "react";
import { useHydratedReducedMotion } from "@/lib/use-reduced-motion";
import {
  LINEAR_TIMING,
  blockBottom,
  blockTop,
  buildCamera,
  circlePoints,
  easeDepth,
  expandFoot,
  flatPath,
  footContains,
  frontArcPath,
  isSprite,
  isoEllipse,
  pathFrom,
  prismPath,
  project,
  sceneBase,
  sceneBlockDepth,
  spriteBase,
  spriteDetailPoints,
  spritePoint,
  unproject,
  type Camera,
  type Detail,
  type Foot,
  type Point2,
  type SceneDefinition,
  type SceneSprite,
  type SpriteDetail,
  type SpriteMotion,
} from "./engine";

export type LinearSceneProps = {
  scene: SceneDefinition;
  className?: string;
  /** Accessible sentence. Pass an empty string for a decorative tile. */
  label?: string;
  /** Increment to replay a short tour of every object. */
  replay?: number;
  /** Set to false for a still figure. */
  interactive?: boolean;
  /** Set to false to keep the figure still until a pointer or replay wakes it. */
  idle?: boolean;
};

const COLOR_TRANSITION =
  "stroke 260ms cubic-bezier(0.5, 0, 0.1, 1), fill 260ms cubic-bezier(0.5, 0, 0.1, 1)";

/** Engraved lip inside the plate silhouette. */
const PLATE_RIM = 3.2;
/** Second contour on the top face of every key, inside the silhouette. */
const BLOCK_RIM = 2.15;

/**
 * Inset contour of a footprint, used for the nested lips. Returns null when the
 * shape is too small to hold a readable rim, so tiny keys stay clean.
 */
function rimPath(camera: Camera, foot: Foot, z: number) {
  if (foot.kind === "rect") {
    const pad = Math.min(BLOCK_RIM, foot.w / 2 - 1, foot.d / 2 - 1);
    return pad > 0.4 ? flatPath(camera, expandFoot(foot, -pad), z) : null;
  }
  if (foot.kind === "circle") {
    const pad = Math.min(BLOCK_RIM, foot.r - 1);
    return pad > 0.4 ? flatPath(camera, expandFoot(foot, -pad), z) : null;
  }
  if (foot.points.length >= 3) {
    return flatPath(camera, expandFoot(foot, -BLOCK_RIM), z);
  }
  return null;
}

function toneColor(tone: Detail["tone"], active: boolean, fallback: string) {
  switch (tone) {
    case "edge":
      return "var(--ls-edge)";
    case "hi":
      return "var(--ls-hi)";
    case "mid":
      return "var(--ls-mid)";
    case "lo":
      return "var(--ls-lo)";
    case "active":
      return active ? "var(--ls-hi)" : "var(--ls-lo)";
    default:
      return fallback;
  }
}



function DetailShape({
  detail,
  camera,
  z,
  active,
}: {
  detail: Detail;
  camera: Camera;
  z: number;
  active: boolean;
}) {
  if (detail.kind === "bar") {
    return (
      <path
        d={flatPath(
          camera,
          {
            kind: "rect",
            x: detail.x,
            y: detail.y,
            w: detail.w,
            d: detail.d,
            r: detail.r ?? 1.2,
          },
          z,
        )}
        fill="none"
        stroke={toneColor(detail.tone, active, "var(--ls-mid)")}
        strokeWidth={0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ transition: COLOR_TRANSITION }}
      />
    );
  }

  if (detail.kind === "dot") {
    const ellipse = isoEllipse(camera, detail.x, detail.y, z, detail.r);
    return (
      <g>
        {active && (
          <ellipse
            cx={ellipse.cx}
            cy={ellipse.cy}
            rx={ellipse.rx * 1.25}
            ry={ellipse.ry * 1.25}
            stroke="none"
            fill="var(--ls-hi)"
            opacity={0.1}
            style={{ transition: COLOR_TRANSITION }}
          />
        )}
        <ellipse
          cx={ellipse.cx}
          cy={ellipse.cy}
          rx={ellipse.rx}
          ry={ellipse.ry}
          stroke="none"
          fill={toneColor(detail.tone, active, active ? "var(--ls-hi)" : "var(--ls-lo)")}
          style={{ transition: COLOR_TRANSITION }}
        />
      </g>
    );
  }

  if (detail.kind === "ring") {
    const ellipse = isoEllipse(camera, detail.x, detail.y, z, detail.r);
    return (
      <ellipse
        cx={ellipse.cx}
        cy={ellipse.cy}
        rx={ellipse.rx}
        ry={ellipse.ry}
        fill="none"
        stroke={toneColor(detail.tone, active, "var(--ls-lo)")}
        strokeWidth={0.9}
        vectorEffect="non-scaling-stroke"
        style={{ transition: COLOR_TRANSITION }}
      />
    );
  }

  const points = detail.points.map(([x, y]) => project(camera, x, y, z));
  if (points.length === 0) return null;
  let d = `M${Math.round(points[0].x * 100) / 100} ${
    Math.round(points[0].y * 100) / 100
  }`;
  for (let index = 1; index < points.length; index += 1) {
    d += `L${Math.round(points[index].x * 100) / 100} ${
      Math.round(points[index].y * 100) / 100
    }`;
  }
  if (detail.closed) d += "Z";
  return (
    <path
      d={d}
      fill="none"
      stroke={toneColor(detail.tone, active, "var(--ls-mid)")}
      strokeWidth={0.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      style={{ transition: COLOR_TRANSITION }}
    />
  );
}

type LocalTransform = (u: number, v: number) => Point2;

const IDENTITY: LocalTransform = (u, v) => [u, v];

function compose(first: LocalTransform, second: LocalTransform): LocalTransform {
  return (u, v) => {
    const [x, y] = first(u, v);
    return second(x, y);
  };
}

function rotateAbout(pivot: Point2, degrees: number): LocalTransform {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return (u, v) => {
    const x = u - pivot[0];
    const y = v - pivot[1];
    return [pivot[0] + x * cos - y * sin, pivot[1] + x * sin + y * cos];
  };
}

function scaleAbout(pivot: Point2, sx: number, sy: number): LocalTransform {
  return (u, v) => [
    pivot[0] + (u - pivot[0]) * sx,
    pivot[1] + (v - pivot[1]) * sy,
  ];
}

function moveBy(dx: number, dy: number): LocalTransform {
  return (u, v) => [u + dx, v + dy];
}

function cycleOf(motion: SpriteMotion, time: number) {
  const period = Math.max(120, motion.period ?? 2600);
  const raw = time / period + (motion.phase ?? 0);
  return raw - Math.floor(raw);
}

function heartBeat(cycle: number) {
  const bump = (center: number, width: number) =>
    Math.exp(-Math.pow((cycle - center) / width, 2));
  return Math.min(1, bump(0.14, 0.055) + 0.6 * bump(0.34, 0.075));
}

function motionTransform(motion: SpriteMotion, time: number, pivot: Point2) {
  const cycle = cycleOf(motion, time);
  const amount = motion.amount ?? 0;
  switch (motion.kind) {
    case "spin":
      return rotateAbout(pivot, (amount || 360) * cycle);
    case "pulse": {
      const scale = 1 + (amount || 0.08) * heartBeat(cycle);
      return scaleAbout(pivot, scale, 1 + (amount || 0.08) * 0.62 * heartBeat(cycle));
    }
    case "breathe": {
      const wave = 0.5 + 0.5 * Math.sin(cycle * Math.PI * 2);
      const scale = 1 + (amount || 0.05) * wave;
      return scaleAbout(pivot, scale, scale);
    }
    case "blink": {
      const wave = 0.5 + 0.5 * Math.sin(cycle * Math.PI * 2);
      const close = Math.pow(wave, 12);
      return scaleAbout(pivot, 1, 1 - (amount || 0.9) * close);
    }
    case "sway":
      return rotateAbout(pivot, Math.sin(cycle * Math.PI * 2) * (amount || 4));
    case "bob":
      return moveBy(0, Math.sin(cycle * Math.PI * 2) * (amount || 2));
    case "flicker": {
      const wave =
        Math.sin(cycle * Math.PI * 6) * (0.55 + 0.45 * Math.sin(cycle * Math.PI * 2));
      return scaleAbout(pivot, 1, 1 + (amount || 0.2) * wave);
    }
    case "lift":
      return moveBy(0, (amount || 3) * (0.5 - 0.5 * Math.cos(cycle * Math.PI * 2)));
    default:
      return IDENTITY;
  }
}

type SpriteFrame = {
  whole: LocalTransform;
  groups: Map<string, LocalTransform>;
};

function groupPivots(sprite: SceneSprite) {
  const boxes = new Map<string, { minU: number; maxU: number; minV: number; maxV: number }>();
  for (const detail of sprite.details ?? []) {
    if (!detail.group) continue;
    const points =
      detail.kind === "line"
        ? detail.points
        : (circlePoints(detail.x, detail.y, detail.r, 12) as Point2[]);
    const box = boxes.get(detail.group) ?? {
      minU: Infinity,
      maxU: -Infinity,
      minV: Infinity,
      maxV: -Infinity,
    };
    for (const [u, v] of points) {
      box.minU = Math.min(box.minU, u);
      box.maxU = Math.max(box.maxU, u);
      box.minV = Math.min(box.minV, v);
      box.maxV = Math.max(box.maxV, v);
    }
    boxes.set(detail.group, box);
  }
  const pivots = new Map<string, Point2>();
  for (const [key, box] of boxes) {
    pivots.set(key, [(box.minU + box.maxU) / 2, (box.minV + box.maxV) / 2]);
  }
  return pivots;
}

function resolveSpriteFrame(
  sprite: SceneSprite,
  time: number,
  pivots: Map<string, Point2>,
): SpriteFrame {
  let whole: LocalTransform = IDENTITY;
  const groups = new Map<string, LocalTransform>();
  for (const motion of sprite.motion ?? []) {
    const pivot = motion.pivot ?? (motion.target ? pivots.get(motion.target) : undefined) ?? [0, 0];
    const transform = motionTransform(motion, time, pivot);
    if (motion.target) {
      const previous = groups.get(motion.target) ?? IDENTITY;
      groups.set(motion.target, compose(previous, transform));
    } else {
      whole = compose(whole, transform);
    }
  }
  return { whole, groups };
}

function signedArea(points: ReadonlyArray<Point2>) {
  let area = 0;
  for (let index = 0; index < points.length; index += 1) {
    const [ax, ay] = points[index];
    const [bx, by] = points[(index + 1) % points.length];
    area += ax * by - bx * ay;
  }
  return area;
}

function wound(points: ReadonlyArray<Point2>, positive: boolean) {
  const area = signedArea(points);
  return (area >= 0) === positive ? points : [...points].reverse();
}

function spritePath(
  camera: Camera,
  sprite: SceneSprite,
  z: number,
  transform: LocalTransform,
  back = false,
) {
  const loops = [
    ...sprite.outline.map((loop) => wound(loop, true)),
    ...(sprite.holes ?? []).map((loop) => wound(loop, false)),
  ];
  let path = "";
  for (const loop of loops) {
    const points = loop.map(([u, v]) => {
      const [tu, tv] = transform(u, v);
      return spritePoint(camera, sprite, tu, tv, z, back);
    });
    path += pathFrom(points, true);
  }
  return path;
}

function SpriteDetailShape({
  detail,
  camera,
  sprite,
  baseZ,
  frame,
  active,
}: {
  detail: SpriteDetail;
  camera: Camera;
  sprite: SceneSprite;
  baseZ: number;
  frame: SpriteFrame;
  active: boolean;
}) {
  const group = detail.group ? frame.groups.get(detail.group) ?? IDENTITY : IDENTITY;
  const transform = compose(group, frame.whole);
  const stroke = toneColor(detail.tone, active, "var(--ls-mid)");

  if (detail.kind === "line") {
    const points = detail.points.map(([u, v]) => {
      const [tu, tv] = transform(u, v);
      return spritePoint(camera, sprite, tu, tv, baseZ);
    });
    if (points.length === 0) return null;
    return (
      <path
        d={pathFrom(points, detail.closed)}
        fill="none"
        stroke={stroke}
        strokeWidth={0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ transition: COLOR_TRANSITION }}
      />
    );
  }

  const points = (circlePoints(detail.x, detail.y, detail.r, 24) as Point2[]).map(
    ([u, v]) => {
      const [tu, tv] = transform(u, v);
      return spritePoint(camera, sprite, tu, tv, baseZ);
    },
  );
  const path = pathFrom(points, true);

  if (detail.kind === "ring") {
    return (
      <path
        d={path}
        fill="none"
        stroke={toneColor(detail.tone, active, "var(--ls-lo)")}
        strokeWidth={0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ transition: COLOR_TRANSITION }}
      />
    );
  }

  return (
    <path
      d={path}
      fill={toneColor(detail.tone, active, active ? "var(--ls-hi)" : "var(--ls-lo)")}
      stroke="none"
      style={{ transition: COLOR_TRANSITION }}
    />
  );
}

/**
 * The shared isometric object renderer. Every illustration is a pure
 * `SceneDefinition` handed to this component; it owns the projection, the
 * occlusion, the pointer depth tween and the reduced-motion fallback.
 */
export function IsoObject({
  scene,
  className,
  label,
  replay = 0,
  interactive = true,
  idle = true,
}: LinearSceneProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const reduce = useHydratedReducedMotion();
  /* The gallery mounts a scene only when it is near the viewport, and the
     detail view is always open. A local visibility observer would only add a
     state update per mount, so the scene treats its mounted life as visible. */
  const visible = true;

  const camera = React.useMemo(() => buildCamera(scene), [scene]);
  const plateTop = sceneBase(scene);
  const ordered = React.useMemo(
    () =>
      scene.blocks
        .map((block, index) => ({ block, index }))
        .sort((a, b) => sceneBlockDepth(a.block) - sceneBlockDepth(b.block)),
    [scene],
  );

  const firstInteractive = scene.blocks.findIndex((block) => !block.static);
  const restingActive =
    scene.active ?? (firstInteractive >= 0 ? firstInteractive : 0);

  const pivots = React.useMemo(() => {
    const map = new Map<SceneSprite, Map<string, Point2>>();
    for (const block of scene.blocks) {
      if (!isSprite(block)) continue;
      map.set(block, groupPivots(block));
    }
    return map;
  }, [scene]);

  const hasMotion = React.useMemo(
    () =>
      scene.blocks.some(
        (block) => isSprite(block) && (block.motion?.length ?? 0) > 0,
      ),
    [scene],
  );

  const spriteHits = React.useMemo(
    () =>
      scene.blocks.map((block) => {
        if (!isSprite(block)) return null;
        const z = block.z ?? plateTop;
        const points: Array<{ x: number; y: number }> = [];
        for (const loop of [...block.outline, ...(block.holes ?? [])]) {
          for (const [u, v] of loop) {
            points.push(spritePoint(camera, block, u, v, z));
            points.push(spritePoint(camera, block, u, v, z, true));
          }
        }
        for (const detail of block.details ?? []) {
          for (const [u, v] of spriteDetailPoints(detail)) {
            points.push(spritePoint(camera, block, u, v, z));
          }
        }
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        for (const point of points) {
          minX = Math.min(minX, point.x);
          maxX = Math.max(maxX, point.x);
          minY = Math.min(minY, point.y);
          maxY = Math.max(maxY, point.y);
        }
        return { minX: minX - 4, maxX: maxX + 4, minY: minY - 4, maxY: maxY + 4, z };
      }),
    [camera, plateTop, scene],
  );

  const clockRef = React.useRef(0);
  const paintRef = React.useRef(0);
  const [hover, setHover] = React.useState<number | null>(null);
  const [tour, setTour] = React.useState<number | null>(null);
  const [, force] = React.useReducer((value: number) => value + 1, 0);

  const activeIndex = interactive ? hover ?? tour ?? restingActive : restingActive;
  const pressed = interactive && (hover !== null || tour !== null);

  const deltas = React.useRef<number[]>(scene.blocks.map(() => 0));
  const leaveTimer = React.useRef<number | undefined>(undefined);
  const tourTimers = React.useRef<number[]>([]);
  const frameRef = React.useRef(0);
  const hoverRef = React.useRef<number | null>(null);
  const reduceRef = React.useRef(reduce);
  const visibleRef = React.useRef(visible);
  const controlRef = React.useRef({ active: activeIndex, pressed });

  reduceRef.current = reduce;
  visibleRef.current = visible;
  controlRef.current = { active: activeIndex, pressed };

  /**
   * Starts the depth tween from the current values. Called directly from the
   * pointer handler so the geometry does not wait for React's passive effects.
   */
  const animate = React.useCallback(
    (active: number | null, down: boolean) => {
      const targets = scene.blocks.map((block, index) => {
        if (!down || block.static) return 0;
        if (index === active) return -LINEAR_TIMING.sink;
        return LINEAR_TIMING.lift;
      });

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }

      if (reduceRef.current || !visibleRef.current || !interactive) {
        const changed = targets.some(
          (target, index) => Math.abs((deltas.current[index] ?? 0) - target) > 0.01,
        );
        deltas.current = targets;
        if (changed) force();
        return;
      }

      if (!down && targets.every((target, index) => Math.abs((deltas.current[index] ?? 0) - target) < 0.01)) {
        return;
      }

      const now = performance.now();
      const animations = targets.map((to, index) => ({
        from: deltas.current[index] ?? 0,
        to,
        delay: down
          ? LINEAR_TIMING.stagger * Math.abs(index - (active ?? 0))
          : 0,
        start: now,
      }));

      const step = (time: number) => {
        let running = false;
        for (let index = 0; index < animations.length; index += 1) {
          const animation = animations[index];
          const elapsed = time - animation.start - animation.delay;
          if (elapsed <= 0) {
            running = true;
            continue;
          }
          const progress = Math.min(1, elapsed / LINEAR_TIMING.depth);
          const eased = easeDepth(progress);
          deltas.current[index] =
            animation.from + (animation.to - animation.from) * eased;
          if (progress < 1) running = true;
          else deltas.current[index] = animation.to;
        }
        if (!running || time - paintRef.current >= 24) {
          paintRef.current = time;
          force();
        }
        frameRef.current = running ? requestAnimationFrame(step) : 0;
      };

      frameRef.current = requestAnimationFrame(step);
    },
    [force, interactive, scene],
  );

  React.useEffect(() => {
    hoverRef.current = null;
    setHover(null);
    setTour(null);
    deltas.current = scene.blocks.map(() => 0);
    animate(null, false);
  }, [animate, scene]);

  React.useEffect(() => {
    animate(controlRef.current.active, controlRef.current.pressed);
  }, [animate, reduce, visible]);

  React.useEffect(() => {
    if (!hasMotion || reduce || !visible || !idle) {
      const wasRunning = clockRef.current !== 0;
      clockRef.current = 0;
      if (wasRunning) force();
      return;
    }
    let frame = 0;
    const start = performance.now();
    const step = (time: number) => {
      clockRef.current = time - start;
      if (time - paintRef.current >= 24) {
        paintRef.current = time;
        force();
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [force, hasMotion, idle, reduce, scene, visible]);

  React.useEffect(
    () => () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const clearLeave = React.useCallback(() => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = undefined;
    }
  }, []);

  const cancelTour = React.useCallback(() => {
    for (const timer of tourTimers.current) window.clearTimeout(timer);
    tourTimers.current = [];
    setTour(null);
  }, []);

  React.useEffect(() => {
    for (const timer of tourTimers.current) window.clearTimeout(timer);
    tourTimers.current = [];
    if (!replay || !interactive) return;
    hoverRef.current = null;
    setHover(null);
    setTour(null);
    animate(null, false);
    const indices = scene.blocks
      .map((block, index) => (!block.static ? index : -1))
      .filter((index) => index >= 0);
    indices.forEach((index, order) => {
      tourTimers.current.push(
        window.setTimeout(() => {
          setTour(index);
          animate(index, true);
        }, 140 + order * 880),
      );
    });
    tourTimers.current.push(
      window.setTimeout(() => {
        setTour(null);
        animate(null, false);
      }, 140 + indices.length * 880),
    );
    return () => {
      for (const timer of tourTimers.current) window.clearTimeout(timer);
      tourTimers.current = [];
    };
  }, [animate, interactive, replay, scene]);

  React.useEffect(
    () => () => {
      clearLeave();
      for (const timer of tourTimers.current) window.clearTimeout(timer);
    },
    [clearLeave],
  );

  const hitAt = React.useCallback(
    (clientX: number, clientY: number) => {
      const node = rootRef.current?.querySelector("svg");
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      const sx = ((clientX - rect.left) / rect.width) * 400;
      const sy = ((clientY - rect.top) / rect.height) * 320;
      let best: number | null = null;
      let bestDepth = -Infinity;
      scene.blocks.forEach((block, index) => {
        if (block.static) return;
        const delta = deltas.current[index] ?? 0;
        let hit = false;

        if (isSprite(block)) {
          const bounds = spriteHits[index];
          if (!bounds) return;
          const shift =
            project(camera, 0, 0, bounds.z + delta).y -
            project(camera, 0, 0, bounds.z).y;
          hit =
            sx >= bounds.minX &&
            sx <= bounds.maxX &&
            sy >= bounds.minY + shift &&
            sy <= bounds.maxY + shift;
        } else {
          const z0 = blockBottom(block, plateTop, delta);
          const z1 = blockTop(block, plateTop, delta);
          /* Test the base, the top face and the middle of the side face, so a
             floating card and a tall panel are both easy to reach. */
          hit = [z0, (z0 + z1) / 2, z1].some((z) => {
            const local = unproject(camera, sx, sy, z);
            return footContains(block.foot, local.x, local.y);
          });
        }

        if (!hit) return;
        const depth = sceneBlockDepth(block);
        if (depth > bestDepth) {
          bestDepth = depth;
          best = index;
        }
      });
      return best;
    },
    [camera, plateTop, scene],
  );

  const onPointerMove = interactive
    ? (event: React.PointerEvent<SVGSVGElement>) => {
        if (event.pointerType === "touch") return;
        clearLeave();
        if (tour !== null) cancelTour();
        const next = hitAt(event.clientX, event.clientY);
        if (next === hoverRef.current) return;
        hoverRef.current = next;
        setHover(next);
        animate(next, next !== null);
      }
    : undefined;

  const onPointerLeave = interactive
    ? (event: React.PointerEvent<SVGSVGElement>) => {
        if (event.pointerType === "touch") {
          clearLeave();
          leaveTimer.current = window.setTimeout(() => {
            hoverRef.current = null;
            setHover(null);
            animate(null, false);
          }, LINEAR_TIMING.touchLeave);
        } else {
          clearLeave();
          hoverRef.current = null;
          setHover(null);
          animate(null, false);
        }
      }
    : undefined;

  const onPointerDown = interactive
    ? (event: React.PointerEvent<SVGSVGElement>) => {
        clearLeave();
        if (tour !== null) cancelTour();
        const next = hitAt(event.clientX, event.clientY);
        hoverRef.current = next;
        setHover(next);
        animate(next, next !== null);
        if (event.pointerType === "touch" && next !== null) {
          leaveTimer.current = window.setTimeout(() => {
            hoverRef.current = null;
            setHover(null);
            animate(null, false);
          }, LINEAR_TIMING.touchLeave);
        }
      }
    : undefined;

  const vars = {
    /* The reference plate is pure white in light and near-black in dark, not
       the page surface: the slab keeps its own material. */
    "--ls-plate": "light-dark(#ffffff, #0a0a0a)",
    "--ls-edge": "light-dark(oklch(0.43 0 0), oklch(0.79 0 0))",
    "--ls-lo": "light-dark(oklch(0.7 0 0), oklch(0.44 0 0))",
    "--ls-mid": "light-dark(oklch(0.53 0 0), oklch(0.6 0 0))",
    "--ls-well": "light-dark(oklch(0.6 0 0), oklch(0.52 0 0))",
    "--ls-hi": "light-dark(oklch(0.13 0 0), oklch(0.995 0 0))",
  } as React.CSSProperties;

  const a11y =
    label === undefined
      ? { role: "img" as const, "aria-label": scene.aria }
      : label
        ? { role: "img" as const, "aria-label": label }
        : { "aria-hidden": true as const };

  const platePath = scene.plate
    ? prismPath(
        camera,
        {
          kind: "rect",
          x: scene.plate.x,
          y: scene.plate.y,
          w: scene.plate.w,
          d: scene.plate.d,
          r: scene.plate.r,
        },
        0,
        scene.plate.h,
      )
    : null;

  const plateBevel = scene.plate
    ? frontArcPath(
        camera,
        {
          kind: "rect",
          x: scene.plate.x,
          y: scene.plate.y,
          w: scene.plate.w,
          d: scene.plate.d,
          r: scene.plate.r,
        },
        scene.plate.h,
      )
    : null;

  const plateRim = scene.plate
    ? flatPath(
        camera,
        expandFoot(
          {
            kind: "rect",
            x: scene.plate.x,
            y: scene.plate.y,
            w: scene.plate.w,
            d: scene.plate.d,
            r: scene.plate.r,
          },
          -PLATE_RIM,
        ),
        scene.plate.h,
      )
    : null;

  return (
    <div
      ref={rootRef}
      className={className}
      data-linear-scene={scene.slug}
      data-linear-active={activeIndex}
      data-linear-pressed={pressed ? "true" : "false"}
      style={{ aspectRatio: "5 / 4", position: "relative", ...vars }}
      {...a11y}
    >
      <svg
        viewBox="0 0 400 320"
        width="100%"
        height="100%"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{ display: "block", touchAction: "pan-y", userSelect: "none" }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerCancel={onPointerLeave}
      >
        {platePath && (
          <g data-linear-part="plate">
            <path
              d={platePath}
              fill="var(--ls-plate)"
              stroke="var(--ls-edge)"
              strokeWidth={0.9}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ transition: COLOR_TRANSITION }}
            />
            {plateBevel && (
              <path
                d={plateBevel}
                fill="none"
                stroke="var(--ls-lo)"
                strokeWidth={0.9}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ transition: COLOR_TRANSITION }}
              />
            )}
            {plateRim && (
              <path
                d={plateRim}
                fill="none"
                stroke="var(--ls-mid)"
                strokeWidth={0.9}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ transition: COLOR_TRANSITION }}
              />
            )}
          </g>
        )}

        {(scene.wells ?? []).map((well, index) => (
          <path
            key={`well-${index}`}
            d={
              well.full
                ? flatPath(camera, expandFoot(well.foot, well.pad ?? 3), plateTop)
                : frontArcPath(
                    camera,
                    expandFoot(well.foot, well.pad ?? 3),
                    plateTop,
                  )
            }
            fill="none"
            stroke={well.tone === "mid" ? "var(--ls-mid)" : "var(--ls-well)"}
            strokeWidth={0.9}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ transition: COLOR_TRANSITION }}
          />
        ))}

        {(scene.marks ?? []).map((detail, index) => (
          <DetailShape
            key={`mark-${index}`}
            detail={detail}
            camera={camera}
            z={plateTop}
            active={false}
          />
        ))}

        {ordered.map(({ block, index }) => {
          const delta = deltas.current[index] ?? 0;
          const isActive = interactive && index === activeIndex;

          if (isSprite(block)) {
            const z0 = spriteBase(block, plateTop, delta);
            const frame = resolveSpriteFrame(
              block,
              clockRef.current,
              pivots.get(block) ?? new Map(),
            );
            const back =
              block.thickness > 0.4
                ? spritePath(camera, block, z0, frame.whole, true)
                : "";
            const front = spritePath(camera, block, z0, frame.whole);
            return (
              <g
                key={block.id}
                data-linear-block={block.id}
                data-linear-index={index}
                data-linear-kind="sprite"
                data-linear-top={z0.toFixed(2)}
              >
                {back && (
                  <path
                    d={back}
                    fill="var(--ls-plate)"
                    stroke="var(--ls-lo)"
                    strokeWidth={0.9}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    style={{ transition: COLOR_TRANSITION }}
                  />
                )}
                <path
                  d={front}
                  fill="var(--ls-plate)"
                  stroke={isActive ? "var(--ls-hi)" : "var(--ls-edge)"}
                  strokeWidth={0.9}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ transition: COLOR_TRANSITION }}
                />
                {(block.details ?? []).map((detail, detailIndex) => (
                  <SpriteDetailShape
                    key={`${block.id}-detail-${detailIndex}`}
                    detail={detail}
                    camera={camera}
                    sprite={block}
                    baseZ={z0}
                    frame={frame}
                    active={isActive}
                  />
                ))}
              </g>
            );
          }

          const z0 = blockBottom(block, plateTop, delta);
          const z1 = blockTop(block, plateTop, delta);
          const silhouette = prismPath(camera, block.foot, z0, z1);
          const bevel = z1 - z0 > 0.35 ? frontArcPath(camera, block.foot, z1) : "";
          const rim =
            z1 - z0 > 0.35 ? rimPath(camera, block.foot, z1) : null;
          return (
            <g
              key={block.id}
              data-linear-block={block.id}
              data-linear-index={index}
              data-linear-top={z1.toFixed(2)}
            >
              <path
                d={silhouette}
                fill="var(--ls-plate)"
                stroke={isActive ? "var(--ls-hi)" : "var(--ls-edge)"}
                strokeWidth={0.9}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ transition: COLOR_TRANSITION }}
              />
              {bevel && (
                <path
                  d={bevel}
                  fill="none"
                  stroke="var(--ls-lo)"
                  strokeWidth={0.9}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ transition: COLOR_TRANSITION }}
                />
              )}
              {rim && (
                <path
                  d={rim}
                  fill="none"
                  stroke={isActive ? "var(--ls-hi)" : "var(--ls-mid)"}
                  strokeWidth={0.9}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ transition: COLOR_TRANSITION }}
                />
              )}
              {(block.details ?? []).map((detail, detailIndex) => (
                <DetailShape
                  key={`${block.id}-detail-${detailIndex}`}
                  detail={detail}
                  camera={camera}
                  z={z1}
                  active={isActive}
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * Registry-facing alias, kept stable so generated illustrations and published
 * registry items can import `LinearScene` without churn.
 */
export const LinearScene = IsoObject;

/** Consumer-facing alias for the shared base. */
export type IsoObjectProps = LinearSceneProps;
