/*
 * Linear v4 — lot 3 (components 51 to 75 of the object catalogue).
 *
 * Same rules as lots 1 and 2: one real-world object per component, drawn from
 * scratch in the shared 2:1 axonometric space, no slab under the object and a
 * silhouette that still reads at 64 px. Faces are painted back to front and
 * filled with the plate tone, so a nearer face hides the construction behind
 * it while the 0.9 px outline stays clean.
 *
 * Every object here is new: none repeats an object from lots 1-2, from the
 * Objects collection, or from the studied reference pages.
 */

import type {
  DetailTone,
  FigureFace,
  Point2,
  Point3,
} from "./engine";
import {
  arc3,
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

/** A vertical rod between two z heights at a fixed (x, y). */
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

/* -------------------------------------------------------------------------- */
/* 51. Badge — name badge on a lanyard                                        */
/* -------------------------------------------------------------------------- */

function badgeFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Lanyard: two straps from the card's top corners up to a small ring. */
  faces.push(
    tube(
      [
        [-16, 0, 62],
        [-8, 0, 74],
        [0, 0, 83],
      ],
      2.2,
      { tone: "mid", group: "cord" },
    ),
    tube(
      [
        [16, 0, 62],
        [8, 0, 74],
        [0, 0, 83],
      ],
      2.2,
      { tone: "mid", group: "cord" },
    ),
  );
  const [lx, ly] = iso(0, 0, 88);
  faces.push(
    face2(circle(lx, ly, 8, 26), {
      fill: false,
      tone: "edge",
      group: "cord",
    }),
    face2(circle(lx, ly, 4, 20), {
      fill: false,
      tone: "lo",
      group: "cord",
    }),
  );

  /* Metal clip and the card itself. */
  faces.push(
    ...box(-7, -1.4, 62, 14, 2.8, 6, {
      r: 1.6,
      tone: "edge",
      topTone: "mid",
      group: "badge",
    }),
    ...box(-22, -1.6, 0, 44, 3.2, 62, {
      r: 3,
      tone: "edge",
      topTone: "mid",
      group: "badge",
    }),
  );

  /* Clear sleeve, printed band and two ruled lines. */
  faces.push(
    face3(vRound(0, 1.8, 3, 40, 56, 2.4), {
      fill: false,
      tone: "lo",
      group: "badge",
    }),
    face3(
      [
        [-17, 1.7, 45],
        [17, 1.7, 45],
        [17, 1.7, 55],
        [-17, 1.7, 55],
      ],
      { tone: "mid", group: "badge" },
    ),
    stroke3(
      [
        [-12, 1.8, 51],
        [7, 1.8, 51],
      ],
      "lo",
      { group: "badge" },
    ),
    stroke3(
      [
        [-15, 1.8, 36],
        [15, 1.8, 36],
      ],
      "lo",
      { group: "badge" },
    ),
    stroke3(
      [
        [-15, 1.8, 29],
        [9, 1.8, 29],
      ],
      "lo",
      { group: "badge" },
    ),
    stroke3(
      [
        [-15, 1.8, 22],
        [12, 1.8, 22],
      ],
      "lo",
      { group: "badge" },
    ),
  );

  /* A single bright chip on the printed band: the active mark. */
  const [gx, gy] = iso(11.5, 1.7, 50);
  faces.push(
    face2(ellipse2(gx, gy, 2.6, 2.6, 18), {
      tone: "hi",
      group: "badge",
    }),
    face2(ellipse2(gx, gy, 1.1, 1.1, 12), {
      fill: false,
      tone: "lo",
      group: "badge",
    }),
  );

  return faces;
}

export const badge: PrototypeMeta = {
  slug: "badge",
  name: "Badge",
  component: "Badge",
  object: "Name badge on a lanyard",
  story:
    "The badge swings on its cord and the printed band catches the light.",
  note: "A badge is a small label worn on the body: identity you can read at a glance.",
  scene: figureScene({
    slug: "badge",
    name: "Badge",
    component: "Text",
    object: "Name badge on a lanyard",
    description:
      "A name badge in a clear sleeve hanging from a lanyard: a printed band, a metal clip and ruled lines.",
    aria:
      "An isometric name badge on a lanyard: a card in a clear sleeve with a printed band, a clip and a ring at the top of the cord.",
    faces: badgeFaces(),
    motions: [
      {
        group: "badge",
        kind: "sway",
        period: 3000,
        amount: 2.4,
        pivot: [0, 0, 63],
      },
      {
        group: "cord",
        kind: "sway",
        period: 3000,
        amount: 1.4,
        pivot: [0, 0, 84],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 52. Banner — flag on a pole                                                */
/* -------------------------------------------------------------------------- */

function bannerFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Pole, collar and finial. */
  faces.push(
    ...cylinder(-42, 0, 0, 96, 3, 2.4, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ...cylinder(-42, 0, 0, 4, 6, 5, {
      tone: "mid",
      topTone: "lo",
    }),
    ...cylinder(-42, 0, 94, 3, 2.6, 3.4, {
      tone: "mid",
      topTone: "mid",
    }),
    ...sphereFaces(-42, 0, 100, 4.4, { tone: "edge" }),
  );

  /* Cloth in four vertical strips: each strip sways a little more than the
     one before, so the hover ripple travels from the mast to the free edge. */
  const wave = (x: number) => Math.sin(((x + 40) / 80) * Math.PI * 1.7) * 3.6;
  const topAt = (x: number) => 92 - (x + 40) * 0.07;
  const bottomAt = (x: number) => 64 - (x + 40) * 0.11;

  for (let strip = 0; strip < 4; strip += 1) {
    const x0 = -40 + strip * 20;
    const x1 = x0 + 20;
    const group = `cloth-${strip + 1}`;
    const y0 = wave(x0);
    const y1 = wave(x1);
    const top0 = topAt(x0);
    const top1 = topAt(x1);
    const bottom0 = bottomAt(x0);
    const bottom1 = bottomAt(x1);

    faces.push(
      face3(
        [
          [x0, y0, top0],
          [x1, y1, top1],
          [x1, y1, bottom1],
          [x0, y0, bottom0],
        ],
        { tone: "edge", group },
      ),
      stroke3(
        [
          [x0, y0 - 0.6, top0],
          [x1, y1 - 0.6, top1],
        ],
        "lo",
        { group },
      ),
      stroke3(
        [
          [x0, y0 - 0.6, bottom0],
          [x1, y1 - 0.6, bottom1],
        ],
        "lo",
        { group },
      ),
    );

    if (strip > 0) {
      const seam = x0;
      const sy = wave(seam);
      faces.push(
        stroke3(
          [
            [seam, sy - 0.8, topAt(seam)],
            [seam, sy - 0.8, bottomAt(seam)],
          ],
          "mid",
          { group },
        ),
      );
    }
  }

  /* Emblem: a small five-point star stitched on the second strip. */
  const [ex, ey] = iso(0, wave(0) - 0.9, 79);
  faces.push(
    face2(star2(ex, ey, 8.5, 3.7, 5), {
      tone: "hi",
      group: "emblem",
    }),
    face2(circle(ex, ey, 12.5, 30), {
      fill: false,
      tone: "lo",
      group: "emblem",
    }),
  );

  /* Rope ties at the mast. */
  for (const z of [66, 90]) {
    faces.push(
      ...cylinder(-42, 0, z, 3.4, 4.4, 4.4, {
        tone: "mid",
        topTone: "lo",
      }),
    );
  }

  return faces;
}

export const banner: PrototypeMeta = {
  slug: "banner",
  name: "Banner",
  component: "Banner",
  object: "Flag on a pole",
  story:
    "The cloth ripples once from the mast and its emblem catches the light.",
  note: "A banner is a broad message held by one edge, above everything it addresses.",
  scene: figureScene({
    slug: "banner",
    name: "Banner",
    component: "Layout",
    object: "Flag on a pole",
    description:
      "A flag on a pole: four cloth strips waving from the mast, a rope at each corner and a star emblem.",
    aria:
      "An isometric flag on a pole: a waving rectangular cloth tied to a mast with two rope collars, carrying a star emblem.",
    faces: bannerFaces(),
    motions: [
      {
        group: "cloth-1",
        kind: "sway",
        period: 2600,
        amount: 1.2,
        pivot: [-42, 0, 78],
      },
      {
        group: "cloth-2",
        kind: "sway",
        period: 2600,
        amount: 2.2,
        phase: 0.08,
        pivot: [-42, 0, 78],
      },
      {
        group: "cloth-3",
        kind: "sway",
        period: 2600,
        amount: 3.2,
        phase: 0.16,
        pivot: [-42, 0, 78],
      },
      {
        group: "cloth-4",
        kind: "sway",
        period: 2600,
        amount: 4.2,
        phase: 0.24,
        pivot: [-42, 0, 78],
      },
      { group: "emblem", kind: "lift", period: 2600, amount: 1.4 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 53. Bottom Navigation — car pedal box                                      */
/* -------------------------------------------------------------------------- */

function pedalPad(
  x: number,
  group: string,
  accent: boolean,
): FigureFace[] {
  const faces: FigureFace[] = [];
  faces.push(
    face3(vRound(x, -9, 8, 22, 24, 3), { tone: "edge", group }),
  );

  for (let rib = 0; rib < 4; rib += 1) {
    const z = 12 + rib * 4.2;
    faces.push(
      stroke3(
        [
          [x - 8, -9.3, z],
          [x + 8, -9.3, z],
        ],
        "lo",
        { group },
      ),
    );
  }

  if (accent) {
    faces.push(
      face3(vRound(x, -9.6, 14, 14, 11, 2.4), {
        fill: false,
        tone: "hi",
        group,
      }),
    );
  }
  return faces;
}

function bottomNavigationFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The pedal shaft: one bar, two end cheeks, no base plate. */
  faces.push(
    ...box(-46, -3.4, 54, 92, 6.8, 6.8, {
      r: 3,
      tone: "edge",
      topTone: "mid",
    }),
  );
  for (const side of [-46, 46] as const) {
    faces.push(
      ...box(side - 4, -4, 52, 8, 8, 10, {
        r: 2,
        tone: "mid",
        topTone: "lo",
      }),
    );
  }

  const pedals: Array<{ x: number; group: string; accent: boolean }> = [
    { x: -30, group: "pedal-1", accent: false },
    { x: 0, group: "pedal-2", accent: true },
    { x: 30, group: "pedal-3", accent: false },
  ];
  for (const pedal of pedals) {
    faces.push(
      tube(
        [
          [pedal.x - 5, 0, 56],
          [pedal.x - 5, -9, 31],
        ],
        2.4,
        { tone: "edge", group: pedal.group },
      ),
      tube(
        [
          [pedal.x + 5, 0, 56],
          [pedal.x + 5, -9, 31],
        ],
        2.4,
        { tone: "edge", group: pedal.group },
      ),
      ...pedalPad(pedal.x, pedal.group, pedal.accent),
    );
  }

  /* Shaft end caps. */
  for (const side of [-49.4, 49.4] as const) {
    const [cx, cy] = iso(side, 0, 57.4);
    faces.push(
      face2(circle(cx, cy, 4.4, 20), { tone: "mid" }),
      face2(circle(cx, cy, 2.2, 16), { fill: false, tone: "lo" }),
    );
  }

  return faces;
}

export const bottomNavigation: PrototypeMeta = {
  slug: "bottom-navigation",
  name: "Bottom Navigation",
  component: "Bottom Navigation",
  object: "Car pedal box",
  story:
    "The middle pedal goes down while the other two ease up, then the set settles.",
  note: "Primary destinations sit under the foot, all reachable without looking away.",
  scene: figureScene({
    slug: "bottom-navigation",
    name: "Bottom Navigation",
    component: "Navigation",
    object: "Car pedal box",
    description:
      "A car pedal box hanging from a shaft: three ribbed pedal pads on their arms, the middle one marked.",
    aria:
      "An isometric car pedal box: a single shaft carrying three ribbed pedals on hanging arms, with the middle pad highlighted.",
    faces: bottomNavigationFaces(),
    motions: [
      { group: "pedal-1", kind: "bob", period: 2400, amount: -1.6 },
      { group: "pedal-2", kind: "bob", period: 2400, amount: -4.2, phase: 0.1 },
      { group: "pedal-3", kind: "bob", period: 2400, amount: -1.6, phase: 0.2 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 54. Bubble — balloon                                                       */
/* -------------------------------------------------------------------------- */

function bubbleFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [cx, cy] = iso(0, 0, 58);

  const outline: Point2[] = [];
  for (let index = 0; index < 52; index += 1) {
    const a = (index / 52) * TAU;
    const taper = 1 - 0.64 * Math.pow(Math.max(0, Math.sin(a)), 1.7);
    const r = 31 * taper;
    outline.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 1.1]);
  }
  faces.push(face2(outline, { tone: "edge", group: "balloon" }));

  /* Two long seams and a short highlight crescent. */
  faces.push(
    face2(
      [
        [cx - 1, cy - 33],
        [cx - 5, cy - 12],
        [cx - 4, cy + 9],
        [cx - 1, cy + 19],
      ],
      { fill: false, tone: "lo", group: "balloon" },
    ),
    face2(
      [
        [cx + 12, cy - 26],
        [cx + 16, cy - 8],
        [cx + 14, cy + 10],
      ],
      { fill: false, tone: "lo", group: "balloon" },
    ),
  );

  const glint: Point2[] = [];
  for (let index = 0; index <= 10; index += 1) {
    const t = index / 10;
    glint.push([
      cx - 18 + t * 3,
      cy - 26 + Math.sin(t * Math.PI) * 8 - t * 9,
    ]);
  }
  faces.push(
    face2(glint, { fill: false, tone: "hi", group: "glint" }),
    face2(
      [
        [cx - 15, cy - 24],
        [cx - 9, cy - 25],
        [cx - 9, cy - 17],
        [cx - 14, cy - 16],
      ],
      { fill: false, tone: "mid", group: "glint" },
    ),
  );

  /* Tied neck and knot. */
  faces.push(
    face2(
      [
        [cx - 8, cy + 17],
        [cx + 8, cy + 17],
        [cx + 3, cy + 25],
        [cx - 3, cy + 25],
      ],
      { tone: "edge", group: "balloon" },
    ),
    face2(
      [
        [cx - 5, cy + 24],
        [cx + 1, cy + 24],
        [cx - 2, cy + 30],
        [cx - 7, cy + 28],
      ],
      { tone: "mid", group: "balloon" },
    ),
  );

  /* String: a loose curl down to the surface. */
  const stringPoints: Point2[] = [];
  for (let index = 0; index <= 36; index += 1) {
    const t = index / 36;
    stringPoints.push([
      cx + Math.sin(t * Math.PI * 2.8) * 2.6 * (0.2 + t),
      cy + 30 + t * 56,
    ]);
  }
  faces.push(
    face2(stringPoints, {
      fill: false,
      tone: "mid",
      group: "balloon",
    }),
  );

  return faces;
}

export const bubble: PrototypeMeta = {
  slug: "bubble",
  name: "Bubble",
  component: "Bubble",
  object: "Balloon",
  story:
    "The balloon leans on its string and turns its reflection toward the reader.",
  note: "A bubble is a thought that floats free of the body, held by a single thread.",
  scene: figureScene({
    slug: "bubble",
    name: "Bubble",
    component: "AI",
    object: "Balloon",
    description:
      "A single balloon above its curled string: a tapered envelope, a tied neck and a bright glint.",
    aria:
      "An isometric balloon: a tapered envelope with a tied knot and a curling string, and a bright glint on its shoulder.",
    faces: bubbleFaces(),
    motions: [
      {
        group: "balloon",
        kind: "sway",
        period: 3400,
        amount: 2.6,
        pivot: [0, 0, 34],
      },
      { group: "glint", kind: "flicker", period: 2600, amount: 0.16 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 55. Chips — poker chip stack                                               */
/* -------------------------------------------------------------------------- */

function chipsFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const count = 6;
  const offsets = [
    [0, 0],
    [1.4, -0.8],
    [-1, 1],
    [0.8, 0.4],
    [-0.6, -1.1],
    [1.1, 0.6],
  ] as const;

  for (let index = 0; index < count; index += 1) {
    const [ox, oy] = offsets[index];
    const z = index * 6;
    const top = index === count - 1;
    const group = top ? "chip-top" : "chip-stack";
    faces.push(
      ...cylinder(ox, oy, z, 6, 26, 26, {
        tone: index % 2 === 0 ? "edge" : "mid",
        topTone: "lo",
        sides: 40,
        group,
      }),
    );

    for (let stripe = 0; stripe < 6; stripe += 1) {
      const a = (stripe / 6) * TAU + 0.2;
      if (Math.sin(a) + Math.cos(a) < -0.1) continue;
      const sx = ox + Math.cos(a) * 26.3;
      const sy = oy + Math.sin(a) * 26.3;
      faces.push(
        stroke3(
          [
            [sx, sy, z + 1],
            [sx, sy, z + 5],
          ],
          "lo",
          { group },
        ),
      );
    }
  }

  const topZ = (count - 1) * 6 + 6;
  faces.push(
    ellipse3(1.1, 0.6, topZ + 0.2, 19, 19, {
      fill: false,
      tone: "mid",
      group: "chip-top",
    }),
    ellipse3(1.1, 0.6, topZ + 0.3, 10, 10, {
      tone: "edge",
      group: "chip-top",
    }),
    ellipse3(1.1, 0.6, topZ + 0.5, 5.6, 5.6, {
      tone: "hi",
      group: "chip-top",
    }),
  );

  for (const a of [0.4, 1.9, 3.5, 5.1]) {
    const [mx, my] = iso(
      1.1 + Math.cos(a) * 14.5,
      0.6 + Math.sin(a) * 14.5,
      topZ + 0.4,
    );
    faces.push(
      face2(circle(mx, my, 1.8, 14), {
        tone: "lo",
        group: "chip-top",
      }),
    );
  }

  return faces;
}

export const chips: PrototypeMeta = {
  slug: "chips",
  name: "Chips",
  component: "Chips",
  object: "Poker chip stack",
  story:
    "The top chip slides up a fraction and the whole stack presses together.",
  note: "Small values add up: one chip is a token, many are a stake.",
  scene: figureScene({
    slug: "chips",
    name: "Chips",
    component: "Inputs",
    object: "Poker chip stack",
    description:
      "A stack of eight poker chips with striped rims; the top chip carries a bright centre.",
    aria:
      "An isometric stack of eight poker chips with striped edges and a highlighted top chip with a bright centre.",
    faces: chipsFaces(),
    motions: [
      { group: "chip-top", kind: "lift", period: 2600, amount: 4.4 },
      {
        group: "chip-top",
        kind: "sway",
        period: 3400,
        amount: 1.6,
        pivot: [0, 0, 34],
      },
      { group: "chip-stack", kind: "breathe", period: 2600, amount: 0.006 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 56. Context Menu — Swiss army knife                                        */
/* -------------------------------------------------------------------------- */

function contextMenuFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The body is a rounded slab lying on the ground; no base under it. */
  faces.push(
    ...box(-38, -9, 0, 66, 18, 10, {
      r: 8,
      tone: "edge",
      topTone: "mid",
    }),
  );
  faces.push(
    stroke3(
      [
        [-30, -6.2, 10.4],
        [24, -6.2, 10.4],
      ],
      "lo",
    ),
    stroke3(
      [
        [-30, 6.2, 10.4],
        [24, 6.2, 10.4],
      ],
      "lo",
    ),
  );

  /* The maker's shield and cross inlaid on the top face: the one bright mark. */
  faces.push(
    face2(
      roundedRect(-9, -6.5, 18, 13, 4, 4).map(
        ([x, y]): Point2 => iso(x, y, 10.5),
      ),
      { tone: "mid", group: "emblem" },
    ),
    tube(
      [
        [-6, -3.4, 10.6],
        [6, -3.4, 10.6],
      ],
      3.4,
      { tone: "hi", group: "emblem" },
    ),
    tube(
      [
        [0, -8.4, 10.6],
        [0, 1.6, 10.6],
      ],
      3.4,
      { tone: "hi", group: "emblem" },
    ),
  );

  /* Hinge pin. */
  faces.push(
    ellipse3(28, 0, 10.6, 5.4, 5.4, { tone: "mid" }),
    ellipse3(28, 0, 10.8, 2, 2, { tone: "lo" }),
  );

  /* The main blade: one cut-out, with an off-set rim for thickness. */
  const bladeBack: Point3[] = [
    [28, 2.4, 10],
    [68, 2.4, 40],
    [60, 2.4, 46],
    [30, 2.4, 18],
  ];
  const bladeFront: Point3[] = [
    [28, -0.6, 10],
    [68, -0.6, 40],
    [60, -0.6, 46],
    [30, -0.6, 18],
  ];
  faces.push(
    face3(bladeBack, { fill: false, tone: "lo", group: "blade" }),
    face3(bladeFront, { tone: "edge", group: "blade" }),
    stroke3(
      [
        [34, -0.6, 18],
        [62, -0.6, 39],
      ],
      "mid",
      { group: "blade" },
    ),
    stroke3(
      [
        [42, -0.6, 27],
        [47, -0.6, 30],
      ],
      "lo",
      { group: "blade" },
    ),
    stroke3(
      [
        [28, -0.6, 10],
        [28, 2.4, 10],
      ],
      "mid",
      { group: "blade" },
    ),
  );

  return faces;
}

export const contextMenu: PrototypeMeta = {
  slug: "context-menu",
  name: "Context Menu",
  component: "Context Menu",
  object: "Swiss army knife",
  story:
    "The main blade swings out of the body and locks with a small click.",
  note: "One compact body holds many tools, opened exactly where they are needed.",
  scene: figureScene({
    slug: "context-menu",
    name: "Context Menu",
    component: "Overlays",
    object: "Swiss army knife",
    description:
      "A pocket knife: a rounded body with a bright cross, a hinge, a corkscrew and a main blade opened upward.",
    aria:
      "An isometric pocket knife: a rounded body with a bright inlaid cross, a hinge pin, a corkscrew and an opened blade.",
    faces: contextMenuFaces(),
    motions: [
      {
        group: "blade",
        kind: "sway",
        period: 3000,
        amount: 7,
        pivot: [28, 0, 10],
      },
      { group: "emblem", kind: "flicker", period: 2800, amount: 0.08 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 57. Copy Button — photocopier                                              */
/* -------------------------------------------------------------------------- */

function copyButtonFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Feet and body. */
  for (const x of [-32, 32]) {
    faces.push(
      ...box(x - 5, 22, 0, 10, 8, 5, {
        r: 1.6,
        tone: "mid",
        topTone: "lo",
      }),
    );
  }
  faces.push(
    ...box(-44, -28, 4, 88, 56, 30, {
      r: 4,
      tone: "edge",
      topTone: "mid",
    }),
  );

  /* Front control strip with three buttons, the middle one lit. */
  faces.push(
    ...box(-40, 20, 34, 80, 6, 5, {
      r: 1.6,
      tone: "edge",
      topTone: "mid",
    }),
  );
  const buttons: Array<{ x: number; tone: DetailTone }> = [
    { x: -32, tone: "mid" },
    { x: -24, tone: "lo" },
    { x: -16, tone: "mid" },
  ];
  for (const button of buttons) {
    faces.push(
      ...cylinder(button.x, 23, 39, 3, 3, 2.6, {
        tone: button.tone,
        topTone: "lo",
      }),
    );
  }

  /* Lid: a raised platen with a glass window and a hinge along the back. */
  faces.push(
    ...box(-40, -24, 34, 80, 48, 4, {
      r: 3,
      tone: "edge",
      topTone: "mid",
      group: "lid",
    }),
    face3(
      [
        [-32, -18, 38.3],
        [32, -18, 38.3],
        [32, 18, 38.3],
        [-32, 18, 38.3],
      ],
      { tone: "lo", group: "lid" },
    ),
    stroke3(
      [
        [-36, 22, 38.4],
        [36, 22, 38.4],
      ],
      "mid",
      { group: "lid" },
    ),
    tube(
      [
        [-40, -24.5, 38],
        [40, -24.5, 38],
      ],
      2.4,
      { tone: "mid", group: "lid" },
    ),
  );

  /* Scanner carriage under the glass: the bright bar that travels. */
  faces.push(
    face3(
      [
        [-30, -5, 38.6],
        [26, -5, 38.6],
        [26, -1, 38.6],
        [-30, -1, 38.6],
      ],
      { tone: "hi", group: "carriage" },
    ),
  );

  /* Output slot and a fresh copy sliding out toward the viewer. */
  faces.push(
    face3(
      [
        [-30, 28.2, 12],
        [8, 28.2, 12],
        [8, 28.2, 17],
        [-30, 28.2, 17],
      ],
      { fill: false, tone: "edge" },
    ),
    face3(
      [
        [-28, 28.4, 10],
        [6, 28.4, 10],
        [13, 45, 14],
        [-21, 45, 14],
      ],
      { tone: "edge", group: "copy" },
    ),
    stroke3(
      [
        [-24, 28.5, 12.4],
        [9, 43, 14.6],
      ],
      "lo",
      { group: "copy" },
    ),
    stroke3(
      [
        [-24, 28.5, 14],
        [9, 43, 15.6],
      ],
      "lo",
      { group: "copy" },
    ),
  );

  /* Side vent lines. */
  for (let index = 0; index < 4; index += 1) {
    const y = -12 + index * 6;
    faces.push(
      stroke3(
        [
          [-44.1, y, 14],
          [-44.1, y, 24],
        ],
        "lo",
      ),
    );
  }

  return faces;
}

export const copyButton: PrototypeMeta = {
  slug: "copy-button",
  name: "Copy Button",
  component: "Copy Button",
  object: "Photocopier",
  story:
    "The lid settles, the scanner bar blinks across the glass and a copy slides out.",
  note: "Copying is a physical promise: the same sheet, produced again in front of you.",
  scene: figureScene({
    slug: "copy-button",
    name: "Copy Button",
    component: "Controls",
    object: "Photocopier",
    description:
      "A desktop photocopier: a boxy body, three control buttons, a glass platen under its lid and a fresh copy in the output slot.",
    aria:
      "An isometric photocopier: a body with three control buttons, a platen lid over a glass window, a bright scanner bar and a copy sliding out.",
    faces: copyButtonFaces(),
    motions: [
      {
        group: "lid",
        kind: "sway",
        period: 3200,
        amount: 3.4,
        pivot: [0, -24, 38],
      },
      { group: "carriage", kind: "flicker", period: 2200, amount: 0.06 },
      { group: "copy", kind: "lift", period: 3200, amount: 3.4 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 58. Dropdown Menu — hanging file folder                                    */
/* -------------------------------------------------------------------------- */

function dropdownMenuFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Back cover, its tab and the two hanging rails. */
  faces.push(
    ...box(-38, -12, 0, 76, 3, 46, {
      r: 2,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-17, -12, 46, 32, 3, 8, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "tab",
    }),
    tube(
      [
        [-44, -10, 44],
        [-24, -10, 44],
      ],
      2,
      { tone: "mid" },
    ),
    tube(
      [
        [24, -10, 44],
        [44, -10, 44],
      ],
      2,
      { tone: "mid" },
    ),
  );

  /* A bright label on the tab. */
  faces.push(
    face3(
      [
        [-13, -9.4, 50],
        [11, -9.4, 50],
        [11, -9.4, 53],
        [-13, -9.4, 53],
      ],
      { tone: "hi", group: "tab" },
    ),
  );

  /* Three loose sheets inside. */
  const sheets = [
    { y: -8, z0: 2, h: 38, tone: "mid" as DetailTone },
    { y: -4, z0: 2, h: 40, tone: "lo" as DetailTone },
    { y: 0, z0: 2, h: 36, tone: "mid" as DetailTone },
  ];
  for (const sheet of sheets) {
    faces.push(
      panel(-34, 34, sheet.y, sheet.z0, sheet.z0 + sheet.h, {
        tone: sheet.tone,
      }),
    );
  }
  for (let line = 0; line < 5; line += 1) {
    const z = 8 + line * 5;
    faces.push(
      stroke3(
        [
          [-28, 0.4, z],
          [28, 0.4, z],
        ],
        "lo",
      ),
    );
  }

  /* Front cover, hinged at its bottom edge and leaning toward the reader. */
  faces.push(
    face3(
      [
        [-38, 7, 2],
        [38, 7, 2],
        [38, 17, 30],
        [-38, 17, 30],
      ],
      { tone: "edge", group: "front" },
    ),
    stroke3(
      [
        [-38, 17, 30],
        [38, 17, 30],
      ],
      "mid",
      { group: "front" },
    ),
    stroke3(
      [
        [38, 7, 2],
        [38, 17, 30],
      ],
      "mid",
      { group: "front" },
    ),
  );

  /* A small label on the front cover. */
  const [fx, fy] = iso(-8, 17.2, 20);
  faces.push(
    face2(
      [
        [fx - 7, fy - 2],
        [fx + 7, fy - 2],
        [fx + 7, fy + 2],
        [fx - 7, fy + 2],
      ],
      { tone: "lo", group: "front" },
    ),
  );

  return faces;
}

export const dropdownMenu: PrototypeMeta = {
  slug: "dropdown-menu",
  name: "Dropdown Menu",
  component: "Dropdown Menu",
  object: "Hanging file folder",
  story:
    "The front cover falls open and the tab lifts, showing the sheets inside.",
  note: "Options live hidden in a labelled pocket until the folder opens.",
  scene: figureScene({
    slug: "dropdown-menu",
    name: "Dropdown Menu",
    component: "Overlays",
    object: "Hanging file folder",
    description:
      "A hanging file folder with a raised tab, two rails, three sheets inside and its front cover leaning open.",
    aria:
      "An isometric hanging file folder: a tall back cover with a bright tab and rails, three sheets inside and an open front cover.",
    faces: dropdownMenuFaces(),
    motions: [
      {
        group: "front",
        kind: "sway",
        period: 3000,
        amount: 7,
        pivot: [0, 7, 2],
      },
      { group: "tab", kind: "lift", period: 3000, amount: 2 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 59. Empty — bird's nest                                                    */
/* -------------------------------------------------------------------------- */

function emptyFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The bowl: three stacked frustums make a rounded woven body. */
  faces.push(
    ...cylinder(0, 0, 4, 11, 18, 27, {
      tone: "edge",
      topTone: "lo",
      sides: 40,
      bottomArc: true,
    }),
    ...cylinder(0, 0, 15, 12, 27, 36, {
      tone: "edge",
      topTone: "lo",
      sides: 40,
    }),
    ...cylinder(0, 0, 27, 12, 36, 44, {
      tone: "edge",
      topTone: "mid",
      sides: 40,
    }),
    ellipse3(0, 0, 38.6, 34, 34, { tone: "lo", group: "nest" }),
    ellipse3(0, 0, 39, 29, 29, {
      fill: false,
      tone: "mid",
      group: "nest",
    }),
    ellipse3(0, 0, 36, 23, 23, {
      fill: false,
      tone: "lo",
      group: "nest",
    }),
  );

  /* Weave bands and crossing twigs over the front of the body. */
  for (const band of [
    { z: 10, r: 22 },
    { z: 18, r: 31 },
    { z: 26, r: 37 },
  ]) {
    faces.push(
      ellipse3(0, 0, band.z, band.r, band.r, {
        fill: false,
        tone: "lo",
        group: "nest",
      }),
    );
  }
  for (let index = 0; index < 38; index += 1) {
    const a = ((index + 0.5) / 38) * TAU;
    if (Math.sin(a) + Math.cos(a) < -0.35) continue;
    const z = 8 + ((index * 11) % 27);
    const r =
      z < 15 ? 18 + (z - 4) * 0.82 : z < 27 ? 27 + (z - 15) * 0.75 : 36 + (z - 27) * 0.67;
    const x0 = Math.cos(a) * r;
    const y0 = Math.sin(a) * r;
    faces.push(
      stroke3(
        [
          [x0 - 4, y0 + 2, z],
          [x0 + 5, y0 - 3, z + 5],
        ],
        index % 3 === 0 ? "mid" : "lo",
        { group: "nest" },
      ),
    );
  }

  /* Radial twigs across the rim. */
  for (let index = 0; index < 34; index += 1) {
    const a = (index / 34) * TAU;
    if (Math.sin(a) + Math.cos(a) < -0.3) continue;
    faces.push(
      stroke3(
        [
          [
            Math.cos(a) * 34,
            Math.sin(a) * 34,
            38.8,
          ],
          [
            Math.cos(a + 0.08) * 44,
            Math.sin(a + 0.08) * 44,
            39.2,
          ],
        ],
        index % 4 === 0 ? "mid" : "lo",
        { group: "nest" },
      ),
    );
  }

  /* Twig ends poking above the rim. */
  for (let index = 0; index < 11; index += 1) {
    const a = -0.5 + (index / 10) * Math.PI * 1.4;
    const x = Math.cos(a) * 41;
    const y = Math.sin(a) * 41;
    faces.push(
      tube(
        [
          [x, y, 37],
          [x + Math.cos(a) * 8, y + Math.sin(a) * 8, 43 + (index % 3) * 2],
        ],
        1.4,
        { tone: "mid", group: "nest" },
      ),
    );
  }

  /* One fresh twig laid on the near rim, with a leaf: the active part. */
  faces.push(
    tube(
      [
        [-32, 20, 40],
        [-8, 33, 41],
        [18, 35, 40],
      ],
      1.6,
      { tone: "hi", group: "twig" },
    ),
    face2(
      [iso(14, 34, 41), iso(23, 42, 42), iso(27, 34, 41)],
      { tone: "hi", group: "twig" },
    ),
    face2(
      [iso(14, 34, 41), iso(27, 34, 41), iso(22, 30, 40)],
      { tone: "hi", group: "twig" },
    ),
    stroke3(
      [
        [14, 34, 41],
        [27, 34, 41],
      ],
      "lo",
      { group: "twig" },
    ),
  );

  return faces;
}

export const empty: PrototypeMeta = {
  slug: "empty",
  name: "Empty",
  component: "Empty",
  object: "Bird's nest",
  story:
    "A last twig settles on the rim and the woven bowl breathes once.",
  note: "An empty state still has a shape and a purpose: it is a bowl waiting for its content.",
  scene: figureScene({
    slug: "empty",
    name: "Empty",
    component: "Feedback",
    object: "Bird's nest",
    description:
      "A woven bird's nest with a deep hollow, twigs crossing the front and one fresh twig resting on the rim.",
    aria:
      "An isometric bird's nest: a woven bowl with a deep hollow, twig texture and one fresh twig highlighted on the rim.",
    faces: emptyFaces(),
    motions: [
      { group: "twig", kind: "lift", period: 2800, amount: 2.4 },
      { group: "nest", kind: "breathe", period: 3600, amount: 0.006 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 60. File Drop — paper tray                                                 */
/* -------------------------------------------------------------------------- */

function fileDropFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* A wire tray: four posts, top rails and a few bottom wires. */
  const corners: Array<[number, number]> = [
    [-34, -22],
    [34, -22],
    [34, 22],
    [-34, 22],
  ];
  for (const [x, y] of corners) {
    faces.push(post(x, y, 0, 20, 1.8, "edge"));
    const [cx, cy] = iso(x, y, 20);
    faces.push(face2(circle(cx, cy, 2.6, 14), { tone: "mid" }));
  }
  faces.push(
    tube(
      [
        [-34, -22, 20],
        [34, -22, 20],
      ],
      1.8,
      { tone: "edge" },
    ),
    tube(
      [
        [-34, 22, 20],
        [34, 22, 20],
      ],
      1.8,
      { tone: "edge" },
    ),
    tube(
      [
        [-34, -22, 20],
        [-34, 22, 20],
      ],
      1.8,
      { tone: "mid" },
    ),
    tube(
      [
        [34, -22, 20],
        [34, 22, 20],
      ],
      1.8,
      { tone: "mid" },
    ),
  );
  for (const y of [-16, -8, 0, 8, 16]) {
    faces.push(
      tube(
        [
          [-34, y, 2.4],
          [34, y, 2.4],
        ],
        1.4,
        { tone: "lo" },
      ),
    );
  }

  /* The stack already in the tray. */
  for (let index = 0; index < 3; index += 1) {
    faces.push(
      ...box(-29, -18, 4 + index * 1.8, 58, 36, 1.4, {
        r: 1,
        tone: index === 2 ? "mid" : "lo",
        topTone: "lo",
        group: "stack",
      }),
    );
  }
  faces.push(
    stroke3(
      [
        [-23, -12, 10],
        [23, -12, 10],
      ],
      "lo",
      { group: "stack" },
    ),
    stroke3(
      [
        [-23, -4, 10],
        [23, -4, 10],
      ],
      "lo",
      { group: "stack" },
    ),
    stroke3(
      [
        [-23, 4, 10],
        [14, 4, 10],
      ],
      "lo",
      { group: "stack" },
    ),
  );
  /* A sheet arriving above the tray, one corner already turned. */
  faces.push(
    face3(
      [
        [-25, -16, 28],
        [25, -20, 31],
        [29, 12, 29],
        [-21, 16, 26],
      ],
      { tone: "edge", group: "incoming" },
    ),
    face3(
      [
        [25, -20, 31],
        [17, -23, 30.5],
        [23, -14, 31.4],
      ],
      { tone: "hi", group: "incoming" },
    ),
    stroke3(
      [
        [25, -20, 31.1],
        [17, -23, 30.6],
      ],
      "lo",
      { group: "incoming" },
    ),
    stroke3(
      [
        [-18, -10, 28.6],
        [21, -13, 31.2],
      ],
      "lo",
      { group: "incoming" },
    ),
    stroke3(
      [
        [-17, -2, 28.1],
        [22, -5, 30.7],
      ],
      "lo",
      { group: "incoming" },
    ),
  );

  return faces;
}

export const fileDrop: PrototypeMeta = {
  slug: "file-drop",
  name: "File Drop",
  component: "File Drop",
  object: "Paper tray",
  story:
    "The waiting sheet dips into the tray and the stack compresses under it.",
  note: "A drop zone is an open tray: its emptiness is an invitation to deposit.",
  scene: figureScene({
    slug: "file-drop",
    name: "File Drop",
    component: "Inputs",
    object: "Paper tray",
    description:
      "An open wire paper tray holding a ruled stack, with a loose sheet hovering above it.",
    aria:
      "An isometric wire paper tray with four corner posts, a ruled stack inside and a loose sheet dropping toward it.",
    faces: fileDropFaces(),
    motions: [
      { group: "incoming", kind: "bob", period: 2400, amount: 5.4 },
      { group: "stack", kind: "breathe", period: 2400, amount: 0.006 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 61. GitHub Stars — firefly jar                                             */
/* -------------------------------------------------------------------------- */

function githubStarsFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Glass jar as open strokes, so the fireflies stay visible inside. */
  faces.push(
    ellipse3(0, 0, 3, 24, 24, { fill: false, tone: "edge" }),
    ellipse3(0, 0, 47, 24, 24, { fill: false, tone: "edge" }),
    ellipse3(0, 0, 51, 18, 18, { fill: false, tone: "mid" }),
    ellipse3(0, 0, 47, 22, 22, { fill: false, tone: "lo" }),
  );
  for (const a of [0.35, 1.15, 1.95, 2.75]) {
    const x = Math.cos(a) * 24;
    const y = Math.sin(a) * 24;
    faces.push(stroke3([[x, y, 3], [x, y, 47]], "edge"));
    const nx = Math.cos(a) * 18;
    const ny = Math.sin(a) * 18;
    faces.push(stroke3([[x, y, 47], [nx, ny, 51]], "mid"));
  }
  faces.push(
    stroke3(
      [
        [-13, 14.4, 8],
        [-15, 12, 24],
        [-13, 8, 40],
      ],
      "lo",
    ),
  );

  /* The lid: a ridged cap with a small knob. */
  faces.push(
    ...cylinder(0, 0, 51, 5.5, 21, 21, {
      tone: "edge",
      topTone: "mid",
      group: "lid",
    }),
  );
  for (let index = 0; index < 14; index += 1) {
    const a = (index / 14) * TAU;
    if (Math.sin(a) + Math.cos(a) < -0.2) continue;
    const x = Math.cos(a) * 21.2;
    const y = Math.sin(a) * 21.2;
    faces.push(
      stroke3([[x, y, 51.6], [x, y, 55.8]], "lo", { group: "lid" }),
    );
  }
  faces.push(
    ...cylinder(0, 0, 56.5, 3, 5, 4, {
      tone: "mid",
      topTone: "lo",
      group: "lid",
    }),
  );

  /* Fireflies: one brighter than the others. */
  const flies: Array<{
    x: number;
    y: number;
    z: number;
    tone: DetailTone;
    group: string;
  }> = [
    { x: -9, y: 6, z: 18, tone: "hi", group: "fly-1" },
    { x: 6, y: -9, z: 26, tone: "mid", group: "fly-2" },
    { x: 11, y: 5, z: 37, tone: "mid", group: "fly-3" },
    { x: -5, y: 2, z: 32, tone: "lo", group: "fly-4" },
    { x: -12, y: -4, z: 42, tone: "mid", group: "fly-5" },
    { x: 9, y: -2, z: 15, tone: "lo", group: "fly-6" },
    { x: 1, y: 9, z: 44, tone: "mid", group: "fly-7" },
  ];
  for (const fly of flies) {
    const [fx, fy] = iso(fly.x, fly.y, fly.z);
    faces.push(
      face2(circle(fx, fy, 2.2, 16), { tone: fly.tone, group: fly.group }),
      face2(circle(fx, fy, 4, 20), {
        fill: false,
        tone: "lo",
        group: fly.group,
      }),
      stroke2(
        [
          [fx - 1.6, fy - 1.4],
          [fx - 4.6, fy - 3.8],
        ],
        "lo",
        { group: fly.group },
      ),
      stroke2(
        [
          [fx + 1.6, fy - 1.4],
          [fx + 4.6, fy - 3.8],
        ],
        "lo",
        { group: fly.group },
      ),
    );
  }

  return faces;
}

export const githubStars: PrototypeMeta = {
  slug: "github-stars",
  name: "GitHub Stars",
  component: "GitHub Stars",
  object: "Firefly jar",
  story:
    "The fireflies blink in a slow wave and the brightest one leads them.",
  note: "Many small marks of approval, gathered like fireflies in one jar.",
  scene: figureScene({
    slug: "github-stars",
    name: "GitHub Stars",
    component: "Controls",
    object: "Firefly jar",
    description:
      "A glass jar with a ridged lid holding seven fireflies, one of them brighter than the rest.",
    aria:
      "An isometric glass jar with a ridged lid and seven small fireflies inside, the brightest one highlighted.",
    faces: githubStarsFaces(),
    motions: [
      { group: "fly-1", kind: "flicker", period: 2400, amount: 0.24 },
      { group: "fly-2", kind: "flicker", period: 2400, amount: 0.22, phase: 0.12 },
      { group: "fly-3", kind: "flicker", period: 2400, amount: 0.2, phase: 0.24 },
      { group: "fly-4", kind: "flicker", period: 2400, amount: 0.22, phase: 0.36 },
      { group: "fly-5", kind: "flicker", period: 2400, amount: 0.2, phase: 0.48 },
      { group: "fly-6", kind: "flicker", period: 2400, amount: 0.24, phase: 0.6 },
      { group: "fly-7", kind: "flicker", period: 2400, amount: 0.2, phase: 0.72 },
      { group: "lid", kind: "breathe", period: 3600, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 62. Hover Card — periscope                                                 */
/* -------------------------------------------------------------------------- */

function hoverCardFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The mast tube, its collars and the front eyepiece. */
  faces.push(
    ...cylinder(0, 0, 3, 50, 7, 7, {
      tone: "edge",
      topTone: "mid",
      sides: 28,
    }),
    ...cylinder(0, 0, 9, 3, 8.6, 8.2, {
      tone: "mid",
      topTone: "lo",
    }),
    ...cylinder(0, 0, 30, 3, 8.4, 8, {
      tone: "mid",
      topTone: "lo",
    }),
    tube(
      [
        [0, 6, 17],
        [0, 14, 17],
      ],
      11,
      { tone: "mid" },
    ),
    disc3(0, 14.5, 17, 5.6, "xz", { tone: "edge" }),
    disc3(0, 14.7, 17, 2.8, "xz", { fill: false, tone: "lo" }),
    disc3(0, 14.8, 17, 6.8, "xz", { fill: false, tone: "mid" }),
  );

  /* The head: an elbow with a front window and a top mirror. */
  faces.push(
    ...box(-10, -26, 50, 20, 34, 14, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "head",
    }),
    face3(
      [
        [-7, 8.1, 53],
        [7, 8.1, 53],
        [7, 8.1, 61],
        [-7, 8.1, 61],
      ],
      { tone: "lo", group: "head" },
    ),
    face3(
      [
        [-7, -21, 64.1],
        [7, -21, 64.1],
        [7, -7, 64.1],
        [-7, -7, 64.1],
      ],
      { tone: "lo", group: "head" },
    ),
    stroke3(
      [
        [-5.6, 8.2, 54],
        [5.6, 8.2, 56.4],
      ],
      "hi",
      { group: "mirror" },
    ),
    stroke3(
      [
        [-5.6, 8.2, 57.6],
        [5.6, 8.2, 60],
      ],
      "mid",
      { group: "mirror" },
    ),
    stroke3(
      [
        [-5.6, -19, 64.2],
        [5.6, -9, 64.2],
      ],
      "hi",
      { group: "mirror" },
    ),
    disc3(10.1, -9, 57, 2.8, "yz", { tone: "mid", group: "head" }),
    disc3(10.1, -9, 57, 1.2, "yz", {
      fill: false,
      tone: "lo",
      group: "head",
    }),
  );

  /* Range knob on the side of the tube. */
  faces.push(
    ...cylinder(7, 0, 27, 2.4, 3, 3, {
      tone: "mid",
      topTone: "lo",
    }),
    stroke3(
      [
        [8.4, 0, 28.2],
        [11.4, 0, 28.2],
      ],
      "edge",
    ),
  );

  return faces;
}

export const hoverCard: PrototypeMeta = {
  slug: "hover-card",
  name: "Hover Card",
  component: "Hover Card",
  object: "Periscope",
  story:
    "The head rises above the edge and its mirror catches a strip of light.",
  note: "A hover card lets you look over the surface without leaving your place.",
  scene: figureScene({
    slug: "hover-card",
    name: "Hover Card",
    component: "Overlays",
    object: "Periscope",
    description:
      "A periscope standing on its mast: a ringed tube with a front eyepiece and an elbow head with a front window and a top mirror.",
    aria:
      "An isometric periscope: a collared mast with a front eyepiece and an elbow head showing a front window and a top mirror.",
    faces: hoverCardFaces(),
    motions: [
      { group: "head", kind: "lift", period: 3000, amount: 4 },
      {
        group: "head",
        kind: "sway",
        period: 3800,
        amount: 2,
        pivot: [0, 0, 50],
      },
      { group: "mirror", kind: "flicker", period: 2400, amount: 0.12 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 63. KPI Counter — taxi meter                                               */
/* -------------------------------------------------------------------------- */

function kpiCounterFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Foot, stem and body. */
  faces.push(
    ...cylinder(0, 0, 0, 3.5, 12, 11, {
      tone: "mid",
      topTone: "lo",
      bottomArc: true,
    }),
    ...cylinder(0, 0, 3.5, 14, 3, 3, { tone: "edge", topTone: "lo" }),
    ...box(-22, -16, 17.5, 44, 32, 30, {
      r: 3,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-18, -13, 47.5, 36, 26, 3.5, {
      r: 3,
      tone: "edge",
      topTone: "mid",
    }),
  );

  /* The fare window: a bright frame with three digit cells. */
  faces.push(
    face3(
      [
        [-18, 16.1, 32],
        [18, 16.1, 32],
        [18, 16.1, 43],
        [-18, 16.1, 43],
      ],
      { tone: "edge" },
    ),
    face3(
      [
        [-15.5, 16.2, 33.5],
        [15.5, 16.2, 33.5],
        [15.5, 16.2, 41.5],
        [-15.5, 16.2, 41.5],
      ],
      { tone: "mid", group: "digits" },
    ),
  );
  for (const x of [-5.2, 5.2]) {
    faces.push(
      stroke3(
        [
          [x, 16.3, 34],
          [x, 16.3, 41],
        ],
        "mid",
        { group: "digits" },
      ),
    );
  }
  for (const cx of [-10.4, 0, 10.4]) {
    faces.push(
      stroke3(
        [
          [cx - 2.2, 16.4, 36.5],
          [cx + 2.2, 16.4, 36.5],
        ],
        "mid",
        { group: "digits" },
      ),
      stroke3(
        [
          [cx - 2.2, 16.4, 39],
          [cx + 2.2, 16.4, 39],
        ],
        "lo",
        { group: "digits" },
      ),
      stroke3(
        [
          [cx, 16.4, 34.5],
          [cx, 16.4, 38.2],
        ],
        "lo",
        { group: "digits" },
      ),
    );
  }

  /* A speaker grille under the window. */
  for (let index = 0; index < 5; index += 1) {
    const x = -10 + index * 5;
    faces.push(
      face3(
        [
          [x, 16.2, 24],
          [x + 2, 16.2, 24],
          [x + 2, 16.2, 27],
          [x, 16.2, 27],
        ],
        { fill: false, tone: "lo" },
      ),
    );
  }

  /* The flag lever on the right side: the active part. */
  faces.push(
    ellipse3(22, 0, 38, 3.4, 3.4, { tone: "mid" }),
    tube(
      [
        [22, 0, 38],
        [34, 0, 52],
      ],
      2.2,
      { tone: "edge", group: "flag" },
    ),
    face3(
      [
        [33, 0, 50],
        [47, 0, 50],
        [47, 0, 60],
        [33, 0, 60],
      ],
      { tone: "hi", group: "flag" },
    ),
    stroke3(
      [
        [36, 0, 53],
        [44, 0, 53],
      ],
      "lo",
      { group: "flag" },
    ),
  );
  for (const side of [-1, 1]) {
    faces.push(
      face3(
        [
          [33, side * 0.9, 50],
          [47, side * 0.9, 50],
          [47, side * 0.9, 60],
          [33, side * 0.9, 60],
        ],
        { fill: false, tone: "lo", group: "flag" },
      ),
    );
  }

  return faces;
}

export const kpiCounter: PrototypeMeta = {
  slug: "kpi-counter",
  name: "KPI Counter",
  component: "KPI Counter",
  object: "Taxi meter",
  story:
    "The digit drums step up one rank and the fare flag flips over.",
  note: "A KPI is a meter you can read at a glance, with numbers that only go forward.",
  scene: figureScene({
    slug: "kpi-counter",
    name: "KPI Counter",
    component: "Data",
    object: "Taxi meter",
    description:
      "A taxi meter on its stem: a body with a bright fare window, three digit drums, a speaker grille and a flag lever.",
    aria:
      "An isometric taxi meter on a stem: a bright three-digit fare window, a speaker grille and a flag lever raised on the right.",
    faces: kpiCounterFaces(),
    motions: [
      {
        group: "flag",
        kind: "sway",
        period: 2400,
        amount: 22,
        pivot: [22, 0, 38],
      },
      { group: "digits", kind: "flicker", period: 2000, amount: 0.05 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 64. Magnetic — horseshoe magnet                                             */
/* -------------------------------------------------------------------------- */

function magneticFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The horseshoe body: one thick ribbon following the arch. */
  const path: Point3[] = [
    [-30, 0, 4],
    [-30, 0, 30],
  ];
  path.push(...arc3(0, 0, 30, 30, Math.PI, 0, "xz", 24));
  path.push([30, 0, 30], [30, 0, 4]);
  faces.push(tube(path, 15, { tone: "edge", group: "magnet" }));

  const inner: Point3[] = [
    [-19, 0, 8],
    [-19, 0, 30],
  ];
  inner.push(...arc3(0, 0, 30, 19, Math.PI, 0, "xz", 20));
  inner.push([19, 0, 30], [19, 0, 8]);
  faces.push(stroke3(inner, "mid", { group: "magnet" }));

  /* A bevel along the outer edge. */
  const outer: Point3[] = [
    [-36, 0, 6],
    [-36, 0, 30],
  ];
  outer.push(...arc3(0, 0, 30, 36, Math.PI, 0, "xz", 24));
  outer.push([36, 0, 30], [36, 0, 6]);
  faces.push(stroke3(outer, "lo", { group: "magnet" }));

  /* Both pole faces are the bright parts. */
  for (const x of [-30, 30]) {
    faces.push(
      ellipse3(x, 0, 3.6, 7.4, 7.4, { tone: "hi", group: "poles" }),
      ellipse3(x, 0, 4, 4.2, 4.2, { fill: false, tone: "mid", group: "poles" }),
    );
  }

  /* Iron filings: a few levitating near each pole, more on the surface. */
  const filings: Array<[number, number, number, number]> = [
    [-48, 0, 2, -14],
    [-52, 0, 8, -26],
    [-54, 0, 14, -34],
    [-46, 0, 18, -20],
    [48, 0, 2, 14],
    [52, 0, 8, 26],
    [54, 0, 14, 34],
    [46, 0, 18, 20],
    [-44, 0, 24, -18],
    [44, 0, 24, 18],
  ];
  for (let index = 0; index < filings.length; index += 1) {
    const [x, y, z, dx] = filings[index];
    faces.push(
      stroke3(
        [
          [x, y, z],
          [x + dx * 0.16, y, z + 7],
        ],
        index === 0 ? "hi" : "lo",
        { group: "filings" },
      ),
    );
  }
  for (let index = 0; index < 10; index += 1) {
    const side = index < 5 ? -1 : 1;
    const a = index % 5;
    const x = side * (24 + a * 5);
    const y = -12 + a * 6;
    faces.push(
      stroke3(
        [
          [x, y, 1.4],
          [x + side * 3, y - 2, 6],
        ],
        "lo",
        { group: "filings" },
      ),
    );
  }

  return faces;
}

export const magnetic: PrototypeMeta = {
  slug: "magnetic",
  name: "Magnetic",
  component: "Magnetic",
  object: "Horseshoe magnet",
  story:
    "The filings jump toward the poles and stand on end, then settle again.",
  note: "Attraction is easiest to understand when you can see what it moves.",
  scene: figureScene({
    slug: "magnetic",
    name: "Magnetic",
    component: "Interaction",
    object: "Horseshoe magnet",
    description:
      "A horseshoe magnet standing on its two poles, with iron filings standing around both ends.",
    aria:
      "An isometric horseshoe magnet with two bright pole faces and iron filings standing on end around them.",
    faces: magneticFaces(),
    motions: [
      { group: "filings", kind: "breathe", period: 2400, amount: 0.08 },
      { group: "filings", kind: "lift", period: 2400, amount: 1.8 },
      {
        group: "magnet",
        kind: "sway",
        period: 3400,
        amount: 1.6,
        pivot: [0, 0, 30],
      },
      { group: "poles", kind: "flicker", period: 2400, amount: 0.05 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 65. Marquee — zoetrope                                                     */
/* -------------------------------------------------------------------------- */

function marqueeFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Foot and spindle. */
  faces.push(
    ...cylinder(0, 0, 0, 4, 17, 15, {
      tone: "mid",
      topTone: "lo",
      bottomArc: true,
    }),
    ...cylinder(0, 0, 4, 12, 4, 4, { tone: "edge", topTone: "lo" }),
  );

  /* Drum. */
  faces.push(
    ...cylinder(0, 0, 16, 30, 40, 40, {
      tone: "edge",
      topTone: "mid",
      sides: 44,
      group: "drum",
    }),
    ellipse3(0, 0, 16, 40, 40, {
      fill: false,
      tone: "mid",
      group: "drum",
    }),
    ellipse3(0, 0, 46.2, 40, 40, {
      fill: false,
      tone: "edge",
      group: "drum",
    }),
    ellipse3(0, 0, 46.4, 33, 33, {
      fill: false,
      tone: "lo",
      group: "drum",
    }),
  );

  /* Slits and the little figures seen between them. */
  for (let index = 0; index < 16; index += 1) {
    const a = (index / 16) * TAU + 0.1;
    if (Math.sin(a) + Math.cos(a) < -0.2) continue;
    const x = Math.cos(a) * 40.3;
    const y = Math.sin(a) * 40.3;
    faces.push(
      stroke3(
        [
          [x, y, 19],
          [x, y, 43],
        ],
        "lo",
        { group: "band" },
      ),
    );

    const fa = a + TAU / 32;
    const fx = Math.cos(fa) * 38.6;
    const fy = Math.sin(fa) * 38.6;
    const bright = index === 3;
    const tone: DetailTone = bright ? "hi" : "mid";
    faces.push(
      stroke3(
        [
          [fx, fy, 26],
          [fx, fy, 33],
        ],
        tone,
        { group: "band" },
      ),
      stroke3(
        [
          [fx, fy, 30],
          [fx + 2.4, fy + 1.2, 28],
        ],
        tone,
        { group: "band" },
      ),
      stroke3(
        [
          [fx, fy, 26],
          [fx - 1.8, fy - 1.4, 23],
        ],
        tone,
        { group: "band" },
      ),
    );
    const [hx, hy] = iso(fx, fy, 34.6);
    faces.push(
      face2(circle(hx, hy, 1.6, 12), {
        fill: false,
        tone,
        group: "band",
      }),
    );
  }

  /* Crank handle on the right. */
  faces.push(
    tube(
      [
        [40, 0, 31],
        [53, 0, 31],
      ],
      2.2,
      { tone: "mid", group: "crank" },
    ),
    ...cylinder(53, 0, 28.5, 5, 3, 3, {
      tone: "edge",
      topTone: "lo",
      group: "crank",
    }),
  );

  return faces;
}

export const marquee: PrototypeMeta = {
  slug: "marquee",
  name: "Marquee",
  component: "Marquee",
  object: "Zoetrope",
  story:
    "The crank turns and the little figures behind the slits flicker into one movement.",
  note: "Repetition becomes motion when the same band is shown frame after frame.",
  scene: figureScene({
    slug: "marquee",
    name: "Marquee",
    component: "Effects",
    object: "Zoetrope",
    description:
      "A zoetrope on its spindle: a slit drum with small figures around the inside and a crank on the right.",
    aria:
      "An isometric zoetrope: a slitted drum with small figures behind the slits, on a spindle foot, with a turning crank handle.",
    faces: marqueeFaces(),
    motions: [
      { group: "band", kind: "flicker", period: 1600, amount: 0.03 },
      {
        group: "crank",
        kind: "spin",
        period: 4200,
        amount: 360,
        pivot: [40, 0, 31],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 66. Model Picker — tool-head rack                                          */
/* -------------------------------------------------------------------------- */

function modelPickerFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Two posts and a top rail. */
  for (const x of [-34, 34]) {
    faces.push(post(x, 0, 0, 34, 2.8, "edge"));
    faces.push(
      ...cylinder(x, 0, 32, 4, 4.4, 3.6, {
        tone: "mid",
        topTone: "lo",
      }),
    );
  }
  faces.push(
    ...box(-38, -5, 32, 76, 10, 7, {
      r: 2,
      tone: "edge",
      topTone: "mid",
    }),
  );
  for (let index = 0; index < 5; index += 1) {
    const x = -30 + index * 15;
    faces.push(
      stroke3(
        [
          [x, 5.1, 34],
          [x, 5.1, 38],
        ],
        "lo",
      ),
    );
  }

  /* Four interchangeable heads hang from the rail; one is engaged. */
  const heads = [-27, -9, 9, 27];
  heads.forEach((x, index) => {
    const group = `head-${index + 1}`;
    const engaged = index === 2;
    faces.push(
      ...cylinder(x, 0, 24, 5, 5.2, 5.2, {
        tone: "mid",
        topTone: "lo",
        group,
      }),
      ...cylinder(x, 0, 17, 7, 4.4, 4.4, {
        tone: "edge",
        topTone: "mid",
        group,
      }),
    );
    if (index === 0) {
      faces.push(
        ...cylinder(x, 0, 10, 7, 2.6, 0.9, {
          tone: "mid",
          topTone: "lo",
          group,
        }),
      );
    } else if (index === 1) {
      faces.push(
        disc3(x, 0, 11, 6.6, "xz", { tone: "mid", group }),
        disc3(x, 0, 11, 2.2, "xz", {
          fill: false,
          tone: "lo",
          group,
        }),
      );
      for (let tooth = 0; tooth < 10; tooth += 1) {
        const a = (tooth / 10) * TAU;
        faces.push(
          stroke3(
            [
              [x + Math.cos(a) * 6.4, 0, 11 + Math.sin(a) * 6.4],
              [x + Math.cos(a) * 8.2, 0, 11 + Math.sin(a) * 8.2],
            ],
            "lo",
            { group },
          ),
        );
      }
    } else if (engaged) {
      faces.push(
        ...cylinder(x, 0, 8, 9, 2.8, 0.8, {
          tone: "hi",
          topTone: "mid",
          group,
        }),
        stroke3(
          [
            [x - 3, 0, 19],
            [x + 3, 0, 19],
          ],
          "hi",
          { group },
        ),
      );
    } else {
      faces.push(
        ...cylinder(x, 0, 11, 4, 6, 6, {
          tone: "mid",
          topTone: "lo",
          group,
        }),
        ellipse3(x, 0, 15.2, 1.6, 1.6, {
          tone: "edge",
          group,
        }),
      );
    }
  });

  return faces;
}

export const modelPicker: PrototypeMeta = {
  slug: "model-picker",
  name: "Model Picker",
  component: "Model Picker",
  object: "Tool-head rack",
  story:
    "The chosen head settles into its collar and the rack indexes a notch.",
  note: "Choosing a model is choosing the right tool from a familiar rack.",
  scene: figureScene({
    slug: "model-picker",
    name: "Model Picker",
    component: "AI",
    object: "Tool-head rack",
    description:
      "A rack of four interchangeable tool heads on a top rail; the third head is lowered, tapered and bright.",
    aria:
      "An isometric tool-head rack: a top rail on two posts holding four hanging heads, the third one engaged and highlighted.",
    faces: modelPickerFaces(),
    motions: [
      {
        group: "head-3",
        kind: "lift",
        period: 2800,
        amount: 3.2,
      },
      {
        group: "head-3",
        kind: "sway",
        period: 3600,
        amount: 1.8,
        pivot: [9, 0, 32],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 67. Notification — mailbox with a flag                                     */
/* -------------------------------------------------------------------------- */

function notificationFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Post and its small crossbar. */
  faces.push(
    ...cylinder(0, -12, 0, 40, 3, 3, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ...box(-12, -15, 30, 24, 6, 4, {
      r: 1.6,
      tone: "mid",
      topTone: "lo",
    }),
  );

  /* The box body. */
  faces.push(
    ...box(-23, -14, 38, 46, 28, 16, {
      r: 2,
      tone: "edge",
      topTone: "mid",
    }),
  );

  /* Arched roof: back profile, roof band, then front profile. */
  const arch = (y: number): Point3[] => {
    const points: Point3[] = [[-23, y, 54], [23, y, 54]];
    for (let index = 0; index <= 16; index += 1) {
      const x = 23 - (46 * index) / 16;
      points.push([x, y, 54 + Math.sin((index / 16) * Math.PI) * 8]);
    }
    points.push([-23, y, 54]);
    return points;
  };
  const back = arch(-14);
  const front = arch(14);
  faces.push(face3(back, { tone: "mid" }));

  for (let index = 0; index < 18; index += 1) {
    const next = (index + 1) % 18;
    faces.push(
      face3([front[index], front[next], back[next], back[index]], {
        tone: "edge",
        stroke: false,
      }),
    );
  }
  faces.push(
    face3(front, { tone: "edge" }),
    stroke3(back, "mid"),
    stroke3(
      [
        [-23, -14, 54],
        [-23, 14, 54],
      ],
      "lo",
    ),
    stroke3(
      [
        [23, -14, 54],
        [23, 14, 54],
      ],
      "lo",
    ),
  );

  /* Door, its slot and handle. */
  faces.push(
    face3(vRound(0, 14.2, 41, 38, 13, 4), {
      fill: false,
      tone: "edge",
      group: "door",
    }),
    face3(
      [
        [-12, 14.3, 49],
        [12, 14.3, 49],
        [12, 14.3, 51],
        [-12, 14.3, 51],
      ],
      { fill: false, tone: "lo", group: "door" },
    ),
  );
  const [hx, hy] = iso(14, 14.3, 43);
  faces.push(
    face2(circle(hx, hy, 2, 14), {
      tone: "mid",
      group: "door",
    }),
  );

  /* The flag on the near side: the active part. */
  faces.push(
    tube(
      [
        [23, 15, 40],
        [23, 15, 58],
      ],
      1.8,
      { tone: "mid", group: "flag" },
    ),
    face3(
      [
        [23, 15, 51],
        [39, 15, 51],
        [39, 15, 60],
        [23, 15, 60],
      ],
      { tone: "hi", group: "flag" },
    ),
    stroke3(
      [
        [27, 15.1, 55.5],
        [35, 15.1, 55.5],
      ],
      "lo",
      { group: "flag" },
    ),
  );
  const [px, py] = iso(23, 15, 40);
  faces.push(
    face2(circle(px, py, 2.4, 14), { tone: "edge", group: "flag" }),
  );

  return faces;
}

export const notification: PrototypeMeta = {
  slug: "notification",
  name: "Notification",
  component: "Notification",
  object: "Mailbox with a flag",
  story: "The flag rises and the little door swings open.",
  note: "A message has arrived and is waiting to be noticed.",
  scene: figureScene({
    slug: "notification",
    name: "Notification",
    component: "Feedback",
    object: "Mailbox with a flag",
    description:
      "A mailbox on a post: an arched roof, a slotted front door with a handle and a bright flag raised on the side.",
    aria:
      "An isometric mailbox on a post: an arched roof, a slotted door with a round handle and a bright flag raised on the near side.",
    faces: notificationFaces(),
    motions: [
      {
        group: "flag",
        kind: "sway",
        period: 2600,
        amount: 26,
        pivot: [23, 15, 40],
      },
      {
        group: "door",
        kind: "sway",
        period: 3000,
        amount: 7,
        pivot: [-19, 14, 47],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 68. Rating — five-bar farm gate                                            */
/* -------------------------------------------------------------------------- */

function ratingFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Two posts with caps, no base slab. */
  for (const x of [-46, 46]) {
    faces.push(post(x, 0, 0, 54, 3.2, "edge"));
    faces.push(
      ...cylinder(x, 0, 52, 4, 4.6, 3.4, {
        tone: "mid",
        topTone: "lo",
      }),
    );
    faces.push(
      ...cylinder(x, 0, 0, 3.4, 4.2, 4.2, {
        tone: "mid",
        topTone: "lo",
      }),
    );
  }

  /* Five bars, each its own group so they can rise in turn. */
  for (let index = 0; index < 5; index += 1) {
    const z = 11 + index * 8;
    const group = `bar-${index + 1}`;
    faces.push(
      tube(
        [
          [-42, 0, z],
          [42, 0, z],
        ],
        2.8,
        { tone: "edge", group },
      ),
    );
    if (index === 4) {
      faces.push(
        stroke3(
          [
            [-38, 0.6, z + 0.1],
            [38, 0.6, z + 0.1],
          ],
          "hi",
          { group },
        ),
      );
    }
  }

  /* Diagonal brace and hinge plates. */
  faces.push(
    tube(
      [
        [-42, 0, 11],
        [42, 0, 43],
      ],
      2,
      { tone: "mid" },
    ),
  );
  for (const z of [15, 39]) {
    faces.push(
      disc3(-46, 0, z, 3.6, "xz", { tone: "mid" }),
      disc3(-46, 0, z, 1.6, "xz", { fill: false, tone: "lo" }),
    );
  }

  /* Latch on the far post. */
  faces.push(
    tube(
      [
        [46, 0, 27],
        [53, 0, 27],
      ],
      2,
      { tone: "mid", group: "latch" },
    ),
    stroke3(
      [
        [52, 0, 27],
        [52, 0, 22],
      ],
      "mid",
      { group: "latch" },
    ),
  );

  return faces;
}

export const rating: PrototypeMeta = {
  slug: "rating",
  name: "Rating",
  component: "Rating",
  object: "Five-bar farm gate",
  story: "The five bars lift one after another up to the chosen count.",
  note: "A rating is a row of bars: the score is how many are open.",
  scene: figureScene({
    slug: "rating",
    name: "Rating",
    component: "Inputs",
    object: "Five-bar farm gate",
    description:
      "A five-bar farm gate between two capped posts, with a diagonal brace, hinge plates and a latch.",
    aria:
      "An isometric five-bar farm gate between two posts, with a diagonal brace, hinge plates and a bright latch on the right.",
    faces: ratingFaces(),
    motions: [
      { group: "bar-1", kind: "lift", period: 2400, amount: 1.2 },
      { group: "bar-2", kind: "lift", period: 2400, amount: 1.6, phase: 0.07 },
      { group: "bar-3", kind: "lift", period: 2400, amount: 2, phase: 0.14 },
      { group: "bar-4", kind: "lift", period: 2400, amount: 2.4, phase: 0.21 },
      { group: "bar-5", kind: "lift", period: 2400, amount: 2.8, phase: 0.28 },
      { group: "latch", kind: "flicker", period: 2400, amount: 0.06 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 69. Resizable — telescoping ladder                                         */
/* -------------------------------------------------------------------------- */

function resizableFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  const section = (
    half: number,
    z0: number,
    z1: number,
    rungs: number[],
    group: string,
  ) => {
    faces.push(
      tube(
        [
          [-half, 0, z0],
          [-half, 0, z1],
        ],
        2.6,
        { tone: "edge", group },
      ),
      tube(
        [
          [half, 0, z0],
          [half, 0, z1],
        ],
        2.6,
        { tone: "edge", group },
      ),
    );
    for (const z of rungs) {
      faces.push(
        tube(
          [
            [-half, 0, z],
            [half, 0, z],
          ],
          2.2,
          { tone: "mid", group },
        ),
      );
    }
  };

  section(26, 0, 36, [8, 16, 24, 32], "sec-1");
  section(21, 30, 66, [42, 50, 58], "sec-2");
  section(16, 58, 92, [68, 76, 84], "sec-3");

  /* Rubber feet, collars and the bright top rung. */
  for (const x of [-26, 26]) {
    faces.push(
      ...box(x - 3.4, -3.4, 0, 6.8, 6.8, 4, {
        r: 1.6,
        tone: "mid",
        topTone: "lo",
        group: "sec-1",
      }),
    );
  }
  faces.push(
    ...box(-29, -3.2, 33.4, 58, 6.4, 4.4, {
      r: 2,
      tone: "mid",
      topTone: "lo",
      group: "sec-1",
    }),
    ...box(-24, -3.2, 61.4, 48, 6.4, 4.4, {
      r: 2,
      tone: "mid",
      topTone: "lo",
      group: "sec-2",
    }),
  );
  faces.push(
    stroke3(
      [
        [-16, 0.8, 84],
        [16, 0.8, 84],
      ],
      "hi",
      { group: "sec-3" },
    ),
  );

  return faces;
}

export const resizable: PrototypeMeta = {
  slug: "resizable",
  name: "Resizable",
  component: "Resizable",
  object: "Telescoping ladder",
  story:
    "The upper sections extend one notch and the rungs spread apart.",
  note: "A resize is a ladder: the range grows exactly as far as you pull it.",
  scene: figureScene({
    slug: "resizable",
    name: "Resizable",
    component: "Layout",
    object: "Telescoping ladder",
    description:
      "A telescoping ladder with three nested sections, rubber feet and two collars; the top rung is bright.",
    aria:
      "An isometric telescoping ladder with three nested sections, rubber feet, two collars and a highlighted top rung.",
    faces: resizableFaces(),
    motions: [
      { group: "sec-2", kind: "lift", period: 3000, amount: 2.4 },
      { group: "sec-3", kind: "lift", period: 3000, amount: 5.2, phase: 0.08 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 70. Scroll Area — magic lantern                                            */
/* -------------------------------------------------------------------------- */

function scrollAreaFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Feet and body. */
  for (const x of [-26, 26]) {
    for (const y of [-16, 16]) {
      faces.push(
        ...box(x - 4, y - 3, 0, 8, 6, 4, {
          r: 1.6,
          tone: "mid",
          topTone: "lo",
        }),
      );
    }
  }
  faces.push(
    ...box(-34, -24, 4, 68, 48, 34, {
      r: 3,
      tone: "edge",
      topTone: "mid",
      group: "body",
    }),
  );

  /* Chimney and cap. */
  faces.push(
    ...box(-9, -12, 38, 18, 24, 14, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "body",
    }),
    ...box(-13, -16, 52, 26, 32, 3.4, {
      r: 2,
      tone: "mid",
      topTone: "lo",
      group: "body",
    }),
  );
  for (let index = 0; index < 4; index += 1) {
    const y = -8 + index * 5;
    faces.push(
      stroke3(
        [
          [-9.1, y, 41],
          [-9.1, y, 50],
        ],
        "lo",
        { group: "body" },
      ),
    );
  }

  /* Lens barrel, built as a short stack of discs toward the viewer. */
  faces.push(
    tube(
      [
        [0, 24, 18],
        [0, 34, 18],
      ],
      24,
      { tone: "edge", group: "lens" },
    ),
    disc3(0, 24.4, 18, 13, "xz", { tone: "mid", group: "lens" }),
    disc3(0, 31, 18, 12, "xz", { tone: "edge", group: "lens" }),
    disc3(0, 35, 18, 10, "xz", { tone: "mid", group: "lens" }),
    disc3(0, 36.5, 18, 8, "xz", { tone: "hi", group: "lens" }),
    disc3(0, 36.8, 18, 4, "xz", { fill: false, tone: "lo", group: "lens" }),
  );
  const [lensX, lensY] = iso(0, 36.8, 18);
  for (const a of [0.4, 1.6, 2.7, 3.9, 5.2]) {
    faces.push(
      stroke2(
        [
          [lensX + Math.cos(a) * 4.5, lensY + Math.sin(a) * 4.5],
          [lensX + Math.cos(a) * 8, lensY + Math.sin(a) * 8],
        ],
        "lo",
        { group: "lens" },
      ),
    );
  }

  /* Slide carrier and the slide itself. */
  faces.push(
    ...box(-26, 12, 38, 52, 5, 4, {
      r: 1.6,
      tone: "mid",
      topTone: "lo",
    }),
  );
  faces.push(
    face3(
      [
        [-19, 14.2, 42],
        [7, 14.2, 42],
        [7, 14.2, 55],
        [-19, 14.2, 55],
      ],
      { tone: "edge", group: "slide" },
    ),
    face3(
      [
        [-15, 14.3, 45],
        [3, 14.3, 45],
        [3, 14.3, 51],
        [-15, 14.3, 51],
      ],
      { tone: "lo", group: "slide" },
    ),
    face2(
      [
        iso(-13, 14.4, 46),
        iso(-4, 14.4, 48),
        iso(-6, 14.4, 50),
        iso(-14, 14.4, 49),
      ],
      { tone: "mid", group: "slide" },
    ),
  );

  /* Crank on the right. */
  faces.push(
    tube(
      [
        [34, 0, 18],
        [46, 0, 18],
      ],
      2.2,
      { tone: "mid", group: "crank" },
    ),
    ...cylinder(46, 0, 15, 6, 3, 3, {
      tone: "edge",
      topTone: "lo",
      group: "crank",
    }),
  );

  return faces;
}

export const scrollArea: PrototypeMeta = {
  slug: "scroll-area",
  name: "Scroll Area",
  component: "Scroll Area",
  object: "Magic lantern",
  story:
    "The slide pushes into its carrier and the lens takes on a bright flare.",
  note: "A scroll area is a small window travelling over a much longer image.",
  scene: figureScene({
    slug: "scroll-area",
    name: "Scroll Area",
    component: "Layout",
    object: "Magic lantern",
    description:
      "A magic lantern: a box with a chimney, a lens barrel toward the reader, a slide carrier on top and a side crank.",
    aria:
      "An isometric magic lantern: a box body with a chimney, a lens barrel pointing at the reader, a slide in its carrier and a crank.",
    faces: scrollAreaFaces(),
    motions: [
      { group: "slide", kind: "lift", period: 2800, amount: 4 },
      { group: "lens", kind: "flicker", period: 2200, amount: 0.07 },
      {
        group: "crank",
        kind: "spin",
        period: 5200,
        amount: 360,
        pivot: [34, 0, 18],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 71. Sidebar — drop-leaf table                                              */
/* -------------------------------------------------------------------------- */

function sidebarFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Four legs, the apron, the fixed top. */
  for (const x of [-28, 28]) {
    for (const y of [-15, 15]) {
      faces.push(post(x, y, 0, 36, 2.6, "edge"));
      faces.push(
        ...cylinder(x, y, 0, 2.4, 3.4, 3.4, {
          tone: "mid",
          topTone: "lo",
        }),
      );
    }
  }
  faces.push(
    ...box(-29, -18, 32, 58, 36, 5, {
      r: 1.6,
      tone: "mid",
      topTone: "lo",
    }),
    ...box(-34, -21, 36, 68, 42, 4, {
      r: 2.4,
      tone: "edge",
      topTone: "mid",
    }),
  );

  /* A drawer front and its bright knob. */
  faces.push(
    face3(
      [
        [-14, 18.1, 33],
        [14, 18.1, 33],
        [14, 18.1, 36.6],
        [-14, 18.1, 36.6],
      ],
      { fill: false, tone: "lo" },
    ),
  );
  const [kx, ky] = iso(0, 18.2, 34.8);
  faces.push(
    face2(circle(kx, ky, 1.8, 14), { tone: "mid", group: "knob" }),
  );

  /* The drop leaf hangs on the right edge, with its gateleg folded under. */
  faces.push(
    ...box(31.6, -21, 4, 3.4, 42, 32, {
      r: 1.2,
      tone: "edge",
      topTone: "mid",
      group: "leaf",
    }),
    stroke3(
      [
        [35.2, -18, 8],
        [35.2, 18, 8],
      ],
      "hi",
      { group: "leaf" },
    ),
  );
  faces.push(
    tube(
      [
        [33, 18, 4],
        [20, 24, 30],
      ],
      2,
      { tone: "mid", group: "support" },
    ),
    tube(
      [
        [20, 24, 30],
        [20, 24, 6],
      ],
      1.8,
      { tone: "mid", group: "support" },
    ),
  );
  const [hx, hy] = iso(33, 20, 4);
  faces.push(
    face2(circle(hx, hy, 2.6, 14), { tone: "mid", group: "support" }),
  );

  return faces;
}

export const sidebar: PrototypeMeta = {
  slug: "sidebar",
  name: "Sidebar",
  component: "Sidebar",
  object: "Drop-leaf table",
  story:
    "The leaf swings up to horizontal and its gateleg locks underneath.",
  note: "A sidebar is a surface folded against the body, opened only when it is needed.",
  scene: figureScene({
    slug: "sidebar",
    name: "Sidebar",
    component: "Navigation",
    object: "Drop-leaf table",
    description:
      "A drop-leaf table: a fixed top on four legs, a drawer with a bright knob and a leaf hanging on the right.",
    aria:
      "An isometric drop-leaf table: a fixed top on four legs, a drawer with a highlighted knob and a leaf hanging from the right edge.",
    faces: sidebarFaces(),
    motions: [
      {
        group: "leaf",
        kind: "sway",
        period: 3200,
        amount: 11,
        pivot: [33, 0, 36],
      },
      {
        group: "support",
        kind: "sway",
        period: 3200,
        amount: -12,
        pivot: [33, 18, 4],
      },
      { group: "knob", kind: "flicker", period: 2800, amount: 0.08 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 72. Spotlight Card — display plinth in a spotlight                         */
/* -------------------------------------------------------------------------- */

function spotlightCardFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The plinth: a functional pedestal, not a slab under the object. */
  faces.push(
    ...box(-24, -18, 0, 48, 36, 7, {
      r: 2,
      tone: "mid",
      topTone: "lo",
    }),
    ...box(-17, -13, 7, 34, 26, 42, {
      r: 2,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-22, -17, 49, 44, 34, 4, {
      r: 2,
      tone: "edge",
      topTone: "mid",
    }),
  );

  /* Light cone: four open edges and its pool on the cap. */
  const apex: Point3 = [0, 0, 92];
  for (const a of [0.4, 1.9, 3.5, 5.1]) {
    faces.push(
      stroke3(
        [
          apex,
          [Math.cos(a) * 25, Math.sin(a) * 25, 53],
        ],
        "lo",
        { group: "beam" },
      ),
    );
  }
  faces.push(
    ellipse3(0, 0, 53.2, 25, 25, {
      fill: false,
      tone: "lo",
      group: "beam",
    }),
  );

  /* Suspended spot fixture and its cord. */
  faces.push(
    ...cylinder(0, 0, 92, 10, 6.5, 8.5, {
      tone: "edge",
      topTone: "mid",
      group: "lamp",
    }),
    ...cylinder(0, 0, 102, 4, 5, 3.6, {
      tone: "mid",
      topTone: "lo",
      group: "lamp",
    }),
    stroke3(
      [
        [0, 0, 106],
        [0, 0, 118],
      ],
      "lo",
      { group: "lamp" },
    ),
  );

  /* The relic on the plinth: a small vase with a bright rim. */
  faces.push(
    ...cylinder(0, 0, 53, 9, 7, 4.6, {
      tone: "mid",
      topTone: "lo",
      group: "relic",
    }),
    ...cylinder(0, 0, 62, 5, 3.4, 2.6, {
      tone: "mid",
      topTone: "lo",
      group: "relic",
    }),
    ellipse3(0, 0, 67.2, 4.4, 4.4, {
      tone: "hi",
      group: "relic",
    }),
    ellipse3(0, 0, 57.4, 6.4, 6.4, {
      fill: false,
      tone: "lo",
      group: "relic",
    }),
  );

  return faces;
}

export const spotlightCard: PrototypeMeta = {
  slug: "spotlight-card",
  name: "Spotlight Card",
  component: "Spotlight Card",
  object: "Display plinth in a spotlight",
  story:
    "The pool of light widens and the relic turns its rim toward the beam.",
  note: "Presenting one thing means building a stage for it and lighting only that.",
  scene: figureScene({
    slug: "spotlight-card",
    name: "Spotlight Card",
    component: "Effects",
    object: "Display plinth in a spotlight",
    description:
      "A display plinth under a suspended spotlight: a tapered pedestal, a small vase and a cone of light.",
    aria:
      "An isometric display plinth under a suspended spotlight: a tapered pedestal carrying a small vase inside a cone of light.",
    faces: spotlightCardFaces(),
    motions: [
      { group: "beam", kind: "breathe", period: 3200, amount: 0.04 },
      { group: "relic", kind: "lift", period: 3200, amount: 2.2 },
      { group: "lamp", kind: "flicker", period: 2800, amount: 0.03 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 73. Star — sheriff's star badge                                            */
/* -------------------------------------------------------------------------- */

function starBadgeFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [cx, cy] = iso(0, 0, 46);

  const starPoints = star2(cx, cy, 44, 20, 6, -Math.PI / 2);

  /* A darker back plate gives the badge its thickness. */
  faces.push(
    face2(
      starPoints.map(([x, y]) => [x + 3, y + 4] as Point2),
      { tone: "lo" },
    ),
  );
  faces.push(face2(starPoints, { tone: "edge", group: "badge" }));

  /* Ball-tipped points. */
  for (let index = 0; index < 6; index += 1) {
    const [px, py] = starPoints[index * 2];
    faces.push(
      face2(circle(px, py, 3.6, 20), { tone: "edge", group: "badge" }),
      face2(circle(px, py, 1.7, 14), {
        fill: false,
        tone: "lo",
        group: "badge",
      }),
    );
  }

  /* A single engraved ring and the central medallion. */
  faces.push(
    face2(circle(cx, cy, 16, 36), {
      fill: false,
      tone: "mid",
      group: "badge",
    }),
    face2(circle(cx, cy, 11, 32), { tone: "edge", group: "badge" }),
    face2(circle(cx, cy, 6.5, 26), {
      fill: false,
      tone: "lo",
      group: "badge",
    }),
  );

  /* The one bright mark in the medallion. */
  faces.push(
    face2(star2(cx, cy, 6.4, 2.8, 5, -Math.PI / 2), {
      tone: "hi",
      group: "glint",
    }),
  );

  return faces;
}

export const star: PrototypeMeta = {
  slug: "star",
  name: "Star",
  component: "Star",
  object: "Sheriff's star badge",
  story: "The badge turns a full circle and its points catch the light in turn.",
  note: "A star is a distinction you can pin on: it says excellent before you read anything.",
  scene: figureScene({
    slug: "star",
    name: "Star",
    component: "Effects",
    object: "Sheriff's star badge",
    description:
      "A six-point sheriff's star badge with ball-tipped points, engraved rings and a bright central star.",
    aria:
      "An isometric six-point sheriff's star badge with ball-tipped points, engraved rings and a bright central star.",
    faces: starBadgeFaces(),
    motions: [
      { group: "badge", kind: "spin", period: 9000, amount: 360 },
      { group: "glint", kind: "flicker", period: 2400, amount: 0.14 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 74. Action Bar — tool belt                                                 */
/* -------------------------------------------------------------------------- */

function actionBarFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The belt: a hanging leather band with a buckle at the front. */
  const beltPoints: Point3[] = [];
  for (let index = 0; index <= 24; index += 1) {
    const t = index / 24;
    beltPoints.push([
      -58 + t * 116,
      0,
      46 - Math.sin(t * Math.PI) * 5,
    ]);
  }
  faces.push(tube(beltPoints, 9, { tone: "edge", group: "belt" }));
  faces.push(
    face3(
      [
        [-8, 5, 38],
        [8, 5, 38],
        [8, 5, 47],
        [-8, 5, 47],
      ],
      { tone: "edge", group: "buckle" },
    ),
    face3(
      [
        [-4, 5.3, 40.5],
        [4, 5.3, 40.5],
        [4, 5.3, 44.5],
        [-4, 5.3, 44.5],
      ],
      { tone: "lo", group: "buckle" },
    ),
    stroke3(
      [
        [0, 5.4, 38],
        [0, 5.4, 47],
      ],
      "mid",
      { group: "buckle" },
    ),
  );

  /* Four pouches hanging from the band. */
  const pouches = [-42, -16, 14, 40];
  pouches.forEach((x, index) => {
    faces.push(
      ...box(x - 9, -5, 20, 18, 10, 18, {
        r: 3,
        tone: index === 2 ? "edge" : "mid",
        topTone: "lo",
        group: "pouches",
      }),
      face3(
        [
          [x - 7, 5.1, 32],
          [x + 7, 5.1, 32],
          [x + 7, 5.1, 37],
          [x - 7, 5.1, 37],
        ],
        { fill: false, tone: "lo", group: "pouches" },
      ),
    );
    const [rx, ry] = iso(x, 5.2, 33.4);
    faces.push(
      face2(circle(rx, ry, 1.2, 12), {
        tone: "mid",
        group: "pouches",
      }),
    );
  });

  /* The lifted tool: a hammer rising from the first pouch. */
  faces.push(
    tube(
      [
        [-42, 6, 34],
        [-42, 6, 58],
      ],
      2.4,
      { tone: "mid", group: "tool" },
    ),
    ...box(-49, 3, 56, 14, 6, 7, {
      r: 1.4,
      tone: "hi",
      topTone: "lo",
      group: "tool",
    }),
    stroke3(
      [
        [-44, 3.2, 56.2],
        [-44, 3.2, 62.8],
      ],
      "mid",
      { group: "tool" },
    ),
    stroke3(
      [
        [-35, 3.2, 61],
        [-32, 3.2, 59],
      ],
      "mid",
      { group: "tool" },
    ),
  );

  /* A screwdriver and a wrench in the other pouches. */
  faces.push(
    ...cylinder(-16, 6, 38, 8, 3.2, 3.2, {
      tone: "mid",
      topTone: "lo",
      group: "tools",
    }),
    tube(
      [
        [-16, 6, 46],
        [-16, 6, 59],
      ],
      1.6,
      { tone: "edge", group: "tools" },
    ),
  );
  faces.push(
    face3(
      [
        [10, 6, 38],
        [16, 6, 38],
        [16, 6, 57],
        [10, 6, 57],
      ],
      { tone: "mid", group: "tools" },
    ),
    face3(
      [
        [9, 6, 57],
        [17, 6, 57],
        [17, 6, 61],
        [12, 6, 62],
        [9, 6, 60],
      ],
      { tone: "mid", group: "tools" },
    ),
  );

  /* End loops of the belt. */
  for (const x of [-58, 58]) {
    faces.push(
      ...box(x - 3, -4, 40, 6, 8, 9, {
        r: 2,
        tone: "mid",
        topTone: "lo",
        group: "belt",
      }),
    );
  }

  return faces;
}

export const actionBar: PrototypeMeta = {
  slug: "action-bar",
  name: "Action Bar",
  component: "Action Bar",
  object: "Tool belt",
  story:
    "A tool slides out of its pouch while the belt and the other pouches settle.",
  note: "Contextual actions are tools worn at the hip: close at hand, ready to use.",
  scene: figureScene({
    slug: "action-bar",
    name: "Action Bar",
    component: "Overlays",
    object: "Tool belt",
    description:
      "A tool belt with a bright buckle, four pouches and tools in them; a hammer is lifted out of the first pouch.",
    aria:
      "An isometric tool belt: a hanging leather band with a bright buckle, four pouches and a lifted hammer in the first pouch.",
    faces: actionBarFaces(),
    motions: [
      { group: "tool", kind: "lift", period: 2800, amount: 5.2 },
      {
        group: "tool",
        kind: "sway",
        period: 3600,
        amount: 3.4,
        pivot: [-42, 6, 34],
      },
      { group: "pouches", kind: "sway", period: 3600, amount: 1.6 },
      { group: "buckle", kind: "flicker", period: 2600, amount: 0.05 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 75. Agent — robotic arm                                                    */
/* -------------------------------------------------------------------------- */

function agentFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Base and shoulder. */
  faces.push(
    ...cylinder(0, 0, 0, 6, 16, 14, {
      tone: "mid",
      topTone: "lo",
      bottomArc: true,
    }),
    ...cylinder(0, 0, 6, 10, 8, 7, {
      tone: "edge",
      topTone: "mid",
    }),
    disc3(0, 0, 16, 6.4, "xz", { tone: "edge" }),
    disc3(0, 0, 16, 2.6, "xz", { fill: false, tone: "lo" }),
  );

  /* Upper arm, elbow and forearm. */
  faces.push(
    tube(
      [
        [0, 2, 16],
        [18, 4, 48],
      ],
      11,
      { tone: "edge", group: "upper" },
    ),
    stroke3(
      [
        [2, 7.4, 18],
        [17, 9.4, 46],
      ],
      "lo",
      { group: "upper" },
    ),
    stroke3(
      [
        [1, 4, 12],
        [9, 9, 31],
        [18, 8, 46],
      ],
      "lo",
      { group: "upper" },
    ),
  );
  faces.push(
    disc3(18, 4, 48, 7, "xz", { tone: "edge", group: "fore" }),
    disc3(18, 4, 48, 2.8, "xz", {
      fill: false,
      tone: "lo",
      group: "fore",
    }),
    tube(
      [
        [20, 4, 48],
        [40, -6, 58],
      ],
      8.4,
      { tone: "edge", group: "fore" },
    ),
    stroke3(
      [
        [22, 0, 49],
        [39, -9, 57],
      ],
      "lo",
      { group: "fore" },
    ),
  );

  /* Wrist and two-finger gripper. */
  faces.push(
    disc3(40, -6, 58, 5, "xz", { tone: "edge", group: "claw" }),
    disc3(40, -6, 58, 2.2, "xz", {
      fill: false,
      tone: "lo",
      group: "claw",
    }),
    tube(
      [
        [42, -6, 58],
        [47, -7, 61],
        [51, -7, 63],
      ],
      3,
      { tone: "edge", group: "claw" },
    ),
    tube(
      [
        [42, -6, 58],
        [47, -5, 55],
        [51, -5, 53],
      ],
      3,
      { tone: "edge", group: "claw" },
    ),
    ...box(49, -9.5, 60.5, 6, 4, 5, {
      r: 1.6,
      tone: "hi",
      topTone: "lo",
      group: "claw",
    }),
    ...box(49, -7.5, 50.5, 6, 4, 5, {
      r: 1.6,
      tone: "hi",
      topTone: "lo",
      group: "claw",
    }),
  );

  /* Bolts on the joints. */
  for (const a of [0.6, 2.2, 3.9, 5.4]) {
    const [bx, by] = iso(0, 0, 12);
    faces.push(
      face2(
        [
          [bx + Math.cos(a) * 6, by + Math.sin(a) * 3],
          [bx + Math.cos(a) * 7.4, by + Math.sin(a) * 3.8],
        ],
        { fill: false, tone: "lo" },
      ),
    );
  }

  return faces;
}

export const agent: PrototypeMeta = {
  slug: "agent",
  name: "Agent",
  component: "Agent",
  object: "Robotic arm",
  story:
    "The arm unfolds, reaches out and waves its gripper once before settling.",
  note: "An agent is an arm that reaches and acts on your behalf, without your hand on it.",
  scene: figureScene({
    slug: "agent",
    name: "Agent",
    component: "AI",
    object: "Robotic arm",
    description:
      "A robotic arm on a round base: a shoulder, an upper arm, an elbow, a forearm and a two-finger gripper.",
    aria:
      "An isometric robotic arm on a round base, with a jointed upper arm and forearm and a two-finger gripper with bright tips.",
    faces: agentFaces(),
    motions: [
      {
        group: "upper",
        kind: "sway",
        period: 3200,
        amount: 5,
        pivot: [0, 2, 16],
      },
      {
        group: "fore",
        kind: "sway",
        period: 3200,
        amount: 8,
        phase: 0.12,
        pivot: [18, 4, 48],
      },
      { group: "claw", kind: "breathe", period: 2400, amount: 0.1 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                  */
/* -------------------------------------------------------------------------- */

export const lot3Prototypes: PrototypeMeta[] = [
  badge,
  banner,
  bottomNavigation,
  bubble,
  chips,
  contextMenu,
  copyButton,
  dropdownMenu,
  empty,
  fileDrop,
  githubStars,
  hoverCard,
  kpiCounter,
  magnetic,
  marquee,
  modelPicker,
  notification,
  rating,
  resizable,
  scrollArea,
  sidebar,
  spotlightCard,
  star,
  actionBar,
  agent,
];
