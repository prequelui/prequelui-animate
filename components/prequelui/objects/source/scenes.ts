/*
 * Twelve final prototypes for the Linear v4 review.
 *
 * Each scene is one real object, authored from scratch for this study. The
 * object is chosen to tell the component's job by metaphor: a jack-in-the-box
 * for a toast, a lighthouse for a status, a pinwheel for a spinner, a hot-air
 * balloon for the browser, a 3D printer for a generated image, a wall planner
 * for a calendar, a film projector for video, two tin cans for chat, a cameo
 * for an avatar, a trombone for a slider, plus a cake and a coffee cup.
 *
 * None of the reference objects is reused for the same component, and no
 * common slab sits under a drawing.
 */

import type { FigureFace, FigureMotion, Point2, Point3 } from "./engine";
import {
  box,
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
  type PrototypeMeta,
} from "./geom";

/* -------------------------------------------------------------------------- */
/* Toast — jack-in-the-box                                                    */
/* -------------------------------------------------------------------------- */

function toastFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const foot = roundedRect(-42, -34, 84, 68, 8, 6);

  /* The opened lid stands behind the box, hinged on its back edge. */
  faces.push(
    face3(
      [
        [-40, -34, 54],
        [40, -34, 54],
        [40, -52, 118],
        [-40, -52, 118],
      ],
      { tone: "mid" },
    ),
    face3(
      [
        [-40, -52, 118],
        [40, -52, 118],
        [40, -56, 114],
        [-40, -56, 114],
      ],
      { tone: "lo" },
    ),
    face3(
      [
        [-40, -34, 54],
        [-40, -52, 118],
        [-40, -56, 114],
        [-40, -38, 54],
      ],
      { tone: "lo" },
    ),
    face3(
      [
        [-33, -36, 61],
        [33, -36, 61],
        [33, -49.2, 109],
        [-33, -49.2, 109],
      ],
      { fill: false, tone: "lo" },
    ),
    face3(
      [
        [-26, -37.5, 69],
        [26, -37.5, 69],
        [26, -46.5, 99],
        [-26, -46.5, 99],
      ],
      { fill: false, tone: "lo" },
    ),
  );

  /* Box body with an open top: the slot is a rounded rectangle on the top
     face, so the spring reads as coming from inside a real box. */
  faces.push(
    tube(
      [
        [-42, -34, 54],
        [42, -34, 54],
      ],
      2,
      { tone: "mid" },
    ),
  );
  faces.push(...prism(foot, 0, 54, { lip: true, topTone: "edge" }));
  faces.push(
    face2(
      roundedRect(-26, -17, 52, 34, 10, 5).map(([x, y]) => iso(x, y, 54.2)),
      { tone: "edge" },
    ),
    face2(
      roundedRect(-21, -12, 42, 24, 7, 4).map(([x, y]) => iso(x, y, 54.3)),
      { tone: "lo" },
    ),
  );

  /* Brass corner protectors and a front emblem. */
  const front = 34;
  for (const [x0, x1, z0, z1] of [
    [-42, -32, 0, 10],
    [32, 42, 0, 10],
    [-42, -32, 44, 54],
    [32, 42, 44, 54],
  ] as const) {
    faces.push(
      face3(
        [
          [x0, front, z0],
          [x1, front, z0],
          [x1, front, z1],
          [x0, front, z1],
        ],
        { tone: "mid" },
      ),
    );
  }
  for (const [x, z] of [
    [-37, 5],
    [37, 5],
    [-37, 49],
    [37, 49],
  ] as const) {
    const [dx, dy] = iso(x, front - 0.2, z);
    faces.push(face2(ellipse2(dx, dy, 1.2, 1.2, 12), { tone: "hi" }));
  }

  faces.push(
    stroke3(
      [
        [0, front, 18],
        [12, front, 30],
        [0, front, 42],
        [-12, front, 30],
      ],
      "mid",
      { closed: true },
    ),
    stroke3(
      [
        [0, front, 23],
        [7, front, 30],
        [0, front, 37],
        [-7, front, 30],
      ],
      "lo",
      { closed: true },
    ),
    stroke3(
      [
        [-42, front, 46],
        [42, front, 46],
      ],
      "lo",
    ),
  );

  /* Crank on the right side: axle, arm, wooden knob. */
  faces.push(
    tube(
      [
        [42, 6, 27],
        [52, 6, 27],
        [52, 6, 41],
      ],
      2.3,
      { group: "crank" },
    ),
    disc3(42, 6, 27, 4.4, "yz", { tone: "mid", group: "crank" }),
  );
  const [kx, ky] = iso(52, 6, 41);
  faces.push(
    face2(ellipse2(kx, ky, 4.4, 4.4, 22), { tone: "edge", group: "crank" }),
    face2(ellipse2(kx, ky, 1.6, 1.6, 14), { tone: "lo", group: "crank" }),
  );

  /* Spring and the jack. The spring is a screen-space zigzag so its coils
     stay readable at small sizes. */
  for (let z = 57; z <= 91; z += 6.8) {
    faces.push(
      ellipse3(0, 2, z, 13, 13, {
        fill: false,
        tone: "mid",
        group: "jack",
      }),
    );
  }
  faces.push(
    stroke3(
      [
        [0, 2, 53],
        [0, 2, 95],
      ],
      "lo",
      { group: "jack" },
    ),
  );

  const [hx, hy] = iso(0, 2, 124);
  faces.push(
    face2(star2(hx, hy, 22, 9.5, 5, -Math.PI / 2), {
      tone: "edge",
      group: "jack",
    }),
    face2(star2(hx, hy, 15.5, 6.8, 5, -Math.PI / 2), {
      tone: "lo",
      group: "jack",
    }),
  );
  faces.push(
    face2(
      [
        [hx - 7, hy - 3],
        [hx - 3, hy - 3],
      ],
      { fill: false, tone: "hi", group: "jack" },
    ),
    face2(
      [
        [hx + 3, hy - 3],
        [hx + 7, hy - 3],
      ],
      { fill: false, tone: "hi", group: "jack" },
    ),
  );
  const smile: Point2[] = [];
  for (let index = 0; index <= 10; index += 1) {
    const a = Math.PI * (0.12 + (index / 10) * 0.76);
    smile.push([hx + Math.cos(a) * 7, hy + 2 + Math.sin(a) * 5]);
  }
  faces.push(
    face2(smile, { fill: false, tone: "hi", group: "jack", closed: false }),
  );
  faces.push(
    face2(
      [
        [hx - 13, hy + 19],
        [hx + 13, hy + 19],
        [hx + 9, hy + 25],
        [hx - 9, hy + 25],
      ],
      { tone: "mid", group: "jack" },
    ),
  );

  return faces;
}

export const toast: PrototypeMeta = {
  slug: "toast",
  name: "Toast",
  component: "Toast",
  object: "Jack-in-the-box",
  story:
    "A crank turns, the lid flips and a jack springs out for a moment before the box closes again.",
  note: "A notice is transient by nature: something surprising appears, then folds away.",
  scene: figureScene({
    slug: "toast",
    name: "Toast",
    component: "Overlays",
    object: "Jack-in-the-box",
    description:
      "A jack-in-the-box: square box, open lid, crank and a star-headed jack on its spring.",
    aria:
      "An isometric jack-in-the-box with an open lid, a side crank and a star-headed jack rising on a spring.",
    faces: toastFaces(),
    motions: [
      { group: "crank", kind: "spin", period: 1300, amount: 360 },
      { group: "jack", kind: "bob", period: 1700, amount: 4.2 },
      { group: "jack", kind: "sway", period: 2600, amount: 2.2 },
    ],
    press: 1.2,
  }),
};

/* -------------------------------------------------------------------------- */
/* Status — lighthouse                                                        */
/* -------------------------------------------------------------------------- */

function statusFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const rock: Point2[] = [
    [-46, -18],
    [-30, -32],
    [-8, -29],
    [15, -34],
    [39, -22],
    [48, -2],
    [38, 22],
    [12, 31],
    [-16, 28],
    [-42, 14],
  ];
  faces.push(...prism(rock, 0, 9, { topTone: "mid", lip: false }));
  faces.push(
    stroke3(
      [
        [-30, -32, 9],
        [-22, -12, 9],
        [-30, 10, 9],
      ],
      "lo",
    ),
    stroke3(
      [
        [15, -34, 9],
        [20, -16, 9],
        [34, -10, 9],
      ],
      "lo",
    ),
    ellipse3(0, 0, 9.2, 38, 26, { tone: "lo" }),
  );

  /* Tower, with three painted bands and a bottom arc. */
  faces.push(
    ...cylinder(0, 0, 9, 80, 28, 18, {
      sides: 38,
      hollow: 0,
      bottomArc: true,
    }),
    ...cylinder(0, 0, 27, 6, 26.6, 25.4, {
      tone: "mid",
      topTone: "lo",
    }),
    ...cylinder(0, 0, 51, 6, 23.4, 22.4, {
      tone: "mid",
      topTone: "lo",
    }),
    ...cylinder(0, 0, 73, 5, 20.4, 19.6, {
      tone: "mid",
      topTone: "lo",
    }),
  );

  /* Door, two windows and their frames, engraved on the front surface. */
  const door = (x: number, z: number, w: number, h: number, group?: string) => {
    const r = 26;
    faces.push(
      face3(
        [
          [x - w, r, z],
          [x - w, r, z + h - w],
          [x, r, z + h],
          [x + w, r, z + h - w],
          [x + w, r, z],
        ],
        { tone: "mid", group },
      ),
    );
  };
  door(0, 10, 9, 27);
  const [dx, dy] = iso(6, 26.6, 19);
  faces.push(face2(ellipse2(dx, dy, 1.6, 1.6, 16), { tone: "hi" }));
  for (const x of [-8, 8]) {
    faces.push(
      stroke3(
        [
          [x, 22.4, 52],
          [x, 22.4, 60],
        ],
        "mid",
      ),
      stroke3(
        [
          [x - 1.6, 22.4, 56],
          [x + 1.6, 22.4, 56],
        ],
        "lo",
      ),
    );
  }

  /* Gallery deck, railing and lantern room. */
  faces.push(
    ...cylinder(0, 0, 89, 4, 24, 23, { topTone: "mid" }),
    ellipse3(0, 0, 93.2, 21, 14, { tone: "lo" }),
  );
  const railZ = 93;
  const railTop = 104;
  for (let index = 0; index < 9; index += 1) {
    const a = -Math.PI * 0.08 + (index / 8) * Math.PI * 1.16;
    const x = Math.cos(a) * 22.5;
    const y = Math.sin(a) * 22.5;
    if (x + y < -7) continue;
    faces.push(
      tube(
        [
          [x, y, railZ],
          [x, y, railTop],
        ],
        1.35,
        { tone: "lo" },
      ),
    );
  }
  faces.push(ellipse3(0, 0, railTop, 22.5, 22.5, { fill: false, tone: "mid" }));

  faces.push(
    ...cylinder(0, 0, 93, 15, 12.5, 11.5, {
      tone: "edge",
      hollow: 2.4,
      topTone: "lo",
    }),
    stroke3(
      [
        [-6.5, 12.4, 96],
        [-6.5, 12.4, 105],
        [6.5, 12.4, 105],
        [6.5, 12.4, 96],
      ],
      "mid",
      { closed: true },
    ),
    stroke3(
      [
        [-3.6, 11.7, 96],
        [-3.6, 11.7, 105],
        [3.6, 11.7, 105],
        [3.6, 11.7, 96],
      ],
      "lo",
      { closed: true },
    ),
  );

  /* Lamp and a short halo instead of a long beam: a long cone would enlarge
     the camera bounds and shrink the whole drawing. */
  const [lx, ly] = iso(0, 0, 101);
  faces.push(
    face2(ellipse2(lx, ly, 5.2, 5.2, 20), {
      tone: "hi",
      group: "lamp",
    }),
    face2(ellipse2(lx, ly, 8.2, 8.2, 24), {
      fill: false,
      tone: "lo",
      group: "lamp",
    }),
  );
  faces.push(
    face2(
      [
        [lx - 7, ly - 4],
        [lx - 47, ly - 23],
        [lx - 47, ly + 17],
        [lx - 7, ly + 5],
      ],
      { fill: false, tone: "lo", group: "beam" },
    ),
    stroke2(
      [
        [lx - 10, ly - 1],
        [lx - 42, ly - 7],
      ],
      "lo",
      { group: "beam" },
    ),
    stroke2(
      [
        [lx - 10, ly + 2],
        [lx - 42, ly + 9],
      ],
      "lo",
      { group: "beam" },
    ),
    stroke2(
      [
        [lx + 10, ly],
        [lx + 24, ly - 4],
      ],
      "lo",
      { group: "beam" },
    ),
    stroke2(
      [
        [lx + 10, ly + 2],
        [lx + 24, ly + 6],
      ],
      "lo",
      { group: "beam" },
    ),
  );

  /* Roof, finial and ball. */
  faces.push(
    ...cylinder(0, 0, 108, 12, 14, 0, { tone: "edge", topTone: "mid" }),
    tube(
      [
        [0, 0, 120],
        [0, 0, 128],
      ],
      2,
      { tone: "edge" },
    ),
  );
  const [fx, fy] = iso(0, 0, 130);
  faces.push(face2(ellipse2(fx, fy, 4, 4, 20), { tone: "edge" }));
  faces.push(
    face2(
      [
        [fx - 4, fy],
        [fx, fy + 2],
        [fx + 4, fy],
        [fx, fy - 2],
      ],
      { tone: "lo" },
    ),
  );

  return faces;
}

export const status: PrototypeMeta = {
  slug: "status",
  name: "Status",
  component: "Status",
  object: "Lighthouse",
  story:
    "The lamp swells and its short halo sweeps once across the horizon, then settles.",
  note: "A status is a state that stays lit and broadcasts itself, even from afar.",
  scene: figureScene({
    slug: "status",
    name: "Status",
    component: "Feedback",
    object: "Lighthouse",
    description:
      "A lighthouse on a low rock: banded tower, gallery railing, lantern room, lamp and roof.",
    aria:
      "An isometric lighthouse on a small rock, with a banded tower, a railed gallery, a lit lantern and a short halo.",
    faces: statusFaces(),
    motions: [
      { group: "lamp", kind: "flicker", period: 1900, amount: 0.16 },
      {
        group: "beam",
        kind: "sway",
        period: 2900,
        amount: 5.5,
        pivot: [0, 0, 101],
      },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* Spinner — pinwheel                                                         */
/* -------------------------------------------------------------------------- */

function spinnerFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  faces.push(
    tube(
      [
        [0, 0, 0],
        [0, 0, 87],
      ],
      2.4,
      { tone: "edge" },
    ),
    tube(
      [
        [-7, 0, 2],
        [7, 0, 2],
      ],
      1.8,
      { tone: "lo" },
    ),
  );

  const [hx, hy] = iso(0, 0, 88);
  const blade = [
    [0, 0],
    [37, -5],
    [26, -27],
    [2, -6],
  ] as const;
  for (let index = 0; index < 6; index += 1) {
    const a = (index / 6) * Math.PI * 2 - 0.34;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    const points = blade.map(([x, y]) => {
      const sx = x * cos - y * sin;
      const sy = x * sin + y * cos;
      return [hx + sx, hy + sy] as Point2;
    });
    faces.push(
      face2(points, {
        tone: index === 0 ? "hi" : "edge",
        group: "wheel",
      }),
      stroke2([points[0], points[2]], "lo", { group: "wheel" }),
    );
  }

  faces.push(
    face2(ellipse2(hx, hy, 5.4, 5.4, 22), { tone: "edge", group: "wheel" }),
    face2(ellipse2(hx, hy, 2, 2, 16), { tone: "hi", group: "wheel" }),
  );

  return faces;
}

export const spinner: PrototypeMeta = {
  slug: "spinner",
  name: "Spinner",
  component: "Spinner",
  object: "Pinwheel",
  story:
    "The six folded vanes catch the air, spin up and settle back to a slow idle.",
  note: "Waiting is movement: the pinwheel is the motion itself, readable from any angle.",
  scene: figureScene({
    slug: "spinner",
    name: "Spinner",
    component: "Feedback",
    object: "Pinwheel",
    description:
      "A six-vane pinwheel on a stick, each vane folded along its diagonal.",
    aria:
      "An isometric six-vane pinwheel on a slim stick, with folded paper vanes around a central hub.",
    faces: spinnerFaces(),
    motions: [
      { group: "wheel", kind: "spin", period: 2300, amount: 360 },
      { kind: "sway", period: 3800, amount: 0.7 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* Safari — hot-air balloon                                                   */
/* -------------------------------------------------------------------------- */

function safariFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [bx, by] = iso(0, 0, 58);
  const envelope: Point2[] = [
    [bx, by + 1],
    [bx + 13, by - 1],
    [bx + 20, by - 8],
    [bx + 29, by - 20],
    [bx + 40, by - 36],
    [bx + 47, by - 54],
    [bx + 49, by - 70],
    [bx + 43, by - 86],
    [bx + 31, by - 96],
    [bx + 16, by - 101],
    [bx, by - 103],
    [bx - 16, by - 101],
    [bx - 31, by - 96],
    [bx - 43, by - 86],
    [bx - 49, by - 70],
    [bx - 47, by - 54],
    [bx - 40, by - 36],
    [bx - 29, by - 20],
    [bx - 20, by - 8],
    [bx - 13, by - 1],
  ];
  faces.push(face2(envelope, { tone: "edge", group: "balloon" }));

  const curve = (p0: Point2, p1: Point2, p2: Point2, steps = 8) => {
    const points: Point2[] = [];
    for (let index = 0; index <= steps; index += 1) {
      const t = index / steps;
      const mt = 1 - t;
      points.push([
        mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0],
        mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1],
      ]);
    }
    return points;
  };

  for (const k of [-1, -0.55, 0, 0.55, 1]) {
    faces.push(
      stroke2(
        curve([bx, by - 100], [bx + k * 56, by - 48], [bx + k * 13, by - 1]),
        "lo",
        { group: "balloon" },
      ),
    );
  }
  for (const [dy, width] of [
    [-20, 27],
    [-50, 46],
    [-78, 38],
  ] as const) {
    const points: Point2[] = [];
    for (let index = 0; index <= 18; index += 1) {
      const t = index / 18;
      points.push([
        bx + width * (2 * t - 1),
        by + dy + 5 * Math.sin(Math.PI * t),
      ]);
    }
    faces.push(stroke2(points, "lo", { group: "balloon" }));
  }
  faces.push(
    face2(ellipse2(bx, by - 1, 13, 4, 24), { tone: "mid", group: "balloon" }),
    stroke2(ellipse2(bx, by - 1, 15, 5, 24), "lo", { group: "balloon" }),
  );
  faces.push(
    stroke2(
      [
        [bx, by - 103],
        [bx, by - 94],
      ],
      "mid",
      { group: "balloon" },
    ),
  );

  const basket = roundedRect(-17, -14, 34, 28, 3, 3);
  faces.push(...prism(basket, 0, 20, { lip: true, tone: "edge" }));
  for (const z of [5, 11, 16]) {
    faces.push(
      stroke3(
        [
          [-17, 14, z],
          [17, 14, z],
        ],
        "lo",
      ),
    );
  }
  for (const x of [-8, 0, 8]) {
    faces.push(
      stroke3(
        [
          [x, 14, 2],
          [x, 14, 18],
        ],
        "lo",
      ),
    );
  }

  const corners: Array<[number, number]> = [
    [-15, -12],
    [15, -12],
    [15, 12],
    [-15, 12],
  ];
  const mouths: Array<[number, number]> = [
    [-11, 0],
    [11, 0],
    [0, -11],
    [0, 11],
  ];
  corners.forEach(([x, y], index) => {
    const [mx, my] = mouths[index];
    faces.push(
      tube(
        [
          [x, y, 19],
          [mx, my, 55],
        ],
        1.1,
        { tone: "lo" },
      ),
    );
  });

  faces.push(
    ...cylinder(0, 0, 20, 12, 4, 5, { tone: "mid", topTone: "lo" }),
    tube(
      [
        [0, 0, 32],
        [0, 0, 36],
      ],
      1.8,
      { tone: "edge" },
    ),
  );
  const [fx, fy] = iso(0, 0, 38);
  faces.push(
    face2(
      [
        [fx - 3.4, fy + 4],
        [fx - 1.2, fy - 2],
        [fx, fy - 8],
        [fx + 1.4, fy - 2],
        [fx + 3.4, fy + 4],
      ],
      { tone: "hi", group: "flame" },
    ),
    face2(
      [
        [fx - 1.4, fy + 3],
        [fx, fy - 3],
        [fx + 1.4, fy + 3],
      ],
      { tone: "lo", group: "flame" },
    ),
  );

  return faces;
}

export const safari: PrototypeMeta = {
  slug: "safari",
  name: "Safari",
  component: "Safari",
  object: "Hot-air balloon",
  story:
    "The envelope leans on the breeze and the burner flares, nudging the basket upward.",
  note: "Browsing is travel: a slow drift over a wide landscape, steered by small bursts.",
  scene: figureScene({
    slug: "safari",
    name: "Safari",
    component: "Media",
    object: "Hot-air balloon",
    description:
      "A hot-air balloon: panelled envelope, burner, ropes and a woven basket.",
    aria:
      "An isometric hot-air balloon with a panelled envelope, a burner, four ropes and a woven basket.",
    faces: safariFaces(),
    motions: [
      { group: "balloon", kind: "sway", period: 4400, amount: 1.2 },
      { group: "flame", kind: "flicker", period: 420, amount: 0.32 },
      { kind: "bob", period: 3600, amount: 2.4 },
    ],
    press: 1.2,
  }),
};

/* -------------------------------------------------------------------------- */
/* Generated Image — 3D printer                                               */
/* -------------------------------------------------------------------------- */

function generatedImageFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  faces.push(...prism(roundedRect(-54, -40, 108, 80, 5, 4), 0, 6, { lip: true }));
  for (const x of [-36, -18, 0, 18, 36]) {
    faces.push(
      stroke3(
        [
          [x, -24, 6.2],
          [x, 24, 6.2],
        ],
        "lo",
      ),
    );
  }
  for (const y of [-24, 0, 24]) {
    faces.push(
      stroke3(
        [
          [-40, y, 6.2],
          [40, y, 6.2],
        ],
        "lo",
      ),
    );
  }

  faces.push(
    ...box(-56, -37, 6, 8, 8, 90, { r: 2 }),
    ...box(48, -37, 6, 8, 8, 90, { r: 2 }),
    ...box(-56, -37, 96, 112, 8, 8, { r: 2 }),
  );
  faces.push(
    stroke3(
      [
        [-52, -29, 10],
        [-52, -29, 94],
      ],
      "lo",
    ),
    stroke3(
      [
        [52, -29, 10],
        [52, -29, 94],
      ],
      "lo",
    ),
  );

  const layer = (z: number, r: number) =>
    ellipse3(0, 6, z, r, r, { fill: false, tone: "lo", group: "print" });
  faces.push(
    ...cylinder(0, 6, 6, 8, 22, 21, { tone: "edge", group: "print" }),
    ...cylinder(0, 6, 14, 12, 20, 16, { tone: "edge", group: "print" }),
    ...cylinder(0, 6, 26, 10, 14, 11, { tone: "edge", group: "print" }),
    ...cylinder(0, 6, 36, 6, 11, 15, {
      tone: "edge",
      hollow: 2.6,
      group: "print",
    }),
  );
  for (const [z, r] of [
    [10, 21],
    [18, 18],
    [26, 13],
    [40, 13],
  ] as const) {
    faces.push(layer(z, r));
  }

  faces.push(
    ...box(-14, -39, 88, 28, 12, 8, { r: 2, group: "head" }),
    ...box(-4, -37, 82, 8, 8, 7, { r: 1.5, group: "head" }),
    tube(
      [
        [0, -33, 82],
        [0, -33, 74],
      ],
      2.6,
      { tone: "edge", group: "head" },
    ),
  );
  const [nx, ny] = iso(0, -33, 74);
  faces.push(
    face2(
      [
        [nx - 2.8, ny],
        [nx, ny + 4],
        [nx + 2.8, ny],
      ],
      { tone: "lo", group: "head" },
    ),
    stroke2([iso(0, 6, 43), [nx, ny + 4]], "lo", { group: "head" }),
  );

  return faces;
}

export const generatedImage: PrototypeMeta = {
  slug: "generated-image",
  name: "Generated Image",
  component: "Generated Image",
  object: "3D printer",
  story:
    "The carriage glides and the vase gains a printed layer under the nozzle.",
  note: "An image made from nothing is built like an object: layer after layer.",
  scene: figureScene({
    slug: "generated-image",
    name: "Generated Image",
    component: "AI",
    object: "3D printer",
    description:
      "A gantry 3D printer: bed, two posts, a carriage with nozzle and a printed vase.",
    aria:
      "An isometric 3D printer with a gantry, a moving nozzle and a layered vase on its bed.",
    faces: generatedImageFaces(),
    motions: [
      { group: "head", kind: "lift", period: 2100, amount: 7 },
      { group: "print", kind: "breathe", period: 3400, amount: 0.006 },
    ],
    press: 1.2,
  }),
};

/* -------------------------------------------------------------------------- */
/* Calendar — wall planner                                                    */
/* -------------------------------------------------------------------------- */

function calendarFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const sheet = (y: number, tone: "edge" | "lo") =>
    face3(
      [
        [-48, y, 26],
        [48, y, 26],
        [48, y, 150],
        [-48, y, 150],
      ],
      { tone, group: "sheet" },
    );
  faces.push(sheet(2, "lo"), sheet(0, "edge"));

  for (let index = 0; index < 7; index += 1) {
    const x = -42 + index * 14;
    faces.push(
      stroke3(
        [
          [x, -0.2, 34],
          [x, -0.2, 126],
        ],
        index === 0 || index === 6 ? "mid" : "lo",
        { group: "sheet" },
      ),
    );
  }
  for (let index = 0; index < 6; index += 1) {
    const z = 34 + index * 18.4;
    faces.push(
      stroke3(
        [
          [-42, -0.2, z],
          [42, -0.2, z],
        ],
        "lo",
        { group: "sheet" },
      ),
    );
  }
  for (let index = 0; index < 7; index += 1) {
    const x = -42 + 7 + index * 14;
    faces.push(
      stroke3(
        [
          [x - 2.4, -0.2, 132.6],
          [x + 2.4, -0.2, 132.6],
        ],
        "mid",
        { group: "sheet" },
      ),
    );
  }

  faces.push(
    stroke3(
      [
        [-40, -0.3, 142],
        [-14, -0.3, 142],
      ],
      "hi",
      { group: "sheet" },
    ),
    stroke3(
      [
        [-40, -0.3, 147],
        [-24, -0.3, 147],
      ],
      "mid",
      { group: "sheet" },
    ),
  );
  faces.push(
    stroke3(
      [
        [18, -0.3, 144],
        [38, -0.3, 144],
      ],
      "lo",
      { group: "sheet" },
    ),
    stroke3(
      [
        [18, -0.3, 144],
        [24, -0.3, 137],
        [30, -0.3, 144],
        [34, -0.3, 140],
        [38, -0.3, 144],
      ],
      "lo",
      { group: "sheet" },
    ),
  );

  const [mx, my] = iso(21, -0.4, 96.5);
  faces.push(
    face2(ellipse2(mx, my, 7.6, 7.2, 24), {
      fill: false,
      tone: "hi",
      group: "marker",
    }),
    face2(ellipse2(mx, my, 1.7, 1.7, 14), { tone: "hi", group: "marker" }),
  );

  for (let index = 0; index < 8; index += 1) {
    const x = -39 + index * 11;
    const [bx, by] = iso(x, 0, 150.5);
    faces.push(
      face2(ellipse2(bx, by, 3.1, 4.4, 16), {
        fill: false,
        tone: "mid",
      }),
    );
  }
  faces.push(
    tube(
      [
        [0, 0, 152],
        [0, 0, 161],
      ],
      1.4,
      { tone: "lo" },
    ),
    ...ring(0, 0, 166, 5.2, 1.3, "xz", { tone: "mid" }),
  );

  return faces;
}

export const calendar: PrototypeMeta = {
  slug: "calendar",
  name: "Calendar",
  component: "Calendar",
  object: "Wall planner",
  story:
    "The planner breathes on its binding while the marked date lifts from the grid.",
  note: "A month is seen all at once: one flat sheet holds every day.",
  scene: figureScene({
    slug: "calendar",
    name: "Calendar",
    component: "Inputs",
    object: "Wall planner",
    description:
      "A hanging wall planner: bound monthly grid, header block and one circled date.",
    aria:
      "An isometric wall planner hanging from a loop, with a bound monthly grid, a header and one circled date.",
    faces: calendarFaces(),
    motions: [
      {
        group: "sheet",
        kind: "sway",
        period: 4400,
        amount: 0.8,
        pivot: [0, 0, 150],
      },
      { group: "marker", kind: "breathe", period: 2400, amount: 0.14 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* Video Player — film projector                                              */
/* -------------------------------------------------------------------------- */

function videoPlayerFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  for (const [x, y] of [
    [-32, -16],
    [24, -16],
    [-32, 16],
    [24, 16],
  ]) {
    faces.push(...box(x, y, 0, 8, 8, 6, { r: 1.5 }));
  }

  /* Reels first, behind the body. They sit apart so both read as wheels. */
  const reel = (cx: number, group: string) => {
    faces.push(
      ...ring(cx, 0, 63, 17, 4.4, "xz", { group }),
      disc3(cx, 0, 63, 5.2, "xz", { tone: "mid", group }),
    );
    for (let index = 0; index < 4; index += 1) {
      const a = (index / 4) * Math.PI * 2 + 0.35;
      faces.push(
        tube(
          [
            [cx, 0, 63],
            [cx + Math.cos(a) * 16, 0, 63 + Math.sin(a) * 16],
          ],
          1.3,
          { tone: "lo", group },
        ),
      );
    }
  };
  reel(-26, "reelA");
  reel(26, "reelB");
  faces.push(
    tube(
      [
        [-26, 0, 84],
        [-10, 0, 87],
        [10, 0, 87],
        [26, 0, 84],
      ],
      1.2,
      { tone: "lo" },
    ),
  );

  /* Body, grille and a small crank. */
  faces.push(...box(-42, -22, 6, 84, 44, 38, { r: 5, lip: true }));
  for (const z of [15, 19, 23, 27]) {
    faces.push(
      stroke3(
        [
          [-32, 22, z],
          [4, 22, z],
        ],
        "lo",
      ),
    );
  }
  faces.push(
    ...cylinder(-22, 22, 20, 5, 5, 5, { tone: "mid", topTone: "lo" }),
    tube(
      [
        [-38, 22, 10],
        [-38, 26, 10],
        [-38, 26, 20],
      ],
      2,
      { tone: "mid" },
    ),
  );

  /* Lens barrel and a short beam. */
  faces.push(
    tube(
      [
        [40, 12, 40],
        [56, 12, 40],
      ],
      13,
      { tone: "edge" },
    ),
    disc3(56, 12, 40, 8.5, "yz", { tone: "edge", group: "lens" }),
    disc3(56.4, 12, 40, 5.6, "yz", { tone: "lo", group: "lens" }),
    disc3(56.8, 12, 40, 1.8, "yz", { tone: "hi", group: "lens" }),
  );
  const [lx, ly] = iso(56, 12, 40);
  faces.push(
    face2(
      [
        [lx + 8, ly - 2],
        [lx + 76, ly - 26],
        [lx + 76, ly + 22],
        [lx + 8, ly + 3],
      ],
      { fill: false, tone: "lo", group: "beam" },
    ),
    face2(star2(lx + 66, ly - 2, 6, 2, 4, 0), {
      fill: false,
      tone: "hi",
      group: "beam",
    }),
  );

  return faces;
}

export const videoPlayer: PrototypeMeta = {
  slug: "video-player",
  name: "Video Player",
  component: "Video Player",
  object: "Film projector",
  story:
    "Both reels turn, the shutter ticks and the lens catches the light for a moment.",
  note: "Moving pictures come from a machine you can watch working.",
  scene: figureScene({
    slug: "video-player",
    name: "Video Player",
    component: "Media",
    object: "Film projector",
    description:
      "A film projector: two spoked reels, a vented body, a lens barrel and a short light cone.",
    aria:
      "An isometric film projector with two spoked reels, a vented body, a lens and a short cone of light.",
    faces: videoPlayerFaces(),
    motions: [
      { group: "reelA", kind: "spin", period: 2900, amount: 360, pivot: [-26, 0, 63] },
      { group: "reelB", kind: "spin", period: 2200, amount: 360, pivot: [26, 0, 63] },
      { group: "lens", kind: "breathe", period: 2200, amount: 0.035 },
      { group: "beam", kind: "flicker", period: 1500, amount: 0.1 },
    ],
    press: 1.2,
  }),
};

/* -------------------------------------------------------------------------- */
/* Chat — tin-can telephone                                                   */
/* -------------------------------------------------------------------------- */

function chatFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const leftX = -64;
  const rightX = 64;

  faces.push(
    tube(
      [
        [leftX + 16, 0, 34],
        [-24, 0, 30],
        [0, 0, 29],
        [24, 0, 30],
        [rightX - 16, 0, 34],
      ],
      1.4,
      { tone: "mid", group: "string" },
    ),
  );

  const can = (cx: number, group: string) => {
    faces.push(
      ...cylinder(cx, 0, 0, 34, 18, 18, {
        tone: "edge",
        hollow: 2.6,
        topTone: "mid",
        bottomArc: true,
        group,
      }),
      ellipse3(cx, 0, 34.2, 15.5, 15.5, { tone: "mid", group }),
    );
    for (const z of [12, 23]) {
      const band: Point3[] = [];
      for (let index = 0; index <= 14; index += 1) {
        const a = -0.18 + (index / 14) * Math.PI * 0.72;
        band.push([cx + Math.cos(a) * 18.2, Math.sin(a) * 18.2, z]);
      }
      faces.push(stroke3(band, "lo", { group }));
    }
  };
  can(leftX, "canA");
  can(rightX, "canB");

  for (const [x, group] of [
    [leftX + 16, "canA"],
    [rightX - 16, "canB"],
  ] as const) {
    const [kx, ky] = iso(x, 0, 34);
    faces.push(
      face2(ellipse2(kx, ky, 3.1, 3.1, 18), {
        fill: false,
        tone: "hi",
        group,
      }),
    );
  }

  const [wx, wy] = iso(rightX + 22, 0, 29);
  for (let index = 0; index < 3; index += 1) {
    faces.push(
      face2(
        [
          [wx + index * 4, wy - 10 - index * 3],
          [wx + 11 + index * 4, wy - 1],
          [wx + index * 4, wy + 8 + index * 3],
        ],
        { fill: false, tone: "lo", group: "waves" },
      ),
    );
  }

  return faces;
}

export const chat: PrototypeMeta = {
  slug: "chat",
  name: "Chat",
  component: "Chat",
  object: "Tin-can telephone",
  story:
    "The string shivers, one can answers with a small bounce and the sound rings out.",
  note: "A conversation is a direct line between two people, nothing in between.",
  scene: figureScene({
    slug: "chat",
    name: "Chat",
    component: "AI",
    object: "Tin-can telephone",
    description:
      "Two tin cans joined by a taut string, one can with three sound rings.",
    aria:
      "An isometric tin-can telephone: two ridged cans connected by a taut string, with sound rings beside one can.",
    faces: chatFaces(),
    motions: [
      { group: "string", kind: "sway", period: 1700, amount: 1.4 },
      { group: "canB", kind: "bob", period: 1700, amount: 1.6, phase: 0.5 },
      { group: "waves", kind: "breathe", period: 2200, amount: 0.055 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* Avatar — cameo brooch                                                      */
/* -------------------------------------------------------------------------- */

function avatarFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [cx, cy] = iso(0, 0, 68);
  faces.push(
    face2(ellipse2(cx, cy, 46, 58, 60), { tone: "edge", group: "cameo" }),
    face2(ellipse2(cx, cy, 38, 50, 56), { tone: "mid", group: "cameo" }),
    face2(ellipse2(cx, cy, 35, 47, 54), { tone: "lo", group: "cameo" }),
  );

  faces.push(
    face2(ellipse2(cx + 24, cy - 21, 8.4, 9.4, 28), {
      tone: "edge",
      group: "cameo",
    }),
  );
  const profile: Point2[] = [
    [cx - 2, cy - 37],
    [cx - 10, cy - 35],
    [cx - 17, cy - 30],
    [cx - 21, cy - 23],
    [cx - 21, cy - 17],
    [cx - 26, cy - 12],
    [cx - 21, cy - 9],
    [cx - 20, cy - 5],
    [cx - 23, cy - 2],
    [cx - 19, cy + 1],
    [cx - 17, cy + 6],
    [cx - 13, cy + 11],
    [cx - 10, cy + 17],
    [cx - 9, cy + 24],
    [cx - 14, cy + 31],
    [cx - 2, cy + 35],
    [cx + 14, cy + 35],
    [cx + 22, cy + 31],
    [cx + 20, cy + 24],
    [cx + 16, cy + 18],
    [cx + 17, cy + 8],
    [cx + 23, cy + 0],
    [cx + 24, cy - 10],
    [cx + 20, cy - 22],
    [cx + 12, cy - 32],
  ];
  faces.push(face2(profile, { tone: "edge", group: "cameo" }));
  faces.push(
    stroke2(
      [
        [cx + 17, cy - 31],
        [cx + 23, cy - 28],
        [cx + 28, cy - 21],
      ],
      "mid",
      { group: "cameo" },
    ),
    stroke2(
      [
        [cx - 9, cy + 1],
        [cx - 5, cy + 2],
      ],
      "mid",
      { group: "cameo" },
    ),
    stroke2(
      [
        [cx - 8, cy + 30],
        [cx + 18, cy + 30],
      ],
      "lo",
      { group: "cameo" },
    ),
  );
  const [ex, ey] = iso(0, 0, 68);
  faces.push(
    face2(ellipse2(ex + 7, ey - 8, 2.2, 2.2, 14), {
      tone: "hi",
      group: "shine",
    }),
  );

  for (let index = 0; index < 14; index += 1) {
    const a = (index / 14) * Math.PI * 2;
    faces.push(
      face2(
        ellipse2(
          cx + Math.cos(a) * 41.5,
          cy + Math.sin(a) * 53,
          1.2,
          1.2,
          10,
        ),
        { tone: "lo", group: "cameo" },
      ),
    );
  }

  faces.push(
    stroke2(
      [
        [cx - 18, cy + 61],
        [cx + 16, cy + 61],
        [cx + 22, cy + 57],
      ],
      "mid",
    ),
    stroke2(
      [
        [cx + 22, cy + 57],
        [cx + 18, cy + 53],
      ],
      "lo",
    ),
  );

  return faces;
}

export const avatar: PrototypeMeta = {
  slug: "avatar",
  name: "Avatar",
  component: "Avatar",
  object: "Cameo brooch",
  story:
    "The cameo turns in its setting and a highlight travels across the glass profile.",
  note: "An avatar is an identity reduced to a small, worn token.",
  scene: figureScene({
    slug: "avatar",
    name: "Avatar",
    component: "Media",
    object: "Cameo brooch",
    description:
      "An oval cameo brooch with a decorative rim, a profile in relief and a pin at the back.",
    aria:
      "An isometric cameo brooch: an oval rimmed setting holding a profile in relief, with a pin behind.",
    faces: avatarFaces(),
    motions: [
      { group: "cameo", kind: "sway", period: 4200, amount: 2.2 },
      { group: "shine", kind: "lift", period: 3600, amount: 5 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* Slider — trombone                                                          */
/* -------------------------------------------------------------------------- */

function sliderFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const arc = (cx: number, cy: number, cz: number, r: number) => {
    const points: Point3[] = [];
    for (let index = 0; index <= 20; index += 1) {
      const a = Math.PI / 2 + (index / 20) * Math.PI;
      points.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, cz]);
    }
    return points;
  };

  /* Outer slide and its U-bow at the far end. The two tubes are far enough
     apart to stay distinct at 64 px. */
  faces.push(
    tube(
      [
        [-78, -12, 38],
        [8, -12, 38],
      ],
      2.6,
      { tone: "edge", group: "slide" },
    ),
    tube(
      [
        [-78, 12, 38],
        [8, 12, 38],
      ],
      2.6,
      { tone: "edge", group: "slide" },
    ),
    tube(arc(-78, 0, 38, 12), 2.6, { tone: "edge", group: "slide" }),
  );

  /* Inner slide, nested above and slightly forward. */
  faces.push(
    tube(
      [
        [-42, -12, 44],
        [44, -12, 44],
      ],
      2.4,
      { tone: "mid", group: "slide" },
    ),
    tube(
      [
        [-42, 12, 44],
        [44, 12, 44],
      ],
      2.4,
      { tone: "mid", group: "slide" },
    ),
    tube(arc(-42, 0, 44, 12), 2.4, { tone: "mid", group: "slide" }),
    tube(
      [
        [-30, -12, 44],
        [-30, 12, 44],
      ],
      1.8,
      { tone: "lo", group: "slide" },
    ),
  );

  /* Mouthpiece. */
  faces.push(
    tube(
      [
        [-56, 0, 52],
        [-42, 0, 50],
      ],
      4,
      { tone: "mid", group: "slide" },
    ),
    disc3(-57, 0, 52, 4.5, "yz", { tone: "edge", group: "slide" }),
    disc3(-57.2, 0, 52, 2.5, "yz", { tone: "lo", group: "slide" }),
  );

  /* Bell: a flared horn that lifts away from the slide, seen from the side so
     its silhouette reads as a bell rather than a flat disc. */
  const bellA: Point3 = [54, 0, 54];
  const bellB: Point3 = [68, 0, 102];
  const axis: Point3 = [
    bellB[0] - bellA[0],
    bellB[1] - bellA[1],
    bellB[2] - bellA[2],
  ];
  const perp: Point3 = [-0.96, 0, 0.28];
  const radiusAt = (t: number) => 5 + 29 * Math.pow(t, 2.1);
  const topEdge: Point3[] = [];
  const bottomEdge: Point3[] = [];
  for (let index = 0; index <= 12; index += 1) {
    const t = index / 12;
    const r = radiusAt(t);
    const cx = bellA[0] + axis[0] * t;
    const cz = bellA[2] + axis[2] * t;
    topEdge.push([cx + perp[0] * r, 0, cz + perp[2] * r]);
    bottomEdge.push([cx - perp[0] * r, 0, cz - perp[2] * r]);
  }
  faces.push(
    tube(
      [
        [44, 0, 48],
        [54, 0, 54],
      ],
      5.2,
      { tone: "edge", group: "bell" },
    ),
    face3([...topEdge, ...bottomEdge.slice().reverse()], {
      tone: "edge",
      group: "bell",
    }),
  );

  const rimPoints: Point2[] = [];
  const throatPoints: Point2[] = [];
  const corePoints: Point2[] = [];
  const R = 34;
  for (let index = 0; index < 44; index += 1) {
    const a = (index / 44) * Math.PI * 2;
    const along = Math.cos(a);
    const across = Math.sin(a);
    const at = (r: number) =>
      iso(
        bellB[0] + perp[0] * along * r,
        across * r,
        bellB[2] + perp[2] * along * r,
      );
    rimPoints.push(at(R));
    throatPoints.push(at(R - 8));
    corePoints.push(at(R - 16));
  }
  faces.push(
    face2(rimPoints, { tone: "hi", group: "bell" }),
    face2(throatPoints, { fill: false, tone: "lo", group: "bell" }),
    face2(corePoints, { fill: false, tone: "lo", group: "bell" }),
    stroke2(
      topEdge.map(([x, y, z]) => iso(x, y, z)),
      "mid",
      { group: "bell" },
    ),
  );

  return faces;
}

export const slider: PrototypeMeta = {
  slug: "slider",
  name: "Slider",
  component: "Slider",
  object: "Trombone slide",
  story:
    "The slide pulls out on its tubes, the brace holds and the bell answers with a small nod.",
  note: "A slider is a value on a straight travel: you see exactly how far it has moved.",
  scene: figureScene({
    slug: "slider",
    name: "Slider",
    component: "Controls",
    object: "Trombone slide",
    description:
      "A trombone: long parallel slide tubes, a brace, a mouthpiece and a flared bell.",
    aria:
      "An isometric trombone with long slide tubes, a brace, a mouthpiece and a wide flared bell.",
    faces: sliderFaces(),
    motions: [
      { group: "slide", kind: "sway", period: 2500, amount: 1.8 },
      { group: "bell", kind: "breathe", period: 2800, amount: 0.022 },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* Cake — generic object                                                      */
/* -------------------------------------------------------------------------- */

function cakeFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  faces.push(
    ...cylinder(0, 0, 0, 24, 46, 46, { tone: "edge", bottomArc: true }),
    ...cylinder(0, 0, 24, 4, 48, 48, { tone: "mid", topTone: "lo" }),
    ...cylinder(0, 0, 28, 22, 35, 35, { tone: "edge" }),
    ...cylinder(0, 0, 50, 4, 37, 37, { tone: "mid", topTone: "lo" }),
    ...cylinder(0, 0, 54, 22, 24, 24, { tone: "edge" }),
    ...cylinder(0, 0, 76, 4, 26, 26, { tone: "mid", topTone: "lo" }),
  );

  /* Frosting drips: one scalloped edge per tier, just under its band, so the
     icing reads as a continuous drip rather than a row of separate shapes. */
  const dripEdge = (radius: number, z: number, lobes: number) => {
    const points: Point2[] = [];
    const from = -0.18;
    const to = Math.PI * 0.72;
    const steps = 64;
    for (let index = 0; index <= steps; index += 1) {
      const t = index / steps;
      const a = from + (to - from) * t;
      const dip = Math.pow(Math.abs(Math.sin(t * Math.PI * lobes)), 0.75);
      points.push(
        iso(
          Math.cos(a) * radius,
          Math.sin(a) * radius,
          z - 1.2 - 3.8 * dip,
        ),
      );
    }
    faces.push(stroke2(points, "lo"));
  };
  dripEdge(46, 24, 10);
  dripEdge(35, 50, 8);
  dripEdge(24, 76, 6);

  /* A few sprinkles on the top tier. The frostings already own their top
     edges, so no extra full ellipse is drawn over the upper tiers. */
  const sprinkles: Array<[number, number, number, number]> = [
    [-18, -6, 3, 0.7],
    [4, 10, 4, -0.8],
    [14, -12, 3, 0.4],
    [-6, 14, 4, 1.1],
    [20, 4, 3, -0.2],
  ];
  for (const [x, y, w, a] of sprinkles) {
    const [sx, sy] = iso(x, y, 80.4);
    faces.push(
      stroke2(
        [
          [sx - Math.cos(a) * w, sy - Math.sin(a) * w],
          [sx + Math.cos(a) * w, sy + Math.sin(a) * w],
        ],
        "mid",
        { group: "sprinkles" },
      ),
    );
  }

  const candles: Array<[number, number]> = [
    [-16, 0],
    [0, 7],
    [16, -5],
  ];
  candles.forEach(([x, y]) => {
    faces.push(
      tube(
        [
          [x, y, 80],
          [x, y, 93],
        ],
        3.4,
        { tone: "edge" },
      ),
      stroke3(
        [
          [x, y, 93],
          [x, y, 95],
        ],
        "hi",
      ),
    );
    const [fx, fy] = iso(x, y, 98);
    faces.push(
      face2(
        [
          [fx - 2.6, fy + 3],
          [fx - 1.2, fy - 1],
          [fx, fy - 6],
          [fx + 1.2, fy - 1],
          [fx + 2.6, fy + 3],
        ],
        { tone: "hi", group: "flames" },
      ),
    );
  });

  return faces;
}

export const cake: PrototypeMeta = {
  slug: "cake",
  name: "Cake",
  component: "Object",
  object: "Layer cake with candles",
  story:
    "Three candles flicker and the top tier settles a hair under their warmth.",
  note: "A generic object: a layer cake drawn as a cake, not as a rounded tile.",
  scene: figureScene({
    slug: "cake",
    name: "Cake",
    component: "Objects",
    object: "Layer cake with candles",
    description:
      "A three-tier layer cake with piped frosting drips, sprinkles and three lit candles.",
    aria:
      "An isometric three-tier layer cake with frosting drips, sprinkles and three candles with flickering flames.",
    faces: cakeFaces(),
    motions: [
      { group: "flames", kind: "flicker", period: 520, amount: 0.3 },
      { group: "sprinkles", kind: "breathe", period: 4200, amount: 0.02 },
      { kind: "breathe", period: 6400, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* Coffee cup — generic object                                                */
/* -------------------------------------------------------------------------- */

function coffeeCupFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  faces.push(
    ...cylinder(0, 0, 0, 3, 44, 44, { tone: "mid", topTone: "lo" }),
    ellipse3(0, 0, 3.2, 29, 29, { fill: false, tone: "lo" }),
  );

  faces.push(
    ...cylinder(0, 0, 3, 32, 20, 27, {
      tone: "edge",
      hollow: 3,
      bottomArc: true,
      group: "cup",
    }),
    ...ring(30, 0, 20, 11, 3.2, "xz", { group: "cup" }),
    ellipse3(0, 0, 35.2, 27, 27, { fill: false, tone: "lo", group: "cup" }),
  );
  const rimHi: Point3[] = [];
  for (let index = 0; index <= 10; index += 1) {
    const a = -0.42 + (index / 10) * 0.84;
    rimHi.push([Math.cos(a) * 27, Math.sin(a) * 27, 35.4]);
  }
  faces.push(stroke3(rimHi, "hi", { group: "cup" }));
  faces.push(
    face2(ellipse2(iso(0, 0, 32)[0], iso(0, 0, 32)[1], 24, 24, 40), {
      tone: "mid",
      group: "cup",
    }),
  );

  const [sx, sy] = iso(0, 0, 32);
  faces.push(
    face2(ellipse2(sx, sy, 8, 8, 26), {
      fill: false,
      tone: "lo",
      group: "cup",
    }),
  );

  const steam = (phase: number, x0: number): Point3[] => {
    const points: Point3[] = [];
    for (let index = 0; index <= 16; index += 1) {
      const t = index / 16;
      points.push([
        x0 + 5 * Math.sin(t * Math.PI * 3 + phase),
        0,
        42 + 32 * t,
      ]);
    }
    return points;
  };
  faces.push(
    tube(steam(0, -18), 1.3, { tone: "lo", group: "steam" }),
    tube(steam(Math.PI, 10), 1.3, { tone: "lo", group: "steam" }),
  );

  return faces;
}

export const coffeeCup: PrototypeMeta = {
  slug: "coffee-cup",
  name: "Coffee Cup",
  component: "Object",
  object: "Cup with a handle and steam",
  story:
    "The steam curls, the cup lifts a hair off its saucer and the handle catches the light.",
  note: "A generic object: the archetypal hot drink, readable at a glance.",
  scene: figureScene({
    slug: "coffee-cup",
    name: "Coffee Cup",
    component: "Objects",
    object: "Cup with a handle and steam",
    description:
      "A coffee cup on a saucer with a handle, a crema swirl and two rising ribbons of steam.",
    aria:
      "An isometric coffee cup on a saucer with a handle, a crema swirl and two ribbons of steam.",
    faces: coffeeCupFaces(),
    motions: [
      { group: "steam", kind: "sway", period: 3000, amount: 2.1 },
      { group: "cup", kind: "lift", period: 3600, amount: 1.4 },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */

export const prototypes: PrototypeMeta[] = [
  toast,
  status,
  spinner,
  safari,
  generatedImage,
  calendar,
  videoPlayer,
  chat,
  avatar,
  slider,
  cake,
  coffeeCup,
];

export const prototypeBySlug = new Map(prototypes.map((item) => [item.slug, item]));

