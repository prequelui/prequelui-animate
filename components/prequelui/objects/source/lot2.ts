/*
 * Linear v4 — lot 2 (components 26 to 50 of the object catalogue).
 *
 * Same rules as lot 1: one real-world object per component, drawn from
 * scratch in the shared 2:1 axonometric space, no slab under the object, a
 * silhouette that still reads at 64 px. Faces are painted back to front and
 * filled with the plate tone, so the nearest face hides the construction
 * behind it while the 0.9 px outline stays clean.
 *
 * Five components in this range already had a study drawing in `scenes.ts`
 * (spinner, status, avatar, video player, chat). Their object was chosen for
 * the same metaphor the catalogue asks for, so they are imported here rather
 * than redrawn with a second object: the numbered lot stays complete and no
 * object is silently duplicated.
 */

import type {
  DetailTone,
  FigureFace,
  Point2,
  Point3,
} from "./engine";
import {
  box,
  byDepth,
  circle,
  cylinder,
  disc3,
  ellipse2,
  ellipse3,
  face2,
  face3,
  figureScene,
  iso,
  prism,
  ring,
  roundedRect,
  star2,
  stroke2,
  stroke3,
  tube,
  type FaceOptions,
  type PrototypeMeta,
} from "./geom";
import {
  avatar,
  chat,
  spinner,
  status,
  videoPlayer,
} from "./scenes";

/* -------------------------------------------------------------------------- */
/* Local helpers                                                              */
/* -------------------------------------------------------------------------- */

const TAU = Math.PI * 2;

/** Flat panel on the vertical (x, z) plane at y = const. */
function panel(
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
function sidePanel(
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

/** Rounded rectangle on a vertical (x, z) plane at y = const. */
function vRound(
  cx: number,
  y: number,
  z0: number,
  w: number,
  h: number,
  r = 0,
  steps = 5,
): Point3[] {
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const z1 = z0 + h;
  const rad = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  if (rad <= 0.001) {
    return [
      [x0, y, z0],
      [x1, y, z0],
      [x1, y, z1],
      [x0, y, z1],
    ];
  }
  const points: Point3[] = [];
  const corner = (ax: number, az: number, from: number, to: number) => {
    for (let index = 0; index <= steps; index += 1) {
      const a = from + ((to - from) * index) / steps;
      points.push([ax + Math.cos(a) * rad, y, az + Math.sin(a) * rad]);
    }
  };
  points.push([x0 + rad, y, z0], [x1 - rad, y, z0]);
  corner(x1 - rad, z0 + rad, -Math.PI / 2, 0);
  points.push([x1, y, z0 + rad], [x1, y, z1 - rad]);
  corner(x1 - rad, z1 - rad, 0, Math.PI / 2);
  points.push([x1 - rad, y, z1], [x0 + rad, y, z1]);
  corner(x0 + rad, z1 - rad, Math.PI / 2, Math.PI);
  points.push([x0, y, z1 - rad], [x0, y, z0 + rad]);
  corner(x0 + rad, z0 + rad, Math.PI, Math.PI * 1.5);
  return points;
}

/** Quad strip between two concentric rings of 3D points. */
function ringBand(
  inner: ReadonlyArray<Point3>,
  outer: ReadonlyArray<Point3>,
  opts: FaceOptions = {},
): FigureFace[] {
  const faces: FigureFace[] = [];
  for (let index = 0; index < outer.length; index += 1) {
    const next = (index + 1) % outer.length;
    faces.push(
      face3([inner[index], inner[next], outer[next], outer[index]], opts),
    );
  }
  return faces;
}

/**
 * Loft of elliptical rings around a vertical axis. Back quads are drawn first
 * and the front ones cover them with the plate tone. Used for organic volumes
 * (dress form, mouse) that a single footprint extrusion cannot express.
 */
function loft(
  cx: number,
  cy: number,
  rings: ReadonlyArray<{ z: number; rx: number; ry?: number }>,
  opts: FaceOptions & { sides?: number; topTone?: DetailTone } = {},
): FigureFace[] {
  const sides = opts.sides ?? 30;
  const tone = opts.tone ?? "edge";
  const topTone = opts.topTone ?? "mid";
  const group = opts.group;
  const loops = rings.map((ring) => {
    const points: Point3[] = [];
    for (let index = 0; index < sides; index += 1) {
      const a = (index / sides) * TAU;
      points.push([
        cx + Math.cos(a) * ring.rx,
        cy + Math.sin(a) * (ring.ry ?? ring.rx),
        ring.z,
      ]);
    }
    return points;
  });
  const quads: Array<{ points: Point3[]; depth: number }> = [];
  for (let level = 0; level < loops.length - 1; level += 1) {
    const below = loops[level];
    const above = loops[level + 1];
    for (let index = 0; index < sides; index += 1) {
      const next = (index + 1) % sides;
      const points = [
        below[index],
        below[next],
        above[next],
        above[index],
      ];
      const depth =
        points.reduce((sum, point) => sum + point[0] + point[1], 0) /
        points.length;
      quads.push({ points, depth });
    }
  }
  quads.sort(byDepth);
  const faces: FigureFace[] = quads.map((quad) =>
    face3(quad.points, { tone, stroke: false, group }),
  );
  const top = loops[loops.length - 1];
  faces.push(face3(top, { tone: topTone, group }));
  const outline = loftOutline(loops);
  faces.push(face2(outline, { fill: false, tone, group }));
  return faces;
}

function loftOutline(loops: ReadonlyArray<ReadonlyArray<Point3>>): Point2[] {
  const points = loops.flatMap((loop) =>
    loop.map(([x, y, z]) => iso(x, y, z)),
  );
  const sorted = points
    .slice()
    .sort(
      (a, b) =>
        Math.round(a[0] * 1e6) - Math.round(b[0] * 1e6) ||
        Math.round(a[1] * 1e6) - Math.round(b[1] * 1e6),
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

/** A short arrow signboard mounted at a 3D point. */
function arrowSign(
  x: number,
  y: number,
  z: number,
  width: number,
  direction: 1 | -1,
  group: string,
  tone: DetailTone,
): FigureFace[] {
  const [px, py] = iso(x, y, z);
  const half = width / 2;
  const points: Point2[] = [
    [px - half * direction, py - 6],
    [px + half * direction, py - 6],
    [px + (half + 7) * direction, py],
    [px + half * direction, py + 6],
    [px - half * direction, py + 6],
  ];
  const faces: FigureFace[] = [
    face2(points, { tone, group }),
    stroke2(
      [
        [px - (half - 4) * direction, py - 1],
        [px + (half - 3) * direction, py - 1],
      ],
      "lo",
      { group },
    ),
  ];
  const [bx, by] = iso(x, y, z - 7);
  faces.push(
    stroke2(
      [
        [bx, by],
        [bx, by + 14],
      ],
      "mid",
      { group },
    ),
  );
  return faces;
}

/* -------------------------------------------------------------------------- */
/* 26. Breadcrumb — waymark signs on a path                                   */
/* -------------------------------------------------------------------------- */

function breadcrumbFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  const trail: Point3[] = [];
  for (let index = 0; index <= 22; index += 1) {
    const t = index / 22;
    const x = -52 + t * 104;
    const y = 26 - t * 52 + Math.sin(t * Math.PI) * 8;
    trail.push([x, y, 1]);
  }
  faces.push(stroke3(trail, "lo", { group: "trail" }));

  const marks: Array<{
    x: number;
    y: number;
    h: number;
    width: number;
    direction: 1 | -1;
    group: string;
    active: boolean;
  }> = [
    { x: -38, y: 20, h: 34, width: 27, direction: 1, group: "sign-a", active: false },
    { x: 2, y: 2, h: 40, width: 31, direction: 1, group: "sign-b", active: false },
    { x: 40, y: -16, h: 46, width: 35, direction: 1, group: "sign-c", active: true },
  ];

  for (const mark of marks) {
    faces.push(
      ...prism(
        roundedRect(mark.x - 2.2, mark.y - 2.2, 4.4, 4.4, 0.8),
        0,
        mark.h,
        { tone: "edge", topTone: "mid", group: mark.group },
      ),
    );
    const stone = roundedRect(
      mark.x - 5.5,
      mark.y - 5.5,
      11,
      11,
      2.4,
    );
    faces.push(
      ...prism(stone, 0, 2.4, {
        tone: "mid",
        topTone: "lo",
        group: mark.group,
      }),
    );
    faces.push(
      ...arrowSign(
        mark.x,
        mark.y,
        mark.h,
        mark.width,
        mark.direction,
        mark.group,
        mark.active ? "hi" : "edge",
      ),
    );
    faces.push(
      stroke3(
        [
          [mark.x - 1.8, mark.y - 1.8, 3],
          [mark.x - 1.8, mark.y - 1.8, mark.h * 0.52],
        ],
        "lo",
        { group: mark.group },
      ),
      stroke3(
        [
          [mark.x + 1.8, mark.y + 1.8, 3],
          [mark.x + 1.8, mark.y + 1.8, mark.h * 0.52],
        ],
        "lo",
        { group: mark.group },
      ),
    );
  }

  /* Two small trail blazes between the posts: thin marks on the ground. */
  for (const [x, y] of [
    [-22, 14],
    [20, -6],
  ] as const) {
    const [px, py] = iso(x, y, 1.6);
    faces.push(
      face2(
        [
          [px - 4, py - 1.2],
          [px + 4, py - 1.2],
          [px + 4, py + 1.2],
          [px - 4, py + 1.2],
        ],
        { tone: "mid" },
      ),
    );
  }

  return faces;
}

export const breadcrumb: PrototypeMeta = {
  slug: "breadcrumb",
  name: "Breadcrumb",
  component: "Breadcrumb",
  object: "Waymark signs on a path",
  story:
    "The trail blazes light one after another from the first post to the one you stand at.",
  note: "A breadcrumb is the path already walked, marked on the ground behind you.",
  scene: figureScene({
    slug: "breadcrumb",
    name: "Breadcrumb",
    component: "Navigation",
    object: "Waymark signs on a path",
    description:
      "Three wooden waymark posts with arrow signs along a faint trail, the nearest sign lit.",
    aria:
      "An isometric trail with three waymark posts, each carrying an arrow sign; the nearest sign is highlighted.",
    faces: breadcrumbFaces(),
    motions: [
      { group: "sign-a", kind: "bob", period: 2100, amount: 1.6, phase: 0.1 },
      { group: "sign-b", kind: "bob", period: 2100, amount: 2.2, phase: 0.4 },
      { group: "sign-c", kind: "bob", period: 2100, amount: 2.8, phase: 0.7 },
      { group: "trail", kind: "breathe", period: 3200, amount: 0.006 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 27. Pagination — slide-projector tray                                      */
/* -------------------------------------------------------------------------- */

function paginationFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...box(-29, -21, 0, 58, 42, 15, {
      r: 4,
      tone: "edge",
      topTone: "mid",
    }),
    ...cylinder(0, 0, 15, 9, 46, 46, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ellipse3(0, 0, 24, 41, 41, { fill: false, tone: "lo" }),
    ellipse3(0, 0, 24, 34, 34, { fill: false, tone: "lo" }),
  );

  const slots = 12;
  for (let index = 0; index < slots; index += 1) {
    const a = (index / slots) * TAU + 0.15;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    const tx = -dy;
    const ty = dx;
    const radius = 31;
    const cx = dx * radius;
    const cy = dy * radius;
    const halfLength = 7.2;
    const halfWidth = 4.6;
    const footprint: Point2[] = [
      [cx + dx * halfLength + tx * halfWidth, cy + dy * halfLength + ty * halfWidth],
      [cx + dx * halfLength - tx * halfWidth, cy + dy * halfLength - ty * halfWidth],
      [cx - dx * halfLength - tx * halfWidth, cy - dy * halfLength - ty * halfWidth],
      [cx - dx * halfLength + tx * halfWidth, cy - dy * halfLength + ty * halfWidth],
    ];
    faces.push(
      ...prism(footprint, 23.6, 1.4, {
        tone: "mid",
        topTone: index === 0 ? "hi" : "lo",
        group: "tray",
      }),
    );
    const [mx, my] = iso(cx, cy, 25.4);
    faces.push(
      face2(
        [
          [mx - dx * 4 - tx * 2.6, my - dy * 4 - ty * 2.6],
          [mx + dx * 4 - tx * 2.6, my + dy * 4 - ty * 2.6],
          [mx + dx * 4 + tx * 2.6, my + dy * 4 + ty * 2.6],
          [mx - dx * 4 + tx * 2.6, my - dy * 4 + ty * 2.6],
        ],
        { fill: false, tone: index === 0 ? "hi" : "lo", group: "tray" },
      ),
    );
  }

  for (let index = 0; index < slots; index += 1) {
    const a = (index / slots) * TAU + 0.15 + Math.PI / slots;
    faces.push(
      tube(
        [
          [Math.cos(a) * 10, Math.sin(a) * 10, 24.2],
          [Math.cos(a) * 41, Math.sin(a) * 41, 24.2],
        ],
        1.1,
        { tone: "lo", group: "tray" },
      ),
    );
  }

  faces.push(
    ...cylinder(0, 0, 24, 4, 8, 6.4, {
      tone: "edge",
      topTone: "mid",
      group: "hub",
    }),
    ellipse3(0, 0, 28.3, 5, 5, { tone: "hi", group: "hub" }),
  );

  /* The slide waiting in the gate, standing in front of the tray. */
  faces.push(
    face3(
      [
        [-11, 40, 17],
        [11, 40, 17],
        [11, 40, 42],
        [-11, 40, 42],
      ],
      { tone: "edge", group: "gate" },
    ),
    face3(
      [
        [-8, 40.2, 20],
        [8, 40.2, 20],
        [8, 40.2, 39],
        [-8, 40.2, 39],
      ],
      { fill: false, tone: "hi", group: "gate" },
    ),
    face3(
      [
        [-5.6, 40.4, 23],
        [5.6, 40.4, 23],
        [5.6, 40.4, 35],
        [-5.6, 40.4, 35],
      ],
      { tone: "lo", group: "gate" },
    ),
  );

  /* Projector lens pointing out of the gate. */
  faces.push(
    tube(
      [
        [0, 28, 9],
        [0, 45, 9],
      ],
      9,
      { tone: "edge", group: "lens" },
    ),
    disc3(0, 45, 9, 6.4, "xz", { tone: "mid", group: "lens" }),
    disc3(0, 45.2, 9, 3.8, "xz", { tone: "hi", group: "lens" }),
  );

  return faces;
}

export const pagination: PrototypeMeta = {
  slug: "pagination",
  name: "Pagination",
  component: "Pagination",
  object: "Slide-projector tray",
  story:
    "The round tray indexes one notch and the chosen slide drops into the gate.",
  note: "Pages are slides in a carousel: one at a time in the window, the rest waiting in order.",
  scene: figureScene({
    slug: "pagination",
    name: "Pagination",
    component: "Navigation",
    object: "Slide-projector tray",
    description:
      "A circular slide tray with numbered compartments on a small projector gate, one slide loaded in front.",
    aria:
      "An isometric slide-projector tray: a round carousel of numbered slide slots over a projector body, with one slide in the gate.",
    faces: paginationFaces(),
    motions: [
      { group: "tray", kind: "spin", period: 3800, amount: 360 },
      { group: "hub", kind: "flicker", period: 1200, amount: 0.02 },
      { group: "gate", kind: "lift", period: 2400, amount: 2.6 },
      { group: "lens", kind: "breathe", period: 2600, amount: 0.03 },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 28. Stepper — open staircase                                               */
/* -------------------------------------------------------------------------- */

function stepperFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const count = 5;
  const stepW = 18;
  const stepD = 27;
  const rise = 14;

  /* Solid risers: the mass steps up by a full tread each time. */
  for (let index = 0; index < count; index += 1) {
    const x = -37 + index * stepW;
    const top = (index + 1) * rise;
    const group = `step-${index + 1}`;
    faces.push(
      ...box(x - stepW / 2, -stepD / 2, 0, stepW, stepD, top, {
        r: 0.5,
        tone: "edge",
        topTone: "mid",
        group,
      }),
    );
    const [tx, ty] = iso(x, -stepD / 2 + 1.2, top + 0.4);
    faces.push(
      stroke2(
        [
          [tx - 5.6, ty],
          [tx + 5.6, ty],
        ],
        "lo",
        { group },
      ),
    );
    if (index > 0) {
      faces.push(
        stroke3(
          [
            [x - stepW / 2, stepD / 2 + 0.2, 0],
            [x - stepW / 2, stepD / 2 + 0.2, top],
          ],
          "lo",
          { group },
        ),
      );
    }
  }

  /* A slim rail on the far edge, with two posts. */
  const railZ = (index: number) => (index + 1) * rise + 17;
  const railX = (index: number) => -37 + index * stepW;
  const railPoints: Point3[] = [];
  for (let index = 0; index < count; index += 1) {
    railPoints.push([railX(index), -stepD / 2 + 1, railZ(index)]);
  }
  faces.push(tube(railPoints, 1.4, { tone: "lo" }));
  for (const index of [0, count - 1]) {
    faces.push(
      tube(
        [
          [railX(index), -stepD / 2 + 1, (index + 1) * rise],
          [railX(index), -stepD / 2 + 1, railZ(index)],
        ],
        1.3,
        { tone: "lo" },
      ),
    );
  }

  /* Marker on the third tread, brass and lit. */
  faces.push(
    ...cylinder(-37 + 2 * stepW, 0, 3 * rise, 3.2, 6.4, 5.2, {
      tone: "edge",
      topTone: "hi",
      group: "marker",
    }),
    ellipse3(-37 + 2 * stepW, 0, 3 * rise + 3.4, 2.2, 2.2, {
      tone: "hi",
      group: "marker",
    }),
  );
  faces.push(
    ellipse3(-37 + 3 * stepW, 0, 4 * rise + 0.4, 5.4, 5.4, {
      fill: false,
      tone: "hi",
      group: "next-step",
    }),
  );

  return faces;
}

export const stepper: PrototypeMeta = {
  slug: "stepper",
  name: "Stepper",
  component: "Stepper",
  object: "Open staircase",
  story:
    "A small marker climbs one tread and the next riser catches the light.",
  note: "Progress is a height you gain one step at a time, not a bar you fill.",
  scene: figureScene({
    slug: "stepper",
    name: "Stepper",
    component: "Navigation",
    object: "Open staircase",
    description:
      "A short open staircase of five treads with a slim handrail and a lit marker on the third step.",
    aria:
      "An isometric open staircase with five treads, a slim handrail and a small lit marker resting on the third step.",
    faces: stepperFaces(),
    motions: [
      { group: "marker", kind: "lift", period: 2200, amount: 4.4 },
      { group: "next-step", kind: "breathe", period: 2200, amount: 0.05 },
      { group: "step-5", kind: "flicker", period: 3000, amount: 0.012 },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 29. Dock — pegboard tool rack                                              */
/* -------------------------------------------------------------------------- */

function hammer(x: number): FigureFace[] {
  const faces: FigureFace[] = [
    tube(
      [
        [x, 7, 72],
        [x, 7, 46],
      ],
      2.6,
      { tone: "edge", group: "tool-a" },
    ),
    ...box(x - 11, 3.4, 68, 22, 7, 7, {
      r: 1.4,
      tone: "edge",
      topTone: "mid",
      group: "tool-a",
    }),
    stroke3(
      [
        [x + 4, 3.2, 71.5],
        [x + 4, 3.2, 73.5],
      ],
      "lo",
      { group: "tool-a" },
    ),
  ];
  return faces;
}

function wrench(x: number): FigureFace[] {
  const faces: FigureFace[] = [
    tube(
      [
        [x, 7, 73],
        [x, 7, 47],
      ],
      3,
      { tone: "edge", group: "tool-b" },
    ),
    tube(
      [
        [x, 7, 73],
        [x - 5, 7, 78],
      ],
      2.2,
      { tone: "hi", group: "tool-b" },
    ),
    tube(
      [
        [x, 7, 73],
        [x + 5, 7, 78],
      ],
      2.2,
      { tone: "hi", group: "tool-b" },
    ),
    face2(
      [
        ...((): Point2[] => {
          const [ax, ay] = iso(x - 5, 7, 78);
          const [bx, by] = iso(x + 5, 7, 78);
          return [
            [ax - 1.6, ay - 1.6],
            [ax + 1.6, ay + 1.6],
            [bx - 1.6, by + 1.6],
            [bx + 1.6, by - 1.6],
          ];
        })(),
      ],
      { fill: false, tone: "lo", group: "tool-b" },
    ),
    ellipse3(x, 7, 47, 3.4, 3.4, { tone: "mid", group: "tool-b" }),
  ];
  return faces;
}

function screwdriver(x: number): FigureFace[] {
  return [
    tube(
      [
        [x, 7, 76],
        [x, 7, 59],
      ],
      5.2,
      { tone: "edge", group: "tool-c" },
    ),
    tube(
      [
        [x, 7, 59],
        [x, 7, 44],
      ],
      1.4,
      { tone: "mid", group: "tool-c" },
    ),
    ...box(x - 2.8, 4.6, 43, 5.6, 4.6, 2.6, {
      r: 0.6,
      tone: "edge",
      topTone: "lo",
      group: "tool-c",
    }),
  ];
}

function pliers(x: number): FigureFace[] {
  return [
    tube(
      [
        [x - 3, 7, 76],
        [x - 6, 7, 55],
      ],
      2.4,
      { tone: "edge", group: "tool-d" },
    ),
    tube(
      [
        [x + 3, 7, 76],
        [x + 6, 7, 55],
      ],
      2.4,
      { tone: "edge", group: "tool-d" },
    ),
    tube(
      [
        [x - 6, 7, 55],
        [x - 1, 7, 66],
        [x + 5, 7, 78],
      ],
      2.2,
      { tone: "edge", group: "tool-d" },
    ),
    tube(
      [
        [x + 6, 7, 55],
        [x + 1, 7, 66],
        [x - 5, 7, 78],
      ],
      2.2,
      { tone: "edge", group: "tool-d" },
    ),
    ellipse3(x, 7, 66, 2.2, 2.2, { tone: "mid", group: "tool-d" }),
  ];
}

function dockFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    face3(
      [
        [-48, -3, 8],
        [48, -3, 8],
        [48, -3, 94],
        [-48, -3, 94],
      ],
      { tone: "edge" },
    ),
    sidePanel(-3, 3, 48, 8, 94, { tone: "edge" }),
    face3(
      [
        [-48, 3, 8],
        [48, 3, 8],
        [48, 3, 94],
        [-48, 3, 94],
      ],
      { tone: "edge" },
    ),
    face3(
      [
        [-48, -3, 94],
        [48, -3, 94],
        [48, 3, 94],
        [-48, 3, 94],
      ],
      { tone: "mid" },
    ),
    face3(
      [
        [-48, -3, 8],
        [48, -3, 8],
        [48, 3, 8],
        [-48, 3, 8],
      ],
      { tone: "lo" },
    ),
  );

  /* Inner frame and all the peg holes. */
  faces.push(
    face3(
      [
        [-43, 3.2, 13],
        [43, 3.2, 13],
        [43, 3.2, 89],
        [-43, 3.2, 89],
      ],
      { fill: false, tone: "lo" },
    ),
  );
  for (let row = 0; row < 6; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const x = -37 + col * 10.5;
      const z = 20 + row * 11;
      const [hx, hy] = iso(x, 3.3, z);
      faces.push(
        face2(ellipse2(hx, hy, 1.25, 1.35, 12), {
          fill: false,
          tone: "lo",
        }),
      );
    }
  }

  /* Top rail with hooks. */
  faces.push(
    tube(
      [
        [-44, 5.4, 87],
        [44, 5.4, 87],
      ],
      2.4,
      { tone: "mid" },
    ),
  );

  const tools: Array<{
    x: number;
    group: string;
    draw: (x: number) => FigureFace[];
  }> = [
    { x: -35, group: "tool-a", draw: hammer },
    { x: -11, group: "tool-b", draw: wrench },
    { x: 14, group: "tool-c", draw: screwdriver },
    { x: 36, group: "tool-d", draw: pliers },
  ];
  for (const tool of tools) {
    faces.push(
      ellipse3(tool.x, 5.6, 80, 3.4, 3.4, {
        fill: false,
        tone: "mid",
        group: tool.group,
      }),
      ...tool.draw(tool.x),
    );
  }

  return faces;
}

export const dock: PrototypeMeta = {
  slug: "dock",
  name: "Dock",
  component: "Dock",
  object: "Pegboard tool rack",
  story:
    "The pointed tool lifts off its peg while the three neighbours tilt toward it.",
  note: "A dock keeps familiar tools in reach on one shared board.",
  scene: figureScene({
    slug: "dock",
    name: "Dock",
    component: "Navigation",
    object: "Pegboard tool rack",
    description:
      "A pegboard panel with a grid of holes and four hanging tools: hammer, wrench, screwdriver and pliers.",
    aria:
      "An isometric pegboard tool rack holding a hammer, a wrench, a screwdriver and pliers, with one tool lifted off its peg.",
    faces: dockFaces(),
    motions: [
      {
        group: "tool-a",
        kind: "sway",
        period: 2400,
        amount: 3.2,
        pivot: [-35, 5, 78],
      },
      {
        group: "tool-b",
        kind: "sway",
        period: 2400,
        amount: 4,
        pivot: [-11, 5, 78],
        phase: 0.16,
      },
      {
        group: "tool-c",
        kind: "sway",
        period: 2400,
        amount: 3.6,
        pivot: [14, 5, 78],
        phase: 0.32,
      },
      {
        group: "tool-d",
        kind: "sway",
        period: 2400,
        amount: 4.4,
        pivot: [36, 5, 78],
        phase: 0.48,
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 30. Progress — rain gauge                                                  */
/* -------------------------------------------------------------------------- */

function progressFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Water first, then a transparent glass shell drawn as open strokes. */
  faces.push(
    ...cylinder(0, 0, 12, 40, 9.2, 9.2, {
      tone: "mid",
      topTone: "lo",
      group: "water",
    }),
    ellipse3(0, 0, 52, 9.2, 9.2, {
      tone: "mid",
      group: "water",
    }),
  );

  faces.push(
    ellipse3(0, 0, 8, 12.4, 12.4, { tone: "lo" }),
    ellipse3(0, 0, 8.4, 10.2, 10.2, { fill: false, tone: "mid" }),
    ellipse3(0, 0, 82, 12.4, 12.4, { fill: false, tone: "edge" }),
    ellipse3(0, 0, 82, 10.4, 10.4, { fill: false, tone: "lo" }),
  );
  for (const a of [-2.3, 0, 2.3]) {
    const x = Math.cos(a) * 12.4;
    const y = Math.sin(a) * 12.4;
    faces.push(stroke3([[x, y, 8], [x, y, 82]], "edge"));
  }

  /* Clear graduations across the front of the tube. */
  for (let index = 0; index < 14; index += 1) {
    const z = 16 + index * 4.5;
    const [cx, cy] = iso(0, 0, z);
    const length = index % 3 === 0 ? 9.5 : 5.8;
    faces.push(
      stroke2(
        [
          [cx - length, cy + 1.2],
          [cx - 2, cy + 1.2],
        ],
        index === 8 ? "hi" : "lo",
      ),
      stroke2(
        [
          [cx + 2, cy + 1.2],
          [cx + length, cy + 1.2],
        ],
        index === 8 ? "hi" : "lo",
      ),
    );
  }

  /* Float riding the surface: a disc, a short stem and a brass knob. */
  faces.push(
    ellipse3(0, 0, 52.4, 7.2, 7.2, { tone: "edge", group: "float" }),
    ellipse3(0, 0, 52.8, 4.8, 4.8, { tone: "mid", group: "float" }),
    stroke3([[0, 0, 52.8], [0, 0, 57]], "mid", { group: "float" }),
    ...cylinder(0, 0, 57, 3.2, 2.4, 2.1, {
      tone: "edge",
      topTone: "hi",
      group: "float",
    }),
  );

  /* Clamp, side post and tripod feet. */
  faces.push(
    ellipse3(0, 0, 36, 13.2, 13.2, { fill: false, tone: "mid" }),
    ...box(9, -22, 31, 12, 10, 11, {
      r: 2,
      tone: "edge",
      topTone: "mid",
    }),
    tube(
      [
        [18, -17, 35],
        [18, -17, 4],
      ],
      2.8,
      { tone: "edge" },
    ),
    tube(
      [
        [18, -17, 35],
        [10, -17, 35],
      ],
      2.4,
      { tone: "mid" },
    ),
  );
  for (const [x, y] of [
    [6, -10],
    [30, -10],
    [18, -27],
  ] as const) {
    faces.push(
      tube(
        [
          [18, -17, 6],
          [x, y, 1],
        ],
        2.2,
        { tone: "lo" },
      ),
    );
  }

  return faces;
}

export const progress: PrototypeMeta = {
  slug: "progress",
  name: "Progress",
  component: "Progress",
  object: "Rain gauge",
  story:
    "The float rises one graduation and the water surface trembles once.",
  note: "A quantity is easiest to trust when it has a level you can read.",
  scene: figureScene({
    slug: "progress",
    name: "Progress",
    component: "Feedback",
    object: "Rain gauge",
    description:
      "A clear rain gauge on a post: a graduated glass tube, a water column and a small float at the surface.",
    aria:
      "An isometric rain gauge: a clear graduated tube half filled with water, a marked float at the surface and a mounting post.",
    faces: progressFaces(),
    motions: [
      { group: "float", kind: "lift", period: 2400, amount: 4.6 },
      { group: "water", kind: "breathe", period: 2400, amount: 0.012 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 31. Spinner — pinwheel (study drawing)                                     */
/* -------------------------------------------------------------------------- */

export const spinnerEntry = spinner;

/* -------------------------------------------------------------------------- */
/* 32. Status — lighthouse (study drawing)                                    */
/* -------------------------------------------------------------------------- */

export const statusEntry = status;

/* -------------------------------------------------------------------------- */
/* 33. Skeleton — tailor's dress form                                         */
/* -------------------------------------------------------------------------- */

function skeletonFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 30, 3.6, 3, {
      tone: "mid",
      topTone: "lo",
    }),
  );
  for (const [x, y] of [
    [-14, -4],
    [14, -4],
    [0, -15],
  ] as const) {
    faces.push(
      tube(
        [
          [0, 0, 7],
          [x, y, 1],
        ],
        2.4,
        { tone: "edge" },
      ),
    );
  }
  faces.push(
    ellipse3(0, 0, 30, 5.2, 5.2, { tone: "edge" }),
  );

  faces.push(
    ...loft(
      0,
      0,
      [
        { z: 28, rx: 14, ry: 9.4 },
        { z: 30, rx: 17, ry: 11.6 },
        { z: 38, rx: 17.4, ry: 11.6 },
        { z: 47, rx: 10.6, ry: 7.2 },
        { z: 54, rx: 13.8, ry: 9.4 },
        { z: 63, rx: 19.4, ry: 13.2 },
        { z: 68.5, rx: 20.6, ry: 13.4 },
        { z: 71.5, rx: 18.2, ry: 11.4 },
        { z: 72.6, rx: 6.2, ry: 5 },
        { z: 76, rx: 5.4, ry: 4.4 },
      ],
      { tone: "edge", topTone: "mid", group: "form", sides: 34 },
    ),
  );

  /* Strong shoulder and waist seams make the torso read as a dress form. */
  faces.push(
    ellipse3(0, 0, 71.5, 18.2, 11.4, {
      fill: false,
      tone: "lo",
      group: "seams",
    }),
    ellipse3(0, 0, 47, 10.6, 7.2, {
      fill: false,
      tone: "lo",
      group: "seams",
    }),
    ellipse3(0, 0, 63, 16.4, 10.8, {
      fill: false,
      tone: "lo",
      group: "seams",
    }),
  );

  /* Seam lines, drawn on the front arc only. */
  for (const angle of [-1.05, -0.35, 0.35, 1.05]) {
    const line: Point3[] = [];
    const profile = [
      { z: 30, r: 15.4 },
      { z: 38, r: 16 },
      { z: 47, r: 9.4 },
      { z: 54, r: 12.4 },
      { z: 64, r: 18.4 },
      { z: 70, r: 16.6 },
      { z: 75, r: 7.2 },
    ];
    for (const point of profile) {
      line.push([
        Math.cos(angle) * point.r,
        Math.sin(angle) * point.r * 0.66,
        point.z,
      ]);
    }
    faces.push(stroke3(line, "lo", { group: "seams" }));
  }

  /* Armhole dents on both flanks. */
  for (const side of [-1, 1]) {
    faces.push(
      stroke3(
        [
          [side * 18.2, -2, 69],
          [side * 19.4, 0, 66],
          [side * 18.6, 2, 63],
        ],
        "lo",
        { group: "form" },
      ),
    );
  }

  faces.push(
    ...cylinder(0, 0, 76, 6, 5.4, 4.6, {
      tone: "edge",
      topTone: "mid",
      group: "form",
    }),
    ellipse3(0, 0, 82.2, 4.4, 4.4, { tone: "hi", group: "pin" }),
    ...cylinder(0, 0, 82, 3.2, 1.6, 1.2, {
      tone: "mid",
      topTone: "lo",
      group: "pin",
    }),
  );
  for (const side of [-1, 1]) {
    faces.push(
      stroke3(
        [
          [side * 6.6, -11, 58],
          [side * 4.4, -10, 63],
        ],
        "lo",
        { group: "seams" },
      ),
    );
  }

  return faces;
}

export const skeleton: PrototypeMeta = {
  slug: "skeleton",
  name: "Skeleton",
  component: "Skeleton",
  object: "Tailor's dress form",
  story:
    "The seam lines draw themselves and the form settles on its single post.",
  note: "A skeleton is the shape the real thing will take, waiting on its stand.",
  scene: figureScene({
    slug: "skeleton",
    name: "Skeleton",
    component: "Feedback",
    object: "Tailor's dress form",
    description:
      "A tailor's dress form on a single post: a stitched torso with a waist seam and a pin at the neck.",
    aria:
      "An isometric tailor's dress form: a seamed torso silhouette on a slim post with a tripod foot and a lit pin at the neck.",
    faces: skeletonFaces(),
    motions: [
      { group: "form", kind: "breathe", period: 3400, amount: 0.014 },
      { group: "seams", kind: "flicker", period: 2600, amount: 0.02 },
      { group: "pin", kind: "bob", period: 2600, amount: 1.8 },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 34. Card — stack of index cards                                            */
/* -------------------------------------------------------------------------- */

function cardFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const count = 6;

  for (let index = 0; index < count; index += 1) {
    const offset = index - (count - 1);
    faces.push(
      ...box(-32 + offset * 0.9, -21 - offset * 0.55, index * 2.2, 64, 42, 1.7, {
        r: 2,
        tone: "edge",
        topTone: index === count - 1 ? "mid" : "lo",
        group: index === count - 1 ? "top" : undefined,
      }),
    );
  }

  const topZ = (count - 1) * 2.2 + 1.7;
  for (let line = 0; line < 5; line += 1) {
    const y = -15 + line * 7;
    faces.push(
      stroke3(
        [
          [-25 + (count - 1) * 0.9, y - (count - 1) * 0.55, topZ + 0.2],
          [27 + (count - 1) * 0.9, y - (count - 1) * 0.55, topZ + 0.2],
        ],
        "lo",
        { group: "top" },
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [-25 + (count - 1) * 0.9, -15 - (count - 1) * 0.55, topZ + 0.3],
        [-25 + (count - 1) * 0.9, 13 - (count - 1) * 0.55, topZ + 0.3],
      ],
      "lo",
      { group: "top" },
    ),
  );

  /* A bright index tab on the top card. */
  const [tx, ty] = iso(
    30 + (count - 1) * 0.9,
    -13 - (count - 1) * 0.55,
    topZ + 0.5,
  );
  faces.push(
    face2(
      [
        [tx - 5, ty - 1],
        [tx + 5, ty - 1],
        [tx + 5, ty + 5],
        [tx - 5, ty + 5],
      ],
      { tone: "hi", group: "top" },
    ),
  );

  return faces;
}

export const card: PrototypeMeta = {
  slug: "card",
  name: "Card",
  component: "Card",
  object: "Stack of index cards",
  story:
    "The top card rises, turns a little and shows its ruled face above the stack.",
  note: "A card is one unit in a pack: self-contained, but never alone.",
  scene: figureScene({
    slug: "card",
    name: "Card",
    component: "Layout",
    object: "Stack of index cards",
    description:
      "A stack of six ruled index cards, the top one lifted and carrying a bright tab.",
    aria:
      "An isometric stack of six index cards with ruled lines; the top card is lifted slightly with a bright tab.",
    faces: cardFaces(),
    motions: [
      { group: "top", kind: "lift", period: 2800, amount: 5.2 },
      {
        group: "top",
        kind: "sway",
        period: 3600,
        amount: 1.8,
        pivot: [-30, 20, 15],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 35. Table — pigeonhole mail sorter                                         */
/* -------------------------------------------------------------------------- */

function tableFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...box(-42, -18, 0, 84, 36, 76, {
      r: 2.4,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );

  faces.push(
    face3(
      [
        [-37, 18.1, 7],
        [37, 18.1, 7],
        [37, 18.1, 73],
        [-37, 18.1, 73],
      ],
      { tone: "edge" },
    ),
  );

  const cols = 4;
  const rows = 5;
  const cellW = 16.4;
  const cellH = 11.2;
  const originX = -35;
  const originZ = 12;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x0 = originX + col * 18;
      const z0 = originZ + row * 12.4;
      faces.push(
        face3(
          [
            [x0, 18.2, z0],
            [x0 + cellW, 18.2, z0],
            [x0 + cellW, 18.2, z0 + cellH],
            [x0, 18.2, z0 + cellH],
          ],
          { tone: "lo" },
        ),
        face3(
          [
            [x0 + 1.4, 18.3, z0 + 1.2],
            [x0 + cellW - 1.4, 18.3, z0 + 1.2],
            [x0 + cellW - 1.4, 18.3, z0 + cellH - 1.2],
            [x0 + 1.4, 18.3, z0 + cellH - 1.2],
          ],
          { fill: false, tone: "lo" },
        ),
      );
    }
  }

  /* One letter tucked into the third row, second column. */
  const lx = originX + 18 + 2;
  const lz = originZ + 24.8 + 1.6;
  const [ex, ey] = iso(lx, 18.9, lz + 4);
  faces.push(
    face2(
      [
        [ex, ey - 6.5],
        [ex + 12, ey - 6.5],
        [ex + 12, ey + 6.5],
        [ex, ey + 6.5],
      ],
      { tone: "mid", group: "letter" },
    ),
    stroke2(
      [
        [ex, ey - 6.5],
        [ex + 6, ey],
        [ex + 12, ey - 6.5],
      ],
      "edge",
      { group: "letter" },
    ),
    face2(
      [
        [ex + 8.4, ey - 4.8],
        [ex + 11, ey - 4.8],
        [ex + 11, ey - 2.2],
        [ex + 8.4, ey - 2.2],
      ],
      { tone: "hi", group: "letter" },
    ),
  );

  faces.push(
    stroke3(
      [
        [-37, 18.4, 7],
        [-37, 18.4, 73],
      ],
      "lo",
    ),
    stroke3(
      [
        [37, 18.4, 7],
        [37, 18.4, 73],
      ],
      "lo",
    ),
  );

  return faces;
}

export const table: PrototypeMeta = {
  slug: "table",
  name: "Table",
  component: "Table",
  object: "Pigeonhole mail sorter",
  story:
    "A letter slides into its cubby and the neighbouring paper tucks back.",
  note: "A table is a rigid grid of pigeonholes: every row keeps its own thing.",
  scene: figureScene({
    slug: "table",
    name: "Table",
    component: "Data",
    object: "Pigeonhole mail sorter",
    description:
      "A wooden pigeonhole cabinet with twenty cubbies, one letter tucked into a cell with a bright stamp.",
    aria:
      "An isometric pigeonhole mail sorter: a wooden cabinet with a grid of twenty cubbies and one letter in a cell.",
    faces: tableFaces(),
    motions: [
      { group: "letter", kind: "lift", period: 2800, amount: 2.4 },
      { group: "letter", kind: "sway", period: 3600, amount: 1.2 },
    ],
    press: 1.2,
  }),
};

/* -------------------------------------------------------------------------- */
/* 36. Chart — seismograph                                                    */
/* -------------------------------------------------------------------------- */

function chartFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const cz = 62;
  const r = 24;
  const half = 32;

  const hullPoints: Point2[] = [];
  for (let index = 0; index < 40; index += 1) {
    const a = (index / 40) * TAU;
    hullPoints.push(iso(half, Math.cos(a) * r, cz + Math.sin(a) * r));
    hullPoints.push(iso(-half, Math.cos(a) * r, cz + Math.sin(a) * r));
  }
  const sorted = hullPoints
    .slice()
    .sort(
      (a, b) =>
        Math.round(a[0] * 1e6) - Math.round(b[0] * 1e6) ||
        Math.round(a[1] * 1e6) - Math.round(b[1] * 1e6),
    );
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

  faces.push(
    face2(lower.concat(upper), { tone: "edge", group: "drum" }),
    disc3(-half, 0, cz, r, "yz", { tone: "edge", group: "drum" }),
    disc3(half, 0, cz, r, "yz", { tone: "edge", group: "drum" }),
    disc3(half, 0, cz, r - 4.2, "yz", {
      fill: false,
      tone: "lo",
      group: "drum",
    }),
    disc3(half, 0, cz, r - 11, "yz", {
      fill: false,
      tone: "lo",
      group: "drum",
    }),
  );

  /* Axle through the drum, with a crank on the near end. */
  faces.push(
    tube(
      [
        [-half - 11, 0, cz],
        [half + 11, 0, cz],
      ],
      2.6,
      { tone: "mid", group: "drum" },
    ),
    disc3(-half - 11, 0, cz, 4.2, "yz", { tone: "edge" }),
    disc3(half + 11, 0, cz, 4.2, "yz", { tone: "edge" }),
    tube(
      [
        [half + 11, 0, cz],
        [half + 18, -9, cz + 9],
      ],
      2,
      { tone: "edge" },
    ),
    ...cylinder(half + 18, -9, cz + 9, 5, 1.8, 1.8, {
      tone: "mid",
      topTone: "lo",
    }),
  );

  /* Graph-paper grid wrapped around the front of the drum. */
  for (let z = cz - r + 6; z <= cz + r - 6; z += 6) {
    faces.push(
      stroke3(
        [
          [-half, -r + 1.2, z],
          [half, -r + 1.2, z],
        ],
        "lo",
        { group: "drum" },
      ),
    );
  }
  for (let x = -half + 8; x <= half - 8; x += 8) {
    faces.push(
      stroke3(
        [
          [x, -r + 1.2, cz - r + 5],
          [x, -r + 1.2, cz + r - 5],
        ],
        "lo",
        { group: "drum" },
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [-half, -r + 1.4, cz + 15],
        [half, -r + 1.4, cz + 15],
      ],
      "mid",
      { group: "drum" },
    ),
  );

  const trace: Point3[] = [];
  for (let index = 0; index <= 18; index += 1) {
    const x = -half + (index / 18) * half * 2;
    const t = index / 18;
    const wave =
      Math.sin(t * Math.PI * 3.2) * 3.2 +
      (index === 13 ? -9 : 0) +
      (index === 14 ? 7 : 0);
    trace.push([x, -r + 1.2, cz + wave]);
  }
  faces.push(stroke3(trace, "mid", { group: "drum" }));
  const peak = trace[13];
  const [px, py] = iso(peak[0], peak[1] - 1, peak[2]);
  faces.push(
    face2(
      [
        [px - 1.6, py + 2.6],
        [px, py - 3.4],
        [px + 1.6, py + 2.6],
      ],
      { tone: "hi", group: "drum" },
    ),
  );

  /* A-frame supports. */
  for (const x of [-18, 18]) {
    faces.push(
      tube(
        [
          [x, -23, 0],
          [x, 0, cz - r],
        ],
        2.6,
        { tone: "edge" },
      ),
      tube(
        [
          [x, 23, 0],
          [x, 0, cz - r],
        ],
        2.6,
        { tone: "edge" },
      ),
      tube(
        [
          [x, -20, 4],
          [x, 20, 4],
        ],
        1.8,
        { tone: "lo" },
      ),
    );
  }
  faces.push(
    tube(
      [
        [-24, 0, cz - r - 2],
        [24, 0, cz - r - 2],
      ],
      3,
      { tone: "mid" },
    ),
  );

  /* Stylus post, articulated arm and needle. */
  faces.push(
    ...cylinder(34, -19, 0, 92, 3.2, 2.4, {
      tone: "edge",
      topTone: "mid",
    }),
    ...box(29, -25, 0, 10, 12, 5, {
      r: 1.4,
      tone: "edge",
      topTone: "lo",
    }),
  );
  faces.push(
    tube(
      [
        [34, -19, 88],
        [10, -25, 74],
        [-6, -28, 66],
      ],
      2.4,
      { tone: "edge", group: "needle" },
    ),
    tube(
      [
        [34, -19, 74],
        [20, -27, 70],
      ],
      1.6,
      { tone: "mid", group: "needle" },
    ),
    ...box(25, -29, 68, 8, 6, 6, {
      r: 1.2,
      tone: "edge",
      topTone: "mid",
      group: "needle",
    }),
    stroke3(
      [
        [-6, -28, 66],
        [-8, -27, 60],
      ],
      "hi",
      { group: "needle" },
    ),
  );

  return faces;
}

export const chart: PrototypeMeta = {
  slug: "chart",
  name: "Chart",
  component: "Chart",
  object: "Seismograph",
  story:
    "The drum turns and the needle records a rising trace with one dark peak.",
  note: "A chart is change written down over time by a machine that never blinks.",
  scene: figureScene({
    slug: "chart",
    name: "Chart",
    component: "Data",
    object: "Seismograph",
    description:
      "A seismograph: a paper drum on an A-frame, a trace with a sharp peak and an articulated stylus arm.",
    aria:
      "An isometric seismograph with a paper drum on a frame, a recorded trace and an articulated needle arm.",
    faces: chartFaces(),
    motions: [
      { group: "drum", kind: "spin", period: 7000, amount: 360 },
      {
        group: "needle",
        kind: "sway",
        period: 2200,
        amount: 2.6,
        pivot: [34, -19, 88],
      },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 37. Kanban — rail switchyard                                               */
/* -------------------------------------------------------------------------- */

function railTrack(
  y: number,
  x0: number,
  x1: number,
  group?: string,
): FigureFace[] {
  const faces: FigureFace[] = [
    tube(
      [
        [x0, y - 3.6, 3],
        [x1, y - 3.6, 3],
      ],
      1.8,
      { tone: "edge", group },
    ),
    tube(
      [
        [x0, y + 3.6, 3],
        [x1, y + 3.6, 3],
      ],
      1.8,
      { tone: "edge", group },
    ),
  ];
  for (let x = x0 + 2; x <= x1 - 2; x += 10) {
    faces.push(
      tube(
        [
          [x, y - 5.2, 2],
          [x, y + 5.2, 2],
        ],
        1.4,
        { tone: "lo", group },
      ),
    );
  }
  return faces;
}

function wagon(x: number, y: number, group: string, active: boolean): FigureFace[] {
  const faces: FigureFace[] = [];
  faces.push(
    ...box(x - 9, y - 5.5, 8, 18, 11, 9, {
      r: 1.2,
      tone: "edge",
      topTone: active ? "hi" : "mid",
      group,
    }),
  );
  for (const wx of [x - 5.4, x + 5.4]) {
    for (const wy of [y - 5.2, y + 5.2]) {
      faces.push(
        disc3(wx, wy, 5, 2.8, "yz", { tone: "edge", group }),
        disc3(wx, wy, 5, 1.2, "yz", {
          fill: false,
          tone: "lo",
          group,
        }),
      );
    }
  }
  faces.push(
    stroke3(
      [
        [x - 4, y + 5.6, 13],
        [x + 4, y + 5.6, 13],
      ],
      "lo",
      { group },
    ),
  );
  return faces;
}

function kanbanFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...railTrack(-20, -54, 54),
    ...railTrack(0, -54, 54),
    ...railTrack(20, -54, 54),
  );

  /* A curved crossover from the middle track to the far track. */
  const crossover: Point3[] = [];
  for (let index = 0; index <= 14; index += 1) {
    const t = index / 14;
    crossover.push([-4 + t * 44, t * 20, 3]);
  }
  for (const offset of [-3.6, 3.6]) {
    faces.push(
      tube(
        crossover.map(([x, y, z]) => [x, y + offset, z] as Point3),
        1.7,
        { tone: "mid", group: "switch" },
      ),
    );
  }
  for (let index = 1; index < 7; index += 1) {
    const point = crossover[Math.floor(index * 2)];
    faces.push(
      tube(
        [
          [point[0], point[1] - 5, 2],
          [point[0], point[1] + 5, 2],
        ],
        1.3,
        { tone: "lo", group: "switch" },
      ),
    );
  }

  faces.push(
    ...cylinder(2, 10, 0, 20, 3.4, 2.4, {
      tone: "edge",
      topTone: "mid",
      group: "switch",
    }),
    ...box(0, 7, 20, 4, 4, 16, {
      r: 1,
      tone: "edge",
      topTone: "hi",
      group: "switch",
    }),
    ellipse3(2, 8, 20.4, 3.6, 3.6, { tone: "hi", group: "switch" }),
  );

  faces.push(...wagon(-26, -20, "wagon-a", false));
  faces.push(...wagon(22, 20, "wagon-b", true));

  /* A small signal mast at the throat of the yard. */
  faces.push(
    ...cylinder(46, -16, 0, 34, 1.8, 1.4, {
      tone: "mid",
      topTone: "lo",
    }),
    disc3(46, -16, 31, 4.2, "xz", { tone: "edge" }),
    disc3(46, -16, 31, 2.4, "xz", { tone: "hi" }),
    tube(
      [
        [46, -16, 34],
        [46, -16, 40],
      ],
      1.2,
      { tone: "lo" },
    ),
  );

  return faces;
}

export const kanban: PrototypeMeta = {
  slug: "kanban",
  name: "Kanban",
  component: "Kanban",
  object: "Rail switchyard",
  story:
    "The points throw over and a wagon rolls across onto the next track.",
  note: "Work moves between lanes the way cars move between sidings: one switch at a time.",
  scene: figureScene({
    slug: "kanban",
    name: "Kanban",
    component: "Data",
    object: "Rail switchyard",
    description:
      "Three parallel sidings joined by a crossover, with two wagons, a switch lever and a signal mast.",
    aria:
      "An isometric rail switchyard: three parallel tracks with sleepers, a crossover, two wagons, a lever and a signal.",
    faces: kanbanFaces(),
    motions: [
      { group: "switch", kind: "sway", period: 2200, amount: 7 },
      {
        group: "wagon-b",
        kind: "bob",
        period: 2200,
        amount: 2.4,
        phase: 0.2,
      },
      { group: "wagon-a", kind: "bob", period: 3000, amount: 1.2 },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 38. Timeline — film strip                                                  */
/* -------------------------------------------------------------------------- */

function timelineFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const samples: Array<{ x: number; z: number }> = [];
  for (let index = 0; index <= 18; index += 1) {
    const t = index / 18;
    samples.push({
      x: -54 + t * 108,
      z: 38 + Math.sin(t * Math.PI) * 10,
    });
  }

  const top = [...samples.map(({ x, z }) => [x, -13, z] as Point3)];
  top.push(...samples.map(({ x, z }) => [x, 13, z] as Point3).reverse());
  faces.push(face3(top, { tone: "edge", group: "strip" }));

  /* A narrow lower edge gives the ribbon its thickness. */
  for (const side of [-13, 13]) {
    for (let index = 0; index < samples.length - 1; index += 1) {
      const a = samples[index];
      const b = samples[index + 1];
      faces.push(
        face3(
          [
            [a.x, side, a.z],
            [b.x, side, b.z],
            [b.x, side, b.z - 2.2],
            [a.x, side, a.z - 2.2],
          ],
          { tone: "edge", group: "strip" },
        ),
      );
    }
  }

  for (const side of [-13, 13]) {
    const line = samples.map(({ x, z }) => [x, side, z + 0.3] as Point3);
    faces.push(stroke3(line, "lo", { group: "strip" }));
  }

  /* Sprocket holes along both edges. */
  for (let index = 0; index < samples.length; index += 1) {
    const sample = samples[index];
    for (const side of [-9.6, 9.6]) {
      faces.push(
        ellipse3(sample.x, side, sample.z + 0.5, 1.6, 1.6, {
          tone: "lo",
          group: "strip",
        }),
      );
    }
  }

  /* Four frames; the chosen one is a card lifted off the band. */
  const frameCenters = [-38, -14, 12, 38];
  frameCenters.forEach((x, index) => {
    const sample = samples.reduce((best, point) =>
      Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best,
    );
    if (index === 2) {
      const z0 = sample.z + 4;
      faces.push(
        face3(
          [
            [x - 10, -9, z0],
            [x + 10, -9, z0],
            [x + 10, -9, z0 + 14],
            [x - 10, -9, z0 + 14],
          ],
          { tone: "mid", group: "frame-b" },
        ),
        stroke3(
          [
            [x - 10, -9.2, z0],
            [x + 10, -9.2, z0],
            [x + 10, -9.2, z0 + 14],
            [x - 10, -9.2, z0 + 14],
            [x - 10, -9.2, z0],
          ],
          "hi",
          { group: "frame-b" },
        ),
        face2(
          [
            iso(x - 7, -9.4, z0 + 3),
            iso(x + 7, -9.4, z0 + 3),
            iso(x + 4, -9.4, z0 + 9),
            iso(x - 3, -9.4, z0 + 6),
            iso(x - 7, -9.4, z0 + 10),
          ],
          { tone: "lo", group: "frame-b" },
        ),
      );
    } else {
      faces.push(
        stroke3(
          [
            [x - 9, -9, sample.z - 7],
            [x + 9, -9, sample.z - 7],
            [x + 9, -9, sample.z + 7],
            [x - 9, -9, sample.z + 7],
            [x - 9, -9, sample.z - 7],
          ],
          index === 0 ? "mid" : "lo",
          { group: index === 0 ? "frame-a" : "frame-c" },
        ),
        face2(
          [
            iso(x - 5.6, -9.2, sample.z - 3.4),
            iso(x + 5.6, -9.2, sample.z - 3.4),
            iso(x + 3, -9.2, sample.z + 2.4),
            iso(x - 3.4, -9.2, sample.z),
          ],
          { fill: false, tone: "lo", group: index === 0 ? "frame-a" : "frame-c" },
        ),
      );
    }
  });

  return faces;
}

export const timeline: PrototypeMeta = {
  slug: "timeline",
  name: "Timeline",
  component: "Timeline",
  object: "Film strip",
  story:
    "The strip advances by one frame and the chosen image lifts clear of the band.",
  note: "A timeline is a sequence you read by sliding your eye along one ribbon.",
  scene: figureScene({
    slug: "timeline",
    name: "Timeline",
    component: "Data",
    object: "Film strip",
    description:
      "A strip of film with sprocket holes and three frames, the middle frame raised and lit.",
    aria:
      "An isometric strip of film with sprocket holes along both edges and three frames; the middle frame is lifted.",
    faces: timelineFaces(),
    motions: [
      { group: "strip", kind: "sway", period: 4200, amount: 0.8 },
      { group: "frame-a", kind: "lift", period: 2600, amount: 2.2 },
      { group: "frame-b", kind: "lift", period: 2600, amount: 4.2, phase: 0.2 },
      { group: "frame-c", kind: "lift", period: 2600, amount: 2.2, phase: 0.4 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 39. Avatar — cameo brooch (study drawing)                                  */
/* -------------------------------------------------------------------------- */

export const avatarEntry = avatar;

/* -------------------------------------------------------------------------- */
/* 40. Image Zoom — camera lens barrel                                        */
/* -------------------------------------------------------------------------- */

function imageZoomFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 7, 26, 26, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ...cylinder(0, 0, 7, 25, 21, 21, {
      tone: "edge",
      topTone: "lo",
    }),
    ellipse3(0, 0, 32.2, 18.5, 18.5, { fill: false, tone: "lo" }),
  );

  /* Distance scale engraved on the fixed barrel. */
  for (let index = 0; index < 14; index += 1) {
    const a = -0.9 + index * 0.14;
    faces.push(
      stroke3(
        [
          [Math.cos(a) * 21.2, Math.sin(a) * 21.2, 10],
          [Math.cos(a) * 21.2, Math.sin(a) * 21.2, index % 3 === 0 ? 14 : 12.4],
        ],
        "lo",
      ),
    );
  }
  const [idX, idY] = iso(21.2, 0, 18.4);
  faces.push(face2(ellipse2(idX, idY, 1.6, 1.6, 8), { tone: "hi" }));

  faces.push(
    ...cylinder(0, 0, 18, 12, 23.4, 23.4, {
      tone: "edge",
      topTone: "mid",
      group: "focus",
    }),
  );
  for (let index = 0; index < 28; index += 1) {
    const a = (index / 28) * TAU;
    faces.push(
      stroke3(
        [
          [Math.cos(a) * 23.4, Math.sin(a) * 23.4, 19.4],
          [Math.cos(a) * 23.4, Math.sin(a) * 23.4, 28.6],
        ],
        "lo",
        { group: "focus" },
      ),
    );
  }

  faces.push(
    ...cylinder(0, 0, 30, 8, 25, 22.4, {
      tone: "edge",
      topTone: "mid",
      group: "front",
    }),
    ellipse3(0, 0, 38.2, 21.6, 21.6, {
      tone: "lo",
      group: "front",
    }),
    ellipse3(0, 0, 38.4, 18.2, 18.2, {
      fill: false,
      tone: "mid",
      group: "front",
    }),
    ellipse3(0, 0, 38.5, 14.2, 14.2, {
      fill: false,
      tone: "lo",
      group: "front",
    }),
    ellipse3(0, 0, 38.7, 9.6, 9.6, {
      tone: "mid",
      group: "front",
    }),
    ellipse3(-5, -4, 39.1, 4.2, 2.6, {
      fill: false,
      tone: "hi",
      group: "glint",
    }),
  );

  /* Three bayonet tabs make the front read as a lens mount. */
  for (let index = 0; index < 3; index += 1) {
    const a = (index / 3) * TAU;
    const [ax, ay] = iso(Math.cos(a) * 26.4, Math.sin(a) * 26.4, 36.4);
    faces.push(
      face2(roundedRect(ax - 3.4, ay - 1.6, 6.8, 3.2, 0.8), {
        tone: "mid",
        group: "front",
      }),
    );
  }

  /* Aperture marks on the rear mount. */
  for (let index = 0; index < 8; index += 1) {
    const a = (index / 8) * TAU;
    const [ax, ay] = iso(Math.cos(a) * 26.5, Math.sin(a) * 26.5, 7.1);
    faces.push(
      face2(
        [
          [ax - 1.5, ay],
          [ax, ay - 1.5],
          [ax + 1.5, ay],
          [ax, ay + 1.5],
        ],
        { tone: "lo" },
      ),
    );
  }

  return faces;
}

export const imageZoom: PrototypeMeta = {
  slug: "image-zoom",
  name: "Image Zoom",
  component: "Image Zoom",
  object: "Camera lens barrel",
  story:
    "The focus ring turns, the barrel extends one notch and the front glass catches a highlight.",
  note: "Zooming is a mechanism you turn and pull, not a number in a field.",
  scene: figureScene({
    slug: "image-zoom",
    name: "Image Zoom",
    component: "Media",
    object: "Camera lens barrel",
    description:
      "A camera lens standing on its rear cap: a ribbed focus ring, an extending barrel and a deep front element.",
    aria:
      "An isometric camera lens with a knurled focus ring, a telescoping barrel and a glass front element.",
    faces: imageZoomFaces(),
    motions: [
      { group: "focus", kind: "spin", period: 3600, amount: 360 },
      { group: "front", kind: "lift", period: 3200, amount: 2.4 },
      { group: "glint", kind: "breathe", period: 2200, amount: 0.12 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 41. Carousel — ferris wheel                                                */
/* -------------------------------------------------------------------------- */

function carouselFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const cz = 62;
  const R = 38;

  faces.push(
    ...ring(0, 0, cz, R, 2.2, "xz", { tone: "edge", group: "wheel" }),
    disc3(0, 0, cz, 6, "xz", { tone: "edge", group: "wheel" }),
    disc3(0, 0, cz, 3, "xz", { tone: "hi", group: "wheel" }),
  );

  for (let index = 0; index < 8; index += 1) {
    const a = (index / 8) * TAU + 0.2;
    const x = Math.cos(a) * R;
    const z = cz + Math.sin(a) * R;
    faces.push(
      tube(
        [
          [0, 0, cz],
          [x, 0, z],
        ],
        1.3,
        { tone: "mid", group: "wheel" },
      ),
    );
    const [cx, cy] = iso(x, 0, z - 6);
    faces.push(
      face2(roundedRect(cx - 6, cy - 4, 12, 8, 2, 3), {
        tone: index === 2 ? "hi" : "mid",
        group: "wheel",
      }),
      stroke2(
        [
          [cx, cy - 4],
          [cx, cy - 8],
        ],
        "lo",
        { group: "wheel" },
      ),
      face2(ellipse2(cx, cy, 2.2, 2.2, 12), {
        fill: false,
        tone: "lo",
        group: "wheel",
      }),
    );
  }

  /* Two A-frames on either side of the wheel, with feet on the ground. */
  for (const y of [-17, 17]) {
    faces.push(
      tube(
        [
          [-33, y, 0],
          [0, y, cz],
        ],
        2.8,
        { tone: "edge" },
      ),
      tube(
        [
          [33, y, 0],
          [0, y, cz],
        ],
        2.8,
        { tone: "edge" },
      ),
      tube(
        [
          [-22, y, 20],
          [22, y, 20],
        ],
        1.8,
        { tone: "lo" },
      ),
    );
  }
  faces.push(
    tube(
      [
        [0, -22, cz],
        [0, 22, cz],
      ],
      3.2,
      { tone: "mid" },
    ),
  );

  return faces;
}

export const carousel: PrototypeMeta = {
  slug: "carousel",
  name: "Carousel",
  component: "Carousel",
  object: "Ferris wheel",
  story:
    "The wheel rolls forward one cabin and the lead car swings as it comes around.",
  note: "Slides arrive at the viewer one at a time, the way cabins come to the front of a wheel.",
  scene: figureScene({
    slug: "carousel",
    name: "Carousel",
    component: "Media",
    object: "Ferris wheel",
    description:
      "A ferris wheel with eight hanging cabins on a spoked rim, carried by two A-frame supports.",
    aria:
      "An isometric ferris wheel with eight cabins, one lit, on a spoked wheel held by two A-frame supports.",
    faces: carouselFaces(),
    motions: [
      { group: "wheel", kind: "spin", period: 7600, amount: 360 },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 42. Video Player — film projector (study drawing)                          */
/* -------------------------------------------------------------------------- */

export const videoPlayerEntry = videoPlayer;

/* -------------------------------------------------------------------------- */
/* 43. Code — cipher wheel                                                    */
/* -------------------------------------------------------------------------- */

function codeFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 2, 4, 38, 38, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ...cylinder(0, 0, 6, 2.6, 38, 38, {
      tone: "edge",
      topTone: "lo",
    }),
    ...cylinder(0, 0, 9, 5, 27, 27, {
      tone: "edge",
      topTone: "mid",
      group: "inner",
    }),
    ...cylinder(0, 0, 4, 14, 5, 4.6, {
      tone: "edge",
      topTone: "mid",
      group: "knob",
    }),
    ...cylinder(0, 0, 18, 3, 6, 5.4, {
      tone: "edge",
      topTone: "hi",
      group: "knob",
    }),
  );

  for (let index = 0; index < 26; index += 1) {
    const a = (index / 26) * TAU;
    const [ox, oy] = iso(Math.cos(a) * 31, Math.sin(a) * 31, 8.4);
    const [ox2, oy2] = iso(Math.cos(a) * 36, Math.sin(a) * 36, 8.4);
    faces.push(stroke2([[ox, oy], [ox2, oy2]], index % 5 === 0 ? "mid" : "lo"));
    if (index % 5 === 0) {
      const [bx, by] = iso(Math.cos(a) * 29, Math.sin(a) * 29, 8.6);
      faces.push(face2(ellipse2(bx, by, 1.15, 1.15, 8), { tone: "mid" }));
    }

    const [ix, iy] = iso(Math.cos(a) * 20, Math.sin(a) * 20, 14.4);
    const [ix2, iy2] = iso(Math.cos(a) * 25, Math.sin(a) * 25, 14.4);
    faces.push(stroke2([[ix, iy], [ix2, iy2]], "mid", { group: "inner" }));
    if (index % 5 === 0) {
      const [bx, by] = iso(Math.cos(a) * 18, Math.sin(a) * 18, 14.6);
      faces.push(
        face2(ellipse2(bx, by, 1.1, 1.1, 8), {
          tone: "lo",
          group: "inner",
        }),
      );
    }
  }

  /* Vertical ticks around the fixed outer rim. */
  for (let index = 0; index < 36; index += 1) {
    const a = (index / 36) * TAU;
    faces.push(
      stroke3(
        [
          [Math.cos(a) * 38.1, Math.sin(a) * 38.1, 3.4],
          [Math.cos(a) * 38.1, Math.sin(a) * 38.1, 7.6],
        ],
        "lo",
      ),
    );
  }

  /* Lit index notch on the fixed ring and a pointer on the inner wheel. */
  const [nx, ny] = iso(0, 38.4, 8.4);
  faces.push(
    face2(
      [
        [nx - 3.2, ny - 2],
        [nx, ny + 3.2],
        [nx + 3.2, ny - 2],
      ],
      { tone: "hi" },
    ),
  );
  const [tx, ty] = iso(0, 27.2, 14.6);
  faces.push(
    face2(
      [
        [tx - 2.6, ty + 1.2],
        [tx, ty - 4.4],
        [tx + 2.6, ty + 1.2],
      ],
      { tone: "edge", group: "inner" },
    ),
  );

  return faces;
}

export const code: PrototypeMeta = {
  slug: "code",
  name: "Code",
  component: "Code",
  object: "Cipher wheel",
  story:
    "The inner wheel turns by one letter and the index notch clicks into line.",
  note: "Code is a translation between two alphabets, turned one notch at a time.",
  scene: figureScene({
    slug: "code",
    name: "Code",
    component: "Text",
    object: "Cipher wheel",
    description:
      "A two-disc cipher wheel with graduated rims, a knurled axle and a lit index window.",
    aria:
      "An isometric cipher wheel: two stacked alphabet discs with tick marks, an axle and a lit alignment window.",
    faces: codeFaces(),
    motions: [
      { group: "inner", kind: "spin", period: 3200, amount: 360 },
      { group: "knob", kind: "breathe", period: 2600, amount: 0.03 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 44. Theme Switch — kaleidoscope                                            */
/* -------------------------------------------------------------------------- */

function axialTube(
  axisX: ReadonlyArray<{ x: number; r: number }>,
  cy: number,
  cz: number,
  opts: FaceOptions & { sides?: number } = {},
): FigureFace[] {
  const sides = opts.sides ?? 28;
  const tone = opts.tone ?? "edge";
  const group = opts.group;
  const loops = axisX.map(({ x, r }) => {
    const points: Point3[] = [];
    for (let index = 0; index < sides; index += 1) {
      const a = (index / sides) * TAU;
      points.push([x, cy + Math.cos(a) * r, cz + Math.sin(a) * r]);
    }
    return points;
  });
  const quads: Array<{ points: Point3[]; depth: number }> = [];
  for (let level = 0; level < loops.length - 1; level += 1) {
    const left = loops[level];
    const right = loops[level + 1];
    for (let index = 0; index < sides; index += 1) {
      const next = (index + 1) % sides;
      const points = [left[index], left[next], right[next], right[index]];
      quads.push({
        points,
        depth:
          points.reduce((sum, point) => sum + point[0] + point[1], 0) /
          points.length,
      });
    }
  }
  quads.sort(byDepth);
  const faces: FigureFace[] = quads.map((quad) =>
    face3(quad.points, { tone, stroke: false, group }),
  );
  faces.push(face3(loops[loops.length - 1], { tone: "mid", group }));
  faces.push(
    face2(loftOutline(loops), { fill: false, tone, group }),
  );
  return faces;
}

function themeSwitchFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const cz = 54;
  const axis = [
    { x: -50, r: 6.4 },
    { x: -45, r: 6.4 },
    { x: -40, r: 9.4 },
    { x: -34, r: 9.4 },
    { x: -26, r: 13.4 },
    { x: -6, r: 15.6 },
    { x: 16, r: 17.8 },
    { x: 32, r: 20.4 },
    { x: 40, r: 21.4 },
  ];
  faces.push(...axialTube(axis, 0, cz, { tone: "edge", sides: 30 }));

  for (const x of [-42, -36]) {
    faces.push(
      face2(
        circle(0, 0, 9.6, 30).map(([u, v]) => iso(x, u, cz + v)),
        { fill: false, tone: "mid", group: "collar" },
      ),
    );
  }
  for (let index = 0; index < 20; index += 1) {
    const a = (index / 20) * TAU;
    faces.push(
      stroke3(
        [
          [-42, Math.cos(a) * 9.6, cz + Math.sin(a) * 9.6],
          [-36, Math.cos(a) * 9.6, cz + Math.sin(a) * 9.6],
        ],
        "lo",
        { group: "collar" },
      ),
    );
  }

  /* The eyepiece and the kaleidoscopic window at the wide end. */
  faces.push(
    disc3(-50.2, 0, cz, 6.4, "yz", { tone: "lo" }),
    disc3(40.2, 0, cz, 21.4, "yz", { tone: "mid", group: "shards" }),
  );
  const rings: Array<{ inner: number; outer: number; count: number; offset: number }> = [
    { inner: 0, outer: 6.2, count: 8, offset: 0 },
    { inner: 6.6, outer: 12.4, count: 8, offset: Math.PI / 8 },
    { inner: 12.8, outer: 18.6, count: 12, offset: 0 },
  ];
  for (const ring of rings) {
    for (let index = 0; index < ring.count; index += 1) {
      const a0 = ring.offset + (index / ring.count) * TAU;
      const a1 = ring.offset + ((index + 1) / ring.count) * TAU;
      const wedge: Point2[] = [];
      for (let step = 0; step <= 4; step += 1) {
        const a = a0 + ((a1 - a0) * step) / 4;
        wedge.push(iso(40.5, Math.cos(a) * ring.inner, cz + Math.sin(a) * ring.inner));
      }
      for (let step = 4; step >= 0; step -= 1) {
        const a = a0 + ((a1 - a0) * step) / 4;
        wedge.push(iso(40.5, Math.cos(a) * ring.outer, cz + Math.sin(a) * ring.outer));
      }
      const lit = ring.outer === 18.6 && index === 2;
      faces.push(
        face2(wedge, {
          tone: lit ? "hi" : (index + Math.round(ring.outer)) % 3 === 0 ? "edge" : "lo",
          group: "shards",
        }),
      );
    }
  }
  faces.push(
    ...ring(40.7, 0, cz, 19.2, 1.5, "yz", {
      tone: "edge",
      group: "shards",
    }),
    disc3(40.4, 0, cz, 3.2, "yz", { tone: "hi", group: "shards" }),
  );

  /* A cradle stand, because the tube has to rest somewhere. */
  faces.push(
    tube(
      [
        [0, -18, 0],
        [0, -18, 31],
      ],
      2.8,
      { tone: "edge" },
    ),
    tube(
      [
        [-9, -14, 31],
        [0, -18, 22],
        [9, -14, 31],
      ],
      2.2,
      { tone: "mid" },
    ),
    tube(
      [
        [-14, -18, 1],
        [-6, -4, 1],
        [6, -4, 1],
        [14, -18, 1],
      ],
      1.8,
      { tone: "lo" },
    ),
  );

  return faces;
}

export const themeSwitch: PrototypeMeta = {
  slug: "theme-switch",
  name: "Theme Switch",
  component: "Theme Switch",
  object: "Kaleidoscope",
  story:
    "The collar turns and the coloured shards roll into a new pattern at the wide end.",
  note: "One turn of the tube reorders everything you see through it.",
  scene: figureScene({
    slug: "theme-switch",
    name: "Theme Switch",
    component: "Effects",
    object: "Kaleidoscope",
    description:
      "A long tapered kaleidoscope on a cradle stand: knurled collar, eyepiece and a lit window of coloured shards.",
    aria:
      "An isometric kaleidoscope on a small cradle: a tapered tube with a knurled collar, an eyepiece and a lit mosaic window.",
    faces: themeSwitchFaces(),
    motions: [
      { group: "collar", kind: "spin", period: 3400, amount: 360 },
      { group: "shards", kind: "flicker", period: 2600, amount: 0.05 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 45. Cursor — computer mouse                                                */
/* -------------------------------------------------------------------------- */

function cursorFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...loft(
      0,
      0,
      [
        { z: 0, rx: 21, ry: 29 },
        { z: 2.4, rx: 22, ry: 30 },
        { z: 8, rx: 21.4, ry: 29 },
        { z: 13, rx: 18.8, ry: 25 },
        { z: 17, rx: 12.6, ry: 17 },
        { z: 19.4, rx: 6.2, ry: 9.4 },
      ],
      { tone: "edge", topTone: "mid", group: "body", sides: 34 },
    ),
  );

  faces.push(
    stroke3(
      [
        [0, 22, 17.6],
        [0, 10, 20.3],
        [0, -4, 20.3],
        [0, -18, 17.4],
      ],
      "lo",
      { group: "body" },
    ),
  );

  /* Left and right buttons sit on the top shell; the left one is pressed. */
  faces.push(
    face3(
      [
        [-12, 3, 19.8],
        [-1.6, 4.4, 20.9],
        [-1.6, 16, 19.4],
        [-12, 14.6, 18.6],
      ],
      { tone: "mid", group: "click" },
    ),
    face3(
      [
        [1.6, 4.4, 20.9],
        [12, 3, 19.8],
        [12, 14.6, 18.6],
        [1.6, 16, 19.4],
      ],
      { tone: "lo", group: "body" },
    ),
  );

  faces.push(
    disc3(0, 15, 13.2, 4.6, "yz", {
      tone: "edge",
      group: "wheel",
    }),
    disc3(0, 15, 13.2, 2.2, "yz", { tone: "hi", group: "wheel" }),
    stroke3(
      [
        [-2.8, 13.2, 17.4],
        [2.8, 13.2, 17.4],
      ],
      "lo",
      { group: "body" },
    ),
  );

  /* Cable leaving the back and curling on the desk. */
  faces.push(
    tube(
      [
        [0, -29, 12],
        [0, -37, 28],
        [12, -45, 30],
        [28, -38, 14],
        [30, -24, 5],
      ],
      2.2,
      { tone: "edge", group: "cable" },
    ),
    tube(
      [
        [30, -24, 5],
        [34, -16, 3],
      ],
      2.2,
      { tone: "lo", group: "cable" },
    ),
  );

  /* Side grip lines. */
  for (const y of [-10, 0, 10]) {
    faces.push(
      stroke3(
        [
          [20.8, y, 5],
          [19.4, y, 12],
        ],
        "lo",
        { group: "body" },
      ),
      stroke3(
        [
          [-20.8, y, 5],
          [-19.4, y, 12],
        ],
        "lo",
        { group: "body" },
      ),
    );
  }

  return faces;
}

export const cursor: PrototypeMeta = {
  slug: "cursor",
  name: "Cursor",
  component: "Cursor",
  object: "Computer mouse",
  story:
    "The left button clicks down and the cable gives a little jump behind the mouse.",
  note: "A cursor is the hand's proxy on the desk, with a cable still attached.",
  scene: figureScene({
    slug: "cursor",
    name: "Cursor",
    component: "Interaction",
    object: "Computer mouse",
    description:
      "A two-button computer mouse with a scroll wheel and a cable curling across the desk.",
    aria:
      "An isometric computer mouse with two buttons, a scroll wheel and a cable curling behind it.",
    faces: cursorFaces(),
    motions: [
      { group: "click", kind: "bob", period: 1600, amount: 1.8 },
      { group: "wheel", kind: "spin", period: 2400, amount: 360 },
      { group: "cable", kind: "sway", period: 2600, amount: 1.8 },
    ],
    press: 1.2,
  }),
};

/* -------------------------------------------------------------------------- */
/* 46. Chat — tin-can telephone (study drawing)                               */
/* -------------------------------------------------------------------------- */

export const chatEntry = chat;

/* -------------------------------------------------------------------------- */
/* 47. Prompt — conductor's baton                                             */
/* -------------------------------------------------------------------------- */

function promptFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 54, 3.2, 2.4, {
      tone: "edge",
      topTone: "mid",
    }),
  );
  for (const [x, y] of [
    [-17, -6],
    [17, -6],
    [0, 16],
  ] as const) {
    faces.push(
      tube(
        [
          [0, 0, 8],
          [x, y, 1],
        ],
        2.4,
        { tone: "edge" },
      ),
    );
  }

  /* Tilted music desk: a back edge higher than the front edge. */
  const desk: Point3[] = [
    [-27, -14, 70],
    [27, -14, 70],
    [27, 14, 54],
    [-27, 14, 54],
  ];
  faces.push(
    face3(desk, { tone: "edge" }),
    face3(
      [
        [-23, -11, 68.5],
        [23, -11, 68.5],
        [23, 10, 56.4],
        [-23, 10, 56.4],
      ],
      { tone: "mid", group: "score" },
    ),
  );
  for (let line = 0; line < 4; line += 1) {
    const t = (line + 1) / 5;
    const y = -9 + t * 18;
    const z = 67.4 - t * 11;
    faces.push(
      stroke3(
        [
          [-19, y, z],
          [19, y, z],
        ],
        "lo",
        { group: "score" },
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [0, -12, 68.2],
        [0, 12, 55.4],
      ],
      "lo",
      { group: "score" },
    ),
    ...box(-31, -1, 63, 8, 8, 7, {
      r: 1.4,
      tone: "edge",
      topTone: "lo",
    }),
  );

  /* Baton resting across the desk and pointing up to the right. */
  faces.push(
    tube(
      [
        [6, 10, 59],
        [-34, 10, 86],
      ],
      2.2,
      { tone: "edge", group: "baton" },
    ),
    tube(
      [
        [6, 10, 59],
        [15, 10, 53.8],
      ],
      3.6,
      { tone: "mid", group: "baton" },
    ),
    ellipse3(15, 10, 53.6, 2.2, 2.2, {
      fill: false,
      tone: "lo",
      group: "baton",
    }),
  );
  const [tx, ty] = iso(-34, 10, 86);
  faces.push(
    face2(ellipse2(tx, ty, 2.4, 2.4, 12), {
      tone: "hi",
      group: "tip",
    }),
  );

  return faces;
}

export const prompt: PrototypeMeta = {
  slug: "prompt",
  name: "Prompt",
  component: "Prompt",
  object: "Conductor's baton",
  story:
    "The baton lifts off the desk and beats once; the score answers with a low hum.",
  note: "A prompt is a short gesture that sets a whole performance in motion.",
  scene: figureScene({
    slug: "prompt",
    name: "Prompt",
    component: "AI",
    object: "Conductor's baton",
    description:
      "A conductor's baton resting on a tilted music desk, on a slim tripod stand.",
    aria:
      "An isometric conductor's baton on a tilted music stand with a score and a lit tip.",
    faces: promptFaces(),
    motions: [
      {
        group: "baton",
        kind: "sway",
        period: 1900,
        amount: 8,
        pivot: [6, 10, 59],
      },
      { group: "baton", kind: "lift", period: 1900, amount: 2.8 },
      { group: "score", kind: "flicker", period: 2600, amount: 0.02 },
      { group: "tip", kind: "breathe", period: 1900, amount: 0.14 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 48. Reasoning — Jacob's ladder toy                                         */
/* -------------------------------------------------------------------------- */

function reasoningFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const railTop = 82;
  const railBottom = 10;

  for (const x of [-22, 22]) {
    faces.push(
      tube(
        [
          [x, 0, railBottom],
          [x, 0, railTop],
        ],
        2.8,
        { tone: "edge" },
      ),
      ...cylinder(x, 0, 0, 3, 5.4, 5.4, {
        tone: "mid",
        topTone: "lo",
      }),
    );
  }
  faces.push(
    tube(
      [
        [-22, 0, railTop],
        [22, 0, railTop],
      ],
      2.4,
      { tone: "mid" },
    ),
    tube(
      [
        [-22, 0, railBottom],
        [22, 0, railBottom],
      ],
      2.4,
      { tone: "mid" },
    ),
  );

  const levels = [17, 30, 43, 56, 69];
  levels.forEach((z, index) => {
    const side = index % 2 === 0 ? -1 : 1;
    const group = `block-${index + 1}`;
    const pivotX = side * 22;
    const length = 40;
    const angle = side < 0 ? -0.5 : Math.PI + 0.5;
    const endX = pivotX + Math.cos(angle) * length;
    const endZ = z + Math.sin(angle) * length * (side < 0 ? 1 : -1);
    const p0 = iso(pivotX, 0, z);
    const p1 = iso(endX, 0, endZ);
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = (-dy / len) * 6;
    const ny = (dx / len) * 6;
    const backX = 2.6;
    const backY = 3.4;
    const front = [
      [p0[0] + nx, p0[1] + ny],
      [p1[0] + nx, p1[1] + ny],
      [p1[0] - nx, p1[1] - ny],
      [p0[0] - nx, p0[1] - ny],
    ] as Point2[];
    faces.push(
      face2(front.map(([x, y]) => [x + backX, y + backY] as Point2), {
        tone: "lo",
        group,
      }),
      face2(
        [
          front[1],
          [front[1][0] + backX, front[1][1] + backY],
          [front[2][0] + backX, front[2][1] + backY],
          front[2],
        ],
        { tone: "mid", group },
      ),
      face2(front, {
        tone: index === 0 ? "hi" : "edge",
        group,
      }),
      face2(
        [
          [p0[0] + nx * 0.42, p0[1] + ny * 0.42],
          [p1[0] + nx * 0.42, p1[1] + ny * 0.42],
          [p1[0] - nx * 0.42, p1[1] - ny * 0.42],
          [p0[0] - nx * 0.42, p0[1] - ny * 0.42],
        ],
        { fill: false, tone: "lo", group },
      ),
      ellipse3(pivotX, 0, z, 3.4, 3.4, { tone: "mid", group }),
      ellipse3(endX, 0, endZ, 2.4, 2.4, {
        tone: index === 0 ? "hi" : "lo",
        group,
      }),
    );
  });

  /* Front rails sit over the slat pivots, so the toy reads as a ladder. */
  for (const x of [-22, 22]) {
    faces.push(
      tube(
        [
          [x, 7, 10],
          [x, 7, 84],
        ],
        2.2,
        { tone: "edge" },
      ),
    );
  }
  for (const z of levels) {
    for (const x of [-22, 22]) {
      faces.push(
        ellipse3(x, 7, z, 2.6, 2.6, {
          fill: false,
          tone: "lo",
        }),
      );
    }
  }

  return faces;
}

export const reasoning: PrototypeMeta = {
  slug: "reasoning",
  name: "Reasoning",
  component: "Reasoning",
  object: "Jacob's ladder toy",
  story:
    "The slats tumble down the ladder one after another, then reset at the top.",
  note: "Reasoning is a chain of steps where each block causes the next to fall.",
  scene: figureScene({
    slug: "reasoning",
    name: "Reasoning",
    component: "AI",
    object: "Jacob's ladder toy",
    description:
      "A Jacob's ladder toy: two upright rails with five hinged wooden slats falling in alternation.",
    aria:
      "An isometric Jacob's ladder toy with two rails and five alternating wooden slats, the top slat lit.",
    faces: reasoningFaces(),
    motions: [
      { group: "block-1", kind: "sway", period: 2200, amount: 5, phase: 0 },
      { group: "block-2", kind: "sway", period: 2200, amount: 5, phase: 0.2 },
      { group: "block-3", kind: "sway", period: 2200, amount: 5, phase: 0.4 },
      { group: "block-4", kind: "sway", period: 2200, amount: 5, phase: 0.6 },
      { group: "block-5", kind: "sway", period: 2200, amount: 5, phase: 0.8 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 49. Alert Dialog — emergency stop under a flip cover                       */
/* -------------------------------------------------------------------------- */

function alertDialogFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...box(-27, -19, 0, 54, 38, 19, {
      r: 3,
      tone: "edge",
      topTone: "mid",
    }),
    face3(
      [
        [-21, 19.2, 19],
        [21, 19.2, 19],
        [21, 19.2, 57],
        [-21, 19.2, 57],
      ],
      { tone: "edge" },
    ),
    face3(
      [
        [-17, 19.4, 22],
        [17, 19.4, 22],
        [17, 19.4, 53],
        [-17, 19.4, 53],
      ],
      { fill: false, tone: "lo" },
    ),
  );

  for (let index = 0; index < 9; index += 1) {
    const x0 = -23 + index * 5.8;
    faces.push(
      stroke3(
        [
          [x0, 19.5, 4],
          [x0 + 8, 19.5, 15],
        ],
        "lo",
      ),
    );
  }

  /* Mushroom button standing proud of the panel, behind the clear cover. */
  faces.push(
    disc3(0, 19.6, 36, 16, "xz", { tone: "edge" }),
    disc3(0, 19.8, 36, 13, "xz", { tone: "mid" }),
    tube(
      [
        [0, 20, 36],
        [0, 26, 36],
      ],
      20,
      { tone: "edge", group: "button" },
    ),
    disc3(0, 26.2, 36, 10.4, "xz", { tone: "edge", group: "button" }),
    disc3(0, 26.4, 36, 7.8, "xz", { tone: "hi", group: "button" }),
  );

  const [bcx, bcy] = iso(0, 27.2, 36);
  faces.push(
    face2(ellipse2(bcx, bcy, 17.4, 17.4, 24), {
      fill: false,
      tone: "lo",
      group: "cover",
    }),
    face2(roundedRect(bcx - 18, bcy - 19, 36, 38, 4, 4), {
      fill: false,
      tone: "mid",
      group: "cover",
    }),
    face2(roundedRect(bcx - 14, bcy - 15, 34, 36, 4, 4), {
      fill: false,
      tone: "lo",
      group: "cover",
    }),
    face2(
      [
        [bcx - 5, bcy + 21],
        [bcx + 5, bcy + 21],
        [bcx + 5, bcy + 26],
        [bcx - 5, bcy + 26],
      ],
      { tone: "mid", group: "cover" },
    ),
  );

  /* Hinge, glazing bars and a small label plate. */
  faces.push(
    tube(
      [
        [-17, 27.4, 55],
        [17, 27.4, 55],
      ],
      2.4,
      { tone: "edge", group: "cover" },
    ),
    stroke3(
      [
        [0, 27.5, 52],
        [0, 27.5, 22],
      ],
      "lo",
      { group: "cover" },
    ),
    tube(
      [
        [-17, 27.4, 54],
        [-22, 24, 44],
      ],
      1.2,
      { tone: "lo", group: "cover" },
    ),
    tube(
      [
        [17, 27.4, 54],
        [22, 24, 44],
      ],
      1.2,
      { tone: "lo", group: "cover" },
    ),
    ...box(-10, 26.4, 46, 20, 2, 6, {
      r: 1,
      tone: "mid",
      topTone: "lo",
      group: "cover",
    }),
  );

  return faces;
}

export const alertDialog: PrototypeMeta = {
  slug: "alert-dialog",
  name: "Alert Dialog",
  component: "Alert Dialog",
  object: "Emergency stop under a flip cover",
  story:
    "The hinged cover lifts and the mushroom stop presses down exactly once.",
  note: "A destructive confirmation is a guarded switch: reachable, but never by accident.",
  scene: figureScene({
    slug: "alert-dialog",
    name: "Alert Dialog",
    component: "Overlays",
    object: "Emergency stop under a flip cover",
    description:
      "A yellow-black emergency stop station with a large mushroom button under a raised clear flip cover.",
    aria:
      "An isometric emergency stop station with striped housing, a lit mushroom button and a hinged transparent cover.",
    faces: alertDialogFaces(),
    motions: [
      {
        group: "cover",
        kind: "sway",
        period: 2600,
        amount: 34,
        pivot: [0, 27.4, 55],
      },
      { group: "button", kind: "bob", period: 2600, amount: 1.2 },
    ],
    press: 1.2,
  }),
};

/* -------------------------------------------------------------------------- */
/* 50. Avatar Group — charm bracelet                                          */
/* -------------------------------------------------------------------------- */

function charm(
  x: number,
  y: number,
  z: number,
  kind: "heart" | "star" | "disc" | "key" | "drop",
  group: string,
  tone: DetailTone,
): FigureFace[] {
  const [px, py] = iso(x, y, z);
  const faces: FigureFace[] = [
    stroke2(
      [
        [px, py],
        [px, py + 6],
      ],
      "mid",
      { group },
    ),
  ];
  if (kind === "heart") {
    faces.push(
      face2(
        [
          [px, py + 6],
          [px - 5, py + 11],
          [px - 4.2, py + 15],
          [px, py + 18],
          [px + 4.2, py + 15],
          [px + 5, py + 11],
        ],
        { tone, group },
      ),
    );
  } else if (kind === "star") {
    faces.push(face2(star2(px, py + 12, 8, 3.4, 5), { tone, group }));
  } else if (kind === "disc") {
    faces.push(
      face2(ellipse2(px, py + 12, 6.4, 6.4, 20), { tone, group }),
      face2(ellipse2(px, py + 12, 3.4, 3.4, 16), {
        fill: false,
        tone: "lo",
        group,
      }),
    );
  } else if (kind === "key") {
    faces.push(
      face2(ellipse2(px, py + 9, 3.4, 3.4, 16), {
        fill: false,
        tone,
        group,
      }),
      face2(
        [
          [px - 1.4, py + 11],
          [px + 1.4, py + 11],
          [px + 1.4, py + 20],
          [px - 1.4, py + 20],
        ],
        { tone, group },
      ),
      face2(
        [
          [px + 1.4, py + 16],
          [px + 5, py + 16],
          [px + 5, py + 18.4],
          [px + 1.4, py + 18.4],
        ],
        { tone, group },
      ),
    );
  } else {
    faces.push(
      face2(
        [
          [px - 4.6, py + 7],
          [px + 4.6, py + 7],
          [px + 2.4, py + 18],
          [px, py + 21],
          [px - 2.4, py + 18],
        ],
        { tone, group },
      ),
    );
  }
  return faces;
}

function avatarGroupFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const R = 32;
  const z = 11;
  const ringPoints: Point3[] = [];
  for (let index = 0; index <= 44; index += 1) {
    const a = (index / 44) * TAU;
    ringPoints.push([Math.cos(a) * R, Math.sin(a) * R, z]);
  }
  faces.push(tube(ringPoints, 2.8, { tone: "edge", group: "bracelet" }));

  faces.push(
    ...box(R - 4, -5, z - 2, 8, 10, 5, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "bracelet",
    }),
  );

  const charms: Array<{
    a: number;
    kind: "heart" | "star" | "disc" | "key" | "drop";
    group: string;
    tone: DetailTone;
  }> = [
    { a: 2.5, kind: "heart", group: "charms", tone: "mid" },
    { a: 2.0, kind: "disc", group: "charms", tone: "mid" },
    { a: 1.25, kind: "star", group: "charm-lift", tone: "hi" },
    { a: 0.55, kind: "key", group: "charms", tone: "mid" },
    { a: -0.35, kind: "drop", group: "charms", tone: "mid" },
  ];
  for (const item of charms) {
    faces.push(
      ...charm(
        Math.cos(item.a) * R,
        Math.sin(item.a) * R,
        z - 1,
        item.kind,
        item.group,
        item.tone,
      ),
    );
  }

  /* The charms rest on the surface, so the bracelet has no need for a base. */
  for (const [x, y] of [
    [-22, 22],
    [5, 28],
    [26, 10],
  ] as const) {
    const [px, py] = iso(x, y, 0.6);
    faces.push(
      face2(ellipse2(px, py, 2.4, 1.2, 12), { tone: "lo" }),
    );
  }

  return faces;
}

export const avatarGroup: PrototypeMeta = {
  slug: "avatar-group",
  name: "Avatar Group",
  component: "Avatar Group",
  object: "Charm bracelet",
  story:
    "The charms swing together on the hoop and one rises above the others.",
  note: "A group is several identities held on one ring, read as a single object.",
  scene: figureScene({
    slug: "avatar-group",
    name: "Avatar Group",
    component: "Media",
    object: "Charm bracelet",
    description:
      "A charm bracelet on the table: a metal hoop with five small charms, one of them lifted and lit.",
    aria:
      "An isometric charm bracelet: a metal hoop carrying five small charms, one raised and highlighted.",
    faces: avatarGroupFaces(),
    motions: [
      {
        group: "charms",
        kind: "sway",
        period: 3000,
        amount: 2.4,
        pivot: [0, 30, 10],
      },
      { group: "charm-lift", kind: "lift", period: 3000, amount: 4.6 },
      { group: "bracelet", kind: "breathe", period: 3800, amount: 0.006 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                  */
/* -------------------------------------------------------------------------- */

export const lot2Prototypes: PrototypeMeta[] = [
  breadcrumb,
  pagination,
  stepper,
  dock,
  progress,
  spinnerEntry,
  statusEntry,
  skeleton,
  card,
  table,
  chart,
  kanban,
  timeline,
  avatarEntry,
  imageZoom,
  carousel,
  videoPlayerEntry,
  code,
  themeSwitch,
  cursor,
  chatEntry,
  prompt,
  reasoning,
  alertDialog,
  avatarGroup,
];
