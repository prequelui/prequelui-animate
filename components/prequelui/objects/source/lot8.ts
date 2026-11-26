/*
 * Linear v4 — lot 8 (components 176 to 193 and objects 194 to 200).
 *
 * The component table in analyse/LINEAR-4-METAPHORES.md holds 193 rows, so
 * this lot closes it with the last eighteen components and then opens the
 * generic Objects collection with its first seven entries. Every drawing is
 * authored from scratch here: one real-world object per component, no slab
 * under the object, a silhouette that still reads at 64 px, the same 2:1
 * axonometric space as lots 1-7 and an engraved hairline.
 *
 * Faces are painted back to front and filled with the plate tone, so a nearer
 * face hides the construction behind it. There is no filter, gradient or mask.
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
  convexHull,
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
import { cake as cakeStudy, coffeeCup as coffeeCupStudy } from "./scenes";

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

/** Projected circle standing in the (x, z) plane. */
function circleXZ(
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
function circleYZ(
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

/** Filled rounded flat plate at a height, used for paper and small cards. */
function flatCard(
  cx: number,
  cy: number,
  z: number,
  w: number,
  d: number,
  r: number,
  opts: FaceOptions = {},
): FigureFace {
  return face2(
    roundedRect(cx - w / 2, cy - d / 2, w, d, r, 4).map(([x, y]) =>
      iso(x, y, z),
    ),
    opts,
  );
}

/** Engraved line on a horizontal plane. */
function flatLine(
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
function dotAt(
  x: number,
  y: number,
  z: number,
  r: number,
  tone: DetailTone = "lo",
  group?: string,
): FigureFace {
  const [px, py] = iso(x, y, z);
  return face2(circle(px, py, r, 12), { tone, group });
}

/** Quad between four 3D points, filled (paper sheets, folded panels). */
function quad(
  a: Point3,
  b: Point3,
  c: Point3,
  d: Point3,
  opts: FaceOptions = {},
): FigureFace {
  return face3([a, b, c, d], opts);
}

/** Rotated screen ellipse, used for horn mouths and curled paper. */
function ellipseRot(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  angle: number,
  steps = 28,
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

/** Small sphere with one engraved highlight. */
function ball(
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
    face2(circle(px, py, r, 24), { tone: "edge", ...opts }),
    face2(arc, { fill: false, tone: "lo", group: opts.group }),
  ];
}

/** A tapered bar between two projected points, useful for stems and horns. */
function tapered(
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
function leaf(
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
  const outline: Point2[] = [
    at(-length * 0.5, 0),
    at(-length * 0.18, -width * 0.5),
    at(length * 0.22, -width * 0.36),
    at(length * 0.5, 0),
    at(length * 0.22, width * 0.36),
    at(-length * 0.18, width * 0.5),
  ];
  return [
    face2(outline, { tone: "mid", ...opts }),
    stroke2([at(-length * 0.5, 0), at(length * 0.5, 0)], "lo", {
      group: opts.group,
    }),
  ];
}

/** A stencil numeral on a vertical face, drawn with filled bars. */
function digit(
  value: 1 | 2 | 3,
  cx: number,
  y: number,
  cz: number,
  w: number,
  h: number,
  tone: DetailTone,
  group?: string,
): FigureFace[] {
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const z0 = cz - h / 2;
  const z1 = cz + h / 2;
  const zm = cz;
  const t = Math.max(2.6, w * 0.18);
  const bar = (a: number, za: number, b: number, zb: number) =>
    face3(
      [
        [a, y, za],
        [b, y, za],
        [b, y, zb],
        [a, y, zb],
      ],
      { tone, group },
    );
  const hbar = (za: number) => bar(x0, za, x1, za + t);
  const vbar = (a: number, za: number, zb: number) =>
    bar(a, za, a + t, zb);
  if (value === 1) {
    return [
      vbar(cx - t / 2, z0, z1),
      hbar(z0),
      bar(cx - t * 1.6, z1 - t, cx + t * 0.8, z1),
    ];
  }
  if (value === 2) {
    return [
      hbar(z1 - t),
      vbar(x1 - t, zm - t, z1 - t),
      bar(x0, zm - t / 2, x1, zm + t / 2),
      vbar(x0, z0 + t, zm - t / 2),
      hbar(z0),
    ];
  }
  return [
    hbar(z1 - t),
    hbar(zm - t / 2),
    hbar(z0),
    vbar(x1 - t, z0 + t, z1 - t),
  ];
}

/* -------------------------------------------------------------------------- */
/* 176. Motion Highlight — laser level                                        */
/* -------------------------------------------------------------------------- */

function motionHighlightFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* A levelling tool owns its tripod: the three legs are its real support. */
  const hub: Point3 = [0, 0, 46];
  const feet: Point3[] = [
    [-38, 24, 0],
    [34, 18, 0],
    [2, -38, 0],
  ];
  for (const foot of feet) {
    faces.push(
      tube([hub, foot], 2.6, { tone: "edge" }),
      ...ball(foot[0], foot[1], 2.4, 3.4, { tone: "mid" }),
    );
  }
  faces.push(...cylinder(0, 0, 44, 6, 9, 8, { tone: "mid", topTone: "lo" }));
  faces.push(post(0, 0, 50, 60, 2.4, "edge"));

  /* Pan head and the levelling body. */
  faces.push(
    ...cylinder(0, 0, 59, 4, 12, 12, { tone: "mid", topTone: "lo" }),
    ...box(-22, -12, 62, 46, 24, 22, { r: 3, lip: true, tone: "edge" }),
    ...box(-18, -9, 84, 18, 18, 4, { r: 2, tone: "mid", group: "bubble" }),
  );
  const [bx, by] = iso(-9, 0, 86.4);
  faces.push(
    face2(circle(bx, by, 2.2, 16), { tone: "hi", group: "bubble" }),
  );

  /* Lens barrel on the right cheek. */
  faces.push(
    ...cylinder(24, 0, 67, 12, 8, 8, {
      tone: "edge",
      topTone: "lo",
      group: "head",
    }),
  );
  faces.push(
    disc3(25.4, 0, 73, 6.4, "yz", { tone: "edge", group: "head" }),
    disc3(26, 0, 73, 4.6, "yz", { tone: "lo", group: "head" }),
    disc3(26.4, 0, 73, 1.7, "yz", { tone: "hi", group: "head" }),
  );

  /* Two knobs on the near cheek and a vial on top. */
  faces.push(
    ...cylinder(-12, 12, 68, 5, 3.4, 3.4, {
      tone: "mid",
      topTone: "lo",
      group: "head",
    }),
    ...cylinder(4, 12, 68, 5, 3.4, 3.4, {
      tone: "mid",
      topTone: "lo",
      group: "head",
    }),
  );

  /* The projected level line leaves the lens and crosses the frame. */
  const [lx, ly] = iso(26, 0, 73);
  faces.push(
    face2(
      [
        [lx, ly - 1.1],
        [lx + 92, ly - 12],
        [lx + 92, ly - 9.4],
        [lx, ly + 1.1],
      ],
      { tone: "hi", group: "beam" },
    ),
    face2(
      [
        [lx + 20, ly - 7.5],
        [lx + 20, ly + 1.5],
      ],
      { fill: false, tone: "lo", group: "beam" },
    ),
    face2(
      [
        [lx + 54, ly - 10.2],
        [lx + 54, ly - 0.8],
      ],
      { fill: false, tone: "lo", group: "beam" },
    ),
  );

  /* A graduated strip on the front face. */
  faces.push(
    stroke3(
      [
        [-16, 12.2, 68],
        [12, 12.2, 68],
      ],
      "lo",
      { group: "head" },
    ),
  );
  for (let index = 0; index < 6; index += 1) {
    const x = -15 + index * 5.4;
    faces.push(
      stroke3(
        [
          [x, 12.2, 68],
          [x, 12.2, index % 2 === 0 ? 73 : 71],
        ],
        "lo",
        { group: "head" },
      ),
    );
  }

  return faces;
}

export const motionHighlight: PrototypeMeta = {
  slug: "motion-highlight",
  name: "Motion Highlight",
  component: "Motion Highlight",
  object: "Laser level",
  story:
    "The emitter pivots on its tripod and the levelling line sweeps across the wall.",
  note: "A highlight that travels is a tool that projects a line: the beam is the point.",
  scene: figureScene({
    slug: "motion-highlight",
    name: "Motion Highlight",
    component: "Effects",
    object: "Laser level",
    description:
      "A laser level on a tripod: three legs, a pan head, a levelling body, a lens and one bright projected line.",
    aria:
      "An isometric laser level on a tripod, with a levelling body, a bright lens and a long projected line.",
    faces: motionHighlightFaces(),
    motions: [
      {
        group: "head",
        kind: "sway",
        period: 3200,
        amount: 2.4,
        pivot: [0, 0, 64],
      },
      {
        group: "beam",
        kind: "sway",
        period: 3200,
        amount: 5.5,
        pivot: [26, 0, 73],
      },
      { group: "bubble", kind: "breathe", period: 2300, amount: 0.08 },
      { kind: "breathe", period: 6000, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 177. Open in Chat — service hatch                                          */
/* -------------------------------------------------------------------------- */

function openInChatFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Four jambs around a real opening: the frame is the object. */
  faces.push(
    ...box(-42, 8, 0, 10, 16, 78, { r: 2, tone: "edge" }),
    ...box(32, 8, 0, 10, 16, 78, { r: 2, tone: "edge" }),
    ...box(-42, 8, 78, 84, 16, 10, { r: 2, tone: "edge" }),
    ...box(-42, 8, 0, 84, 16, 8, { r: 2, tone: "edge" }),
  );

  /* The dark inside, then the door swung wide open. */
  faces.push(panel(-32, 32, 26, 8, 78, { tone: "lo" }));
  const doorEdge: Point3[] = [
    [-32, 24, 8],
    [-2, -26, 8],
    [-2, -26, 78],
    [-32, 24, 78],
  ];
  faces.push(
    face3(doorEdge, { tone: "edge", group: "door" }),
    face3(
      [
        [-28.4, 20.6, 13],
        [-4.2, -22.6, 13],
        [-4.2, -22.6, 73],
        [-28.4, 20.6, 73],
      ],
      { fill: false, tone: "lo", group: "door" },
    ),
  );
  /* Thin door thickness and a lever handle on the free edge. */
  faces.push(
    face3(
      [
        [-2, -26, 8],
        [-2, -30, 8],
        [-2, -30, 78],
        [-2, -26, 78],
      ],
      { tone: "mid", group: "door" },
    ),
    tube(
      [
        [-6, -21.2, 44],
        [-13.4, -29.6, 44],
        [-13.4, -29.6, 38],
      ],
      2.2,
      { tone: "mid", group: "door" },
    ),
  );
  const [hx, hy] = iso(-13.4, -29.6, 36.6);
  faces.push(face2(circle(hx, hy, 2.8, 14), { tone: "hi", group: "door" }));

  /* A lit arrow sign above the frame points through the hatch. */
  faces.push(
    post(-12, 16, 88, 95, 2, "edge"),
    post(18, 16, 88, 95, 2, "edge"),
    panel(-22, 28, 16, 95, 113, { tone: "mid", group: "arrow" }),
    stroke3(
      [
        [-16, 15.6, 104],
        [20, 15.6, 104],
      ],
      "hi",
      { group: "arrow" },
    ),
    stroke3(
      [
        [9, 15.6, 109],
        [20, 15.6, 104],
        [9, 15.6, 99],
      ],
      "hi",
      { group: "arrow" },
    ),
  );

  /* Hinges and two bolts. */
  for (const z of [18, 66]) {
    faces.push(
      ...cylinder(-38, 23.4, z, 5, 2.4, 2.4, {
        tone: "mid",
        topTone: "lo",
        group: "door",
      }),
    );
  }
  for (const [x, z] of [
    [-36, 70],
    [36, 70],
    [-36, 8],
    [36, 8],
  ] as const) {
    faces.push(...ball(x, 16, z, 2.2, { tone: "mid" }));
  }

  return faces;
}

export const openInChat: PrototypeMeta = {
  slug: "open-in-chat",
  name: "Open in Chat",
  component: "Open in Chat",
  object: "Service hatch",
  story:
    "The little door swings wide and the arrow inside points through to the other side.",
  note: "Opening a chat is passing through a hatch: a small door that leads elsewhere.",
  scene: figureScene({
    slug: "open-in-chat",
    name: "Open in Chat",
    component: "AI",
    object: "Service hatch",
    description:
      "A framed service hatch with its door open on the left hinge, a lever handle and a bright arrow sign inside.",
    aria:
      "An isometric service hatch frame with an open door, a lever handle and a bright arrow pointing through the opening.",
    faces: openInChatFaces(),
    motions: [
      {
        group: "door",
        kind: "sway",
        period: 3200,
        amount: 7,
        pivot: [-32, 24, 43],
      },
      { group: "arrow", kind: "lift", period: 2400, amount: 2.4 },
      { kind: "breathe", period: 5200, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 178. Package Info — parcel                                                 */
/* -------------------------------------------------------------------------- */

function packageInfoFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(...box(-38, -26, 0, 76, 52, 48, { r: 3, lip: true }));

  /* Crossed packing tape, with one lifted edge. */
  faces.push(
    flatCard(0, 0, 48.3, 78, 9, 0, { tone: "mid", group: "tape" }),
    flatCard(0, 0, 48.4, 9, 54, 0, { tone: "mid", group: "tape" }),
    flatLine(-39, 0, 39, 0, 48.5, "hi", "tape"),
    flatLine(0, -27, 0, 27, 48.5, "hi", "tape"),
  );
  faces.push(
    quad(
      [-38, 26.2, 48],
      [-38, 26.2, 32],
      [38, 26.2, 32],
      [38, 26.2, 48],
      { fill: false, tone: "lo" },
    ),
  );

  /* Shipping label on the top face, with lines and a bar code. */
  faces.push(
    flatCard(6, -4, 48.8, 40, 26, 2, {
      tone: "mid",
      group: "label",
    }),
  );
  for (const [z0, z1, width] of [
    [42, 42.8, 20],
    [39, 39.8, 14],
    [36, 36.8, 24],
  ] as const) {
    faces.push(
      flatLine(-9, z0, -9 + width, z1, 49.1, "lo", "label"),
    );
  }
  for (let index = 0; index < 9; index += 1) {
    const x = 0 + index * 1.9;
    faces.push(
      stroke3(
        [
          [x + 8, 8, 49.1],
          [x + 8, 8, 49.1 + (index % 3 === 0 ? 7 : 4.6)],
        ],
        index === 2 ? "hi" : "mid",
        { group: "label" },
      ),
    );
  }

  /* Two "this way up" arrows on the front face. */
  for (const x of [-24, -9]) {
    faces.push(
      stroke3(
        [
          [x, 26.3, 16],
          [x, 26.3, 28],
        ],
        "hi",
      ),
      stroke3(
        [
          [x - 4, 26.3, 23],
          [x, 26.3, 28],
          [x + 4, 26.3, 23],
        ],
        "hi",
      ),
    );
  }
  /* A fragile stamp and a face seam. */
  faces.push(
    stroke3(
      [
        [14, 26.3, 14],
        [24, 26.3, 14],
        [24, 26.3, 24],
        [14, 26.3, 24],
      ],
      "mid",
      { closed: true },
    ),
    stroke3(
      [
        [17, 26.3, 18],
        [21, 26.3, 21],
        [19, 26.3, 15],
        [23, 26.3, 18],
      ],
      "lo",
    ),
    stroke3(
      [
        [-38, 26.3, 8],
        [38, 26.3, 8],
      ],
      "lo",
    ),
  );

  return faces;
}

export const packageInfo: PrototypeMeta = {
  slug: "package-info",
  name: "Package Info",
  component: "Package Info",
  object: "Parcel",
  story:
    "The shipping label lifts off the lid while the edge of the tape peels back.",
  note: "Package information is what is written on the parcel: read the label before opening.",
  scene: figureScene({
    slug: "package-info",
    name: "Package Info",
    component: "Data",
    object: "Parcel",
    description:
      "A wrapped parcel with crossed tape, a shipping label, a bar code and two this-way-up arrows.",
    aria:
      "An isometric wrapped parcel with crossed tape, a raised shipping label with a bar code and two arrows on the front.",
    faces: packageInfoFaces(),
    motions: [
      { group: "label", kind: "lift", period: 2800, amount: 3.2 },
      { group: "tape", kind: "breathe", period: 3000, amount: 0.012 },
      { kind: "breathe", period: 5600, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 179. Persona — theatre mask on a stand                                     */
/* -------------------------------------------------------------------------- */

function personaFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 6, 23, 21, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ellipse3(0, 0, 6.2, 14, 14, { fill: false, tone: "lo" }),
  );
  faces.push(post(0, 0, 6, 72, 3.6, "edge", "stand"));

  /* Mask is drawn in screen space so the face keeps its tilt at every size. */
  const [cx, cy] = iso(0, 0, 108);
  const faceShape: Point2[] = [
    [cx, cy - 50],
    [cx + 22, cy - 44],
    [cx + 36, cy - 26],
    [cx + 37, cy - 2],
    [cx + 32, cy + 20],
    [cx + 19, cy + 39],
    [cx + 6, cy + 48],
    [cx, cy + 50],
    [cx - 6, cy + 48],
    [cx - 19, cy + 39],
    [cx - 32, cy + 20],
    [cx - 37, cy - 2],
    [cx - 36, cy - 26],
    [cx - 22, cy - 44],
  ];
  faces.push(face2(faceShape, { tone: "edge", group: "mask" }));
  const inner = faceShape.map(([x, y]) => [
    cx + (x - cx) * 0.9,
    cy + (y - cy) * 0.9,
  ] as Point2);
  faces.push(face2(inner, { tone: "mid", group: "mask" }));
  const flat = faceShape.map(([x, y]) => [
    cx + (x - cx) * 0.76,
    cy + (y - cy) * 0.76 + 2,
  ] as Point2);
  faces.push(face2(flat, { tone: "lo", group: "mask" }));

  /* Almond eye holes with heavy brows. */
  for (const side of [-1, 1]) {
    const ex = cx + side * 15;
    const eye: Point2[] = [
      [ex - 11, cy - 8],
      [ex - 4, cy - 16],
      [ex + 8, cy - 14],
      [ex + 11, cy - 7],
      [ex + 2, cy - 2],
      [ex - 7, cy - 2],
    ];
    faces.push(
      face2(eye, { tone: "edge", group: "mask" }),
      stroke2(
        [
          [ex - 13, cy - 21],
          [ex, cy - 27],
          [ex + 13, cy - 22],
        ],
        "mid",
        { group: "mask" },
      ),
    );
  }

  /* Nose ridge, cheek lines and the open tragic mouth. */
  faces.push(
    stroke2(
      [
        [cx - 2, cy - 2],
        [cx - 3, cy + 10],
        [cx - 7, cy + 15],
        [cx, cy + 17],
      ],
      "mid",
      { group: "mask" },
    ),
    stroke2(
      [
        [cx - 20, cy + 8],
        [cx - 15, cy + 18],
        [cx - 9, cy + 24],
      ],
      "lo",
      { group: "mask" },
    ),
    stroke2(
      [
        [cx + 20, cy + 8],
        [cx + 15, cy + 18],
        [cx + 9, cy + 24],
      ],
      "lo",
      { group: "mask" },
    ),
  );
  const mouth: Point2[] = [
    [cx - 13, cy + 26],
    [cx - 5, cy + 22],
    [cx + 5, cy + 22],
    [cx + 13, cy + 26],
    [cx + 8, cy + 38],
    [cx - 8, cy + 38],
  ];
  faces.push(
    face2(mouth, { tone: "edge", group: "mask" }),
    stroke2(
      [
        [cx - 10, cy + 28],
        [cx, cy + 25],
        [cx + 10, cy + 28],
      ],
      "mid",
      { group: "mask" },
    ),
  );

  /* A crown ornament and two side ribbons. */
  faces.push(
    face2(star2(cx, cy - 55, 8, 3.6, 5, -Math.PI / 2), {
      tone: "mid",
      group: "mask",
    }),
    stroke2(
      [
        [cx - 37, cy - 10],
        [cx - 52, cy + 2],
        [cx - 46, cy + 18],
      ],
      "mid",
      { group: "mask" },
    ),
    stroke2(
      [
        [cx + 37, cy - 10],
        [cx + 52, cy + 2],
        [cx + 46, cy + 18],
      ],
      "mid",
      { group: "mask" },
    ),
  );

  /* Two clips fixing the mask to the post. */
  faces.push(
    tube(
      [
        [-8, 0, 72],
        [8, 0, 72],
      ],
      2.4,
      { tone: "mid" },
    ),
    ...ball(0, 0, 73.4, 2.6, { tone: "mid" }),
  );

  const [sx, sy] = iso(-13, 0, 101);
  faces.push(
    face2(circle(sx, sy, 2.4, 14), { tone: "hi", group: "shine" }),
  );

  return faces;
}

export const persona: PrototypeMeta = {
  slug: "persona",
  name: "Persona",
  component: "Persona",
  object: "Theatre mask on a stand",
  story:
    "The mask turns on its stand and a highlight travels across one painted eye.",
  note: "A persona is a face put on deliberately: a mask held up for the room.",
  scene: figureScene({
    slug: "persona",
    name: "Persona",
    component: "AI",
    object: "Theatre mask on a stand",
    description:
      "A tragic theatre mask on a post: heavy brows, almond eye holes, an open mouth and a star crown.",
    aria:
      "An isometric theatre mask on a stand, with heavy brows, almond eye holes, an open mouth and a small star crown.",
    faces: personaFaces(),
    motions: [
      {
        group: "mask",
        kind: "sway",
        period: 3600,
        amount: 3,
        pivot: [0, 0, 72],
      },
      { group: "shine", kind: "lift", period: 3000, amount: 4.5 },
      { group: "stand", kind: "breathe", period: 5400, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 180. 3D Pin — golf tee                                                     */
/* -------------------------------------------------------------------------- */

function pin3dFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* A tuft of grass gives the tee its footing without a base plate. */
  for (let index = 0; index < 9; index += 1) {
    const a = -2.6 + index * 0.42;
    const x = Math.cos(a) * 16;
    const y = Math.sin(a) * 16;
    faces.push(
      stroke3(
        [
          [x, y, 0],
          [x * 0.7, y * 0.7, 8 + (index % 3) * 4],
          [x * 0.4, y * 0.4, 15 + (index % 4) * 2],
        ],
        index % 2 === 0 ? "mid" : "lo",
      ),
    );
  }

  /* Tee: a shallow cup, a tapered stem and a sharp point. */
  faces.push(
    ...cylinder(0, 0, 2, 34, 3.2, 5.4, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
      group: "tee",
    }),
    ...cylinder(0, 0, 36, 6, 9, 9, {
      tone: "edge",
      hollow: 3.2,
      topTone: "mid",
      group: "tee",
    }),
    ellipse3(0, 0, 42.3, 5.6, 5.6, { fill: false, tone: "lo", group: "tee" }),
    ...cylinder(0, 0, 0, 3, 0.6, 2, { tone: "edge", group: "tee" }),
  );

  /* Ball with dimples. */
  const [bx, by] = iso(0, 0, 62);
  faces.push(
    face2(circle(bx, by, 19, 34), { tone: "edge", group: "ball" }),
  );
  const dimples: Array<[number, number, number]> = [
    [-10, -4, 2.4],
    [-2, -10, 2.2],
    [7, -6, 2.6],
    [12, 2, 2.1],
    [2, 4, 2.7],
    [-8, 7, 2.2],
    [6, 11, 2.3],
    [-2, 13, 1.9],
    [-14, 6, 1.8],
  ];
  for (const [dx, dy, r] of dimples) {
    faces.push(
      face2(circle(bx + dx, by + dy, r, 12), {
        fill: false,
        tone: "lo",
        group: "ball",
      }),
    );
  }
  faces.push(
    face2(circle(bx + 6, by + 12, 1.6, 10), {
      tone: "hi",
      group: "ball",
    }),
  );

  return faces;
}

export const pin3d: PrototypeMeta = {
  slug: "pin-3d",
  name: "3D Pin",
  component: "3D Pin",
  object: "Golf tee",
  story:
    "The ball settles onto the tee and the tee presses a finger-width deeper into the grass.",
  note: "A 3D pin is a single point held above the ground: a ball on a tee.",
  scene: figureScene({
    slug: "pin-3d",
    name: "3D Pin",
    component: "Effects",
    object: "Golf tee",
    description:
      "A dimpled golf ball resting on a tapered wooden tee, with a small tuft of grass at the point.",
    aria:
      "An isometric golf ball with dimples resting on a tapered tee, planted in a small tuft of grass.",
    faces: pin3dFaces(),
    motions: [
      { group: "ball", kind: "lift", period: 2500, amount: 3.4 },
      { group: "tee", kind: "breathe", period: 2500, amount: 0.012 },
      { kind: "breathe", period: 5000, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 181. Plan — rolled blueprint                                               */
/* -------------------------------------------------------------------------- */

/** Horizontal drum along y, with the near cap and an engraved rim. */
function drumY(
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
  } = {},
  steps = 26,
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
      face2(circleXZ(cx, y1, cz, Math.max(1, r * 0.58), 22), {
        fill: false,
        tone: "lo",
        group: opts.group,
      }),
    );
  }
  return faces;
}

function planFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The sheet lies on the floor of the drawing, held by the rolled end. */
  const sheet: Point3[] = [
    [-58, -32, 2],
    [34, -32, 2],
    [40, 32, 2],
    [-52, 32, 2],
  ];
  faces.push(
    face3(sheet, { tone: "mid" }),
    stroke3([...sheet, sheet[0]], "edge", { closed: false }),
  );

  /* Grid and a highlighted route. */
  for (let index = 0; index < 6; index += 1) {
    const t = index / 5;
    const x = -56 + t * 92;
    faces.push(
      stroke3(
        [
          [x, -32, 2.2],
          [x + 6, 32, 2.2],
        ],
        "lo",
        { group: "grid" },
      ),
    );
  }
  for (let index = 0; index < 5; index += 1) {
    const y = -30 + index * 15;
    faces.push(
      stroke3(
        [
          [-58 + index * 1.2, y, 2.2],
          [39 - index * 0.6, y, 2.2],
        ],
        "lo",
        { group: "grid" },
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [-42, -18, 2.4],
        [-24, -6, 2.4],
        [-6, -10, 2.4],
        [12, 4, 2.4],
        [26, 12, 2.4],
      ],
      "hi",
      { group: "route" },
    ),
    stroke3(
      [
        [-22, 18, 2.4],
        [-22, 8, 2.4],
        [-14, 8, 2.4],
        [-14, 18, 2.4],
        [-6, 18, 2.4],
        [-6, 8, 2.4],
      ],
      "mid",
      { group: "grid" },
    ),
  );

  /* A ruler laid on the plan, with a bright zero mark. */
  faces.push(
    flatCard(-8, 22, 3.2, 72, 7, 1, { tone: "edge", group: "ruler" }),
  );
  for (let index = 0; index < 13; index += 1) {
    const x = -42 + index * 5.6;
    faces.push(
      flatLine(x, 19, x, index % 5 === 0 ? 25 : 23.4, 3.4, "lo", "ruler"),
    );
  }
  faces.push(flatLine(-42, 22, -34, 22, 3.5, "hi", "ruler"));

  /* Rolled end, its spiral cap and a curl at the loose edge. */
  faces.push(
    ...drumY(-34, 34, 46, 14, 11, {
      tone: "edge",
      topTone: "mid",
      group: "roll",
    }),
  );
  faces.push(
    face2(circleXZ(46, 34.4, 14, 6.4, 24), {
      fill: false,
      tone: "lo",
      group: "roll",
    }),
    face2(circleXZ(46, 34.4, 14, 2.2, 16), {
      fill: false,
      tone: "mid",
      group: "roll",
    }),
  );
  faces.push(
    tube(
      [
        [-58, -32, 2],
        [-60, -26, 8],
        [-56, -18, 5],
        [-54, -12, 2],
      ],
      1.4,
      { tone: "lo", group: "sheet" },
    ),
  );

  /* Small north arrow in the lower corner. */
  faces.push(
    stroke3(
      [
        [-30, 26, 2.4],
        [-30, 16, 2.4],
      ],
      "mid",
      { group: "grid" },
    ),
    stroke3(
      [
        [-34, 20, 2.4],
        [-30, 16, 2.4],
        [-26, 20, 2.4],
      ],
      "hi",
      { group: "grid" },
    ),
  );

  return faces;
}

export const plan: PrototypeMeta = {
  slug: "plan",
  name: "Plan",
  component: "Plan",
  object: "Rolled blueprint",
  story:
    "The sheet breathes open from its roll and the route across the drawing catches the light.",
  note: "A plan is a drawing you unroll: the whole route is visible at once.",
  scene: figureScene({
    slug: "plan",
    name: "Plan",
    component: "AI",
    object: "Rolled blueprint",
    description:
      "A blueprint partly unrolled from a cylinder: a gridded sheet, a bright route, a ruler and a north arrow.",
    aria:
      "An isometric rolled blueprint with a gridded sheet, a bright route, a ruler and a north arrow.",
    faces: planFaces(),
    motions: [
      { group: "roll", kind: "sway", period: 4200, amount: 1.6 },
      { group: "grid", kind: "flicker", period: 3600, amount: 0.08 },
      { group: "ruler", kind: "lift", period: 3000, amount: 1.4 },
      { group: "sheet", kind: "breathe", period: 5600, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 182. Prose — clay tablet                                                   */
/* -------------------------------------------------------------------------- */

function proseFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* A slab standing on its lower edge: the thickness is its only support. */
  faces.push(
    ...prism(roundedRect(-46, -7, 92, 14, 4, 5), 0, 64, {
      lip: true,
      topTone: "mid",
    }),
    stroke3(
      [
        [-46, -7.2, 8],
        [-46, -7.2, 56],
      ],
      "lo",
    ),
  );

  /* Pressed rules and cuneiform wedges on the front face. */
  const rowZ = [12, 20, 28, 36, 44, 52];
  rowZ.forEach((z, rowIndex) => {
    faces.push(
      stroke3(
        [
          [-38, -7.3, z - 2.6],
          [38, -7.3, z - 2.6],
        ],
        "lo",
      ),
    );
    for (let index = 0; index < 7; index += 1) {
      const x = -33 + index * 10.2 + (rowIndex % 2 === 0 ? 0 : 3.4);
      if (x > 34) continue;
      faces.push(
        stroke3(
          [
            [x, -7.4, z + 3.4],
            [x + 3.4, -7.4, z - 0.4],
          ],
          index === 2 && rowIndex === 2 ? "hi" : "mid",
        ),
        stroke3(
          [
            [x + 3.4, -7.4, z - 0.4],
            [x + 1.4, -7.4, z - 2.4],
          ],
          "mid",
        ),
        stroke3(
          [
            [x + 3.4, -7.4, z - 0.4],
            [x + 5.6, -7.4, z - 2.4],
          ],
          "mid",
        ),
      );
    }
  });

  /* Stylus lying in front, its point on the fresh groove. */
  faces.push(
    ...tapered([58, -30, 6], [6, -13, 46], 3, 1.2, {
      tone: "edge",
      group: "stylus",
    }),
    ...ball(60, -31, 6, 3.4, { tone: "mid", group: "stylus" }),
    stroke3(
      [
        [8, -12.6, 44],
        [2, -12.6, 48],
      ],
      "hi",
      { group: "stylus" },
    ),
  );

  /* A chipped corner and a repair band. */
  faces.push(
    stroke3(
      [
        [30, -7.3, 61],
        [34, -7.3, 57],
        [38, -7.3, 60],
      ],
      "lo",
    ),
    stroke3(
      [
        [-43, -7.3, 30],
        [-38, -7.3, 30],
      ],
      "mid",
    ),
  );

  return faces;
}

export const prose: PrototypeMeta = {
  slug: "prose",
  name: "Prose",
  component: "Prose",
  object: "Clay tablet",
  story:
    "The stylus presses one more line and the fresh groove lights up in the clay.",
  note: "Prose is writing that endures: marks pressed into a tablet you can still read.",
  scene: figureScene({
    slug: "prose",
    name: "Prose",
    component: "Text",
    object: "Clay tablet",
    description:
      "A rounded clay tablet standing on its edge, covered with pressed rules and cuneiform wedges, with a stylus in front.",
    aria:
      "An isometric clay tablet covered with rows of pressed cuneiform marks, with a stylus resting against a fresh groove.",
    faces: proseFaces(),
    motions: [
      {
        group: "stylus",
        kind: "sway",
        period: 3000,
        amount: 2.4,
        pivot: [58, -30, 6],
      },
      { kind: "breathe", period: 5600, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 183. Queue — plate rack                                                    */
/* -------------------------------------------------------------------------- */

function queueFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Back frame and the wire dividers that make the rack read. */
  for (const x of [-58, 58]) {
    faces.push(
      post(x, -20, 0, 52, 2.4, "edge"),
      tube(
        [
          [x, -20, 50],
          [x, 20, 50],
        ],
        2,
        { tone: "lo" },
      ),
    );
  }
  faces.push(
    tube(
      [
        [-58, -20, 4],
        [58, -20, 4],
      ],
      2.2,
      { tone: "edge" },
    ),
    tube(
      [
        [-58, -20, 20],
        [58, -20, 20],
      ],
      1.6,
      { tone: "lo" },
    ),
  );
  for (const x of [-44, -22, 0, 22, 44]) {
    faces.push(
      tube(
        [
          [x, -20, 4],
          [x, -20, 50],
        ],
        1.3,
        { tone: "lo" },
      ),
    );
  }
  for (const [x, y] of [
    [-58, -20],
    [58, -20],
  ] as const) {
    faces.push(...ball(x, y, 1.6, 3.4, { tone: "mid" }));
  }

  /* Four plates side by side in their slots. The front one owns the accent. */
  const plateXs = [-33, -11, 11, 33];
  plateXs.forEach((x, index) => {
    const front = index === plateXs.length - 1;
    const radius = front ? 24 : 21;
    const cz = 4 + radius;
    faces.push(
      disc3(x, 0, cz, radius, "yz", {
        tone: front ? "mid" : "edge",
        group: front ? "front" : "stack",
      }),
      face2(circleYZ(x + 0.4, 0, cz, radius - 4.2, 34), {
        fill: false,
        tone: "lo",
        group: front ? "front" : "stack",
      }),
      face2(circleYZ(x + 0.6, 0, cz, 4.2, 20), {
        tone: "lo",
        group: front ? "front" : "stack",
      }),
    );
    if (front) {
      faces.push(
        face2(
          circleYZ(x + 0.8, 0, cz, radius - 1.4, 34).slice(0, 14),
          { fill: false, tone: "hi", group: "front" },
        ),
      );
    }
  });

  /* Front rail and feet close the rack in front of the plates. */
  faces.push(
    tube(
      [
        [-58, 20, 4],
        [58, 20, 4],
      ],
      2.2,
      { tone: "mid" },
    ),
    tube(
      [
        [-58, 20, 50],
        [58, 20, 50],
      ],
      2,
      { tone: "mid" },
    ),
    post(-58, 20, 4, 50, 2.2, "mid"),
    post(58, 20, 4, 50, 2.2, "mid"),
  );
  for (const [x, y] of [
    [-58, 20],
    [58, 20],
  ] as const) {
    faces.push(...ball(x, y, 1.6, 3.4, { tone: "mid" }));
  }

  return faces;
}

export const queue: PrototypeMeta = {
  slug: "queue",
  name: "Queue",
  component: "Queue",
  object: "Plate rack",
  story:
    "The front plate slides up out of its slot and the stack behind it settles forward.",
  note: "A queue is work waiting in order: plates in a rack, the next one always in front.",
  scene: figureScene({
    slug: "queue",
    name: "Queue",
    component: "AI",
    object: "Plate rack",
    description:
      "A wire plate rack holding four plates upright in their slots, the front one ready to be taken.",
    aria:
      "An isometric wire plate rack with four upright plates, the front plate highlighted and ready.",
    faces: queueFaces(),
    motions: [
      { group: "front", kind: "lift", period: 2400, amount: 4.4 },
      { group: "stack", kind: "breathe", period: 3000, amount: 0.012 },
      { kind: "breathe", period: 5400, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 184. Sandbox Run — marble run                                               */
/* -------------------------------------------------------------------------- */

function sandboxRunFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The toy's own frame: two posts, ground rails and feet. */
  faces.push(
    post(-42, 0, 0, 94, 3.4, "edge", "frame"),
    post(38, 0, 0, 78, 3.2, "edge", "frame"),
    tube(
      [
        [-42, -16, 3],
        [38, -16, 3],
      ],
      2.2,
      { tone: "lo" },
    ),
    tube(
      [
        [-42, 16, 3],
        [38, 16, 3],
      ],
      2.2,
      { tone: "mid" },
    ),
    ...ball(-42, -16, 1.4, 3.2, { tone: "mid" }),
    ...ball(38, -16, 1.4, 3.2, { tone: "mid" }),
    ...ball(-42, 16, 1.4, 3.2, { tone: "mid" }),
    ...ball(38, 16, 1.4, 3.2, { tone: "mid" }),
  );

  /* Upper ramp, with its side thickness and two raised rails. */
  const upperTop: Point3[] = [
    [-38, -10, 86],
    [16, -10, 54],
    [16, 10, 54],
    [-38, 10, 86],
  ];
  faces.push(
    quad(
      [-38, -10, 83.5],
      [16, -10, 51.5],
      [16, -10, 54],
      [-38, -10, 86],
      { tone: "mid", group: "ramps" },
    ),
    quad(
      [-38, 10, 83.5],
      [16, 10, 51.5],
      [16, 10, 54],
      [-38, 10, 86],
      { tone: "edge", group: "ramps" },
    ),
    face3(upperTop, { tone: "edge", group: "ramps" }),
    face3(upperTop, { fill: false, tone: "lo", group: "ramps" }),
    tube([upperTop[0], upperTop[1]], 1.6, { tone: "mid", group: "ramps" }),
    tube([upperTop[3], upperTop[2]], 1.6, { tone: "mid", group: "ramps" }),
  );

  /* Lower ramp turning back under the first. */
  const lowerTop: Point3[] = [
    [16, -9, 46],
    [-26, -9, 16],
    [-26, 9, 16],
    [16, 9, 46],
  ];
  faces.push(
    quad(
      [16, -9, 43.5],
      [-26, -9, 13.5],
      [-26, -9, 16],
      [16, -9, 46],
      { tone: "mid", group: "ramps" },
    ),
    quad(
      [16, 9, 43.5],
      [-26, 9, 13.5],
      [-26, 9, 16],
      [16, 9, 46],
      { tone: "edge", group: "ramps" },
    ),
    face3(lowerTop, { tone: "edge", group: "ramps" }),
    face3(lowerTop, { fill: false, tone: "lo", group: "ramps" }),
    tube([lowerTop[0], lowerTop[1]], 1.6, { tone: "mid", group: "ramps" }),
    tube([lowerTop[3], lowerTop[2]], 1.6, { tone: "mid", group: "ramps" }),
  );

  /* A catch cup at the end of the run. */
  faces.push(
    ...cylinder(-32, 0, 0, 12, 10, 9, {
      tone: "edge",
      hollow: 3.2,
      topTone: "mid",
      bottomArc: true,
    }),
    ellipse3(-32, 0, 12.2, 5.6, 5.6, { fill: false, tone: "lo" }),
  );

  /* The marble on the upper track. */
  faces.push(
    ...ball(-15, 0, 80, 7, { tone: "mid", group: "marble" }),
    face2(circleXZ(-15, -7.4, 80, 3.2, 18), {
      tone: "hi",
      group: "marble",
    }),
  );

  /* A little bell at the top of the frame. */
  faces.push(
    tube(
      [
        [38, 0, 78],
        [38, 0, 86],
      ],
      1.6,
      { tone: "lo" },
    ),
    ...cylinder(38, 0, 86, 10, 7, 3, {
      tone: "mid",
      topTone: "hi",
      group: "bell",
    }),
  );

  return faces;
}

export const sandboxRun: PrototypeMeta = {
  slug: "sandbox-run",
  name: "Sandbox Run",
  component: "Sandbox Run",
  object: "Marble run",
  story:
    "The marble rolls down one ramp, drops to the next and the little bell answers.",
  note: "Running a sandbox is watching a sequence play out: a marble through a track.",
  scene: figureScene({
    slug: "sandbox-run",
    name: "Sandbox Run",
    component: "AI",
    object: "Marble run",
    description:
      "A wooden marble run on two posts: an upper ramp, a lower ramp turning back, a marble and a catch cup.",
    aria:
      "An isometric marble run with two zigzag ramps, a rolling marble, a catch cup and a small bell.",
    faces: sandboxRunFaces(),
    motions: [
      { group: "marble", kind: "sway", period: 2600, amount: 3.2 },
      { group: "marble", kind: "bob", period: 1300, amount: 1.4 },
      { group: "ramps", kind: "breathe", period: 5000, amount: 0.004 },
      { group: "bell", kind: "sway", period: 2100, amount: 2.4 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 185. Sources — index ring                                                  */
/* -------------------------------------------------------------------------- */

function rotatedCard(
  cx: number,
  cy: number,
  radial: number,
  along: number,
  across: number,
  angle: number,
  opts: FaceOptions = {},
): FigureFace {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const ux = ca;
  const uy = sa;
  const vx = -sa;
  const vy = ca;
  const p = (u: number, v: number): Point2 => [
    cx + ux * u - vx * v,
    cy + uy * u - vy * v,
  ];
  return face2(
    [
      p(radial, -across),
      p(radial + along, -across),
      p(radial + along, across),
      p(radial, across),
    ],
    opts,
  );
}

function sourcesFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [cx, cy] = iso(0, 0, 68);

  /* A cast foot and a slim post hold the ring upright. */
  faces.push(
    ...cylinder(0, 0, 0, 5, 18, 16, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    post(0, 0, 5, 40, 2.8, "edge", "stand"),
    tube(
      [
        [0, 0, 38],
        [0, 0, 42],
      ],
      3.4,
      { tone: "mid" },
    ),
  );

  /* Five cards fanned around the ring, painted from the back. */
  const angles = [2.72, 2.36, 1.95, 1.57, 1.2, 0.82];
  angles.forEach((angle, index) => {
    const front = index === 2;
    const radial = 27;
    const along = front ? 34 : 30;
    const across = front ? 17 : 15;
    faces.push(
      rotatedCard(cx, cy, radial, along, across, angle, {
        tone: front ? "mid" : "edge",
        group: front ? "cardTop" : "cards",
      }),
      rotatedCard(cx, cy, radial + 4, along - 8, across - 3, angle, {
        fill: false,
        tone: "lo",
        group: front ? "cardTop" : "cards",
      }),
    );
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);
    for (let lineIndex = 0; lineIndex < 4; lineIndex += 1) {
      const u0 = radial + 9;
      const u1 = radial + along - 5 - (lineIndex % 2) * 6;
      const v = -across + 5 + lineIndex * 3.6;
      faces.push(
        face2(
          [
            [
              cx + ca * u0 - -sa * v,
              cy + sa * u0 - ca * v,
            ],
            [
              cx + ca * u1 - -sa * v,
              cy + sa * u1 - ca * v,
            ],
          ],
          {
            fill: false,
            tone:
              front && lineIndex === 1 ? "hi" : lineIndex === 0 ? "mid" : "lo",
            group: front ? "cardTop" : "cards",
          },
        ),
      );
    }
    /* The punched hole that threads the card onto the ring. */
    const hx = cx + ca * (radial + 3);
    const hy = cy + sa * (radial + 3);
    faces.push(
      face2(circle(hx, hy, 2.1, 12), {
        tone: "lo",
        group: front ? "cardTop" : "cards",
      }),
    );
  });

  /* The ring is painted last so it passes in front of the cards. */
  faces.push(
    face2(circleXZ(0, 0, 68, 30, 44), {
      fill: false,
      tone: "edge",
      group: "ring",
    }),
    face2(circleXZ(0, 0, 68, 27.4, 40), {
      fill: false,
      tone: "lo",
      group: "ring",
    }),
  );
  faces.push(
    face2(ellipse2(cx + 24, cy - 16, 2.4, 2.4, 12), {
      tone: "hi",
      group: "ring",
    }),
  );

  return faces;
}

export const sources: PrototypeMeta = {
  slug: "sources",
  name: "Sources",
  component: "Sources",
  object: "Index ring",
  story:
    "The front card turns on the ring and its citation line catches the light.",
  note: "Sources are cards kept together on one ring: each reference can be turned to the front.",
  scene: figureScene({
    slug: "sources",
    name: "Sources",
    component: "AI",
    object: "Index ring",
    description:
      "A metal index ring on a cast foot, threaded with six ruled cards fanned around it, one facing forward.",
    aria:
      "An isometric index ring on a small stand, with six fanned cards threaded on the metal ring and one front card.",
    faces: sourcesFaces(),
    motions: [
      {
        group: "cards",
        kind: "sway",
        period: 3800,
        amount: 2.4,
        pivot: [0, 0, 68],
      },
      { group: "cardTop", kind: "lift", period: 2800, amount: 3 },
      { group: "ring", kind: "breathe", period: 5000, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 186. Speech Input — ribbon microphone                                      */
/* -------------------------------------------------------------------------- */

function speechInputFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 6, 22, 20, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ellipse3(0, 0, 6.2, 13, 13, { fill: false, tone: "lo" }),
    post(0, 0, 6, 62, 3.4, "edge", "stand"),
    ...cylinder(0, 0, 60, 4, 7, 7, { tone: "mid", topTone: "lo" }),
  );

  /* Yoke arms cradle the head on both sides. */
  for (const side of [-1, 1]) {
    faces.push(
      tube(
        [
          [0, 0, 62],
          [side * 24, 0, 76],
          [side * 24, 0, 104],
        ],
        2.6,
        { tone: "edge", group: "head" },
      ),
      ...ball(side * 24, 0, 104, 3.6, { tone: "mid", group: "head" }),
    );
  }

  /* The rectangular ribbon head with its grille. */
  faces.push(
    ...box(-22, -11, 74, 44, 22, 58, {
      r: 4,
      lip: true,
      tone: "edge",
      group: "head",
    }),
    ...box(-16, -13, 80, 32, 4, 46, {
      r: 2,
      tone: "mid",
      group: "head",
    }),
  );
  faces.push(
    panel(-13, 13, -14.2, 84, 122, {
      tone: "lo",
      group: "head",
    }),
  );
  for (let z = 88; z <= 118; z += 5) {
    faces.push(
      stroke3(
        [
          [-12, -14.3, z],
          [12, -14.3, z],
        ],
        "lo",
        { group: "head" },
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [0, -14.4, 83],
        [0, -14.4, 123],
      ],
      "hi",
      { group: "ribbon" },
    ),
  );
  for (let z = 86; z <= 120; z += 6) {
    faces.push(
      stroke3(
        [
          [-3.2, -14.4, z],
          [3.2, -14.4, z],
        ],
        "mid",
        { group: "ribbon" },
      ),
    );
  }
  faces.push(
    ...ball(0, -14.6, 76, 2.6, { tone: "hi", group: "head" }),
  );

  /* Sound rings leaving the grille. */
  for (let ringIndex = 0; ringIndex < 3; ringIndex += 1) {
    const r = 26 + ringIndex * 9;
    const points: Point2[] = [];
    for (let index = 0; index <= 16; index += 1) {
      const a = -Math.PI * 0.36 + (index / 16) * Math.PI * 0.72;
      points.push([30 + Math.cos(a) * r, 12 - Math.sin(a) * r]);
    }
    faces.push(
      face2(points, {
        fill: false,
        tone: ringIndex === 0 ? "hi" : "lo",
        group: "sound",
      }),
    );
  }

  return faces;
}

export const speechInput: PrototypeMeta = {
  slug: "speech-input",
  name: "Speech Input",
  component: "Speech Input",
  object: "Ribbon microphone",
  story:
    "The ribbon shivers inside its grille and a ring of sound leaves the microphone.",
  note: "Speech input captures a voice: a ribbon trembling before the words become text.",
  scene: figureScene({
    slug: "speech-input",
    name: "Speech Input",
    component: "AI",
    object: "Ribbon microphone",
    description:
      "A ribbon microphone on a round stand: a rectangular grille head in a yoke, a central ribbon and three sound rings.",
    aria:
      "An isometric ribbon microphone on a stand, with a rectangular grille, a central ribbon and three sound rings.",
    faces: speechInputFaces(),
    motions: [
      { group: "ribbon", kind: "flicker", period: 620, amount: 0.12 },
      { group: "sound", kind: "breathe", period: 2200, amount: 0.06 },
      {
        group: "head",
        kind: "sway",
        period: 3600,
        amount: 1.4,
        pivot: [0, 0, 76],
      },
      { kind: "breathe", period: 6000, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 187. Stack Trace — crate stack                                             */
/* -------------------------------------------------------------------------- */

function crate(
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number,
  group: string,
): FigureFace[] {
  const faces: FigureFace[] = [];
  faces.push(
    ...box(x, y, z, w, d, h, { r: 2, lip: true, tone: "edge", group }),
  );

  const front = y + d;
  const right = x + w;
  /* Horizontal planks on the front and right faces. */
  for (const t of [0.3, 0.62]) {
    faces.push(
      stroke3(
        [
          [x + 1, front + 0.2, z + h * t],
          [right - 1, front + 0.2, z + h * t],
        ],
        "lo",
        { group },
      ),
      stroke3(
        [
          [right + 0.2, y + 1, z + h * t],
          [right + 0.2, y + d - 1, z + h * t],
        ],
        "lo",
        { group },
      ),
    );
  }
  /* Corner battens. */
  for (const bx of [x + 2, right - 6]) {
    faces.push(
      panel(bx, bx + 4, front + 0.3, z + 1, z + h - 1, {
        tone: "mid",
        group,
      }),
    );
  }
  for (const by of [y + 2, y + d - 6]) {
    faces.push(
      sidePanel(by, by + 4, right + 0.3, z + 1, z + h - 1, {
        tone: "mid",
        group,
      }),
    );
  }
  /* A diagonal brace on the front. */
  faces.push(
    stroke3(
      [
        [x + 4, front + 0.4, z + 3],
        [right - 4, front + 0.4, z + h - 3],
      ],
      "mid",
      { group },
    ),
  );
  return faces;
}

function stackTraceFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(...crate(-36, -28, 0, 72, 56, 32, "bottom"));
  faces.push(
    panel(-15, 13, 28.2, 2, 30, { tone: "lo", group: "bottom" }),
    ...digit(1, -1, 28.6, 16, 19, 23, "edge", "bottom"),
  );

  faces.push(...crate(-30, -24, 32, 64, 50, 30, "middle"));
  faces.push(
    panel(-12, 14, 26.2, 34, 60, { tone: "lo", group: "middle" }),
    ...digit(2, 1, 26.6, 47, 19, 23, "edge", "middle"),
  );

  faces.push(...crate(-25, -21, 62, 56, 44, 28, "top"));
  faces.push(
    panel(-10, 14, 23.2, 64, 88, { tone: "lo", group: "top" }),
    ...digit(3, 2, 23.6, 76, 19, 23, "hi", "top"),
  );
  faces.push(
    ...box(-8, -4, 90, 20, 16, 4, { r: 1.5, tone: "mid", group: "top" }),
    stroke3(
      [
        [-4, 12.2, 93],
        [8, 12.2, 93],
      ],
      "lo",
      { group: "top" },
    ),
  );

  /* A chalk mark and a shipping label on the lower crate. */
  faces.push(
    stroke3(
      [
        [18, 28.4, 24],
        [24, 28.4, 24],
        [22, 28.4, 21],
        [26, 28.4, 18],
      ],
      "lo",
    ),
    flatCard(-18, 0, 32.3, 16, 22, 1, { tone: "lo" }),
  );

  return faces;
}

export const stackTrace: PrototypeMeta = {
  slug: "stack-trace",
  name: "Stack Trace",
  component: "Stack Trace",
  object: "Crate stack",
  story:
    "The top crate lifts and its stencilled number catches the light above the pile.",
  note: "A stack trace is nested calls piled in order: each crate rests on the one beneath.",
  scene: figureScene({
    slug: "stack-trace",
    name: "Stack Trace",
    component: "AI",
    object: "Crate stack",
    description:
      "Three wooden crates stacked with a slight offset, each with corner battens, a brace and a stencilled number.",
    aria:
      "An isometric stack of three numbered wooden crates, the top crate lifted and its number highlighted.",
    faces: stackTraceFaces(),
    motions: [
      { group: "top", kind: "lift", period: 2800, amount: 4.6 },
      { group: "middle", kind: "sway", period: 3800, amount: 0.8 },
      { kind: "breathe", period: 6000, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 188. Suggestion — suggestion box                                           */
/* -------------------------------------------------------------------------- */

function suggestionFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Feet, body, lid and the real slot. */
  for (const [x, y] of [
    [-38, -26],
    [30, -26],
    [-38, 16],
    [30, 16],
  ] as const) {
    faces.push(...box(x, y, 0, 8, 10, 8, { r: 1.5, tone: "mid" }));
  }
  faces.push(
    ...box(-38, -26, 6, 76, 52, 44, { r: 3, lip: true }),
    ...box(-42, -30, 50, 84, 60, 7, { r: 2, tone: "mid" }),
  );
  faces.push(
    flatCard(0, 0, 57.3, 46, 11, 3, { tone: "edge" }),
    flatLine(-23, 0, 23, 0, 57.4, "hi"),
  );

  /* A folded slip of paper waiting over the slot. */
  faces.push(
    face3(
      [
        [-16, -7, 59],
        [2, -7, 82],
        [10, 2, 78],
        [-10, 2, 57],
      ],
      { tone: "mid", group: "paper" },
    ),
    face3(
      [
        [-16, -7, 59],
        [2, -7, 82],
        [4, 0, 82],
        [-15, 0, 59],
      ],
      { tone: "lo", group: "paper" },
    ),
    stroke3(
      [
        [2, -7, 82],
        [10, 2, 78],
      ],
      "hi",
      { group: "paper" },
    ),
    stroke3(
      [
        [-10, -3.5, 65],
        [-2, -3.5, 73],
      ],
      "lo",
      { group: "paper" },
    ),
  );

  /* A tall post and a pennant flying to the right of the box. */
  faces.push(
    post(46, 22, 56, 102, 2.4, "edge"),
    face3(
      [
        [46, 22, 102],
        [74, 22, 94],
        [46, 22, 84],
      ],
      { tone: "hi", group: "flag" },
    ),
    stroke3(
      [
        [52, 21.6, 96],
        [68, 21.6, 92],
      ],
      "lo",
      { group: "flag" },
    ),
    stroke3(
      [
        [46, 21.6, 100],
        [71, 21.6, 94],
      ],
      "mid",
      { group: "flag" },
    ),
    ...ball(46, 22, 102.4, 2.6, { tone: "mid" }),
  );

  /* A small engraved directive under the slot. */
  faces.push(
    stroke3(
      [
        [-18, 26.3, 42],
        [18, 26.3, 42],
      ],
      "lo",
    ),
    stroke3(
      [
        [-12, 26.3, 36],
        [12, 26.3, 36],
      ],
      "lo",
    ),
  );

  return faces;
}

export const suggestion: PrototypeMeta = {
  slug: "suggestion",
  name: "Suggestion",
  component: "Suggestion",
  object: "Suggestion box",
  story:
    "A folded slip drops through the slot and the little flag springs up on its post.",
  note: "A suggestion is offered into a box: the flag says something is waiting to be read.",
  scene: figureScene({
    slug: "suggestion",
    name: "Suggestion",
    component: "AI",
    object: "Suggestion box",
    description:
      "A wooden suggestion box on small feet, with a lid, a slot, a folded slip and a raised side flag.",
    aria:
      "An isometric suggestion box with a lid, a real slot, a folded paper slip and a raised flag.",
    faces: suggestionFaces(),
    motions: [
      { group: "paper", kind: "lift", period: 2600, amount: 3.4 },
      {
        group: "flag",
        kind: "sway",
        period: 3000,
        amount: 6,
        pivot: [46, 22, 94],
      },
      { kind: "breathe", period: 5600, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 189. Test Results — tally punch                                            */
/* -------------------------------------------------------------------------- */

function testResultsFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...box(-44, -24, 0, 88, 48, 14, { r: 3, lip: true }),
  );
  faces.push(
    ...box(-38, -18, 14, 12, 36, 58, { r: 2, tone: "edge" }),
    ...box(26, -18, 14, 12, 36, 58, { r: 2, tone: "edge" }),
    ...box(-40, -20, 72, 80, 40, 12, { r: 2, tone: "edge" }),
  );

  /* Anvil and the card threaded under the punch. */
  faces.push(
    ...box(-14, -10, 14, 28, 20, 8, { r: 2, tone: "mid" }),
    flatCard(0, 0, 22.4, 96, 32, 2, { tone: "mid", group: "card" }),
  );
  const holes: Array<[number, number]> = [
    [-34, -6],
    [-24, -6],
    [-14, -6],
    [-34, 6],
    [-24, 6],
  ];
  for (const [x, y] of holes) {
    const [hx, hy] = iso(x, y, 22.7);
    faces.push(face2(circle(hx, hy, 2.4, 12), { tone: "edge", group: "card" }));
  }
  const [nx, ny] = iso(0, 0, 22.7);
  faces.push(
    face2(circle(nx, ny, 3.6, 14), { tone: "hi", group: "card" }),
    face2(circle(nx, ny, 2.2, 12), { tone: "lo", group: "card" }),
  );

  /* Punch head with a collar and a bright tip. */
  faces.push(
    ...cylinder(0, 0, 30, 36, 5.4, 5.4, {
      tone: "edge",
      topTone: "mid",
      group: "punch",
    }),
    ...cylinder(0, 0, 27, 5, 7, 6, {
      tone: "mid",
      topTone: "lo",
      group: "punch",
    }),
    ellipse3(0, 0, 27.2, 3.6, 3.6, { tone: "hi", group: "punch" }),
  );

  /* Lever with a wooden knob. */
  faces.push(
    ...tapered([0, 0, 78], [54, 0, 96], 3, 2.2, {
      tone: "mid",
      group: "lever",
    }),
    ...ball(55, 0, 97, 5, { tone: "edge", group: "lever" }),
    ...ball(55, 0, 98.4, 2.2, { tone: "hi", group: "lever" }),
  );

  /* The chad ejected by the last strike. */
  faces.push(
    face2(circleXZ(14, -8, 26, 3.2, 16), {
      tone: "mid",
      group: "chad",
    }),
  );

  /* A row of stamps on the base. */
  for (let index = 0; index < 4; index += 1) {
    faces.push(
      stroke3(
        [
          [-34 + index * 7, 24.3, 5],
          [-30 + index * 7, 24.3, 8],
        ],
        "lo",
      ),
    );
  }

  return faces;
}

export const testResults: PrototypeMeta = {
  slug: "test-results",
  name: "Test Results",
  component: "Test Results",
  object: "Tally punch",
  story:
    "The lever comes down, the punch bites the card and a small chad jumps free.",
  note: "Test results are marks that cannot be argued with: a punch leaves a hole.",
  scene: figureScene({
    slug: "test-results",
    name: "Test Results",
    component: "Data",
    object: "Tally punch",
    description:
      "A desktop tally punch with a C-frame, a lever, a card of punched holes and one fresh bright notch.",
    aria:
      "An isometric tally punch with a C-frame, a long lever, a punched card and a small ejected chad.",
    faces: testResultsFaces(),
    motions: [
      {
        group: "lever",
        kind: "sway",
        period: 2200,
        amount: 7,
        pivot: [0, 0, 78],
      },
      { group: "punch", kind: "lift", period: 2200, amount: 1.6, phase: 0.5 },
      { group: "chad", kind: "lift", period: 2600, amount: 4 },
      { group: "card", kind: "breathe", period: 3600, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 190. Tool — lathe                                                          */
/* -------------------------------------------------------------------------- */

/** Horizontal drum along x, with the near end cap and an engraved rim. */
function drumX(
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
  } = {},
  steps = 26,
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
      face2(circleYZ(x1, cy, cz, Math.max(1, r * 0.58), 22), {
        fill: false,
        tone: "lo",
        group: opts.group,
      }),
    );
  }
  return faces;
}

function toolFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Bed and legs: the machine gives itself a footing. */
  faces.push(
    ...box(-58, -16, 0, 18, 32, 8, { r: 2, tone: "mid" }),
    ...box(44, -16, 0, 18, 32, 8, { r: 2, tone: "mid" }),
    ...box(-62, -18, 8, 124, 36, 12, { r: 3, lip: true }),
  );
  for (const x of [-48, -34, 30, 44]) {
    faces.push(
      stroke3(
        [
          [x, -18.2, 12],
          [x, -18.2, 18],
        ],
        "lo",
      ),
    );
  }

  /* Headstock and tailstock. */
  faces.push(
    ...box(-60, -16, 20, 30, 32, 46, { r: 3, lip: true }),
    ...box(30, -12, 20, 24, 24, 36, { r: 2, lip: true }),
    ...cylinder(30, 0, 42, 6, 4, 3, { tone: "mid", topTone: "lo" }),
  );

  /* The workpiece between centres. */
  faces.push(
    ...drumX(-28, 30, 0, 42, 9, {
      tone: "mid",
      topTone: "lo",
      group: "work",
    }),
  );
  for (const x of [-18, -4, 10, 22]) {
    faces.push(
      face2(circleYZ(x, 0, 42, 9, 26), {
        fill: false,
        tone: "lo",
        group: "work",
      }),
    );
  }

  /* Chuck with three jaws, on the headstock spindle. */
  faces.push(
    disc3(-28, 0, 42, 16, "yz", { tone: "edge", group: "chuck" }),
    face2(circleYZ(-27.6, 0, 42, 11, 30), {
      fill: false,
      tone: "lo",
      group: "chuck",
    }),
  );
  for (let index = 0; index < 3; index += 1) {
    const a = (index / 3) * TAU + 0.4;
    faces.push(
      face2(
        [
          iso(-28.4, Math.cos(a) * 6, 42 + Math.sin(a) * 6),
          iso(-28.4, Math.cos(a) * 14, 42 + Math.sin(a) * 14),
          iso(-28.4, Math.cos(a + 0.32) * 14, 42 + Math.sin(a + 0.32) * 14),
          iso(-28.4, Math.cos(a + 0.32) * 6, 42 + Math.sin(a + 0.32) * 6),
        ],
        { tone: "mid", group: "chuck" },
      ),
    );
  }

  /* Tool post and the cutter touching the work. */
  faces.push(
    ...box(2, 18, 20, 22, 18, 8, { r: 2, tone: "mid" }),
    ...box(8, 20, 28, 10, 10, 10, { r: 1.5, tone: "edge" }),
    ...tapered([12, 20, 36], [2, 6, 46], 3.4, 1, {
      tone: "edge",
      group: "cutter",
    }),
    ...ball(2, 6, 46.4, 1.8, { tone: "hi", group: "cutter" }),
  );

  /* A curly shaving falling from the cut. */
  const shaving: Point3[] = [];
  for (let index = 0; index <= 26; index += 1) {
    const t = index / 26;
    const a = t * Math.PI * 3.4;
    shaving.push([
      3 + Math.cos(a) * (5 + t * 6),
      8 + t * 12,
      44 - t * 26 + Math.sin(a) * 2,
    ]);
  }
  faces.push(tube(shaving, 1.2, { tone: "lo", group: "shaving" }));

  /* Handwheel on the headstock end, joined by its short axle. */
  faces.push(
    tube(
      [
        [-60, 0, 42],
        [-64, 0, 42],
      ],
      4.4,
      { tone: "mid" },
    ),
    ...ring(-64, 0, 42, 9, 2, "yz", { group: "wheel" }),
  );
  for (let index = 0; index < 4; index += 1) {
    const a = (index / 4) * TAU + 0.3;
    faces.push(
      tube(
        [
          [-64, 0, 42],
          [-64, Math.cos(a) * 8, 42 + Math.sin(a) * 8],
        ],
        1.2,
        { tone: "lo", group: "wheel" },
      ),
    );
  }

  /* Two control levers on the front of the bed. */
  faces.push(
    ...tapered([-40, 18, 20], [-36, 18, 34], 2, 1.4, {
      tone: "mid",
    }),
    ...ball(-36, 18, 35, 2.4, { tone: "mid" }),
    ...tapered([-24, 18, 20], [-22, 18, 30], 1.6, 1.2, {
      tone: "mid",
    }),
    ...ball(-22, 18, 31, 2, { tone: "mid" }),
  );

  return faces;
}

export const tool: PrototypeMeta = {
  slug: "tool",
  name: "Tool",
  component: "Tool",
  object: "Lathe",
  story:
    "The chuck turns, the cutter bites and a thin shaving curls away from the work.",
  note: "A tool can be a machine that makes other things: the lathe shapes the part by turning it.",
  scene: figureScene({
    slug: "tool",
    name: "Tool",
    component: "AI",
    object: "Lathe",
    description:
      "A metal lathe on its bed: headstock with a three-jaw chuck, workpiece between centres, tailstock, tool post and a curly shaving.",
    aria:
      "An isometric metal lathe with a bed, a three-jaw chuck, a turned workpiece, a tailstock, a cutter and a shaving.",
    faces: toolFaces(),
    motions: [
      {
        group: "chuck",
        kind: "spin",
        period: 2400,
        amount: 360,
        pivot: [-28, 0, 42],
      },
      {
        group: "wheel",
        kind: "spin",
        period: 3200,
        amount: 360,
        pivot: [-64, 0, 42],
      },
      { group: "shaving", kind: "sway", period: 2600, amount: 1.6 },
      { group: "work", kind: "breathe", period: 3600, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 191. Trace — thread spool                                                  */
/* -------------------------------------------------------------------------- */

function traceFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 5, 24, 24, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
      group: "spool",
    }),
    ...cylinder(0, 0, 5, 32, 18, 18, {
      tone: "edge",
      topTone: "lo",
      group: "spool",
    }),
    ...cylinder(0, 0, 37, 5, 24, 24, {
      tone: "edge",
      topTone: "mid",
      group: "spool",
    }),
    ellipse3(0, 0, 42.2, 6.4, 6.4, { tone: "lo", group: "spool" }),
  );

  /* Wound thread, as engraved bands around the barrel. */
  for (let z = 9; z <= 34; z += 3.6) {
    faces.push(
      ellipse3(0, 0, z, 18.4, 18.4, {
        fill: false,
        tone: "lo",
        group: "spool",
      }),
    );
  }
  faces.push(
    stroke3(
      [
        [14, -10, 34],
        [16, -8, 30],
        [17, -6, 24],
      ],
      "mid",
      { group: "spool" },
    ),
  );

  /* The thread unwinds to a needle lying beside the spool. */
  faces.push(
    tube(
      [
        [17, -8, 30],
        [30, -16, 26],
        [38, -20, 20],
        [48, -24, 14],
        [58, -26, 10],
      ],
      1.4,
      { tone: "hi", group: "thread" },
    ),
    tube(
      [
        [58, -26, 10],
        [44, -32, 16],
        [30, -30, 18],
      ],
      1.2,
      { tone: "mid", group: "thread" },
    ),
  );
  faces.push(
    ...tapered([48, -34, 6], [86, -22, 18], 2.4, 0.8, {
      tone: "edge",
      group: "needle",
    }),
    ...ball(48, -34, 6, 2.2, { tone: "mid", group: "needle" }),
  );
  faces.push(
    face2(
      ellipseRot(
        iso(58, -32, 12)[0],
        iso(58, -32, 12)[1],
        2.8,
        4.2,
        -0.4,
        16,
      ),
      { fill: false, tone: "lo", group: "needle" },
    ),
  );

  return faces;
}

export const trace: PrototypeMeta = {
  slug: "trace",
  name: "Trace",
  component: "Trace",
  object: "Thread spool",
  story:
    "The loose thread draws a bright path away from the spool and the needle holds it taut.",
  note: "A trace is one thread you can follow from end to end: the spool is the source.",
  scene: figureScene({
    slug: "trace",
    name: "Trace",
    component: "AI",
    object: "Thread spool",
    description:
      "A wooden thread spool with wound bands of thread, a loose bright thread running out to a needle.",
    aria:
      "An isometric thread spool with banded thread, a loose bright thread and a needle lying at the end.",
    faces: traceFaces(),
    motions: [
      { group: "thread", kind: "sway", period: 2800, amount: 1.8 },
      { group: "needle", kind: "breathe", period: 3200, amount: 0.012 },
      { group: "spool", kind: "breathe", period: 5200, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 192. Transcription — stenotype machine                                     */
/* -------------------------------------------------------------------------- */

function transcriptionFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...box(-44, -30, 0, 88, 60, 10, { r: 3, lip: true }),
  );

  /* The sloped key bed is a real wedge: sides, back, then the top plane. */
  faces.push(
    face3(
      [
        [-40, -26, 10],
        [-40, 26, 10],
        [-40, 26, 28],
      ],
      { tone: "edge" },
    ),
    face3(
      [
        [40, -26, 10],
        [40, 26, 10],
        [40, 26, 28],
      ],
      { tone: "mid" },
    ),
    panel(-40, 40, 26, 10, 28, { tone: "edge" }),
    face3(
      [
        [-40, -26, 10],
        [40, -26, 10],
        [40, 26, 28],
        [-40, 26, 28],
      ],
      { tone: "mid", group: "body" },
    ),
  );

  /* Two rows of round keys on the slope. */
  const slopeZ = (y: number) => 10 + ((y + 26) / 52) * 18;
  for (const y of [-14, 0, 14]) {
    for (const x of [-24, -8, 8, 24]) {
      const z = slopeZ(y) + 3.4;
      faces.push(
        ...cylinder(x, y, z - 3.4, 3.4, 4.6, 4, {
          tone: "mid",
          topTone: "lo",
          group: "keys",
        }),
      );
      faces.push(
        ellipse3(x, y, z + 0.2, 2.4, 2.4, {
          fill: false,
          tone: "lo",
          group: "keys",
        }),
      );
    }
  }

  /* A narrow paper tape rises from the back edge and curls forward. */
  faces.push(
    face3(
      [
        [-7, 26, 28],
        [7, 26, 28],
        [9, 18, 86],
        [-9, 18, 86],
      ],
      { tone: "mid", group: "tape" },
    ),
    face3(
      [
        [-7, 26, 28],
        [7, 26, 28],
        [7, 26, 34],
        [-7, 26, 34],
      ],
      { tone: "lo", group: "tape" },
    ),
    face3(
      [
        [-9, 18, 86],
        [9, 18, 86],
        [7, 14, 92],
        [-7, 14, 92],
      ],
      { tone: "lo", group: "tape" },
    ),
  );
  for (let index = 0; index < 9; index += 1) {
    const t = index / 9;
    const z = 38 + t * 46;
    const half = 4.4 - t * 0.8;
    faces.push(
      stroke3(
        [
          [-half, 26 - t * 8 - 0.2, z],
          [half, 26 - t * 8 - 0.2, z],
        ],
        index === 2 ? "hi" : "lo",
        { group: "tape" },
      ),
    );
  }

  /* Side knobs and a maker's plate on the front. */
  for (const z of [18, 26]) {
    faces.push(
      ...cylinder(46, -6, z, 5, 4.4, 4.4, {
        tone: "mid",
        topTone: "lo",
        group: "knobs",
      }),
    );
  }
  faces.push(
    panel(-20, 20, -30.2, 3, 7, { tone: "mid" }),
    stroke3(
      [
        [-14, -30.3, 5],
        [12, -30.3, 5],
      ],
      "lo",
    ),
  );

  return faces;
}

export const transcription: PrototypeMeta = {
  slug: "transcription",
  name: "Transcription",
  component: "Transcription",
  object: "Stenotype machine",
  story:
    "The keys chord together and the paper tape advances one printed line at a time.",
  note: "Transcription turns speech into a ribbon of text: a stenotype writes a chord at a time.",
  scene: figureScene({
    slug: "transcription",
    name: "Transcription",
    component: "AI",
    object: "Stenotype machine",
    description:
      "A stenotype machine: a low wedge body, rows of round keys on the slope and a paper tape rising from the back.",
    aria:
      "An isometric stenotype machine with a sloped key bed, two rows of round keys and a printed paper tape.",
    faces: transcriptionFaces(),
    motions: [
      { group: "keys", kind: "bob", period: 620, amount: 0.7 },
      { group: "tape", kind: "lift", period: 3000, amount: 2.2 },
      { group: "tape", kind: "sway", period: 3600, amount: 0.8 },
      { kind: "breathe", period: 5600, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 193. Voice Selector — tuning forks                                         */
/* -------------------------------------------------------------------------- */

function voiceSelectorFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...box(-52, -16, 0, 104, 32, 12, {
      r: 3,
      lip: true,
      tone: "edge",
    }),
  );
  for (const x of [-30, 0, 30]) {
    faces.push(
      ellipse3(x, 0, 12.2, 7, 7, { tone: "lo" }),
    );
  }

  const forks: Array<{ x: number; group: string; tone: DetailTone }> = [
    { x: -30, group: "other", tone: "edge" },
    { x: 0, group: "chosen", tone: "hi" },
    { x: 30, group: "other", tone: "edge" },
  ];
  for (const fork of forks) {
    const x = fork.x;
    faces.push(
      tube(
        [
          [x, 0, 12],
          [x, 0, 38],
        ],
        4,
        { tone: fork.tone === "hi" ? "hi" : "edge", group: fork.group },
      ),
      ...cylinder(x, 0, 34, 5, 5.4, 5, {
        tone: "mid",
        topTone: "lo",
        group: fork.group,
      }),
      tube(
        [
          [x - 9, 0, 92],
          [x - 9, 0, 52],
          [x - 6, 0, 44],
          [x, 0, 42],
          [x + 6, 0, 44],
          [x + 9, 0, 52],
          [x + 9, 0, 92],
        ],
        3.2,
        { tone: fork.tone === "hi" ? "hi" : "edge", group: fork.group },
      ),
      ...ball(x, 0, 43.4, 3, { tone: "mid", group: fork.group }),
      ...ball(x - 9, 0, 92.4, 2.2, { tone: "mid", group: fork.group }),
      ...ball(x + 9, 0, 92.4, 2.2, { tone: "mid", group: fork.group }),
    );
  }

  /* The chosen fork rings: three short arcs leave its tines. */
  for (let ringIndex = 0; ringIndex < 3; ringIndex += 1) {
    const r = 16 + ringIndex * 7;
    const points: Point2[] = [];
    for (let index = 0; index <= 14; index += 1) {
      const a = -Math.PI * 0.34 + (index / 14) * Math.PI * 0.68;
      points.push([18 + Math.cos(a) * r, -78 + Math.sin(a) * r]);
    }
    faces.push(
      face2(points, {
        fill: false,
        tone: ringIndex === 0 ? "hi" : "lo",
        group: "sound",
      }),
    );
  }

  return faces;
}

export const voiceSelector: PrototypeMeta = {
  slug: "voice-selector",
  name: "Voice Selector",
  component: "Voice Selector",
  object: "Tuning forks",
  story:
    "The chosen fork keeps ringing while its neighbours fall silent and the sound rings fade.",
  note: "Voices are fixed resonances: choosing one is picking the fork that rings.",
  scene: figureScene({
    slug: "voice-selector",
    name: "Voice Selector",
    component: "AI",
    object: "Tuning forks",
    description:
      "Three tuning forks standing in a wooden block, the middle one bright and ringing with three sound arcs.",
    aria:
      "An isometric rack of three tuning forks, the middle fork highlighted and ringing with three sound arcs.",
    faces: voiceSelectorFaces(),
    motions: [
      { group: "chosen", kind: "flicker", period: 700, amount: 0.1 },
      { group: "other", kind: "breathe", period: 4200, amount: 0.008 },
      { group: "sound", kind: "breathe", period: 2100, amount: 0.06 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 194-195. Cake and coffee — the two study drawings become numbered objects  */
/* -------------------------------------------------------------------------- */

export const cake = cakeStudy;
export const coffeeCup = coffeeCupStudy;

/* -------------------------------------------------------------------------- */
/* 196. Bread — scored loaf                                                   */
/* -------------------------------------------------------------------------- */

function breadFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Two stacked rounded loaves give the bread its shoulder and its low dome. */
  faces.push(
    ...prism(roundedRect(-53, -32, 106, 64, 32, 10), 0, 15, {
      lip: true,
      topTone: "mid",
    }),
    ...prism(roundedRect(-47, -29, 94, 58, 29, 10), 15, 16, {
      lip: true,
      topTone: "mid",
    }),
  );
  faces.push(
    ellipse3(0, 0, 31.2, 42, 25, { fill: false, tone: "lo", group: "loaf" }),
    ellipse3(0, 0, 24.2, 48, 30, { fill: false, tone: "lo", group: "loaf" }),
  );

  /* Three curved scores across the flat top, the middle one bright. */
  const scores: Array<Point3[]> = [
    [
      [-32, -22, 31.4],
      [-26, -2, 31.5],
      [-19, 18, 31.4],
    ],
    [
      [-8, -24, 31.5],
      [-2, -3, 31.6],
      [5, 18, 31.5],
    ],
    [
      [16, -22, 31.4],
      [22, -2, 31.5],
      [29, 18, 31.4],
    ],
  ];
  scores.forEach((points, index) => {
    faces.push(
      stroke3(points, index === 1 ? "hi" : "mid", { group: "scores" }),
      stroke3(
        points.map(([x, y, z]) => [x + 2.4, y + 2.4, z + 0.3] as Point3),
        "lo",
        { group: "scores" },
      ),
    );
  });

  /* A crust seam and a dusting of flour. */
  faces.push(
    stroke3(
      [
        [-38, -30, 18],
        [-20, -31, 18.4],
        [0, -31.5, 18.6],
        [20, -31, 18.4],
        [38, -30, 18],
      ],
      "lo",
      { group: "loaf" },
    ),
  );
  for (const [x, y] of [
    [-40, 8],
    [-26, 20],
    [-6, 22],
    [12, 18],
    [30, 10],
    [40, -4],
    [-16, -10],
    [4, 2],
  ] as const) {
    faces.push(dotAt(x, y, 31.6, 1.1, "lo", "loaf"));
  }

  return faces;
}

export const bread: PrototypeMeta = {
  slug: "bread",
  name: "Bread",
  component: "Bread",
  object: "Scored loaf",
  story:
    "The loaf swells and its three scored slashes open under the heat.",
  note: "A generic object: a scored loaf drawn as a loaf, domed and dusted, not as a rounded tile.",
  scene: figureScene({
    slug: "bread",
    name: "Bread",
    component: "Objects",
    object: "Scored loaf",
    description:
      "A domed scored loaf with three diagonal slashes and a dusting of flour on its crust.",
    aria:
      "An isometric domed bread loaf with three diagonal scored slashes and flour dust.",
    faces: breadFaces(),
    motions: [
      { kind: "breathe", period: 5200, amount: 0.008 },
      { group: "scores", kind: "breathe", period: 5200, amount: 0.026 },
      { group: "loaf", kind: "breathe", period: 6400, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 197. Plant — potted plant                                                  */
/* -------------------------------------------------------------------------- */

function plantFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 30, 17, 25, {
      tone: "edge",
      bottomArc: true,
      topTone: "lo",
      hollow: 3,
    }),
    ...cylinder(0, 0, 30, 7, 28, 27, {
      tone: "mid",
      topTone: "lo",
    }),
    ellipse3(0, 0, 37.2, 23, 23, { tone: "lo" }),
  );

  const stems: Array<{
    x: number;
    y: number;
    z: number;
    length: number;
    width: number;
    group: string;
  }> = [
    { x: -38, y: -14, z: 76, length: 40, width: 22, group: "leaves" },
    { x: 34, y: -18, z: 70, length: 38, width: 21, group: "leaves" },
    { x: -22, y: 24, z: 88, length: 42, width: 24, group: "leaves" },
    { x: 20, y: 28, z: 80, length: 36, width: 20, group: "leaves" },
    { x: -10, y: -34, z: 62, length: 34, width: 19, group: "leaves" },
    { x: 6, y: 6, z: 100, length: 40, width: 23, group: "leaves" },
    { x: 26, y: 2, z: 108, length: 34, width: 20, group: "newLeaf" },
  ];

  for (const stem of stems) {
    faces.push(
      tube(
        [
          [0, 0, 36],
          [stem.x * 0.45, stem.y * 0.45, stem.z * 0.72],
          [stem.x, stem.y, stem.z],
        ],
        1.6,
        { tone: "mid", group: "plant" },
      ),
    );
    const [ex, ey] = iso(stem.x, stem.y, stem.z);
    const [bx, by] = iso(0, 0, 36);
    const angle = Math.atan2(ey - by, ex - bx);
    faces.push(
      ...leaf(ex, ey, stem.length, stem.width, angle, {
        tone: stem.group === "newLeaf" ? "mid" : "mid",
        group: stem.group,
      }),
    );
  }

  /* The newest leaf is still curled, with a bright midrib. */
  const [nx, ny] = iso(26, 2, 108);
  faces.push(
    stroke2(
      [
        [nx - 14, ny + 2],
        [nx + 14, ny - 8],
      ],
      "hi",
      { group: "newLeaf" },
    ),
    face2(
      [
        [nx + 10, ny - 8],
        [nx + 16, ny - 14],
        [nx + 13, ny - 2],
      ],
      { tone: "lo", group: "newLeaf" },
    ),
  );

  /* A tiny stake and string in the soil. */
  faces.push(
    tube(
      [
        [-30, 20, 36],
        [-30, 20, 52],
      ],
      1.4,
      { tone: "lo" },
    ),
    stroke3(
      [
        [-30, 20, 48],
        [-20, 16, 50],
      ],
      "lo",
    ),
  );

  return faces;
}

export const plant: PrototypeMeta = {
  slug: "plant",
  name: "Plant",
  component: "Plant",
  object: "Potted plant",
  story:
    "The leaves spread a little wider and the newest curled leaf unrolls toward the light.",
  note: "A generic object: growth held in a pot, with one leaf still opening.",
  scene: figureScene({
    slug: "plant",
    name: "Plant",
    component: "Objects",
    object: "Potted plant",
    description:
      "A potted plant in a terracotta pot: seven stems with pointed leaves, one curled new leaf and a small stake.",
    aria:
      "An isometric potted plant in a terracotta pot, with spreading leaves, one curled new leaf and a small stake.",
    faces: plantFaces(),
    motions: [
      { group: "plant", kind: "sway", period: 4200, amount: 1.8 },
      { group: "leaves", kind: "breathe", period: 5000, amount: 0.012 },
      { group: "newLeaf", kind: "lift", period: 3400, amount: 2.6 },
      { kind: "breathe", period: 6200, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 198. Rocket — rocket on a launch pad                                       */
/* -------------------------------------------------------------------------- */

function rocketFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The launch mount is a tripod ring around the base of the rocket. */
  const ringZ = 24;
  for (let index = 0; index < 3; index += 1) {
    const a = -Math.PI / 2 + (index / 3) * TAU;
    const x = Math.cos(a) * 20;
    const y = Math.sin(a) * 20;
    faces.push(
      tube(
        [
          [x, y, ringZ],
          [x * 1.7, y * 1.7, 0],
        ],
        2.4,
        { tone: "edge" },
      ),
      ...ball(x * 1.7, y * 1.7, 1.6, 3.4, { tone: "mid" }),
    );
  }
  faces.push(
    ellipse3(0, 0, ringZ, 17, 17, { fill: false, tone: "mid" }),
  );

  /* Three fins, painted back to front around the body. */
  const finAngles = [0.4, 2.6, 4.6];
  const fins = finAngles
    .map((angle) => ({ angle, score: Math.cos(angle) + Math.sin(angle) }))
    .sort((a, b) => a.score - b.score);
  const drawFin = (angle: number) => {
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);
    faces.push(
      face3(
        [
          [ca * 12, sa * 12, 56],
          [ca * 12, sa * 12, 24],
          [ca * 33, sa * 33, 18],
        ],
        { tone: "mid" },
      ),
      stroke3(
        [
          [ca * 12, sa * 12, 28],
          [ca * 30, sa * 30, 20],
        ],
        "lo",
      ),
    );
  };
  for (const fin of fins) {
    if (fin.score <= 0.1) drawFin(fin.angle);
  }

  /* Body, nozzle, bands and nose. */
  faces.push(
    ...cylinder(0, 0, 24, 96, 14, 14, {
      tone: "edge",
      topTone: "mid",
      group: "rocket",
    }),
    ...cylinder(0, 0, 20, 6, 13, 8, {
      tone: "mid",
      topTone: "lo",
      group: "rocket",
    }),
    ...cylinder(0, 0, 120, 28, 14, 0, {
      tone: "edge",
      topTone: "hi",
      group: "rocket",
    }),
    ellipse3(0, 0, 44, 14.2, 14.2, {
      fill: false,
      tone: "lo",
      group: "rocket",
    }),
    ellipse3(0, 0, 104, 14.2, 14.2, {
      fill: false,
      tone: "lo",
      group: "rocket",
    }),
    ellipse3(0, 0, 108, 14.2, 14.2, {
      fill: false,
      tone: "hi",
      group: "rocket",
    }),
  );

  for (const fin of fins) {
    if (fin.score > 0.1) drawFin(fin.angle);
  }

  /* Porthole on the front of the body. */
  const [px, py] = iso(0, 14.4, 92);
  faces.push(
    face2(circle(px, py, 7.4, 28), { tone: "edge", group: "rocket" }),
    face2(circle(px, py, 5.4, 24), { tone: "lo", group: "rocket" }),
    face2(circle(px + 2, py - 2, 1.8, 12), {
      tone: "hi",
      group: "rocket",
    }),
  );

  /* Flame and its hot core, hanging below the nozzle. */
  const [fx, fy] = iso(0, 0, 20);
  faces.push(
    face2(
      [
        [fx - 10, fy + 2],
        [fx - 5, fy + 24],
        [fx, fy + 46],
        [fx + 5, fy + 24],
        [fx + 10, fy + 2],
        [fx + 4, fy + 8],
        [fx, fy + 4],
        [fx - 4, fy + 8],
      ],
      { tone: "hi", group: "flame" },
    ),
    face2(
      [
        [fx - 5, fy + 4],
        [fx, fy + 30],
        [fx + 5, fy + 4],
        [fx, fy + 10],
      ],
      { tone: "lo", group: "flame" },
    ),
  );

  return faces;
}

export const rocket: PrototypeMeta = {
  slug: "rocket",
  name: "Rocket",
  component: "Rocket",
  object: "Rocket on a launch pad",
  story:
    "The flame lengthens against the mount and the whole rocket strains upward.",
  note: "A generic object: ambition as a rocket held on its pad, flame already lit.",
  scene: figureScene({
    slug: "rocket",
    name: "Rocket",
    component: "Objects",
    object: "Rocket on a launch pad",
    description:
      "A finned rocket on a tripod launch mount, with a bright porthole, a nose cone and a long flame.",
    aria:
      "An isometric rocket on a tripod launch mount, with fins, a bright porthole, a nose cone and a long flame.",
    faces: rocketFaces(),
    motions: [
      { group: "rocket", kind: "lift", period: 3000, amount: 2.6 },
      { group: "flame", kind: "flicker", period: 420, amount: 0.22 },
      { kind: "breathe", period: 5200, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 199. Gift — wrapped gift with a bow                                        */
/* -------------------------------------------------------------------------- */

function giftFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...box(-38, -28, 0, 76, 56, 52, { r: 3, lip: true }),
    ...box(-42, -32, 52, 84, 64, 8, { r: 2, tone: "mid", group: "lid" }),
  );

  /* Crossed ribbon, on the box and over the lid. */
  faces.push(
    panel(-5, 5, 28.2, 0, 60, { tone: "mid", group: "ribbon" }),
    panel(-38, 38, 28.2, 27, 35, { tone: "mid", group: "ribbon" }),
    sidePanel(-4, 4, 38.2, 0, 60, { tone: "mid", group: "ribbon" }),
    flatCard(0, 0, 60.3, 10, 64, 0, { tone: "mid", group: "ribbon" }),
    flatCard(0, 0, 60.4, 84, 10, 0, { tone: "mid", group: "ribbon" }),
    stroke3(
      [
        [-38, 28.4, 27],
        [38, 28.4, 27],
      ],
      "hi",
      { group: "ribbon" },
    ),
    stroke3(
      [
        [4.6, 28.4, 0],
        [4.6, 28.4, 60],
      ],
      "hi",
      { group: "ribbon" },
    ),
  );

  /* Bow: two loops, a knot, two tails and a tag. */
  const [cx, cy] = iso(0, 0, 64);
  faces.push(
    face2(ellipseRot(cx - 13, cy - 2, 18, 9, -0.5, 28), {
      tone: "mid",
      group: "bow",
    }),
    face2(ellipseRot(cx + 13, cy - 2, 18, 9, 0.5, 28), {
      tone: "mid",
      group: "bow",
    }),
    face2(ellipseRot(cx - 13, cy - 2, 10, 4.6, -0.5, 22), {
      fill: false,
      tone: "lo",
      group: "bow",
    }),
    face2(ellipseRot(cx + 13, cy - 2, 10, 4.6, 0.5, 22), {
      fill: false,
      tone: "lo",
      group: "bow",
    }),
    ...ball(0, 0, 68, 7, { tone: "edge", group: "bow" }),
    face2(circle(cx, cy - 3.5, 2.4, 14), { tone: "hi", group: "bow" }),
    stroke2(
      [
        [cx - 4, cy + 4],
        [cx - 18, cy + 24],
        [cx - 14, cy + 36],
      ],
      "mid",
      { group: "bow" },
    ),
    stroke2(
      [
        [cx + 4, cy + 4],
        [cx + 18, cy + 24],
        [cx + 14, cy + 36],
      ],
      "mid",
      { group: "bow" },
    ),
  );

  /* The gift tag swings from the knot. */
  faces.push(
    stroke2(
      [
        [cx + 5, cy + 6],
        [cx + 20, cy + 27],
      ],
      "lo",
      { group: "tag" },
    ),
    face2(
      [
        [cx + 14, cy + 27],
        [cx + 29, cy + 33],
        [cx + 25, cy + 45],
        [cx + 11, cy + 39],
      ],
      { tone: "mid", group: "tag" },
    ),
    stroke2(
      [
        [cx + 17, cy + 33],
        [cx + 25, cy + 36],
      ],
      "lo",
      { group: "tag" },
    ),
    face2(circle(cx + 16, cy + 29, 1.6, 10), {
      tone: "hi",
      group: "tag",
    }),
  );

  /* A few printed dots on the wrapping. */
  for (const [x, z] of [
    [-24, 14],
    [-18, 20],
    [20, 10],
    [26, 16],
    [12, 44],
    [-12, 46],
  ] as const) {
    faces.push(
      dotAt(x, 28.4, z, 1.3, "lo", "ribbon"),
    );
  }

  return faces;
}

export const gift: PrototypeMeta = {
  slug: "gift",
  name: "Gift",
  component: "Gift",
  object: "Wrapped gift with a bow",
  story:
    "The bow tightens, the lid lifts a fraction and the tag swings from the knot.",
  note: "A generic object: a wrapped gift, readable by its crossed ribbon and bow.",
  scene: figureScene({
    slug: "gift",
    name: "Gift",
    component: "Objects",
    object: "Wrapped gift with a bow",
    description:
      "A wrapped gift with crossed ribbon, a two-loop bow, trailing tails and a swinging tag.",
    aria:
      "An isometric wrapped gift with crossed ribbon, a two-loop bow, ribbon tails and a swinging tag.",
    faces: giftFaces(),
    motions: [
      { group: "bow", kind: "breathe", period: 3200, amount: 0.024 },
      { group: "lid", kind: "lift", period: 3800, amount: 1.6 },
      {
        group: "tag",
        kind: "sway",
        period: 3400,
        amount: 4,
        pivot: [0, 0, 68],
      },
      { group: "ribbon", kind: "breathe", period: 5600, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 200. Key — key with a bit                                                  */
/* -------------------------------------------------------------------------- */

function keyFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Bow, shaft, collar and bit; the key rests on its ring and its teeth. */
  faces.push(
    ...ring(-46, 0, 24, 17, 2.8, "xz", { tone: "edge", group: "key" }),
    face2(circleXZ(-46, 0, 24, 12, 30), {
      fill: false,
      tone: "lo",
      group: "key",
    }),
  );
  faces.push(
    tube(
      [
        [-30, 0, 26],
        [42, 0, 50],
      ],
      6.4,
      { tone: "edge", group: "key" },
    ),
    ...cylinder(-20, 0, 27.6, 5, 6.4, 6.4, {
      tone: "mid",
      topTone: "lo",
      group: "key",
    }),
  );

  /* The bit is a flat plate with two teeth; paint its back and its face. */
  const bit: Point2[] = [
    [34, 50],
    [48, 50],
    [48, 20],
    [44, 20],
    [44, 34],
    [38, 34],
    [38, 20],
    [34, 20],
  ];
  faces.push(
    face3(
      bit.map(([x, z]) => [x, 3.4, z] as Point3),
      { tone: "mid", group: "key" },
    ),
    face3(
      bit.map(([x, z]) => [x, -3.4, z] as Point3),
      { tone: "edge", group: "key" },
    ),
    sidePanel(20, 50, 34, 50, 50, { fill: false, tone: "lo", group: "key" }),
  );
  /* Thickness rim around the bit. */
  for (let index = 0; index < bit.length; index += 1) {
    const a = bit[index];
    const b = bit[(index + 1) % bit.length];
    faces.push(
      quad(
        [a[0], -3.4, a[1]],
        [b[0], -3.4, b[1]],
        [b[0], 3.4, b[1]],
        [a[0], 3.4, a[1]],
        { tone: "lo", group: "key" },
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [40, -3.6, 46],
        [46, -3.6, 46],
      ],
      "hi",
      { group: "shine" },
    ),
  );

  return faces;
}

export const key: PrototypeMeta = {
  slug: "key",
  name: "Key",
  component: "Key",
  object: "Key with a bit",
  story:
    "The key turns a quarter on its ring and the cut teeth catch the light.",
  note: "A generic object: access as a small metal key, ring, shaft and teeth.",
  scene: figureScene({
    slug: "key",
    name: "Key",
    component: "Objects",
    object: "Key with a bit",
    description:
      "A large key standing on its bow: an open ring, a long shaft, a collar and a two-toothed bit.",
    aria:
      "An isometric key with an open ring bow, a long shaft, a collar and a two-toothed bit.",
    faces: keyFaces(),
    motions: [
      {
        group: "key",
        kind: "sway",
        period: 3200,
        amount: 3.2,
        pivot: [-46, 0, 24],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                  */
/* -------------------------------------------------------------------------- */

export const lot8Prototypes: PrototypeMeta[] = [
  motionHighlight,
  openInChat,
  packageInfo,
  persona,
  pin3d,
  plan,
  prose,
  queue,
  sandboxRun,
  sources,
  speechInput,
  stackTrace,
  suggestion,
  testResults,
  tool,
  trace,
  transcription,
  voiceSelector,
  cake,
  coffeeCup,
  bread,
  plant,
  rocket,
  gift,
  key,
];

export const lot8BySlug = new Map(
  lot8Prototypes.map((item) => [item.slug, item]),
);
