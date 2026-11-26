/*
 * Linear v4 — lot 1 (components 1 to 25 of the object catalogue).
 *
 * Each scene is one real-world object, drawn from scratch in the same 2:1
 * axonometric space as geom.ts. The object is chosen for the component's job,
 * never the object used by the studied reference. No scene has a common slab:
 * a base is drawn only when it is a functional part of the object. Faces are
 * painted back to front and filled with the plate tone, so a front face hides
 * the construction behind it and the hairline stays 0.9 px.
 *
 * Hover animations live in 3D-named groups and are frozen by
 * `prefers-reduced-motion` in the shared renderer.
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
  cake,
  calendar,
  chat,
  coffeeCup,
  generatedImage,
  safari,
  slider,
  spinner,
  status,
  toast,
  videoPlayer,
} from "./scenes";

/* -------------------------------------------------------------------------- */
/* Local helpers                                                              */
/* -------------------------------------------------------------------------- */

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

/** Rounded rectangle lying on a vertical (x, z) plane at a fixed y. */
function vRounded(
  cx: number,
  y: number,
  z0: number,
  w: number,
  h: number,
  r = 0,
  steps = 4,
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

/** A flat panel on a vertical (x, z) plane at y = const. */
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

/** A flat panel on a vertical (y, z) plane at x = const. */
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

/* -------------------------------------------------------------------------- */
/* 1. Button — arcade push-button                                             */
/* -------------------------------------------------------------------------- */

function buttonFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 7, 34, 36, {
      tone: "mid",
      topTone: "lo",
      bottomArc: true,
    }),
  );
  for (let index = 0; index < 16; index += 1) {
    const a = (index / 16) * Math.PI * 2;
    faces.push(
      stroke3(
        [
          [Math.cos(a) * 34.2, Math.sin(a) * 34.2, 1.6],
          [Math.cos(a) * 35.4, Math.sin(a) * 35.4, 1.6],
        ],
        "lo",
      ),
    );
  }

  faces.push(
    ...cylinder(0, 0, 7, 11, 31, 27.5, { tone: "edge", topTone: "lo" }),
    ellipse3(0, 0, 18.1, 27.6, 27.6, {
      fill: false,
      tone: "hi",
      group: "ring",
    }),
    ...cylinder(0, 0, 18, 5, 26.5, 24.5, {
      tone: "edge",
      topTone: "lo",
      hollow: 3.2,
    }),
  );

  faces.push(
    ...cylinder(0, 0, 20, 12, 25, 25, {
      tone: "edge",
      topTone: "lo",
      group: "cap",
    }),
    ellipse3(0, 0, 32.2, 25.1, 25.1, {
      fill: false,
      tone: "hi",
      group: "ring",
    }),
    ...cylinder(0, 0, 32, 5, 25, 20, {
      tone: "edge",
      topTone: "mid",
      group: "cap",
    }),
    ellipse3(0, 0, 37.2, 20, 20, { tone: "mid", group: "cap" }),
    ellipse3(0, 0, 37.3, 14, 14, {
      fill: false,
      tone: "lo",
      group: "cap",
    }),
    ellipse3(0, 0, 37.4, 4.2, 4.2, { tone: "lo", group: "cap" }),
  );

  const [hx, hy] = iso(-8, -7, 37.5);
  faces.push(
    face2(ellipse2(hx, hy, 7.5, 3.4, 18), {
      fill: false,
      tone: "mid",
      group: "cap",
    }),
  );

  for (const [sx, sy, ex, ey] of [
    [-30, -4, -33.5, -4],
    [30, 4, 33.5, 4],
  ] as const) {
    const [dx, dy] = iso(sx, sy, 18.2);
    faces.push(
      face2(ellipse2(dx, dy, 2.2, 2.2, 16), { tone: "lo" }),
      stroke3(
        [
          [sx, sy, 18.3],
          [ex, ey, 18.3],
        ],
        "mid",
      ),
    );
  }

  const [lx, ly] = iso(0, 25.8, 12);
  faces.push(
    face2(ellipse2(lx, ly, 2, 2, 14), { tone: "hi", group: "ring" }),
  );

  for (const [x, y] of [
    [-20, 30],
    [20, -30],
  ] as const) {
    faces.push(
      stroke3(
        [
          [x, y, 2],
          [x, y, 9],
        ],
        "lo",
      ),
    );
  }

  return faces;
}

export const button: PrototypeMeta = {
  slug: "button",
  name: "Button",
  component: "Button",
  object: "Arcade push-button",
  story:
    "The cap sinks into its chrome collar until its ring catches the light, then springs back.",
  note:
    "A button is a surface made to be pressed: the travel is visible before the click.",
  scene: figureScene({
    slug: "button",
    name: "Button",
    component: "Controls",
    object: "Arcade push-button",
    description:
      "An arcade push-button: a chrome bezel, a deep collar and a domed cap with a small press mark.",
    aria:
      "An isometric arcade push-button with a chrome bezel, a recessed collar and a domed cap.",
    faces: buttonFaces(),
    motions: [
      { group: "cap", kind: "bob", period: 1600, amount: 4.2 },
      { group: "ring", kind: "breathe", period: 2600, amount: 0.018 },
    ],
    press: 1.4,
  }),
};

/* -------------------------------------------------------------------------- */
/* 2. Button Group — typewriter key bank                                      */
/* -------------------------------------------------------------------------- */

function keycap(x: number, group: string): FigureFace[] {
  const faces: FigureFace[] = [];
  faces.push(
    ...cylinder(x, 0, 30, 8, 13, 12, {
      tone: "edge",
      topTone: "mid",
      group,
    }),
    ellipse3(x, 0, 30.2, 13.2, 13.2, {
      fill: false,
      tone: "mid",
      group,
    }),
  );
  const [px, py] = iso(x, 0, 38.3);
  faces.push(
    face2(ellipse2(px, py, 9, 9, 24), {
      fill: false,
      tone: "lo",
      group,
    }),
  );
  const glyphTone: DetailTone = group === "key-b" ? "hi" : "lo";
  faces.push(
    face2(
      [
        [px - 3.6, py + 3.2],
        [px, py - 3.4],
        [px + 3.6, py + 3.2],
      ],
      { fill: false, tone: glyphTone, group },
    ),
    face2(
      [
        [px - 2.2, py + 0.2],
        [px + 2.2, py + 0.2],
      ],
      { fill: false, tone: glyphTone, group },
    ),
  );
  return faces;
}

function buttonGroupFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    tube(
      [
        [-46, 22, 12],
        [46, 22, 12],
      ],
      3.2,
      { tone: "mid" },
    ),
    tube(
      [
        [-46, 28, 4],
        [46, 28, 4],
      ],
      2.6,
      { tone: "lo" },
    ),
    tube(
      [
        [-44, 0, 4],
        [44, 0, 4],
      ],
      3.4,
      { tone: "mid" },
    ),
  );
  for (const x of [-46, 46]) {
    faces.push(
      disc3(x, 22, 12, 3.2, "yz", { tone: "mid" }),
      disc3(x, 28, 4, 2.6, "yz", { tone: "lo" }),
    );
  }
  for (const x of [-44, 44]) {
    faces.push(disc3(x, 0, 4, 3.4, "yz", { tone: "mid" }));
  }

  for (const x of [-30, 0, 30]) {
    const group = x === -30 ? "key-a" : x === 0 ? "key-b" : "key-c";
    faces.push(
      tube(
        [
          [x, 0, 10],
          [x, 24, 10],
          [x, 24, 8],
        ],
        3,
        { tone: "mid" },
      ),
      tube(
        [
          [x, 0, 10],
          [x, 0, 30],
        ],
        5,
        { tone: "edge", group },
      ),
      ellipse3(x, 0, 10.2, 7, 7, { tone: "lo", group }),
    );
    for (const z of [14, 18, 22]) {
      faces.push(
        ellipse3(x, 0, z, 5.8, 5.8, {
          fill: false,
          tone: "lo",
          group,
        }),
      );
    }
    faces.push(...keycap(x, group));
  }

  for (const x of [-38, 38]) {
    faces.push(
      tube(
        [
          [x, 24, 12],
          [x, 24, 20],
        ],
        2,
        { tone: "lo" },
      ),
    );
  }

  return faces;
}

export const buttonGroup: PrototypeMeta = {
  slug: "button-group",
  name: "Button Group",
  component: "Button Group",
  object: "Typewriter key bank",
  story:
    "The keys strike in a wave from left to right, each one returning before the next lands.",
  note:
    "Ganged keys stay independent on one linkage: separate choices, one machine.",
  scene: figureScene({
    slug: "button-group",
    name: "Button Group",
    component: "Controls",
    object: "Typewriter key bank",
    description:
      "Three typewriter keys on a common linkage rail, each with a round cap and a struck letter mark.",
    aria:
      "An isometric bank of three typewriter keys on a shared metal linkage rail.",
    faces: buttonGroupFaces(),
    motions: [
      { group: "key-a", kind: "bob", period: 1700, amount: 3.6, phase: 0 },
      { group: "key-b", kind: "bob", period: 1700, amount: 3.6, phase: 0.18 },
      { group: "key-c", kind: "bob", period: 1700, amount: 3.6, phase: 0.36 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 3. Toggle — rocker light switch                                            */
/* -------------------------------------------------------------------------- */

function toggleFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...prism(roundedRect(-32, -22, 64, 44, 4, 4), 0, 9, {
      lip: true,
      topTone: "mid",
      tone: "edge",
    }),
  );

  faces.push(
    face3(
      roundedRect(-26, -16, 52, 32, 3, 4).map(
        ([x, y]) => [x, y, 9.15] as Point3,
      ),
      { tone: "lo" },
    ),
  );

  const x0 = -25.5;
  const x1 = 25.5;
  const y0 = -16.5;
  const y1 = 16.5;
  const zBottom = 6;
  const zBack = 25;
  const zFront = 12;

  const back: Point3[] = [
    [x0, y0, zBottom],
    [x1, y0, zBottom],
    [x1, y0, zBack],
    [x0, y0, zBack],
  ];
  const right: Point3[] = [
    [x1, y0, zBottom],
    [x1, y1, zBottom],
    [x1, y1, zFront],
    [x1, y0, zBack],
  ];
  const left: Point3[] = [
    [x0, y1, zBottom],
    [x0, y0, zBottom],
    [x0, y0, zBack],
    [x0, y1, zFront],
  ];
  const front: Point3[] = [
    [x1, y1, zBottom],
    [x0, y1, zBottom],
    [x0, y1, zFront],
    [x1, y1, zFront],
  ];
  const top: Point3[] = [
    [x0, y0, zBack],
    [x1, y0, zBack],
    [x1, y1, zFront],
    [x0, y1, zFront],
  ];

  faces.push(
    face3(back, { tone: "edge", group: "rocker" }),
    face3(right, { tone: "edge", group: "rocker" }),
    face3(left, { tone: "lo", group: "rocker" }),
    face3(front, { tone: "edge", group: "rocker" }),
    face3(top, { tone: "mid", group: "rocker" }),
  );

  for (const y of [-6, 5]) {
    const z = 18.5 - y * 0.3939;
    faces.push(
      stroke3(
        [
          [-20, y, z],
          [20, y, z],
        ],
        "lo",
        { group: "rocker" },
      ),
    );
  }

  for (const side of [-1, 1] as const) {
    faces.push(
      disc3(side * 25.7, 0, 13.6, 2.4, "yz", {
        tone: "mid",
        group: "rocker",
      }),
      disc3(side * 25.8, 0, 13.6, 0.9, "yz", {
        tone: "lo",
        group: "rocker",
      }),
    );
  }

  const [lampX, lampY] = iso(0, -8, 21.7);
  faces.push(
    face2(ellipse2(lampX, lampY, 3.8, 3.8, 18), {
      tone: "hi",
      group: "lamp",
    }),
    face2(ellipse2(lampX, lampY, 5.8, 5.8, 20), {
      fill: false,
      tone: "lo",
      group: "lamp",
    }),
  );

  for (const [sx, sy] of [
    [-28, -18],
    [28, 18],
  ] as const) {
    const [dx, dy] = iso(sx, sy, 9.4);
    faces.push(
      face2(ellipse2(dx, dy, 2.1, 2.1, 16), { tone: "lo" }),
      face2(
        [
          [dx - 1.6, dy],
          [dx + 1.6, dy],
        ],
        { fill: false, tone: "mid" },
      ),
    );
  }

  faces.push(
    stroke3(
      [
        [-22, 19, 9.5],
        [-17, 19, 9.5],
      ],
      "lo",
    ),
    ellipse3(20, 19, 9.5, 2.6, 2.6, {
      fill: false,
      tone: "lo",
    }),
  );

  return faces;
}

export const toggle: PrototypeMeta = {
  slug: "toggle",
  name: "Toggle",
  component: "Toggle",
  object: "Rocker light switch",
  story:
    "The rocker crosses its pivot and the small lamp on its high side changes state.",
  note:
    "A toggle keeps the state it is left in: the position itself is the answer.",
  scene: figureScene({
    slug: "toggle",
    name: "Toggle",
    component: "Controls",
    object: "Rocker light switch",
    description:
      "A rocker light switch in its frame: a tilted rocker, a pivot seam and a small indicator lamp.",
    aria:
      "An isometric rocker light switch in a rounded frame with a tilted rocker and an indicator lamp.",
    faces: toggleFaces(),
    motions: [
      { group: "rocker", kind: "sway", period: 2800, amount: 2.4, pivot: [0, 0, 16] },
      { group: "lamp", kind: "flicker", period: 1900, amount: 0.2 },
    ],
    press: 1.2,
  }),
};

/* -------------------------------------------------------------------------- */
/* 4. Switch — railway turnout lever                                          */
/* -------------------------------------------------------------------------- */

function switchFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...prism(roundedRect(-30, -20, 60, 40, 4, 4), 0, 10, {
      lip: true,
      topTone: "mid",
      tone: "edge",
    }),
  );

  faces.push(
    ...box(-9, -7, 10, 18, 14, 15, { r: 2, tone: "mid" }),
    disc3(0, 0, 22, 6, "yz", { tone: "edge" }),
    disc3(0, 0, 22, 2.4, "yz", { tone: "lo" }),
  );

  const sector: Point3[] = [[0, 0, 20]];
  for (let index = 0; index <= 16; index += 1) {
    const a = 0.18 + (index / 16) * 1.24;
    sector.push([Math.cos(a) * 35, 0, 20 + Math.sin(a) * 35]);
  }
  faces.push(face3(sector, { tone: "mid", fill: true }));

  for (let index = 0; index <= 4; index += 1) {
    const a = 0.24 + (index / 4) * 1.12;
    const notch = (
      r0: number,
      r1: number,
    ): [Point3, Point3] => [
      [Math.cos(a) * r0, 0, 20 + Math.sin(a) * r0],
      [Math.cos(a) * r1, 0, 20 + Math.sin(a) * r1],
    ];
    faces.push(stroke3(notch(29, 35), "lo"));
  }

  faces.push(
    stroke3(
      arc3(0, 0, 20, 35, 0.18, 1.42, "xz", 22).map(
        ([x, y, z]) => [x, y, z] as Point3,
      ),
      "edge",
    ),
  );

  faces.push(
    tube(
      [
        [0, 0, 20],
        [-17, 0, 9],
      ],
      4,
      { tone: "mid", group: "lever" },
    ),
    ...box(-24, -6, 3, 14, 12, 10, {
      r: 2,
      tone: "edge",
      group: "lever",
    }),
    tube(
      [
        [0, 0, 20],
        [26, 0, 61],
      ],
      4.4,
      { tone: "edge", group: "lever" },
    ),
  );

  const [bx, by] = iso(26, 0, 62);
  faces.push(
    face2(ellipse2(bx, by, 6.4, 6.4, 22), {
      tone: "edge",
      group: "lever",
    }),
    face2(ellipse2(bx, by, 3.4, 3.4, 18), {
      tone: "hi",
      group: "lever",
    }),
  );

  faces.push(
    tube(
      [
        [8, 0, 18],
        [18, 0, 14],
      ],
      2.4,
      { tone: "lo", group: "latch" },
    ),
    ...box(16, -4, 12, 8, 8, 4, { r: 1.5, tone: "mid", group: "latch" }),
  );

  for (const [x, y] of [
    [-23, -13],
    [23, 13],
  ] as const) {
    const [dx, dy] = iso(x, y, 10.3);
    faces.push(
      face2(ellipse2(dx, dy, 2.2, 2.2, 16), { tone: "lo" }),
      stroke2(
        [
          [dx - 1.4, dy],
          [dx + 1.4, dy],
        ],
        "mid",
      ),
    );
  }

  return faces;
}

export const switchScene: PrototypeMeta = {
  slug: "switch",
  name: "Switch",
  component: "Switch",
  object: "Railway turnout lever",
  story:
    "The lever sweeps its notched quadrant and locks with a small settle at the next stop.",
  note:
    "A switch is a mechanical either/or: the state is thrown, not painted.",
  scene: figureScene({
    slug: "switch",
    name: "Switch",
    component: "Controls",
    object: "Railway turnout lever",
    description:
      "A railway turnout lever on its pedestal: a notched quadrant, a weighted arm and a ball handle.",
    aria:
      "An isometric railway turnout lever on a bolted pedestal, with a notched quarter-circle quadrant.",
    faces: switchFaces(),
    motions: [
      { group: "lever", kind: "sway", period: 2500, amount: 9, pivot: [0, 0, 20] },
      { group: "latch", kind: "bob", period: 2500, amount: 1.6, phase: 0.12 },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 5. Checkbox — ballot box                                                   */
/* -------------------------------------------------------------------------- */

function checkboxFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...prism(roundedRect(-42, -28, 84, 56, 4, 5), 0, 46, {
      lip: true,
      topTone: "edge",
      tone: "edge",
    }),
  );

  faces.push(
    ...prism(roundedRect(-44, -30, 88, 60, 4, 5), 46, 10, {
      lip: true,
      topTone: "mid",
      tone: "mid",
    }),
  );

  faces.push(
    face3(
      roundedRect(-18, -3, 36, 6, 3, 4).map(
        ([x, y]) => [x, y, 56.2] as Point3,
      ),
      { tone: "edge" },
    ),
    face3(
      roundedRect(-15, -1.4, 30, 2.8, 1.4, 3).map(
        ([x, y]) => [x, y, 56.3] as Point3,
      ),
      { tone: "lo" },
    ),
  );

  for (const x of [-31, 31]) {
    faces.push(
      tube(
        [
          [x, -30, 52],
          [x, -30, 56],
        ],
        2.4,
        { tone: "lo" },
      ),
    );
  }

  faces.push(
    panel(-22, 22, 28.2, 10, 28, { tone: "mid" }),
    panel(-18, 18, 28.3, 14, 24, { fill: false, tone: "lo" }),
    stroke3(
      [
        [-8, 28.4, 19],
        [-2, 28.4, 15],
        [9, 28.4, 24],
      ],
      "hi",
    ),
    stroke3(
      [
        [-14, 28.4, 11],
        [12, 28.4, 11],
      ],
      "lo",
    ),
  );

  for (const [x, z] of [
    [-36, 4],
    [36, 4],
    [-36, 42],
    [36, 42],
  ] as const) {
    const [dx, dy] = iso(x, 28.4, z);
    faces.push(face2(ellipse2(dx, dy, 1.6, 1.6, 14), { tone: "lo" }));
  }

  faces.push(
    face3(
      [
        [-10, 3, 52],
        [10, 3, 52],
        [10, 3, 88],
        [-10, 3, 88],
      ],
      { tone: "mid", group: "ballot" },
    ),
    face3(
      [
        [10, -3, 52],
        [-10, -3, 52],
        [-10, -3, 88],
        [10, -3, 88],
      ],
      { tone: "lo", group: "ballot" },
    ),
    face3(
      [
        [-10, 3, 88],
        [10, 3, 88],
        [10, -3, 88],
        [-10, -3, 88],
      ],
      { tone: "mid", group: "ballot" },
    ),
    stroke3(
      [
        [0, 3.2, 56],
        [0, 3.2, 84],
      ],
      "lo",
      { group: "ballot" },
    ),
    stroke3(
      [
        [-6, 3.2, 70],
        [6, 3.2, 80],
      ],
      "hi",
      { group: "ballot" },
    ),
    stroke3(
      [
        [6, 3.2, 70],
        [-6, 3.2, 80],
      ],
      "hi",
      { group: "ballot" },
    ),
    face3(
      [
        [-10, 3, 88],
        [-4, 3, 88],
        [-10, 3, 82],
      ],
      { fill: false, tone: "lo", group: "ballot" },
    ),
  );

  return faces;
}

export const checkbox: PrototypeMeta = {
  slug: "checkbox",
  name: "Checkbox",
  component: "Checkbox",
  object: "Ballot box",
  story:
    "A folded ballot slips through the slot and the lid clicks down one notch over it.",
  note:
    "Choosing is a deposit: a marked paper disappears into a box that keeps it.",
  scene: figureScene({
    slug: "checkbox",
    name: "Checkbox",
    component: "Controls",
    object: "Ballot box",
    description:
      "A ballot box with a hinged lid, a narrow slot, a marked paper and a front count plaque.",
    aria:
      "An isometric ballot box with a hinged lid, a top slot and a folded marked ballot going in.",
    faces: checkboxFaces(),
    motions: [
      { group: "ballot", kind: "bob", period: 2100, amount: 4, phase: 0.18 },
      { kind: "breathe", period: 5200, amount: 0.004 },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 6. Radio — pushpin in a corkboard                                          */
/* -------------------------------------------------------------------------- */

function radioFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...prism(roundedRect(-48, -34, 96, 68, 10, 7), 0, 10, {
      lip: true,
      topTone: "mid",
      tone: "edge",
    }),
  );

  faces.push(
    face3(
      roundedRect(-44, -30, 88, 60, 8, 6).map(
        ([x, y]) => [x, y, 10.15] as Point3,
      ),
      { fill: false, tone: "lo" },
    ),
  );

  const grains: Array<[number, number, number, number]> = [
    [-38, -24, 9, 3],
    [-28, -10, 8, -4],
    [-38, 6, 7, 2],
    [-24, 22, 10, 1],
    [-10, -26, 8, 2],
    [2, -14, 9, -3],
    [10, 26, 11, 1],
    [24, -26, 7, 3],
    [34, -12, 9, -2],
    [38, 8, 8, 3],
    [28, 24, 10, -1],
    [12, 8, 6, 3],
    [-4, 4, 8, -2],
    [-18, -2, 7, 3],
  ];
  for (const [x, y, len, tilt] of grains) {
    faces.push(
      stroke3(
        [
          [x, y, 10.22],
          [x + len, y + tilt, 10.22],
        ],
        "lo",
      ),
    );
  }

  for (const [x, y, r] of [
    [-26, -16, 3.2],
    [22, -20, 2.4],
    [-16, 20, 2.8],
    [34, 18, 2.2],
  ] as const) {
    faces.push(
      ellipse3(x, y, 10.24, r, r, { fill: false, tone: "lo" }),
      ellipse3(x, y, 10.25, r * 0.35, r * 0.35, { tone: "mid" }),
    );
  }

  faces.push(
    ellipse3(0, 2, 10.26, 7.4, 7.4, {
      fill: false,
      tone: "lo",
      group: "dent",
    }),
    ellipse3(0, 2, 10.27, 4, 4, {
      fill: false,
      tone: "mid",
      group: "dent",
    }),
  );

  faces.push(
    tube(
      [
        [0, 2, 8],
        [0, 2, 31],
      ],
      2.2,
      { tone: "mid", group: "pin" },
    ),
    ...cylinder(0, 2, 31, 4, 4.8, 3.4, {
      tone: "edge",
      topTone: "lo",
      group: "pin",
    }),
    ...sphereFaces(0, 2, 38, 9, { group: "pin" }),
    ellipse3(0, 2, 33.4, 8.6, 8.6, {
      fill: false,
      tone: "lo",
      group: "pin",
    }),
  );

  const [hx, hy] = iso(-3, -1, 41);
  faces.push(
    face2(ellipse2(hx, hy, 3.4, 2.2, 16), {
      fill: false,
      tone: "hi",
      group: "pin",
    }),
  );

  faces.push(
    stroke3(
      [
        [-4, 2, 8.4],
        [-4, 2, 12],
      ],
      "lo",
      { group: "pin" },
    ),
    stroke3(
      [
        [4, 2, 8.4],
        [4, 2, 12],
      ],
      "lo",
      { group: "pin" },
    ),
  );

  return faces;
}

export const radio: PrototypeMeta = {
  slug: "radio",
  name: "Radio",
  component: "Radio",
  object: "Pushpin in corkboard",
  story:
    "The pin presses into the cork and the surface gives way in a soft ring around the needle.",
  note:
    "A radio is one choice at one place: a single pin holds the spot, the other holes remain.",
  scene: figureScene({
    slug: "radio",
    name: "Radio",
    component: "Controls",
    object: "Pushpin in corkboard",
    description:
      "A corkboard with a single domed pushpin, old pinholes and a ring of compressed cork.",
    aria:
      "An isometric corkboard with a single domed pushpin pressed into it and a few old pinholes.",
    faces: radioFaces(),
    motions: [
      { group: "pin", kind: "bob", period: 1900, amount: 2.6 },
      { group: "dent", kind: "breathe", period: 2400, amount: 0.1 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 8. Theme Toggler — reversible lampshade                                    */
/* -------------------------------------------------------------------------- */

function themeTogglerFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 7, 24, 24, { tone: "mid", topTone: "lo" }),
    ...cylinder(0, 0, 7, 5, 14, 9, { tone: "edge", topTone: "mid" }),
    ellipse3(0, 0, 12.2, 9, 9, { fill: false, tone: "lo" }),
    tube(
      [
        [0, 0, 11],
        [0, 0, 40],
      ],
      3.4,
      { tone: "mid" },
    ),
  );

  faces.push(
    ...sphereFaces(-11, 0, 32, 6.2, { group: "warm", tone: "hi" }),
    ...sphereFaces(11, 0, 32, 6.2, { group: "cool" }),
  );

  faces.push(
    ...cylinder(0, 0, 38, 23, 30, 17, {
      tone: "edge",
      hollow: 3.2,
      topTone: "mid",
      group: "shade",
    }),
  );

  for (const a of [-0.58, 0.92]) {
    faces.push(
      stroke3(
        [
          [Math.cos(a) * 30, Math.sin(a) * 30, 38.1],
          [Math.cos(a) * 17, Math.sin(a) * 17, 60.8],
        ],
        "lo",
        { group: "shade" },
      ),
    );
  }

  faces.push(
    ellipse3(0, 0, 38.05, 30.2, 30.2, {
      fill: false,
      tone: "mid",
      group: "shade",
    }),
    ellipse3(0, 0, 61, 17.2, 17.2, {
      fill: false,
      tone: "lo",
      group: "shade",
    }),
  );

  faces.push(
    tube(
      [
        [19, 4, 39],
        [19, 4, 22],
      ],
      1.4,
      { tone: "lo", group: "chain" },
    ),
    ...sphereFaces(19, 4, 19, 2.4, { group: "chain" }),
  );

  const [kx, ky] = iso(15, 12, 7.3);
  faces.push(
    face2(ellipse2(kx, ky, 3.4, 3.4, 18), { tone: "mid" }),
    face2(
      [
        [kx - 2, ky],
        [kx + 2, ky - 1.2],
      ],
      { fill: false, tone: "lo" },
    ),
  );

  return faces;
}

export const themeToggler: PrototypeMeta = {
  slug: "theme-toggler",
  name: "Theme Toggler",
  component: "Theme Toggler",
  object: "Reversible lampshade",
  story:
    "The shade swings a half turn on its stem while the warm and cool bulbs trade their glow.",
  note:
    "A theme toggle turns the whole room: one gesture flips every surface at once.",
  scene: figureScene({
    slug: "theme-toggler",
    name: "Theme Toggler",
    component: "Controls",
    object: "Reversible lampshade",
    description:
      "A table lamp with a wide reversible shade, two bulbs beneath it and a pull chain.",
    aria:
      "An isometric table lamp with a wide shade, a warm and a cool bulb underneath and a pull chain.",
    faces: themeTogglerFaces(),
    motions: [
      { group: "shade", kind: "sway", period: 3400, amount: 4.2, pivot: [0, 0, 42] },
      { group: "warm", kind: "flicker", period: 2200, amount: 0.22 },
      {
        group: "cool",
        kind: "flicker",
        period: 2200,
        amount: 0.22,
        phase: 0.5,
      },
      { group: "chain", kind: "sway", period: 3000, amount: 3.4, pivot: [19, 4, 40] },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 9. Input — fountain pen on a ruled strip                                   */
/* -------------------------------------------------------------------------- */

function inputFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...prism(roundedRect(-62, -20, 124, 40, 2, 3), 0, 3, {
      lip: false,
      topTone: "mid",
      tone: "lo",
    }),
  );

  for (const y of [-13, -4, 5, 14]) {
    faces.push(
      stroke3(
        [
          [-57, y, 3.2],
          [57, y, 3.2],
        ],
        "lo",
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [-48, -17, 3.2],
        [-48, 17, 3.2],
      ],
      "lo",
    ),
    stroke3(
      [
        [-53, 17, 3.3],
        [-44, 17, 3.3],
      ],
      "mid",
    ),
  );

  faces.push(
    stroke3(
      [
        [-42, 8, 3.35],
        [-36, 8.6, 3.35],
        [-28, 7.6, 3.35],
        [-19, 8.2, 3.35],
        [-11, 7.8, 3.35],
      ],
      "mid",
      { group: "ink" },
    ),
    face2(
      ellipse2(iso(-43, 8, 3.4)[0], iso(-43, 8, 3.4)[1], 1.5, 1.5, 14),
      { tone: "edge", group: "ink" },
    ),
  );

  const pen = (opts: FaceOptions): FaceOptions => ({
    ...opts,
    group: "pen",
  });

  faces.push(
    tube(
      [
        [-24, 6, 11],
        [22, 6, 11],
      ],
      9,
      pen({ tone: "edge" }),
    ),
    tube(
      [
        [22, 6, 11],
        [38, 6, 11],
      ],
      10.5,
      pen({ tone: "mid" }),
    ),
    disc3(38.2, 6, 11, 4.6, "yz", pen({ tone: "mid" })),
    stroke3(
      [
        [24, 6, 16.2],
        [37, 6, 16.2],
      ],
      "lo",
      pen({}),
    ),
    stroke3(
      [
        [25, 6, 15.4],
        [31, 6, 19.4],
      ],
      "lo",
      pen({}),
    ),
  );

  for (const x of [-17.5, -14.5]) {
    faces.push(
      disc3(x, 6, 11, 4.9, "yz", pen({ fill: false, tone: "lo" })),
    );
  }

  faces.push(
    face3(
      [
        [-24, 3.6, 13.4],
        [-24, 8.4, 13.4],
        [-42, 8.4, 7.4],
        [-42, 3.6, 7.4],
      ],
      pen({ tone: "edge" }),
    ),
    stroke3(
      [
        [-27, 6, 12.1],
        [-39, 6, 8.5],
      ],
      "lo",
      pen({}),
    ),
    face2(
      ellipse2(iso(-31.5, 6, 10.2)[0], iso(-31.5, 6, 10.2)[1], 1.1, 1.1, 12),
      pen({ tone: "hi" }),
    ),
    tube(
      [
        [-43, 6, 7],
        [-43, 6, 4.2],
      ],
      1.8,
      pen({ tone: "mid" }),
    ),
  );

  return faces;
}

export const input: PrototypeMeta = {
  slug: "input",
  name: "Input",
  component: "Input",
  object: "Fountain pen on a ruled strip",
  story:
    "The nib traces a short rule and the ink line spreads along the paper behind it.",
  note:
    "An input is one careful line: the pen touches the rule exactly where the value goes.",
  scene: figureScene({
    slug: "input",
    name: "Input",
    component: "Inputs",
    object: "Fountain pen on a ruled strip",
    description:
      "A fountain pen lying on a ruled strip of paper, with a nib, a cap clip and a fresh ink line.",
    aria:
      "An isometric fountain pen resting on a ruled strip of paper with a fresh ink line.",
    faces: inputFaces(),
    motions: [
      { group: "pen", kind: "sway", period: 2900, amount: 1.6, pivot: [8, 6, 11] },
      { group: "ink", kind: "breathe", period: 3300, amount: 0.03, pivot: [-30, 8, 3.4] },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 10. Textarea — notepad with a curled corner                                */
/* -------------------------------------------------------------------------- */

function textareaFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...prism(roundedRect(-44, -58, 88, 112, 4, 5), 0, 12, {
      lip: true,
      topTone: "mid",
      tone: "edge",
    }),
  );

  for (const z of [4, 7, 10]) {
    faces.push(
      stroke3(
        [
          [44.05, -56, z],
          [44.05, 56, z],
        ],
        "lo",
      ),
      stroke3(
        [
          [-42, 58.05, z],
          [42, 58.05, z],
        ],
        "lo",
      ),
    );
  }

  for (const y of [-46, -34, -22, -10, 2, 14, 26, 38]) {
    faces.push(
      stroke3(
        [
          [-38, y, 12.2],
          [38, y, 12.2],
        ],
        y === -46 ? "mid" : "lo",
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [-38, -52, 12.2],
        [38, -52, 12.2],
      ],
      "mid",
    ),
    stroke3(
      [
        [-38, -49, 12.2],
        [38, -49, 12.2],
      ],
      "lo",
    ),
  );

  for (let x = -36; x <= 36; x += 9) {
    faces.push(
      ...ring(x, -58, 13.4, 4.2, 1.25, "xz", { tone: "mid" }),
    );
  }

  faces.push(
    stroke3(
      [
        [22, 58, 12.3],
        [44, 40, 12.3],
      ],
      "lo",
    ),
    face3(
      [
        [22, 58, 12.25],
        [44, 40, 12.25],
        [34, 49, 30],
      ],
      { tone: "edge", group: "curl" },
    ),
    stroke3(
      [
        [26, 54, 15],
        [34, 47, 24],
      ],
      "lo",
      { group: "curl" },
    ),
    face3(
      [
        [44, 40, 12.25],
        [37, 46, 12.25],
        [34, 49, 30],
      ],
      { fill: false, tone: "lo", group: "curl" },
    ),
  );

  faces.push(
    stroke3(
      [
        [-38, 50, 12.22],
        [12, 50, 12.22],
      ],
      "lo",
      { group: "nextline" },
    ),
  );

  const [bx, by] = iso(-36, -58, 13.5);
  faces.push(
    face2(ellipse2(bx, by, 2.2, 2.2, 16), { tone: "hi" }),
  );

  return faces;
}

export const textarea: PrototypeMeta = {
  slug: "textarea",
  name: "Textarea",
  component: "Textarea",
  object: "Notepad with a curled corner",
  story:
    "The curled corner lifts further and one more ruled line surfaces under the spiral.",
  note:
    "A textarea leaves room for the next line: the page is already turned at its corner.",
  scene: figureScene({
    slug: "textarea",
    name: "Textarea",
    component: "Inputs",
    object: "Notepad with a curled corner",
    description:
      "A spiral-bound notepad seen at an angle, with ruled lines, layered page edges and a lifted corner.",
    aria:
      "An isometric spiral-bound notepad with ruled lines, a stack of page edges and a curled front corner.",
    faces: textareaFaces(),
    motions: [
      { group: "curl", kind: "sway", period: 3000, amount: 5, pivot: [33, 49, 12] },
      { group: "nextline", kind: "breathe", period: 4000, amount: 0.02 },
      { kind: "sway", period: 6200, amount: 0.4 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 11. Input OTP — four-drum odometer                                         */
/* -------------------------------------------------------------------------- */

function inputOtpFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...box(-44, -18, 0, 88, 20, 66, {
      r: 3,
      tone: "edge",
      topTone: "mid",
    }),
  );

  faces.push(
    panel(-40, 40, 4, 24, 48, { tone: "edge" }),
    panel(-37, 37, 4.1, 27, 45, { fill: false, tone: "lo" }),
  );

  const drum = (x: number, group: string, pattern: readonly number[]): FigureFace[] => {
    const parts: FigureFace[] = [];
    parts.push(
      disc3(x, 6, 36, 14, "xz", { tone: "edge", group }),
      disc3(x, 6.2, 36, 11.4, "xz", { tone: "lo", group }),
      ...ring(x, 6.3, 36, 12.6, 0.8, "xz", { tone: "mid", group }),
    );
    const segments: Array<[Point3, Point3]> = [
      [
        [x - 4, 6.5, 41],
        [x + 4, 6.5, 41],
      ],
      [
        [x - 4, 6.5, 40.2],
        [x - 4, 6.5, 36.6],
      ],
      [
        [x + 4, 6.5, 40.2],
        [x + 4, 6.5, 36.6],
      ],
      [
        [x - 4, 6.5, 36],
        [x + 4, 6.5, 36],
      ],
      [
        [x - 4, 6.5, 35.4],
        [x - 4, 6.5, 31],
      ],
      [
        [x + 4, 6.5, 35.4],
        [x + 4, 6.5, 31],
      ],
      [
        [x - 4, 6.5, 31],
        [x + 4, 6.5, 31],
      ],
    ];
    for (const index of pattern) {
      const [a, b] = segments[index];
      parts.push(stroke3([a, b], "mid", { group }));
    }
    return parts;
  };

  const drums = [-30, -10, 10, 30];
  const patterns = [
    [0, 1, 2, 4, 5, 6],
    [0, 1, 3, 4, 5, 6],
    [0, 1, 2, 3, 4, 5, 6],
    [0, 2, 3, 5, 6],
  ];
  drums.forEach((x, index) => {
    const group = `digit-${index + 1}`;
    faces.push(...drum(x, group, patterns[index]));
    faces.push(
      stroke3(
        [
          [x - 2.4, 6.7, 52],
          [x, 6.7, 48.6],
          [x + 2.4, 6.7, 52],
        ],
        index === 0 ? "hi" : "mid",
      ),
    );
  });

  for (const [x, z] of [
    [-39, 58],
    [39, 58],
    [-39, 6],
    [39, 6],
  ] as const) {
    const [dx, dy] = iso(x, 6.8, z);
    faces.push(face2(ellipse2(dx, dy, 1.8, 1.8, 14), { tone: "lo" }));
  }

  faces.push(
    tube(
      [
        [44, 4, 36],
        [53, 4, 36],
      ],
      3,
      { tone: "mid" },
    ),
    disc3(53.4, 4, 36, 4.6, "yz", { tone: "edge" }),
    disc3(53.5, 4, 36, 2, "yz", { tone: "lo" }),
  );

  faces.push(
    panel(-30, 30, 6.9, 50, 56, { fill: false, tone: "lo" }),
    stroke3(
      [
        [-30, 7, 53],
        [-16, 7, 53],
      ],
      "lo",
    ),
    stroke3(
      [
        [16, 7, 53],
        [30, 7, 53],
      ],
      "lo",
    ),
  );

  return faces;
}

export const inputOtp: PrototypeMeta = {
  slug: "input-otp",
  name: "Input OTP",
  component: "Input OTP",
  object: "Four-drum odometer",
  story:
    "The four drums step through a digit in turn, then settle together under the index marks.",
  note:
    "A one-time code is read as a block: four positions, each locked on its own figure.",
  scene: figureScene({
    slug: "input-otp",
    name: "Input OTP",
    component: "Inputs",
    object: "Four-drum odometer",
    description:
      "A four-drum mechanical counter in its housing, each drum showing a digit under a fixed index mark.",
    aria:
      "An isometric four-drum odometer in a metal housing, with four numbered wheels and index marks.",
    faces: inputOtpFaces(),
    motions: [
      { group: "digit-1", kind: "bob", period: 1700, amount: 3.4, phase: 0 },
      { group: "digit-2", kind: "bob", period: 1700, amount: 3.4, phase: 0.14 },
      { group: "digit-3", kind: "bob", period: 1700, amount: 3.4, phase: 0.28 },
      { group: "digit-4", kind: "bob", period: 1700, amount: 3.4, phase: 0.42 },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 12. Select — card-catalogue drawer                                         */
/* -------------------------------------------------------------------------- */

function selectFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...prism(roundedRect(-46, -38, 92, 76, 4, 5), 0, 64, {
      lip: true,
      topTone: "mid",
      tone: "edge",
    }),
  );

  const front = 38.15;
  const label = (x: number, z: number, w: number, h: number) => {
    faces.push(
      panel(x - w / 2, x + w / 2, front + 0.1, z - h / 2, z + h / 2, {
        tone: "lo",
      }),
      stroke3(
        [
          [x - w / 2 + 2, front + 0.2, z - 1],
          [x + w / 2 - 2, front + 0.2, z - 1],
        ],
        "lo",
      ),
    );
  };

  const closed = [
    [0, 7, 36, 14],
    [0, 25, 36, 14],
    [0, 43, 36, 14],
    [-22, 7, 36, 14],
    [-22, 25, 36, 14],
    [-22, 43, 36, 14],
    [22, 25, 36, 14],
    [22, 43, 36, 14],
  ] as const;
  for (const [x, z, w, h] of closed) {
    faces.push(
      panel(x - w / 2, x + w / 2, front, z - h / 2, z + h / 2, {
        tone: "mid",
      }),
    );
    label(x, z, 14, 6);
    const [kx, ky] = iso(x, front + 0.3, z);
    faces.push(
      face2(ellipse2(kx, ky, 2.2, 2.2, 16), { tone: "lo" }),
      face2(ellipse2(kx, ky, 1, 1, 12), { tone: "mid" }),
    );
  }

  faces.push(
    panel(-42, -2, front + 0.05, 3, 17, { tone: "edge" }),
    panel(-40, -4, front + 0.1, 5, 15, { fill: false, tone: "lo" }),
  );

  faces.push(
    ...box(-42, 36, 3, 40, 32, 15, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "drawer",
    }),
    panel(-42, -2, 68.15, 3, 18, { tone: "mid", group: "drawer" }),
    panel(-37, -7, 68.25, 9, 14, { fill: false, tone: "lo", group: "drawer" }),
    stroke3(
      [
        [-34, 68.3, 12],
        [-24, 68.3, 12],
      ],
      "lo",
      { group: "drawer" },
    ),
  );

  const [dx, dy] = iso(-22, 68.4, 9);
  faces.push(
    face2(ellipse2(dx, dy, 2.6, 2.6, 16), {
      tone: "mid",
      group: "drawer",
    }),
  );

  const cardBase = 21;
  const cardTop = 49;
  faces.push(
    panel(-34, -10, 52, cardBase, cardTop, { tone: "edge", group: "card" }),
    panel(-32.5, -11.5, 52.1, cardBase + 2, cardTop - 2, {
      fill: false,
      tone: "lo",
      group: "card",
    }),
    ...forLines(-31, -14, 52.2, [26, 32, 38, 44], "card"),
    face3(
      [
        [-34, 52, cardTop],
        [-26, 52, cardTop],
        [-34, 52, cardTop - 4],
      ],
      { tone: "hi", group: "card" },
    ),
  );

  faces.push(
    face3(
      roundedRect(-34, 48, 24, 8, 1.5, 3).map(
        ([x, y]) => [x, y, cardBase + 1.3] as Point3,
      ),
      { tone: "edge", group: "card" },
    ),
  );

  for (const y of [-30, -18, -6, 6, 18, 30]) {
    faces.push(
      stroke3(
        [
          [46.05, y, 2],
          [46.05, y, 62],
        ],
        "lo",
      ),
    );
  }

  return faces;
}

/** Ruled lines on a vertical panel at y = const. */
function forLines(
  x0: number,
  x1: number,
  y: number,
  zs: readonly number[],
  group: string,
): FigureFace[] {
  return zs.map((z) =>
    stroke3(
      [
        [x0, y, z],
        [x1, y, z],
      ],
      "lo",
      { group },
    ),
  );
}

export const select: PrototypeMeta = {
  slug: "select",
  name: "Select",
  component: "Select",
  object: "Card-catalogue drawer",
  story:
    "The drawer slides out of the bank and the chosen card lifts above the others.",
  note:
    "A select is one record pulled from an ordered set: the drawer stays, the card comes up.",
  scene: figureScene({
    slug: "select",
    name: "Select",
    component: "Inputs",
    object: "Card-catalogue drawer",
    description:
      "A card-catalogue cabinet with labelled drawers, one drawer pulled out and a ruled card rising from it.",
    aria:
      "An isometric card-catalogue cabinet with labelled drawers, one open drawer and a lifted index card.",
    faces: selectFaces(),
    motions: [
      { group: "card", kind: "lift", period: 2600, amount: 6 },
      { group: "drawer", kind: "sway", period: 3200, amount: 1, pivot: [-22, 52, 12] },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 13. Combobox — vending machine                                             */
/* -------------------------------------------------------------------------- */

function comboboxFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...prism(roundedRect(-40, -30, 80, 60, 6, 5), 0, 112, {
      lip: true,
      topTone: "mid",
      tone: "edge",
    }),
    ...prism(roundedRect(-42, -32, 84, 64, 6, 4), 112, 10, {
      lip: true,
      topTone: "lo",
      tone: "edge",
    }),
  );

  faces.push(
    panel(-33, 25, 30.15, 32, 102, { tone: "mid" }),
    panel(-31, 23, 30.2, 34, 100, { fill: false, tone: "lo" }),
  );

  const shelves = [48, 70, 92];
  shelves.forEach((z, row) => {
    faces.push(
      ...box(-30, 24, z, 52, 5, 2.5, { r: 1, tone: "lo" }),
    );
    const coil: Point3[] = [];
    for (let index = 0; index <= 46; index += 1) {
      const t = index / 46;
      const x = -27 + t * 46;
      const a = t * Math.PI * 8;
      coil.push([x, 28 + Math.cos(a) * 3.6, z + 4.2 + Math.sin(a) * 3.6]);
    }
    faces.push(
      tube(coil, 1.5, {
        tone: "mid",
        group: `spiral-${row + 1}`,
      }),
    );
    for (const x of [-18, 2, 20]) {
      faces.push(
        ...box(x, 26, z + 4, 8, 4, 9, {
          r: 1.5,
          tone: "lo",
          group: "goods",
        }),
      );
    }
  });

  faces.push(
    ...box(2, 34, 40, 11, 7, 14, {
      r: 1.5,
      tone: "hi",
      group: "packet",
    }),
    stroke3(
      [
        [2, 41.2, 46],
        [13, 41.2, 46],
      ],
      "lo",
      { group: "packet" },
    ),
    stroke3(
      [
        [4, 41.2, 50],
        [11, 41.2, 50],
      ],
      "lo",
      { group: "packet" },
    ),
  );

  faces.push(
    panel(-30, 22, 30.2, 10, 26, { tone: "mid" }),
    panel(-27, 19, 30.3, 12, 23, { fill: false, tone: "lo" }),
    ...box(-32, 26, 7, 60, 12, 4, { r: 2, tone: "edge" }),
    stroke3(
      [
        [-24, 38.2, 17],
        [16, 38.2, 17],
      ],
      "lo",
    ),
  );

  faces.push(
    panel(27, 39, 30.2, 56, 100, { tone: "mid", group: "panel" }),
    panel(29, 37, 30.3, 90, 97, { fill: false, tone: "lo" }),
    stroke3(
      [
        [33, 30.4, 96],
        [33, 30.4, 90],
      ],
      "lo",
    ),
  );

  for (const x of [30, 33, 36]) {
    for (const z of [72, 67, 62]) {
      const [px, py] = iso(x, 30.5, z);
      faces.push(
        face2(ellipse2(px, py, 1.4, 1.4, 12), { tone: "mid" }),
      );
    }
  }

  faces.push(
    panel(29, 37, 30.3, 54, 59, { fill: false, tone: "lo" }),
    stroke3(
      [
        [30, 30.6, 56.5],
        [36, 30.6, 56.5],
      ],
      "hi",
    ),
  );

  for (const x of [-30, -10, 10, 30]) {
    faces.push(
      stroke3(
        [
          [x, 32.05, 106],
          [x, 32.05, 119],
        ],
        "lo",
      ),
    );
  }

  faces.push(
    ...box(-38, 26, 0, 8, 8, 4, { r: 1.5, tone: "lo" }),
    ...box(30, 26, 0, 8, 8, 4, { r: 1.5, tone: "lo" }),
  );

  return faces;
}

export const combobox: PrototypeMeta = {
  slug: "combobox",
  name: "Combobox",
  component: "Combobox",
  object: "Vending machine",
  story:
    "A spiral turns, a packet tips over and drops into the tray while the glass stays lit.",
  note:
    "A combobox is a small machine: you narrow the racks, then choose one item.",
  scene: figureScene({
    slug: "combobox",
    name: "Combobox",
    component: "Inputs",
    object: "Vending machine",
    description:
      "A vending machine with a glass window, three coil shelves, a keypad and a packet falling to the tray.",
    aria:
      "An isometric vending machine with a lit glass front, three spiral shelves and a packet dropping to the tray.",
    faces: comboboxFaces(),
    motions: [
      { group: "spiral-1", kind: "spin", period: 2400, amount: 360 },
      { group: "spiral-2", kind: "spin", period: 2400, amount: 360, phase: 0.2 },
      { group: "spiral-3", kind: "spin", period: 2400, amount: 360, phase: 0.4 },
      { group: "packet", kind: "bob", period: 1900, amount: 5.4 },
      { group: "goods", kind: "sway", period: 3400, amount: 0.8 },
    ],
    press: 1.2,
  }),
};

/* -------------------------------------------------------------------------- */
/* 14. Date Picker — advent calendar                                          */
/* -------------------------------------------------------------------------- */

function datePickerFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  const front = 6;
  const back = -6;
  const outline2: Point2[] = [
    iso(-40, front, 0),
    iso(40, front, 0),
    iso(40, front, 78),
    iso(0, front, 106),
    iso(-40, front, 78),
  ];

  faces.push(
    face3(
      [
        [-40, back, 0],
        [40, back, 0],
        [40, back, 78],
        [0, back, 106],
        [-40, back, 78],
      ],
      { tone: "lo" },
    ),
    face3(
      [
        [-40, back, 0],
        [-40, front, 0],
        [-40, front, 78],
        [-40, back, 78],
      ],
      { tone: "edge" },
    ),
    face3(
      [
        [40, front, 0],
        [40, back, 0],
        [40, back, 78],
        [40, front, 78],
      ],
      { tone: "lo" },
    ),
    face3(
      [
        [-40, front, 0],
        [40, front, 0],
        [40, back, 0],
        [-40, back, 0],
      ],
      { tone: "lo" },
    ),
    face3(
      [
        [-40, front, 78],
        [0, front, 106],
        [0, back, 106],
        [-40, back, 78],
      ],
      { tone: "mid" },
    ),
    face3(
      [
        [0, front, 106],
        [40, front, 78],
        [40, back, 78],
        [0, back, 106],
      ],
      { tone: "lo" },
    ),
  );

  for (const x of [-16, 16]) {
    faces.push(
      tube(
        [
          [x, back, 64],
          [x, -32, 0],
        ],
        1.8,
        { tone: "lo" },
      ),
    );
  }
  faces.push(
    tube(
      [
        [-16, -26, 16],
        [16, -26, 16],
      ],
      1.6,
      { tone: "lo" },
    ),
  );

  faces.push(
    ...ring(0, 0, 112, 5.4, 1.5, "xz", { tone: "mid" }),
    face2(outline2, { tone: "mid" }),
  );

  faces.push(
    face2(outline2, { fill: false, tone: "edge" }),
  );

  faces.push(
    stroke3(
      [
        [-34, front + 0.1, 6],
        [34, front + 0.1, 6],
      ],
      "lo",
    ),
    stroke3(
      [
        [-34, front + 0.1, 74],
        [34, front + 0.1, 74],
      ],
      "lo",
    ),
  );

  const doors: Array<[number, number]> = [];
  for (const z of [16, 36, 56, 70]) {
    for (const x of [-26, 0, 26]) {
      doors.push([x, z]);
    }
  }

  for (const [x, z] of doors) {
    if (x === 0 && z === 56) continue;
    faces.push(
      panel(x - 8, x + 8, front + 0.15, z - 7, z + 7, { tone: "lo" }),
      panel(x - 6.6, x + 6.6, front + 0.2, z - 5.6, z + 5.6, {
        fill: false,
        tone: "lo",
      }),
      stroke3(
        [
          [x - 3, front + 0.25, z + 2.4],
          [x + 1, front + 0.25, z + 2.4],
        ],
        "lo",
      ),
      stroke3(
        [
          [x + 2, front + 0.25, z - 2.4],
          [x + 2, front + 0.25, z + 0.4],
        ],
        "lo",
      ),
      face2(
        ellipse2(iso(x, front + 0.3, z - 4.4)[0], iso(x, front + 0.3, z - 4.4)[1], 0.9, 0.9, 10),
        { tone: "mid" },
      ),
    );
  }

  faces.push(
    panel(-8, 8, front + 0.12, 49, 63, { tone: "edge" }),
    panel(-6.4, 6.4, front + 0.2, 50.6, 61.4, { fill: false, tone: "lo" }),
    face2(
      star2(iso(0, front + 0.35, 56)[0], iso(0, front + 0.35, 56)[1], 4.6, 2.1),
      { tone: "hi", group: "prize" },
    ),
    face3(
      [
        [-8, front + 0.3, 49],
        [-8, front + 0.3, 63],
        [-22, 24, 60],
        [-22, 24, 52],
      ],
      { tone: "mid", group: "door" },
    ),
    stroke3(
      [
        [-8, front + 0.4, 52],
        [-21, 23, 54],
      ],
      "lo",
      { group: "door" },
    ),
    stroke3(
      [
        [14, front + 0.4, 54],
        [22, 16, 53],
      ],
      "lo",
      { group: "door" },
    ),
  );

  faces.push(
    face2(
      star2(iso(0, front + 0.3, 98)[0], iso(0, front + 0.3, 98)[1], 4, 1.8),
      { tone: "hi", group: "finial" },
    ),
    face2(
      star2(iso(0, front + 0.3, 98)[0], iso(0, front + 0.3, 98)[1], 7, 3.1),
      { fill: false, tone: "lo", group: "finial" },
    ),
  );

  return faces;
}

export const datePicker: PrototypeMeta = {
  slug: "date-picker",
  name: "Date Picker",
  component: "Date Picker",
  object: "Advent calendar",
  story:
    "The chosen door swings open on its hinge and a small number catches the light inside.",
  note:
    "A date picker is a grid of closed days, and choosing one is opening a door.",
  scene: figureScene({
    slug: "date-picker",
    name: "Date Picker",
    component: "Inputs",
    object: "Advent calendar",
    description:
      "A house-shaped advent calendar on an easel, with a grid of numbered doors and one open onto a star.",
    aria:
      "An isometric house-shaped advent calendar standing on an easel, with a grid of small doors and one open.",
    faces: datePickerFaces(),
    motions: [
      { group: "door", kind: "sway", period: 3000, amount: 8, pivot: [-8, 6, 56] },
      { group: "prize", kind: "flicker", period: 2100, amount: 0.18 },
      { group: "finial", kind: "breathe", period: 3800, amount: 0.06 },
      { kind: "sway", period: 5200, amount: 0.4 },
    ],
    press: 1.2,
  }),
};

/* -------------------------------------------------------------------------- */
/* 16. Command — jukebox                                                      */
/* -------------------------------------------------------------------------- */

function jukeboxFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...prism(roundedRect(-40, -28, 80, 56, 6, 6), 0, 76, {
      lip: true,
      topTone: "mid",
      tone: "edge",
    }),
    ...prism(roundedRect(-41, -29, 82, 58, 6, 4), 76, 5, {
      lip: true,
      topTone: "lo",
      tone: "mid",
    }),
  );

  faces.push(
    disc3(0, 28.2, 32, 20, "xz", { tone: "edge" }),
    disc3(0, 28.3, 32, 15.5, "xz", { fill: false, tone: "lo" }),
    disc3(0, 28.3, 32, 11, "xz", { fill: false, tone: "lo" }),
    disc3(0, 28.3, 32, 6, "xz", { fill: false, tone: "mid" }),
    disc3(0, 28.4, 32, 2.8, "xz", { tone: "mid" }),
  );
  for (let index = 0; index < 6; index += 1) {
    const a = (index / 6) * Math.PI * 2 + 0.25;
    faces.push(
      stroke3(
        [
          [Math.cos(a) * 6.4, 28.4, 32 + Math.sin(a) * 6.4],
          [Math.cos(a) * 19.4, 28.4, 32 + Math.sin(a) * 19.4],
        ],
        "lo",
      ),
    );
  }

  faces.push(
    panel(-34, 22, 28.2, 56, 70, { tone: "mid" }),
    panel(-32, 20, 28.3, 58, 68, { fill: false, tone: "lo" }),
  );
  for (const z of [60.5, 66]) {
    for (const x of [-27, -17, -7]) {
      const [px, py] = iso(x, 28.5, z);
      faces.push(
        face2(ellipse2(px, py, 2.7, 2.7, 16), { tone: "mid" }),
        face2(ellipse2(px, py, 1.1, 1.1, 12), { tone: "lo" }),
      );
    }
  }

  faces.push(
    panel(25, 33, 28.2, 55, 69, { tone: "lo" }),
    stroke3(
      [
        [29, 28.4, 58],
        [29, 28.4, 67],
      ],
      "mid",
    ),
    stroke3(
      [
        [26.5, 28.4, 62],
        [31.5, 28.4, 62],
      ],
      "lo",
    ),
  );

  for (const x of [-34, 34]) {
    faces.push(
      tube(
        [
          [x, 28.4, 6],
          [x, 28.4, 72],
        ],
        2.6,
        { tone: "lo" },
      ),
    );
  }

  const archAt = (y: number, rx: number, z0: number, zBase: number): Point3[] => {
    const points: Point3[] = [[-rx, y, zBase]];
    for (let index = 0; index <= 20; index += 1) {
      const a = Math.PI - (index / 20) * Math.PI;
      points.push([Math.cos(a) * rx, y, z0 + Math.sin(a) * rx]);
    }
    points.push([rx, y, zBase]);
    return points;
  };

  faces.push(
    face3(archAt(20, 40, 80, 78), { tone: "lo" }),
    face3(archAt(28, 40, 80, 78), { tone: "edge" }),
    face3(archAt(28.1, 32, 80, 78), { tone: "mid" }),
    face3(archAt(28.2, 27, 80, 78), {
      fill: false,
      tone: "lo",
    }),
  );

  const record = 21;
  faces.push(
    disc3(0, 28.3, 90, record, "xz", { tone: "lo", group: "record" }),
    disc3(0, 28.4, 90, 17, "xz", {
      fill: false,
      tone: "lo",
      group: "record",
    }),
    disc3(0, 28.4, 90, 13, "xz", {
      fill: false,
      tone: "lo",
      group: "record",
    }),
    disc3(0, 28.4, 90, 6.4, "xz", { tone: "mid", group: "record" }),
    disc3(0, 28.5, 90, 1.8, "xz", { tone: "edge", group: "record" }),
  );

  faces.push(
    tube(
      [
        [31, 28.5, 111],
        [25, 28.5, 105],
        [14, 28.5, 96],
        [6, 28.5, 92],
      ],
      2.1,
      { tone: "mid", group: "arm" },
    ),
    ...box(2, 27.6, 89, 6, 3, 5, { r: 1, tone: "edge", group: "arm" }),
  );

  const archPath: Point3[] = [[-40, 28.6, 78], [-40, 28.6, 80]];
  for (let index = 0; index <= 20; index += 1) {
    const a = Math.PI - (index / 20) * Math.PI;
    archPath.push([Math.cos(a) * 40, 28.6, 80 + Math.sin(a) * 40]);
  }
  archPath.push([40, 28.6, 80], [40, 28.6, 78]);
  faces.push(tube(archPath, 2.4, { tone: "mid" }));

  faces.push(
    face2(
      star2(iso(0, 28.7, 123)[0], iso(0, 28.7, 123)[1], 6.2, 2.8, 8),
      { tone: "hi", group: "ornament" },
    ),
    face2(
      star2(iso(0, 28.7, 123)[0], iso(0, 28.7, 123)[1], 10, 4.6, 8),
      { fill: false, tone: "lo", group: "ornament" },
    ),
  );

  for (const x of [-34, 34]) {
    faces.push(...box(x - 4, 24, 0, 8, 8, 4, { r: 1.5, tone: "lo" }));
  }

  return faces;
}

export const command: PrototypeMeta = {
  slug: "command",
  name: "Command",
  component: "Command",
  object: "Jukebox",
  story:
    "The arm swings onto the disc, the record turns and the chrome arch catches the light.",
  note:
    "A command palette is a jukebox: browse the index, highlight one line, launch it.",
  scene: figureScene({
    slug: "command",
    name: "Command",
    component: "Inputs",
    object: "Jukebox",
    description:
      "A dome-topped jukebox with a lit arch, a record, a tonearm, a selection panel and a speaker grille.",
    aria:
      "An isometric jukebox with a chrome arch, a spinning record, a tonearm and chromium selection buttons.",
    faces: jukeboxFaces(),
    motions: [
      { group: "record", kind: "spin", period: 2600, amount: 360 },
      { group: "arm", kind: "sway", period: 3000, amount: 3.2, pivot: [29, 28, 105] },
      { group: "ornament", kind: "flicker", period: 1900, amount: 0.18 },
    ],
    press: 1.2,
  }),
};

/* -------------------------------------------------------------------------- */
/* 17. Dialog — stage with curtains                                           */
/* -------------------------------------------------------------------------- */

function dialogFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...prism(roundedRect(-48, -34, 96, 68, 4, 5), 0, 8, {
      lip: true,
      topTone: "lo",
      tone: "mid",
    }),
  );

  faces.push(
    ...box(-46, -30, 8, 92, 8, 70, {
      r: 2,
      tone: "edge",
      topTone: "lo",
    }),
  );

  const glow: Point3[] = [[-30, -21.8, 14]];
  for (let index = 0; index <= 20; index += 1) {
    const a = Math.PI - (index / 20) * Math.PI;
    glow.push([Math.cos(a) * 30, -21.8, 54 + Math.sin(a) * 30]);
  }
  glow.push([30, -21.8, 14]);
  faces.push(face3(glow, { tone: "mid", group: "glow" }));

  for (const angle of [-0.75, -0.38, 0, 0.38, 0.75]) {
    faces.push(
      stroke3(
        [
          [0, -21.7, 46],
          [Math.cos(angle) * 28, -21.7, 54 + Math.sin(angle) * 28],
        ],
        "lo",
        { group: "glow" },
      ),
    );
  }

  const curtain = (
    side: -1 | 1,
    group: string,
  ): FigureFace[] => {
    const x = side;
    const pts: Point3[] = [
      [x * 46, 30, 8],
      [x * 13, 30, 8],
      [x * 16, 30, 28],
      [x * 11, 30, 48],
      [x * 17, 30, 68],
      [x * 14, 30, 80],
      [x * 46, 30, 80],
    ];
    const parts: FigureFace[] = [
      face3(pts, { tone: "edge", group }),
    ];
    for (const offset of [-24, -8, 8, 24]) {
      parts.push(
        stroke3(
          [
            [x * (24 + offset), 30.1, 10],
            [x * (23 + offset), 30.1, 46],
            [x * (25 + offset), 30.1, 78],
          ],
          "lo",
          { group },
        ),
      );
    }
    for (let index = 0; index < 7; index += 1) {
      parts.push(
        stroke3(
          [
            [x * (15 + index * 4), 30.15, 8],
            [x * (15 + index * 4), 30.15, 12],
          ],
          "mid",
          { group },
        ),
      );
    }
    return parts;
  };

  faces.push(...curtain(-1, "curtain-l"), ...curtain(1, "curtain-r"));

  for (const side of [-1, 1] as const) {
    faces.push(
      ...box(side * 48 - 4, 22, 8, 8, 12, 74, {
        r: 2,
        tone: "edge",
        topTone: "lo",
      }),
    );
    faces.push(
      stroke3(
        [
          [side * 44, 34.1, 12],
          [side * 44, 34.1, 78],
        ],
        "lo",
      ),
    );
  }

  faces.push(
    ...box(-48, 22, 80, 96, 12, 9, {
      r: 2,
      tone: "mid",
      topTone: "lo",
    }),
  );
  for (let index = 0; index < 6; index += 1) {
    const x0 = -42 + index * 14;
    faces.push(
      stroke3(
        [
          [x0, 34.1, 80],
          [x0 + 7, 34.1, 74],
          [x0 + 14, 34.1, 80],
        ],
        "lo",
      ),
    );
  }

  for (const x of [-26, 0, 26]) {
    faces.push(
      ...cylinder(x, 32, 8, 6, 4.6, 4.2, {
        tone: "edge",
        topTone: "mid",
        group: "footlights",
      }),
    );
    const [gx, gy] = iso(x, 32, 14.5);
    faces.push(
      face2(ellipse2(gx, gy, 2.4, 1.4, 14), {
        tone: "hi",
        group: "footlights",
      }),
    );
    faces.push(
      stroke3(
        [
          [x, 32, 16],
          [x - 4, 32, 40],
        ],
        "lo",
        { group: "footlights" },
      ),
      stroke3(
        [
          [x, 32, 16],
          [x + 4, 32, 40],
        ],
        "lo",
        { group: "footlights" },
      ),
    );
  }

  for (const x of [-48, 48]) {
    faces.push(
      stroke3(
        [
          [x, 22, 10],
          [x, 34, 10],
        ],
        "lo",
      ),
    );
  }

  return faces;
}

export const dialog: PrototypeMeta = {
  slug: "dialog",
  name: "Dialog",
  component: "Dialog",
  object: "Stage with curtains",
  story:
    "The curtains draw apart, the stage warms at the back and the footlights rise.",
  note:
    "A dialog takes the whole attention: the room stays, but the curtains open on one scene.",
  scene: figureScene({
    slug: "dialog",
    name: "Dialog",
    component: "Overlays",
    object: "Stage with curtains",
    description:
      "A small proscenium stage with parted curtains, a warm back wall, a valance and three footlights.",
    aria:
      "An isometric small theatre stage with parted curtains, a lit back wall and three footlights.",
    faces: dialogFaces(),
    motions: [
      { group: "curtain-l", kind: "sway", period: 3200, amount: 2.4, pivot: [-29, 30, 80] },
      { group: "curtain-r", kind: "sway", period: 3200, amount: 2.4, pivot: [29, 30, 80] },
      { group: "footlights", kind: "flicker", period: 1700, amount: 0.2 },
      { group: "glow", kind: "breathe", period: 3600, amount: 0.04 },
    ],
    press: 1.2,
  }),
};

/* -------------------------------------------------------------------------- */
/* 18. Drawer — roll-top desk                                                 */
/* -------------------------------------------------------------------------- */

function drawerFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  for (const x of [-42, -26, 18, 34]) {
    for (const y of [-22, 18]) {
      faces.push(
        ...box(x, y, 0, 8, 8, 6, { r: 1.5, tone: "mid" }),
      );
    }
  }

  faces.push(
    ...box(-44, -28, 6, 30, 56, 48, { r: 2, tone: "edge", topTone: "lo" }),
    ...box(14, -28, 6, 30, 56, 48, { r: 2, tone: "edge", topTone: "lo" }),
    ...box(-48, -32, 54, 96, 64, 6, { r: 3, tone: "edge", topTone: "mid" }),
    panel(-46, 46, -30, 60, 108, { tone: "lo" }),
  );

  faces.push(
    face3(
      roundedRect(-38, -24, 76, 48, 4, 4).map(
        ([x, y]) => [x, y, 60.15] as Point3,
      ),
      { tone: "lo" },
    ),
  );

  const cheek = (x: number): FigureFace => {
    const points: Point3[] = [
      [x, -30, 60],
      [x, 12, 60],
      [x, 12, 78],
    ];
    for (let index = 8; index >= 0; index -= 1) {
      const t = index / 8;
      points.push([x, -26 + t * 34, 108 - 30 * Math.pow(t, 1.4)]);
    }
    points.push([x, -30, 108]);
    return face3(points, { tone: "lo" });
  };
  faces.push(cheek(-47), cheek(47));

  for (const [x, z, w] of [
    [-29, 19, 22],
    [-29, 37, 22],
    [29, 19, 22],
    [29, 37, 22],
  ] as const) {
    faces.push(
      panel(x - w / 2, x + w / 2, 28.15, z - 6, z + 6, { tone: "mid" }),
      panel(x - w / 2 + 2, x + w / 2 - 2, 28.25, z - 4.4, z + 4.4, {
        fill: false,
        tone: "lo",
      }),
    );
    const [hx, hy] = iso(x, 28.4, z);
    faces.push(
      face2(ellipse2(hx, hy, 2.6, 2.6, 16), { tone: "mid" }),
      face2(ellipse2(hx, hy, 1.2, 1.2, 12), { tone: "lo" }),
    );
  }

  faces.push(
    ...box(-12, -24, 44, 24, 52, 10, { r: 2, tone: "mid", topTone: "lo" }),
    panel(-10, 10, 28.15, 46, 52, { tone: "mid" }),
    stroke3(
      [
        [-5, 28.3, 49],
        [5, 28.3, 49],
      ],
      "lo",
    ),
  );

  faces.push(
    ...cylinder(-24, -6, 60.4, 3, 7.5, 7.5, {
      tone: "mid",
      topTone: "lo",
      group: "lamp",
    }),
    tube(
      [
        [-24, -6, 63],
        [-24, -6, 78],
      ],
      2.8,
      { tone: "edge", group: "lamp" },
    ),
    ...cylinder(-24, -6, 78, 10, 10, 6.5, {
      tone: "edge",
      hollow: 2,
      topTone: "mid",
      group: "lamp",
    }),
    ellipse3(-24, -6, 88.2, 6.5, 6.5, {
      fill: false,
      tone: "hi",
      group: "lamp",
    }),
  );

  faces.push(
    ellipse3(-24, -6, 60.3, 18, 13, {
      fill: false,
      tone: "lo",
      group: "glow",
    }),
  );

  faces.push(
    ...box(-4, -18, 60.3, 30, 22, 1.2, {
      r: 1.5,
      tone: "lo",
      topTone: "lo",
    }),
  );
  for (const y of [-13, -7, -1, 5]) {
    faces.push(
      stroke3(
        [
          [-1, y, 61.7],
          [22, y, 61.7],
        ],
        "lo",
      ),
    );
  }

  faces.push(
    tube(
      [
        [14, -12, 62],
        [28, -4, 62],
      ],
      2,
      { tone: "mid" },
    ),
    disc3(28.4, -4, 62, 2.4, "yz", { tone: "mid" }),
  );

  for (let index = 0; index < 8; index += 1) {
    const t = index / 7;
    const y = -26 + t * 34;
    const z = 108 - 30 * Math.pow(t, 1.4);
    faces.push(
      ...box(-45, y - 1.3, z - 2.2, 90, 2.6, 4.4, {
        r: 1,
        tone: index % 2 === 0 ? "edge" : "mid",
        group: "top",
      }),
    );
  }

  for (const side of [-1, 1] as const) {
    const rail: Point3[] = [];
    for (let index = 0; index <= 14; index += 1) {
      const t = index / 14;
      rail.push([side * 46, -26 + t * 34, 108 - 30 * Math.pow(t, 1.4)]);
    }
    faces.push(tube(rail, 2.2, { tone: "lo", group: "top" }));
  }

  faces.push(
    stroke3(
      [
        [-46, 28.3, 8],
        [46, 28.3, 8],
      ],
      "lo",
    ),
  );

  return faces;
}

export const drawer: PrototypeMeta = {
  slug: "drawer",
  name: "Drawer",
  component: "Drawer",
  object: "Roll-top desk",
  story:
    "The tambour rolls up slat by slat, the desk lamp warms and the writing surface appears.",
  note:
    "A drawer hides its work behind a moving surface: the desk rolls open and closes the same way.",
  scene: figureScene({
    slug: "drawer",
    name: "Drawer",
    component: "Overlays",
    object: "Roll-top desk",
    description:
      "A roll-top desk with a curved slatted tambour, a lit desk lamp, a sheet of paper and drawers.",
    aria:
      "An isometric roll-top desk with a curved slatted tambour half rolled up, a lamp and a sheet of paper.",
    faces: drawerFaces(),
    motions: [
      { group: "top", kind: "lift", period: 3200, amount: 3.2 },
      { group: "lamp", kind: "flicker", period: 2000, amount: 0.16 },
      { group: "glow", kind: "breathe", period: 3400, amount: 0.05 },
    ],
    press: 1.2,
  }),
};

/* -------------------------------------------------------------------------- */
/* 19. Sheet — roller blind                                                   */
/* -------------------------------------------------------------------------- */

function sheetFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  for (const side of [-1, 1] as const) {
    faces.push(
      ...box(side * 50 - 3, -3, 0, 6, 6, 102, {
        r: 1.5,
        tone: "edge",
        topTone: "lo",
      }),
      ...box(side * 50 - 6, -7, 0, 12, 14, 4, {
        r: 2,
        tone: "mid",
        topTone: "lo",
      }),
      disc3(side * 50, 0, 102, 6, "yz", { tone: "mid" }),
      disc3(side * 50, 0, 102, 2.4, "yz", { tone: "lo" }),
    );
  }

  faces.push(
    tube(
      [
        [-50, 0, 102],
        [50, 0, 102],
      ],
      8.4,
      { tone: "mid" },
    ),
  );

  const blind: Point3[] = [
    [-47, 5, 100],
    [47, 5, 100],
    [47, 5, 42],
    [24, 5, 39],
    [0, 5, 42],
    [-24, 5, 39],
    [-47, 5, 42],
  ];
  faces.push(face3(blind, { tone: "mid", group: "blind" }));
  for (const x of [-20, 20]) {
    faces.push(
      stroke3(
        [
          [x, 5.1, 96],
          [x, 5.1, 43],
        ],
        "lo",
        { group: "blind" },
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [-46, 5.15, 97],
        [46, 5.15, 97],
      ],
      "lo",
      { group: "blind" },
    ),
    stroke3(
      [
        [-45, 5.15, 44],
        [45, 5.15, 44],
      ],
      "lo",
      { group: "blind" },
    ),
  );
  faces.push(
    stroke3(
      [
        [-47, 5.2, 97],
        [-47, 5.2, 45],
      ],
      "mid",
      { group: "blind" },
    ),
  );

  faces.push(
    tube(
      [
        [-48, 5, 36],
        [48, 5, 36],
      ],
      6.4,
      { tone: "edge", group: "bar" },
    ),
    disc3(-48.2, 5, 36, 3.4, "yz", { tone: "edge", group: "bar" }),
    disc3(48.2, 5, 36, 3.4, "yz", { tone: "edge", group: "bar" }),
  );

  faces.push(
    tube(
      [
        [48, 5, 34],
        [48, 5, 12],
      ],
      1.4,
      { tone: "lo", group: "cord" },
    ),
    ...sphereFaces(48, 5, 9, 2.4, { group: "cord", tone: "hi" }),
  );

  faces.push(
    stroke3(
      [
        [-44, 5.25, 8],
        [-44, 5.25, 4],
      ],
      "lo",
      { group: "blind" },
    ),
  );

  return faces;
}

export const sheet: PrototypeMeta = {
  slug: "sheet",
  name: "Sheet",
  component: "Sheet",
  object: "Roller blind",
  story:
    "The blind drops in one gesture and its weighted bar settles at the bottom of the frame.",
  note:
    "A sheet covers from one edge without moving the room: a surface that comes down over the view.",
  scene: figureScene({
    slug: "sheet",
    name: "Sheet",
    component: "Overlays",
    object: "Roller blind",
    description:
      "A roller blind on a freestanding frame, with a weighted bottom bar, a pull cord and fabric seams.",
    aria:
      "An isometric roller blind on two upright brackets, with a weighted bottom bar and a pull cord.",
    faces: sheetFaces(),
    motions: [
      { group: "blind", kind: "bob", period: 3400, amount: 2 },
      { group: "bar", kind: "bob", period: 3400, amount: 3.6, phase: 0.08 },
      { group: "cord", kind: "sway", period: 3000, amount: 3, pivot: [48, 5, 34] },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 20. Popover — pop-up greeting card                                         */
/* -------------------------------------------------------------------------- */

function popoverFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...box(-34, -10, 0, 68, 8, 3, { r: 2, tone: "mid", topTone: "lo" }),
  );

  faces.push(
    panel(-34, 34, -16, 0, 74, { tone: "lo" }),
    sidePanel(-16, 8, -34, 0, 74, { tone: "lo" }),
    sidePanel(-16, 8, 34, 0, 74, { tone: "lo" }),
    panel(-34, 34, -12, 0, 74, { tone: "mid" }),
  );

  faces.push(
    panel(-30, 30, -11.8, 4, 70, {
      fill: false,
      tone: "lo",
    }),
    stroke3(
      [
        [-26, -11.7, 64],
        [26, -11.7, 64],
      ],
      "lo",
    ),
    stroke3(
      [
        [-26, -11.7, 12],
        [16, -11.7, 12],
      ],
      "lo",
    ),
    stroke3(
      [
        [-26, -11.7, 18],
        [20, -11.7, 18],
      ],
      "lo",
    ),
    stroke3(
      [
        [-26, -11.7, 24],
        [12, -11.7, 24],
      ],
      "lo",
    ),
  );

  const confetti: Array<[number, number, number]> = [
    [-24, 54, 1.6],
    [-14, 60, 1.1],
    [18, 52, 1.4],
    [26, 60, 1],
    [10, 68, 1.2],
    [-6, 52, 1.3],
  ];
  for (const [x, z, r] of confetti) {
    const [px, py] = iso(x, -11.6, z);
    faces.push(
      face2(circle(px, py, r, 6), {
        tone: "lo",
        group: "confetti",
      }),
    );
  }

  const sceneGroup = "scene";
  const [sx, sy] = iso(0, -4, 60);
  faces.push(
    tube(
      [
        [0, 4, 6],
        [0, -4, 56],
      ],
      1.4,
      { tone: "mid", group: sceneGroup },
    ),
    tube(
      [
        [-16, 4, 6],
        [0, -4, 48],
        [16, 4, 6],
      ],
      1.2,
      { tone: "lo", group: sceneGroup },
    ),
    face2(star2(sx, sy, 12, 5.2), { tone: "hi", group: sceneGroup }),
    face2(star2(sx, sy, 7, 3), { fill: false, tone: "lo", group: sceneGroup }),
  );

  faces.push(
    face3(
      [
        [-34, 8, 0],
        [34, 8, 0],
        [34, 28, 52],
        [-34, 28, 52],
      ],
      { tone: "mid", group: "fold" },
    ),
    stroke3(
      [
        [-34, 8.1, 0],
        [34, 8.1, 0],
      ],
      "mid",
      { group: "fold" },
    ),
    stroke3(
      [
        [-34, 28.1, 52],
        [34, 28.1, 52],
      ],
      "edge",
      { group: "fold" },
    ),
    stroke3(
      [
        [-26, 25.5, 44],
        [26, 25.5, 44],
      ],
      "lo",
      { group: "fold" },
    ),
    stroke3(
      [
        [-20, 20.6, 36],
        [20, 20.6, 36],
      ],
      "lo",
      { group: "fold" },
    ),
  );

  for (const [x, z] of [
    [-34, 0],
    [34, 0],
  ] as const) {
    faces.push(
      ...sphereFaces(x, 8, z, 1.8, { group: "fold" }),
    );
  }

  return faces;
}

export const popover: PrototypeMeta = {
  slug: "popover",
  name: "Popover",
  component: "Popover",
  object: "Pop-up greeting card",
  story:
    "The fold opens on its crease and the little paper scene stands up inside the card.",
  note:
    "A popover is a card that raises a small scene: a floating layer still tied to its base.",
  scene: figureScene({
    slug: "popover",
    name: "Popover",
    component: "Overlays",
    object: "Pop-up greeting card",
    description:
      "A folded greeting card standing open, with a paper star rising on its crease and confetti inside.",
    aria:
      "An isometric pop-up greeting card, open on its fold with a small paper star standing up inside.",
    faces: popoverFaces(),
    motions: [
      { group: "fold", kind: "sway", period: 3000, amount: 3, pivot: [0, 8, 0] },
      { group: "scene", kind: "lift", period: 2600, amount: 4 },
      { group: "confetti", kind: "flicker", period: 2400, amount: 0.14 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 21. Tooltip — luggage tag on a string                                      */
/* -------------------------------------------------------------------------- */

function tooltipFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...ring(0, 0, 92, 9, 2.2, "xz", { tone: "mid" }),
    stroke2(circle(iso(0, 0, 92)[0], iso(0, 0, 92)[1], 1.4, 10), "lo"),
  );

  faces.push(
    tube(
      [
        [-5, 0, 84],
        [0, 0, 60],
      ],
      1.2,
      { tone: "lo", group: "string" },
    ),
    tube(
      [
        [5, 0, 84],
        [0, 0, 60],
      ],
      1.2,
      { tone: "lo", group: "string" },
    ),
  );

  const back = vRounded(0, -3, 4, 44, 54, 5, 4);
  const front = vRounded(0, 0, 4, 44, 54, 5, 4);
  faces.push(
    face3(back, { tone: "lo" }),
    sidePanel(4, 58, -22, 0, 4, { tone: "lo", group: "tag" }),
  );

  faces.push(
    face3(front, { tone: "mid", group: "tag" }),
    panel(-18, 18, 0.15, 10, 40, { fill: false, tone: "lo", group: "tag" }),
  );

  for (const z of [22, 28, 34]) {
    faces.push(
      stroke3(
        [
          [-15, 0.25, z],
          [12, 0.25, z],
        ],
        "lo",
        { group: "tag" },
      ),
    );
  }

  for (const z of [12, 15, 18]) {
    faces.push(
      stroke3(
        [
          [-4, 0.25, z],
          [4, 0.25, z],
        ],
        "lo",
        { group: "tag" },
      ),
    );
  }

  const barcode = [-13, -9, -4, 1, 6, 10, 14];
  for (const x of barcode) {
    faces.push(
      stroke3(
        [
          [x, 0.28, 7],
          [x, 0.28, 4.6],
        ],
        x % 2 === 0 ? "mid" : "lo",
        { group: "tag" },
      ),
    );
  }

  faces.push(
    ...ring(0, 0, 46, 3.6, 1.1, "xz", { tone: "hi", group: "tag" }),
    face3(
      vRounded(0, 0.05, 42.4, 7.2, 7.2, 3.6, 3),
      { tone: "lo", group: "tag" },
    ),
  );

  faces.push(
    stroke3(
      [
        [21, 0.3, 58],
        [21, 0.3, 52],
        [17, 0.3, 49],
      ],
      "lo",
      { group: "tag" },
    ),
  );

  return faces;
}

export const tooltip: PrototypeMeta = {
  slug: "tooltip",
  name: "Tooltip",
  component: "Tooltip",
  object: "Luggage tag on a string",
  story:
    "The tag swings out on its cords, turns its printed face to the reader and settles.",
  note:
    "A tooltip is a small label tied to an object: it only reads once it swings clear of the body.",
  scene: figureScene({
    slug: "tooltip",
    name: "Tooltip",
    component: "Overlays",
    object: "Luggage tag on a string",
    description:
      "A luggage tag with a reinforced eyelet hanging by two cords from a metal ring, printed with label lines and a barcode.",
    aria:
      "An isometric luggage tag hanging by two cords from a metal ring, with a reinforced eyelet and printed lines.",
    faces: tooltipFaces(),
    motions: [
      { group: "tag", kind: "sway", period: 3300, amount: 4.4, pivot: [0, 0, 58] },
      { group: "string", kind: "sway", period: 3300, amount: 1.4, pivot: [0, 0, 92], phase: 0.06 },
      { kind: "sway", period: 4800, amount: 0.6, pivot: [0, 0, 92] },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 23. Alert — fire-alarm pull station                                        */
/* -------------------------------------------------------------------------- */

function alertFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...prism(roundedRect(-34, -8, 68, 16, 5, 5), 0, 96, {
      lip: true,
      topTone: "lo",
      tone: "edge",
    }),
  );

  faces.push(
    panel(-30, 30, 8.15, 6, 90, { tone: "mid" }),
    panel(-27, 27, 8.2, 9, 87, { fill: false, tone: "lo" }),
    panel(-30, 30, 8.18, 58, 60, { fill: false, tone: "lo" }),
  );

  for (const [x, z] of [
    [-28, 88],
    [28, 88],
    [-28, 8],
    [28, 8],
    [-28, 48],
    [28, 48],
  ] as const) {
    const [px, py] = iso(x, 8.3, z);
    faces.push(
      face2(ellipse2(px, py, 1.8, 1.8, 14), { tone: "lo" }),
      stroke2(
        [
          [px - 1.1, py],
          [px + 1.1, py],
        ],
        "mid",
      ),
    );
  }

  for (const z of [68, 71.5, 75]) {
    faces.push(
      stroke3(
        [
          [-9, 8.25, z],
          [9, 8.25, z],
        ],
        "lo",
      ),
    );
  }

  faces.push(
    ...sphereFaces(0, 10, 83, 6.4, { group: "flash" }),
    ellipse3(0, 8.2, 78.4, 8, 4.2, {
      fill: false,
      tone: "lo",
      group: "flash",
    }),
    stroke3(
      [
        [-10, 8.3, 77],
        [-10, 8.3, 75],
      ],
      "lo",
    ),
    stroke3(
      [
        [10, 8.3, 77],
        [10, 8.3, 75],
      ],
      "lo",
    ),
  );

  faces.push(
    ...box(-16, 8, 24, 32, 12, 28, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "handle",
    }),
    panel(-13, 13, 20.2, 28, 48, { tone: "mid", group: "handle" }),
    stroke3(
      [
        [-8, 20.4, 44],
        [0, 20.4, 36],
        [8, 20.4, 44],
      ],
      "hi",
      { group: "handle" },
    ),
    stroke3(
      [
        [-12, 20.4, 32],
        [12, 20.4, 32],
      ],
      "lo",
      { group: "handle" },
    ),
    tube(
      [
        [-14, 9, 52],
        [14, 9, 52],
      ],
      2.6,
      { tone: "mid", group: "handle" },
    ),
    disc3(-14.4, 9, 52, 2.6, "yz", { tone: "mid", group: "handle" }),
    disc3(14.4, 9, 52, 2.6, "yz", { tone: "mid", group: "handle" }),
  );

  for (const x of [-26, 26]) {
    faces.push(
      tube(
        [
          [x, 8, 92],
          [x, 8, 96],
        ],
        1.8,
        { tone: "lo" },
      ),
    );
  }

  return faces;
}

export const alert: PrototypeMeta = {
  slug: "alert",
  name: "Alert",
  component: "Alert",
  object: "Fire-alarm pull station",
  story:
    "The handle drops, the plate rocks on its screws and the strobe fires one bright pulse.",
  note:
    "An alert exists to be seen and to interrupt: a plate with a handle made to be pulled.",
  scene: figureScene({
    slug: "alert",
    name: "Alert",
    component: "Overlays",
    object: "Fire-alarm pull station",
    description:
      "A wall-mounted fire-alarm pull station with a large handle, a hinge, a strobe dome and a siren grille.",
    aria:
      "An isometric fire-alarm pull station with a large pull handle, a hinged top and a strobe dome.",
    faces: alertFaces(),
    motions: [
      { group: "handle", kind: "lift", period: 2400, amount: -5 },
      { group: "flash", kind: "flicker", period: 2100, amount: 0.34 },
    ],
    press: 1.3,
  }),
};

/* -------------------------------------------------------------------------- */
/* 24. Accordion — folding hand fan                                           */
/* -------------------------------------------------------------------------- */

function accordionFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const pivot: Point2 = [0, 34];
  const rx = 70;
  const ry = 57;
  const inner = 0.58;
  const pleats = 9;
  const from = -Math.PI * 0.9;
  const to = -Math.PI * 0.1;

  const at = (angle: number, k: number): Point2 => [
    pivot[0] + Math.cos(angle) * rx * k,
    pivot[1] + Math.sin(angle) * ry * k,
  ];

  for (let index = 0; index < pleats; index += 1) {
    const a0 = from + ((to - from) * index) / pleats;
    const a1 = from + ((to - from) * (index + 1)) / pleats;
    const quad: Point2[] = [
      at(a0, inner),
      at(a0, 1),
      at(a1, 1),
      at(a1, inner),
    ];
    faces.push(
      face2(quad, {
        tone: index % 2 === 0 ? "edge" : "mid",
        group: "fan",
      }),
    );
    faces.push(
      stroke2([pivot, at(a1, 1)], "lo", { group: "fan" }),
    );
  }

  faces.push(
    face2(
      circle(pivot[0], pivot[1], 5.2, 22),
      { tone: "edge", group: "fan" },
    ),
    face2(circle(pivot[0], pivot[1], 2.2, 16), {
      tone: "hi",
      group: "fan",
    }),
  );

  const guard = (angle: number): Point2[] => [
    pivot,
    at(angle, 1.03),
  ];
  faces.push(
    face2(guard(from), { fill: false, tone: "edge", group: "fan" }),
    face2(guard(to), { fill: false, tone: "edge", group: "fan" }),
  );

  faces.push(
    stroke2(
      [
        [0, 39],
        [2, 52],
        [-1, 62],
      ],
      "mid",
      { group: "tassel" },
    ),
    face2(circle(-1, 67, 4.4, 18), { tone: "edge", group: "tassel" }),
    face2(circle(-1, 67, 2.4, 14), { tone: "lo", group: "tassel" }),
  );

  return faces;
}

export const accordion: PrototypeMeta = {
  slug: "accordion",
  name: "Accordion",
  component: "Accordion",
  object: "Folding hand fan",
  story:
    "One pleat opens, the arc of the fan widens and the other folds gather in proportion.",
  note:
    "An accordion keeps several panels on one pivot: one opens while the rest stay folded.",
  scene: figureScene({
    slug: "accordion",
    name: "Accordion",
    component: "Disclosure",
    object: "Folding hand fan",
    description:
      "An open folding fan with nine pleats, two guard sticks, a rivet and a hanging tassel.",
    aria:
      "An isometric nine-pleat folding hand fan with two guard sticks, a central rivet and a tassel.",
    faces: accordionFaces(),
    motions: [
      { group: "fan", kind: "breathe", period: 3200, amount: 0.045, pivot: [0, 0, -39.26] },
      { group: "tassel", kind: "sway", period: 3000, amount: 4, pivot: [0, 0, -39.26] },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 25. Tabs — rolodex card wheel                                              */
/* -------------------------------------------------------------------------- */

function tabsFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  for (const side of [-1, 1] as const) {
    faces.push(
      ...box(side * 36 - 6, -10, 0, 12, 20, 5, {
        r: 2,
        tone: "mid",
        topTone: "lo",
      }),
      ...box(side * 36 - 3, -3, 5, 6, 6, 45, {
        r: 1.5,
        tone: "edge",
        topTone: "lo",
      }),
    );
  }

  faces.push(
    disc3(-38.5, 0, 50, 20, "yz", { tone: "lo" }),
    disc3(-38.4, 0, 50, 14.5, "yz", { fill: false, tone: "lo" }),
    disc3(-38.3, 0, 50, 4, "yz", { tone: "mid" }),
    disc3(-38.2, 0, 50, 1.5, "yz", { tone: "lo" }),
  );

  const thetas = [
    -Math.PI / 2 - 0.95,
    -Math.PI / 2 - 0.63,
    -Math.PI / 2 - 0.31,
    -Math.PI / 2,
    -Math.PI / 2 + 0.28,
    -Math.PI / 2 + 0.54,
  ];
  const r0 = 7;
  const r1 = 30;
  const halfW = 28;

  thetas.forEach((theta, index) => {
    const cy = Math.cos(theta);
    const cz = Math.sin(theta);
    const A: Point3 = [-halfW, cy * r0, 50 + cz * r0];
    const B: Point3 = [halfW, cy * r0, 50 + cz * r0];
    const C: Point3 = [halfW, cy * r1, 50 + cz * r1];
    const D: Point3 = [-halfW, cy * r1, 50 + cz * r1];
    const isFront = index === 3;
    faces.push(
      face3([A, B, C, D], {
        tone: isFront ? "mid" : "edge",
        group: isFront ? "front" : undefined,
      }),
    );
    const tabX = -24 + ((index * 8) % 40);
    const tabR0 = r1;
    const tabR1 = r1 + 3.2;
    faces.push(
      face3(
        [
          [tabX, cy * tabR0, 50 + cz * tabR0],
          [tabX + 6, cy * tabR0, 50 + cz * tabR0],
          [tabX + 6, cy * tabR1, 50 + cz * tabR1],
          [tabX, cy * tabR1, 50 + cz * tabR1],
        ],
        {
          tone: isFront ? "lo" : "mid",
          group: isFront ? "front" : undefined,
        },
      ),
    );
    if (isFront) {
      for (const r of [13, 19, 25]) {
        faces.push(
          stroke3(
            [
              [-22, cy * r, 50 + cz * r],
              [22, cy * r, 50 + cz * r],
            ],
            "lo",
            { group: "front" },
          ),
        );
      }
      faces.push(
        stroke3(
          [
            [-22, cy * 8, 50 + cz * 8],
            [6, cy * 8, 50 + cz * 8],
          ],
          "hi",
          { group: "front" },
        ),
      );
    }
  });

  faces.push(
    tube(
      [
        [-38, 0, 50],
        [38, 0, 50],
      ],
      3.2,
      { tone: "edge" },
    ),
  );

  faces.push(
    disc3(38.5, 0, 50, 20, "yz", { tone: "edge" }),
    disc3(38.6, 0, 50, 14.5, "yz", { fill: false, tone: "lo" }),
    disc3(38.7, 0, 50, 4, "yz", { tone: "mid" }),
    tube(
      [
        [38, 0, 50],
        [45, 0, 50],
      ],
      2.4,
      { tone: "mid" },
    ),
    ...sphereFaces(46, 0, 50, 3.2, {}),
  );

  return faces;
}

export const tabs: PrototypeMeta = {
  slug: "tabs",
  name: "Tabs",
  component: "Tabs",
  object: "Rolodex card wheel",
  story:
    "The wheel turns on its spindle and the next tab clicks into the reading position.",
  note:
    "Tabs are parallel views of one file: a card wheel turns one face to the reader at a time.",
  scene: figureScene({
    slug: "tabs",
    name: "Tabs",
    component: "Navigation",
    object: "Rolodex card wheel",
    description:
      "A rolodex card wheel on its stand: fanned cards on a spindle, each with a tab, one face forward.",
    aria:
      "An isometric rolodex card wheel on a small stand, with fanned tabbed cards and one front card.",
    faces: tabsFaces(),
    motions: [
      { group: "front", kind: "lift", period: 2800, amount: 2.4 },
      { kind: "sway", period: 4200, amount: 1.2, pivot: [0, 0, 50] },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                  */
/* -------------------------------------------------------------------------- */

export const lot1Prototypes: PrototypeMeta[] = [
  button,
  buttonGroup,
  toggle,
  switchScene,
  checkbox,
  radio,
  slider,
  themeToggler,
  input,
  textarea,
  inputOtp,
  select,
  combobox,
  datePicker,
  calendar,
  command,
  dialog,
  drawer,
  sheet,
  popover,
  tooltip,
  toast,
  alert,
  accordion,
  tabs,
];

export const studyPrototypes: PrototypeMeta[] = [
  spinner,
  status,
  safari,
  generatedImage,
  videoPlayer,
  chat,
  avatar,
  cake,
  coffeeCup,
];

export const objectCatalogue: PrototypeMeta[] = [
  ...lot1Prototypes,
  ...studyPrototypes,
];

