/*
 * Linear v4 — shared drawing kit for the generic Objects collection.
 *
 * These helpers are authored for this study only: they mirror the same 2:1
 * axonometric space, the same occluding fill and the same hairline as lots
 * 1-8, without copying any reference drawing. Every object still owns its
 * silhouette and its hover story.
 */

import type {
  DetailTone,
  FigureFace,
  Point2,
  Point3,
} from "./engine";
import {
  circle,
  convexHull,
  ellipse2,
  face2,
  face3,
  iso,
  stroke2,
  stroke3,
  type FaceOptions,
} from "./geom";

const TAU = Math.PI * 2;
const C = Math.SQRT1_2;
const K = 0.5;

export { TAU, C, K };

/* -------------------------------------------------------------------------- */
/* Vertical panels                                                            */
/* -------------------------------------------------------------------------- */

/** Flat panel on the vertical (x, z) plane at y = const. */
export function panel(
  x0: number,
  x1: number,
  y: number,
  z0: number,
  z1: number,
  opts: FaceOptions = {},
): FigureFace {
  return face3(
    [
      [x0, y, z0],
      [x1, y, z0],
      [x1, y, z1],
      [x0, y, z1],
    ],
    opts,
  );
}

/** Flat panel on the vertical (y, z) plane at x = const. */
export function sidePanel(
  y0: number,
  y1: number,
  x: number,
  z0: number,
  z1: number,
  opts: FaceOptions = {},
): FigureFace {
  return face3(
    [
      [x, y0, z0],
      [x, y1, z0],
      [x, y1, z1],
      [x, y0, z1],
    ],
    opts,
  );
}

/** Vertical rod between two z heights at a fixed (x, y). */
export function post(
  x: number,
  y: number,
  z0: number,
  z1: number,
  width = 2.4,
  tone: DetailTone = "edge",
  group?: string,
): FigureFace {
  return tube(
    [
      [x, y, z0],
      [x, y, z1],
    ],
    width,
    { tone, group },
  );
}

/* -------------------------------------------------------------------------- */
/* Circles and ellipses                                                       */
/* -------------------------------------------------------------------------- */

/** Projected circle standing on the horizontal plane at z. */
export function circleXZ(
  cx: number,
  cy: number,
  cz: number,
  r: number,
  steps = 32,
  start = 0,
): Point2[] {
  return Array.from({ length: steps }, (_, index) => {
    const a = start + (index / steps) * TAU;
    return iso(cx + Math.cos(a) * r, cy, cz + Math.sin(a) * r);
  });
}

/** Projected circle facing along x, i.e. laid in the (y, z) plane. */
export function circleYZ(
  x: number,
  cy: number,
  cz: number,
  r: number,
  steps = 32,
  start = 0,
): Point2[] {
  return Array.from({ length: steps }, (_, index) => {
    const a = start + (index / steps) * TAU;
    return iso(x, cy + Math.cos(a) * r, cz + Math.sin(a) * r);
  });
}

/** Screen-space ellipse rotated by `angle`, for leaves and horns. */
export function ellipseRot(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  angle: number,
  steps = 30,
): Point2[] {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  return Array.from({ length: steps }, (_, index) => {
    const a = (index / steps) * TAU;
    const u = Math.cos(a) * rx;
    const v = Math.sin(a) * ry;
    return [cx + u * ca - v * sa, cy + u * sa + v * ca] as Point2;
  });
}

/* -------------------------------------------------------------------------- */
/* Flat marks                                                                 */
/* -------------------------------------------------------------------------- */

/** Filled rounded flat plate at a height, used for paper and small cards. */
export function flatCard(
  cx: number,
  cy: number,
  z: number,
  w: number,
  d: number,
  r: number,
  opts: FaceOptions = {},
): FigureFace {
  return face2(
    rounded(cx - w / 2, cy - d / 2, w, d, r).map(([x, y]) => iso(x, y, z)),
    opts,
  );
}

/** Engraved line on a horizontal plane. */
export function flatLine(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  z: number,
  tone: DetailTone = "lo",
  group?: string,
): FigureFace {
  return face2([iso(x0, y0, z), iso(x1, y1, z)], {
    fill: false,
    tone,
    group,
  });
}

/** Small dot at a 3D point, drawn as a screen circle. */
export function dotAt(
  x: number,
  y: number,
  z: number,
  r: number,
  tone: DetailTone = "lo",
  group?: string,
): FigureFace {
  const [px, py] = iso(x, y, z);
  return face2(circle(px, py, r, 14), { tone, group });
}

/** Quad between four 3D points, filled (paper sheets, folded panels). */
export function quad(
  a: Point3,
  b: Point3,
  c: Point3,
  d: Point3,
  opts: FaceOptions = {},
): FigureFace {
  return face3([a, b, c, d], opts);
}

/** Round-cornered rectangle in the local plane. */
export function rounded(
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

/* -------------------------------------------------------------------------- */
/* Solids                                                                     */
/* -------------------------------------------------------------------------- */

/** Small sphere with one engraved highlight. */
export function ball(
  cx: number,
  cy: number,
  cz: number,
  r: number,
  opts: FaceOptions = {},
): FigureFace[] {
  const [px, py] = iso(cx, cy, cz);
  const arc: Point2[] = [];
  for (let index = 0; index <= 10; index += 1) {
    const a = Math.PI * (0.1 + (index / 10) * 0.32);
    arc.push([
      px + Math.cos(a) * r * 0.82,
      py - r * 0.16 + Math.sin(a) * r * 0.28,
    ]);
  }
  return [
    face2(circle(px, py, r, 30), { tone: "edge", ...opts }),
    face2(arc, { fill: false, tone: "lo", group: opts.group }),
  ];
}

/** A tapered bar between two projected points, useful for stems and horns. */
export function tapered(
  from: Point3,
  to: Point3,
  r0: number,
  r1: number,
  opts: FaceOptions = {},
  steps = 18,
): FigureFace[] {
  const a = iso(...from);
  const b = iso(...to);
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  return [
    face2(
      [
        [a[0] + nx * r0, a[1] + ny * r0],
        [b[0] + nx * r1, b[1] + ny * r1],
        [b[0] - nx * r1, b[1] - ny * r1],
        [a[0] - nx * r0, a[1] - ny * r0],
      ],
      { tone: opts.tone ?? "edge", group: opts.group },
    ),
    face2(circle(b[0], b[1], r1, steps), {
      tone: opts.tone ?? "mid",
      group: opts.group,
    }),
  ];
}

/** A pointed leaf in screen space, with a midrib. */
export function leaf(
  cx: number,
  cy: number,
  length: number,
  width: number,
  angle: number,
  opts: FaceOptions = {},
): FigureFace[] {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const at = (u: number, v: number): Point2 => [
    cx + u * ca - v * sa,
    cy + u * sa + v * ca,
  ];
  const outline: Point2[] = [];
  const steps = 12;
  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps;
    outline.push(
      at(-length * 0.5 + t * length, -width * 0.5 * Math.sin(Math.PI * t)),
    );
  }
  for (let index = steps - 1; index > 0; index -= 1) {
    const t = index / steps;
    outline.push(
      at(-length * 0.5 + t * length, width * 0.5 * Math.sin(Math.PI * t)),
    );
  }
  return [
    face2(outline, { tone: "edge", ...opts }),
    stroke2([at(-length * 0.46, 0), at(length * 0.46, 0)], "lo", {
      group: opts.group,
    }),
  ];
}

/** A petal ring in screen space, for flowers and rosettes. */
export function petalRing(
  cx: number,
  cy: number,
  count: number,
  distance: number,
  length: number,
  width: number,
  rotation = 0,
  opts: FaceOptions = {},
): FigureFace[] {
  const faces: FigureFace[] = [];
  for (let index = 0; index < count; index += 1) {
    const a = rotation + (index / count) * TAU;
    const px = cx + Math.cos(a) * distance;
    const py = cy + Math.sin(a) * distance * 0.62;
    faces.push(...leaf(px, py, length, width, a, opts));
  }
  return faces;
}

/** Horizontal annulus, filled and engraved (donut, ring, wheel rim). */
export function annulus(
  cx: number,
  cy: number,
  z: number,
  outer: number,
  inner: number,
  opts: FaceOptions = {},
): FigureFace[] {
  return [
    face2(
      circle(0, 0, outer, 40).map(([x, y]) => iso(cx + x, cy + y, z)),
      { tone: opts.tone ?? "edge", group: opts.group },
    ),
    face2(
      circle(0, 0, inner, 34).map(([x, y]) => iso(cx + x, cy + y, z + 0.4)),
      { tone: "mid", group: opts.group },
    ),
    face2(
      circle(0, 0, inner * 0.72, 26).map(([x, y]) =>
        iso(cx + x, cy + y, z + 0.6),
      ),
      { fill: false, tone: "lo", group: opts.group },
    ),
  ];
}

/** A conical flame in screen space, with an inner tongue. */
export function flame(
  cx: number,
  cy: number,
  height: number,
  width: number,
  opts: FaceOptions = {},
): FigureFace[] {
  const outer: Point2[] = [
    [cx, cy - height],
    [cx + width * 0.5, cy - height * 0.46],
    [cx + width * 0.34, cy - height * 0.08],
    [cx, cy],
    [cx - width * 0.34, cy - height * 0.08],
    [cx - width * 0.5, cy - height * 0.46],
  ];
  const inner: Point2[] = [
    [cx, cy - height * 0.72],
    [cx + width * 0.22, cy - height * 0.3],
    [cx, cy - height * 0.04],
    [cx - width * 0.22, cy - height * 0.3],
  ];
  return [
    face2(outer, { tone: "edge", ...opts }),
    face2(inner, { tone: "hi", group: opts.group }),
  ];
}

/** A flat star in screen space (single loop). */
export function star(
  cx: number,
  cy: number,
  outer: number,
  inner = outer * 0.45,
  count = 5,
  rotation = -Math.PI / 2,
): Point2[] {
  const points: Point2[] = [];
  for (let index = 0; index < count * 2; index += 1) {
    const a = rotation + (index * Math.PI) / count;
    const r = index % 2 === 0 ? outer : inner;
    points.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.9]);
  }
  return points;
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

/** Pieces of a horizontal wheel seen edge-on: rim, spokes and hub. */
export function wheel(
  cx: number,
  cy: number,
  cz: number,
  R: number,
  opts: { group?: string; tone?: DetailTone; spokes?: number } = {},
): FigureFace[] {
  const faces: FigureFace[] = [
    face2(circleXZ(cx, cy, cz, R, 40), {
      fill: false,
      tone: opts.tone ?? "edge",
      group: opts.group,
    }),
    face2(circleXZ(cx, cy, cz, R - 3.4, 36), {
      fill: false,
      tone: "lo",
      group: opts.group,
    }),
  ];
  const spokes = opts.spokes ?? 8;
  for (let index = 0; index < spokes; index += 1) {
    const a = (index / spokes) * TAU;
    faces.push(
      stroke3(
        [
          [cx, cy, cz],
          [cx + Math.cos(a) * (R - 1.4), cy + Math.sin(a) * (R - 1.4), cz],
        ],
        "lo",
        { group: opts.group },
      ),
    );
  }
  return faces;
}

/** Front-facing half of a horizontal circle, engraved (threads, seams). */
export function frontRing(
  cx: number,
  cy: number,
  z: number,
  r: number,
  tone: DetailTone = "lo",
  group?: string,
  steps = 40,
): FigureFace {
  const points: Point2[] = [];
  for (let index = 0; index <= steps; index += 1) {
    const a = (index / steps) * TAU;
    if (Math.sin(a) + Math.cos(a) >= -0.001) {
      points.push(iso(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z));
    }
  }
  return face2(points, { fill: false, tone, group });
}

/** Horizontal drum along x: hull, near cap and an engraved rim. */
export function drumX(
  x0: number,
  x1: number,
  cy: number,
  cz: number,
  r: number,
  opts: {
    tone?: DetailTone;
    topTone?: DetailTone;
    group?: string;
    rim?: boolean;
    rimScale?: number;
  } = {},
  steps = 28,
): FigureFace[] {
  const far = circleYZ(x0, cy, cz, r, steps);
  const near = circleYZ(x1, cy, cz, r, steps);
  const faces: FigureFace[] = [
    face2(convexHull([...far, ...near]), {
      tone: opts.tone ?? "edge",
      group: opts.group,
    }),
    face2(near, { tone: opts.topTone ?? "mid", group: opts.group }),
  ];
  if (opts.rim !== false) {
    faces.push(
      face2(circleYZ(x1, cy, cz, Math.max(1, r * (opts.rimScale ?? 0.58)), 24), {
        fill: false,
        tone: "lo",
        group: opts.group,
      }),
    );
  }
  return faces;
}

/** Horizontal drum along y: hull, near cap and an engraved rim. */
export function drumY(
  y0: number,
  y1: number,
  cx: number,
  cz: number,
  r: number,
  opts: {
    tone?: DetailTone;
    topTone?: DetailTone;
    group?: string;
    rim?: boolean;
    rimScale?: number;
  } = {},
  steps = 28,
): FigureFace[] {
  const far = circleXZ(cx, y0, cz, r, steps);
  const near = circleXZ(cx, y1, cz, r, steps);
  const faces: FigureFace[] = [
    face2(convexHull([...far, ...near]), {
      tone: opts.tone ?? "edge",
      group: opts.group,
    }),
    face2(near, { tone: opts.topTone ?? "mid", group: opts.group }),
  ];
  if (opts.rim !== false) {
    faces.push(
      face2(circleXZ(cx, y1, cz, Math.max(1, r * (opts.rimScale ?? 0.58)), 24), {
        fill: false,
        tone: "lo",
        group: opts.group,
      }),
    );
  }
  return faces;
}

/** Short arc on a vertical plane, engraved. */
export function arc(
  cx: number,
  cy: number,
  cz: number,
  R: number,
  from: number,
  to: number,
  plane: "xz" | "yz" = "xz",
  tone: DetailTone = "mid",
  group?: string,
  steps = 20,
): FigureFace {
  const points: Point3[] = [];
  for (let index = 0; index <= steps; index += 1) {
    const a = from + ((to - from) * index) / steps;
    const u = cx + Math.cos(a) * R;
    const v = cz + Math.sin(a) * R;
    points.push(plane === "xz" ? [u, cy, v] : [cx, u, v]);
  }
  return stroke3(points, tone, { group });
}

/** Close a screen-space polygon as an engraved loop. */
export function loop(
  points: ReadonlyArray<Point2>,
  tone: DetailTone = "mid",
  group?: string,
): FigureFace {
  return face2([...points, points[0]], { fill: false, tone, group });
}

/** A shallow dome in screen space: full cap ellipse plus a raised top arc. */
export function dome(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  rise: number,
  opts: FaceOptions = {},
): FigureFace[] {
  const cap = ellipse2(cx, cy, rx, ry, 40);
  const top: Point2[] = [];
  const steps = 24;
  for (let index = 0; index <= steps; index += 1) {
    const a = Math.PI + (index / steps) * Math.PI;
    top.push([
      cx + Math.cos(a) * rx,
      cy + Math.sin(a) * ry - rise * Math.sin((index / steps) * Math.PI),
    ]);
  }
  return [
    face2(cap, { tone: opts.tone ?? "edge", group: opts.group }),
    face2(top, { fill: false, tone: "lo", group: opts.group }),
  ];
}

/** Convex silhouette of several projected points, filled with the plate tone. */
export function hull(
  points: ReadonlyArray<Point2>,
  opts: FaceOptions = {},
): FigureFace {
  return face2(convexHull([...points]), opts);
}
