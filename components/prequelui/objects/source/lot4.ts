/*
 * Linear v4 — lot 4 (components 76 to 100 of the object catalogue).
 *
 * Same rules as lots 1-3: one real-world object per component, drawn from
 * scratch in the shared 2:1 axonometric space, no slab under the object and a
 * silhouette that still reads at 64 px. Faces are painted back to front and
 * filled with the plate tone, so a nearer face hides the construction behind
 * it while the 0.9 px outline stays clean.
 *
 * The 25 objects here are all new: none repeats an object from lots 1-3, from
 * the Objects collection, or from the studied reference pages.
 */

import type {
  DetailTone,
  FigureFace,
  Point2,
  Point3,
} from "./engine";
import {
  box,
  circle,
  cylinder,
  disc3,
  ellipse2,
  ellipse3,
  face2,
  face3,
  figureScene,
  iso,
  ring,
  roundedRect,
  star2,
  stroke2,
  stroke3,
  tube,
  type FaceOptions,
  type PrototypeMeta,
} from "./geom";

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

/** Vertical rod between two z heights at a fixed (x, y). */
function post(
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

/** Loop of 3D points on a horizontal plane, ready for a tube. */
function hoop(
  cx: number,
  cy: number,
  z: number,
  r: number,
  steps = 40,
): Point3[] {
  const points: Point3[] = [];
  for (let index = 0; index <= steps; index += 1) {
    const a = (index / steps) * TAU;
    points.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z]);
  }
  return points;
}

/** Projected circle standing in the (x, z) plane. */
function circleXZ(
  cx: number,
  cy: number,
  cz: number,
  r: number,
  steps = 36,
  start = 0,
): Point2[] {
  return Array.from({ length: steps }, (_, index) => {
    const a = start + (index / steps) * TAU;
    return iso(cx + Math.cos(a) * r, cy, cz + Math.sin(a) * r);
  });
}

/** Projected circle facing along x, i.e. laid in the (y, z) plane. */
function circleYZ(
  x: number,
  cy: number,
  cz: number,
  r: number,
  steps = 36,
  start = 0,
): Point2[] {
  return Array.from({ length: steps }, (_, index) => {
    const a = start + (index / steps) * TAU;
    return iso(x, cy + Math.cos(a) * r, cz + Math.sin(a) * r);
  });
}

/** Filled sphere silhouette with one engraved highlight arc. */
function sphereFaces(
  cx: number,
  cy: number,
  cz: number,
  r: number,
  opts: FaceOptions = {},
): FigureFace[] {
  const [px, py] = iso(cx, cy, cz);
  const faces: FigureFace[] = [
    face2(circle(px, py, r, 28), { tone: "edge", ...opts }),
  ];
  const arc: Point2[] = [];
  for (let index = 0; index <= 12; index += 1) {
    const a = Math.PI * (0.06 + (index / 12) * 0.34);
    arc.push([
      px + Math.cos(a) * r * 0.86,
      py - r * 0.2 + Math.sin(a) * r * 0.3,
    ]);
  }
  faces.push(face2(arc, { fill: false, tone: "lo", group: opts.group }));
  return faces;
}

/**
 * A lathed body along x: circular cross-sections in the (y, z) plane, from
 * x0 to x1. Used for horns, drums and barrels that point at the viewer.
 */
function latheX(
  x0: number,
  x1: number,
  cy: number,
  cz: number,
  r0: number,
  r1: number,
  opts: FaceOptions & { sides?: number; group?: string; ridges?: number[] } = {},
): FigureFace[] {
  const { sides = 30, group, ridges = [], tone = "edge" } = opts;
  const faces: FigureFace[] = [];

  faces.push(face2(circleYZ(x0, cy, cz, r0, sides), { tone, group }));

  for (let index = 0; index < sides; index += 1) {
    const a = (index / sides) * TAU;
    const b = ((index + 1) / sides) * TAU;
    const a0: Point3 = [x0, cy + Math.cos(a) * r0, cz + Math.sin(a) * r0];
    const b0: Point3 = [x0, cy + Math.cos(b) * r0, cz + Math.sin(b) * r0];
    const a1: Point3 = [x1, cy + Math.cos(a) * r1, cz + Math.sin(a) * r1];
    const b1: Point3 = [x1, cy + Math.cos(b) * r1, cz + Math.sin(b) * r1];
    faces.push(face3([a0, b0, b1, a1], { tone, stroke: false, group }));
  }

  faces.push(
    stroke3(
      [
        [x0, cy, cz + r0],
        [x1, cy, cz + r1],
      ],
      tone,
      { group },
    ),
    stroke3(
      [
        [x0, cy, cz - r0],
        [x1, cy, cz - r1],
      ],
      tone,
      { group },
    ),
  );

  for (const t of ridges) {
    const x = x0 + (x1 - x0) * t;
    const r = r0 + (r1 - r0) * t;
    faces.push(face2(circleYZ(x, cy, cz, r, sides), { fill: false, tone: "lo", group }));
  }

  faces.push(face2(circleYZ(x1, cy, cz, r1, sides), { tone, group }));

  return faces;
}

/** One toothed gear standing in the (x, z) plane, with hub and spokes. */
function gearFaces(
  cx: number,
  cz: number,
  R: number,
  teeth: number,
  group: string,
  hubTone: DetailTone = "mid",
): FigureFace[] {
  const faces: FigureFace[] = [];
  const root = R * 0.8;
  const points: Point2[] = [];
  const steps = teeth * 4;
  for (let index = 0; index < steps; index += 1) {
    const a = (index / steps) * TAU;
    const phase = index % 4;
    const radius = phase === 1 || phase === 2 ? R : root;
    points.push(iso(cx + Math.cos(a) * radius, 0, cz + Math.sin(a) * radius));
  }
  faces.push(face2(points, { tone: "edge", group }));

  faces.push(
    face2(circleXZ(cx, 0, cz, R * 0.3, 28), { tone: hubTone, group }),
    face2(circleXZ(cx, 0, cz, R * 0.14, 20), {
      fill: false,
      tone: "lo",
      group,
    }),
  );

  for (let spoke = 0; spoke < 4; spoke += 1) {
    const a = (spoke / 4) * TAU + Math.PI / 4;
    faces.push(
      tube(
        [
          [cx + Math.cos(a) * R * 0.3, 0, cz + Math.sin(a) * R * 0.3],
          [cx + Math.cos(a) * R * 0.7, 0, cz + Math.sin(a) * R * 0.7],
        ],
        2.2,
        { tone: "mid", group },
      ),
    );
  }

  return faces;
}

/* -------------------------------------------------------------------------- */
/* 76. Android — gear train                                                   */
/* -------------------------------------------------------------------------- */

function androidFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Axles first, so the gear bodies hide their middle. */
  for (const [x, z, w] of [
    [-15, 46, 5],
    [18, 64, 4],
    [16, 24, 3.6],
  ] as const) {
    faces.push(
      tube(
        [
          [x, -8, z],
          [x, 8, z],
        ],
        w,
        { tone: "mid" },
      ),
    );
  }

  faces.push(
    ...gearFaces(-15, 46, 24, 12, "gear-a", "hi"),
    ...gearFaces(18, 64, 14, 8, "gear-b", "mid"),
    ...gearFaces(16, 24, 11, 7, "gear-c", "mid"),
  );

  /* A pair of axle end caps on the large gear: small machined collars. */
  for (const y of [-8, 8] as const) {
    const [cx, cy] = iso(-15, y, 46);
    faces.push(
      face2(circle(cx, cy, 4.2, 20), { tone: "mid" }),
      face2(circle(cx, cy, 1.8, 14), { tone: "lo" }),
    );
  }

  return faces;
}

export const android: PrototypeMeta = {
  slug: "android",
  name: "Android",
  component: "Android",
  object: "Gear train",
  story:
    "The gears engage and turn together, each one reversing its neighbour.",
  note: "An Android is a system of parts where one wheel reliably drives the next.",
  scene: figureScene({
    slug: "android",
    name: "Android",
    component: "Media",
    object: "Gear train",
    description:
      "A three-wheel gear train in mesh: a large fourteen-tooth wheel, a smaller nine-tooth wheel above and an eight-tooth pinion below, on short axles.",
    aria:
      "An isometric gear train of three toothed wheels in different sizes, the large wheel with a bright hub, all turning together.",
    faces: androidFaces(),
    motions: [
      { group: "gear-a", kind: "spin", period: 6400, amount: 360 },
      { group: "gear-b", kind: "spin", period: 4600, amount: -360 },
      { group: "gear-c", kind: "spin", period: 3800, amount: -360 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 77. Angle Slider — protractor with a swinging arm                          */
/* -------------------------------------------------------------------------- */

function angleSliderFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const R = 42;
  const cz = 10;
  const y = 3;

  /* The half-disc body: back face, straight-edge block, front face. */
  const half = (yy: number) => {
    const points: Point3[] = [];
    for (let index = 0; index <= 40; index += 1) {
      const a = Math.PI - (index / 40) * Math.PI;
      points.push([Math.cos(a) * R, yy, cz + Math.sin(a) * R]);
    }
    points.push([-R, yy, cz], [R, yy, cz]);
    return points;
  };
  faces.push(
    face3(half(-3), { tone: "lo" }),
    face3(half(y), { tone: "edge" }),
    ...box(-R, -3, cz - 2, R * 2, 6, 2, {
      r: 1,
      tone: "edge",
      topTone: "mid",
    }),
  );

  /* Graduations engraved on the front face, every five degrees. */
  for (let degree = 0; degree <= 180; degree += 5) {
    const a = (degree / 180) * Math.PI;
    const long = degree % 30 === 0;
    const inner = R * (long ? 0.8 : 0.87);
    const outer = R * 0.95;
    faces.push(
      stroke3(
        [
          [Math.cos(a) * inner, y + 0.05, cz + Math.sin(a) * inner],
          [Math.cos(a) * outer, y + 0.05, cz + Math.sin(a) * outer],
        ],
        long ? "mid" : "lo",
      ),
    );
  }
  const innerArc: Point3[] = [];
  for (let index = 0; index <= 36; index += 1) {
    const a = Math.PI * (index / 36);
    innerArc.push([
      Math.cos(a) * R * 0.78,
      y + 0.06,
      cz + Math.sin(a) * R * 0.78,
    ]);
  }
  faces.push(stroke3(innerArc, "lo"));

  /* Pivot boss at the centre of the straight edge. */
  faces.push(
    face2(circleXZ(0, y + 0.1, cz, 4.6, 20), { tone: "mid" }),
    face2(circleXZ(0, y + 0.1, cz, 1.8, 14), { tone: "lo" }),
  );

  /* The swinging arm and its bright index tip. */
  const armAngle = (64 / 180) * Math.PI;
  const reach = R * 0.9;
  const tipX = Math.cos(armAngle) * reach;
  const tipZ = cz + Math.sin(armAngle) * reach;
  faces.push(
    tube(
      [
        [0, y + 0.5, cz],
        [tipX, y + 0.5, tipZ],
      ],
      3.2,
      { tone: "edge", group: "arm" },
    ),
    tube(
      [
        [0, y + 0.5, cz],
        [tipX * 0.42, y + 0.5, cz + (tipZ - cz) * 0.42],
      ],
      5.4,
      { tone: "mid", group: "arm" },
    ),
    face2(circleXZ(tipX, y + 0.6, tipZ, 3.4, 18), {
      tone: "hi",
      group: "arm",
    }),
  );

  return faces;
}

export const angleSlider: PrototypeMeta = {
  slug: "angle-slider",
  name: "Angle Slider",
  component: "Angle Slider",
  object: "Protractor with a swinging arm",
  story:
    "The arm sweeps to a new angle and the graduation under its tip catches the light.",
  note: "An angle is read against a fixed scale: the value is where the arm comes to rest.",
  scene: figureScene({
    slug: "angle-slider",
    name: "Angle Slider",
    component: "Controls",
    object: "Protractor with a swinging arm",
    description:
      "A half-disc protractor standing on its straight edge, with degree graduations, a central pivot boss and a swinging arm ending in a bright index.",
    aria:
      "An isometric protractor: a graduated half-disc with a pivot boss and a bright arm swung to about sixty-four degrees.",
    faces: angleSliderFaces(),
    motions: [
      {
        group: "arm",
        kind: "sway",
        period: 3000,
        amount: 0.34,
        pivot: [0, 3, 10],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 78. Animated Beam — searchlight                                            */
/* -------------------------------------------------------------------------- */

function animatedBeamFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const cz = 42;

  /* Pedestal and yoke: part of the lamp, not a display slab. */
  faces.push(
    ...cylinder(0, 0, 0, 4, 16, 14, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ...cylinder(0, 0, 4, 20, 3.2, 3.2, {
      tone: "mid",
      topTone: "lo",
    }),
  );
  for (const yy of [-22, 22] as const) {
    faces.push(
      tube(
        [
          [0, yy, 4],
          [0, yy, cz - 16],
        ],
        3.6,
        { tone: "edge" },
      ),
      tube(
        [
          [0, yy, cz - 16],
          [0, yy, cz],
        ],
        3,
        { tone: "mid" },
      ),
      ...cylinder(0, yy, cz - 18, 5, 3.4, 3.4, {
        tone: "mid",
        topTone: "lo",
      }),
    );
  }
  faces.push(
    tube(
      [
        [0, -24, cz],
        [0, 24, cz],
      ],
      3.4,
      { tone: "mid" },
    ),
  );

  /* Drum: a machined can with a bright lens at its open end. */
  faces.push(
    ...latheX(-26, 10, 0, cz, 20, 22, {
      group: "drum",
      ridges: [0.28, 0.56],
    }),
  );
  faces.push(
    face2(circleYZ(10.2, 0, cz, 21.4, 36), {
      tone: "edge",
      group: "drum",
    }),
    face2(circleYZ(10.3, 0, cz, 15.2, 32), {
      fill: false,
      tone: "mid",
      group: "drum",
    }),
    face2(circleYZ(10.35, 0, cz, 7.4, 26), {
      fill: false,
      tone: "lo",
      group: "drum",
    }),
    face2(circleYZ(10.4, 0, cz, 3.4, 18), {
      tone: "hi",
      group: "drum",
    }),
  );

  /* The beam: a widening open cone, made only of engraved lines. */
  faces.push(
    stroke3(
      [
        [11, 0, cz + 21],
        [22, 0, cz + 30],
        [82, 0, cz + 58],
      ],
      "mid",
      { group: "beam" },
    ),
    stroke3(
      [
        [11, 0, cz - 21],
        [22, 0, cz - 30],
        [82, 0, cz - 58],
      ],
      "mid",
      { group: "beam" },
    ),
    stroke3(
      [
        [82, 0, cz + 58],
        [86, 0, cz + 40],
        [86, 0, cz + 10],
        [82, 0, cz - 58],
      ],
      "lo",
      { group: "beam" },
    ),
    stroke3(
      [
        [11, 0, cz + 8],
        [82, 0, cz + 20],
      ],
      "lo",
      { group: "beam" },
    ),
    stroke3(
      [
        [11, 0, cz - 8],
        [82, 0, cz - 20],
      ],
      "lo",
      { group: "beam" },
    ),
  );

  return faces;
}

export const animatedBeam: PrototypeMeta = {
  slug: "animated-beam",
  name: "Animated Beam",
  component: "Animated Beam",
  object: "Searchlight",
  story:
    "The drum swings on its yoke, the beam sweeps the frame and the lens flares once.",
  note: "A beam is attention given a direction: the lamp turns and the light follows.",
  scene: figureScene({
    slug: "animated-beam",
    name: "Animated Beam",
    component: "Effects",
    object: "Searchlight",
    description:
      "A searchlight drum on a U-shaped yoke above a round pedestal, its lens lit and a widening beam drawn in fine lines.",
    aria:
      "An isometric searchlight on a yoke and pedestal, with a bright lens and a long beam of fine lines sweeping to the right.",
    faces: animatedBeamFaces(),
    motions: [
      {
        group: "drum",
        kind: "sway",
        period: 4200,
        amount: 0.16,
        pivot: [0, 0, 8],
      },
      {
        group: "beam",
        kind: "sway",
        period: 4200,
        amount: 0.16,
        pivot: [0, 0, 8],
      },
      { group: "drum", kind: "flicker", period: 2400, amount: 0.012 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 79. Animated Cursor — telescopic pointer                                   */
/* -------------------------------------------------------------------------- */

function animatedCursorFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Grip: a ribbed handle with a base cap. */
  faces.push(
    ...cylinder(0, 0, 0, 3, 6.4, 6, { tone: "edge", topTone: "mid" }),
    ...cylinder(0, 0, 3, 13, 5.6, 5.6, { tone: "edge", topTone: "lo" }),
  );
  for (let rib = 0; rib < 4; rib += 1) {
    faces.push(
      ...cylinder(0, 0, 4.5 + rib * 3, 1.1, 6.2, 6.2, {
        tone: "lo",
        topTone: "lo",
      }),
    );
  }
  faces.push(
    ...cylinder(0, 0, 16, 2.6, 4.4, 4, { tone: "mid", topTone: "mid" }),
  );

  /* Three nested sections; each upper one can lift on hover. */
  faces.push(
    tube(
      [
        [0, 0, 18],
        [0, 0, 46],
      ],
      5.4,
      { tone: "edge", group: "seg-1" },
    ),
    ...cylinder(0, 0, 46, 2.4, 3.6, 3.2, {
      tone: "mid",
      topTone: "mid",
      group: "seg-1",
    }),
    tube(
      [
        [0, 0, 48],
        [0, 0, 68],
      ],
      3.8,
      { tone: "edge", group: "seg-2" },
    ),
    ...cylinder(0, 0, 68, 2, 2.8, 2.5, {
      tone: "mid",
      topTone: "mid",
      group: "seg-2",
    }),
    tube(
      [
        [0, 0, 70],
        [0, 0, 88],
      ],
      2.6,
      { tone: "edge", group: "seg-3" },
    ),
    face2(circleXZ(0, 0, 89.4, 3.2, 20), {
      tone: "hi",
      group: "seg-3",
    }),
    face2(circleXZ(0, 0, 89.4, 1.4, 14), {
      tone: "lo",
      group: "seg-3",
    }),
  );

  return faces;
}

export const animatedCursor: PrototypeMeta = {
  slug: "animated-cursor",
  name: "Animated Cursor",
  component: "Animated Cursor",
  object: "Telescopic pointer",
  story:
    "The sections slide out of each other and the bright tip reaches farther.",
  note: "A pointer stands in for the hand: it extends attention to the thing being named.",
  scene: figureScene({
    slug: "animated-cursor",
    name: "Animated Cursor",
    component: "Interaction",
    object: "Telescopic pointer",
    description:
      "A telescopic pointer standing on its ribbed grip, with three nested shaft sections, collars and a bright rounded tip.",
    aria:
      "An isometric telescopic pointer: a ribbed handle with three nested sections extending upward to a bright tip.",
    faces: animatedCursorFaces(),
    motions: [
      {
        group: "seg-1",
        kind: "bob",
        period: 2600,
        amount: -1.2,
      },
      {
        group: "seg-2",
        kind: "bob",
        period: 2600,
        amount: -2.6,
        phase: 0.08,
      },
      {
        group: "seg-3",
        kind: "bob",
        period: 2600,
        amount: -4.2,
        phase: 0.16,
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 80. Animated Testimonials — photo album                                    */
/* -------------------------------------------------------------------------- */

/** Bilinear point on the quad a-b (bottom) / d-c (top). */
function quadPoint(
  a: Point3,
  b: Point3,
  c: Point3,
  d: Point3,
  u: number,
  v: number,
): Point3 {
  const bottom: Point3 = [
    a[0] + (b[0] - a[0]) * u,
    a[1] + (b[1] - a[1]) * u,
    a[2] + (b[2] - a[2]) * u,
  ];
  const top: Point3 = [
    d[0] + (c[0] - d[0]) * u,
    d[1] + (c[1] - d[1]) * u,
    d[2] + (c[2] - d[2]) * u,
  ];
  return [
    bottom[0] + (top[0] - bottom[0]) * v,
    bottom[1] + (top[1] - bottom[1]) * v,
    bottom[2] + (top[2] - bottom[2]) * v,
  ];
}

function animatedTestimonialsFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Album cover and page block, lying open. */
  faces.push(
    ...box(-34, -25, 0, 69, 50, 3, {
      r: 2.4,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-31, -22, 3, 63, 44, 1.6, {
      r: 1.6,
      tone: "lo",
      topTone: "lo",
      group: "album",
    }),
  );

  /* Left page, with one mounted portrait. */
  faces.push(
    face3(
      [
        [-30, -21, 4.7],
        [-3, -21, 4.7],
        [-3, 21, 4.7],
        [-30, 21, 4.7],
      ],
      { tone: "edge", group: "album" },
    ),
  );
  const portrait = (cx: number, cy: number, w: number, d: number) => {
    faces.push(
      face2(
        roundedRect(cx - w / 2, cy - d / 2, w, d, 2, 4).map(([x, yy]) =>
          iso(x, yy, 4.9),
        ),
        { tone: "mid", group: "album" },
      ),
      face2(
        roundedRect(cx - w / 2 + 1.4, cy - d / 2 + 1.4, w - 2.8, d - 2.8, 1, 3).map(
          ([x, yy]) => iso(x, yy, 4.95),
        ),
        { tone: "lo", group: "album" },
      ),
      face2(
        circle(cx, cy - d * 0.08, Math.min(w, d) * 0.17, 18).map(([x, yy]) =>
          iso(x, yy, 5),
        ),
        { fill: false, tone: "mid", group: "album" },
      ),
    );
  };
  portrait(-17, -7, 20, 24);

  /* Right page propped up from the spine, carrying the next portrait. */
  const p0: Point3 = [0, -22, 4.8];
  const p1: Point3 = [0, 22, 4.8];
  const p2: Point3 = [27, 22, 48];
  const p3: Point3 = [25, -22, 50];
  faces.push(face3([p0, p1, p2, p3], { tone: "edge", group: "page" }));

  const frame: Point3[] = [
    quadPoint(p0, p1, p2, p3, 0.16, 0.16),
    quadPoint(p0, p1, p2, p3, 0.84, 0.16),
    quadPoint(p0, p1, p2, p3, 0.84, 0.82),
    quadPoint(p0, p1, p2, p3, 0.16, 0.82),
  ];
  faces.push(face3(frame, { fill: false, tone: "mid", group: "page" }));
  const inner: Point3[] = [
    quadPoint(p0, p1, p2, p3, 0.22, 0.22),
    quadPoint(p0, p1, p2, p3, 0.78, 0.22),
    quadPoint(p0, p1, p2, p3, 0.78, 0.52),
    quadPoint(p0, p1, p2, p3, 0.22, 0.52),
  ];
  faces.push(face3(inner, { tone: "hi", group: "page" }));
  const head = quadPoint(p0, p1, p2, p3, 0.5, 0.42);
  const [hx, hy] = iso(head[0], head[1], head[2]);
  faces.push(
    face2(circle(hx, hy, 3.2, 18), {
      fill: false,
      tone: "lo",
      group: "page",
    }),
    face3(
      [
        quadPoint(p0, p1, p2, p3, 0.3, 0.6),
        quadPoint(p0, p1, p2, p3, 0.7, 0.6),
        quadPoint(p0, p1, p2, p3, 0.62, 0.78),
        quadPoint(p0, p1, p2, p3, 0.38, 0.78),
      ],
      { fill: false, tone: "lo", group: "page" },
    ),
  );

  /* One loose print turning above the flat page. */
  faces.push(
    face3(
      [
        [-18, -4, 32],
        [-4, 2, 30],
        [-1, 13, 36],
        [-15, 7, 38],
      ],
      { tone: "edge", group: "flip" },
    ),
    face3(
      [
        [-15.4, -2.6, 32.6],
        [-5.6, 2.4, 31],
        [-3.1, 11, 35.4],
        [-13, 6, 37],
      ],
      { fill: false, tone: "mid", group: "flip" },
    ),
    face2(
      (() => {
        const [px, py] = iso(-9.4, 4.6, 34.4);
        return circle(px, py, 2.4, 16);
      })(),
      { tone: "lo", group: "flip" },
    ),
  );

  return faces;
}

export const animatedTestimonials: PrototypeMeta = {
  slug: "animated-testimonials",
  name: "Animated Testimonials",
  component: "Animated Testimonials",
  object: "Photo album",
  story:
    "A loose print turns on the open page while the album breathes under it.",
  note: "Testimonials are portraits bound together: one page is shown, the next waits behind it.",
  scene: figureScene({
    slug: "animated-testimonials",
    name: "Animated Testimonials",
    component: "Media",
    object: "Photo album",
    description:
      "An open photo album: a flat left page with a mounted portrait, a right page propped up with a bright print, and one loose print turning above it.",
    aria:
      "An isometric open photo album with a portrait on the left page, a framed bright print on the raised right page and a loose print turning in the air.",
    faces: animatedTestimonialsFaces(),
    motions: [
      {
        group: "flip",
        kind: "sway",
        period: 3200,
        amount: 0.16,
        pivot: [-9, 5, 34],
      },
      {
        group: "flip",
        kind: "bob",
        period: 3200,
        amount: 1.4,
      },
      { group: "album", kind: "breathe", period: 4000, amount: 0.004 },
      { group: "page", kind: "breathe", period: 4000, amount: 0.006 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 81. Animated Tooltip — price gun                                           */
/* -------------------------------------------------------------------------- */

function animatedTooltipFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Main body, grip and trigger guard. */
  faces.push(
    ...box(-24, -7, 36, 48, 14, 12, {
      r: 3.4,
      tone: "edge",
      topTone: "mid",
      group: "body",
    }),
    tube(
      [
        [-8, 0, 36],
        [-18, 0, 10],
      ],
      10,
      { tone: "edge", group: "body" },
    ),
    ...cylinder(-18, 0, 8, 3, 6.2, 5.6, {
      tone: "mid",
      topTone: "mid",
      group: "body",
    }),
  );
  faces.push(
    tube(
      [
        [0, 0, 33],
        [8, 0, 24],
        [16, 0, 32],
      ],
      2.4,
      { tone: "mid", group: "trigger" },
    ),
    tube(
      [
        [6, 0, 36],
        [3, 0, 28],
      ],
      3,
      { tone: "edge", group: "trigger" },
    ),
  );

  /* Label roll on top: two rims and a hub. */
  for (const yy of [-4.6, 4.6] as const) {
    faces.push(
      ...ring(-2, yy, 58, 9.4, 1.9, "xz", {
        tone: yy > 0 ? "mid" : "lo",
        group: "roll",
      }),
    );
  }
  faces.push(
    disc3(-2, 0, 58, 4.4, "xz", { tone: "mid", group: "roll" }),
    face2(circleXZ(-2, -4.7, 58, 2, 14), {
      fill: false,
      tone: "lo",
      group: "roll",
    }),
    face2(circleXZ(-2, 4.7, 58, 2, 14), {
      fill: false,
      tone: "lo",
      group: "roll",
    }),
  );

  /* The label leaving the nose, with a perforation and a bright face. */
  faces.push(
    face3(
      [
        [24, -4.4, 42],
        [50, -4.4, 38],
        [50, 4.4, 38],
        [24, 4.4, 42],
      ],
      { tone: "edge", group: "label" },
    ),
    face3(
      [
        [27, -3.6, 41.4],
        [46, -3.6, 38.3],
        [46, 3.6, 38.3],
        [27, 3.6, 41.4],
      ],
      { tone: "hi", group: "label" },
    ),
    stroke3(
      [
        [37, -4.1, 39.8],
        [37, 4.1, 39.8],
      ],
      "lo",
      { group: "label" },
    ),
  );

  return faces;
}

export const animatedTooltip: PrototypeMeta = {
  slug: "animated-tooltip",
  name: "Animated Tooltip",
  component: "Animated Tooltip",
  object: "Price gun",
  story:
    "The trigger squeezes, the roll turns and a bright label shoots out of the nose.",
  note: "A tooltip is a small label applied at the moment and place it is needed.",
  scene: figureScene({
    slug: "animated-tooltip",
    name: "Animated Tooltip",
    component: "Overlays",
    object: "Price gun",
    description:
      "A hand price gun: a rounded body, a pistol grip, a trigger inside its guard, a label roll on top and a bright label strip out of the nose.",
    aria:
      "An isometric price gun with a pistol grip and trigger, a label roll on top and a bright perforated label emerging from the nose.",
    faces: animatedTooltipFaces(),
    motions: [
      {
        group: "trigger",
        kind: "sway",
        period: 2200,
        amount: 0.2,
        pivot: [4, 0, 34],
      },
      { group: "roll", kind: "spin", period: 5200, amount: 360 },
      { group: "label", kind: "bob", period: 2200, amount: 1.8 },
      { group: "body", kind: "breathe", period: 3400, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 82. Announcement — megaphone                                               */
/* -------------------------------------------------------------------------- */

function announcementFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const cz = 48;

  /* Horn: a wide flaring cone with a rear cap, pointing to the right. */
  faces.push(
    ...latheX(-20, 34, 0, cz, 7.4, 27, {
      group: "horn",
      ridges: [0.3, 0.62],
    }),
  );

  /* Mouth rim and its inner throat. */
  faces.push(
    face2(circleYZ(34.4, 0, cz, 26, 40), {
      fill: false,
      tone: "mid",
      group: "horn",
    }),
  );

  /* Bright index arc on the upper lip. */
  const rim: Point3[] = [];
  for (let index = 0; index <= 8; index += 1) {
    const a = -0.5 + (index / 8) * 1;
    rim.push([34.8, Math.cos(a) * 27, cz + Math.sin(a) * 27]);
  }
  faces.push(tube(rim, 3, { tone: "hi", group: "horn" }));

  /* Rear cap, grip and trigger. */
  faces.push(
    face2(circleYZ(-20.2, 0, cz, 7.4, 22), {
      tone: "mid",
      group: "horn",
    }),
  );
  faces.push(
    tube(
      [
        [-8, 0, 34],
        [0, 0, 8],
      ],
      8,
      { tone: "edge" },
    ),
    ...cylinder(0, 0, 6, 3, 5.6, 5, { tone: "mid", topTone: "mid" }),
    tube(
      [
        [4, 0, 34],
        [10, 0, 22],
        [15, 0, 30],
      ],
      2.2,
      { tone: "mid", group: "trigger" },
    ),
  );

  /* Two rings of sound escaping the mouth. */
  for (const [x, r, tone] of [
    [40, 29, "mid"],
    [52, 36, "lo"],
  ] as const) {
    faces.push(
      face2(circleYZ(x, 0, cz, r, 40), {
        fill: false,
        tone,
        group: "wave",
      }),
    );
  }

  return faces;
}

export const announcement: PrototypeMeta = {
  slug: "announcement",
  name: "Announcement",
  component: "Announcement",
  object: "Megaphone",
  story:
    "The horn lifts, the trigger pulls and three rings of sound leave the mouth.",
  note: "An announcement is a message shaped to carry beyond the room it is made in.",
  scene: figureScene({
    slug: "announcement",
    name: "Announcement",
    component: "Feedback",
    object: "Megaphone",
    description:
      "A hand megaphone: a flaring horn with a bright lip, a rear cap, a grip and a trigger, and three rings of sound leaving the mouth.",
    aria:
      "An isometric megaphone pointing right, with a flaring horn, a bright lip, a pistol grip and three expanding rings of sound.",
    faces: announcementFaces(),
    motions: [
      {
        group: "horn",
        kind: "sway",
        period: 3600,
        amount: 0.09,
        pivot: [-20, 0, 48],
      },
      {
        group: "wave",
        kind: "breathe",
        period: 2400,
        amount: 0.035,
      },
      { group: "trigger", kind: "sway", period: 2200, amount: 0.16, pivot: [6, 0, 34] },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 83. Artifact — museum display case                                         */
/* -------------------------------------------------------------------------- */

function artifactFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Wooden plinth: the case's own base, not a display slab under the object. */
  faces.push(
    ...box(-30, -23, 0, 60, 46, 10, {
      r: 2.4,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-27, -20, 10, 54, 40, 1.4, {
      r: 1.6,
      tone: "lo",
      topTone: "lo",
    }),
  );

  /* Glass cover: four posts, top and bottom rails, all as thin rods. */
  for (const [x, y] of [
    [-27, -20],
    [27, -20],
    [27, 20],
    [-27, 20],
  ] as const) {
    faces.push(post(x, y, 12, 62, 1.3, "lo", "glass"));
  }
  for (const z of [12, 62]) {
    faces.push(
      tube(
        [
          [-27, -20, z],
          [27, -20, z],
        ],
        1.3,
        { tone: "lo", group: "glass" },
      ),
      tube(
        [
          [27, -20, z],
          [27, 20, z],
        ],
        1.3,
        { tone: "lo", group: "glass" },
      ),
      tube(
        [
          [27, 20, z],
          [-27, 20, z],
        ],
        1.3,
        { tone: "lo", group: "glass" },
      ),
      tube(
        [
          [-27, 20, z],
          [-27, -20, z],
        ],
        1.3,
        { tone: "lo", group: "glass" },
      ),
    );
  }
  faces.push(
    ...box(-7, -2.4, 62, 14, 4.8, 4, {
      r: 1.6,
      tone: "mid",
      topTone: "mid",
      group: "glass",
    }),
  );

  /* The artifact inside: a small two-handled urn with a bright band. */
  faces.push(
    ...cylinder(0, 0, 12, 4, 8, 7, { tone: "edge", topTone: "mid", group: "relic" }),
    ...cylinder(0, 0, 16, 12, 7, 9.5, {
      tone: "edge",
      topTone: "mid",
      group: "relic",
    }),
    ...cylinder(0, 0, 28, 3, 9.5, 7, {
      tone: "edge",
      topTone: "mid",
      group: "relic",
    }),
    ...cylinder(0, 0, 31, 8, 4, 3.4, {
      tone: "edge",
      topTone: "mid",
      group: "relic",
    }),
    ...cylinder(0, 0, 39, 2.6, 6, 5, {
      tone: "mid",
      topTone: "mid",
      group: "relic",
    }),
  );
  for (const side of [-1, 1] as const) {
    faces.push(
      tube(
        [
          [side * 8, 0, 26],
          [side * 15, 0, 30],
          [side * 16, 0, 38],
          [side * 10, 0, 33],
        ],
        2.4,
        { tone: "mid", group: "relic" },
      ),
    );
  }
  faces.push(
    face2(circleXZ(0, 0, 24.4, 9.7, 30), {
      fill: false,
      tone: "hi",
      group: "relic",
    }),
  );

  /* One oblique highlight on the front glass. */
  faces.push(
    stroke3(
      [
        [-24, 20.2, 20],
        [-8, 20.2, 54],
      ],
      "lo",
      { group: "glass" },
    ),
    stroke3(
      [
        [-18, 20.2, 18],
        [-4, 20.2, 44],
      ],
      "lo",
      { group: "glass" },
    ),
  );

  return faces;
}

export const artifact: PrototypeMeta = {
  slug: "artifact",
  name: "Artifact",
  component: "Artifact",
  object: "Museum display case",
  story:
    "The glass cover lifts and the urn inside turns slowly in the light.",
  note: "An artifact is an output kept and presented: a thing worth looking at under glass.",
  scene: figureScene({
    slug: "artifact",
    name: "Artifact",
    component: "AI",
    object: "Museum display case",
    description:
      "A wooden plinth under a glass vitrine with thin rails, holding a small two-handled urn with a bright band around its belly.",
    aria:
      "An isometric museum display case: a wooden plinth under a slender glass vitrine, containing a two-handled urn with a bright band.",
    faces: artifactFaces(),
    motions: [
      { group: "glass", kind: "bob", period: 3600, amount: -3.2 },
      {
        group: "relic",
        kind: "sway",
        period: 4200,
        amount: 0.06,
        pivot: [0, 0, 12],
      },
      { group: "relic", kind: "breathe", period: 4200, amount: 0.008 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 84. Aspect Ratio — pantograph                                              */
/* -------------------------------------------------------------------------- */

function aspectRatioFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const A: Point3 = [-40, 0, 12];
  const B: Point3 = [-8, 0, 52];
  const C: Point3 = [24, 0, 52];
  const D: Point3 = [-12, 0, 12];
  const E: Point3 = [48, 0, 24];

  const bars: Array<[Point3, Point3]> = [
    [A, B],
    [B, C],
    [C, D],
    [D, A],
    [C, E],
    [D, E],
  ];
  for (const [from, to] of bars) {
    faces.push(
      tube([from, to], 3.4, { tone: "edge", group: "frame" }),
      tube([from, to], 1.2, { tone: "lo", group: "frame" }),
    );
  }

  /* Brass pivot pins at every joint. */
  for (const [x, z] of [
    [A[0], A[2]],
    [B[0], B[2]],
    [C[0], C[2]],
    [D[0], D[2]],
    [E[0], E[2]],
  ] as const) {
    faces.push(
      face2(circleXZ(x, 0, z, 3.4, 18), { tone: "mid", group: "frame" }),
      face2(circleXZ(x, 0, z, 1.4, 12), { tone: "lo", group: "frame" }),
    );
  }

  /* Fixed clamp at A and the bright tracing point at E. */
  faces.push(
    ...box(-45, -6, 0, 10, 12, 8, {
      r: 2,
      tone: "mid",
      topTone: "lo",
    }),
    face2(circleXZ(48, 0, 24, 4.2, 20), { tone: "hi", group: "tip" }),
    face2(circleXZ(48, 0, 24, 1.8, 14), { tone: "lo", group: "tip" }),
    stroke3(
      [
        [48, 0, 28],
        [48, 0, 38],
      ],
      "hi",
      { group: "tip" },
    ),
  );

  return faces;
}

export const aspectRatio: PrototypeMeta = {
  slug: "aspect-ratio",
  name: "Aspect Ratio",
  component: "Aspect Ratio",
  object: "Pantograph",
  story:
    "The linked arms breathe together and the bright tracing point keeps its proportion.",
  note: "A pantograph preserves a ratio while it grows: the proportion is the mechanism.",
  scene: figureScene({
    slug: "aspect-ratio",
    name: "Aspect Ratio",
    component: "Layout",
    object: "Pantograph",
    description:
      "A pantograph: six hinged bars pinned at five joints, clamped at one end and ending in a bright tracing point.",
    aria:
      "An isometric pantograph of six hinged bars with brass pivots, fixed at one end and ending in a bright tracing point.",
    faces: aspectRatioFaces(),
    motions: [
      { group: "frame", kind: "breathe", period: 3600, amount: 0.018 },
      { group: "tip", kind: "lift", period: 3000, amount: 2.2 },
      {
        group: "tip",
        kind: "sway",
        period: 3000,
        amount: 0.12,
        pivot: [24, 0, 52],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 85. Attachment — bulldog clip                                              */
/* -------------------------------------------------------------------------- */

function attachmentFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* A short stack of pages, one sheet slightly askew. */
  for (let index = 0; index < 4; index += 1) {
    faces.push(
      ...box(-31 + index * 0.8, -22 + index * 0.5, index * 1.5, 62, 44, 1.2, {
        r: 0.8,
        tone: index === 3 ? "mid" : "lo",
        topTone: "lo",
        group: "papers",
      }),
    );
  }
  for (const y of [-12, -4, 4, 12]) {
    faces.push(
      stroke3(
        [
          [-24, y, 7],
          [25, y, 7],
        ],
        "lo",
        { group: "papers" },
      ),
    );
  }

  /* The clip's two jaws biting the back edge of the stack. */
  faces.push(
    ...box(-17, -27, 6.4, 34, 12, 2, {
      r: 1.4,
      tone: "mid",
      topTone: "lo",
      group: "clip",
    }),
    ...box(-16, -27, 8.4, 32, 11, 5, {
      r: 1.4,
      tone: "edge",
      topTone: "mid",
      group: "clip",
    }),
    ...box(-14, -26, 13.4, 28, 9, 1.6, {
      r: 1.2,
      tone: "mid",
      topTone: "mid",
      group: "clip",
    }),
  );

  /* Spring coils around the hinge, then two folded wire handles. */
  for (const x of [-9, -3, 3, 9]) {
    faces.push(
      face2(circleYZ(x, -28, 14, 3.2, 18), {
        fill: false,
        tone: "mid",
        group: "clip",
      }),
      face2(circleYZ(x, -28, 14, 1.2, 14), {
        fill: false,
        tone: "lo",
        group: "clip",
      }),
    );
  }
  for (const side of [-1, 1] as const) {
    faces.push(
      tube(
        [
          [side * 13, -29, 12],
          [side * 21, -31, 26],
          [side * 12, -29, 34],
        ],
        side > 0 ? 2.6 : 2.2,
        { tone: "edge", group: "handle" },
      ),
      tube(
        [
          [side * 21, -31, 26],
          [side * 22, -31, 18],
        ],
        2,
        { tone: "lo", group: "handle" },
      ),
    );
  }

  /* One bright stamp on the clip's jaw. */
  faces.push(
    face2(
      roundedRect(-8, -23, 16, 4, 1.6, 3).map(([x, y]) => iso(x, y, 13.6)),
      { tone: "hi", group: "clip" },
    ),
  );

  return faces;
}

export const attachment: PrototypeMeta = {
  slug: "attachment",
  name: "Attachment",
  component: "Attachment",
  object: "Bulldog clip",
  story:
    "The jaws bite down on the stack and the wire handles rock once.",
  note: "An attachment is a document physically held to another: a clip does the holding.",
  scene: figureScene({
    slug: "attachment",
    name: "Attachment",
    component: "Inputs",
    object: "Bulldog clip",
    description:
      "A bulldog clip gripping the back edge of a ruled page stack, with coiled springs and two folded wire handles.",
    aria:
      "An isometric bulldog clip biting a stack of ruled pages, with visible spring coils and two wire handles.",
    faces: attachmentFaces(),
    motions: [
      { group: "clip", kind: "bob", period: 2400, amount: 1.6 },
      {
        group: "handle",
        kind: "sway",
        period: 2400,
        amount: 0.1,
        pivot: [0, -30, 14],
      },
      { group: "papers", kind: "breathe", period: 2400, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 86. Audio Player — gramophone                                              */
/* -------------------------------------------------------------------------- */

function audioPlayerFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Cabinet with a moulded top and a side crank. */
  faces.push(
    ...box(-32, -25, 0, 64, 50, 16, {
      r: 3,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-30, -23, 16, 60, 46, 2, {
      r: 2,
      tone: "mid",
      topTone: "mid",
    }),
  );
  faces.push(
    stroke3(
      [
        [-24, 25.1, 6],
        [24, 25.1, 6],
      ],
      "lo",
    ),
    stroke3(
      [
        [-24, 25.1, 10],
        [24, 25.1, 10],
      ],
      "lo",
    ),
  );

  /* Turntable and record. */
  faces.push(
    ...cylinder(4, 8, 18, 3, 23, 23, { tone: "mid", topTone: "lo" }),
    ...cylinder(4, 8, 21, 1.6, 20, 20, {
      tone: "edge",
      topTone: "lo",
      group: "record",
    }),
    ...cylinder(4, 8, 22.6, 0.8, 5.6, 5.6, {
      tone: "mid",
      topTone: "hi",
      group: "record",
    }),
  );
  for (const r of [8.4, 12.2, 16]) {
    faces.push(
      face2(circleXZ(4, 8, 22.9, r, 40), {
        fill: false,
        tone: "lo",
        group: "record",
      }),
    );
  }

  /* Tone arm from the corner to the record. */
  faces.push(
    ...cylinder(-19, 12, 18, 4, 4.2, 3.6, { tone: "mid", topTone: "mid" }),
    tube(
      [
        [-19, 12, 24],
        [-2, 10, 27],
        [9, 8, 24],
      ],
      2.4,
      { tone: "edge" },
    ),
    ...box(8, 5, 22, 6, 6, 3, {
      r: 1.4,
      tone: "mid",
      topTone: "mid",
    }),
  );

  /* The horn: a morning-glory bell standing on the cabinet, with a crank. */
  faces.push(
    ...cylinder(-14, -10, 18, 46, 4.4, 24, {
      tone: "edge",
      topTone: "mid",
      hollow: 17,
      taperLines: 2,
      group: "horn",
    }),
  );
  const mouth = (r: number) =>
    circleXZ(-14, -10, 64.4, r, 40);
  faces.push(
    face2(mouth(24.4), { fill: false, tone: "edge", group: "horn" }),
    face2(mouth(17), { fill: false, tone: "lo", group: "horn" }),
  );

  faces.push(
    face2(circleYZ(32, 12, 12, 4.4, 18), { tone: "mid" }),
    face2(circleYZ(32.2, 12, 12, 1.8, 12), { tone: "lo" }),
    tube(
      [
        [33, 12, 13],
        [39, 18, 18],
      ],
      2.6,
      { tone: "edge", group: "crank" },
    ),
    face2(circleYZ(40, 19, 19, 2.4, 14), {
      tone: "hi",
      group: "crank",
    }),
  );

  /* A thin ring of sound above the bell. */
  faces.push(
    face2(circleXZ(-14, -10, 76, 11, 36), {
      fill: false,
      tone: "lo",
      group: "sound",
    }),
  );

  return faces;
}

export const audioPlayer: PrototypeMeta = {
  slug: "audio-player",
  name: "Audio Player",
  component: "Audio Player",
  object: "Gramophone",
  story:
    "The record turns, the horn warms and a ring of sound leaves the bell.",
  note: "A gramophone makes sound visible: the machine that carries the music is the object.",
  scene: figureScene({
    slug: "audio-player",
    name: "Audio Player",
    component: "Media",
    object: "Gramophone",
    description:
      "A cabinet gramophone: a wooden box, a turntable with a grooved record and a bright label, a tone arm and a flaring horn with a side crank.",
    aria:
      "An isometric gramophone with a wooden cabinet, a grooved record with a bright centre, a tone arm, a side crank and a tall flaring horn with rings of sound above it.",
    faces: audioPlayerFaces(),
    motions: [
      { group: "record", kind: "spin", period: 7200, amount: 360 },
      {
        group: "horn",
        kind: "sway",
        period: 4200,
        amount: 0.05,
        pivot: [-14, -10, 18],
      },
      { group: "crank", kind: "spin", period: 5200, amount: 360 },
      { group: "sound", kind: "breathe", period: 2600, amount: 0.03 },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 87. Autocomplete — thumb-index phone book                                  */
/* -------------------------------------------------------------------------- */

function autocompleteFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Lower cover, thick page block and upper cover. */
  faces.push(
    ...box(-34, -25, 0, 68, 50, 3, {
      r: 2.2,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-31, -22, 3, 62, 44, 15, {
      r: 1.2,
      tone: "mid",
      topTone: "lo",
      group: "pages",
    }),
    ...box(-32, -23, 18, 64, 46, 3, {
      r: 2.2,
      tone: "edge",
      topTone: "mid",
      group: "pages",
    }),
  );

  /* Page edges on the fore-edge, and a ruled title block on the cover. */
  for (let line = 0; line < 6; line += 1) {
    faces.push(
      stroke3(
        [
          [31.6, -19 + line * 6.6, 4.6],
          [31.6, -19 + line * 6.6, 17],
        ],
        "lo",
        { group: "pages" },
      ),
    );
  }
  faces.push(
    face2(
      roundedRect(-24, -16, 34, 22, 2, 4).map(([x, y]) => iso(x, y, 21.2)),
      { fill: false, tone: "mid" },
    ),
    stroke3(
      [
        [-18, -10, 21.4],
        [4, -10, 21.4],
      ],
      "hi",
    ),
    stroke3(
      [
        [-18, -3, 21.4],
        [10, -3, 21.4],
      ],
      "lo",
    ),
    stroke3(
      [
        [-18, 4, 21.4],
        [0, 4, 21.4],
      ],
      "lo",
    ),
  );

  /* Index tabs along the fore-edge, one pulled out and bright. */
  const tabs = [-18, -10, -2, 6, 14, 20];
  tabs.forEach((y, index) => {
    const out = y === 6;
    faces.push(
      ...box(31 - (out ? 1 : 0), y - 3.4, 5, out ? 9 : 6, 6.8, 12, {
        r: 2.6,
        tone: out ? "edge" : "lo",
        topTone: out ? "mid" : "lo",
        group: out ? "tab" : "pages",
      }),
    );
    if (out) {
      faces.push(
        face3(
          [
            [40, y - 2.2, 8],
            [40, y + 2.2, 8],
            [40, y + 2.2, 14],
            [40, y - 2.2, 14],
          ],
          { tone: "hi", group: "tab" },
        ),
      );
    }
    if (index < tabs.length - 1) {
      faces.push(
        stroke3(
          [
            [37, y + 3.5, 6],
            [37, y + 3.5, 16],
          ],
          "lo",
          { group: "pages" },
        ),
      );
    }
  });

  return faces;
}

export const autocomplete: PrototypeMeta = {
  slug: "autocomplete",
  name: "Autocomplete",
  component: "Autocomplete",
  object: "Thumb-index phone book",
  story:
    "One index tab swings out and a name rises to the top of the page.",
  note: "Suggestions are a thumb index: a shortcut cut into the edge of a much larger book.",
  scene: figureScene({
    slug: "autocomplete",
    name: "Autocomplete",
    component: "Inputs",
    object: "Thumb-index phone book",
    description:
      "A thick phone book lying closed: a ruled title block on the cover, page edges along the fore-edge and six index tabs, one pulled out and bright.",
    aria:
      "An isometric thick phone book with a ruled cover and six thumb-index tabs along its fore-edge, one tab pulled out and highlighted.",
    faces: autocompleteFaces(),
    motions: [
      {
        group: "tab",
        kind: "sway",
        period: 2800,
        amount: 0.14,
        pivot: [32, 6, 5],
      },
      { group: "tab", kind: "bob", period: 2800, amount: -1.2 },
      { group: "pages", kind: "breathe", period: 4200, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 88. Canvas — artist's easel                                                */
/* -------------------------------------------------------------------------- */

function canvasFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Three legs; the two front legs carry a tray. */
  faces.push(
    tube(
      [
        [-30, 20, 0],
        [-8, 2, 80],
      ],
      3.2,
      { tone: "edge" },
    ),
    tube(
      [
        [30, 20, 0],
        [8, 2, 80],
      ],
      3.2,
      { tone: "edge" },
    ),
    tube(
      [
        [0, -30, 0],
        [0, -4, 62],
      ],
      3.2,
      { tone: "edge" },
    ),
    tube(
      [
        [-26, 16, 28],
        [26, 16, 28],
      ],
      3,
      { tone: "mid" },
    ),
    tube(
      [
        [-8, 4, 56],
        [8, 4, 56],
      ],
      2.4,
      { tone: "mid" },
    ),
  );

  /* The canvas: a board leaning against the mast. */
  const p0: Point3 = [-23, 12, 32];
  const p1: Point3 = [23, 12, 32];
  const p2: Point3 = [21, -1, 74];
  const p3: Point3 = [-21, -1, 74];
  faces.push(
    face3([p0, p1, p2, p3], { tone: "edge", group: "canvas" }),
    face3(
      [
        [-20, 10.6, 35],
        [20, 10.6, 35],
        [18.4, -0.4, 71],
        [-18.4, -0.4, 71],
      ],
      { fill: false, tone: "lo", group: "canvas" },
    ),
  );

  /* A single brush stroke on the canvas: the one bright mark. */
  faces.push(
    face3(
      [
        [-11, 8.6, 44],
        [2, 7.4, 50],
        [9, 7, 46],
        [1, 7.4, 42],
      ],
      { tone: "hi", group: "canvas" },
    ),
  );

  /* A brush resting on the tray. */
  faces.push(
    tube(
      [
        [-16, 14, 30],
        [2, 13, 33],
      ],
      2.6,
      { tone: "edge", group: "brush" },
    ),
    tube(
      [
        [2, 13, 33],
        [12, 12.6, 34.4],
      ],
      4.4,
      { tone: "mid", group: "brush" },
    ),
    face2(circleXZ(14, 12.4, 35, 1.8, 14), {
      tone: "lo",
      group: "brush",
    }),
  );

  return faces;
}

export const canvas: PrototypeMeta = {
  slug: "canvas",
  name: "Canvas",
  component: "Canvas",
  object: "Artist's easel",
  story:
    "The canvas leans on its easel and the brush lifts off the tray.",
  note: "A canvas is a working surface held at the angle your hand needs.",
  scene: figureScene({
    slug: "canvas",
    name: "Canvas",
    component: "Media",
    object: "Artist's easel",
    description:
      "A tripod easel holding a tilted canvas with one bright brush stroke, and a brush resting on the tray.",
    aria:
      "An isometric artist's easel with a three-legged frame, a tilted canvas carrying a bright brush stroke and a brush on the tray.",
    faces: canvasFaces(),
    motions: [
      {
        group: "canvas",
        kind: "sway",
        period: 3600,
        amount: 0.045,
        pivot: [0, 0, 76],
      },
      { group: "brush", kind: "lift", period: 2600, amount: 2.2 },
      { group: "brush", kind: "sway", period: 2600, amount: 0.06 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 89. 3D Card — folding screen                                               */
/* -------------------------------------------------------------------------- */

type Slab = {
  a: [number, number];
  b: [number, number];
  z0: number;
  z1: number;
  thick: number;
  group: string;
  tone?: DetailTone;
};

function slabFaces(slab: Slab): FigureFace[] {
  const { a, b, z0, z1, thick, group, tone = "edge" } = slab;
  const [ax, ay] = a;
  const [bx, by] = b;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (dy / len) * (thick / 2);
  const ny = (-dx / len) * (thick / 2);
  const back: Point3[] = [
    [ax - nx, ay - ny, z0],
    [bx - nx, by - ny, z0],
    [bx - nx, by - ny, z1],
    [ax - nx, ay - ny, z1],
  ];
  const front: Point3[] = [
    [ax + nx, ay + ny, z0],
    [bx + nx, by + ny, z0],
    [bx + nx, by + ny, z1],
    [ax + nx, ay + ny, z1],
  ];
  const faces: FigureFace[] = [
    face3(back, { tone, group }),
    face3(
      [
        front[0],
        front[1],
        [bx - nx, by - ny, z0],
        [ax - nx, ay - ny, z0],
      ],
      { tone: "mid", group },
    ),
    face3(
      [
        front[3],
        front[2],
        [bx - nx, by - ny, z1],
        [ax - nx, ay - ny, z1],
      ],
      { tone: "mid", group },
    ),
    face3(front, { tone, group }),
  ];
  return faces;
}

function card3dFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  const panels: Slab[] = [
    { a: [-40, -18], b: [-18, 20], z0: 4, z1: 72, thick: 4, group: "left" },
    { a: [18, -20], b: [40, 18], z0: 4, z1: 72, thick: 4, group: "right" },
    { a: [-18, 20], b: [18, -20], z0: 4, z1: 72, thick: 4, group: "middle" },
  ];
  for (const slab of panels) {
    faces.push(...slabFaces(slab));
    /* Inset frame engraved on the front face. */
    const inset = (t: number) => {
      const [ax, ay] = slab.a;
      const [bx, by] = slab.b;
      const dx = bx - ax;
      const dy = by - ay;
      const len = Math.hypot(dx, dy) || 1;
      const nx = (dy / len) * (slab.thick / 2 + 0.2);
      const ny = (-dx / len) * (slab.thick / 2 + 0.2);
      return [
        [ax + nx + dx * t, ay + ny + dy * t] as Point2,
        [bx + nx - dx * t, by + ny - dy * t] as Point2,
      ];
    };
    const [i0, i1] = inset(0.12);
    for (const z of [16, 62]) {
      faces.push(
        stroke3(
          [
            [i0[0], i0[1], z],
            [i1[0], i1[1], z],
          ],
          "lo",
          { group: slab.group },
        ),
      );
    }
    const zc = (16 + 62) / 2;
    faces.push(
      stroke3(
        [
          [i0[0] + (i1[0] - i0[0]) * 0.5, i0[1] + (i1[1] - i0[1]) * 0.5, 16],
          [i0[0] + (i1[0] - i0[0]) * 0.5, i0[1] + (i1[1] - i0[1]) * 0.5, 62],
        ],
        "lo",
        { group: slab.group },
      ),
      face2(
        (() => {
          const [px, py] = iso(
            i0[0] + (i1[0] - i0[0]) * 0.5,
            i0[1] + (i1[1] - i0[1]) * 0.5,
            zc,
          );
          return circle(px, py, 3.2, 16);
        })(),
        { tone: "lo", group: slab.group },
      ),
    );
  }

  /* Bright medallion on the middle panel. */
  faces.push(
    face2(
      (() => {
        const [px, py] = iso(0, 0, 50);
        return circle(px, py, 6.4, 22);
      })(),
      { tone: "hi", group: "middle" },
    ),
    face2(
      (() => {
        const [px, py] = iso(0, 0, 50);
        return circle(px, py, 3, 18);
      })(),
      { fill: false, tone: "lo", group: "middle" },
    ),
  );

  /* Feet and hinges. */
  for (const [x, y] of [
    [-40, -18],
    [-18, 20],
    [18, -20],
    [40, 18],
  ] as const) {
    faces.push(
      ...box(x - 3, y - 3, 0, 6, 6, 5, {
        r: 1.6,
        tone: "mid",
        topTone: "mid",
      }),
    );
  }
  for (const [x, y] of [
    [-18, 20],
    [18, -20],
  ] as const) {
    faces.push(
      ...cylinder(x, y, 14, 50, 2.4, 2.4, {
        tone: "mid",
        topTone: "mid",
      }),
    );
  }

  return faces;
}

export const card3d: PrototypeMeta = {
  slug: "card-3d",
  name: "3D Card",
  component: "3D Card",
  object: "Folding screen",
  story:
    "The outer panels turn toward the reader while the middle panel holds its ground.",
  note: "A folding screen gains depth by hinging flat panels in space.",
  scene: figureScene({
    slug: "card-3d",
    name: "3D Card",
    component: "Effects",
    object: "Folding screen",
    description:
      "A three-panel folding screen on small feet, panels joined by hinges, with engraved frames and a bright medallion on the middle panel.",
    aria:
      "An isometric three-panel folding screen standing in a zigzag, with engraved frames, hinges and a bright medallion on the middle panel.",
    faces: card3dFaces(),
    motions: [
      {
        group: "left",
        kind: "sway",
        period: 3600,
        amount: 0.06,
        pivot: [-18, 20, 40],
      },
      {
        group: "right",
        kind: "sway",
        period: 3600,
        amount: -0.06,
        pivot: [18, -20, 40],
      },
      { group: "middle", kind: "breathe", period: 3600, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 90. Chain of Thought — linking rings                                       */
/* -------------------------------------------------------------------------- */

/** A flat, horizontal ring: an outer disc and a hole at the plate tone. */
function flatRing(
  cx: number,
  cy: number,
  cz: number,
  R: number,
  band: number,
  group: string,
  tone: DetailTone = "edge",
  innerTone: DetailTone = "lo",
): FigureFace[] {
  const ringOuter: Point2[] = [];
  const ringInner: Point2[] = [];
  for (let index = 0; index < 48; index += 1) {
    const a = (index / 48) * TAU;
    ringOuter.push(
      iso(
        cx + Math.cos(a) * (R + band / 2),
        cy + Math.sin(a) * (R + band / 2),
        cz,
      ),
    );
    ringInner.push(
      iso(
        cx + Math.cos(a) * (R - band / 2),
        cy + Math.sin(a) * (R - band / 2),
        cz,
      ),
    );
  }
  return [
    face2(ringOuter, { tone, group }),
    face2(ringInner, { tone: innerTone, group }),
  ];
}

function chainOfThoughtFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const cz = 54;
  const R = 20;
  const band = 6.4;

  /* Left vertical link, then the right one, then the flat link in front. */
  faces.push(...ring(-18, 0, cz, R, band / 2, "xz", { tone: "edge", group: "link-1" }));
  faces.push(...ring(18, 0, cz, R, band / 2, "xz", { tone: "edge", group: "link-3" }));
  faces.push(...flatRing(0, 0, cz - 2, R, band, "link-2"));

  /* Re-draw the front arc of the left link over the flat link. */
  const leftArc: Point3[] = [];
  for (let index = 0; index <= 10; index += 1) {
    const a = -0.42 + (index / 10) * 0.84;
    leftArc.push([-18 + Math.cos(a) * R, 0, cz + Math.sin(a) * R]);
  }
  faces.push(tube(leftArc, band, { tone: "edge", group: "link-1" }));

  /* A bright clasp joins the right link to the chain. */
  const claspArc: Point3[] = [];
  for (let index = 0; index <= 10; index += 1) {
    const a = Math.PI - 0.4 + (index / 10) * 0.8;
    claspArc.push([18 + Math.cos(a) * R, 0, cz + Math.sin(a) * R]);
  }
  faces.push(tube(claspArc, band + 1, { tone: "hi", group: "link-3" }));

  /* Small connector studs where the links meet. */
  for (const [x, z] of [
    [-1.5, cz + R * 0.62],
    [1.5, cz - R * 0.62],
  ] as const) {
    faces.push(
      face2(circleXZ(x, 0, z, 2.4, 16), { tone: "mid", group: "link-2" }),
    );
  }

  return faces;
}

export const chainOfThought: PrototypeMeta = {
  slug: "chain-of-thought",
  name: "Chain of Thought",
  component: "Chain of Thought",
  object: "Linking rings",
  story:
    "The three links sway apart and settle back into one hanging chain.",
  note: "Separate steps hold together as a chain: each ring is complete on its own.",
  scene: figureScene({
    slug: "chain-of-thought",
    name: "Chain of Thought",
    component: "AI",
    object: "Linking rings",
    description:
      "Three interlocking metal rings: a vertical link at each side and a flat link between them, with a bright clasp on the right.",
    aria:
      "An isometric chain of three interlocking rings, two vertical and one flat between them, with a bright clasp on the right link.",
    faces: chainOfThoughtFaces(),
    motions: [
      {
        group: "link-1",
        kind: "sway",
        period: 3200,
        amount: 0.08,
        pivot: [-18, 0, 35],
      },
      {
        group: "link-2",
        kind: "sway",
        period: 3200,
        amount: -0.06,
        phase: 0.1,
        pivot: [0, 0, 35],
      },
      {
        group: "link-3",
        kind: "sway",
        period: 3200,
        amount: 0.08,
        phase: 0.2,
        pivot: [18, 0, 35],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 91. Checkpoint — marathon checkpoint arch                                  */
/* -------------------------------------------------------------------------- */

function checkpointFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const half = 34;
  const shoulder = 58;

  /* Feet, posts and their collars. */
  for (const side of [-1, 1] as const) {
    faces.push(
      ...cylinder(side * half, 0, 0, 4, 9, 8, {
        tone: "edge",
        topTone: "mid",
        bottomArc: true,
      }),
      ...cylinder(side * half, 0, 4, shoulder, 4, 3.4, {
        tone: "edge",
        topTone: "mid",
      }),
      ...cylinder(side * half, 0, 16, 3, 5, 5, {
        tone: "mid",
        topTone: "lo",
      }),
      ...cylinder(side * half, 0, shoulder - 3, 3, 5, 5, {
        tone: "mid",
        topTone: "lo",
      }),
    );
  }

  /* The arch: a quadratic curve from shoulder to shoulder. */
  const arch: Point3[] = [];
  for (let index = 0; index <= 16; index += 1) {
    const t = index / 16;
    const x = -half + t * half * 2;
    const z = shoulder + 24 * (1 - (x / half) ** 2);
    arch.push([x, 0, z]);
  }
  faces.push(tube(arch, 6.4, { tone: "edge" }));

  /* Hanging pennant with a bright number plate. */
  faces.push(
    tube(
      [
        [0, 0, 82],
        [0, 0, 74],
      ],
      1.4,
      { tone: "lo" },
    ),
    face3(
      [
        [0, 0, 74],
        [-13, 0, 68],
        [-13, 0, 46],
        [0, 0, 52],
      ],
      { tone: "edge", group: "flag" },
    ),
    face2(
      (() => {
        const [px, py] = iso(-6, 0.6, 60);
        return circle(px, py, 3.4, 18);
      })(),
      { tone: "hi", group: "flag" },
    ),
    stroke3(
      [
        [-9, 0.5, 55],
        [-2, 0.5, 57],
      ],
      "lo",
      { group: "flag" },
    ),
  );

  /* The counter box bolted to the right post. */
  faces.push(
    ...box(24, -7, 26, 20, 14, 14, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "counter",
    }),
    face2(circleYZ(44.4, 0, 33, 4.6, 20), {
      tone: "mid",
      group: "dial",
    }),
    face2(circleYZ(44.7, 0, 33, 2, 16), {
      fill: false,
      tone: "lo",
      group: "dial",
    }),
    stroke3(
      [
        [44.9, 0, 34.6],
        [44.9, 0, 37.2],
      ],
      "edge",
      { group: "dial" },
    ),
  );

  return faces;
}

export const checkpoint: PrototypeMeta = {
  slug: "checkpoint",
  name: "Checkpoint",
  component: "Checkpoint",
  object: "Marathon checkpoint arch",
  story:
    "The pennant swings, the counter dial clicks and the arch holds the finish line.",
  note: "A checkpoint is a gate you pass through to be counted: progress made official.",
  scene: figureScene({
    slug: "checkpoint",
    name: "Checkpoint",
    component: "Navigation",
    object: "Marathon checkpoint arch",
    description:
      "A marathon arch on two post feet, an arched top beam, a hanging pennant with a bright plate and a small counter box bolted to one post.",
    aria:
      "An isometric marathon checkpoint arch on two feet, with an arched beam, a hanging pennant bearing a bright number plate and a counter box on the right post.",
    faces: checkpointFaces(),
    motions: [
      {
        group: "flag",
        kind: "sway",
        period: 3000,
        amount: 0.18,
        pivot: [0, 0, 74],
      },
      { group: "flag", kind: "bob", period: 3000, amount: 1.2 },
      { group: "counter", kind: "breathe", period: 3200, amount: 0.008 },
      { group: "dial", kind: "spin", period: 3200, amount: 360 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 92. Circular Progress — barometer                                          */
/* -------------------------------------------------------------------------- */

function circularProgressFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const cz = 58;
  const R = 34;
  const fy = 4.6;

  /* Hanging loop and wire, in the same vertical plane as the case. */
  faces.push(
    ...ring(0, 0, 102, 6, 1.7, "xz", { tone: "mid" }),
    tube(
      [
        [0, 0, 92],
        [0, 0, 96],
      ],
      2.4,
      { tone: "mid" },
    ),
  );

  /* Cases: a back plate, a front plate and the recessed dial. */
  faces.push(
    face2(circleXZ(0, -4, cz, R, 48), { tone: "lo" }),
    face2(circleXZ(0, 4, cz, R, 48), { tone: "edge" }),
    face2(circleXZ(0, 3.4, cz, R - 1.4, 48), {
      fill: false,
      tone: "lo",
    }),
    face2(circleXZ(0, fy, cz, R - 3.2, 48), { tone: "mid" }),
    face2(circleXZ(0, fy + 0.4, cz, R - 7.4, 48), {
      tone: "lo",
      group: "dial",
    }),
  );

  /* Graduations around the dial face. */
  for (let step = 0; step < 48; step += 1) {
    const a = (step / 48) * TAU;
    const major = step % 4 === 0;
    const inner = major ? 22.4 : 24.4;
    const outer = 27.6;
    faces.push(
      stroke3(
        [
          [Math.cos(a) * inner, fy + 0.7, cz + Math.sin(a) * inner],
          [Math.cos(a) * outer, fy + 0.7, cz + Math.sin(a) * outer],
        ],
        major ? "mid" : "lo",
        { group: "dial" },
      ),
    );
    if (major) {
      const [mx, my] = iso(
        Math.cos(a) * 19.2,
        fy + 0.8,
        cz + Math.sin(a) * 19.2,
      );
      faces.push(
        face2(circle(mx, my, 1.4, 10), { tone: "lo", group: "dial" }),
      );
    }
  }

  /* Needle with a bright tip, and the centre cap. */
  const needleAngle = 0.85;
  const nx = Math.cos(needleAngle) * 23;
  const nz = Math.sin(needleAngle) * 23;
  faces.push(
    tube(
      [
        [0, fy + 1, cz],
        [nx, fy + 1, cz + nz],
      ],
      2.8,
      { tone: "edge", group: "needle" },
    ),
    face2(
      (() => {
        const [px, py] = iso(nx, fy + 1.1, cz + nz);
        return circle(px, py, 2.6, 16);
      })(),
      { tone: "hi", group: "needle" },
    ),
    face2(circleXZ(0, fy + 1.2, cz, 4.8, 22), { tone: "mid" }),
    face2(circleXZ(0, fy + 1.3, cz, 1.8, 14), { tone: "lo" }),
  );

  /* Adjustment knob under the case. */
  faces.push(
    ...cylinder(0, 0, cz - R - 6, 6, 4, 3.4, {
      tone: "mid",
      topTone: "lo",
    }),
  );

  return faces;
}

export const circularProgress: PrototypeMeta = {
  slug: "circular-progress",
  name: "Circular Progress",
  component: "Circular Progress",
  object: "Barometer",
  story:
    "The needle sweeps to a new pressure and the dial face catches the light.",
  note: "A circular progress is read around a dial: a quantity spread over a full turn.",
  scene: figureScene({
    slug: "circular-progress",
    name: "Circular Progress",
    component: "Feedback",
    object: "Barometer",
    description:
      "A round wall barometer hanging from a loop: a deep case, a graduated dial and a single needle with a bright tip.",
    aria:
      "An isometric barometer hanging from a loop, with a deep round case, graduations and a needle touching a bright tip.",
    faces: circularProgressFaces(),
    motions: [
      {
        group: "needle",
        kind: "sway",
        period: 3800,
        amount: 0.42,
        pivot: [0, 5.6, 58],
      },
      { group: "dial", kind: "breathe", period: 4600, amount: 0.006 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 93. Circular Slider — amplifier volume knob                                */
/* -------------------------------------------------------------------------- */

function circularSliderFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The amplifier faceplate, lying flat, with four screws. */
  faces.push(
    ...box(-32, -25, 0, 64, 50, 4, {
      r: 3,
      tone: "edge",
      topTone: "mid",
    }),
  );
  for (const [x, y] of [
    [-25, -18],
    [25, -18],
    [25, 18],
    [-25, 18],
  ] as const) {
    const [sx, sy] = iso(x, y, 4.2);
    faces.push(
      face2(circle(sx, sy, 2.6, 14), { tone: "mid" }),
      stroke2(
        [
          [sx - 1.4, sy - 0.6],
          [sx + 1.4, sy + 0.6],
        ],
        "lo",
      ),
    );
  }

  /* Scale ticks in an arc around the knob. */
  for (let step = 0; step <= 10; step += 1) {
    const a = -Math.PI * 0.75 + (step / 10) * Math.PI * 1.5;
    const inner = 22;
    const outer = step % 5 === 0 ? 27 : 24.6;
    faces.push(
      stroke3(
        [
          [Math.cos(a) * inner, Math.sin(a) * inner, 4.3],
          [Math.cos(a) * outer, Math.sin(a) * outer, 4.3],
        ],
        step % 5 === 0 ? "mid" : "lo",
        { group: "scale" },
      ),
    );
  }

  /* Knurled knob with a bright pointer. */
  faces.push(
    ...cylinder(0, 0, 4, 3, 17, 16, {
      tone: "mid",
      topTone: "mid",
    }),
    ...cylinder(0, 0, 7, 8, 15.4, 14.6, {
      tone: "edge",
      topTone: "mid",
      group: "knob",
    }),
  );
  for (let step = 0; step < 28; step += 1) {
    const a = (step / 28) * TAU;
    faces.push(
      stroke3(
        [
          [Math.cos(a) * 15.6, Math.sin(a) * 15.6, 7.2],
          [Math.cos(a) * 15.6, Math.sin(a) * 15.6, 14.6],
        ],
        "lo",
        { group: "knob" },
      ),
    );
  }
  faces.push(
    face2(circleXZ(0, 0, 15, 13.6, 40), {
      tone: "mid",
      group: "knob",
    }),
    tube(
      [
        [0, 0, 15.2],
        [0, -12.4, 15.2],
      ],
      3.2,
      { tone: "hi", group: "knob" },
    ),
    face2(circleXZ(0, -12.4, 15.4, 2.2, 14), {
      tone: "hi",
      group: "knob",
    }),
    face2(circleXZ(0, 0, 15.2, 3.4, 18), {
      tone: "mid",
      group: "knob",
    }),
  );

  return faces;
}

export const circularSlider: PrototypeMeta = {
  slug: "circular-slider",
  name: "Circular Slider",
  component: "Circular Slider",
  object: "Amplifier volume knob",
  story:
    "The knurled knob turns one notch and its bright pointer finds the mark.",
  note: "A circular slider is a value turned around an axis, with a scale to land on.",
  scene: figureScene({
    slug: "circular-slider",
    name: "Circular Slider",
    component: "Controls",
    object: "Amplifier volume knob",
    description:
      "An amplifier faceplate with four screws and a scale arc around a knurled volume knob carrying a bright pointer.",
    aria:
      "An isometric amplifier faceplate with corner screws, a graduated arc and a knurled volume knob whose bright pointer points forward.",
    faces: circularSliderFaces(),
    motions: [
      {
        group: "knob",
        kind: "sway",
        period: 3200,
        amount: 0.34,
        pivot: [0, 0, 15],
      },
      { group: "knob", kind: "breathe", period: 3200, amount: 0.006 },
      { group: "scale", kind: "breathe", period: 4600, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 94. Clipboard — clipboard                                                  */
/* -------------------------------------------------------------------------- */

function clipboardFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Board and sheet. */
  faces.push(
    ...box(-29, -37, 0, 58, 74, 3, {
      r: 4,
      tone: "edge",
      topTone: "mid",
    }),
    face3(
      [
        [-24, -30, 3.4],
        [24, -30, 3.4],
        [24, 34, 3.4],
        [-24, 34, 3.4],
      ],
      { tone: "edge", group: "sheet" },
    ),
  );

  /* Ruled writing and a bright check box. */
  for (let line = 0; line < 7; line += 1) {
    const y = -22 + line * 8;
    faces.push(
      stroke3(
        [
          [-18, y, 3.7],
          [18, y, 3.7],
        ],
        "lo",
        { group: "sheet" },
      ),
    );
  }
  faces.push(
    face3(
      [
        [-18, 20, 3.9],
        [-12, 20, 3.9],
        [-12, 26, 3.9],
        [-18, 26, 3.9],
      ],
      { fill: false, tone: "hi", group: "sheet" },
    ),
    stroke3(
      [
        [-17, 23, 4],
        [-15, 21, 4],
      ],
      "hi",
      { group: "sheet" },
    ),
    stroke3(
      [
        [-15, 21, 4],
        [-12, 25.4, 4],
      ],
      "hi",
      { group: "sheet" },
    ),
  );

  /* The spring clip at the top edge. */
  faces.push(
    ...box(-15, -40, 3, 30, 12, 3, {
      r: 2,
      tone: "mid",
      topTone: "lo",
      group: "clip",
    }),
    ...box(-13, -41, 6, 26, 11, 3.4, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "clip",
    }),
    ...box(-9, -39, 9.4, 18, 8, 2, {
      r: 1.6,
      tone: "mid",
      topTone: "mid",
      group: "clip",
    }),
    face2(
      (() => {
        const [px, py] = iso(0, -46, 8);
        return circle(px, py, 4, 18);
      })(),
      { fill: false, tone: "mid", group: "clip" },
    ),
  );
  for (const side of [-1, 1] as const) {
    faces.push(
      tube(
        [
          [side * 5, -41, 10],
          [side * 17, -42, 15],
          [side * 19, -40, 9],
        ],
        2.2,
        { tone: "edge", group: "clip" },
      ),
    );
  }

  return faces;
}

export const clipboard: PrototypeMeta = {
  slug: "clipboard",
  name: "Clipboard",
  component: "Clipboard",
  object: "Clipboard",
  story:
    "The clip bites and the sheet settles flat under its jaws.",
  note: "A clipboard holds writing steady while you move: the clip is the whole idea.",
  scene: figureScene({
    slug: "clipboard",
    name: "Clipboard",
    component: "Text",
    object: "Clipboard",
    description:
      "A clipboard with a ruled sheet, a bright checked box and a spring clip with two wire wings at the top edge.",
    aria:
      "An isometric clipboard holding a ruled sheet with a bright checked box, closed by a spring clip with two wire wings.",
    faces: clipboardFaces(),
    motions: [
      { group: "clip", kind: "bob", period: 2400, amount: 1.4 },
      { group: "clip", kind: "breathe", period: 2400, amount: 0.006 },
      { group: "sheet", kind: "breathe", period: 3600, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 95. Code Block — letterpress chase                                         */
/* -------------------------------------------------------------------------- */

function codeBlockFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Four bars make the chase; the middle stays open. */
  faces.push(
    ...box(-40, -30, 0, 80, 9, 7, {
      r: 1.6,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-40, 21, 0, 80, 9, 7, {
      r: 1.6,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-40, -21, 0, 9, 42, 7, {
      r: 1.6,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(31, -21, 0, 9, 42, 7, {
      r: 1.6,
      tone: "edge",
      topTone: "mid",
    }),
  );

  /* Locked type: three rows of raised characters, one row bright. */
  const rows = [-14.4, -3.6, 7.2];
  rows.forEach((y, row) => {
    for (let col = 0; col < 6; col += 1) {
      const x = -27 + col * 10.6;
      const accent = row === 1 && col === 3;
      faces.push(
        ...box(x, y - 4.2, 0, 8.4, 8.4, accent ? 6 : 4.6 + (col % 3) * 0.8, {
          r: 1,
          tone: accent ? "edge" : "mid",
          topTone: accent ? "mid" : "lo",
          group: row === 1 ? "line" : "type",
        }),
      );
      if (accent) {
        faces.push(
          face2(
            (() => {
              const [px, py] = iso(x + 4.2, y, 6.2);
              return circle(px, py, 2, 14);
            })(),
            { tone: "hi", group: "line" },
          ),
        );
      } else {
        faces.push(
          stroke3(
            [
              [x + 1.6, y, 5.2],
              [x + 6.8, y, 5.2],
            ],
            "lo",
            { group: row === 1 ? "line" : "type" },
          ),
        );
      }
    }
  });

  /* A quoin wedge in the lower-left corner, tightening the form. */
  faces.push(
    face3(
      [
        [-30.6, 19.6, 0.4],
        [-22, 19.6, 0.4],
        [-22, 12.4, 0.4],
      ],
      { tone: "mid" },
    ),
    stroke3(
      [
        [-29, 18.4, 4.8],
        [-23.6, 13.2, 4.8],
      ],
      "lo",
    ),
  );

  return faces;
}

export const codeBlock: PrototypeMeta = {
  slug: "code-block",
  name: "Code Block",
  component: "Code Block",
  object: "Letterpress chase",
  story:
    "One line of type rises out of the locked form and back into place.",
  note: "A code block is text assembled and locked in a frame: every character in its slot.",
  scene: figureScene({
    slug: "code-block",
    name: "Code Block",
    component: "Text",
    object: "Letterpress chase",
    description:
      "A letterpress chase: four metal bars around a form of raised type blocks in three rows, one row bright, tightened by a quoin.",
    aria:
      "An isometric letterpress chase with four frame bars, three rows of raised type blocks and a bright character in the middle row.",
    faces: codeBlockFaces(),
    motions: [
      { group: "line", kind: "bob", period: 2600, amount: -2 },
      { group: "type", kind: "breathe", period: 4200, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 96. Code Editor — drafting board                                           */
/* -------------------------------------------------------------------------- */

function codeEditorFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Two legs carrying a tilted board. */
  for (const side of [-1, 1] as const) {
    faces.push(
      tube(
        [
          [side * 25, 24, 0],
          [side * 25, 18, 20],
        ],
        3,
        { tone: "edge" },
      ),
      tube(
        [
          [side * 25, 24, 0],
          [side * 13, 16, 0],
        ],
        2.4,
        { tone: "mid" },
      ),
    );
  }

  /* The board slab and its sheet. */
  const b0: Point3 = [-33, 18, 18];
  const b1: Point3 = [33, 18, 18];
  const b2: Point3 = [33, -6, 66];
  const b3: Point3 = [-33, -6, 66];
  faces.push(
    face3([b0, b1, b2, b3], { tone: "edge" }),
    face3(
      [
        [-30, 16.6, 20.4],
        [30, 16.6, 20.4],
        [30, -4.8, 63.6],
        [-30, -4.8, 63.6],
      ],
      { tone: "lo", group: "sheet" },
    ),
  );

  /* Ruled guide and one bright drawn line. */
  for (let line = 0; line < 4; line += 1) {
    const z = 26 + line * 8.4;
    const yAt = (zz: number) => 16.6 + ((zz - 20.4) / 43.2) * -21.4;
    faces.push(
      stroke3(
        [
          [-25, yAt(z) - 0.2, z],
          [25, yAt(z) - 0.2, z],
        ],
        "lo",
        { group: "sheet" },
      ),
    );
  }
  const yLine = (zz: number) => 16.6 + ((zz - 20.4) / 43.2) * -21.4;
  faces.push(
    tube(
      [
        [-20, yLine(52) - 0.4, 52],
        [18, yLine(52) - 0.4, 52],
      ],
      2.6,
      { tone: "hi", group: "drawn" },
    ),
  );

  /* The T-square: a blade across the sheet with a head on the left. */
  faces.push(
    face3(
      [
        [-31, 8, 45.6],
        [29, 8, 45.6],
        [29, 4.6, 41.6],
        [-31, 4.6, 41.6],
      ],
      { tone: "edge", group: "ruler" },
    ),
    face3(
      [
        [-31, 8, 45.6],
        [-31, 11.6, 43.4],
        [-33, 11.6, 34],
        [-33, 8, 36],
      ],
      { tone: "mid", group: "ruler" },
    ),
    stroke3(
      [
        [-25, 7.2, 44.8],
        [23, 7.2, 44.8],
      ],
      "mid",
      { group: "ruler" },
    ),
  );

  return faces;
}

export const codeEditor: PrototypeMeta = {
  slug: "code-editor",
  name: "Code Editor",
  component: "Code Editor",
  object: "Drafting board",
  story:
    "The ruler slides down a line and the bright drawing follows it.",
  note: "An editor is a ruled board: a surface, a guide and marks placed with precision.",
  scene: figureScene({
    slug: "code-editor",
    name: "Code Editor",
    component: "Text",
    object: "Drafting board",
    description:
      "A drafting board on two legs, holding a ruled sheet, a T-square ruler and one bright drawn line.",
    aria:
      "An isometric drafting board on legs with a ruled sheet, a T-square and a bright drawn line across the paper.",
    faces: codeEditorFaces(),
    motions: [
      { group: "ruler", kind: "bob", period: 2800, amount: 1.6 },
      { group: "drawn", kind: "breathe", period: 2800, amount: 0.01 },
      { group: "sheet", kind: "breathe", period: 4200, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 97. Collapsible — pop-up tent                                              */
/* -------------------------------------------------------------------------- */

function collapsibleFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const frontApex: Point3 = [0, 22, 44];
  const backApex: Point3 = [0, -22, 50];

  /* The far gable, then the two roof slopes, then the near gable. */
  faces.push(
    face3(
      [
        [-24, -22, 0],
        [24, -22, 0],
        backApex,
      ],
      { tone: "lo" },
    ),
    face3(
      [
        [-28, 22, 0],
        frontApex,
        backApex,
        [-24, -22, 0],
      ],
      { tone: "edge", group: "tent" },
    ),
    face3(
      [
        [28, 22, 0],
        frontApex,
        backApex,
        [24, -22, 0],
      ],
      { tone: "edge", group: "tent" },
    ),
  );

  /* Fabric seams. */
  faces.push(
    tube([frontApex, backApex], 1.8, { tone: "mid", group: "tent" }),
    stroke3(
      [
        [-28, 22, 0],
        frontApex,
      ],
      "mid",
      { group: "tent" },
    ),
    stroke3(
      [
        [28, 22, 0],
        frontApex,
      ],
      "mid",
      { group: "tent" },
    ),
    stroke3(
      [
        [-24, -22, 0],
        backApex,
      ],
      "lo",
      { group: "tent" },
    ),
    stroke3(
      [
        [24, -22, 0],
        backApex,
      ],
      "lo",
      { group: "tent" },
    ),
  );

  /* The near gable with an open door flap. */
  faces.push(
    face3(
      [
        [-28, 22, 0],
        [28, 22, 0],
        frontApex,
      ],
      { tone: "edge", group: "tent" },
    ),
    face3(
      [
        [-9, 22.2, 0],
        [9, 22.2, 0],
        [0, 22.2, 27],
      ],
      { tone: "lo", group: "door" },
    ),
    face3(
      [
        [9, 22.2, 0],
        [17, 21, 4],
        [4, 21.8, 30],
        [0, 22.2, 27],
      ],
      { tone: "mid", group: "door" },
    ),
    stroke3(
      [
        [-8, 22.4, 1],
        [0, 22.4, 25],
      ],
      "lo",
      { group: "door" },
    ),
    stroke3(
      [
        [8, 22.4, 1],
        [0, 22.4, 25],
      ],
      "lo",
      { group: "door" },
    ),
  );

  /* Guy lines and pegs. */
  for (const [sx, sy] of [
    [-28, 22],
    [28, 22],
    [-24, -22],
    [24, -22],
  ] as const) {
    faces.push(
      tube(
        [
          [sx, sy, 0.6],
          [sx * 1.42, sy * 1.42, 0],
        ],
        1.2,
        { tone: "lo" },
      ),
      tube(
        [
          [sx * 1.42, sy * 1.42, 0],
          [sx * 1.42, sy * 1.42, -4],
        ],
        1.6,
        { tone: "mid" },
      ),
    );
  }

  /* A bright badge on the right slope. */
  faces.push(
    face3(
      [
        [10, 9.6, 31.4],
        [17, 6.4, 29.6],
        [14, 3.2, 33.6],
        [7, 6.4, 35.2],
      ],
      { tone: "hi", group: "tent" },
    ),
  );

  return faces;
}

export const collapsible: PrototypeMeta = {
  slug: "collapsible",
  name: "Collapsible",
  component: "Collapsible",
  object: "Pop-up tent",
  story:
    "The tent breathes taut and the door flap lifts open for a moment.",
  note: "A collapsible hides its volume in a fold, then springs back into a room.",
  scene: figureScene({
    slug: "collapsible",
    name: "Collapsible",
    component: "Disclosure",
    object: "Pop-up tent",
    description:
      "A ridge tent stretched on guy lines and pegs, with an open door flap and a bright badge on one slope.",
    aria:
      "An isometric pop-up ridge tent with taut guy lines and pegs, an open door flap and a bright badge on the right slope.",
    faces: collapsibleFaces(),
    motions: [
      { group: "tent", kind: "breathe", period: 3200, amount: 0.014 },
      {
        group: "door",
        kind: "sway",
        period: 2800,
        amount: 0.12,
        pivot: [0, 22, 0],
      },
      { group: "door", kind: "lift", period: 2800, amount: 1.4 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 98. Color Picker — paint swatch fan                                        */
/* -------------------------------------------------------------------------- */

const FAN_PIVOT: Point3 = [-34, 0, 8];

function fanPaddle(angle: number, r0: number, r1: number): Point3[] {
  const [px, py, pz] = FAN_PIVOT;
  const dx = Math.cos(angle);
  const dz = Math.sin(angle);
  const nx = -dz;
  const nz = dx;
  const half = 7;
  const points: Point3[] = [
    [px + dx * r0 + nx * half, py, pz + dz * r0 + nz * half],
    [px + dx * r1 + nx * half, py, pz + dz * r1 + nz * half],
  ];
  for (let step = 1; step < 8; step += 1) {
    const a = angle + Math.PI / 2 + (step / 8) * Math.PI;
    points.push([
      px + dx * r1 + Math.cos(a) * half,
      py,
      pz + dz * r1 + Math.sin(a) * half,
    ]);
  }
  points.push(
    [px + dx * r1 - nx * half, py, pz + dz * r1 - nz * half],
    [px + dx * r0 - nx * half, py, pz + dz * r0 - nz * half],
  );
  return points;
}

function colorPickerFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const angles = [1.36, 1.16, 0.96, 0.76, 0.56, 0.36];
  const groups = [
    "fan-back",
    "fan-back",
    "fan-mid",
    "fan-mid",
    "fan-front",
    "chosen",
  ];

  angles.forEach((angle, index) => {
    const group = groups[index];
    const chosen = group === "chosen";
    faces.push(
      face3(fanPaddle(angle, 11, 57), {
        tone: chosen ? "edge" : "mid",
        group,
      }),
      face3(fanPaddle(angle, 20, 47), {
        fill: false,
        tone: chosen ? "hi" : "lo",
        group,
      }),
      face2(
        (() => {
          const [px, py] = iso(
            FAN_PIVOT[0] + Math.cos(angle) * 50,
            FAN_PIVOT[1],
            FAN_PIVOT[2] + Math.sin(angle) * 50,
          );
          return circle(px, py, 3.2, 16);
        })(),
        { tone: chosen ? "hi" : "lo", group },
      ),
    );
    if (index > 0) {
      const [hx, hy] = iso(
        FAN_PIVOT[0] + Math.cos(angle) * 15,
        FAN_PIVOT[1],
        FAN_PIVOT[2] + Math.sin(angle) * 15,
      );
      faces.push(
        stroke2(
          [
            [hx, hy],
            [
              iso(
                FAN_PIVOT[0] + Math.cos(angle) * 52,
                FAN_PIVOT[1],
                FAN_PIVOT[2] + Math.sin(angle) * 52,
              )[0],
              iso(
                FAN_PIVOT[0] + Math.cos(angle) * 52,
                FAN_PIVOT[1],
                FAN_PIVOT[2] + Math.sin(angle) * 52,
              )[1],
            ],
          ],
          "lo",
          { group },
        ),
      );
    }
  });

  /* The rivet that holds the fan together. */
  faces.push(
    face2(
      (() => {
        const [px, py] = iso(FAN_PIVOT[0], FAN_PIVOT[1], FAN_PIVOT[2]);
        return circle(px, py, 5.2, 22);
      })(),
      { tone: "mid" },
    ),
    face2(
      (() => {
        const [px, py] = iso(FAN_PIVOT[0], FAN_PIVOT[1], FAN_PIVOT[2] + 0.4);
        return circle(px, py, 2, 16);
      })(),
      { tone: "lo" },
    ),
  );

  return faces;
}

export const colorPicker: PrototypeMeta = {
  slug: "color-picker",
  name: "Color Picker",
  component: "Color Picker",
  object: "Paint swatch fan",
  story:
    "The fan spreads from its rivet and the chosen swatch lifts toward the reader.",
  note: "Choosing a colour is opening a fan of chips, each one a possibility held on the same pin.",
  scene: figureScene({
    slug: "color-picker",
    name: "Color Picker",
    component: "Inputs",
    object: "Paint swatch fan",
    description:
      "Six paint swatch paddles fanned from one rivet, each with a round colour chip, the front one bright.",
    aria:
      "An isometric fan of six paint swatches on a central rivet, each paddle carrying a round chip, the front swatch highlighted.",
    faces: colorPickerFaces(),
    motions: [
      {
        group: "fan-back",
        kind: "sway",
        period: 3200,
        amount: 0.035,
        pivot: FAN_PIVOT as unknown as Point3,
      },
      {
        group: "fan-mid",
        kind: "sway",
        period: 3200,
        amount: 0.05,
        pivot: FAN_PIVOT as unknown as Point3,
      },
      {
        group: "fan-front",
        kind: "sway",
        period: 3200,
        amount: 0.065,
        pivot: FAN_PIVOT as unknown as Point3,
      },
      {
        group: "chosen",
        kind: "sway",
        period: 3200,
        amount: 0.08,
        pivot: FAN_PIVOT as unknown as Point3,
      },
      { group: "chosen", kind: "lift", period: 3200, amount: 2 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 99. Commit — brass plaque on a board                                       */
/* -------------------------------------------------------------------------- */

function commitFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The support board. */
  faces.push(
    ...box(-30, -6, 0, 60, 8, 66, {
      r: 2.4,
      tone: "edge",
      topTone: "mid",
    }),
  );
  for (const z of [10, 26, 42, 58]) {
    faces.push(
      stroke3(
        [
          [-24, 2.1, z],
          [24, 2.1, z - 2],
        ],
        "lo",
      ),
    );
  }

  /* The plaque, standing proud of the board. */
  faces.push(
    ...box(-22, 2, 12, 44, 3, 42, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "plaque",
    }),
  );
  for (const [x, z] of [
    [-17, 17],
    [17, 17],
    [17, 49],
    [-17, 49],
  ] as const) {
    const [sx, sy] = iso(x, 5.2, z);
    faces.push(
      face2(circle(sx, sy, 2.8, 16), { tone: "mid", group: "screw" }),
      stroke2(
        [
          [sx - 1.6, sy - 0.4],
          [sx + 1.6, sy + 0.4],
        ],
        "lo",
        { group: "screw" },
      ),
    );
  }

  /* Engraved date lines; one is the bright new line. */
  faces.push(
    stroke3(
      [
        [-13, 5.2, 44],
        [7, 5.2, 44],
      ],
      "mid",
      { group: "plaque" },
    ),
    stroke3(
      [
        [-13, 5.2, 38],
        [13, 5.2, 38],
      ],
      "lo",
      { group: "plaque" },
    ),
    stroke3(
      [
        [-13, 5.2, 32],
        [3, 5.2, 32],
      ],
      "lo",
      { group: "plaque" },
    ),
    stroke3(
      [
        [-13, 5.2, 24],
        [13, 5.2, 24],
      ],
      "hi",
      { group: "plaque" },
    ),
  );

  return faces;
}

export const commit: PrototypeMeta = {
  slug: "commit",
  name: "Commit",
  component: "Commit",
  object: "Brass plaque on a board",
  story:
    "The last screw turns, the plaque settles flush and its new line catches the light.",
  note: "A commit fixes an instant to a durable surface: a dated plate screwed down.",
  scene: figureScene({
    slug: "commit",
    name: "Commit",
    component: "Data",
    object: "Brass plaque on a board",
    description:
      "A brass plaque screwed to a wooden board, engraved with ruled date lines, the newest line bright.",
    aria:
      "An isometric brass plaque screwed to a wooden board, with four screws and engraved lines, the bottom line highlighted.",
    faces: commitFaces(),
    motions: [
      { group: "plaque", kind: "bob", period: 2800, amount: 1.2 },
      { group: "screw", kind: "spin", period: 2800, amount: 360 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 100. Comparison — balance scale                                            */
/* -------------------------------------------------------------------------- */

function comparisonFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Foot, column and finial. */
  faces.push(
    ...cylinder(0, 0, 0, 4, 18, 15, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ...cylinder(0, 0, 4, 50, 3.2, 2.6, { tone: "edge", topTone: "mid" }),
    ...sphereFaces(0, 0, 56.4, 3.4, { tone: "mid" }),
  );

  /* The beam, tilted: the left arm is lower. */
  const leftEnd: Point3 = [-36, 0, 56];
  const rightEnd: Point3 = [36, 0, 62];
  faces.push(
    tube([leftEnd, rightEnd], 4, { tone: "edge", group: "beam" }),
    tube([[-36, 0, 56], [36, 0, 62]], 1.4, { tone: "lo", group: "beam" }),
    face2(circleXZ(0, 0, 59, 4.4, 18), { tone: "mid", group: "beam" }),
    face2(circleXZ(0, 0, 59, 1.8, 14), { tone: "lo", group: "beam" }),
  );

  /* The pointer above the pivot, bright at its tip. */
  faces.push(
    tube(
      [
        [0, 0, 59],
        [0, 0, 74],
      ],
      2.2,
      { tone: "edge", group: "needle" },
    ),
    face2(circleXZ(0, 0, 75, 2.4, 16), {
      tone: "hi",
      group: "needle",
    }),
  );

  /* Each pan hangs from three chains. */
  const pan = (
    cx: number,
    topZ: number,
    z: number,
    group: string,
  ) => {
    for (const [dx, dy] of [
      [-13, -7],
      [13, -7],
      [0, 14],
    ] as const) {
      faces.push(
        tube(
          [
            [cx, 0, topZ],
            [cx + dx, dy, z + 4],
          ],
          1.2,
          { tone: "mid", group },
        ),
      );
    }
    faces.push(
      ...cylinder(cx, 0, z, 3, 9, 15, {
        tone: "edge",
        topTone: "mid",
        hollow: 13,
        bottomArc: true,
        group,
      }),
      ...cylinder(cx, 0, z + 3, 1.2, 15, 15, {
        tone: "mid",
        topTone: "lo",
        group,
      }),
    );
  };

  pan(-36, 56, 30, "pan-left");
  pan(36, 62, 40, "pan-right");

  /* One bright weight on the lower pan. */
  faces.push(
    ...box(-40, -5, 36, 9, 9, 9, {
      r: 1.6,
      tone: "edge",
      topTone: "mid",
      group: "pan-left",
    }),
    face2(
      (() => {
        const [px, py] = iso(-35.5, -0.5, 45.4);
        return circle(px, py, 2.2, 12);
      })(),
      { tone: "hi", group: "pan-left" },
    ),
  );

  return faces;
}

export const comparison: PrototypeMeta = {
  slug: "comparison",
  name: "Comparison",
  component: "Comparison",
  object: "Balance scale",
  story:
    "The beam rocks, one pan settles lower and the bright pointer finds its rest.",
  note: "A comparison is a difference you can see: two pans, one inclination.",
  scene: figureScene({
    slug: "comparison",
    name: "Comparison",
    component: "Layout",
    object: "Balance scale",
    description:
      "A balance scale on a round foot and a slim column, with a tilted beam, hanging chains, two shallow pans and one bright weight.",
    aria:
      "An isometric balance scale with a tilted beam on a central column, two pans hanging from chains and a bright weight in the lower pan.",
    faces: comparisonFaces(),
    motions: [
      {
        group: "beam",
        kind: "sway",
        period: 3400,
        amount: 0.045,
        pivot: [0, 0, 59],
      },
      {
        group: "needle",
        kind: "sway",
        period: 3400,
        amount: 0.09,
        pivot: [0, 0, 59],
      },
      { group: "pan-left", kind: "bob", period: 3400, amount: 1.6 },
      { group: "pan-right", kind: "bob", period: 3400, amount: 1.6, phase: 0.5 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                  */
/* -------------------------------------------------------------------------- */

export const lot4Prototypes: PrototypeMeta[] = [
  android,
  angleSlider,
  animatedBeam,
  animatedCursor,
  animatedTestimonials,
  animatedTooltip,
  announcement,
  artifact,
  aspectRatio,
  attachment,
  audioPlayer,
  autocomplete,
  canvas,
  card3d,
  chainOfThought,
  checkpoint,
  circularProgress,
  circularSlider,
  clipboard,
  codeBlock,
  codeEditor,
  collapsible,
  colorPicker,
  commit,
  comparison,
];

