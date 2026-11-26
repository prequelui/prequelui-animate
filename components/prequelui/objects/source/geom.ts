/*
 * Linear v4 prototypes — small isometric drawing kit.
 *
 * The prototypes in this folder are a deliberate, separate study: one real
 * object per component, no shared slab, recognisable by silhouette at 64 px.
 * The geometry is authored in the same 2:1 axonometric space as the public
 * engine (x toward viewer-right, y toward viewer-left, z up) and projected
 * with the exact same formula. Faces are painted back to front and filled
 * with the plate tone, so a face hides the construction behind it; engraved
 * details are open strokes. No filters, no gradients, no masks.
 */

import type {
  DetailTone,
  FigureFace,
  FigureMotion,
  Point2,
  Point3,
  SceneDefinition,
  SceneFigure,
} from "./engine";

const C = Math.SQRT1_2;
const K = 0.5;
const ZH = Math.sqrt(1 - K * K);
const TAU = Math.PI * 2;

export type FaceOptions = {
  fill?: boolean;
  stroke?: boolean;
  tone?: DetailTone;
  group?: string;
  closed?: boolean;
};

export function iso(x: number, y: number, z: number): Point2 {
  return [(x - y) * C, (x + y) * C * K - z * ZH];
}

export function face3(points: ReadonlyArray<Point3>, opts: FaceOptions = {}): FigureFace {
  return { pts: points, ...opts };
}

export function face2(points: ReadonlyArray<Point2>, opts: FaceOptions = {}): FigureFace {
  return { pts2: points, ...opts };
}

export function stroke3(
  points: ReadonlyArray<Point3>,
  tone: DetailTone = "mid",
  opts: FaceOptions = {},
): FigureFace {
  return face3(points, { fill: false, tone, closed: false, ...opts });
}

export function stroke2(
  points: ReadonlyArray<Point2>,
  tone: DetailTone = "mid",
  opts: FaceOptions = {},
): FigureFace {
  return face2(points, { fill: false, tone, closed: false, ...opts });
}

export function circle(cx: number, cy: number, r: number, steps = 40, start = 0): Point2[] {
  return Array.from({ length: steps }, (_, index) => {
    const a = start + (index / steps) * TAU;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as Point2;
  });
}

export function ellipse2(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  steps = 40,
  start = 0,
): Point2[] {
  return Array.from({ length: steps }, (_, index) => {
    const a = start + (index / steps) * TAU;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as Point2;
  });
}

export function roundedRect(
  x: number,
  y: number,
  w: number,
  d: number,
  r = 0,
  steps = 5,
): Point2[] {
  const rad = Math.max(0, Math.min(r, Math.min(w, d) / 2));
  if (rad <= 0.001) {
    return [
      [x, y],
      [x + w, y],
      [x + w, y + d],
      [x, y + d],
    ];
  }
  const points: Point2[] = [];
  const corner = (cx: number, cy: number, from: number, to: number) => {
    for (let index = 0; index <= steps; index += 1) {
      const a = from + ((to - from) * index) / steps;
      points.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
    }
  };
  points.push([x + rad, y], [x + w - rad, y]);
  corner(x + w - rad, y + rad, -Math.PI / 2, 0);
  points.push([x + w, y + d - rad]);
  corner(x + w - rad, y + d - rad, 0, Math.PI / 2);
  points.push([x + rad, y + d]);
  corner(x + rad, y + d - rad, Math.PI / 2, Math.PI);
  points.push([x, y + rad]);
  corner(x + rad, y + rad, Math.PI, Math.PI * 1.5);
  return points;
}

/**
 * Stable depth order across server and browser. Engines may differ by an ulp
 * on sin/cos, which used to swap two almost coplanar sides and make the
 * server HTML mismatch the client tree. Rounding the key keeps the order
 * identical everywhere; equal keys keep their authoring order (stable sort).
 */
export function byDepth(
  a: { depth: number },
  b: { depth: number },
): number {
  return Math.round(a.depth * 1e6) - Math.round(b.depth * 1e6);
}

export function convexHull(points: ReadonlyArray<Point2>): Point2[] {
  /* Quantise the input itself: the hull drives the outline path, and Node and
     the browser can disagree by an ulp on trig results. Rounding to 1e-6 is
     invisible at 64 px and makes the emitted path identical in both. */
  const snap = (value: number) => Math.round(value * 1e6) / 1e6;
  const sorted = points
    .map(([x, y]) => [snap(x), snap(y)] as Point2)
    .sort(
      (a, b) =>
        Math.round(a[0] * 1e6) - Math.round(b[0] * 1e6) ||
        Math.round(a[1] * 1e6) - Math.round(b[1] * 1e6),
    )
    .filter(
      (point, index, list) =>
        index === 0 ||
        Math.abs(point[0] - list[index - 1][0]) > 0.0001 ||
        Math.abs(point[1] - list[index - 1][1]) > 0.0001,
    );
  if (sorted.length <= 1) return sorted;
  const cross = (o: Point2, a: Point2, b: Point2) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Point2[] = [];
  for (const point of sorted) {
    while (
      lower.length >= 2 &&
      cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0
    ) {
      lower.pop();
    }
    lower.push(point);
  }
  const upper: Point2[] = [];
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

function depthOf(a: Point2, b: Point2) {
  return (a[0] + b[0]) / 2 + (a[1] + b[1]) / 2;
}

/** Vertical prism from an XY footprint, with a clean outer silhouette. */
export function prism(
  footprint: ReadonlyArray<Point2>,
  z0: number,
  h: number,
  opts: FaceOptions & { lip?: boolean; frontLine?: boolean; topTone?: DetailTone } = {},
): FigureFace[] {
  const { lip = false, frontLine = false, topTone = "edge", tone = "edge", group } = opts;
  const z1 = z0 + h;
  const faces: FigureFace[] = [];
  const sides: Array<{ a: Point2; b: Point2; depth: number }> = [];
  for (let index = 0; index < footprint.length; index += 1) {
    const a = footprint[index];
    const b = footprint[(index + 1) % footprint.length];
    const nx = b[1] - a[1];
    const ny = -(b[0] - a[0]);
    if (nx + ny <= 0.0001) continue;
    sides.push({ a, b, depth: depthOf(a, b) });
  }
  sides.sort(byDepth);
  for (const side of sides) {
    faces.push(
      face3(
        [
          [side.a[0], side.a[1], z0],
          [side.b[0], side.b[1], z0],
          [side.b[0], side.b[1], z1],
          [side.a[0], side.a[1], z1],
        ],
        { tone, stroke: false, group },
      ),
    );
  }
  faces.push(
    face3(
      footprint.map(([x, y]) => [x, y, z1] as Point3),
      { tone: topTone, group },
    ),
  );
  const outline = convexHull([
    ...footprint.map(([x, y]) => iso(x, y, z0)),
    ...footprint.map(([x, y]) => iso(x, y, z1)),
  ]);
  faces.push(face2(outline, { fill: false, tone, group }));
  if (lip) {
    const cx = footprint.reduce((sum, p) => sum + p[0], 0) / footprint.length;
    const cy = footprint.reduce((sum, p) => sum + p[1], 0) / footprint.length;
    const inset = footprint.map(([px, py]) => {
      const dx = px - cx;
      const dy = py - cy;
      const len = Math.hypot(dx, dy) || 1;
      const pad = Math.min(3, len * 0.14);
      return [px - (dx / len) * pad, py - (dy / len) * pad, z1] as Point3;
    });
    faces.push(face3(inset, { fill: false, tone: "mid", group }));
  }
  if (frontLine) {
    let front = footprint[0];
    for (const point of footprint) {
      if (point[0] + point[1] > front[0] + front[1]) front = point;
    }
    faces.push(
      face3(
        [
          [front[0], front[1], z0],
          [front[0], front[1], z1],
        ],
        { fill: false, tone: "lo", group },
      ),
    );
  }
  return faces;
}

export function box(
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number,
  opts: FaceOptions & { r?: number; lip?: boolean; topTone?: DetailTone } = {},
): FigureFace[] {
  return prism(roundedRect(x, y, w, d, opts.r ?? 0), z, h, {
    ...opts,
    tone: opts.tone ?? "edge",
  });
}

/** Vertical cylinder or frustum. */
export function cylinder(
  cx: number,
  cy: number,
  z0: number,
  h: number,
  r0: number,
  r1 = r0,
  opts: FaceOptions & {
    sides?: number;
    hollow?: number;
    topTone?: DetailTone;
    bottomArc?: boolean;
    taperLines?: number;
    wallTone?: DetailTone;
  } = {},
): FigureFace[] {
  const {
    sides = 34,
    hollow = 0,
    topTone = "mid",
    tone = "edge",
    bottomArc = false,
    taperLines = 0,
    wallTone = "lo",
    group,
  } = opts;
  const z1 = z0 + h;
  const bottom = circle(cx, cy, r0, sides);
  const top = circle(cx, cy, r1, sides);
  const quads: Array<{ a0: Point2; b0: Point2; a1: Point2; b1: Point2; depth: number }> = [];
  for (let index = 0; index < sides; index += 1) {
    const a0 = bottom[index];
    const b0 = bottom[(index + 1) % sides];
    const a1 = top[index];
    const b1 = top[(index + 1) % sides];
    const nx = b0[1] - a0[1];
    const ny = -(b0[0] - a0[0]);
    if (r1 > 0.01 && nx + ny <= 0.0001) continue;
    quads.push({ a0, b0, a1, b1, depth: depthOf(a0, b0) });
  }
  quads.sort(byDepth);
  const faces: FigureFace[] = [];
  for (const quad of quads) {
    faces.push(
      face3(
        [
          [quad.a0[0], quad.a0[1], z0],
          [quad.b0[0], quad.b0[1], z0],
          [quad.b1[0], quad.b1[1], z1],
          [quad.a1[0], quad.a1[1], z1],
        ],
        { tone, stroke: false, group },
      ),
    );
  }
  faces.push(
    face2(
      top.map(([x, y]) => iso(x, y, z1)),
      { tone: topTone, group },
    ),
  );
  const outline = convexHull([
    ...bottom.map(([x, y]) => iso(x, y, z0)),
    ...top.map(([x, y]) => iso(x, y, z1)),
  ]);
  faces.push(face2(outline, { fill: false, tone, group }));
  if (hollow > 0) {
    const inner = Math.max(0.4, r1 - hollow);
    faces.push(
      face2(
        circle(cx, cy, inner, sides).map(([x, y]) => iso(x, y, z1)),
        { tone: wallTone, group },
      ),
    );
  }
  if (bottomArc) {
    const front: Point2[] = [];
    for (let index = 0; index <= sides; index += 1) {
      const a = (index / sides) * TAU;
      if (Math.sin(a) + Math.cos(a) >= -0.001) {
        front.push(iso(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, z0));
      }
    }
    if (front.length > 1) faces.push(face2(front, { fill: false, tone: "lo", group }));
  }
  if (taperLines > 0) {
    for (let line = 1; line <= taperLines; line += 1) {
      const t = line / (taperLines + 1);
      const z = z0 + h * t;
      const r = r0 + (r1 - r0) * t;
      faces.push(
        face2(
          circle(cx, cy, r, sides).map(([x, y]) => iso(x, y, z)),
          { fill: false, tone: "lo", group },
        ),
      );
    }
  }
  return faces;
}

/** Flat ellipse on a horizontal plane, used for engraved rims and surfaces. */
export function ellipse3(
  cx: number,
  cy: number,
  z: number,
  rx: number,
  ry = rx,
  opts: FaceOptions = {},
  steps = 40,
): FigureFace {
  return face2(
    circle(0, 0, 1, steps).map(([x, y]) => iso(cx + x * rx, cy + y * ry, z)),
    opts,
  );
}

/** Flat vertical disc in the xz or yz plane. */
export function disc3(
  cx: number,
  cy: number,
  cz: number,
  r: number,
  plane: "xz" | "yz" = "xz",
  opts: FaceOptions = {},
  steps = 38,
): FigureFace {
  return face2(
    circle(0, 0, r, steps).map(([u, v]) =>
      plane === "xz" ? iso(cx + u, cy, cz + v) : iso(cx, cy + u, cz + v),
    ),
    opts,
  );
}

/** A vertical torus / wheel in a plane, drawn as an outer and an inner loop. */
export function ring(
  cx: number,
  cy: number,
  cz: number,
  R: number,
  r: number,
  plane: "xz" | "yz" = "xz",
  opts: FaceOptions = {},
  steps = 38,
): FigureFace[] {
  const outer: Point2[] = [];
  const inner: Point2[] = [];
  for (let index = 0; index < steps; index += 1) {
    const a = (index / steps) * TAU;
    const uo = cx + Math.cos(a) * (R + r);
    const vo = cz + Math.sin(a) * (R + r);
    const ui = cx + Math.cos(a) * Math.max(0.4, R - r);
    const vi = cz + Math.sin(a) * Math.max(0.4, R - r);
    outer.push(plane === "xz" ? iso(uo, cy, vo) : iso(cx, uo, vo));
    inner.push(plane === "xz" ? iso(ui, cy, vi) : iso(cx, ui, vi));
  }
  return [
    face2(outer, { tone: opts.tone ?? "edge", group: opts.group }),
    face2(inner, { tone: "lo", group: opts.group }),
  ];
}

/** A screen-space rod of constant width along a 3D polyline. */
export function tube(
  points3: ReadonlyArray<Point3>,
  width = 1.6,
  opts: FaceOptions = {},
): FigureFace {
  const pts = points3.map(([x, y, z]) => iso(x, y, z));
  const left: Point2[] = [];
  const right: Point2[] = [];
  for (let index = 0; index < pts.length; index += 1) {
    const prev = pts[Math.max(0, index - 1)];
    const next = pts[Math.min(pts.length - 1, index + 1)];
    let dx = next[0] - prev[0];
    let dy = next[1] - prev[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const nx = -dy * (width / 2);
    const ny = dx * (width / 2);
    left.push([pts[index][0] + nx, pts[index][1] + ny]);
    right.push([pts[index][0] - nx, pts[index][1] - ny]);
  }
  return face2([...left, ...right.reverse()], {
    tone: opts.tone ?? "edge",
    group: opts.group,
    fill: opts.fill ?? true,
  });
}

/** A closed screen-space polygon drawn as an open engraved line. */
export function loop2(points: ReadonlyArray<Point2>, tone: DetailTone = "mid", group?: string) {
  return face2([...points, points[0]], { fill: false, tone, group });
}

export function arc3(
  cx: number,
  cy: number,
  cz: number,
  R: number,
  from: number,
  to: number,
  plane: "xz" | "yz" = "xz",
  steps = 26,
): Point3[] {
  const points: Point3[] = [];
  for (let index = 0; index <= steps; index += 1) {
    const a = from + ((to - from) * index) / steps;
    const u = cx + Math.cos(a) * R;
    const v = cz + Math.sin(a) * R;
    points.push(plane === "xz" ? [u, cy, v] : [cx, u, v]);
  }
  return points;
}

export function star2(
  cx: number,
  cy: number,
  outer: number,
  inner = outer * 0.44,
  count = 5,
  rotation = -Math.PI / 2,
): Point2[] {
  const points: Point2[] = [];
  for (let index = 0; index < count * 2; index += 1) {
    const a = rotation + (index * Math.PI) / count;
    const r = index % 2 === 0 ? outer : inner;
    points.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return points;
}

/** Screen-space translation of a 3D point, useful for details on a face. */
export function at3(x: number, y: number, z: number, dx = 0, dy = 0): Point2 {
  const [px, py] = iso(x, y, z);
  return [px + dx, py + dy];
}

export type PrototypeMeta = {
  slug: string;
  name: string;
  component: string;
  object: string;
  story: string;
  note: string;
  scene: SceneDefinition;
  v3?: string;
};

export function figureScene(args: {
  slug: string;
  name: string;
  component: string;
  object: string;
  description: string;
  aria: string;
  faces: FigureFace[];
  motions?: FigureMotion[];
  press?: number;
}): SceneDefinition {
  const figure: SceneFigure = {
    faces: args.faces,
    motions: args.motions,
    press: args.press ?? 1.2,
  };
  return {
    slug: args.slug,
    name: args.name,
    family: args.component,
    collection: "Prototypes",
    description: args.description,
    aria: args.aria,
    blocks: [],
    plate: null,
    figure,
  };
}
