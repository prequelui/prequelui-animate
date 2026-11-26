/*
 * Linear v4 — Objects collection, part two (objects 33 to 60, ordinals 226-253).
 *
 * This file closes the generic Objects collection: bottle, wine glass, mug,
 * apple, cherry, strawberry, guitar, piano, paintbrush, palette, scissors,
 * pencil, paperclip, bell, candle, lamp, basket, shopping bag, wallet,
 * ticket, stamp, newspaper, map, binoculars, telescope, microscope, flask
 * and atom.
 *
 * One real object per entry, no base slab, a silhouette that reads at 64 px,
 * the same 2:1 axonometric space and the same engraved hairline as lots 1-9.
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
  stroke2,
  stroke3,
  type FaceOptions,
  type PrototypeMeta,
} from "./geom";
import {
  ball,
  circleYZ,
  dotAt,
  drumX,
  ellipseRot,
  flatCard,
  flatLine,
  flame,
  frontRing,
  leaf,
  panel,
  post,
  quad,
  star,
  tapered,
  tube,
} from "./objectKit";

/* -------------------------------------------------------------------------- */
/* Local helpers                                                              */
/* -------------------------------------------------------------------------- */

function at(x: number, y: number, z: number): Point2 {
  return iso(x, y, z);
}

/** Two-point screen line. */
function line(a: Point2, b: Point2, tone: DetailTone, group?: string): FigureFace {
  return face2([a, b], { fill: false, tone, group });
}

/** A screen-space capsule between two points, used for handles and wires. */
function capsule(
  a: Point2,
  b: Point2,
  w: number,
  opts: FaceOptions = {},
): FigureFace {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * (w / 2);
  const ny = (dx / len) * (w / 2);
  return face2(
    [
      [a[0] + nx, a[1] + ny],
      [b[0] + nx, b[1] + ny],
      [b[0] - nx, b[1] - ny],
      [a[0] - nx, a[1] - ny],
    ],
    { tone: opts.tone ?? "edge", group: opts.group },
  );
}

/* -------------------------------------------------------------------------- */
/* 226. Bottle — bottle with a cork                                           */
/* -------------------------------------------------------------------------- */

function bottleFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 9, 22, 22, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ...cylinder(0, 0, 8, 50, 20, 20, {
      tone: "edge",
      topTone: "lo",
      group: "body",
    }),
    ...cylinder(0, 0, 57, 14, 20, 8, {
      tone: "edge",
      topTone: "lo",
      group: "body",
    }),
    ...cylinder(0, 0, 70, 16, 8, 7, {
      tone: "edge",
      topTone: "lo",
      group: "body",
    }),
    ...cylinder(0, 0, 85, 5, 10, 10, {
      tone: "edge",
      topTone: "lo",
      group: "body",
    }),
  );

  /* Paper label with two lines and one bright rule. */
  faces.push(
    panel(-15, 15, 20.4, 20, 48, { tone: "mid", group: "label" }),
    panel(-13, 13, 20.6, 23, 45, { fill: false, tone: "lo", group: "label" }),
    stroke3(
      [
        [-9, 20.7, 38],
        [9, 20.7, 38],
      ],
      "hi",
      { group: "label" },
    ),
    stroke3(
      [
        [-9, 20.7, 32],
        [5, 20.7, 32],
      ],
      "lo",
      { group: "label" },
    ),
  );

  /* Cork: a rounded plug with one groove. */
  faces.push(
    ...cylinder(0, 0, 89, 11, 6, 7, {
      tone: "mid",
      topTone: "lo",
      group: "cork",
    }),
    frontRing(0, 0, 96, 7, "lo", "cork"),
  );

  return faces;
}

export const bottle: PrototypeMeta = {
  slug: "bottle",
  name: "Bottle",
  component: "Objects",
  object: "Bottle with a cork",
  story:
    "The cork lifts softly out of the neck while the bottle leans on its base.",
  note: "A generic object: liquid kept and poured, a long neck under a cork.",
  scene: figureScene({
    slug: "bottle",
    name: "Bottle",
    component: "Objects",
    object: "Bottle with a cork",
    description:
      "A glass bottle on a round base: a tall body, a shoulder, a long neck, a paper label and a cork.",
    aria:
      "An isometric bottle with a tall body, a shoulder, a long neck, a bright label rule and a cork.",
    faces: bottleFaces(),
    motions: [
      { group: "cork", kind: "lift", period: 3200, amount: 3.4 },
      { group: "label", kind: "breathe", period: 4600, amount: 0.008 },
      {
        group: "body",
        kind: "sway",
        period: 5600,
        amount: 1.2,
        pivot: [0, 0, 0],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 227. Wine Glass — wine glass                                               */
/* -------------------------------------------------------------------------- */

function wineGlassFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 7, 26, 23, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ellipse3(0, 0, 7.1, 16, 16, { fill: false, tone: "lo" }),
    ...cylinder(0, 0, 6, 42, 3.2, 3.2, {
      tone: "edge",
      topTone: "lo",
      group: "stem",
    }),
  );

  /* Bowl: a flared cup with an open rim and engraved glass thickness. */
  faces.push(
    ...cylinder(0, 0, 46, 32, 17, 27, {
      tone: "edge",
      topTone: "mid",
      hollow: 4,
      bottomArc: true,
      group: "glass",
    }),
    ellipse3(0, 0, 78.1, 26.6, 26.6, {
      fill: false,
      tone: "lo",
      group: "glass",
    }),
    ellipse3(0, 0, 78.3, 8, 8, {
      fill: false,
      tone: "lo",
      group: "glass",
    }),
  );

  /* Wine surface and a reflection stroke. */
  faces.push(
    ellipse3(0, 0, 60, 22.4, 22.4, {
      fill: false,
      tone: "hi",
      group: "wine",
    }),
    stroke3(
      [
        [-17, 0, 58],
        [-8, 0, 44],
        [4, 0, 50],
      ],
      "lo",
      { group: "wine" },
    ),
  );

  return faces;
}

export const wineGlass: PrototypeMeta = {
  slug: "wine-glass",
  name: "Wine Glass",
  component: "Objects",
  object: "Wine glass",
  story:
    "The glass tips on its foot and the bright wine surface tilts inside the bowl.",
  note: "A generic object: a drink presented, a bowl raised on a stem and foot.",
  scene: figureScene({
    slug: "wine-glass",
    name: "Wine Glass",
    component: "Objects",
    object: "Wine glass",
    description:
      "A wine glass on a round foot: a slim stem, a flared bowl and a bright ring of wine inside.",
    aria:
      "An isometric wine glass with a round foot, a slim stem, a flared bowl and a bright wine surface.",
    faces: wineGlassFaces(),
    motions: [
      {
        group: "glass",
        kind: "sway",
        period: 3800,
        amount: 3.4,
        pivot: [0, 0, 7],
      },
      { group: "wine", kind: "breathe", period: 3000, amount: 0.03 },
      { group: "stem", kind: "breathe", period: 5600, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 228. Mug — beer mug                                                        */
/* -------------------------------------------------------------------------- */

function mugFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 7, 28, 28, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ...cylinder(0, 0, 6, 58, 26, 26, {
      tone: "edge",
      topTone: "mid",
      hollow: 4,
      group: "body",
    }),
  );

  /* Handle on the near side. */
  faces.push(
    tube(
      [
        [25, 0, 54],
        [45, 0, 50],
        [49, 0, 30],
        [43, 0, 14],
        [25, 0, 14],
      ],
      7,
      { tone: "edge", group: "handle" },
    ),
  );

  /* Foam: overlapping globes with one bright crown. */
  const [fx, fy] = at(0, 0, 64);
  for (const [dx, dy, r] of [
    [-16, 2, 10],
    [-4, -6, 12],
    [10, -2, 11],
    [20, 5, 8],
    [2, 7, 10],
    [-26, 8, 7],
  ] as const) {
    faces.push(
      face2(circle(fx + dx, fy + dy, r, 28), {
        tone: "edge",
        group: "foam",
      }),
    );
  }
  faces.push(
    face2(circle(fx - 4, fy - 8, 5.4, 18), {
      tone: "hi",
      group: "foam",
    }),
  );

  /* A pair of bands on the body. */
  faces.push(
    frontRing(0, 0, 22, 26.2, "lo", "body"),
    frontRing(0, 0, 50, 26.2, "lo", "body"),
  );

  return faces;
}

export const mug: PrototypeMeta = {
  slug: "mug",
  name: "Mug",
  component: "Objects",
  object: "Beer mug",
  story:
    "The foam rises a notch and the thick handle catches a line of light.",
  note: "A generic object: a drink held in two hands, a heavy body and a loop.",
  scene: figureScene({
    slug: "mug",
    name: "Mug",
    component: "Objects",
    object: "Beer mug",
    description:
      "A heavy beer mug on a thick foot: a deep body, two bands, a large handle and a crown of foam.",
    aria:
      "An isometric beer mug with a thick foot, two bands, a large handle and a bright crown of foam.",
    faces: mugFaces(),
    motions: [
      { group: "foam", kind: "lift", period: 3000, amount: 2.2 },
      {
        group: "handle",
        kind: "sway",
        period: 3200,
        amount: 2.4,
        pivot: [25, 0, 14],
      },
      { group: "body", kind: "breathe", period: 5600, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 229. Apple — apple with a leaf                                             */
/* -------------------------------------------------------------------------- */

function appleFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(...ball(0, 0, 46, 32, { tone: "edge", group: "apple" }));

  /* Top and bottom dimples. */
  const [cx, cy] = at(0, 0, 46);
  faces.push(
    stroke2(
      [
        [cx - 11, cy - 26],
        [cx, cy - 22],
        [cx + 11, cy - 26],
      ],
      "mid",
      { group: "apple" },
    ),
    stroke2(
      [
        [cx - 8, cy + 27],
        [cx, cy + 24],
        [cx + 8, cy + 27],
      ],
      "lo",
      { group: "apple" },
    ),
  );

  /* Stem and one leaf. */
  faces.push(
    tube(
      [
        [0, 0, 74],
        [3, 0, 86],
        [7, 0, 94],
      ],
      3,
      { tone: "mid", group: "stem" },
    ),
    frontRing(0, 0, 75, 4, "lo", "stem", 16),
    frontRing(0, 0, 80, 3, "lo", "stem", 14),
  );
  const [lx, ly] = at(10, 0, 90);
  faces.push(
    ...leaf(lx + 16, ly - 4, 28, 13, -0.25, { tone: "mid", group: "leaf" }),
  );

  /* The bright reflection on the upper left. */
  faces.push(
    stroke2(
      [
        [cx - 21, cy + 2],
        [cx - 15, cy - 12],
        [cx - 5, cy - 20],
      ],
      "hi",
      { group: "shine" },
    ),
  );

  return faces;
}

export const apple: PrototypeMeta = {
  slug: "apple",
  name: "Apple",
  component: "Objects",
  object: "Apple with a leaf",
  story:
    "The apple turns on its base, its reflection slides and the leaf sways on the stem.",
  note: "A generic object: a familiar round fruit with a stem and a leaf.",
  scene: figureScene({
    slug: "apple",
    name: "Apple",
    component: "Objects",
    object: "Apple with a leaf",
    description:
      "An apple on its base: a round body with two dimples, a stem, a leaf and a bright reflection.",
    aria:
      "An isometric apple with two dimples, a stem, a leaf and a bright reflection on its upper left.",
    faces: appleFaces(),
    motions: [
      {
        group: "apple",
        kind: "sway",
        period: 4600,
        amount: 2,
        pivot: [0, 0, 14],
      },
      { group: "leaf", kind: "sway", period: 3000, amount: 5 },
      { group: "shine", kind: "lift", period: 3200, amount: 1.6 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 230. Cherry — cherry pair                                                  */
/* -------------------------------------------------------------------------- */

function cherryFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const knot: Point2 = at(0, 0, 98);

  /* Two stems from one knot. */
  faces.push(
    tube(
      [
        [0, 0, 98],
        [-8, 0, 76],
        [-18, 0, 62],
      ],
      2.6,
      { tone: "edge", group: "pair" },
    ),
    tube(
      [
        [0, 0, 98],
        [10, 2, 72],
        [17, 4, 52],
      ],
      2.6,
      { tone: "edge", group: "pair" },
    ),
    ...ball(0, 0, 100, 3.4, { tone: "mid", group: "pair" }),
  );

  /* Two fruits, the near one a touch lower. */
  faces.push(
    ...ball(-18, 0, 42, 20, { tone: "edge", group: "pair" }),
    ...ball(17, 4, 32, 20, { tone: "edge", group: "pair" }),
  );

  /* One bright reflection on the near cherry. */
  const [nx, ny] = at(17, 4, 32);
  faces.push(
    stroke2(
      [
        [nx - 11, ny + 2],
        [nx - 6, ny - 9],
        [nx + 3, ny - 13],
      ],
      "hi",
      { group: "shine" },
    ),
  );

  /* A leaf at the knot. */
  faces.push(
    ...leaf(knot[0] + 18, knot[1] - 2, 26, 12, -0.15, {
      tone: "mid",
      group: "leaf",
    }),
  );

  return faces;
}

export const cherry: PrototypeMeta = {
  slug: "cherry",
  name: "Cherry",
  component: "Objects",
  object: "Cherry pair",
  story:
    "The two cherries swing together on their joined stems and the leaf answers.",
  note: "A generic object: a small bright duo hung from one knot.",
  scene: figureScene({
    slug: "cherry",
    name: "Cherry",
    component: "Objects",
    object: "Cherry pair",
    description:
      "A pair of cherries hanging from two curved stems joined at a knot, with a leaf and a bright reflection.",
    aria:
      "An isometric pair of cherries on two joined stems with a leaf and a bright reflection.",
    faces: cherryFaces(),
    motions: [
      {
        group: "pair",
        kind: "sway",
        period: 3600,
        amount: 4,
        pivot: [0, 0, 98],
      },
      { group: "leaf", kind: "sway", period: 3000, amount: 4 },
      { group: "shine", kind: "lift", period: 3200, amount: 1.4 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 231. Strawberry — strawberry                                               */
/* -------------------------------------------------------------------------- */

function strawberryFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [cx, cy] = at(0, 0, 54);

  /* Body: a broad top tapering to a rounded point. */
  const body: Point2[] = [
    [cx - 30, cy - 20],
    [cx - 16, cy - 30],
    [cx, cy - 25],
    [cx + 16, cy - 30],
    [cx + 30, cy - 20],
    [cx + 27, cy - 4],
    [cx + 20, cy + 16],
    [cx + 10, cy + 32],
    [cx, cy + 42],
    [cx - 10, cy + 32],
    [cx - 20, cy + 16],
    [cx - 27, cy - 4],
  ];
  faces.push(
    face2(body, { tone: "edge", group: "berry" }),
    stroke2(
      [
        [cx - 20, cy - 6],
        [cx - 12, cy + 8],
        [cx - 4, cy + 22],
      ],
      "lo",
      { group: "berry" },
    ),
    stroke2(
      [
        [cx + 20, cy - 6],
        [cx + 12, cy + 8],
        [cx + 4, cy + 22],
      ],
      "lo",
      { group: "berry" },
    ),
  );

  /* Seeds: short pale marks in rows. */
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const px = cx - 18 + col * 12 + (row % 2) * 5;
      const py = cy - 12 + row * 12 - (col % 2) * 3;
      if (Math.abs(px - cx) > 24 - row * 2) continue;
      faces.push(
        face2(
          [
            [px - 2, py + 1.4],
            [px + 2, py - 1.4],
          ],
          {
            fill: false,
            tone: row === 1 && col === 2 ? "hi" : "lo",
            group: "berry",
          },
        ),
      );
    }
  }

  /* Crown of five leaves and the stem. */
  for (const a of [-2.55, -1.9, -1.2, -0.55, 0.1]) {
    const px = cx + Math.cos(a) * 14;
    const py = cy - 26 + Math.sin(a) * 9;
    faces.push(
      ...leaf(px, py, 22, 10, a, { tone: "mid", group: "crown" }),
    );
  }
  faces.push(
    face2(circle(cx, cy - 26, 3, 14), { tone: "lo", group: "crown" }),
    tube(
      [
        [0, 0, 80],
        [2, 0, 90],
      ],
      2.6,
      { tone: "edge", group: "crown" },
    ),
  );

  return faces;
}

export const strawberry: PrototypeMeta = {
  slug: "strawberry",
  name: "Strawberry",
  component: "Objects",
  object: "Strawberry",
  story:
    "The crown lifts and one row of seeds catches the light on the turning berry.",
  note: "A generic object: a fruit read by its texture and its leaf crown.",
  scene: figureScene({
    slug: "strawberry",
    name: "Strawberry",
    component: "Objects",
    object: "Strawberry",
    description:
      "A strawberry with a broad top and a rounded point: rows of seeds, a five-leaf crown and a short stem.",
    aria:
      "An isometric strawberry with rows of seeds, a five-leaf crown, a short stem and one bright seed row.",
    faces: strawberryFaces(),
    motions: [
      {
        group: "crown",
        kind: "lift",
        period: 3000,
        amount: 2.4,
      },
      {
        group: "berry",
        kind: "sway",
        period: 4200,
        amount: 2.4,
        pivot: [0, 0, 54],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 232. Guitar — acoustic guitar                                              */
/* -------------------------------------------------------------------------- */

/**
 * Extrude a footprint vertically while keeping its concave outline (a guitar
 * waist cannot be bridged by a convex hull). Only the viewer-facing sides are
 * painted; their lower edges give the body its thickness.
 */
function guitarBody(
  footprint: ReadonlyArray<Point2>,
  z0: number,
  h: number,
  group: string,
): FigureFace[] {
  const z1 = z0 + h;
  const faces: FigureFace[] = [];
  const sides: Array<{ a: Point2; b: Point2; depth: number }> = [];
  for (let index = 0; index < footprint.length; index += 1) {
    const a = footprint[index];
    const b = footprint[(index + 1) % footprint.length];
    const nx = b[1] - a[1];
    const ny = -(b[0] - a[0]);
    if (nx + ny <= 0.0001) continue;
    sides.push({
      a,
      b,
      depth: (a[0] + b[0]) / 2 + (a[1] + b[1]) / 2,
    });
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
        { tone: "edge", stroke: false, group },
      ),
    );
  }
  faces.push(
    face3(
      footprint.map(([x, y]) => [x, y, z1] as Point3),
      { tone: "lo", group },
    ),
  );
  for (const side of sides) {
    faces.push(
      face3(
        [
          [side.a[0], side.a[1], z0],
          [side.b[0], side.b[1], z0],
        ],
        { fill: false, tone: "edge", group },
      ),
    );
  }
  return faces;
}

function guitarFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Waisted body lying in the isometric plane, the neck toward the viewer. */
  const body: Point2[] = [
    [0, -58],
    [12, -56],
    [22, -50],
    [29, -40],
    [32, -30],
    [31, -20],
    [27, -12],
    [22, -6],
    [20, -1],
    [23, 5],
    [27, 12],
    [26, 20],
    [21, 26],
    [13, 29],
    [7, 30],
    [-7, 30],
    [-13, 29],
    [-21, 26],
    [-26, 20],
    [-27, 12],
    [-23, 5],
    [-20, -1],
    [-22, -6],
    [-27, -12],
    [-31, -20],
    [-32, -30],
    [-29, -40],
    [-22, -50],
    [-12, -56],
  ];
  faces.push(...guitarBody(body, 0, 9, "body"));

  /* Sound hole, rosette and bridge on the soundboard. */
  faces.push(
    ellipse3(0, 4, 9.3, 12.5, 12.5, { tone: "mid", group: "body" }, 34),
    ellipse3(0, 4, 9.4, 16, 16, {
      fill: false,
      tone: "lo",
      group: "body",
    }, 38),
    ellipse3(0, 4, 9.4, 9.5, 9.5, {
      fill: false,
      tone: "lo",
      group: "body",
    }, 30),
    face3(
      [
        [-10, -40, 9.2],
        [10, -40, 9.2],
        [10, -33, 9.2],
        [-10, -33, 9.2],
      ],
      { tone: "mid", group: "body" },
    ),
  );

  /* Neck, frets and headstock, lower than the soundboard. */
  faces.push(
    ...box(-6.5, 30, 2, 13, 72, 5.5, {
      tone: "mid",
      topTone: "mid",
      group: "neck",
    }),
    ...box(-10, 102, 2, 20, 16, 5.5, {
      tone: "mid",
      topTone: "mid",
      group: "neck",
    }),
  );
  for (let index = 0; index < 7; index += 1) {
    const y = 38 + index * 8.5;
    faces.push(
      stroke3(
        [
          [-6, y, 7.7],
          [6, y, 7.7],
        ],
        "lo",
        { group: "neck" },
      ),
    );
  }
  for (const side of [-1, 1]) {
    for (let index = 0; index < 3; index += 1) {
      faces.push(
        ellipse3(
          side * 11.5,
          106 + index * 4.5,
          7.6,
          2.2,
          2.2,
          { tone: "mid", group: "neck" },
          12,
        ),
      );
    }
  }

  /* Six strings from the bridge to the nut, one bright. */
  for (let index = 0; index < 6; index += 1) {
    const x = -5 + index * 2;
    faces.push(
      stroke3(
        [
          [x, -36, 9.6],
          [x, 102, 7.9],
        ],
        index === 2 ? "hi" : "lo",
        { group: "strings" },
      ),
    );
  }

  return faces;
}

export const guitar: PrototypeMeta = {
  slug: "guitar",
  name: "Guitar",
  component: "Objects",
  object: "Acoustic guitar",
  story:
    "One string vibrates, the body sways and the brightness holds on the third string.",
  note: "A generic object: music in wood, a waist, a sound hole and strings.",
  scene: figureScene({
    slug: "guitar",
    name: "Guitar",
    component: "Objects",
    object: "Acoustic guitar",
    description:
      "An acoustic guitar lying on the isometric plane: a waisted body, a sound hole, a fretted neck and six strings.",
    aria:
      "An isometric acoustic guitar on its back, with a waisted body, a sound hole, a fretted neck and six strings, one bright.",
    faces: guitarFaces(),
    motions: [
      { group: "strings", kind: "flicker", period: 1600, amount: 0.015 },
      {
        group: "body",
        kind: "sway",
        period: 4800,
        amount: 1.6,
        pivot: [0, 0, 0],
      },
      { group: "neck", kind: "breathe", period: 5600, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 233. Piano — upright piano                                                 */
/* -------------------------------------------------------------------------- */

function pianoFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...box(-56, -18, 0, 112, 36, 72, {
      r: 3,
      lip: true,
      tone: "edge",
      topTone: "mid",
      group: "case",
    }),
  );

  /* Keyboard shelf and its keys. */
  faces.push(
    ...box(-52, 18, 40, 104, 12, 7, {
      r: 1,
      tone: "mid",
      topTone: "mid",
      group: "case",
    }),
  );
  const keyXs: number[] = [];
  for (let index = 0; index < 14; index += 1) {
    const x = -50 + index * 7.2;
    keyXs.push(x);
    faces.push(
      flatCard(x + 3.2, 24, 47.2, 6.4, 9, 0.6, {
        tone: index === 8 ? "hi" : "lo",
        group: index === 8 ? "key" : "keys",
      }),
    );
  }
  for (let index = 0; index < 9; index += 1) {
    if (index === 4) continue;
    const x = -46.4 + index * 7.2;
    faces.push(
      flatCard(x + 1.8, 21, 47.6, 3.6, 5.6, 0.4, {
        tone: "mid",
        group: "keys",
      }),
    );
  }

  /* Music desk and lid. */
  faces.push(
    ...box(-40, 8, 56, 80, 6, 18, {
      r: 1,
      tone: "mid",
      topTone: "lo",
      group: "lid",
    }),
    face3(
      [
        [-56, -18, 72],
        [56, -18, 72],
        [56, -10, 76],
        [-56, -10, 76],
      ],
      { tone: "mid", group: "lid" },
    ),
  );

  /* Top board with two candle sconces. */
  faces.push(
    ...box(-50, -12, 72, 100, 10, 4, {
      r: 1,
      tone: "lo",
      topTone: "lo",
      group: "lid",
    }),
  );
  for (const x of [-30, 30]) {
    faces.push(
      ...cylinder(x, -7, 76, 6, 4, 3, {
        tone: "mid",
        topTone: "lo",
        group: "lid",
      }),
    );
  }

  /* Pedals. */
  for (const x of [-16, 0, 16]) {
    faces.push(
      flatCard(x, 32, 1, 9, 14, 2, { tone: "mid", group: "case" }),
    );
  }

  /* A damper line above the lit key. */
  faces.push(
    stroke3(
      [
        [8, 15, 50],
        [8, 15, 58],
      ],
      "hi",
      { group: "damper" },
    ),
  );

  return faces;
}

export const piano: PrototypeMeta = {
  slug: "piano",
  name: "Piano",
  component: "Objects",
  object: "Upright piano",
  story:
    "One key sinks and its damper lifts, while the lid breathes above the music desk.",
  note: "A generic object: music stored in one line, a whole orchestra under a lid.",
  scene: figureScene({
    slug: "piano",
    name: "Piano",
    component: "Objects",
    object: "Upright piano",
    description:
      "An upright piano: a tall case, a keyboard shelf with white and black keys, a music desk, pedals and two sconces.",
    aria:
      "An isometric upright piano with a keyboard shelf, white and black keys, a music desk, pedals and a lifted damper.",
    faces: pianoFaces(),
    motions: [
      { group: "key", kind: "bob", period: 1800, amount: 1.6 },
      { group: "damper", kind: "lift", period: 1800, amount: 2.6 },
      { group: "lid", kind: "breathe", period: 5000, amount: 0.004 },
      { group: "case", kind: "breathe", period: 6200, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 234. Paintbrush — paintbrush                                               */
/* -------------------------------------------------------------------------- */

function paintbrushFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...tapered([0, -8, 0], [0, 4, 74], 7, 4.5, {
      tone: "edge",
      group: "handle",
    }),
    ...tapered([0, 4, 72], [0, 6, 84], 9, 8, {
      tone: "mid",
      group: "ferrule",
    }),
    ...tapered([0, 6, 84], [1, 7, 104], 10, 3.4, {
      tone: "mid",
      group: "bristles",
    }),
  );

  /* Bristle grains. */
  const [tx, ty] = at(1, 7, 102);
  for (const dx of [-6, -2, 2, 6]) {
    faces.push(
      face2(
        [
          [tx - 4 + dx * 0.4, ty + 16],
          [tx + dx * 0.7, ty - 2],
        ],
        { fill: false, tone: "lo", group: "bristles" },
      ),
    );
  }

  /* The touch of paint on the desk is the single accent. */
  faces.push(
    face2(
      [
        ...ellipse2(...at(24, 2, 1), 13, 5, 24),
      ],
      { tone: "hi", group: "paint" },
    ),
    stroke2(
      [
        [at(24, 2, 1)[0] - 15, at(24, 2, 1)[1]],
        [at(24, 2, 1)[0] + 16, at(24, 2, 1)[1] + 2],
      ],
      "hi",
      { group: "paint" },
    ),
  );

  return faces;
}

export const paintbrush: PrototypeMeta = {
  slug: "paintbrush",
  name: "Paintbrush",
  component: "Objects",
  object: "Paintbrush",
  story:
    "The bristles flex, the handle leans and a fresh touch of paint appears on the desk.",
  note: "A generic object: a mark waiting to happen, a handle and a head of hair.",
  scene: figureScene({
    slug: "paintbrush",
    name: "Paintbrush",
    component: "Objects",
    object: "Paintbrush",
    description:
      "A paintbrush leaning on its handle: a long grip, a metal ferrule, a head of bristles and a bright dab of paint.",
    aria:
      "An isometric paintbrush with a long handle, a metal ferrule, bristles and a bright dab of paint on the desk.",
    faces: paintbrushFaces(),
    motions: [
      {
        group: "bristles",
        kind: "sway",
        period: 2600,
        amount: 6,
        pivot: [0, 5, 84],
      },
      { group: "paint", kind: "breathe", period: 2800, amount: 0.06 },
      { group: "handle", kind: "breathe", period: 5600, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 235. Palette — artist's palette                                            */
/* -------------------------------------------------------------------------- */

function paletteFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [cx, cy] = at(0, 0, 68);

  faces.push(
    face2(ellipseRot(cx, cy, 50, 35, -0.28, 44), {
      tone: "edge",
      group: "board",
    }),
    face2(ellipseRot(cx, cy, 44, 30, -0.28, 40), {
      fill: false,
      tone: "lo",
      group: "board",
    }),
    face2(circle(cx - 24, cy + 6, 9, 26), { tone: "mid", group: "board" }),
    face2(circle(cx - 24, cy + 6, 6, 22), {
      fill: false,
      tone: "lo",
      group: "board",
    }),
  );

  /* Wells of colour around the rim, one of them bright. */
  const colours: Array<[number, number, number, DetailTone]> = [
    [-34, -12, 8, "mid"],
    [-16, -22, 9, "lo"],
    [6, -24, 8, "mid"],
    [26, -16, 7, "lo"],
    [36, 2, 8, "hi"],
    [16, 18, 6, "mid"],
  ];
  for (const [dx, dy, r, tone] of colours) {
    faces.push(
      face2(circle(cx + dx, cy + dy, r, 24), { tone, group: "paint" }),
      face2(circle(cx + dx + 2, cy + dy - 3, r * 0.4, 16), {
        fill: false,
        tone: "lo",
        group: "paint",
      }),
    );
  }

  return faces;
}

export const palette: PrototypeMeta = {
  slug: "palette",
  name: "Palette",
  component: "Objects",
  object: "Artist's palette",
  story:
    "The palette tilts and the bright well of colour slides against its neighbours.",
  note: "A generic object: colour arranged for choosing, a board and its wells.",
  scene: figureScene({
    slug: "palette",
    name: "Palette",
    component: "Objects",
    object: "Artist's palette",
    description:
      "An artist's palette seen at an angle: a kidney-shaped board, a thumb hole and six wells of colour, one bright.",
    aria:
      "An isometric artist's palette with a thumb hole and six wells of colour, one bright well on the right.",
    faces: paletteFaces(),
    motions: [
      {
        group: "board",
        kind: "sway",
        period: 4400,
        amount: 3,
        pivot: [0, 0, 68],
      },
      { group: "paint", kind: "breathe", period: 3000, amount: 0.045 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 236. Scissors — scissors                                                   */
/* -------------------------------------------------------------------------- */

function scissorsFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [cx, cy] = at(0, 0, 62);

  const blade = (
    tipX: number,
    tipY: number,
    side: number,
    group: string,
  ): FigureFace => {
    const dx = tipX - cx;
    const dy = tipY - cy;
    const len = Math.hypot(dx, dy) || 1;
    const px = (-dy / len) * 7;
    const py = (dx / len) * 7;
    return face2(
      [
        [cx + px, cy + py],
        [tipX, tipY],
        [cx - px, cy - py],
        [cx + side * 5, cy - 4],
      ],
      { tone: "edge", group },
    );
  };

  faces.push(
    blade(cx - 50, cy - 50, 1, "left"),
    blade(cx + 50, cy - 50, -1, "right"),
  );

  /* Handles: an arm and a ring on each side. */
  for (const side of [-1, 1] as const) {
    const hx = cx + side * 34;
    const hy = cy + 48;
    const group = side < 0 ? "left" : "right";
    faces.push(
      capsule([cx + side * 4, cy + 2], [hx - side * 4, hy - 14], 7, {
        tone: "mid",
        group,
      }),
      face2(ellipseRot(hx, hy, 17, 12, side * 0.4, 34), {
        tone: "mid",
        group,
      }),
      face2(ellipseRot(hx, hy, 11, 7, side * 0.4, 28), {
        fill: false,
        tone: "lo",
        group,
      }),
    );
  }

  faces.push(
    face2(circle(cx, cy, 4.6, 20), { tone: "hi", group: "pivot" }),
    face2(circle(cx, cy, 1.6, 12), { fill: false, tone: "lo", group: "pivot" }),
  );

  return faces;
}

export const scissors: PrototypeMeta = {
  slug: "scissors",
  name: "Scissors",
  component: "Objects",
  object: "Scissors",
  story:
    "The two blades swing on their bright screw, open, then close once.",
  note: "A generic object: a simple machine for cutting, two blades on one pivot.",
  scene: figureScene({
    slug: "scissors",
    name: "Scissors",
    component: "Objects",
    object: "Scissors",
    description:
      "Open scissors standing on their handles: two long blades, two ring handles and a bright central screw.",
    aria:
      "An isometric pair of open scissors with two blades, two ring handles and a bright central screw.",
    faces: scissorsFaces(),
    motions: [
      {
        group: "left",
        kind: "sway",
        period: 2600,
        amount: 6,
        pivot: [0, 0, 62],
      },
      {
        group: "right",
        kind: "sway",
        period: 2600,
        amount: -6,
        pivot: [0, 0, 62],
      },
      { group: "pivot", kind: "breathe", period: 3000, amount: 0.06 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 237. Pencil — pencil                                                       */
/* -------------------------------------------------------------------------- */

function pencilFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const start: Point3 = [-24, 8, 2];
  const end: Point3 = [22, -8, 104];
  const tipEnd: Point3 = [25, -9, 116];

  faces.push(
    tube([start, end], 18, { tone: "edge", group: "body" }),
  );
  /* Two facets along the shaft. */
  const s0 = at(...start);
  const e0 = at(...end);
  for (const offset of [-5, 5]) {
    faces.push(
      line(
        [s0[0] + offset, s0[1] + offset * 0.2],
        [e0[0] + offset, e0[1] + offset * 0.2],
        "lo",
        "body",
      ),
    );
  }
  faces.push(
    ...tapered(end, tipEnd, 9, 2, {
      tone: "mid",
      group: "tip",
    }),
    ...tapered(tipEnd, [27, -9.5, 121], 2, 0.5, {
      tone: "hi",
      group: "graphite",
    }),
    tube(
      [
        [-26, 8.6, 1],
        [-24.6, 8.2, 8],
      ],
      19,
      { tone: "mid", group: "ferrule" },
    ),
    face2(circle(...at(-26.4, 8.8, 1), 9.2, 26), {
      tone: "mid",
      group: "ferrule",
    }),
    face2(circle(...at(-26.4, 8.8, 1), 5.4, 22), {
      fill: false,
      tone: "lo",
      group: "ferrule",
    }),
  );

  return faces;
}

export const pencil: PrototypeMeta = {
  slug: "pencil",
  name: "Pencil",
  component: "Objects",
  object: "Pencil",
  story:
    "The shaft turns on its facets and the sharp graphite point catches the light.",
  note: "A generic object: writing as a small tool, a hex shaft and a cut point.",
  scene: figureScene({
    slug: "pencil",
    name: "Pencil",
    component: "Objects",
    object: "Pencil",
    description:
      "A pencil standing on its ferrule: a faceted shaft, a cut wood cone and a bright graphite point.",
    aria:
      "An isometric pencil with a faceted shaft, a metal ferrule, a cut wood cone and a bright graphite point.",
    faces: pencilFaces(),
    motions: [
      {
        group: "body",
        kind: "sway",
        period: 4600,
        amount: 2,
        pivot: [0, 0, 0],
      },
      { group: "tip", kind: "bob", period: 2200, amount: 1.2 },
      { group: "graphite", kind: "flicker", period: 2400, amount: 0.1 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 238. Paperclip — paperclip                                                 */
/* -------------------------------------------------------------------------- */

function paperclipFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [cx, cy] = at(0, 0, 58);

  /* A sheet of paper behind the clip. */
  faces.push(
    face2(
      [
        [cx - 48, cy - 32],
        [cx + 34, cy - 40],
        [cx + 46, cy + 40],
        [cx - 36, cy + 48],
      ],
      { tone: "mid", group: "sheet" },
    ),
    line([cx - 44, cy - 18], [cx - 28, cy - 20], "lo", "sheet"),
    line([cx + 24, cy - 22], [cx + 40, cy - 24], "lo", "sheet"),
    line([cx - 42, cy + 26], [cx - 27, cy + 28], "lo", "sheet"),
  );

  /* One continuous wire: four runs joined by three rounded turns. */
  const pts: Point2[] = [];
  const arc = (
    acx: number,
    acy: number,
    r: number,
    from: number,
    to: number,
    steps = 8,
  ) => {
    for (let index = 0; index <= steps; index += 1) {
      const a = from + ((to - from) * index) / steps;
      pts.push([acx + Math.cos(a) * r, acy + Math.sin(a) * r]);
    }
  };
  pts.push([cx - 18, cy - 52]);
  pts.push([cx - 18, cy + 30]);
  arc(cx - 12, cy + 30, 6, Math.PI, 0);
  pts.push([cx - 6, cy - 38]);
  arc(cx, cy - 38, 6, Math.PI, Math.PI * 2);
  pts.push([cx + 6, cy + 34]);
  arc(cx + 12, cy + 34, 6, Math.PI, 0);
  pts.push([cx + 18, cy - 30]);

  faces.push(
    face2(pts, { fill: false, tone: "edge", group: "clip" }),
    /* A second pass a hair to the right gives the wire its diameter. */
    face2(
      pts.map(([x, y]) => [x + 1.3, y] as Point2),
      { fill: false, tone: "lo", group: "clip" },
    ),
    /* The little hook at the free end. */
    face2(
      [
        [cx - 18, cy - 52],
        [cx - 24, cy - 56],
        [cx - 27, cy - 50],
        [cx - 25, cy - 44],
      ],
      { fill: false, tone: "mid", group: "clip" },
    ),
    /* A faint fold at the bottom-left corner of the sheet. */
    face2(
      [
        [cx - 48, cy + 12],
        [cx - 36, cy + 48],
        [cx - 40, cy + 24],
      ],
      { fill: false, tone: "lo", group: "sheet" },
    ),
  );

  /* Bright glint on the long outer run. */
  faces.push(
    line([cx - 18, cy - 2], [cx - 18, cy + 12], "hi", "glint"),
  );

  return faces;
}

export const paperclip: PrototypeMeta = {
  slug: "paperclip",
  name: "Paperclip",
  component: "Objects",
  object: "Paperclip",
  story:
    "The clip flexes and bites the sheet, a bright glint running down its outer wire.",
  note: "A generic object: holding things together with almost nothing.",
  scene: figureScene({
    slug: "paperclip",
    name: "Paperclip",
    component: "Objects",
    object: "Paperclip",
    description:
      "A paperclip of three nested wire loops holding a sheet of paper, with one bright glint.",
    aria:
      "An isometric paperclip with three nested wire loops biting a sheet of paper and a bright glint.",
    faces: paperclipFaces(),
    motions: [
      {
        group: "clip",
        kind: "sway",
        period: 3200,
        amount: 3,
        pivot: [0, 0, 58],
      },
      { group: "sheet", kind: "lift", period: 2800, amount: 2.2 },
      { group: "glint", kind: "flicker", period: 2000, amount: 0.1 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 239. Bell — hand bell                                                      */
/* -------------------------------------------------------------------------- */

function bellFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Curved bell profile: four stacked frustums. */
  faces.push(
    ...cylinder(0, 0, 20, 16, 30, 26, {
      tone: "edge",
      topTone: "lo",
      bottomArc: true,
      group: "bell",
    }),
    ...cylinder(0, 0, 34, 13, 26, 19, {
      tone: "edge",
      topTone: "lo",
      group: "bell",
    }),
    ...cylinder(0, 0, 46, 11, 19, 13, {
      tone: "edge",
      topTone: "lo",
      group: "bell",
    }),
    ...cylinder(0, 0, 56, 9, 13, 9, {
      tone: "edge",
      topTone: "mid",
      group: "bell",
    }),
    frontRing(0, 0, 20.2, 30, "mid", "bell", 40),
    frontRing(0, 0, 20.5, 24, "lo", "bell", 36),
    ...cylinder(0, 0, 64, 4, 9, 6, {
      tone: "mid",
      topTone: "lo",
      group: "bell",
    }),
  );

  /* Handle loop. */
  faces.push(
    tube(
      [
        [-7, 0, 68],
        [-6, 0, 78],
        [0, 0, 84],
        [6, 0, 78],
        [7, 0, 68],
      ],
      4,
      { tone: "edge", group: "handle" },
    ),
  );

  /* Clapper hangs below the rim. */
  faces.push(
    tube(
      [
        [0, 0, 62],
        [0, 0, 18],
      ],
      2,
      { tone: "mid", group: "clapper" },
    ),
    ...ball(0, 0, 13, 5.4, { tone: "mid", group: "clapper" }),
  );

  /* Two sound arcs, the accent. */
  const [sx, sy] = at(28, 0, 42);
  for (const [r, from, to] of [
    [18, -0.7, 0.5],
    [26, -0.6, 0.4],
  ] as const) {
    const pts: Point2[] = [];
    for (let index = 0; index <= 8; index += 1) {
      const a = from + ((to - from) * index) / 8;
      pts.push([sx + Math.cos(a) * r, sy + Math.sin(a) * r * 1.2]);
    }
    faces.push(face2(pts, { fill: false, tone: "hi", group: "sound" }));
  }

  return faces;
}

export const bell: PrototypeMeta = {
  slug: "bell",
  name: "Bell",
  component: "Objects",
  object: "Hand bell",
  story:
    "The bell swings on its handle, the clapper knocks and two bright arcs of sound leave the rim.",
  note: "A generic object: a call you can hear, an open cup and a swinging clapper.",
  scene: figureScene({
    slug: "bell",
    name: "Bell",
    component: "Objects",
    object: "Hand bell",
    description:
      "A hand bell standing on its rim: a flared body, a loop handle, a hanging clapper and two sound arcs.",
    aria:
      "An isometric hand bell with a flared body, a loop handle, a hanging clapper and two bright sound arcs.",
    faces: bellFaces(),
    motions: [
      {
        group: "bell",
        kind: "sway",
        period: 2400,
        amount: 4,
        pivot: [0, 0, 66],
      },
      {
        group: "clapper",
        kind: "sway",
        period: 1800,
        amount: 9,
        pivot: [0, 0, 60],
      },
      { group: "sound", kind: "flicker", period: 1800, amount: 0.14 },
      { group: "handle", kind: "breathe", period: 4200, amount: 0.02 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 240. Candle — lit candle                                                   */
/* -------------------------------------------------------------------------- */

function candleFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 8, 23, 21, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ellipse3(0, 0, 8.2, 16, 16, { fill: false, tone: "lo" }),
    ...cylinder(0, 0, 7, 60, 12, 12, {
      tone: "edge",
      topTone: "mid",
      group: "candle",
    }),
    ellipse3(0, 0, 67.1, 12, 12, { fill: false, tone: "lo", group: "candle" }),
    ellipse3(0, 0, 67.3, 6, 6, { fill: false, tone: "lo", group: "candle" }),
  );

  /* Wax drips on the front. */
  for (const [x, z, h] of [
    [-7, 54, 12],
    [4, 46, 18],
    [9, 58, 8],
  ] as const) {
    faces.push(
      face3(
        [
          [x - 2.4, 12.3, z],
          [x + 2.4, 12.3, z],
          [x + 2, 12.3, z - h],
          [x - 1.6, 12.3, z - h],
        ],
        { tone: "mid", group: "drips" },
      ),
      face2(circle(...at(x, 12.3, z - h), 2.2, 12), {
        tone: "mid",
        group: "drips",
      }),
    );
  }

  /* Wick and flame. */
  faces.push(
    stroke3(
      [
        [0, 0, 67],
        [1, 0, 74],
      ],
      "mid",
      { group: "flame" },
    ),
  );
  const [fx, fy] = at(1, 0, 76);
  faces.push(
    ...flame(fx, fy, 22, 11, { group: "flame" }),
  );

  return faces;
}

export const candle: PrototypeMeta = {
  slug: "candle",
  name: "Candle",
  component: "Objects",
  object: "Lit candle",
  story:
    "The flame wavers and a fresh bead of wax forms on the side of the column.",
  note: "A generic object: light that consumes itself, a column and a flame.",
  scene: figureScene({
    slug: "candle",
    name: "Candle",
    component: "Objects",
    object: "Lit candle",
    description:
      "A lit candle on a small saucer: a wax column with drips, a wick and a bright two-tongued flame.",
    aria:
      "An isometric lit candle on a saucer with wax drips, a wick and a bright flame.",
    faces: candleFaces(),
    motions: [
      {
        group: "flame",
        kind: "sway",
        period: 1800,
        amount: 5,
        pivot: [0, 0, 70],
      },
      { group: "flame", kind: "flicker", period: 900, amount: 0.06 },
      { group: "drips", kind: "lift", period: 3600, amount: 1.2 },
      { group: "candle", kind: "breathe", period: 6000, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 241. Lamp — table lamp                                                     */
/* -------------------------------------------------------------------------- */

function lampFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 8, 25, 22, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ellipse3(0, 0, 8.2, 18, 18, { fill: false, tone: "lo" }),
    post(0, 0, 8, 52, 4, "edge", "stem"),
    ...cylinder(0, 0, 50, 4, 8, 6, {
      tone: "mid",
      topTone: "lo",
      group: "stem",
    }),
  );

  /* Shade: a truncated cone open at the bottom. */
  faces.push(
    ...cylinder(0, 0, 52, 30, 31, 17, {
      tone: "edge",
      topTone: "lo",
      bottomArc: true,
      group: "shade",
    }),
    frontRing(0, 0, 81.6, 17, "lo", "shade"),
    frontRing(0, 0, 52.2, 31, "mid", "shade"),
  );

  /* Glow under the rim and a switch on the stem. */
  const [gx, gy] = at(0, 0, 50);
  faces.push(
    face2(ellipse2(gx, gy, 26, 9, 36), {
      fill: false,
      tone: "hi",
      group: "glow",
    }),
    stroke3(
      [
        [5, 0, 32],
        [5, 0, 38],
      ],
      "mid",
      { group: "stem" },
    ),
  );

  return faces;
}

export const lamp: PrototypeMeta = {
  slug: "lamp",
  name: "Lamp",
  component: "Objects",
  object: "Table lamp",
  story:
    "The shade tilts on its stem and the bright ring of light under the rim widens.",
  note: "A generic object: light arranged for a room, a shade on a stem and foot.",
  scene: figureScene({
    slug: "lamp",
    name: "Lamp",
    component: "Objects",
    object: "Table lamp",
    description:
      "A table lamp on a round foot: a slim stem, a flared shade and a bright ring of light under the rim.",
    aria:
      "An isometric table lamp with a round foot, a slim stem, a flared shade and a bright ring of light.",
    faces: lampFaces(),
    motions: [
      {
        group: "shade",
        kind: "sway",
        period: 3800,
        amount: 3,
        pivot: [0, 0, 82],
      },
      { group: "glow", kind: "breathe", period: 2800, amount: 0.06 },
      { group: "stem", kind: "breathe", period: 5600, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 242. Basket — woven basket                                                 */
/* -------------------------------------------------------------------------- */

function basketFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 4, 38, 22, 35, {
      tone: "edge",
      topTone: "lo",
      hollow: 4,
      bottomArc: true,
      group: "body",
    }),
    ellipse3(0, 0, 42.2, 35, 35, { fill: false, tone: "mid", group: "body" }),
  );

  /* Weave: three horizontal bands and diagonal strands. */
  for (const [z, w] of [
    [14, 26],
    [24, 30],
    [34, 34],
  ] as const) {
    faces.push(frontRing(0, 0, z, w, "lo", "weave", 40));
  }
  for (let index = 0; index < 12; index += 1) {
    const a = -2.2 + index * 0.36;
    const r = 28;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    faces.push(
      stroke3(
        [
          [x * 0.92, y * 0.92, 10],
          [x, y, 24],
          [x * 0.96, y * 0.96, 38],
        ],
        index === 5 ? "hi" : "lo",
        { group: index === 5 ? "weave" : "body" },
      ),
    );
  }

  /* Handle arch. */
  faces.push(
    tube(
      [
        [-30, 0, 40],
        [-26, 0, 68],
        [0, 0, 84],
        [26, 0, 68],
        [30, 0, 40],
      ],
      5,
      { tone: "edge", group: "handle" },
    ),
    tube(
      [
        [-28, 0, 44],
        [-24, 0, 68],
        [0, 0, 82],
        [24, 0, 68],
        [28, 0, 44],
      ],
      1.6,
      { tone: "mid", group: "handle" },
    ),
  );

  return faces;
}

export const basket: PrototypeMeta = {
  slug: "basket",
  name: "Basket",
  component: "Objects",
  object: "Woven basket",
  story:
    "The handle lifts and the weave flexes, one bright strand running through it.",
  note: "A generic object: carrying as a texture, a woven bowl with an arch.",
  scene: figureScene({
    slug: "basket",
    name: "Basket",
    component: "Objects",
    object: "Woven basket",
    description:
      "A woven basket with an open top: three horizontal bands, diagonal strands, a rim and an arch handle.",
    aria:
      "An isometric woven basket with three bands, diagonal strands, a rim and an arch handle.",
    faces: basketFaces(),
    motions: [
      {
        group: "handle",
        kind: "sway",
        period: 3600,
        amount: 3,
        pivot: [0, 0, 40],
      },
      { group: "weave", kind: "breathe", period: 3200, amount: 0.02 },
      { group: "body", kind: "breathe", period: 5600, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 243. Shopping Bag — paper shopping bag                                     */
/* -------------------------------------------------------------------------- */

function shoppingBagFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...box(-38, -16, 0, 76, 32, 82, {
      r: 2,
      lip: true,
      tone: "edge",
      topTone: "mid",
      group: "bag",
    }),
    ...box(-40, -18, 82, 80, 36, 5, {
      r: 1,
      tone: "mid",
      topTone: "lo",
      group: "bag",
    }),
  );

  /* Two twisted paper handles. */
  for (const side of [-1, 1]) {
    faces.push(
      tube(
        [
          [side * 19, 16, 86],
          [side * 19, 16, 104],
          [side * 19, -16, 104],
          [side * 19, -16, 86],
        ],
        3.4,
        { tone: "edge", group: "handles" },
      ),
    );
  }

  /* Printed label with a bright rule. */
  faces.push(
    panel(-15, 15, 16.4, 30, 60, { tone: "mid", group: "label" }),
    panel(-12, 12, 16.6, 33, 57, { fill: false, tone: "lo", group: "label" }),
    stroke3(
      [
        [-8, 16.7, 47],
        [8, 16.7, 47],
      ],
      "hi",
      { group: "label" },
    ),
    stroke3(
      [
        [-8, 16.7, 41],
        [2, 16.7, 41],
      ],
      "lo",
      { group: "label" },
    ),
  );

  return faces;
}

export const shoppingBag: PrototypeMeta = {
  slug: "shopping-bag",
  name: "Shopping Bag",
  component: "Objects",
  object: "Paper shopping bag",
  story:
    "The paper handles lift and the bag opens at its folded top, the label catching the light.",
  note: "A generic object: carrying made disposable, folded paper and two handles.",
  scene: figureScene({
    slug: "shopping-bag",
    name: "Shopping Bag",
    component: "Objects",
    object: "Paper shopping bag",
    description:
      "A paper shopping bag standing on its base: a folded top edge, two twisted handles and a printed label.",
    aria:
      "An isometric paper shopping bag with a folded top edge, two twisted handles and a bright printed label.",
    faces: shoppingBagFaces(),
    motions: [
      { group: "handles", kind: "lift", period: 3200, amount: 2.4 },
      { group: "bag", kind: "breathe", period: 4600, amount: 0.008 },
      { group: "label", kind: "breathe", period: 5400, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 244. Wallet — leather wallet                                               */
/* -------------------------------------------------------------------------- */

function walletFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Two cards tucked in first; the body will hide their lower half. */
  faces.push(
    panel(-24, 12, -18, 4, 46, { tone: "lo", group: "card" }),
    panel(-16, 24, -12, 4, 58, { tone: "mid", group: "card" }),
    panel(-13, 21, -11.6, 7, 55, {
      fill: false,
      tone: "lo",
      group: "card",
    }),
    stroke3(
      [
        [-9, -11.5, 47],
        [8, -11.5, 47],
      ],
      "hi",
      { group: "card" },
    ),
    stroke3(
      [
        [-9, -11.5, 40],
        [2, -11.5, 40],
      ],
      "lo",
      { group: "card" },
    ),
    stroke3(
      [
        [-9, -11.5, 22],
        [12, -11.5, 22],
      ],
      "lo",
      { group: "card" },
    ),
  );

  /* The folded leather body, painted over the card roots. */
  faces.push(
    ...box(-44, -28, 2, 88, 56, 10, {
      r: 9,
      tone: "edge",
      topTone: "mid",
      group: "wallet",
    }),
  );

  /* Fold seam, edge stitching and a small strap on the front. */
  faces.push(
    stroke3(
      [
        [0, -27, 12.2],
        [0, 27, 12.2],
      ],
      "mid",
      { group: "wallet" },
    ),
  );
  for (let index = 0; index < 9; index += 1) {
    const x = -36 + index * 9;
    faces.push(
      stroke3(
        [
          [x, -21, 12.3],
          [x + 4, -21, 12.3],
        ],
        "lo",
        { group: "wallet" },
      ),
      stroke3(
        [
          [x, 21, 12.3],
          [x + 4, 21, 12.3],
        ],
        "lo",
        { group: "wallet" },
      ),
    );
  }
  faces.push(
    ...box(-8, 26, 4, 16, 4, 10, {
      r: 2,
      tone: "mid",
      topTone: "lo",
      group: "wallet",
    }),
  );

  return faces;
}

export const wallet: PrototypeMeta = {
  slug: "wallet",
  name: "Wallet",
  component: "Objects",
  object: "Leather wallet",
  story:
    "The wallet opens at the fold and a card slides up, its chip catching the light.",
  note: "A generic object: value kept close, a folded leather body and a card.",
  scene: figureScene({
    slug: "wallet",
    name: "Wallet",
    component: "Objects",
    object: "Leather wallet",
    description:
      "A leather wallet lying open: a fold seam, stitched edges and a card rising from behind the fold.",
    aria:
      "An isometric leather wallet with a fold seam, stitched edges, a rising card and a bright card line.",
    faces: walletFaces(),
    motions: [
      { group: "card", kind: "lift", period: 3400, amount: 4 },
      { group: "wallet", kind: "breathe", period: 4800, amount: 0.006 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 245. Ticket — perforated ticket                                            */
/* -------------------------------------------------------------------------- */

function ticketFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    flatCard(-16, 0, 8, 80, 44, 4, { tone: "edge", group: "body" }),
    flatCard(40, 0, 8.02, 32, 44, 0, { tone: "mid", group: "stub" }),
  );

  /* Perforation: a line of punched holes plus two edge notches. */
  for (let index = 0; index < 9; index += 1) {
    const y = -18 + index * 4.5;
    faces.push(dotAt(24, y, 8.2, 1.6, "lo", "body"));
  }
  for (const y of [-22, 22]) {
    faces.push(
      face2(circle(...at(24, y, 8.2), 3.6, 16), {
        tone: "lo",
        group: "body",
      }),
    );
  }

  /* Printed lines and a star cut-out, the accent. */
  for (let index = 0; index < 4; index += 1) {
    faces.push(
      flatLine(-46, -12 + index * 8, 10, -12 + index * 8, 8.2, "lo", "body"),
    );
  }
  const [sx, sy] = at(-30, 0, 8.3);
  faces.push(
    face2(star(sx, sy, 10, 4, 5), { tone: "hi", group: "body" }),
  );

  /* A serial bar on the stub. */
  for (let index = 0; index < 5; index += 1) {
    faces.push(
      flatLine(34 + index * 4, -12, 34 + index * 4, 4, 8.2, "mid", "stub"),
    );
  }

  return faces;
}

export const ticket: PrototypeMeta = {
  slug: "ticket",
  name: "Ticket",
  component: "Objects",
  object: "Perforated ticket",
  story:
    "The stub swings along the perforation while the bright star cut-out holds the eye.",
  note: "A generic object: admission as a paper thing meant to be torn.",
  scene: figureScene({
    slug: "ticket",
    name: "Ticket",
    component: "Objects",
    object: "Perforated ticket",
    description:
      "A perforated ticket lying flat: a punched seam, two edge notches, printed rules, a bright star and a stub.",
    aria:
      "An isometric perforated ticket with a punched seam, two notches, printed rules and a bright star cut-out.",
    faces: ticketFaces(),
    motions: [
      {
        group: "stub",
        kind: "sway",
        period: 3000,
        amount: 5,
        pivot: [24, 0, 8],
      },
      { group: "body", kind: "breathe", period: 4800, amount: 0.005 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 246. Stamp — postage stamp                                                 */
/* -------------------------------------------------------------------------- */

function stampFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const z = 8;

  /* Perforated square: a sinusoidal edge on all four sides. */
  const outline: Point2[] = [];
  const side = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    teeth: number,
  ) => {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 1;
    const nx = dy / len;
    const ny = -dx / len;
    for (let index = 0; index < 24; index += 1) {
      const t = index / 24;
      const off = Math.sin(t * Math.PI * teeth) * 2.7;
      outline.push(iso(x0 + dx * t + nx * off, y0 + dy * t + ny * off, z));
    }
  };
  side(-42, -42, 42, -42, 10);
  side(42, -42, 42, 42, 10);
  side(42, 42, -42, 42, 10);
  side(-42, 42, -42, -42, 10);
  faces.push(face2(outline, { tone: "edge", group: "stamp" }));

  /* Inner frame and portrait medallion. */
  faces.push(
    face2(
      [
        iso(-34, -34, z + 0.2),
        iso(34, -34, z + 0.2),
        iso(34, 34, z + 0.2),
        iso(-34, 34, z + 0.2),
      ],
      { fill: false, tone: "mid", group: "stamp" },
    ),
    ellipse3(0, 0, z + 0.25, 20, 18, {
      fill: false,
      tone: "mid",
      group: "stamp",
    }),
  );

  /* A small bust inside the medallion. */
  const [px, py] = at(0, 0, z + 0.3);
  faces.push(
    face2(circle(px - 3, py - 5, 5.6, 22), {
      fill: false,
      tone: "lo",
      group: "stamp",
    }),
    stroke2(
      [
        [px - 13, py + 10],
        [px - 8, py + 3],
        [px - 3, py + 1],
        [px + 2, py + 1],
        [px + 7, py + 4],
        [px + 12, py + 11],
      ],
      "lo",
      { group: "stamp" },
    ),
  );

  /* Denomination block and its printed rule. */
  faces.push(
    face2(
      [
        iso(16, 22, z + 0.25),
        iso(34, 22, z + 0.25),
        iso(34, 34, z + 0.25),
        iso(16, 34, z + 0.25),
      ],
      { fill: false, tone: "mid", group: "stamp" },
    ),
    flatLine(20, 28, 30, 28, z + 0.3, "lo", "stamp"),
    flatLine(20, 24, 26, 24, z + 0.3, "lo", "stamp"),
  );

  /* A small top-right corner lifts, with a bright fold line. */
  faces.push(
    face2(
      [
        iso(42, -42, z + 0.35),
        iso(32, -42, z + 0.35),
        iso(42, -32, z + 0.35),
      ],
      { tone: "mid", group: "corner" },
    ),
    stroke3(
      [
        [32, -42, z + 0.4],
        [42, -32, z + 0.4],
      ],
      "hi",
      { group: "corner" },
    ),
  );

  return faces;
}

export const stamp: PrototypeMeta = {
  slug: "stamp",
  name: "Stamp",
  component: "Objects",
  object: "Postage stamp",
  story:
    "One corner lifts off the paper and its bright fold line catches the light.",
  note: "A generic object: postage as a small collectible square with a perforated edge.",
  scene: figureScene({
    slug: "stamp",
    name: "Stamp",
    component: "Objects",
    object: "Postage stamp",
    description:
      "A postage stamp lying flat: a perforated edge, an inner frame, a portrait medallion and a lifted corner.",
    aria:
      "An isometric postage stamp with a perforated edge, a portrait medallion and a bright lifted corner.",
    faces: stampFaces(),
    motions: [
      { group: "corner", kind: "lift", period: 3200, amount: 3.4 },
      { group: "stamp", kind: "breathe", period: 5000, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 247. Newspaper — folded newspaper                                          */
/* -------------------------------------------------------------------------- */

function newspaperFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    quad([-82, -44, 6], [0, -44, 16], [0, 44, 16], [-82, 44, 6], {
      tone: "edge",
      group: "pages",
    }),
    quad([0, -44, 16], [82, -44, 6], [82, 44, 6], [0, 44, 16], {
      tone: "edge",
      group: "pages",
    }),
    /* Page block thickness at the outer edges. */
    face3(
      [
        [-82, -44, 6],
        [-82, 44, 6],
        [-82, 44, 2],
        [-82, -44, 2],
      ],
      { tone: "lo", group: "pages" },
    ),
    face3(
      [
        [82, -44, 6],
        [82, 44, 6],
        [82, 44, 2],
        [82, -44, 2],
      ],
      { tone: "lo", group: "pages" },
    ),
  );

  /* Columns of type on both pages. */
  for (let row = 0; row < 9; row += 1) {
    const y = -32 + row * 8;
    faces.push(
      stroke3(
        [
          [0, y, 16.2],
          [-72, y, 7.6],
        ],
        "lo",
        { group: "pages" },
      ),
      stroke3(
        [
          [0, y, 16.2],
          [72, y, 7.6],
        ],
        "lo",
        { group: "pages" },
      ),
    );
  }

  /* Headline bar and a bright rule under it (the accent). */
  faces.push(
    stroke3(
      [
        [-70, -28, 8.4],
        [-14, -28, 12.6],
      ],
      "mid",
      { group: "pages" },
    ),
    stroke3(
      [
        [-70, -24, 8.8],
        [-10, -24, 13.2],
      ],
      "hi",
      { group: "pages" },
    ),
  );

  /* A photo block on the right page. */
  faces.push(
    face3(
      [
        [12, -30, 15],
        [52, -30, 11.6],
        [52, 6, 11.6],
        [12, 6, 15],
      ],
      { fill: false, tone: "mid", group: "pages" },
    ),
    stroke3(
      [
        [12, -30, 15],
        [52, 6, 11.6],
      ],
      "lo",
      { group: "pages" },
    ),
    stroke3(
      [
        [52, -30, 11.6],
        [12, 6, 15],
      ],
      "lo",
      { group: "pages" },
    ),
  );

  /* A curling corner. */
  faces.push(
    face2(
      [
        iso(-82, -44, 6),
        iso(-66, -44, 7.4),
        iso(-76, -30, 9.6),
      ],
      { tone: "mid", group: "curl" },
    ),
  );

  return faces;
}

export const newspaper: PrototypeMeta = {
  slug: "newspaper",
  name: "Newspaper",
  component: "Objects",
  object: "Folded newspaper",
  story:
    "A page turns at the fold and the bright rule under the headline catches the light.",
  note: "A generic object: the day's news as a stack of folded paper and type.",
  scene: figureScene({
    slug: "newspaper",
    name: "Newspaper",
    component: "Objects",
    object: "Folded newspaper",
    description:
      "A folded newspaper spread open: two ruled pages, a headline bar, a photo block and a curling corner.",
    aria:
      "An isometric folded newspaper with two ruled pages, a bright headline rule, a photo block and a curling corner.",
    faces: newspaperFaces(),
    motions: [
      { group: "pages", kind: "breathe", period: 4600, amount: 0.005 },
      { group: "curl", kind: "lift", period: 3000, amount: 2.6 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 248. Map — folded map                                                      */
/* -------------------------------------------------------------------------- */

function mapFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Four accordion panels, alternating up and down. */
  const folds = [-80, -40, 0, 40, 80];
  const heights = [6, 14, 6, 14, 6];
  for (let index = 0; index < 4; index += 1) {
    const x0 = folds[index];
    const x1 = folds[index + 1];
    const z0 = heights[index];
    const z1 = heights[index + 1];
    faces.push(
      quad([x0, -34, z0], [x1, -34, z1], [x1, 34, z1], [x0, 34, z0], {
        tone: "edge",
        group: "panels",
      }),
      stroke3(
        [
          [x1, -34, z1],
          [x1, 34, z1],
        ],
        "mid",
        { group: "panels" },
      ),
    );
  }

  /* A route crossing every panel. */
  const route: Point3[] = [
    [-72, -12, 7],
    [-56, -4, 10],
    [-40, 4, 14.2],
    [-24, -6, 11],
    [-4, -10, 6.4],
    [12, -4, 8.6],
    [30, 8, 12.4],
    [48, 2, 12],
    [70, -8, 6.6],
  ];
  faces.push(stroke3(route, "hi", { group: "route" }));

  /* A marker pin on the route. */
  const pin = route[5];
  faces.push(
    tube(
      [
        [pin[0], pin[1], pin[2] + 2],
        [pin[0], pin[1], pin[2] + 18],
      ],
      2.4,
      { tone: "mid", group: "marker" },
    ),
    face2(
      [
        [at(pin[0], pin[1], pin[2] + 18)[0], at(pin[0], pin[1], pin[2] + 18)[1]],
        [at(pin[0], pin[1], pin[2] + 18)[0] + 12, at(pin[0], pin[1], pin[2] + 18)[1] + 6],
        [at(pin[0], pin[1], pin[2] + 18)[0], at(pin[0], pin[1], pin[2] + 18)[1] + 12],
      ],
      { tone: "mid", group: "marker" },
    ),
  );

  /* A small compass rose. */
  const [rx, ry] = at(-52, 22, 15);
  faces.push(
    face2(star(rx, ry, 8, 3, 4, -Math.PI / 2), {
      fill: false,
      tone: "lo",
      group: "panels",
    }),
  );

  return faces;
}

export const map: PrototypeMeta = {
  slug: "map",
  name: "Map",
  component: "Objects",
  object: "Folded map",
  story:
    "The accordion opens a fold and the bright route stretches across the panels.",
  note: "A generic object: a place carried in the pocket, panels folded on themselves.",
  scene: figureScene({
    slug: "map",
    name: "Map",
    component: "Objects",
    object: "Folded map",
    description:
      "A folded map of four accordion panels with a bright route, a marker pin and a compass rose.",
    aria:
      "An isometric folded map with four accordion panels, a bright route, a marker pin and a compass rose.",
    faces: mapFaces(),
    motions: [
      { group: "panels", kind: "breathe", period: 4600, amount: 0.012 },
      { group: "route", kind: "flicker", period: 3200, amount: 0.03 },
      { group: "marker", kind: "lift", period: 3000, amount: 2.4 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 249. Binoculars — binoculars                                               */
/* -------------------------------------------------------------------------- */

function binocularsFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Two parallel barrels: far one first. */
  faces.push(
    ...drumX(-48, 48, -19, 54, 17, {
      tone: "edge",
      topTone: "mid",
      group: "barrels",
    }),
    ...drumX(-54, -48, -19, 54, 12, {
      tone: "mid",
      topTone: "lo",
      group: "barrels",
      rim: false,
    }),
  );
  faces.push(
    ...drumX(-48, 48, 19, 54, 17, {
      tone: "edge",
      topTone: "mid",
      group: "barrels",
    }),
    ...drumX(-54, -48, 19, 54, 12, {
      tone: "mid",
      topTone: "lo",
      group: "barrels",
      rim: false,
    }),
  );

  /* Bridge and focus wheel. */
  faces.push(
    ...box(-8, -22, 44, 16, 44, 20, {
      r: 2,
      tone: "mid",
      topTone: "lo",
      group: "bridge",
    }),
    ...cylinder(0, 0, 64, 8, 8, 7, {
      tone: "mid",
      topTone: "lo",
      group: "bridge",
    }),
    frontRing(0, 0, 72, 5, "lo", "bridge"),
  );

  /* Objective rings with one bright glint. */
  for (const y of [-19, 19]) {
    faces.push(
      face2(circleYZ(48.6, y, 54, 17, 36), {
        tone: "mid",
        group: "barrels",
      }),
      face2(circleYZ(49.1, y, 54, 12.6, 32), {
        fill: false,
        tone: "lo",
        group: "barrels",
      }),
      face2(circleYZ(49.4, y, 54, 8, 26), {
        fill: false,
        tone: "lo",
        group: "barrels",
      }),
    );
  }
  const [gx, gy] = at(49.6, 19, 56);
  faces.push(
    stroke2(
      [
        [gx - 5, gy - 3],
        [gx - 1, gy - 8],
      ],
      "hi",
      { group: "glint" },
    ),
  );

  return faces;
}

export const binoculars: PrototypeMeta = {
  slug: "binoculars",
  name: "Binoculars",
  component: "Objects",
  object: "Binoculars",
  story:
    "The barrels breathe as they focus and a glint crosses the near objective.",
  note: "A generic object: the far made near, two matched tubes on a hinge.",
  scene: figureScene({
    slug: "binoculars",
    name: "Binoculars",
    component: "Objects",
    object: "Binoculars",
    description:
      "Binoculars seen from the objective end: two parallel barrels, a centre bridge, a focus wheel and a glint.",
    aria:
      "An isometric pair of binoculars with two parallel barrels, a centre bridge, a focus wheel and a bright glint.",
    faces: binocularsFaces(),
    motions: [
      { group: "barrels", kind: "breathe", period: 3000, amount: 0.015 },
      { group: "glint", kind: "lift", period: 2800, amount: 3 },
      { group: "bridge", kind: "breathe", period: 5000, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 250. Telescope — telescope on a tripod                                     */
/* -------------------------------------------------------------------------- */

function telescopeFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Tripod: the telescope's own support. */
  const hub: Point3 = [0, 0, 56];
  const feet: Point3[] = [
    [-42, 22, 0],
    [40, 18, 0],
    [4, -42, 0],
  ];
  for (const foot of feet) {
    faces.push(
      tube([hub, foot], 3, { tone: "edge", group: "tripod" }),
      ...ball(foot[0], foot[1], 1.6, 3.4, { tone: "mid", group: "tripod" }),
    );
  }
  faces.push(
    ...cylinder(0, 0, 52, 9, 8, 7, {
      tone: "mid",
      topTone: "lo",
      group: "tripod",
    }),
  );

  /* Long tube aimed up, with a collar and an eyepiece. */
  faces.push(
    ...tapered([-14, 0, 62], [48, 0, 108], 12, 16, {
      tone: "edge",
      group: "tube",
    }),
    ...tapered([-4, 0, 71], [4, 0, 77], 17, 17, {
      tone: "mid",
      group: "tube",
    }),
    ...tapered([-23, 0, 56], [-14, 0, 62], 7, 9, {
      tone: "mid",
      group: "tube",
    }),
  );

  /* Objective lens and its rings. */
  const [lx, ly] = at(48, 0, 108);
  faces.push(
    face2(circle(lx, ly, 16, 34), { tone: "mid", group: "tube" }),
    face2(circle(lx, ly, 11, 30), { fill: false, tone: "lo", group: "tube" }),
    face2(circle(lx, ly, 6, 24), { fill: false, tone: "lo", group: "tube" }),
  );

  /* A little star near the lens: the accent. */
  faces.push(
    face2(star(lx + 38, ly - 28, 9, 3.4, 4, -Math.PI / 2), {
      tone: "hi",
      group: "star",
    }),
  );

  return faces;
}

export const telescope: PrototypeMeta = {
  slug: "telescope",
  name: "Telescope",
  component: "Objects",
  object: "Telescope on a tripod",
  story:
    "The long tube tilts on its tripod and a bright star answers the objective.",
  note: "A generic object: the sky brought close by a long tube on three legs.",
  scene: figureScene({
    slug: "telescope",
    name: "Telescope",
    component: "Objects",
    object: "Telescope on a tripod",
    description:
      "A telescope on a tripod: three legs, a pan head, a long tube with a collar and an objective lens.",
    aria:
      "An isometric telescope on a tripod with a long tube, a collar, an objective lens and a bright star.",
    faces: telescopeFaces(),
    motions: [
      {
        group: "tube",
        kind: "sway",
        period: 4200,
        amount: 4,
        pivot: [0, 0, 56],
      },
      { group: "star", kind: "flicker", period: 2200, amount: 0.18 },
      { group: "tripod", kind: "breathe", period: 6000, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 251. Microscope — microscope                                               */
/* -------------------------------------------------------------------------- */

function microscopeFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...box(-32, -20, 0, 64, 40, 8, {
      r: 12,
      lip: true,
      tone: "edge",
      topTone: "mid",
      group: "base",
    }),
    tube(
      [
        [-18, 0, 8],
        [-22, 0, 52],
        [-10, 0, 86],
      ],
      8,
      { tone: "edge", group: "arm" },
    ),
    ...cylinder(10, 0, 58, 40, 8, 8, {
      tone: "edge",
      topTone: "lo",
      group: "tube",
    }),
    ...cylinder(10, 0, 60, 4, 9, 9, {
      tone: "mid",
      topTone: "lo",
      group: "tube",
    }),
    ...cylinder(10, 0, 98, 8, 10, 10, {
      tone: "edge",
      topTone: "lo",
      group: "tube",
    }),
    ...cylinder(10, 0, 48, 10, 5, 7, {
      tone: "mid",
      topTone: "lo",
      group: "objective",
    }),
  );

  /* Stage with a glass slide. */
  faces.push(
    ...box(-20, -18, 38, 44, 36, 5, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "stage",
    }),
    flatCard(2, 0, 43.4, 20, 12, 1, { tone: "mid", group: "slide" }),
    flatLine(-6, 0, 8, 0, 43.6, "hi", "slide"),
  );

  /* Mirror under the stage. */
  const [mx, my] = at(0, 0, 22);
  faces.push(
    face2(ellipseRot(mx, my, 17, 8, -0.35, 34), {
      tone: "mid",
      group: "mirror",
    }),
    face2(ellipseRot(mx, my, 12, 5.4, -0.35, 28), {
      fill: false,
      tone: "lo",
      group: "mirror",
    }),
    stroke2(
      [
        [mx - 9, my - 2],
        [mx - 2, my - 6],
      ],
      "hi",
      { group: "mirror" },
    ),
  );

  /* Focus knob on the side. */
  faces.push(
    disc3(-24, 12, 64, 8, "yz", { tone: "mid", group: "arm" }),
    face2(circleYZ(-24, 12, 64, 4.4, 24), {
      fill: false,
      tone: "lo",
      group: "arm",
    }),
  );

  return faces;
}

export const microscope: PrototypeMeta = {
  slug: "microscope",
  name: "Microscope",
  component: "Objects",
  object: "Microscope",
  story:
    "The stage lifts a notch and the mirror turns, its bright edge catching the light.",
  note: "A generic object: the very small made large, a stage under a tube.",
  scene: figureScene({
    slug: "microscope",
    name: "Microscope",
    component: "Objects",
    object: "Microscope",
    description:
      "A microscope on a heavy base: a curved arm, an upright tube, a stage with a slide, a mirror and a focus knob.",
    aria:
      "An isometric microscope with a heavy base, a curved arm, an upright tube, a stage, a mirror and a bright glint.",
    faces: microscopeFaces(),
    motions: [
      { group: "stage", kind: "lift", period: 3200, amount: 2.6 },
      { group: "mirror", kind: "sway", period: 3600, amount: 6 },
      { group: "arm", kind: "breathe", period: 6000, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 252. Flask — Erlenmeyer flask                                              */
/* -------------------------------------------------------------------------- */

function flaskFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 52, 30, 10, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
      group: "flask",
    }),
    ...cylinder(0, 0, 52, 20, 9, 9, {
      tone: "edge",
      topTone: "lo",
      group: "flask",
    }),
    ...cylinder(0, 0, 72, 5, 11, 11, {
      tone: "edge",
      topTone: "lo",
      group: "flask",
    }),
    ...cylinder(0, 0, 76, 12, 7, 8, {
      tone: "mid",
      topTone: "lo",
      group: "stopper",
    }),
  );

  /* Liquid: a body inside the cone with a bright surface. */
  faces.push(
    face3(
      [
        [-20, 0, 10],
        [20, 0, 10],
        [13, 0, 30],
        [-13, 0, 30],
      ],
      { tone: "lo", group: "liquid" },
    ),
    ellipse3(0, 0, 30, 16, 16, {
      fill: false,
      tone: "hi",
      group: "liquid",
    }),
  );

  /* Three bubbles rising. */
  for (const [x, y, z, r] of [
    [-6, 0, 18, 2.6],
    [4, 0, 30, 2],
    [-2, 0, 42, 1.8],
  ] as const) {
    faces.push(
      face2(circle(...at(x, y, z), r, 12), {
        fill: false,
        tone: "mid",
        group: "bubbles",
      }),
    );
  }

  /* Graduation marks on the cone. */
  for (const [z, w] of [
    [14, 24],
    [24, 20],
    [34, 16],
  ] as const) {
    faces.push(
      stroke3(
        [
          [w, 12, z],
          [w + 5, 12, z],
        ],
        "lo",
        { group: "flask" },
      ),
    );
  }

  return faces;
}

export const flask: PrototypeMeta = {
  slug: "flask",
  name: "Flask",
  component: "Objects",
  object: "Erlenmeyer flask",
  story:
    "The liquid turns, its bright surface tilts and three bubbles climb the glass.",
  note: "A generic object: science as glassware, a cone with a narrow neck.",
  scene: figureScene({
    slug: "flask",
    name: "Flask",
    component: "Objects",
    object: "Erlenmeyer flask",
    description:
      "An Erlenmeyer flask on its flat base: a conical body, a narrow neck, a stopper, liquid and three bubbles.",
    aria:
      "An isometric Erlenmeyer flask with a conical body, a narrow neck, a stopper, liquid and rising bubbles.",
    faces: flaskFaces(),
    motions: [
      { group: "bubbles", kind: "bob", period: 2600, amount: 3.4 },
      { group: "liquid", kind: "breathe", period: 3200, amount: 0.02 },
      {
        group: "flask",
        kind: "sway",
        period: 5600,
        amount: 1,
        pivot: [0, 0, 0],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 253. Atom — atom with orbits                                               */
/* -------------------------------------------------------------------------- */

function atomFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [cx, cy] = at(0, 0, 80);

  faces.push(...ball(0, 0, 80, 14, { tone: "edge", group: "nucleus" }));

  const orbits: Array<[number, number, number, number]> = [
    [0, 6000, 0, 16],
    [1.05, 7800, 1, 10],
    [2.1, 9600, 2, 22],
  ];
  orbits.forEach(([angle, period, index, electronAngle]) => {
    const group = `orbit${index}`;
    faces.push(
      face2(ellipseRot(cx, cy, 58, 21, angle, 56), {
        fill: false,
        tone: "mid",
        group,
      }),
    );
    const u = Math.cos(electronAngle) * 58;
    const v = Math.sin(electronAngle) * 21;
    const ex = cx + u * Math.cos(angle) - v * Math.sin(angle);
    const ey = cy + u * Math.sin(angle) + v * Math.cos(angle);
    faces.push(
      face2(circle(ex, ey, 5, 18), {
        tone: index === 1 ? "hi" : "mid",
        group,
      }),
      face2(circle(ex, ey, 8.5, 18), {
        fill: false,
        tone: "lo",
        group,
      }),
    );
    void period;
  });

  return faces;
}

export const atom: PrototypeMeta = {
  slug: "atom",
  name: "Atom",
  component: "Objects",
  object: "Atom with orbits",
  story:
    "The three orbits turn at different speeds and one bright electron leads the second ring.",
  note: "A generic object: the smallest structure made visible, a nucleus in its rings.",
  scene: figureScene({
    slug: "atom",
    name: "Atom",
    component: "Objects",
    object: "Atom with orbits",
    description:
      "An atom: a nucleus in the centre with three elliptical orbits and one electron on each ring.",
    aria:
      "An isometric atom with a central nucleus, three elliptical orbits and a bright electron on the second ring.",
    faces: atomFaces(),
    motions: [
      {
        group: "orbit0",
        kind: "spin",
        period: 6000,
        amount: 360,
        pivot: [0, 0, 80],
      },
      {
        group: "orbit1",
        kind: "spin",
        period: 7800,
        amount: 360,
        pivot: [0, 0, 80],
      },
      {
        group: "orbit2",
        kind: "spin",
        period: 9600,
        amount: 360,
        pivot: [0, 0, 80],
      },
      { group: "nucleus", kind: "breathe", period: 2600, amount: 0.04 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                  */
/* -------------------------------------------------------------------------- */

export const lot10Prototypes: PrototypeMeta[] = [
  bottle,
  wineGlass,
  mug,
  apple,
  cherry,
  strawberry,
  guitar,
  piano,
  paintbrush,
  palette,
  scissors,
  pencil,
  paperclip,
  bell,
  candle,
  lamp,
  basket,
  shoppingBag,
  wallet,
  ticket,
  stamp,
  newspaper,
  map,
  binoculars,
  telescope,
  microscope,
  flask,
  atom,
];

export const lot10BySlug = new Map(
  lot10Prototypes.map((item) => [item.slug, item]),
);
