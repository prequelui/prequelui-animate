/*
 * PrequelUI Animate — hairline isometric engine.
 *
 * The geometry is generated every frame from a small set of local footprints.
 * It is deliberately dependency-free so the same file can be published as a
 * shadcn registry dependency and used outside this site.
 *
 * Projection: axonometric 2:1 (azimuth 45°, vertical factor 0.5).
 * Stroke: 0.9 px, non-scaling, round joins.
 * Occlusion: opaque silhouettes filled with the page colour, painted back to
 * front. No masks, no filters, no dash drawing.
 */

export type Point2 = readonly [number, number];
export type Point3 = readonly [number, number, number];

/**
 * A hand-authored face of a real-world object. Points are either 3D local
 * coordinates (`pts`) or already raw-projected 2D coordinates (`pts2`). The
 * camera fits and scales both the same way, so a generated figure keeps the
 * 2:1 projection while allowing silhouettes (spheres, frustums, torus, tubes)
 * that a single footprint extrusion cannot express.
 */
export type FigureFace = {
  pts?: ReadonlyArray<Point3>;
  pts2?: ReadonlyArray<Point2>;
  /** Closed by default. */
  closed?: boolean;
  /** Filled with the plate tone by default; set false for engraved lines. */
  fill?: boolean;
  /** Set false to fill a face without stroking it (hidden construction). */
  stroke?: boolean;
  /** Stroke tone. Defaults to `edge` for filled faces, `mid` otherwise. */
  tone?: DetailTone;
  /** Group used by the hover story. */
  group?: string;
};

export type FigureMotionKind =
  | "bob"
  | "sway"
  | "spin"
  | "flicker"
  | "breathe"
  | "lift";

export type FigureMotion = {
  /** Omit to move the whole figure. */
  group?: string;
  kind: FigureMotionKind;
  period?: number;
  amount?: number;
  phase?: number;
  /** Local 3D pivot. Defaults to the group's projected bounds centre. */
  pivot?: Point3;
};

export type SceneFigure = {
  faces: FigureFace[];
  motions?: FigureMotion[];
  /** Screen-space downward press, in fit units, when the figure is hovered. */
  press?: number;
};

export type Foot =
  | { kind: "rect"; x: number; y: number; w: number; d: number; r: number }
  | { kind: "circle"; x: number; y: number; r: number }
  | { kind: "poly"; points: ReadonlyArray<ReadonlyArray<number>> };

export type DetailTone = "edge" | "hi" | "mid" | "lo" | "active";

export type Detail =
  | {
      kind: "bar";
      x: number;
      y: number;
      w: number;
      d: number;
      r?: number;
      tone?: DetailTone;
    }
  | { kind: "dot"; x: number; y: number; r: number; tone?: DetailTone }
  | {
      kind: "line";
      points: ReadonlyArray<Point2>;
      tone?: DetailTone;
      closed?: boolean;
    }
  | { kind: "ring"; x: number; y: number; r: number; tone?: DetailTone };

export type FlatBlock = {
  kind?: "prism";
  id: string;
  foot: Foot;
  /** Local z of the bottom face. Defaults to the plate top. */
  base?: number;
  /** Resting height of the prism. */
  height: number;
  /** Floating blocks move their whole body down instead of shrinking. */
  float?: boolean;
  /** Static blocks never react to the pointer. */
  static?: boolean;
  details?: Detail[];
};

/** A flat mark engraved on the vertical face of a sprite. */
export type SpriteDetail =
  | {
      kind: "line";
      points: ReadonlyArray<Point2>;
      tone?: DetailTone;
      closed?: boolean;
      group?: string;
    }
  | { kind: "dot"; x: number; y: number; r: number; tone?: DetailTone; group?: string }
  | { kind: "ring"; x: number; y: number; r: number; tone?: DetailTone; group?: string };

export type SpriteMotionKind =
  | "spin"
  | "pulse"
  | "breathe"
  | "blink"
  | "sway"
  | "bob"
  | "flicker"
  | "lift";

export type SpriteMotion = {
  kind: SpriteMotionKind;
  /** Detail group to animate. Omit to move the whole sprite. */
  target?: string;
  /** Duration of one cycle, in milliseconds. */
  period?: number;
  /** Degrees, units or scale delta depending on the kind. */
  amount?: number;
  /** 0..1 offset inside the cycle. */
  phase?: number;
  /** Local pivot for rotations and scales, in sprite units. */
  pivot?: Point2;
};

/**
 * A vertical cut-out standing on the plate. The outline lives in the local
 * (u, v) plane: u runs right and v runs up in screen space. The front face is
 * drawn at the projected base anchor; the back contour is shifted by
 * `thickness` along the plate's depth axis, which gives the second rim.
 */
export type SceneSprite = {
  kind: "sprite";
  id: string;
  /** Local x of the front face centre. */
  x: number;
  /** Local y of the front face. The back face sits at y - thickness. */
  y: number;
  /** Local z of the bottom edge. Defaults to the plate top. */
  z?: number;
  thickness: number;
  /** Closed loops, same winding. Overlapping loops are unioned. */
  outline: ReadonlyArray<ReadonlyArray<Point2>>;
  /** Closed loops with the opposite winding, cut out of the outline. */
  holes?: ReadonlyArray<ReadonlyArray<Point2>>;
  details?: SpriteDetail[];
  motion?: SpriteMotion[];
  /** Static sprites never react to the pointer. */
  static?: boolean;
};

export type SceneBlock = FlatBlock | SceneSprite;

export function isSprite(block: SceneBlock): block is SceneSprite {
  return (block as SceneSprite).kind === "sprite";
}

/**
 * Height of the surface the objects rest on. A scene either declares a plate,
 * an explicit base, or a static sole block that owns its ground. Scenes with
 * no plate still need this value so engraved wells and flat marks sit on the
 * object's own sole instead of disappearing underneath it.
 */
export function sceneBase(scene: SceneDefinition): number {
  if (scene.plate) return scene.plate.h;
  if (typeof scene.base === "number") return scene.base;
  let base = 0;
  for (const block of scene.blocks) {
    if (isSprite(block) || !block.static) continue;
    base = Math.max(base, (block.base ?? 0) + block.height);
  }
  return base;
}

/** Raw-projected (unscaled) points of a figure face, ignoring hover motion. */
export function rawFigurePoints(
  face: FigureFace,
): ReadonlyArray<Point2> {
  if (face.pts2) return face.pts2;
  if (!face.pts) return [];
  return face.pts.map(([x, y, z]) => {
    const p = rawProject(x, y, z);
    return [p.x, p.y] as const;
  });
}

export type SceneWell = {
  foot: Foot;
  /** Outward padding of the engraved ring. */
  pad?: number;
  tone?: "lo" | "mid";
  /** Draw the whole groove instead of the camera-facing arc. */
  full?: boolean;
};

export type SceneDefinition = {
  slug: string;
  name: string;
  family: string;
  collection: string;
  description: string;
  /** Full sentence used as the accessible description of the figure. */
  aria: string;
  /** Explicit resting surface when there is no plate. */
  base?: number;
  plate?: {
    x: number;
    y: number;
    w: number;
    d: number;
    r: number;
    h: number;
  } | null;
  wells?: SceneWell[];
  /** Flat marks engraved on the plate top. */
  marks?: Detail[];
  blocks: SceneBlock[];
  /**
   * A hand-authored real-world object (v4). When present the figure replaces
   * the plate, wells and blocks: the object stands on its own, no base slab.
   */
  figure?: SceneFigure;
  /** Index of the block that is lit at rest. */
  active?: number;
};

export type Camera = {
  scale: number;
  ox: number;
  oy: number;
};

export type Projected = { x: number; y: number };

const C = Math.SQRT1_2;
const K = 0.5;
const ZH = Math.sqrt(1 - K * K);
const ARC_STEPS = 5;
const CIRCLE_STEPS = 48;
const FIT = { width: 400, height: 320, padX: 55, padY: 42, cy: 161 };

export const LINEAR_TIMING = {
  sink: 6.5,
  floor: 1.4,
  lift: 2.2,
  depth: 700,
  stagger: 45,
  color: 260,
  touchLeave: 1400,
} as const;

/* -------------------------------------------------------------------------- */
/* Projection                                                                  */
/* -------------------------------------------------------------------------- */

export function rawProject(x: number, y: number, z: number): Projected {
  return {
    x: (x - y) * C,
    y: (x + y) * C * K - z * ZH,
  };
}

export function project(
  camera: Camera,
  x: number,
  y: number,
  z: number,
): Projected {
  const p = rawProject(x, y, z);
  return {
    x: camera.ox + camera.scale * p.x,
    y: camera.oy + camera.scale * p.y,
  };
}

/**
 * Sprites are billboards: their local (u, v) plane is mapped to screen space,
 * one unit per projected unit. The base anchor still sits on the isometric
 * plate, and the back face is shifted along the plate's depth axis.
 */
export function spritePoint(
  camera: Camera,
  sprite: SceneSprite,
  u: number,
  v: number,
  z: number,
  back = false,
): Projected {
  const anchor = rawProject(sprite.x, sprite.y, z);
  const bx =
    anchor.x + u + (back ? sprite.thickness * C : 0);
  const by =
    anchor.y - v - (back ? sprite.thickness * C * K : 0);
  return {
    x: camera.ox + camera.scale * bx,
    y: camera.oy + camera.scale * by,
  };
}

/**
 * Inverse of `project` on a horizontal plane at height z. Used for pointer
 * hit-testing: every scene object is a vertical extrusion of its footprint,
 * so testing the footprint at the plate height is enough.
 */
export function unproject(
  camera: Camera,
  sx: number,
  sy: number,
  z: number,
): Projected {
  const px = (sx - camera.ox) / camera.scale;
  const py = (sy - camera.oy) / camera.scale;
  const dx = px / C;
  const sum = (py + z * ZH) / (C * K);
  return { x: (dx + sum) / 2, y: (sum - dx) / 2 };
}

/* -------------------------------------------------------------------------- */
/* Footprints                                                                  */
/* -------------------------------------------------------------------------- */

type OutlinePoint = { x: number; y: number; nx: number; ny: number };

function push(
  out: OutlinePoint[],
  x: number,
  y: number,
  nx: number,
  ny: number,
) {
  const last = out[out.length - 1];
  if (
    last &&
    Math.abs(last.x - x) < 0.0001 &&
    Math.abs(last.y - y) < 0.0001
  ) {
    return;
  }
  out.push({ x, y, nx, ny });
}

function corner(
  out: OutlinePoint[],
  cx: number,
  cy: number,
  r: number,
  from: number,
  to: number,
) {
  for (let index = 1; index <= ARC_STEPS; index += 1) {
    const a = from + ((to - from) * index) / ARC_STEPS;
    push(out, cx + Math.cos(a) * r, cy + Math.sin(a) * r, Math.cos(a), Math.sin(a));
  }
}

export function outlineFor(foot: Foot): OutlinePoint[] {
  if (foot.kind === "rect") {
    const { x, y, w, d } = foot;
    const radius = Math.max(0, Math.min(foot.r, Math.min(w, d) / 2));
    const out: OutlinePoint[] = [];
    if (radius <= 0.0001) {
      push(out, x, y, 0, -1);
      push(out, x + w, y, 0, -1);
      push(out, x + w, y + d, 0, 1);
      push(out, x, y + d, 0, 1);
      return out;
    }
    push(out, x + radius, y, 0, -1);
    push(out, x + w - radius, y, 0, -1);
    corner(out, x + w - radius, y + radius, radius, -Math.PI / 2, 0);
    push(out, x + w, y + d - radius, 1, 0);
    corner(out, x + w - radius, y + d - radius, radius, 0, Math.PI / 2);
    push(out, x + radius, y + d, 0, 1);
    corner(out, x + radius, y + d - radius, radius, Math.PI / 2, Math.PI);
    push(out, x, y + radius, -1, 0);
    corner(out, x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
    return out;
  }

  if (foot.kind === "circle") {
    const out: OutlinePoint[] = [];
    for (let index = 0; index < CIRCLE_STEPS; index += 1) {
      const a = (index / CIRCLE_STEPS) * Math.PI * 2;
      const nx = Math.cos(a);
      const ny = Math.sin(a);
      out.push({
        x: foot.x + nx * foot.r,
        y: foot.y + ny * foot.r,
        nx,
        ny,
      });
    }
    return out;
  }

  const points = foot.points.map(([x, y]) => ({ x, y }));
  let area = 0;
  for (let index = 0; index < points.length; index += 1) {
    const a = points[index];
    const b = points[(index + 1) % points.length];
    area += a.x * b.y - b.x * a.y;
  }
  if (area < 0) points.reverse();

  const out: OutlinePoint[] = [];
  for (let index = 0; index < points.length; index += 1) {
    const a = points[index];
    const b = points[(index + 1) % points.length];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.hypot(dx, dy) || 1;
    const nx = dy / length;
    const ny = -dx / length;
    push(out, a.x, a.y, nx, ny);
  }
  return out;
}

export function expandFoot(foot: Foot, pad: number): Foot {
  if (foot.kind === "rect") {
    return {
      kind: "rect",
      x: foot.x - pad,
      y: foot.y - pad,
      w: foot.w + pad * 2,
      d: foot.d + pad * 2,
      r: foot.r + pad,
    };
  }
  if (foot.kind === "circle") {
    return { kind: "circle", x: foot.x, y: foot.y, r: foot.r + pad };
  }
  const cx =
    foot.points.reduce((sum, point) => sum + point[0], 0) / foot.points.length;
  const cy =
    foot.points.reduce((sum, point) => sum + point[1], 0) / foot.points.length;
  return {
    kind: "poly",
    points: foot.points.map(([x, y]) => {
      const dx = x - cx;
      const dy = y - cy;
      const length = Math.hypot(dx, dy) || 1;
      return [x + (dx / length) * pad, y + (dy / length) * pad] as const;
    }),
  };
}

export function footCenter(foot: Foot): Projected {
  if (foot.kind === "rect") {
    return { x: foot.x + foot.w / 2, y: foot.y + foot.d / 2 };
  }
  if (foot.kind === "circle") return { x: foot.x, y: foot.y };
  return {
    x: foot.points.reduce((sum, point) => sum + point[0], 0) / foot.points.length,
    y: foot.points.reduce((sum, point) => sum + point[1], 0) / foot.points.length,
  };
}

/** Painter order: larger x+y is closer to the camera. */
export function footDepth(foot: Foot): number {
  const center = footCenter(foot);
  return center.x + center.y;
}

export function footContains(foot: Foot, x: number, y: number): boolean {
  if (foot.kind === "rect") {
    return (
      x >= foot.x && x <= foot.x + foot.w && y >= foot.y && y <= foot.y + foot.d
    );
  }
  if (foot.kind === "circle") {
    return Math.hypot(x - foot.x, y - foot.y) <= foot.r;
  }
  let inside = false;
  const points = foot.points;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    if (
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi || 0.000001) + xi
    ) {
      inside = !inside;
    }
  }
  return inside;
}

/* -------------------------------------------------------------------------- */
/* Paths                                                                       */
/* -------------------------------------------------------------------------- */

function n(value: number) {
  return Math.round(value * 100) / 100;
}

export function pathFrom(points: Projected[], closed = false): string {
  if (points.length === 0) return "";
  let d = `M${n(points[0].x)} ${n(points[0].y)}`;
  for (let index = 1; index < points.length; index += 1) {
    d += `L${n(points[index].x)} ${n(points[index].y)}`;
  }
  if (closed) d += "Z";
  return d;
}

function cross(o: Projected, a: Projected, b: Projected) {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

export function convexHull(points: Projected[]): Projected[] {
  const sorted = points
    .slice()
    .sort((a, b) => a.x - b.x || a.y - b.y)
    .filter(
      (point, index, list) =>
        index === 0 ||
        Math.abs(point.x - list[index - 1].x) > 0.0001 ||
        Math.abs(point.y - list[index - 1].y) > 0.0001,
    );
  if (sorted.length <= 1) return sorted;
  const lower: Projected[] = [];
  for (const point of sorted) {
    while (
      lower.length >= 2 &&
      cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0
    ) {
      lower.pop();
    }
    lower.push(point);
  }
  const upper: Projected[] = [];
  for (let index = sorted.length - 1; index >= 0; index -= 1) {
    const point = sorted[index];
    while (
      upper.length >= 2 &&
      cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0
    ) {
      upper.pop();
    }
    upper.push(point);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

function projectOutline(
  camera: Camera,
  outline: OutlinePoint[],
  z: number,
): Projected[] {
  return outline.map((point) => project(camera, point.x, point.y, z));
}

/**
 * Closed silhouette of a vertical extrusion: the convex hull of the footprint
 * seen at the bottom and at the top. This is the path that occludes everything
 * behind it when filled with the plate colour.
 */
export function prismPath(
  camera: Camera,
  foot: Foot,
  z0: number,
  z1: number,
): string {
  const outline = outlineFor(foot);
  const points = [
    ...projectOutline(camera, outline, z0),
    ...projectOutline(camera, outline, z1),
  ];
  return pathFrom(convexHull(points), true);
}

/**
 * The camera-facing half of the top contour: the lower bevel edge.
 * A segment faces the camera when its local outward normal has a positive
 * x+y component.
 */
export function frontArcPath(camera: Camera, foot: Foot, z: number): string {
  const outline = outlineFor(foot);
  const count = outline.length;
  if (count === 0) return "";
  const facing = (point: OutlinePoint) => point.nx + point.ny > 0.0001;
  let start = -1;
  for (let index = 0; index < count; index += 1) {
    const previous = outline[(index - 1 + count) % count];
    if (facing(outline[index]) && !facing(previous)) {
      start = index;
      break;
    }
  }
  if (start < 0) return "";
  const arc: Projected[] = [];
  for (let step = 0; step < count; step += 1) {
    const point = outline[(start + step) % count];
    if (!facing(point)) break;
    arc.push(project(camera, point.x, point.y, z));
  }
  return pathFrom(arc, false);
}

/** Closed outline of a flat shape lying on a horizontal plane. */
export function flatPath(camera: Camera, foot: Foot, z: number): string {
  return pathFrom(projectOutline(camera, outlineFor(foot), z), true);
}

export function isoEllipse(
  camera: Camera,
  x: number,
  y: number,
  z: number,
  r: number,
) {
  const center = project(camera, x, y, z);
  return {
    cx: n(center.x),
    cy: n(center.y),
    rx: n(r * camera.scale),
    ry: n(r * camera.scale * K),
  };
}

/* -------------------------------------------------------------------------- */
/* Camera                                                                      */
/* -------------------------------------------------------------------------- */

function rawEllipsePoints(
  x: number,
  y: number,
  z: number,
  r: number,
): Projected[] {
  const center = rawProject(x, y, z);
  return [
    { x: center.x - r, y: center.y - r * K },
    { x: center.x + r, y: center.y + r * K },
  ];
}

export function circlePoints(
  x: number,
  y: number,
  r: number,
  steps = 24,
): Point2[] {
  return Array.from({ length: steps }, (_, index) => {
    const angle = (index / steps) * Math.PI * 2;
    return [x + Math.cos(angle) * r, y + Math.sin(angle) * r] as const;
  });
}

export function spriteDetailPoints(detail: SpriteDetail): Point2[] {
  if (detail.kind === "line") return [...detail.points];
  return circlePoints(detail.x, detail.y, detail.r, detail.kind === "dot" ? 16 : 24);
}

function detailRawPoints(detail: Detail, z: number): Projected[] {
  if (detail.kind === "bar") {
    return outlineFor({
      kind: "rect",
      x: detail.x,
      y: detail.y,
      w: detail.w,
      d: detail.d,
      r: detail.r ?? 0,
    }).map((point) => rawProject(point.x, point.y, z));
  }
  if (detail.kind === "dot" || detail.kind === "ring") {
    return rawEllipsePoints(detail.x, detail.y, z, detail.r);
  }
  return detail.points.map(([x, y]) => rawProject(x, y, z));
}

export function buildCamera(scene: SceneDefinition): Camera {
  const points: Projected[] = [];
  const plateTop = sceneBase(scene);

  if (scene.plate) {
    const outline = outlineFor({
      kind: "rect",
      x: scene.plate.x,
      y: scene.plate.y,
      w: scene.plate.w,
      d: scene.plate.d,
      r: scene.plate.r,
    });
    points.push(...outline.map((point) => rawProject(point.x, point.y, 0)));
    points.push(
      ...outline.map((point) => rawProject(point.x, point.y, scene.plate!.h)),
    );
  }

  for (const well of scene.wells ?? []) {
    const foot = expandFoot(well.foot, well.pad ?? 3);
    points.push(
      ...outlineFor(foot).map((point) =>
        rawProject(point.x, point.y, plateTop),
      ),
    );
  }

  for (const detail of scene.marks ?? []) {
    points.push(...detailRawPoints(detail, plateTop));
  }

  for (const block of scene.blocks) {
    if (isSprite(block)) {
      const z0 = block.z ?? plateTop;
      const anchor = rawProject(block.x, block.y, z0);
      const back = {
        x: block.thickness * C,
        y: -block.thickness * C * K,
      };
      for (const loop of [...block.outline, ...(block.holes ?? [])]) {
        for (const [u, v] of loop) {
          points.push({ x: anchor.x + u, y: anchor.y - v });
          points.push({ x: anchor.x + u + back.x, y: anchor.y - v + back.y });
        }
      }
      for (const detail of block.details ?? []) {
        for (const [u, v] of spriteDetailPoints(detail)) {
          points.push({ x: anchor.x + u, y: anchor.y - v });
        }
      }
      continue;
    }
    const base = block.base ?? plateTop;
    const z0 = block.float ? base : base;
    const z1 = base + block.height;
    points.push(
      ...outlineFor(block.foot).map((point) => rawProject(point.x, point.y, z0)),
      ...outlineFor(block.foot).map((point) => rawProject(point.x, point.y, z1)),
    );
    for (const detail of block.details ?? []) {
      points.push(...detailRawPoints(detail, z1));
    }
  }

  if (scene.figure) {
    for (const face of scene.figure.faces) {
      for (const [x, y] of rawFigurePoints(face)) {
        points.push({ x, y });
      }
    }
  }

  if (points.length === 0) return { scale: 1, ox: 200, oy: 160 };

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

  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const scale = Math.min(
    2.15,
    (FIT.width - FIT.padX * 2) / width,
    (FIT.height - FIT.padY * 2) / height,
  );
  return {
    scale,
    ox: FIT.width / 2 - scale * (minX + maxX) / 2,
    oy: FIT.cy - scale * (minY + maxY) / 2,
  };
}

/* -------------------------------------------------------------------------- */
/* Easing                                                                      */
/* -------------------------------------------------------------------------- */

function bezierComponent(t: number, p1: number, p2: number) {
  const mt = 1 - t;
  return 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t;
}

function bezierDerivative(t: number, p1: number, p2: number) {
  const mt = 1 - t;
  return 3 * mt * mt * p1 + 6 * mt * t * (p2 - p1) + 3 * t * t * (1 - p2);
}

/**
 * Same curve as the reference study: cubic-bezier(0.32, 0.72, 0, 1).
 * Solved on x with Newton, then bisection as a fallback.
 */
export function easeDepth(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const x1 = 0.32;
  const y1 = 0.72;
  const x2 = 0;
  const y2 = 1;
  let u = t;
  for (let index = 0; index < 8; index += 1) {
    const x = bezierComponent(u, x1, x2) - t;
    const dx = bezierDerivative(u, x1, x2);
    if (Math.abs(x) < 0.00001) break;
    if (Math.abs(dx) < 0.00001) break;
    u -= x / dx;
    if (u < 0) u = 0;
    if (u > 1) u = 1;
  }
  if (Math.abs(bezierComponent(u, x1, x2) - t) > 0.001) {
    let low = 0;
    let high = 1;
    for (let index = 0; index < 20; index += 1) {
      u = (low + high) / 2;
      const x = bezierComponent(u, x1, x2);
      if (x < t) low = u;
      else high = u;
    }
    u = (low + high) / 2;
  }
  return bezierComponent(u, y1, y2);
}

export function sceneBlockDepth(block: SceneBlock) {
  /* A billboard stands on the front half of its socle: a small bias keeps it
     painted after the slab it rests on, instead of being clipped by it. */
  return isSprite(block) ? block.x + block.y + 30 : footDepth(block.foot);
}

export function blockBase(block: FlatBlock, plateTop: number) {
  return block.base ?? plateTop;
}

export function blockTop(
  block: FlatBlock,
  plateTop: number,
  delta: number,
) {
  const base = blockBase(block, plateTop);
  if (block.float) return base + delta + block.height;
  return base + Math.max(LINEAR_TIMING.floor, block.height + delta);
}

export function blockBottom(
  block: FlatBlock,
  plateTop: number,
  delta: number,
) {
  const base = blockBase(block, plateTop);
  return block.float ? base + delta : base;
}

export function spriteBase(sprite: SceneSprite, plateTop: number, delta = 0) {
  return (sprite.z ?? plateTop) + delta;
}
