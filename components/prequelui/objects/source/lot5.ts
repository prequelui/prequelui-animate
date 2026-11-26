/*
 * Linear v4 — lot 5 (components 101 to 125 of the object catalogue).
 *
 * Same rules as lots 1-4: one real-world object per component, authored from
 * scratch in the shared 2:1 axonometric space, no slab under the object and a
 * silhouette that still reads at 64 px. Faces are painted back to front and
 * filled with the plate tone, so a nearer face hides the construction behind
 * it while the 0.9 px outline stays clean.
 *
 * The 25 objects here are all new: none repeats an object from lots 1-4, from
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
  byDepth,
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
  ring,
  roundedRect,
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

/** Small bright dot on a horizontal plane. */
function flatDot(
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
function sheet(
  a: Point3,
  b: Point3,
  c: Point3,
  d: Point3,
  opts: FaceOptions = {},
): FigureFace {
  return face3([a, b, c, d], opts);
}

/* -------------------------------------------------------------------------- */
/* 101. Confirmation — wax seal press                                         */
/* -------------------------------------------------------------------------- */

function confirmationFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Press bed and the upright frame that holds the die. */
  faces.push(
    ...cylinder(0, 0, 0, 6, 34, 31, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ...box(-30, -22, 6, 60, 44, 5, { r: 5, tone: "mid", topTone: "lo" }),
    ...box(-26, 14, 6, 12, 8, 62, { r: 2.4, tone: "edge", topTone: "mid" }),
    ...box(14, 14, 6, 12, 8, 62, { r: 2.4, tone: "edge", topTone: "mid" }),
    ...box(-30, 12, 64, 60, 12, 9, { r: 3, tone: "edge", topTone: "mid" }),
  );

  /* Lever arm: a long diagonal handle with a wooden grip. */
  faces.push(
    face3(
      [
        [-26, 18, 68],
        [30, 18, 68],
        [30, 18, 76],
        [-26, 18, 76],
      ],
      { tone: "mid", group: "lever" },
    ),
    tube(
      [
        [-26, 18, 73],
        [-46, 18, 84],
      ],
      4.4,
      { tone: "edge", group: "lever" },
    ),
    tube(
      [
        [-46, 18, 84],
        [-56, 18, 90],
      ],
      6.4,
      { tone: "mid", group: "lever" },
    ),
  );

  /* Guide rod, cross head, and the die that stamps the wax. */
  faces.push(
    post(0, 18, 16, 66, 7.2, "mid", "press"),
    ...box(-13, 10, 19, 26, 16, 8, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "press",
    }),
    ...box(-9, 14, 13, 18, 10, 6, {
      r: 1.4,
      tone: "mid",
      topTone: "lo",
      group: "press",
    }),
  );

  /* The wax puddle and its pressed crest, the one bright element. */
  faces.push(
    face2(
      ellipse2(
        iso(0, -2, 7)[0],
        iso(0, -2, 7)[1],
        21,
        15,
        34,
      ),
      { tone: "mid", group: "seal" },
    ),
    face2(circleXZ(0, -2, 12.2, 10.4, 26), {
      tone: "hi",
      group: "seal",
    }),
    face2(circleXZ(0, -2, 12.6, 5.8, 20), {
      fill: false,
      tone: "lo",
      group: "seal",
    }),
    stroke3(
      [
        [0, -2, 12.8],
        [3.5, -2, 16.5],
        [0, -2, 20],
        [-3.5, -2, 16.5],
      ],
      "hi",
      { closed: true, group: "seal" },
    ),
  );

  /* A spare wax stick lying on the bed. */
  faces.push(
    ...cylinder(-20, -12, 11, 5, 4.6, 4.6, {
      tone: "mid",
      topTone: "lo",
    }),
    tube(
      [
        [-25.6, -12, 13.5],
        [-8, -12, 13.5],
      ],
      5.2,
      { tone: "mid" },
    ),
  );

  return faces;
}

export const confirmation: PrototypeMeta = {
  slug: "confirmation",
  name: "Confirmation",
  component: "Confirmation",
  object: "Wax seal press",
  story:
    "The lever gives, the die comes down and a bright crest is pressed into the warm wax.",
  note: "A confirmation fixes a decision the way a seal fixes wax: once pressed, it holds.",
  scene: figureScene({
    slug: "confirmation",
    name: "Confirmation",
    component: "Feedback",
    object: "Wax seal press",
    description:
      "A desktop wax seal press: a round foot, a two-post frame, a lever arm, a guide rod with a die and a pressed wax crest.",
    aria:
      "An isometric wax seal press on a round foot, with two posts, a lever arm, a die above a bright pressed wax seal and a spare stick of wax.",
    faces: confirmationFaces(),
    motions: [
      { group: "press", kind: "lift", period: 2400, amount: -5.5 },
      { group: "lever", kind: "sway", period: 2400, amount: 0.05, pivot: [0, 18, 72] },
      { group: "seal", kind: "breathe", period: 3200, amount: 0.01 },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 102. Credit Card — card imprinter                                          */
/* -------------------------------------------------------------------------- */

function creditCardFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Imprinter bed with its two rails and a raised card plate. */
  faces.push(
    ...box(-52, -34, 0, 104, 68, 10, {
      r: 5,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-48, -30, 10, 96, 8, 5, { r: 2, tone: "mid", topTone: "lo" }),
    ...box(-48, 22, 10, 96, 8, 5, { r: 2, tone: "mid", topTone: "lo" }),
  );

  /* The embossed plate under the carriage. */
  faces.push(
    ...box(-30, -13, 10, 60, 26, 3, {
      r: 2,
      tone: "mid",
      topTone: "lo",
    }),
    flatLine(-22, -4, 22, -4, 13.4, "mid"),
    flatLine(-22, 2, 14, 2, 13.4, "lo"),
    flatLine(-22, 8, 18, 8, 13.4, "lo"),
    flatDot(24, -4, 13.6, 2.6, "hi"),
  );

  /* Carriage straddling the rails, with a knurled roller and a crank. */
  faces.push(
    ...box(-18, -28, 10, 36, 56, 12, {
      r: 3,
      tone: "edge",
      topTone: "mid",
      group: "carriage",
    }),
    ...cylinder(0, 0, 22, 8, 12, 12, {
      tone: "edge",
      topTone: "mid",
      group: "roller",
    }),
    face2(circleYZ(-6.5, 0, 26, 9.4, 28), {
      tone: "mid",
      group: "roller",
    }),
    face2(circleYZ(-6.7, 0, 26, 4.6, 20), {
      fill: false,
      tone: "lo",
      group: "roller",
    }),
    tube(
      [
        [18, 0, 26],
        [34, 0, 26],
      ],
      3,
      { tone: "mid", group: "carriage" },
    ),
    tube(
      [
        [34, 0, 26],
        [34, 0, 41],
      ],
      3.4,
      { tone: "edge", group: "carriage" },
    ),
    ...cylinder(34, 0, 41, 7, 5.4, 4.8, {
      tone: "mid",
      topTone: "lo",
      group: "carriage",
    }),
  );
  for (const y of [-21, -12, 12, 21]) {
    faces.push(
      tube(
        [
          [-14, y, 16],
          [14, y, 16],
        ],
        1.2,
        { tone: "lo", group: "carriage" },
      ),
    );
  }

  /* Fresh printed slip folding over the front edge, with a bright line. */
  faces.push(
    sheet(
      [-24, 30, 12],
      [24, 30, 12],
      [23, 40, 15],
      [-23, 40, 15],
      { tone: "edge", group: "slip" },
    ),
    sheet(
      [-23, 40, 15],
      [23, 40, 15],
      [21, 48, 4],
      [-21, 48, 4],
      { tone: "edge", group: "slip" },
    ),
    stroke3(
      [
        [-18, 40, 15.4],
        [18, 40, 15.4],
      ],
      "mid",
      { group: "slip" },
    ),
    stroke3(
      [
        [-17, 45, 10],
        [17, 45, 10],
      ],
      "hi",
      { group: "slip" },
    ),
    stroke3(
      [
        [-17, 46.4, 7.6],
        [6, 46.4, 7.6],
      ],
      "lo",
      { group: "slip" },
    ),
  );

  return faces;
}

export const creditCard: PrototypeMeta = {
  slug: "credit-card",
  name: "Credit Card",
  component: "Credit Card",
  object: "Card imprinter",
  story:
    "The carriage rolls across the embossed plate and a fresh slip feeds out of the slot.",
  note: "A card is a physical record: the imprinter copies its raised numbers onto paper.",
  scene: figureScene({
    slug: "credit-card",
    name: "Credit Card",
    component: "Layout",
    object: "Card imprinter",
    description:
      "A manual card imprinter: a heavy bed with two rails, an embossed plate, a sliding carriage with a roller and crank, and a fresh slip coming out.",
    aria:
      "An isometric card imprinter with two rails, an embossed plate, a sliding carriage with a roller and crank, and a bright printed slip curling from the front.",
    faces: creditCardFaces(),
    motions: [
      { group: "carriage", kind: "sway", period: 3200, amount: 0.028, pivot: [0, 0, 16] },
      { group: "roller", kind: "spin", period: 2400, amount: 360 },
      { group: "slip", kind: "bob", period: 3200, amount: 1.2 },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 103. Date Input — date stamp                                               */
/* -------------------------------------------------------------------------- */

function dateInputFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const bodyZ = 20;

  /* Two side cheeks holding the date band, and the base of the stamp. */
  faces.push(
    ...box(-34, -20, 0, 68, 40, bodyZ, {
      r: 4,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-30, -16, bodyZ, 10, 32, 16, {
      r: 2,
      tone: "mid",
      topTone: "lo",
    }),
    ...box(20, -16, bodyZ, 10, 32, 16, {
      r: 2,
      tone: "mid",
      topTone: "lo",
    }),
  );

  /* The rotating band of dates between the cheeks. */
  faces.push(
    ...cylinder(0, 0, bodyZ + 2, 12, 15.6, 15.6, {
      tone: "edge",
      topTone: "mid",
      group: "band",
      sides: 34,
    }),
  );
  for (const x of [-10, 0, 10]) {
    faces.push(
      face3(
        [
          [x - 3.6, 15.7, bodyZ + 5],
          [x + 3.6, 15.7, bodyZ + 5],
          [x + 3.6, 15.7, bodyZ + 10],
          [x - 3.6, 15.7, bodyZ + 10],
        ],
        { tone: "mid", group: "band" },
      ),
      stroke3(
        [
          [x - 2, 15.9, bodyZ + 7.5],
          [x + 2, 15.9, bodyZ + 7.5],
        ],
        "lo",
        { group: "band" },
      ),
    );
  }
  for (const a of [-0.9, -0.45, 0.45, 0.9]) {
    const x = Math.cos(a) * 15.3;
    const y = Math.sin(a) * 15.3;
    faces.push(
      stroke3(
        [
          [x, y, bodyZ + 4],
          [x, y, bodyZ + 20],
        ],
        "lo",
        { group: "band" },
      ),
    );
  }

  /* Stem and the arched handle. */
  faces.push(
    ...box(-6, -6, bodyZ + 16, 12, 12, 5, {
      r: 2,
      tone: "mid",
      topTone: "lo",
    }),
    tube(
      [
        [-9, 0, bodyZ + 21],
        [-9, 0, bodyZ + 36],
      ],
      4.6,
      { tone: "edge" },
    ),
    tube(
      [
        [9, 0, bodyZ + 21],
        [9, 0, bodyZ + 36],
      ],
      4.6,
      { tone: "edge" },
    ),
    tube(
      [
        [-9, 0, bodyZ + 36],
        [-5, 0, bodyZ + 41],
        [5, 0, bodyZ + 41],
        [9, 0, bodyZ + 36],
      ],
      5.6,
      { tone: "edge" },
    ),
    tube(
      [
        [-5, 0, bodyZ + 42],
        [5, 0, bodyZ + 42],
      ],
      6.2,
      { tone: "mid" },
    ),
  );

  /* A fresh print on a paper slip in front of the stamp, the bright accent. */
  faces.push(
    flatCard(0, 30, 0.5, 48, 18, 1.6, { tone: "hi", group: "print" }),
    stroke3(
      [
        [-16, 26, 0.9],
        [2, 26, 0.9],
      ],
      "hi",
      { group: "print" },
    ),
    stroke3(
      [
        [-16, 30, 0.9],
        [12, 30, 0.9],
      ],
      "hi",
      { group: "print" },
    ),
    stroke3(
      [
        [-16, 34, 0.9],
        [-4, 34, 0.9],
      ],
      "mid",
      { group: "print" },
    ),
  );

  return faces;
}

export const dateInput: PrototypeMeta = {
  slug: "date-input",
  name: "Date Input",
  component: "Date Input",
  object: "Date stamp",
  story:
    "The date band clicks forward one day and the frame inks a fresh date on the paper.",
  note: "A date input is set by turning a band, then committed with a stamp.",
  scene: figureScene({
    slug: "date-input",
    name: "Date Input",
    component: "Inputs",
    object: "Date stamp",
    description:
      "A rubber date stamp: a square base, two cheeks holding a rotating date band, an arched handle and a freshly inked date.",
    aria:
      "An isometric date stamp with two side cheeks, a rotating band of dates, an arched handle and a bright inked date on the paper below.",
    faces: dateInputFaces(),
    motions: [
      { group: "band", kind: "spin", period: 3600, amount: 38 },
      { group: "print", kind: "breathe", period: 3000, amount: 0.012 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 104. Context — lever-arch file                                             */
/* -------------------------------------------------------------------------- */

function contextFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const z0 = 0;
  const z1 = 86;

  /* Back board, spine and the page block standing on the board's own edge. */
  faces.push(
    panel(-44, 44, -4, z0, z1, { tone: "lo" }),
    sidePanel(-4, 16, -44, z0, z1, { tone: "edge" }),
    ...box(-38, -2, 2, 74, 12, 80, {
      r: 1.6,
      tone: "mid",
      topTone: "lo",
    }),
  );

  /* The lever mechanism and the two arch rings. */
  for (const z of [24, 62]) {
    faces.push(
      ...ring(0, 3, z, 10, 2.4, "yz", { tone: "edge", group: "rings" }),
    );
  }
  faces.push(
    tube(
      [
        [0, 3, 98],
        [0, 3, 80],
      ],
      2.4,
      { tone: "mid", group: "rings" },
    ),
    ...box(-9, 4, 96, 18, 8, 5, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "lever",
    }),
    tube(
      [
        [0, 4, 101],
        [0, 6, 114],
        [14, 6, 120],
      ],
      3.4,
      { tone: "edge", group: "lever" },
    ),
    tube(
      [
        [14, 6, 120],
        [21, 6, 120],
      ],
      6,
      { tone: "hi", group: "lever" },
    ),
  );

  /* Front cover, standing slightly open on the spine. */
  faces.push(
    face3(
      [
        [-44, 16, 0],
        [44, 16, 0],
        [44, 25, 82],
        [-44, 25, 82],
      ],
      { tone: "edge", group: "cover" },
    ),
    face3(
      [
        [-40, 17, 4],
        [40, 17, 4],
        [40, 23.6, 78],
        [-40, 23.6, 78],
      ],
      { fill: false, tone: "lo", group: "cover" },
    ),
  );
  for (const z of [14, 31, 48, 65]) {
    faces.push(
      stroke3(
        [
          [-35, 21, z],
          [35, 21, z],
        ],
        "lo",
        { group: "cover" },
      ),
    );
  }

  /* A title label and the finger hole on the spine. */
  faces.push(
    face3(
      [
        [-30, 25.3, 52],
        [2, 25.3, 52],
        [2, 25.3, 64],
        [-30, 25.3, 64],
      ],
      { tone: "mid", group: "cover" },
    ),
    face2(
      circleYZ(-44.4, 6, 50, 5.6, 22),
      { tone: "lo" },
    ),
  );

  return faces;
}

export const context: PrototypeMeta = {
  slug: "context",
  name: "Context",
  component: "Context",
  object: "Lever-arch file",
  story:
    "The rings open, the front board swings back and the whole dossier lifts into view.",
  note: "Context is everything relevant held in one binder, opened on demand.",
  scene: figureScene({
    slug: "context",
    name: "Context",
    component: "AI",
    object: "Lever-arch file",
    description:
      "A lever-arch file standing on its board: a spine with two arch rings, a curved lever handle and a front cover with a title label.",
    aria:
      "An isometric lever-arch file with two metal rings, a bright lever handle, a labelled front cover and a page block inside.",
    faces: contextFaces(),
    motions: [
      { group: "cover", kind: "sway", period: 3400, amount: 0.045, pivot: [-44, 16, 0] },
      { group: "rings", kind: "breathe", period: 3400, amount: 0.012 },
      { group: "lever", kind: "sway", period: 3400, amount: 0.08, pivot: [0, 4, 100] },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 105. Data List — punch-card spindle                                        */
/* -------------------------------------------------------------------------- */

function dataListFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const spikeTop = 116;

  /* Weighted foot and the spike. */
  faces.push(
    ...cylinder(0, 0, 0, 5, 30, 27, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ...cylinder(0, 0, 5, 5, 14, 10, {
      tone: "mid",
      topTone: "lo",
    }),
    post(0, 0, 10, spikeTop, 3.4, "edge"),
    ...cylinder(0, 0, spikeTop, 6, 2.6, 0, {
      tone: "mid",
      topTone: "mid",
    }),
  );

  /* A stack of punched cards, each a thin tilted sheet on the spike. */
  const card = (
    z: number,
    rot: number,
    group: string,
    tone: DetailTone,
    bright = false,
  ) => {
    const points: Point3[] = [
      [-26, -18, 0],
      [26, -18, 0],
      [26, 18, 0],
      [-26, 18, 0],
    ];
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);
    const mapped = points.map(([x, y]) => {
      const rx = x * cos - y * sin;
      const ry = x * sin + y * cos;
      const lift = 2.2 * Math.sin((rx / 26) * 1.4) + 1.6;
      return [rx, ry, z + lift] as Point3;
    });
    faces.push(face3(mapped, { tone, group }));
    /* Punched holes along both long edges. */
    for (let column = 0; column < 6; column += 1) {
      const x = -20 + column * 8;
      for (const y of [-13, 13]) {
        const rx = x * cos - y * sin;
        const ry = x * sin + y * cos;
        const zz = z + 2.2 * Math.sin((rx / 26) * 1.4) + 1.8;
        const [px, py] = iso(rx, ry, zz);
        faces.push(
          face2(circle(px, py, 1.25, 8), {
            tone: bright ? "hi" : "lo",
            group,
          }),
        );
      }
    }
  };

  card(14, 0.02, "card-1", "mid");
  card(22, -0.05, "card-2", "mid");
  card(30, 0.04, "card-3", "edge");
  card(38, -0.02, "card-4", "edge", true);

  /* The top card is lifted and turned, with a bright printed band. */
  faces.push(
    face3(
      [
        [-21, -14, 43.4],
        [21, -14, 43.4],
        [21, 14, 43.4],
        [-21, 14, 43.4],
      ],
      { fill: false, tone: "hi", group: "card-4" },
    ),
  );

  return faces;
}

export const dataList: PrototypeMeta = {
  slug: "data-list",
  name: "Data List",
  component: "Data List",
  object: "Punch-card spindle",
  story:
    "One card slides down the spike and the whole stack settles back into line.",
  note: "A data list keeps many small records in order on one thin file.",
  scene: figureScene({
    slug: "data-list",
    name: "Data List",
    component: "Data",
    object: "Punch-card spindle",
    description:
      "A weighted spindle holding a stack of punched cards, each with two rows of holes, the top card lifted and edged in the bright tone.",
    aria:
      "An isometric punch-card spindle on a round weighted foot, threaded with four punched cards, the top card bright along its edge.",
    faces: dataListFaces(),
    motions: [
      { group: "card-4", kind: "bob", period: 2800, amount: 3.2 },
      { group: "card-3", kind: "bob", period: 2800, amount: 1.6, phase: 0.12 },
      { group: "card-2", kind: "bob", period: 2800, amount: 0.8, phase: 0.24 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 106. Data Table — fanfold printout                                         */
/* -------------------------------------------------------------------------- */

function dataTableFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const panels = 5;
  const width = 96;
  const step = 23;
  const rise = 21;

  /* A continuous accordion sheet: each panel is a sloped rectangular face
     that shares its far edge with the next fold. */
  for (let index = 0; index < panels; index += 1) {
    const x0 = -width / 2;
    const x1 = width / 2;
    const y0 = -48 + index * step;
    const y1 = y0 + step;
    const z0 = index % 2 === 0 ? 0 : rise;
    const z1 = index % 2 === 0 ? rise : 0;
    faces.push(
      sheet(
        [x0, y0, z0],
        [x1, y0, z0],
        [x1, y1, z1],
        [x0, y1, z1],
        { tone: index === panels - 1 ? "edge" : "mid" },
      ),
    );
    /* Ruled rows across each panel. */
    for (let row = 1; row < 5; row += 1) {
      const t = row / 5;
      faces.push(
        stroke3(
          [
            [x0 + 5, y0 + step * t, z0 + (z1 - z0) * t],
            [x1 - 5, y0 + step * t, z0 + (z1 - z0) * t],
          ],
          index === panels - 1 && row === 2 ? "hi" : "lo",
        ),
      );
    }
    /* Tractor-feed holes down both edges. */
    for (let row = 0; row < 6; row += 1) {
      const t = (row + 0.5) / 6;
      const y = y0 + step * t;
      const z = z0 + (z1 - z0) * t;
      for (const x of [x0 + 3.5, x1 - 3.5]) {
        const [px, py] = iso(x, y, z);
        faces.push(face2(circle(px, py, 1.2, 8), { tone: "lo" }));
      }
    }
    /* The fold at the far edge of the panel. */
    faces.push(
      tube(
        [
          [x0, y1, z1],
          [x1, y1, z1],
        ],
        1.6,
        { tone: "mid" },
      ),
    );
  }

  return faces;
}

export const dataTable: PrototypeMeta = {
  slug: "data-table",
  name: "Data Table",
  component: "Data Table",
  object: "Fanfold printout",
  story:
    "One fold opens and the printed rows spill onto the next panel of paper.",
  note: "A data table is a long sheet folded to fit the desk: rows continue past the fold.",
  scene: figureScene({
    slug: "data-table",
    name: "Data Table",
    component: "Data",
    object: "Fanfold printout",
    description:
      "A continuous fanfold printout folded into an accordion of five panels, with ruled rows, tractor-feed holes and one bright row.",
    aria:
      "An isometric fanfold printout of five accordion panels with ruled rows, perforated tractor holes and one bright row.",
    faces: dataTableFaces(),
    motions: [
      { kind: "breathe", period: 3800, amount: 0.008 },
    ],
    press: 0.8,
  }),
};

/* -------------------------------------------------------------------------- */
/* 107. Editable — chalkboard and eraser                                      */
/* -------------------------------------------------------------------------- */

function editableFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Feet, legs and the tray: a small slate on a stand, no slab. */
  for (const x of [-38, 32] as const) {
    faces.push(
      ...box(x, -4, 0, 10, 12, 4, { r: 2, tone: "edge", topTone: "mid" }),
      ...box(x + 2, -2, 4, 6, 8, 30, { r: 1.6, tone: "mid", topTone: "lo" }),
    );
  }
  faces.push(
    ...box(-46, 7, 26, 92, 9, 4, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );

  /* The framed slate. */
  faces.push(
    panel(-45, 45, -4, 32, 124, { tone: "edge" }),
    panel(-39, 39, -3.6, 38, 118, { tone: "mid" }),
  );
  for (const [x0, x1, z0, z1] of [
    [-39, 39, 38, 40],
    [-39, 39, 116, 118],
    [-39, -37, 40, 116],
    [37, 39, 40, 116],
  ] as const) {
    faces.push(
      face3(
        [
          [x0, -3.3, z0],
          [x1, -3.3, z0],
          [x1, -3.3, z1],
          [x0, -3.3, z1],
        ],
        { tone: "lo" },
      ),
    );
  }

  /* Two lines of chalk writing, the newest one bright. */
  faces.push(
    stroke3(
      [
        [-28, -3, 96],
        [-18, -3, 102],
        [-8, -3, 94],
        [2, -3, 101],
        [12, -3, 95],
      ],
      "mid",
      { group: "chalk" },
    ),
    stroke3(
      [
        [-28, -3, 76],
        [-20, -3, 82],
        [-10, -3, 75],
        [-2, -3, 81],
        [8, -3, 76],
        [18, -3, 82],
        [26, -3, 76],
      ],
      "hi",
      { group: "chalk" },
    ),
    stroke3(
      [
        [-28, -3, 58],
        [-12, -3, 58],
      ],
      "lo",
      { group: "chalk" },
    ),
  );

  /* Chalk stick and the felt eraser waiting on the tray. */
  faces.push(
    ...cylinder(22, 10, 30, 4, 3.4, 3.4, {
      tone: "mid",
      topTone: "lo",
    }),
    tube(
      [
        [17, 10, 32],
        [30, 10, 32],
      ],
      4,
      { tone: "mid" },
    ),
    ...box(-8, 8, 30, 22, 10, 8, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "eraser",
    }),
    face3(
      [
        [-6, 13.3, 33],
        [12, 13.3, 33],
        [12, 13.3, 36],
        [-6, 13.3, 36],
      ],
      { tone: "hi", group: "eraser" },
    ),
  );

  /* Chalk dust falling from the eraser, in two small clusters. */
  for (const [x, z] of [
    [0, 26],
    [6, 23],
    [12, 25],
    [4, 18],
  ] as const) {
    const [px, py] = iso(x, 12, z);
    faces.push(face2(circle(px, py, 1.2, 8), { tone: "lo", group: "dust" }));
  }

  return faces;
}

export const editable: PrototypeMeta = {
  slug: "editable",
  name: "Editable",
  component: "Editable",
  object: "Chalkboard and eraser",
  story:
    "The eraser lifts off the tray, wipes the bright line away and a little chalk dust falls.",
  note: "An editable surface takes marks and gives them back: writing as something you can rub out.",
  scene: figureScene({
    slug: "editable",
    name: "Editable",
    component: "Inputs",
    object: "Chalkboard and eraser",
    description:
      "A framed chalkboard on a small stand with a tray, two chalk lines, a chalk stick and a felt eraser with falling dust.",
    aria:
      "An isometric framed chalkboard on a stand, with two lines of chalk, a chalk stick and a felt eraser on the tray with dust falling.",
    faces: editableFaces(),
    motions: [
      { group: "eraser", kind: "lift", period: 3000, amount: 4 },
      { group: "eraser", kind: "sway", period: 3000, amount: 0.05, pivot: [0, 12, 30] },
      { group: "dust", kind: "bob", period: 1800, amount: 2.4 },
      { group: "chalk", kind: "breathe", period: 4200, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 108. Field — seedbed with a label stake                                    */
/* -------------------------------------------------------------------------- */

function fieldFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* A prepared ridge of soil, drawn as the object's own body. */
  faces.push(
    ...(() => {
      const footprint = roundedRect(-56, -16, 112, 32, 5, 3);
      const bottom = footprint.map(([x, y]) => iso(x, y, 0));
      const top = footprint.map(([x, y]) => iso(x, y, 10));
      const facesOut: FigureFace[] = [];
      const sides = footprint.map(([x, y], index) => {
        const next = footprint[(index + 1) % footprint.length];
        return {
          x,
          y,
          next,
          depth: (x + next[0] + y + next[1]) / 2,
        };
      });
      sides
        .filter((side) => side.next[1] - side.y - (side.next[0] - side.x) > 0.0001)
        .sort(byDepth)
        .forEach((side) => {
          facesOut.push(
            face3(
              [
                [side.x, side.y, 0],
                [side.next[0], side.next[1], 0],
                [side.next[0], side.next[1], 12],
                [side.x, side.y, 12],
              ],
              { tone: "edge", stroke: false },
            ),
          );
        });
      facesOut.push(face2(top, { tone: "mid" }));
      facesOut.push(
        face2(convexHull([...bottom, ...top]), {
          fill: false,
          tone: "edge",
        }),
      );
      return facesOut;
    })(),
  );

  /* Furrows and small clods on the ridge. */
  for (const y of [-9, 0, 9]) {
    faces.push(
      stroke3(
        [
          [-50, y, 10.2],
          [50, y, 10.2],
        ],
        "lo",
      ),
    );
  }
  for (const [x, y, r] of [
    [-38, 6, 1.8],
    [-22, -8, 1.4],
    [-2, 7, 1.6],
    [16, -6, 1.5],
    [38, 5, 1.3],
  ] as const) {
    const [px, py] = iso(x, y, 10.8);
    faces.push(face2(circle(px, py, r, 10), { tone: "mid" }));
  }

  /* Young shoots: short stems with a pair of leaves. */
  for (const [x, y, h] of [
    [-40, -3, 14],
    [-26, 4, 18],
    [-6, -4, 17],
    [12, 4, 16],
    [24, -3, 13],
  ] as const) {
    faces.push(
      tube(
        [
          [x, y, 10],
          [x, y, 10 + h],
        ],
        1.3,
        { tone: "mid" },
      ),
      face3(
        [
          [x, y, 10 + h * 0.6],
          [x - 7, y, 10 + h * 0.86],
          [x, y, 10 + h],
        ],
        { tone: "mid" },
      ),
      face3(
        [
          [x, y, 10 + h * 0.72],
          [x + 7, y, 10 + h * 0.96],
          [x, y, 10 + h * 1.1],
        ],
        { tone: "lo" },
      ),
    );
  }

  /* A small garden label on a short stake: a place that names what grows. */
  faces.push(
    post(38, 0, 10, 64, 2.6, "edge", "stake"),
    face3(
      [
        [38, 1, 66],
        [55, 1, 63],
        [56, 1, 54],
        [38, 1, 51],
      ],
      { tone: "hi", group: "tag" },
    ),
    face2(
      (() => {
        const [px, py] = iso(41, 1.3, 61);
        return circle(px, py, 1.4, 10);
      })(),
      { fill: false, tone: "lo", group: "tag" },
    ),
    stroke3(
      [
        [43, 1.4, 58],
        [52, 1.4, 56.4],
      ],
      "mid",
      { group: "tag" },
    ),
  );

  return faces;
}

export const field: PrototypeMeta = {
  slug: "field",
  name: "Field",
  component: "Field",
  object: "Seedbed with a label stake",
  story:
    "The stake straightens and its bright tag turns its face to the reader.",
  note: "A field is a prepared place with a name on it: somewhere a value is meant to grow.",
  scene: figureScene({
    slug: "field",
    name: "Field",
    component: "Inputs",
    object: "Seedbed with a label stake",
    description:
      "A prepared ridge of soil with three furrows, two young shoots and a wooden stake carrying a bright label tag.",
    aria:
      "An isometric seedbed ridge with furrows, two young shoots and a bright label tag on a wooden stake.",
    faces: fieldFaces(),
    motions: [
      { group: "stake", kind: "sway", period: 3600, amount: 0.022, pivot: [38, 0, 10] },
      { group: "tag", kind: "sway", period: 3600, amount: 0.09, pivot: [38, 1, 58] },
      { kind: "breathe", period: 5200, amount: 0.003 },
    ],
    press: 0.9,
  }),
};

/* -------------------------------------------------------------------------- */
/* 109. Input Group — power strip with plugs                                  */
/* -------------------------------------------------------------------------- */

function inputGroupFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The strip body and its rubber feet. */
  for (const [x, y] of [
    [-44, -8],
    [34, -8],
    [-44, 8],
    [34, 8],
  ] as const) {
    faces.push(
      ...cylinder(x, y, 0, 3, 5, 4.6, { tone: "mid", topTone: "lo" }),
    );
  }
  faces.push(
    ...box(-50, -13, 3, 100, 26, 10, {
      r: 5,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );

  /* Three socket wells with their slots. */
  for (const x of [-28, 0, 28]) {
    faces.push(
      flatCard(x, 0, 13.3, 22, 15, 2.5, { tone: "mid" }),
      flatCard(x, 0, 13.6, 18, 11, 2, { tone: "lo" }),
      flatLine(x - 5, -2, x - 5, 2, 13.9, "mid"),
      flatLine(x + 5, -2, x + 5, 2, 13.9, "mid"),
    );
  }
  /* Rocker switch and bright indicator at the far end. */
  faces.push(
    ...box(40, -5, 13, 8, 11, 3, {
      r: 1.4,
      tone: "mid",
      topTone: "lo",
      group: "switch",
    }),
    flatDot(40, 4, 16.4, 1.6, "hi", "switch"),
  );

  /* One seated plug with its cable arching away. */
  faces.push(
    ...box(-11, -8, 13, 22, 16, 9, {
      r: 3,
      tone: "edge",
      topTone: "mid",
      group: "plug",
    }),
    ...box(-7, -5, 22, 14, 10, 4, {
      r: 2,
      tone: "mid",
      topTone: "lo",
      group: "plug",
    }),
    tube(
      [
        [0, 0, 26],
        [0, -2, 34],
        [8, -6, 40],
        [26, -8, 38],
        [38, -8, 28],
      ],
      2.4,
      { tone: "edge", group: "plug" },
    ),
    face3(
      [
        [-10, 8.4, 16],
        [10, 8.4, 16],
        [10, 8.4, 20],
        [-10, 8.4, 20],
      ],
      { tone: "hi", group: "plug" },
    ),
  );

  /* A second plug resting beside the strip: the group is plural. */
  faces.push(
    ...box(-66, -6, 3, 18, 13, 8, {
      r: 2.6,
      tone: "mid",
      topTone: "lo",
    }),
    tube(
      [
        [-66, 0, 7],
        [-76, 6, 6],
        [-84, 16, 9],
      ],
      2.2,
      { tone: "mid" },
    ),
  );

  /* Main cable leaving the far end of the strip. */
  faces.push(
    tube(
      [
        [-50, 0, 8],
        [-62, 4, 6],
        [-72, 14, 8],
        [-82, 24, 7],
      ],
      2.8,
      { tone: "edge" },
    ),
  );

  return faces;
}

export const inputGroup: PrototypeMeta = {
  slug: "input-group",
  name: "Input Group",
  component: "Input Group",
  object: "Power strip with plugs",
  story:
    "The plug seats itself in a socket and the strip's indicator lights up.",
  note: "One rail feeds several inputs: related controls sharing a single body.",
  scene: figureScene({
    slug: "input-group",
    name: "Input Group",
    component: "Inputs",
    object: "Power strip with plugs",
    description:
      "A power strip on four rubber feet with three socket wells, a rocker switch, a bright indicator and two plugs with cables.",
    aria:
      "An isometric power strip with three sockets, a seated plug and a loose plug, a bright indicator light and two cables.",
    faces: inputGroupFaces(),
    motions: [
      { group: "plug", kind: "lift", period: 3000, amount: -1.6 },
      { group: "switch", kind: "breathe", period: 2600, amount: 0.02 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 110. Number Input — rotary telephone dial                                  */
/* -------------------------------------------------------------------------- */

function numberInputFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const cz = 58;
  const R = 44;

  /* A small bracket holds the dial like a wheel on an axle. */
  faces.push(
    ...box(-20, -18, 0, 40, 12, 4, { r: 2, tone: "edge", topTone: "mid" }),
    post(-16, -12, 4, 38, 4.2, "mid"),
    post(16, -12, 4, 38, 4.2, "mid"),
    tube(
      [
        [-16, -12, 38],
        [0, -12, cz],
        [16, -12, 38],
      ],
      4.2,
      { tone: "mid" },
    ),
    tube(
      [
        [0, -22, cz],
        [0, 14, cz],
      ],
      4.6,
      { tone: "mid" },
    ),
  );

  /* Outer dial ring and the inner rotating plate. */
  faces.push(
    ...ring(0, 0, cz, R - 5, 5, "xz", { tone: "edge" }),
    face2(circleXZ(0, -1, cz, R - 10, 48), { tone: "mid", group: "dial" }),
  );

  /* Ten finger holes around the rotating plate. */
  for (let index = 0; index < 10; index += 1) {
    const a = -Math.PI / 2 + (index / 10) * TAU;
    const hx = Math.cos(a) * 26;
    const hz = cz + Math.sin(a) * 26;
    const [px, py] = iso(hx, 0, hz);
    faces.push(
      face2(circle(px, py, 4.2, 16), {
        fill: false,
        tone: "lo",
        group: "dial",
      }),
    );
    const nx = Math.cos(a + Math.PI / 10) * 33;
    const nz = cz + Math.sin(a + Math.PI / 10) * 33;
    faces.push(
      stroke3(
        [
          [Math.cos(a + Math.PI / 10) * 31, 0.4, cz + Math.sin(a + Math.PI / 10) * 31],
          [nx, 0.4, nz],
        ],
        "mid",
        { group: "dial" },
      ),
    );
  }

  /* Center cap and finger stop, the bright index. */
  faces.push(
    face2(circleXZ(0, 0.6, cz, 9, 24), { tone: "mid" }),
    face2(circleXZ(0, 0.8, cz, 4, 16), { tone: "hi", group: "dial" }),
    tube(
      [
        [16, 1, cz - 31],
        [23, 1, cz - 39],
      ],
      5.2,
      { tone: "edge" },
    ),
    face2(
      (() => {
        const [px, py] = iso(23, 1.4, cz - 39);
        return circle(px, py, 3.4, 14);
      })(),
      { tone: "hi" },
    ),
  );

  return faces;
}

export const numberInput: PrototypeMeta = {
  slug: "number-input",
  name: "Number Input",
  component: "Number Input",
  object: "Rotary telephone dial",
  story:
    "The dial turns to a number, holds at the finger stop, then springs back to rest.",
  note: "A number is entered one digit at a time by turning a mechanical dial.",
  scene: figureScene({
    slug: "number-input",
    name: "Number Input",
    component: "Inputs",
    object: "Rotary telephone dial",
    description:
      "A rotary telephone dial mounted in a small bracket: an outer ring, ten finger holes, a bright center and a finger stop.",
    aria:
      "An isometric rotary telephone dial on an axle and bracket, with ten numbered finger holes, a bright center and a finger stop.",
    faces: numberInputFaces(),
    motions: [
      { group: "dial", kind: "spin", period: 3800, amount: 42 },
      { group: "dial", kind: "breathe", period: 5200, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 111. Password Input — safe with a dial                                     */
/* -------------------------------------------------------------------------- */

function passwordInputFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Feet and the heavy body. */
  for (const [x, y] of [
    [-34, -26],
    [22, -26],
    [-34, 22],
    [22, 22],
  ] as const) {
    faces.push(
      ...cylinder(x, y, 0, 4, 6, 5.4, { tone: "mid", topTone: "lo" }),
    );
  }
  faces.push(
    ...box(-38, -30, 4, 64, 60, 58, {
      r: 3,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );

  /* Hinges on the left edge, bolts around the door. */
  for (const z of [16, 44]) {
    faces.push(
      ...cylinder(-38, -32, z, 8, 3.6, 3.6, {
        tone: "mid",
        topTone: "lo",
      }),
    );
  }

  /* The door, a thick plate on the front face. */
  faces.push(
    sidePanel(-27, 27, 26.2, 6, 60, { tone: "edge", group: "door" }),
    sidePanel(-22, 22, 26.6, 10, 56, { tone: "mid", group: "door" }),
  );
  for (const [y, z] of [
    [-20, 14],
    [20, 14],
    [-20, 52],
    [20, 52],
  ] as const) {
    faces.push(
      face2(circleYZ(26.9, y, z, 2.8, 14), {
        tone: "lo",
        group: "door",
      }),
    );
  }

  /* Combination dial with graduations and a bright hub. */
  const cz = 34;
  faces.push(
    face2(circleYZ(27.1, 0, cz, 14, 36), {
      tone: "mid",
      group: "dial",
    }),
    face2(circleYZ(27.4, 0, cz, 11, 32), {
      tone: "lo",
      group: "dial",
    }),
  );
  for (let index = 0; index < 24; index += 1) {
    const a = (index / 24) * TAU;
    const r0 = index % 4 === 0 ? 7.4 : 8.8;
    faces.push(
      stroke3(
        [
          [27.7, Math.cos(a) * r0, cz + Math.sin(a) * r0],
          [27.7, Math.cos(a) * 10.6, cz + Math.sin(a) * 10.6],
        ],
        index % 4 === 0 ? "mid" : "lo",
        { group: "dial" },
      ),
    );
  }
  faces.push(
    face2(circleYZ(27.8, 0, cz, 3.6, 18), { tone: "hi", group: "dial" }),
    stroke3(
      [
        [28, 0, cz + 10.8],
        [28, 0, cz + 13.6],
      ],
      "hi",
      { group: "dial" },
    ),
  );

  /* Lever handle below the dial. */
  faces.push(
    tube(
      [
        [28, -17, 62],
        [28, 17, 62],
      ],
      4.4,
      { tone: "edge", group: "door" },
    ),
    tube(
      [
        [28, -13, 56],
        [28, -13, 62],
      ],
      3.2,
      { tone: "mid", group: "door" },
    ),
    tube(
      [
        [28, 13, 56],
        [28, 13, 62],
      ],
      3.2,
      { tone: "mid", group: "door" },
    ),
  );

  /* A slip of paper with the combination tucked at the base. */
  faces.push(
    sheet(
      [-18, 40, 4],
      [16, 40, 4],
      [18, 52, 12],
      [-16, 52, 12],
      { tone: "lo", group: "code" },
    ),
    stroke3(
      [
        [-12, 44, 8],
        [8, 44, 8],
      ],
      "hi",
      { group: "code" },
    ),
  );

  return faces;
}

export const passwordInput: PrototypeMeta = {
  slug: "password-input",
  name: "Password Input",
  component: "Password Input",
  object: "Safe with a dial",
  story:
    "The combination dial clicks around and the heavy door eases open a crack.",
  note: "A password guards what is inside: access is a lock you have to work.",
  scene: figureScene({
    slug: "password-input",
    name: "Password Input",
    component: "Inputs",
    object: "Safe with a dial",
    description:
      "A steel safe on four feet, with a bolted door, a graduated combination dial with a bright hub, hinges and a lever handle.",
    aria:
      "An isometric steel safe on four feet with a bolted door, a combination dial and bright hub, hinges and a lever handle.",
    faces: passwordInputFaces(),
    motions: [
      { group: "dial", kind: "spin", period: 3600, amount: 58 },
      { group: "door", kind: "sway", period: 3600, amount: 0.03, pivot: [-38, -30, 34] },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 112. Tags Input — price-tag rail                                           */
/* -------------------------------------------------------------------------- */

function tagsInputFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Two uprights and the long chrome rail. */
  for (const x of [-46, 46] as const) {
    faces.push(
      ...cylinder(x, 0, 0, 4, 10, 9, {
        tone: "edge",
        topTone: "mid",
        bottomArc: true,
      }),
      ...cylinder(x, 0, 4, 60, 3.4, 3, {
        tone: "mid",
        topTone: "lo",
      }),
      ...cylinder(x, 0, 58, 5, 5, 4.6, {
        tone: "mid",
        topTone: "mid",
      }),
    );
  }
  faces.push(
    tube(
      [
        [-50, 0, 64],
        [50, 0, 64],
      ],
      5,
      { tone: "edge" },
    ),
  );

  /* Hanging tags on short strings, each a little different. */
  const tag = (
    x: number,
    y: number,
    z: number,
    angle: number,
    group: string,
    tone: DetailTone,
    accent = false,
  ) => {
    const w = 13;
    const h = 24;
    const points: Point3[] = [
      [x - w, y, z - h + 5],
      [x - w + 3, y, z - h],
      [x + w - 3, y, z - h],
      [x + w, y, z - h + 5],
      [x + w - 2, y, z],
      [x, y, z + 3],
      [x - w + 2, y, z],
    ];
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const rotated = points.map(([px, py, pz]) => {
      const dx = px - x;
      const dz = pz - (z - h / 2);
      return [x + dx * cos - dz * sin, py, z - h / 2 + dx * sin + dz * cos] as Point3;
    });
    faces.push(
      stroke3(
        [
          [x, y, z + 3],
          [x, y, 64],
        ],
        "lo",
        { group },
      ),
      face3(rotated, { tone, group }),
      stroke3(
        [
          [x - 6, y + 0.2, z - 12],
          [x + 5, y + 0.2, z - 12],
        ],
        accent ? "hi" : "lo",
        { group },
      ),
      stroke3(
        [
          [x - 6, y + 0.2, z - 8],
          [x + 2, y + 0.2, z - 8],
        ],
        "lo",
        { group },
      ),
      face2(
        (() => {
          const [px, py] = iso(x, y + 0.3, z + 1);
          return circle(px, py, 1.6, 10);
        })(),
        { fill: false, tone: "mid", group },
      ),
    );
  };

  tag(-34, 1, 52, 0.04, "tag-a", "mid");
  tag(-9, 7, 48, -0.06, "tag-b", "edge", true);
  tag(16, 1, 53, 0.03, "tag-c", "mid");
  tag(37, 4, 49, -0.04, "tag-d", "lo");

  /* A price dot on the bright tag. */
  faces.push(flatDot(-4, 7.4, 38, 2.2, "hi", "tag-b"));

  return faces;
}

export const tagsInput: PrototypeMeta = {
  slug: "tags-input",
  name: "Tags Input",
  component: "Tags Input",
  object: "Price-tag rail",
  story:
    "One tag slides along the rail, swings on its string, and settles with its bright price showing.",
  note: "Tags are small labels added and removed one by one on a shared rail.",
  scene: figureScene({
    slug: "tags-input",
    name: "Tags Input",
    component: "Inputs",
    object: "Price-tag rail",
    description:
      "A chrome price-tag rail on two uprights, hung with four small paper tags, one pulled forward with a bright price line.",
    aria:
      "An isometric price-tag rail on two posts with four hanging tags, the front tag bright with a price mark.",
    faces: tagsInputFaces(),
    motions: [
      { group: "tag-b", kind: "sway", period: 2800, amount: 0.12, pivot: [-9, 7, 55] },
      { group: "tag-b", kind: "bob", period: 2800, amount: 1.8 },
      { group: "tag-c", kind: "sway", period: 3300, amount: 0.05, pivot: [16, 1, 56] },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 113. Segment Group — rotary selector turret                                */
/* -------------------------------------------------------------------------- */

function segmentGroupFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Notched base plate with engraved segment marks. */
  faces.push(
    ...cylinder(0, 0, 0, 4, 34, 32, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
  );
  for (let index = 0; index < 12; index += 1) {
    const a = (index / 12) * TAU;
    const inner = index % 3 === 0 ? 24 : 27;
    faces.push(
      stroke3(
        [
          [Math.cos(a) * inner, Math.sin(a) * inner, 4.3],
          [Math.cos(a) * 31, Math.sin(a) * 31, 4.3],
        ],
        index % 3 === 0 ? "mid" : "lo",
      ),
    );
    if (index % 3 === 0) {
      faces.push(
        ...cylinder(
          Math.cos(a) * 31,
          Math.sin(a) * 31,
          4,
          2,
          2.4,
          2,
          { tone: "lo", topTone: "lo" },
        ),
      );
    }
  }

  /* The stepped turret, free to click between detents. */
  faces.push(
    ...cylinder(0, 0, 4, 12, 25, 24, {
      tone: "edge",
      topTone: "mid",
      group: "turret",
    }),
    ...cylinder(0, 0, 16, 10, 20, 19, {
      tone: "mid",
      topTone: "lo",
      group: "turret",
    }),
    ...cylinder(0, 0, 26, 5, 17, 16, {
      tone: "edge",
      topTone: "mid",
      group: "turret",
    }),
  );
  for (let index = 0; index < 26; index += 1) {
    const a = (index / 26) * TAU;
    faces.push(
      stroke3(
        [
          [Math.cos(a) * 24.2, Math.sin(a) * 24.2, 5],
          [Math.cos(a) * 24.2, Math.sin(a) * 24.2, 15.5],
        ],
        "lo",
        { group: "turret" },
      ),
    );
  }

  /* Selector blade with a bright knob, reaching past the notched plate. */
  faces.push(
    tube(
      [
        [0, 0, 32],
        [34, 0, 32],
      ],
      5.4,
      { tone: "hi", group: "turret" },
    ),
    ...cylinder(36, 0, 32, 5, 4.8, 4, {
      tone: "hi",
      topTone: "mid",
      group: "turret",
    }),
    face2(circleXZ(34.4, 0, 33.4, 2.2, 12), {
      tone: "hi",
      group: "turret",
    }),
    face2(circleXZ(0, 0, 31.4, 5.6, 20), {
      tone: "mid",
      group: "turret",
    }),
    face2(circleXZ(0, 0, 31.8, 2, 14), {
      tone: "hi",
      group: "turret",
    }),
  );

  /* Detent ball seated in the front notch. */
  const [bx, by] = iso(0, 30, 5);
  faces.push(
    face2(circle(bx, by, 3.2, 16), { tone: "mid" }),
    face2(circle(bx, by + 1, 1.4, 10), { tone: "hi" }),
  );

  return faces;
}

export const segmentGroup: PrototypeMeta = {
  slug: "segment-group",
  name: "Segment Group",
  component: "Segment Group",
  object: "Rotary selector turret",
  story:
    "The turret clicks round one detent and its bright blade settles over the next segment.",
  note: "A segment group is a fixed set of choices: one position, clicked into place.",
  scene: figureScene({
    slug: "segment-group",
    name: "Segment Group",
    component: "Controls",
    object: "Rotary selector turret",
    description:
      "A notched selector plate with twelve segment marks, a stepped turret with a knurled collar and a bright selector blade.",
    aria:
      "An isometric rotary selector turret on a notched plate, with segment marks, a stepped knurled body and a bright blade.",
    faces: segmentGroupFaces(),
    motions: [
      {
        group: "turret",
        kind: "sway",
        period: 3200,
        amount: 0.22,
        pivot: [0, 0, 4],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 114. Native Select — slide rule                                            */
/* -------------------------------------------------------------------------- */

function nativeSelectFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The fixed stock and the sliding tongue. */
  faces.push(
    ...box(-64, -14, 0, 128, 28, 4, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
    ...box(-66, -8, 4, 102, 16, 3, {
      r: 1.4,
      tone: "mid",
      topTone: "lo",
      group: "slide",
    }),
  );

  /* Graduations on the stock and on the sliding scale. */
  for (let index = 0; index < 33; index += 1) {
    const x = -58 + index * 3.6;
    const long = index % 5 === 0;
    faces.push(
      stroke3(
        [
          [x, -12, 4.4],
          [x, -12 + (long ? 7 : 4.4), 4.4],
        ],
        long ? "mid" : "lo",
      ),
      stroke3(
        [
          [x, 12, 4.4],
          [x, 12 - (long ? 7 : 4.4), 4.4],
        ],
        long ? "mid" : "lo",
      ),
    );
  }
  for (let index = 0; index < 23; index += 1) {
    const x = -62 + index * 4;
    const long = index % 4 === 0;
    faces.push(
      stroke3(
        [
          [x, -8, 7.2],
          [x, -8 + (long ? 7 : 4), 7.2],
        ],
        long ? "mid" : "lo",
        { group: "slide" },
      ),
    );
  }

  /* The cursor: a clear runner with a bright hairline. */
  faces.push(
    ...box(-14, -18, 4, 26, 36, 6, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "cursor",
    }),
    face3(
      [
        [-13, -18.5, 6],
        [12, -18.5, 6],
        [12, -18.5, 9.4],
        [-13, -18.5, 9.4],
      ],
      { tone: "lo", group: "cursor" },
    ),
    stroke3(
      [
        [0, -19, 11],
        [0, 19, 11],
      ],
      "hi",
      { group: "cursor" },
    ),
    face2(
      (() => {
        const [px, py] = iso(0, -3, 10.4);
        return circle(px, py, 3.4, 16);
      })(),
      { fill: false, tone: "hi", group: "cursor" },
    ),
  );

  /* A small maker's plate at the right end. */
  faces.push(
    face3(
      [
        [34, -11.4, 5],
        [58, -11.4, 5],
        [58, -11.4, 8.6],
        [34, -11.4, 8.6],
      ],
      { tone: "mid" },
    ),
  );

  return faces;
}

export const nativeSelect: PrototypeMeta = {
  slug: "native-select",
  name: "Native Select",
  component: "Native Select",
  object: "Slide rule",
  story:
    "The tongue slides a notch and the cursor's bright hairline finds the value.",
  note: "A native select chooses from a graduated range: you line the cursor up with a value.",
  scene: figureScene({
    slug: "native-select",
    name: "Native Select",
    component: "Inputs",
    object: "Slide rule",
    description:
      "A slide rule: a fixed stock with two scales, a sliding tongue offset to the left and a cursor with a bright hairline.",
    aria:
      "An isometric slide rule with two graduated scales, a sliding central tongue and a clear cursor with a bright hairline.",
    faces: nativeSelectFaces(),
    motions: [
      { group: "slide", kind: "sway", period: 3400, amount: 0.006, pivot: [0, 0, 6] },
      { group: "cursor", kind: "bob", period: 3400, amount: 0.7 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 115. Mini Calendar — tear-off calendar block                               */
/* -------------------------------------------------------------------------- */

function miniCalendarFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const blockZ = 8;

  /* A small easel back and two feet: the block stands on its own frame. */
  for (const x of [-20, 14] as const) {
    faces.push(
      ...box(x, -26, 0, 8, 8, 3, { r: 1.6, tone: "mid", topTone: "lo" }),
    );
  }
  faces.push(
    tube(
      [
        [-24, -22, 2],
        [-24, -22, 34],
      ],
      2.4,
      { tone: "mid" },
    ),
    tube(
      [
        [24, -22, 2],
        [24, -22, 34],
      ],
      2.4,
      { tone: "mid" },
    ),
    ...box(-30, -20, blockZ, 60, 44, 24, {
      r: 2.4,
      tone: "edge",
      topTone: "mid",
    }),
  );

  /* Page edges on both visible sides. */
  for (let line = 1; line < 5; line += 1) {
    faces.push(
      stroke3(
        [
          [-30, 24.2, blockZ + line * 4.6],
          [30, 24.2, blockZ + line * 4.6],
        ],
        "lo",
      ),
      stroke3(
        [
          [30.2, -20, blockZ + line * 4.6],
          [30.2, 24, blockZ + line * 4.6],
        ],
        "lo",
      ),
    );
  }

  /* The printed face: a big framed date and a bright month band. */
  faces.push(
    face3(
      [
        [-22, 24.3, 13],
        [22, 24.3, 13],
        [22, 24.3, 29],
        [-22, 24.3, 29],
      ],
      { tone: "mid" },
    ),
    face3(
      [
        [-22, 24.5, 26],
        [22, 24.5, 26],
        [22, 24.5, 30],
        [-22, 24.5, 30],
      ],
      { tone: "hi" },
    ),
    tube(
      [
        [-15, 24.6, 22],
        [-6, 24.6, 22],
        [-6, 24.6, 18],
        [-15, 24.6, 18],
        [-15, 24.6, 14],
        [-6, 24.6, 14],
      ],
      2.6,
      { tone: "hi" },
    ),
    tube(
      [
        [-2, 24.6, 22],
        [7, 24.6, 22],
        [2, 24.6, 14],
      ],
      2.6,
      { tone: "hi" },
    ),
    stroke3(
      [
        [-15, 24.7, 12.4],
        [8, 24.7, 12.4],
      ],
      "mid",
    ),
  );

  /* The top sheet, one corner already lifting. */
  faces.push(
    face3(
      [
        [-28, -18, blockZ + 24.4],
        [28, -18, blockZ + 24.4],
        [28, 22, blockZ + 24.4],
        [-28, 18, blockZ + 24.4],
      ],
      { tone: "edge", group: "leaf" },
    ),
    face3(
      [
        [28, 22, blockZ + 24.4],
        [34, 25, blockZ + 34],
        [20, 27, blockZ + 31],
      ],
      { tone: "mid", group: "leaf" },
    ),
    stroke3(
      [
        [-20, 1, blockZ + 24.8],
        [6, 1, blockZ + 24.8],
      ],
      "lo",
      { group: "leaf" },
    ),
    stroke3(
      [
        [-20, 9, blockZ + 24.8],
        [14, 9, blockZ + 24.8],
      ],
      "lo",
      { group: "leaf" },
    ),
  );

  /* Glue strip along the bound edge. */
  faces.push(
    ...box(-29, -21.5, blockZ + 24.6, 58, 5, 2.4, {
      r: 1.2,
      tone: "mid",
      topTone: "lo",
    }),
  );

  return faces;
}

export const miniCalendar: PrototypeMeta = {
  slug: "mini-calendar",
  name: "Mini Calendar",
  component: "Mini Calendar",
  object: "Tear-off calendar block",
  story:
    "The top sheet tears free, curls at its corner and flutters away from the block.",
  note: "A tear-off calendar gives one day at a time: removing a sheet reveals the next.",
  scene: figureScene({
    slug: "mini-calendar",
    name: "Mini Calendar",
    component: "Inputs",
    object: "Tear-off calendar block",
    description:
      "A tear-off calendar block on a small easel, with layered page edges, a bright month band, a big framed date and a curled top sheet.",
    aria:
      "An isometric tear-off calendar block on an easel, with layered pages, a bright month band, a framed date and a lifting top sheet.",
    faces: miniCalendarFaces(),
    motions: [
      { group: "leaf", kind: "sway", period: 3600, amount: 0.06, pivot: [-28, -18, 32] },
      { group: "leaf", kind: "lift", period: 3600, amount: 3.2 },
      { kind: "breathe", period: 4600, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 116. Relative Time — metronome                                             */
/* -------------------------------------------------------------------------- */

function relativeTimeFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Tapered case: back, sides, front and top. */
  faces.push(
    face3(
      [
        [-30, -18, 0],
        [30, -18, 0],
        [16, -11, 78],
        [-16, -11, 78],
      ],
      { tone: "edge" },
    ),
    face3(
      [
        [-30, -18, 0],
        [-30, 18, 0],
        [-16, 11, 78],
        [-16, -11, 78],
      ],
      { tone: "edge" },
    ),
    face3(
      [
        [30, -18, 0],
        [30, 18, 0],
        [16, 11, 78],
        [16, -11, 78],
      ],
      { tone: "mid" },
    ),
    face3(
      [
        [-30, 18, 0],
        [30, 18, 0],
        [16, 11, 78],
        [-16, 11, 78],
      ],
      { tone: "edge" },
    ),
    face3(
      [
        [-16, -11, 78],
        [16, -11, 78],
        [16, 11, 78],
        [-16, 11, 78],
      ],
      { tone: "mid" },
    ),
  );

  /* Scale arc on the front and the vertical slot for the pendulum. */
  const pivotY = 18.4;
  faces.push(
    face2(
      (() => {
        const points: Point2[] = [];
        for (let index = 0; index <= 24; index += 1) {
          const a = Math.PI * (0.1 + (index / 24) * 0.8);
          points.push(iso(Math.cos(a) * 23, pivotY, 8 + Math.sin(a) * 23));
        }
        return points;
      })(),
      { fill: false, tone: "mid" },
    ),
  );
  for (let index = 0; index <= 8; index += 1) {
    const a = Math.PI * (0.1 + (index / 8) * 0.8);
    const long = index % 2 === 0;
    faces.push(
      stroke3(
        [
          [Math.cos(a) * 22, pivotY + 0.1, 8 + Math.sin(a) * 22],
          [Math.cos(a) * (long ? 27 : 25), pivotY + 0.1, 8 + Math.sin(a) * (long ? 27 : 25)],
        ],
        long ? "mid" : "lo",
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [-4, 18.6, 12],
        [-4, 14.2, 70],
      ],
      "lo",
    ),
    stroke3(
      [
        [4, 18.6, 12],
        [4, 14.2, 70],
      ],
      "lo",
    ),
  );

  /* The pendulum: a slim rod tilted at rest, with a bright tempo weight. */
  faces.push(
    tube(
      [
        [0, 19.2, 8],
        [-12, 15.8, 74],
      ],
      2.2,
      { tone: "edge", group: "pendulum" },
    ),
    ...box(-13.5, 13.4, 43, 15, 6, 13, {
      r: 1.8,
      tone: "hi",
      topTone: "mid",
      group: "pendulum",
    }),
    face2(circleXZ(-6.6, 16.4, 49.5, 4.6, 18), {
      fill: false,
      tone: "lo",
      group: "pendulum",
    }),
    face2(circleXZ(0, 19.6, 8, 4.2, 18), {
      tone: "mid",
    }),
  );

  /* Winding key on the right side. */
  faces.push(
    tube(
      [
        [30, 0, 14],
        [39, 0, 14],
      ],
      10,
      { tone: "mid", group: "key" },
    ),
    disc3(40, 0, 14, 6.4, "yz", { tone: "edge", group: "key" }),
    disc3(40.3, 0, 14, 2.6, "yz", { tone: "hi", group: "key" }),
  );

  /* A small maker's plate at the top of the front. */
  faces.push(
    face3(
      [
        [-8, 11.6, 68],
        [8, 11.6, 68],
        [8, 11.6, 74],
        [-8, 11.6, 74],
      ],
      { tone: "mid" },
    ),
  );

  return faces;
}

export const relativeTime: PrototypeMeta = {
  slug: "relative-time",
  name: "Relative Time",
  component: "Relative Time",
  object: "Metronome",
  story:
    "The pendulum quickens its beat and the bright tempo weight rides up the rod.",
  note: "Relative time is a rhythm: an interval you can hear and count, not a date.",
  scene: figureScene({
    slug: "relative-time",
    name: "Relative Time",
    component: "Inputs",
    object: "Metronome",
    description:
      "A tapered wooden metronome with a graduated arc, a slotted pendulum and a bright tempo weight, plus a winding key.",
    aria:
      "An isometric metronome with a tapered wooden case, a printed scale arc, a swinging pendulum with a bright weight and a winding key.",
    faces: relativeTimeFaces(),
    motions: [
      {
        group: "pendulum",
        kind: "sway",
        period: 1400,
        amount: 0.34,
        pivot: [0, 18, 8],
      },
      { group: "pendulum", kind: "bob", period: 2800, amount: -2.6 },
      { group: "key", kind: "spin", period: 2800, amount: 360 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 117. File Upload — pneumatic tube station                                  */
/* -------------------------------------------------------------------------- */

function fileUploadFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Floor flange and the upright receiver cabinet. */
  faces.push(
    ...cylinder(0, 0, 0, 5, 23, 20, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ...box(-22, -15, 5, 44, 30, 52, {
      r: 4,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );

  /* The round porthole on the cabinet front, with a gasket and bolts. */
  faces.push(
    disc3(0, 15.4, 34, 15.4, "xz", { tone: "edge" }),
    disc3(0, 15.8, 34, 13, "xz", { tone: "lo" }),
    disc3(0, 16.1, 34, 11.2, "xz", { tone: "mid" }),
    face2(circleXZ(0, 16.3, 34, 13, 32), {
      fill: false,
      tone: "mid",
    }),
  );
  for (let index = 0; index < 8; index += 1) {
    const a = (index / 8) * TAU + 0.2;
    const [px, py] = iso(
      Math.cos(a) * 14.2,
      16.4,
      34 + Math.sin(a) * 14.2,
    );
    faces.push(face2(circle(px, py, 1.3, 10), { tone: "lo" }));
  }

  /* The hatch, hinged at the top of the porthole and leaning out. */
  faces.push(
    tube(
      [
        [-8, 16.6, 48],
        [-8, 21, 56],
      ],
      2.4,
      { tone: "mid", group: "hatch" },
    ),
    tube(
      [
        [8, 16.6, 48],
        [8, 21, 56],
      ],
      2.4,
      { tone: "mid", group: "hatch" },
    ),
    disc3(0, 21.6, 62, 12.4, "xz", {
      tone: "edge",
      group: "hatch",
    }),
    disc3(0, 22, 62, 8.8, "xz", {
      tone: "lo",
      group: "hatch",
    }),
  );

  /* The transparent tube rising from the station. */
  const tubeBottom = 57;
  const tubeTop = 140;
  for (const x of [-8, 8] as const) {
    faces.push(
      stroke3(
        [
          [x, 0, tubeBottom],
          [x, 0, tubeTop],
        ],
        "mid",
      ),
    );
  }
  for (let z = tubeBottom + 10; z < tubeTop; z += 16) {
    faces.push(
      ellipse3(0, 0, z, 10, 10, { fill: false, tone: "lo" }),
    );
  }
  faces.push(
    ellipse3(0, 0, tubeTop, 10, 10, { fill: false, tone: "mid" }),
    ellipse3(0, 0, tubeBottom, 10, 10, { fill: false, tone: "mid" }),
  );

  /* The capsule inside the tube, its bright band the accent. */
  faces.push(
    ...cylinder(0, 0, 90, 24, 7.4, 7.4, {
      tone: "edge",
      topTone: "mid",
      group: "capsule",
    }),
    ...cylinder(0, 0, 102, 4, 7.8, 7.8, {
      tone: "hi",
      topTone: "mid",
      group: "capsule",
    }),
    stroke3(
      [
        [0, -7.6, 98],
        [0, 7.6, 98],
      ],
      "lo",
      { group: "capsule" },
    ),
    ellipse3(0, 0, tubeBottom, 11.4, 11.4, { tone: "mid" }),
  );

  /* A small control plate with a bright send button. */
  faces.push(
    ...box(18, -6, 14, 16, 14, 14, {
      r: 2,
      tone: "mid",
      topTone: "lo",
    }),
    face3(
      [
        [22, 8.3, 18],
        [30, 8.3, 18],
        [30, 8.3, 24],
        [22, 8.3, 24],
      ],
      { tone: "hi", group: "send" },
    ),
  );

  return faces;
}

export const fileUpload: PrototypeMeta = {
  slug: "file-upload",
  name: "File Upload",
  component: "File Upload",
  object: "Pneumatic tube station",
  story:
    "The hatch opens, the bright capsule climbs the tube and the station is sealed again.",
  note: "An upload sends a file away through a closed channel to another place.",
  scene: figureScene({
    slug: "file-upload",
    name: "File Upload",
    component: "Inputs",
    object: "Pneumatic tube station",
    description:
      "A pneumatic tube station: a floor flange, an upright receiver cabinet with a round porthole and open hatch, a glass tube rising up and a bright-banded capsule inside.",
    aria:
      "An isometric pneumatic tube station with an upright cabinet, a round porthole and open hatch, a clear vertical tube, a capsule with a bright band and a send button.",
    faces: fileUploadFaces(),
    motions: [
      { group: "capsule", kind: "lift", period: 3000, amount: 16 },
      { group: "capsule", kind: "bob", period: 3000, amount: 1.4 },
      {
        group: "hatch",
        kind: "sway",
        period: 3000,
        amount: 0.08,
        pivot: [0, 21, 62],
      },
      { group: "send", kind: "breathe", period: 2400, amount: 0.02 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 118. Signature Pad — quill and inkwell                                     */
/* -------------------------------------------------------------------------- */

function signaturePadFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Inkwell body, shoulder, neck and the dark ink surface. */
  faces.push(
    ...cylinder(0, 0, 0, 16, 21, 18, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ...cylinder(0, 0, 16, 4, 15, 12, {
      tone: "mid",
      topTone: "lo",
    }),
    ...cylinder(0, 0, 20, 5, 10, 8, {
      tone: "edge",
      topTone: "mid",
      hollow: 5,
    }),
    ellipse3(0, 0, 25, 6.4, 6.4, { tone: "mid" }),
  );
  const [ix, iy] = iso(2, -1, 25.4);
  faces.push(
    face2(ellipse2(ix, iy, 3.4, 2.2, 20), { tone: "hi", group: "ink" }),
  );

  /* A brass lid, hinged open beside the neck. */
  faces.push(
    disc3(-16, 0, 20, 7.4, "yz", { tone: "mid", group: "lid" }),
    disc3(-16.4, 0, 20, 4.2, "yz", { tone: "lo", group: "lid" }),
    tube(
      [
        [-9, 0, 22],
        [-15, 0, 21],
      ],
      2.4,
      { tone: "mid", group: "lid" },
    ),
  );

  /* Quill shaft and a full, tapered feather vane. */
  const base = iso(1, 0, 21);
  const tip = iso(34, -10, 112);
  const dx = tip[0] - base[0];
  const dy = tip[1] - base[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const along = (t: number): Point2 => [base[0] + dx * t, base[1] + dy * t];

  const vaneLeft: Point2[] = [];
  const vaneRight: Point2[] = [];
  const steps = 12;
  for (let index = 0; index <= steps; index += 1) {
    const t = 0.36 + (index / steps) * 0.63;
    const swell = Math.sin(Math.PI * ((index / steps) * 0.94 + 0.03));
    const width = 3 + 29 * Math.pow(swell, 0.72) * (1 - 0.35 * (index / steps));
    const c = along(t);
    vaneLeft.push([c[0] + px * width, c[1] + py * width - 2]);
    vaneRight.push([c[0] - px * width * 0.62, c[1] - py * width * 0.62 + 1]);
  }
  faces.push(
    face2([...vaneLeft, ...[...vaneRight].reverse()], {
      tone: "lo",
      group: "quill",
    }),
  );
  for (let index = 1; index < steps; index += 1) {
    const t = 0.36 + (index / steps) * 0.63;
    const swell = Math.sin(Math.PI * ((index / steps) * 0.94 + 0.03));
    const c = along(t);
    const width = 3 + 29 * Math.pow(swell, 0.72) * (1 - 0.35 * (index / steps));
    faces.push(
      stroke2(
        [
          [c[0] + px * 1.2, c[1] + py * 1.2],
          [c[0] + px * width * 0.82, c[1] + py * width * 0.82 - 1],
        ],
        index % 2 === 0 ? "mid" : "lo",
        { group: "quill" },
      ),
      stroke2(
        [
          [c[0] - px * 1.2, c[1] - py * 1.2],
          [c[0] - px * width * 0.5, c[1] - py * width * 0.5 + 1],
        ],
        "lo",
        { group: "quill" },
      ),
    );
  }
  faces.push(
    face2([base, tip, [tip[0] + px * 1.6, tip[1] + py * 1.6], [base[0] + px * 1.6, base[1] + py * 1.6]], {
      tone: "edge",
      group: "quill",
    }),
    stroke2([base, tip], "mid", { group: "quill" }),
  );

  /* The paper slip and the bright ink loop of a finished signature. */
  const paperA = iso(-30, 22, 0);
  const paperB = iso(22, 22, 0);
  const paperC = iso(26, 40, 3);
  const paperD = iso(-26, 40, 3);
  const paperAt = (u: number, v: number): Point2 => {
    const bottom: Point2 = [
      paperA[0] + (paperB[0] - paperA[0]) * u,
      paperA[1] + (paperB[1] - paperA[1]) * u,
    ];
    const top: Point2 = [
      paperD[0] + (paperC[0] - paperD[0]) * u,
      paperD[1] + (paperC[1] - paperD[1]) * u,
    ];
    return [
      bottom[0] + (top[0] - bottom[0]) * v,
      bottom[1] + (top[1] - bottom[1]) * v,
    ];
  };
  faces.push(
    sheet(
      [-30, 22, 0],
      [22, 22, 0],
      [26, 40, 3],
      [-26, 40, 3],
      { tone: "lo" },
    ),
    (() => {
      const points: Point2[] = [];
      for (let index = 0; index <= 44; index += 1) {
        const a = (index / 44) * TAU;
        const u = 0.4 + 0.2 * Math.cos(a) + 0.07 * Math.sin(a * 2);
        const v = 0.52 + 0.2 * Math.sin(a);
        points.push(paperAt(u, v));
      }
      return face2(points, { fill: false, tone: "hi", group: "ink" });
    })(),
    face2(
      [paperAt(0.5, 0.42), paperAt(0.52, 0.34), paperAt(0.57, 0.33)],
      { fill: false, tone: "hi", group: "ink" },
    ),
  );

  return faces;
}

export const signaturePad: PrototypeMeta = {
  slug: "signature-pad",
  name: "Signature Pad",
  component: "Signature Pad",
  object: "Quill and inkwell",
  story:
    "The quill lifts from the ink, draws one long loop and lays the bright line down.",
  note: "A signature is a hand's trace: a nib dipped in ink makes a mark no machine repeats.",
  scene: figureScene({
    slug: "signature-pad",
    name: "Signature Pad",
    component: "Inputs",
    object: "Quill and inkwell",
    description:
      "A squat inkwell with an open ink surface and a brass lid, a long feather quill rising from it, and a paper slip carrying a bright ink loop.",
    aria:
      "An isometric quill standing in an inkwell with a brass lid, its feather spread wide, and a bright ink loop on a paper slip in front.",
    faces: signaturePadFaces(),
    motions: [
      {
        group: "quill",
        kind: "sway",
        period: 3400,
        amount: 0.035,
        pivot: [1, 0, 21],
      },
      { group: "ink", kind: "breathe", period: 2800, amount: 0.012 },
      { group: "lid", kind: "breathe", period: 4400, amount: 0.006 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 119. List — spice rack                                                     */
/* -------------------------------------------------------------------------- */

function listFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Back board, shelf and top rail: a rack that holds the jars. */
  faces.push(
    panel(-48, 48, -14, 0, 86, { tone: "edge" }),
    panel(-44, 44, -13.4, 4, 82, { tone: "lo" }),
    ...box(-50, -14, 26, 100, 26, 5, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );
  faces.push(
    tube(
      [
        [-46, 4, 80],
        [46, 4, 80],
      ],
      4,
      { tone: "mid" },
    ),
  );
  for (const x of [-46, 46] as const) {
    faces.push(
      ...box(x - 3, -16, 0, 6, 20, 6, {
        r: 2,
        tone: "mid",
        topTone: "lo",
      }),
    );
  }

  /* Grain lines on the back board. */
  for (const z of [44, 62]) {
    faces.push(
      stroke3(
        [
          [-42, -13, z],
          [42, -13, z],
        ],
        "lo",
      ),
    );
  }

  /* Four identical jars, one pulled forward off the shelf. */
  const jar = (
    x: number,
    y: number,
    group: string,
    accent: boolean,
  ) => {
    faces.push(
      ...cylinder(x, y, 31, 20, 8.6, 8.6, {
        tone: "edge",
        topTone: "mid",
        hollow: 1.6,
        bottomArc: true,
        group,
      }),
    );
    for (const z of [38, 46]) {
      faces.push(
        ellipse3(x, y, z, 8.6, 8.6, {
          fill: false,
          tone: "lo",
          group,
        }),
      );
    }
    faces.push(
      ...cylinder(x, y, 51, 4, 9.2, 8.8, {
        tone: "mid",
        topTone: "lo",
        group,
      }),
      ...cylinder(x, y, 55, 2, 3, 2.6, {
        tone: "mid",
        topTone: "mid",
        group,
      }),
      face3(
        [
          [x - 6, y + 8.7, 38],
          [x + 6, y + 8.7, 38],
          [x + 6, y + 8.7, 49],
          [x - 6, y + 8.7, 49],
        ],
        { tone: accent ? "hi" : "mid", group },
      ),
      stroke3(
        [
          [x - 4, y + 9, 42],
          [x + 4, y + 9, 42],
        ],
        "lo",
        { group },
      ),
      stroke3(
        [
          [x - 4, y + 9, 45],
          [x + 2, y + 9, 45],
        ],
        "lo",
        { group },
      ),
    );
  };
  jar(-34, -6, "jar-a", false);
  jar(-11, -6, "jar-b", false);
  jar(12, 2, "jar-c", true);
  jar(35, -6, "jar-d", false);

  return faces;
}

export const list: PrototypeMeta = {
  slug: "list",
  name: "List",
  component: "List",
  object: "Spice rack",
  story:
    "One jar slides off the shelf toward the reader and turns its bright label forward.",
  note: "A list keeps like things in a row on one rail, each ready to be picked out.",
  scene: figureScene({
    slug: "list",
    name: "List",
    component: "Data",
    object: "Spice rack",
    description:
      "A wooden spice rack with a back board, a lipped shelf and four small jars with lids and labels, one pulled forward.",
    aria:
      "An isometric wooden spice rack holding four identical jars with lids and labels, one jar pulled forward with a bright label.",
    faces: listFaces(),
    motions: [
      { group: "jar-c", kind: "lift", period: 3200, amount: 2.4 },
      { group: "jar-c", kind: "sway", period: 3200, amount: 0.03, pivot: [12, 2, 31] },
      { group: "jar-b", kind: "breathe", period: 4400, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 120. Ticker — ticker-tape machine                                          */
/* -------------------------------------------------------------------------- */

function tickerFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Base and its carry handle. */
  faces.push(
    ...box(-38, -26, 0, 76, 52, 14, {
      r: 5,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
    tube(
      [
        [-14, -26, 14],
        [-14, -34, 24],
        [14, -34, 24],
        [14, -26, 14],
      ],
      2.6,
      { tone: "mid" },
    ),
  );

  /* Two tape reels and the tape between them. */
  const reel = (cx: number, cz: number, r: number, group: string) => {
    faces.push(
      ...ring(cx, 0, cz, r - 3.4, 3.4, "xz", { tone: "edge", group }),
      disc3(cx, 0, cz, 3.4, "xz", { tone: "mid", group }),
    );
    for (let index = 0; index < 4; index += 1) {
      const a = (index / 4) * TAU + 0.4;
      faces.push(
        tube(
          [
            [cx, 0, cz],
            [cx + Math.cos(a) * (r - 4), 0, cz + Math.sin(a) * (r - 4)],
          ],
          1.2,
          { tone: "lo", group },
        ),
      );
    }
  };
  reel(-18, 48, 16, "reel-a");
  reel(18, 56, 12, "reel-b");
  faces.push(
    tube(
      [
        [-18, 0, 64],
        [-2, 0, 68],
        [14, 0, 68],
      ],
      1.4,
      { tone: "lo" },
    ),
  );

  /* Paper tape leaving the machine and draping down the front, as a flat
     ribbon with printed dashes. */
  const tapePath: Point3[] = [
    [18, 0, 56],
    [21, 8, 50],
    [24, 18, 38],
    [24, 26, 24],
    [23, 32, 10],
    [22, 38, 2],
  ];
  const halfWidth = 4.6;
  for (let index = 0; index < tapePath.length - 1; index += 1) {
    const a = tapePath[index];
    const b = tapePath[index + 1];
    faces.push(
      face3(
        [
          [a[0] - halfWidth, a[1], a[2]],
          [a[0] + halfWidth, a[1], a[2]],
          [b[0] + halfWidth, b[1], b[2]],
          [b[0] - halfWidth, b[1], b[2]],
        ],
        { tone: "edge", group: "tape" },
      ),
    );
    const my = (a[1] + b[1]) / 2;
    const mz = (a[2] + b[2]) / 2;
    const mx = (a[0] + b[0]) / 2;
    faces.push(
      stroke3(
        [
          [mx - 3, my + 0.2, mz],
          [mx + 3, my + 0.2, mz],
        ],
        index === 3 ? "hi" : "lo",
        { group: "tape" },
      ),
      stroke3(
        [
          [mx - 2, my + 0.3, mz - 2],
          [mx + 1, my + 0.3, mz - 2],
        ],
        "lo",
        { group: "tape" },
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [22 - halfWidth, 38, 2],
        [16, 41, 4],
        [14, 41, 10],
      ],
      "mid",
      { group: "tape" },
    ),
  );

  /* Glass bell jar: two uprights and an arched crown, all engraved. */
  const [dcx, dcy] = iso(0, 0, 14);
  const domeR = 47;
  const domeH = 64;
  const arch: Point2[] = [];
  for (let index = 0; index <= 30; index += 1) {
    const a = Math.PI - (index / 30) * Math.PI;
    arch.push([dcx + Math.cos(a) * domeR, dcy - Math.sin(a) * domeH]);
  }
  faces.push(
    face2(arch, { fill: false, tone: "mid" }),
    stroke2(
      [
        [dcx - domeR, dcy],
        [dcx - domeR, dcy + 24],
        [dcx + domeR, dcy + 24],
        [dcx + domeR, dcy],
      ],
      "mid",
    ),
    stroke2(
      [
        [dcx, dcy - domeH],
        [dcx, dcy - domeH - 7],
      ],
      "mid",
    ),
    face2(circle(dcx, dcy - domeH - 9, 3.6, 16), { tone: "mid" }),
  );
  for (const fraction of [-0.62, 0, 0.62]) {
    const x = dcx + fraction * domeR;
    const top = dcy - domeH * Math.sqrt(1 - fraction * fraction);
    faces.push(
      stroke2(
        [
          [x, dcy + 22],
          [x, top + 4],
        ],
        "lo",
      ),
    );
  }

  /* Crank on the right side. */
  faces.push(
    tube(
      [
        [38, 0, 30],
        [48, 0, 30],
      ],
      6,
      { tone: "mid", group: "crank" },
    ),
    disc3(49, 0, 30, 5.4, "yz", { tone: "edge", group: "crank" }),
  );

  return faces;
}

export const ticker: PrototypeMeta = {
  slug: "ticker",
  name: "Ticker",
  component: "Ticker",
  object: "Ticker-tape machine",
  story:
    "The reels turn, the tape feeds out through the glass and its printed marks slide down the page.",
  note: "A ticker is a live stream made physical: a ribbon of values leaving the machine.",
  scene: figureScene({
    slug: "ticker",
    name: "Ticker",
    component: "Data",
    object: "Ticker-tape machine",
    description:
      "A ticker-tape machine under a glass bell jar: two tape reels, a paper ribbon with printed marks, a crank and a carry handle.",
    aria:
      "An isometric ticker-tape machine under a glass bell jar, with two reels, a paper tape of printed values, a crank and a handle.",
    faces: tickerFaces(),
    motions: [
      { group: "reel-a", kind: "spin", period: 3600, amount: 360 },
      { group: "reel-b", kind: "spin", period: 2600, amount: 360 },
      { group: "tape", kind: "bob", period: 2600, amount: 1.6 },
      { group: "crank", kind: "spin", period: 2600, amount: 360 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 121. Gantt — string-and-peg planning board                                 */
/* -------------------------------------------------------------------------- */

function ganttFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Feet and the framed board. */
  for (const x of [-34, 26] as const) {
    faces.push(
      ...box(x, -14, 0, 8, 16, 24, {
        r: 2,
        tone: "mid",
        topTone: "lo",
      }),
    );
  }
  faces.push(
    panel(-50, 50, -4, 22, 112, { tone: "edge" }),
    panel(-44, 44, -3.5, 28, 106, { tone: "lo" }),
    ...box(-52, -8, 20, 104, 8, 4, {
      r: 2,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-52, -8, 110, 104, 8, 4, {
      r: 2,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-52, -8, 20, 8, 8, 94, {
      r: 2,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(44, -8, 20, 8, 8, 94, {
      r: 2,
      tone: "edge",
      topTone: "mid",
    }),
  );

  /* Row strings across the board. */
  for (const z of [40, 56, 72, 88]) {
    faces.push(
      stroke3(
        [
          [-38, -3.2, z],
          [38, -3.2, z],
        ],
        "lo",
      ),
    );
  }

  /* Pegs with a cast shadow; one pegged task is bright. */
  const peg = (
    x: number,
    z: number,
    span: number,
    group: string,
    accent: boolean,
  ) => {
      const shadow = group;
      faces.push(
        stroke3(
          [
            [x, -3, z - 4],
            [x + span, -3, z - 4],
          ],
          "lo",
          { group: shadow },
        ),
      );
      faces.push(
        tube(
        [
          [x, 0, z],
          [x, 10, z],
        ],
        6.4,
        { tone: "edge", group },
      ),
      face2(circleXZ(x, 10.4, z, 4, 16), {
        tone: accent ? "hi" : "mid",
        group,
      }),
      face2(circleXZ(x, 10.8, z, 1.6, 10), {
        tone: "lo",
        group,
      }),
    );
  };

  peg(-30, 40, 18, "peg-a", false);
  peg(-16, 56, 26, "peg-b", false);
  peg(2, 72, 22, "peg-c", true);
  peg(22, 88, 12, "peg-d", false);

  /* A few duration labels on the rows. */
  for (const z of [40, 56, 72, 88]) {
    faces.push(
      stroke3(
        [
          [-38, -3, z + 5],
          [-26, -3, z + 5],
        ],
        "lo",
      ),
    );
  }

  return faces;
}

export const gantt: PrototypeMeta = {
  slug: "gantt",
  name: "Gantt",
  component: "Gantt",
  object: "String-and-peg planning board",
  story:
    "The bright peg slides along its string and the shadow of the task stretches with it.",
  note: "A Gantt chart is durations seen together: pegs on parallel strings.",
  scene: figureScene({
    slug: "gantt",
    name: "Gantt",
    component: "Data",
    object: "String-and-peg planning board",
    description:
      "A framed planning board on feet, with four parallel strings, sliding wooden pegs, cast shadows and a bright pegged task.",
    aria:
      "An isometric string-and-peg planning board with four parallel strings, sliding pegs with shadows and one bright peg.",
    faces: ganttFaces(),
    motions: [
      { group: "peg-c", kind: "sway", period: 3600, amount: 0.05, pivot: [2, 10, 72] },
      { group: "peg-c", kind: "bob", period: 3600, amount: 2 },
      { group: "peg-b", kind: "breathe", period: 4800, amount: 0.006 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 122. Pin List — magnet board                                               */
/* -------------------------------------------------------------------------- */

function pinListFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Feet and the steel board in its frame. */
  for (const x of [-32, 24] as const) {
    faces.push(
      ...box(x, -12, 0, 8, 14, 22, {
        r: 2,
        tone: "mid",
        topTone: "lo",
      }),
    );
  }
  faces.push(
    panel(-47, 47, -4, 20, 114, { tone: "edge" }),
    panel(-41, 41, -3.5, 26, 108, { tone: "lo" }),
  );
  for (const [x0, x1, z0, z1] of [
    [-47, 47, 108, 114],
    [-47, 47, 20, 26],
    [-47, -41, 26, 108],
    [41, 47, 26, 108],
  ] as const) {
    faces.push(
      face3(
        [
          [x0, -3.4, z0],
          [x1, -3.4, z0],
          [x1, -3.4, z1],
          [x0, -3.4, z1],
        ],
        { tone: "mid" },
      ),
    );
  }

  /* Pinned notes, one of them lifted and turned toward the reader. */
  const note = (
    x: number,
    z: number,
    w: number,
    h: number,
    group: string,
    accent: boolean,
    y = 0,
  ) => {
    faces.push(
      face3(
        [
          [x - w / 2, y, z - h / 2],
          [x + w / 2, y, z - h / 2],
          [x + w / 2, y, z + h / 2],
          [x - w / 2, y, z + h / 2],
        ],
        { tone: accent ? "hi" : "mid", group },
      ),
    );
    for (let line = 0; line < 3; line += 1) {
      faces.push(
        stroke3(
          [
            [x - w / 2 + 3, y + 0.2, z - h / 2 + 5 + line * 4],
            [x + w / 2 - 3 - line * 2, y + 0.2, z - h / 2 + 5 + line * 4],
          ],
          "lo",
          { group },
        ),
      );
    }
  };
  note(-24, 88, 28, 24, "note-a", false);
  note(0, 68, 30, 26, "note-b", true, 3);
  note(25, 95, 24, 22, "note-c", false);
  note(-22, 45, 22, 20, "note-d", false);

  /* Round magnets holding each note; one is bright. */
  const magnet = (
    x: number,
    z: number,
    group: string,
    accent: boolean,
    y = 0,
  ) => {
    faces.push(
      tube(
        [
          [x, y, z],
          [x, y + 8, z],
        ],
        6.6,
        { tone: "edge", group },
      ),
      face2(circleXZ(x, y + 8.4, z, 4.4, 18), {
        tone: accent ? "hi" : "mid",
        group,
      }),
      face2(circleXZ(x, y + 8.8, z, 1.8, 12), {
        tone: "lo",
        group,
      }),
    );
  };
  magnet(-24, 95, "magnet-a", false);
  magnet(0, 76, "magnet-b", true, 3);
  magnet(25, 101, "magnet-c", false);
  magnet(-22, 50, "magnet-d", false);

  /* A spare magnet lying in the bottom tray. */
  faces.push(
    ...box(-18, 8, 20, 36, 8, 4, {
      r: 2,
      tone: "mid",
      topTone: "lo",
    }),
    ...cylinder(8, 11, 24, 3, 4.4, 4.4, {
      tone: "mid",
      topTone: "lo",
    }),
  );

  return faces;
}

export const pinList: PrototypeMeta = {
  slug: "pin-list",
  name: "Pin List",
  component: "Pin List",
  object: "Magnet board",
  story:
    "One magnet slides across the steel and its bright note turns its face to the reader.",
  note: "A pin list is a set of items held visible on a board, movable at a touch.",
  scene: figureScene({
    slug: "pin-list",
    name: "Pin List",
    component: "Data",
    object: "Magnet board",
    description:
      "A framed steel magnet board on feet, with four pinned notes held by round magnets, one note and magnet bright and pulled forward.",
    aria:
      "An isometric magnet board with four notes held by round magnets, one bright note and magnet lifted off the steel, and a spare magnet in the tray.",
    faces: pinListFaces(),
    motions: [
      { group: "note-b", kind: "sway", period: 3200, amount: 0.05, pivot: [-2, 3, 92] },
      { group: "note-b", kind: "lift", period: 3200, amount: 3 },
      { group: "magnet-b", kind: "bob", period: 3200, amount: 2.2 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 123. Steps — stepping stones                                               */
/* -------------------------------------------------------------------------- */

function stepsFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Irregular stone footprint: a jittered rounded polygon. */
  const footprint = (
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    seed: number,
    count = 9,
  ) => {
    const points: Point2[] = [];
    for (let index = 0; index < count; index += 1) {
      const a = (index / count) * TAU;
      const wobble = 0.86 + 0.2 * Math.sin(seed + index * 2.3);
      points.push([cx + Math.cos(a) * rx * wobble, cy + Math.sin(a) * ry * wobble]);
    }
    return points;
  };

  const stones: Array<{
    x: number;
    y: number;
    rx: number;
    ry: number;
    h: number;
    seed: number;
    group: string;
  }> = [
    { x: -40, y: 4, rx: 19, ry: 14, h: 6, seed: 0.4, group: "stone-a" },
    { x: -22, y: -8, rx: 17, ry: 12, h: 7, seed: 1.7, group: "stone-b" },
    { x: -2, y: -4, rx: 16, ry: 11, h: 9, seed: 2.9, group: "stone-c" },
    { x: 18, y: -10, rx: 14, ry: 10, h: 7, seed: 4.1, group: "stone-d" },
    { x: 34, y: -14, rx: 11, ry: 8, h: 6, seed: 5.3, group: "stone-e" },
  ];

  /* Water: only one engraved ripple around each stone, never a slab. */
  for (const stone of stones) {
    faces.push(
      ellipse3(stone.x, stone.y, 0.2, stone.rx + 8, stone.ry + 6, {
        fill: false,
        tone: "lo",
      }),
    );
  }

  /* The stones themselves. */
  stones.forEach((stone, index) => {
    const foot = footprint(stone.x, stone.y, stone.rx, stone.ry, stone.seed);
    faces.push(
      ...(() => {
        const out: FigureFace[] = [];
        const sides = foot.map(([x, y], sideIndex) => {
          const next = foot[(sideIndex + 1) % foot.length];
          return {
            x,
            y,
            next,
            depth: (x + next[0] + y + next[1]) / 2,
          };
        });
        sides
          .filter(
            (side) =>
              side.next[1] - side.y - (side.next[0] - side.x) > 0.0001,
          )
          .sort(byDepth)
          .forEach((side) => {
            out.push(
              face3(
                [
                  [side.x, side.y, 0],
                  [side.next[0], side.next[1], 0],
                  [side.next[0], side.next[1], stone.h],
                  [side.x, side.y, stone.h],
                ],
                { tone: "edge", stroke: false, group: stone.group },
              ),
            );
          });
        out.push(
          face2(
            foot.map(([x, y]) => iso(x, y, stone.h)),
            { tone: "mid", group: stone.group },
          ),
        );
        out.push(
          face2(
            convexHull([
              ...foot.map(([x, y]) => iso(x, y, 0)),
              ...foot.map(([x, y]) => iso(x, y, stone.h)),
            ]),
            { fill: false, tone: "edge", group: stone.group },
          ),
        );
        return out;
      })(),
    );
    /* A crack and a bright fleck on the third stone. */
    faces.push(
      stroke3(
        [
          [stone.x - stone.rx * 0.3, stone.y, stone.h + 0.2],
          [stone.x + stone.rx * 0.1, stone.y + stone.ry * 0.3, stone.h + 0.2],
          [stone.x + stone.rx * 0.4, stone.y - stone.ry * 0.1, stone.h + 0.2],
        ],
        "lo",
        { group: stone.group },
      ),
    );
    if (index === 2) {
      const [px, py] = iso(stone.x + 3, stone.y + 2, stone.h + 0.3);
      faces.push(face2(circle(px, py, 2.2, 12), { tone: "hi", group: stone.group }));
    }
  });

  /* A few reeds at the far bank, drawn as thin blades. */
  for (const [x, y] of [
    [-44, -38],
    [-38, -42],
  ] as const) {
    faces.push(
      stroke3(
        [
          [x, y, 0],
          [x - 2, y, 24],
          [x + 1, y, 34],
        ],
        "lo",
      ),
      stroke3(
        [
          [x + 4, y, 0],
          [x + 5, y, 18],
          [x + 8, y, 27],
        ],
        "lo",
      ),
    );
  }

  return faces;
}

export const steps: PrototypeMeta = {
  slug: "steps",
  name: "Steps",
  component: "Steps",
  object: "Stepping stones",
  story:
    "The stones lift out of the water in order and the next one catches the light.",
  note: "Steps are a path taken one separate foothold at a time.",
  scene: figureScene({
    slug: "steps",
    name: "Steps",
    component: "Navigation",
    object: "Stepping stones",
    description:
      "Five irregular stepping stones across engraved water ripples, with a crack, a bright fleck and a few reeds on the far bank.",
    aria:
      "An isometric path of five irregular stepping stones across water ripples, with a bright fleck on the middle stone and reeds at the bank.",
    faces: stepsFaces(),
    motions: [
      { group: "stone-a", kind: "lift", period: 3000, amount: 3, phase: 0 },
      { group: "stone-b", kind: "lift", period: 3000, amount: 3, phase: 0.12 },
      { group: "stone-c", kind: "lift", period: 3000, amount: 3, phase: 0.24 },
      { group: "stone-d", kind: "lift", period: 3000, amount: 3, phase: 0.36 },
      { group: "stone-e", kind: "lift", period: 3000, amount: 3, phase: 0.48 },
    ],
    press: 0.8,
  }),
};

/* -------------------------------------------------------------------------- */
/* 124. Table of Contents — directory board                                   */
/* -------------------------------------------------------------------------- */

function tocFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Cords, hanging ring, and the framed board. */
  for (const x of [-26, 26] as const) {
    faces.push(
      tube(
        [
          [x, 0, 108],
          [x * 0.4, 0, 138],
          [0, 0, 144],
        ],
        1.4,
        { tone: "lo" },
      ),
    );
  }
  faces.push(...ring(0, 0, 148, 5, 1.5, "xz", { tone: "mid" }));

  faces.push(
    ...box(-46, -5, 26, 92, 10, 84, {
      r: 2.4,
      tone: "edge",
      topTone: "mid",
    }),
    panel(-40, 40, 0.6, 32, 104, { tone: "mid" }),
  );

  /* Rows of lettered flaps. The fourth one hangs open. */
  const rows = [88, 74, 60, 46, 32];
  rows.forEach((z, index) => {
    const open = index === 2;
    if (!open) {
      faces.push(
        face3(
          [
            [-34, 1, z - 7],
            [30, 1, z - 7],
            [30, 1, z + 7],
            [-34, 1, z + 7],
          ],
          { tone: "mid", group: `row-${index}` },
        ),
        face3(
          [
            [-38, 1.3, z - 7],
            [-31, 1.3, z - 7],
            [-31, 1.3, z + 7],
            [-38, 1.3, z + 7],
          ],
          {
            tone: index === 0 ? "hi" : "lo",
            group: `tab-${index}`,
          },
        ),
        stroke3(
          [
            [-24, 1.4, z + 3],
            [-2, 1.4, z + 3],
          ],
          "lo",
          { group: `row-${index}` },
        ),
        stroke3(
          [
            [-24, 1.4, z - 3],
            [12, 1.4, z - 3],
          ],
          "lo",
          { group: `row-${index}` },
        ),
        stroke3(
          [
            [-35, 1.6, z + 3],
            [-34, 1.6, z + 3],
          ],
          "mid",
          { group: `tab-${index}` },
        ),
        stroke3(
          [
            [-35.6, 1.6, z],
            [-33.4, 1.6, z],
          ],
          "mid",
          { group: `tab-${index}` },
        ),
      );
    }
  });

  /* The opened flap: hinged at its top edge and folded down. */
  faces.push(
    face3(
      [
        [-34, 1, 53],
        [30, 1, 53],
        [30, 15, 41],
        [-34, 15, 41],
      ],
      { tone: "edge", group: "flap" },
    ),
    face3(
      [
        [-38, 1.4, 53],
        [-31, 1.4, 53],
        [-31, 14, 42.6],
        [-38, 14, 42.6],
      ],
      { tone: "hi", group: "flap" },
    ),
    stroke3(
      [
        [-22, 8.4, 48],
        [4, 8.4, 48],
      ],
      "lo",
      { group: "flap" },
    ),
    stroke3(
      [
        [-22, 10.6, 45.4],
        [14, 10.6, 45.4],
      ],
      "lo",
      { group: "flap" },
    ),
  );

  /* A small bright arrow marking the current floor. */
  faces.push(
    face3(
      [
        [24, 1.6, 64],
        [31, 1.6, 67],
        [24, 1.6, 70],
        [26, 1.6, 67],
      ],
      { tone: "hi" },
    ),
  );

  return faces;
}

export const tableOfContents: PrototypeMeta = {
  slug: "toc",
  name: "Table of Contents",
  component: "Table of Contents",
  object: "Directory board",
  story:
    "One lettered flap folds down on its hinge and shows the line behind it.",
  note: "A table of contents is a board you scan to find your place at a glance.",
  scene: figureScene({
    slug: "toc",
    name: "Table of Contents",
    component: "Navigation",
    object: "Directory board",
    description:
      "A directory board hanging from two cords and a ring, with rows of lettered tabs, one flap folded open and a bright current-floor arrow.",
    aria:
      "An isometric directory board hanging from a ring and two cords, with lettered rows, one open flap and a bright arrow.",
    faces: tocFaces(),
    motions: [
      { group: "flap", kind: "sway", period: 3400, amount: 0.05, pivot: [-34, 1, 53] },
      { group: "tab-0", kind: "breathe", period: 4600, amount: 0.006 },
    ],
    press: 0.9,
  }),
};

/* -------------------------------------------------------------------------- */
/* 125. Kbd — keyboard switch                                                 */
/* -------------------------------------------------------------------------- */

function kbdFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* PCB pins under the housing: the switch's own legs. */
  for (const [x, y] of [
    [-13, -13],
    [13, -13],
    [-6, 13],
    [6, 13],
  ] as const) {
    faces.push(
      ...cylinder(x, y, -9, 9, 2, 2, {
        tone: "lo",
        topTone: "lo",
      }),
    );
  }

  /* Housing and top plate. */
  faces.push(
    ...box(-22, -22, 0, 44, 44, 9, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
    ...box(-17, -17, 9, 34, 34, 5, {
      r: 2,
      tone: "mid",
      topTone: "lo",
    }),
  );

  /* The spring, coiled around the central stem. */
  const spring: Point3[] = [];
  for (let index = 0; index <= 46; index += 1) {
    const t = index / 46;
    const a = t * Math.PI * 8;
    spring.push([
      Math.cos(a) * 6.6,
      Math.sin(a) * 6.6,
      15 + t * 15,
    ]);
  }
  faces.push(
    tube(spring, 1.7, { tone: "mid", group: "spring" }),
    post(0, 0, 14, 34, 6, "edge", "stem"),
  );

  /* The cross stem that the keycap sits on. */
  faces.push(
    tube(
      [
        [-10, 0, 35],
        [10, 0, 35],
      ],
      4.4,
      { tone: "hi", group: "cap" },
    ),
    tube(
      [
        [0, -10, 35],
        [0, 10, 35],
      ],
      4.4,
      { tone: "hi", group: "cap" },
    ),
  );

  /* Keycap: a dished square hovering on the cross stem. */
  faces.push(
    ...box(-18, -18, 42, 36, 36, 9, {
      r: 3.4,
      tone: "edge",
      topTone: "mid",
      group: "cap",
    }),
    face2(
      roundedRect(-14, -14, 28, 28, 5, 4).map(([x, y]) => iso(x, y, 51.4)),
      { tone: "lo", group: "cap" },
    ),
    face2(
      roundedRect(-9, -9, 18, 18, 3, 3).map(([x, y]) => iso(x, y, 51.6)),
      { fill: false, tone: "mid", group: "cap" },
    ),
    stroke3(
      [
        [-4, -6, 51.8],
        [-1, -2, 51.8],
      ],
      "lo",
      { group: "cap" },
    ),
  );

  return faces;
}

export const kbd: PrototypeMeta = {
  slug: "kbd",
  name: "Kbd",
  component: "Kbd",
  object: "Keyboard switch",
  story:
    "The cap sinks, the spring compresses under the cross stem and everything snaps back.",
  note: "A keyboard shortcut is one switch under one cap: the atom of typing.",
  scene: figureScene({
    slug: "kbd",
    name: "Kbd",
    component: "Text",
    object: "Keyboard switch",
    description:
      "A mechanical keyboard switch: a square housing on four PCB pins, a coiled spring around the stem, a bright cross mount and a dished keycap.",
    aria:
      "An isometric mechanical keyboard switch on four pins, with a coiled spring, a bright cross stem and a dished keycap.",
    faces: kbdFaces(),
    motions: [
      { group: "cap", kind: "lift", period: 2200, amount: -5.4 },
      { group: "spring", kind: "breathe", period: 2200, amount: 0.03 },
      { group: "stem", kind: "breathe", period: 2200, amount: 0.02 },
    ],
    press: 0.9,
  }),
};

/* __LOT5_MORE__ */

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                  */
/* -------------------------------------------------------------------------- */

export const lot5Prototypes: PrototypeMeta[] = [
  confirmation,
  creditCard,
  dateInput,
  context,
  dataList,
  dataTable,
  editable,
  field,
  inputGroup,
  numberInput,
  passwordInput,
  tagsInput,
  segmentGroup,
  nativeSelect,
  miniCalendar,
  relativeTime,
  fileUpload,
  signaturePad,
  list,
  ticker,
  gantt,
  pinList,
  steps,
  tableOfContents,
  kbd,
];
