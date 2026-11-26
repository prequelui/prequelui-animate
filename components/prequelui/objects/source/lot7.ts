/*
 * Linear v4 — lot 7 (components 151 to 175 of the object catalogue).
 *
 * Same rules as lots 1-6: one real-world object per component, authored from
 * scratch in the shared 2:1 axonometric space, no slab under the object and a
 * silhouette that still reads at 64 px. Faces are painted back to front and
 * filled with the plate tone, so a nearer face hides the construction behind
 * it while the 0.9 px outline stays clean.
 *
 * Every object here is new to the catalogue: a revolving card rack, a signpost
 * cluster, a bingo cage, organ stop knobs, a sandbox, a patch panel, a
 * turnstile, a test-tube rack, a field notebook, a chess clock, branching
 * coral, a printer's type case, a diorama box, a geological core, a valve
 * manifold, nested measuring cups, a paper plane, an audio guide, a sparkler,
 * a quotation card, a telephone keypad plate, a railway fork, a scroll, a
 * mixing console and a gear stick.
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
function sheet(
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

/** Horizontal drum along y, with the near end cap and an engraved rim. */
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

/** A flat card tangent to a vertical axis, used for revolving racks. */
function radialCard(
  angle: number,
  radius: number,
  z0: number,
  z1: number,
  halfWidth: number,
  opts: FaceOptions = {},
): FigureFace {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const at = (t: number, z: number): Point3 => [
    ca * radius - sa * t,
    sa * radius + ca * t,
    z,
  ];
  return face3(
    [at(-halfWidth, z0), at(halfWidth, z0), at(halfWidth, z1), at(-halfWidth, z1)],
    opts,
  );
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
    face2(
      circle(b[0], b[1], r1, steps),
      { tone: opts.tone ?? "mid", group: opts.group },
    ),
  ];
}

/* -------------------------------------------------------------------------- */
/* 151. Marquee 3D — revolving card rack                                      */
/* -------------------------------------------------------------------------- */

function marquee3dFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Cast foot and a slim centre post: the rack owns its own stand. */
  faces.push(
    ...cylinder(0, 0, 0, 6, 15, 12, {
      tone: "edge",
      topTone: "mid",
      group: "rack",
    }),
  );
  faces.push(post(0, 0, 6, 112, 3.4, "edge", "rack"));

  const tiers = [30, 60, 90];
  const angles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];

  for (const z of tiers) {
    /* Four arms per tier, then the cards sorted back to front. */
    const units = angles
      .map((a) => ({
        a,
        score: Math.cos(a) + Math.sin(a),
      }))
      .sort((m, n) => m.score - n.score);

    for (const unit of units) {
      faces.push(
        tube(
          [
            [Math.cos(unit.a) * 6, Math.sin(unit.a) * 6, z + 8],
            [Math.cos(unit.a) * 30, Math.sin(unit.a) * 30, z + 8],
          ],
          1.7,
          { tone: "mid", group: "cards" },
        ),
      );
    }
    for (const unit of units) {
      const front = unit.score > 0.2;
      faces.push(
        radialCard(unit.a, 29, z, z + 25, 9.5, {
          tone: front ? "mid" : "edge",
          group: "cards",
        }),
        radialCard(unit.a, 29.3, z + 6, z + 19.5, 6.2, {
          tone: "lo",
          group: "cards",
        }),
      );
      const ca = Math.cos(unit.a);
      const sa = Math.sin(unit.a);
      const lineAt = (t: number, zz: number): Point3 => [
        ca * 29.5 - sa * t,
        sa * 29.5 + ca * t,
        zz,
      ];
      for (const zz of [z + 2.6, z + 4.4]) {
        faces.push(
          stroke3(
            [lineAt(-6, zz), lineAt(6, zz)],
            "lo",
            { group: "cards" },
          ),
        );
      }
      if (unit.score > 0.9) {
        faces.push(
          stroke3(
            [lineAt(-6, z + 3.4), lineAt(2, z + 3.4)],
            "hi",
            { group: "cards" },
          ),
        );
      }
    }
  }

  /* Header board and its bracket at the very top. */
  faces.push(
    ...box(-25, -4, 112, 50, 8, 24, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "sign",
    }),
    stroke3(
      [
        [-16, 0.1, 127],
        [12, 0.1, 127],
      ],
      "hi",
      { group: "sign" },
    ),
    stroke3(
      [
        [-16, 0.1, 121],
        [7, 0.1, 121],
      ],
      "lo",
      { group: "sign" },
    ),
    stroke3(
      [
        [-16, 0.1, 116.8],
        [18, 0.1, 116.8],
      ],
      "lo",
      { group: "sign" },
    ),
    ...ball(0, 0, 138, 4.2, { tone: "mid", group: "sign" }),
  );

  return faces;
}

export const marquee3d: PrototypeMeta = {
  slug: "marquee-3d",
  name: "Marquee 3D",
  component: "Marquee 3D",
  object: "Revolving card rack",
  story:
    "The card carousel turns a step and the leading card comes square to the reader.",
  note: "A 3D marquee is a rack of cards on an axis: the same faces return in depth.",
  scene: figureScene({
    slug: "marquee-3d",
    name: "Marquee 3D",
    component: "Effects",
    object: "Revolving card rack",
    description:
      "A shop card rack on a cast foot: a central post, three tiers of four arms and twelve picture cards, with a header board on top.",
    aria:
      "An isometric revolving card rack with a cast foot, a centre post, three tiers of cards on radial arms and a header board.",
    faces: marquee3dFaces(),
    motions: [
      { group: "cards", kind: "spin", period: 4200, amount: 360, pivot: [0, 0, 64] },
      { group: "sign", kind: "sway", period: 3600, amount: 0.045, pivot: [0, 0, 112] },
      { group: "rack", kind: "breathe", period: 5200, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 152. Navigation Menu — signpost cluster                                    */
/* -------------------------------------------------------------------------- */

function signBoard(
  dir: "x+" | "x-" | "y+" | "y-",
  z: number,
  length: number,
  width: number,
  height: number,
  opts: FaceOptions,
): FigureFace[] {
  const half = width / 2;
  const tip = Math.max(6, length * 0.18);
  let footprint: Point2[];
  let textLine: (t: number, zz: number) => [Point3, Point3];

  if (dir === "x+") {
    footprint = [
      [3, -half],
      [3 + length - tip, -half],
      [3 + length, 0],
      [3 + length - tip, half],
      [3, half],
    ];
    textLine = (t, zz) => [
      [8, half + 0.2, zz],
      [8 + t, half + 0.2, zz],
    ];
  } else if (dir === "x-") {
    footprint = [
      [-3, -half],
      [-3 - length + tip, -half],
      [-3 - length, 0],
      [-3 - length + tip, half],
      [-3, half],
    ];
    textLine = (t, zz) => [
      [-8, half + 0.2, zz],
      [-8 - t, half + 0.2, zz],
    ];
  } else if (dir === "y+") {
    footprint = [
      [-half, 3],
      [-half, 3 + length - tip],
      [0, 3 + length],
      [half, 3 + length - tip],
      [half, 3],
    ];
    textLine = (t, zz) => [
      [half + 0.2, 8, zz],
      [half + 0.2, 8 + t, zz],
    ];
  } else {
    footprint = [
      [-half, -3],
      [-half, -3 - length + tip],
      [0, -3 - length],
      [half, -3 - length + tip],
      [half, -3],
    ];
    textLine = (t, zz) => [
      [half + 0.2, -8, zz],
      [half + 0.2, -8 - t, zz],
    ];
  }

  const faces = prism(footprint, z, height, {
    tone: "edge",
    topTone: "mid",
    group: opts.group,
  });

  const textZ = z + height * 0.62;
  faces.push(
    face3(textLine(length * 0.55, textZ), {
      fill: false,
      tone: opts.tone ?? "lo",
      group: opts.group,
    }),
  );
  faces.push(
    face3(textLine(length * 0.34, textZ - 5), {
      fill: false,
      tone: "lo",
      group: opts.group,
    }),
  );
  return faces;
}

function navigationMenuFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 5, 9, 6, { tone: "edge", topTone: "mid" }),
    ...cylinder(0, 0, 5, 118, 4.6, 3.4, {
      tone: "edge",
      topTone: "mid",
    }),
    ...ball(0, 0, 126, 4.4, { tone: "mid" }),
  );

  const boards: Array<{
    dir: "x+" | "x-" | "y+" | "y-";
    z: number;
    length: number;
    group: string;
    tone: DetailTone;
  }> = [
    { dir: "y-", z: 22, length: 44, group: "sign-0", tone: "lo" },
    { dir: "x-", z: 50, length: 52, group: "sign-1", tone: "lo" },
    { dir: "y+", z: 78, length: 48, group: "sign-2", tone: "lo" },
    { dir: "x+", z: 104, length: 58, group: "sign-3", tone: "hi" },
  ];

  for (const board of boards) {
    faces.push(
      ...signBoard(board.dir, board.z, board.length, 9, 17, {
        group: board.group,
        tone: board.tone,
      }),
      ...cylinder(0, 0, board.z + 3, 11, 5.4, 5.4, {
        tone: "mid",
        topTone: "lo",
        group: board.group,
      }),
    );
  }

  return faces;
}

export const navigationMenu: PrototypeMeta = {
  slug: "navigation-menu",
  name: "Navigation Menu",
  component: "Navigation Menu",
  object: "Signpost cluster",
  story:
    "The top board leans forward on its bracket and points the way; the others hold their bearings.",
  note: "A navigation menu is a cluster of signs on one mast: several destinations read at once.",
  scene: figureScene({
    slug: "navigation-menu",
    name: "Navigation Menu",
    component: "Navigation",
    object: "Signpost cluster",
    description:
      "A wooden signpost with four arrow boards at different heights and bearings, each mounted on a collar around the mast.",
    aria:
      "An isometric signpost cluster: four pointing boards around a single mast with a ball finial, the top board bright.",
    faces: navigationMenuFaces(),
    motions: [
      { group: "sign-0", kind: "sway", period: 3400, amount: 0.03, pivot: [0, 0, 22] },
      { group: "sign-1", kind: "sway", period: 4200, amount: 0.032, pivot: [0, 0, 50] },
      { group: "sign-2", kind: "sway", period: 3800, amount: 0.038, pivot: [0, 0, 78] },
      { group: "sign-3", kind: "sway", period: 2600, amount: 0.05, pivot: [0, 0, 104] },
      { kind: "breathe", period: 5600, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 153. Questionnaire — bingo cage                                            */
/* -------------------------------------------------------------------------- */

function questionnaireFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const cz = 64;
  const R = 31;

  /* Stand: a cast base, two uprights and the axle. The stand is the machine. */
  faces.push(
    ...box(-36, -24, 0, 72, 48, 7, {
      r: 5,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
    post(-34, 0, 7, cz, 5, "edge"),
    post(34, 0, 7, cz, 5, "edge"),
    ...tapered([-34, 0, cz], [34, 0, cz], 2.2, 2.2, { tone: "mid" }),
    ...drumX(-40, -34, 0, cz + 6, 8, { tone: "mid", topTone: "lo" }, 20),
    ...drumX(34, 40, 0, cz + 6, 8, { tone: "mid", topTone: "lo" }, 20),
  );

  /* The wire sphere: two meridian hoops and five horizontal rings. */
  faces.push(
    face2(circleXZ(0, 0, cz, R, 44), {
      fill: false,
      tone: "edge",
      group: "cage",
    }),
    face2(circleYZ(0, 0, cz, R, 44), {
      fill: false,
      tone: "edge",
      group: "cage",
    }),
  );
  for (const z of [40, 52, 64, 76, 88]) {
    const r = Math.sqrt(Math.max(1, R * R - (z - cz) * (z - cz)));
    faces.push(
      face2(circleXZ(0, 0, z, r, 40), {
        fill: false,
        tone: "mid",
        group: "cage",
      }),
    );
  }
  /* A few tilted wires break the perfect sphere and read at small sizes. */
  for (const angle of [0.55, 2.1]) {
    const points: Point2[] = [];
    for (let index = 0; index < 40; index += 1) {
      const a = (index / 40) * TAU;
      const x = Math.cos(a) * R;
      const z = Math.sin(a) * R;
      points.push(
        iso(x, Math.cos(angle) * Math.sin(a) * R * 0.5, cz + z),
      );
    }
    faces.push(face2(points, { fill: false, tone: "lo", group: "cage" }));
  }

  /* Numbered balls inside, the nearest one bright. */
  const balls: Array<[number, number, number, number, DetailTone]> = [
    [-12, -4, 58, 5.4, "mid"],
    [9, 6, 66, 5, "mid"],
    [0, -8, 74, 4.6, "mid"],
    [15, -2, 52, 4.4, "hi"],
  ];
  for (const [x, y, z, r, tone] of balls) {
    const [bx, by] = iso(x, y, z);
    faces.push(
      face2(circle(bx, by, r, 20), { tone, group: "balls" }),
      face2(circle(bx - r * 0.2, by - r * 0.2, r * 0.3, 12), {
        tone: "lo",
        group: "balls",
      }),
    );
  }

  /* Crank on the right end of the axle. */
  faces.push(
    tube(
      [
        [34, 0, cz],
        [48, 0, cz],
        [48, 0, cz + 14],
      ],
      3,
      { tone: "edge", group: "crank" },
    ),
    ...drumY(8, 16, 48, cz + 14, 5.4, {
      tone: "mid",
      topTone: "lo",
      group: "crank",
    }, 18),
  );

  /* Chute from the bottom of the cage to a small tray. */
  const chute: Point3[] = [
    [0, 8, 34],
    [0, 18, 27],
    [0, 30, 16],
    [0, 42, 11],
  ];
  faces.push(
    tube(chute, 8, { tone: "edge", group: "chute" }),
    tube(chute, 1.2, { tone: "lo", group: "chute", fill: false }),
    ...box(-17, 38, 4, 34, 18, 4, {
      r: 3,
      tone: "edge",
      topTone: "mid",
      group: "chute",
    }),
  );
  for (const side of [-4.6, 4.6]) {
    faces.push(
      tube(
        chute.map(([x, y, z]) => [x + side, y, z + 1.4] as Point3),
        1.4,
        { tone: "mid", group: "chute" },
      ),
    );
  }
  for (const x of [-13, 13]) {
    faces.push(
      ...cylinder(x, 46, 0, 4, 2.8, 2.4, {
        tone: "mid",
        topTone: "lo",
        group: "chute",
      }),
    );
  }
  faces.push(
    post(0, 8, 26, 33, 2.2, "mid", "chute"),
    ...ball(0, 46, 12, 4.6, { tone: "hi", group: "drawn" }),
  );

  return faces;
}

export const questionnaire: PrototypeMeta = {
  slug: "questionnaire",
  name: "Questionnaire",
  component: "Questionnaire",
  object: "Bingo cage",
  story:
    "The cage turns on its axle, the balls tumble and one rolls down the chute into the tray.",
  note: "A questionnaire draws questions one at a time from a common pool, like numbers from a cage.",
  scene: figureScene({
    slug: "questionnaire",
    name: "Questionnaire",
    component: "Inputs",
    object: "Bingo cage",
    description:
      "A bingo cage on a cast stand: a wire sphere full of numbered balls, a side crank and a chute leading to a small tray.",
    aria:
      "An isometric bingo cage with a wire sphere, four balls, a crank and a chute that drops one bright ball into a tray.",
    faces: questionnaireFaces(),
    motions: [
      { group: "cage", kind: "spin", period: 4200, amount: 360, pivot: [0, 0, 64] },
      { group: "balls", kind: "bob", period: 1700, amount: 1.8 },
      { group: "drawn", kind: "breathe", period: 2400, amount: 0.06 },
      { group: "crank", kind: "sway", period: 2800, amount: 0.2, pivot: [34, 0, 64] },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 154. Radio Group — organ stop knobs                                        */
/* -------------------------------------------------------------------------- */

function radioGroupFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The stop jamb: a solid board with two rows of drawknobs. */
  faces.push(
    ...box(-64, -8, 0, 128, 10, 74, {
      r: 2.4,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
    stroke3(
      [
        [-58, 2.2, 39],
        [58, 2.2, 39],
      ],
      "lo",
    ),
    stroke3(
      [
        [-58, 2.2, 64],
        [58, 2.2, 64],
      ],
      "lo",
    ),
  );

  const rows = [50, 24];
  const columns = [-46, -23, 0, 23, 46];
  const selected = { x: 23, z: 50 };

  for (const z of rows) {
    for (const x of columns) {
      const isSelected = x === selected.x && z === selected.z;
      const pull = isSelected ? 27 : 9;
      const group = isSelected ? "stop" : "knobs";
      faces.push(
        ...drumY(2, 5.5, x, z, 5, {
          tone: "mid",
          topTone: "lo",
          group,
        }),
        ...drumY(5.5, pull, x, z, 3.4, {
          tone: isSelected ? "edge" : "mid",
          topTone: "lo",
          group,
        }),
        disc3(x, pull + 0.4, z, 7.2, "xz", {
          tone: "mid",
          group,
        }),
        disc3(x, pull + 0.7, z, 4.6, "xz", {
          tone: "lo",
          group,
        }),
        face2(
          [
            iso(x, pull + 0.9, z),
            iso(x, pull + 0.9, z + 5.2),
          ],
          { fill: false, tone: isSelected ? "hi" : "mid", group },
        ),
      );
      if (isSelected) {
        faces.push(
          disc3(x, pull + 1, z, 8.6, "xz", {
            fill: false,
            tone: "hi",
            group,
          }),
        );
      }
      if (!isSelected) {
        faces.push(
          stroke3(
            [
              [x - 4, 2.3, z],
              [x + 4, 2.3, z],
            ],
            "lo",
          ),
        );
      }
    }
  }

  /* Brass name plates under each knob. */
  for (const z of [12, 38]) {
    for (const x of columns) {
      faces.push(
        face2(
          [
            iso(x - 7, 2.3, z),
            iso(x + 7, 2.3, z),
            iso(x + 7, 2.3, z + 3),
            iso(x - 7, 2.3, z + 3),
          ],
          { fill: false, tone: "lo" },
        ),
      );
    }
  }

  return faces;
}

export const radioGroup: PrototypeMeta = {
  slug: "radio-group",
  name: "Radio Group",
  component: "Radio Group",
  object: "Organ stop knobs",
  story:
    "One stop is drawn out of the jamb and its bright marker turns to the player; the rest stay seated.",
  note: "A radio group is a row of organ stops: one choice pulled clear while every other stays home.",
  scene: figureScene({
    slug: "radio-group",
    name: "Radio Group",
    component: "Controls",
    object: "Organ stop knobs",
    description:
      "An organ stop jamb with two rows of five drawknobs, brass name plates and one stop pulled far out with a bright marker.",
    aria:
      "An isometric organ stop jamb with two rows of wooden drawknobs and brass plates, one knob pulled out and its marker bright.",
    faces: radioGroupFaces(),
    motions: [
      { group: "stop", kind: "lift", period: 2600, amount: 2.4 },
      { group: "stop", kind: "breathe", period: 2600, amount: 0.012 },
      { group: "knobs", kind: "bob", period: 4200, amount: 0.5 },
      { kind: "breathe", period: 5600, amount: 0.003 },
    ],
    press: 0.9,
  }),
};

/* -------------------------------------------------------------------------- */
/* 155. Sandbox — sandbox with a rake                                         */
/* -------------------------------------------------------------------------- */

function sandboxFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Three walls first; the near wall is painted last so the sand reads. */
  faces.push(
    ...box(-62, -46, 0, 124, 8, 18, {
      r: 2,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-62, -38, 0, 8, 80, 18, {
      r: 2,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(54, -38, 0, 8, 80, 18, {
      r: 2,
      tone: "edge",
      topTone: "mid",
    }),
  );
  /* Sand bed, a shade lower than the planks. */
  faces.push(
    ...prism(roundedRect(-54, -38, 108, 78, 3, 3), 3, 7, {
      tone: "edge",
      topTone: "mid",
      group: "sand",
    }),
  );
  /* Raked furrows: three curved lines and one bright crest. */
  for (const [baseY, tone] of [
    [-24, "lo"],
    [-6, "lo"],
    [12, "lo"],
    [28, "hi"],
  ] as const) {
    const points: Point3[] = [];
    for (let index = 0; index <= 18; index += 1) {
      const t = index / 18;
      points.push([
        -46 + t * 92,
        baseY + Math.sin(t * Math.PI * 2.2) * 4.6,
        10.4,
      ]);
    }
    faces.push(stroke3(points, tone, { group: "sand" }));
  }
  for (const [x, y] of [
    [-30, -20],
    [12, 22],
    [36, -2],
    [-8, 6],
  ] as const) {
    faces.push(dotAt(x, y, 10.5, 1.1, "lo", "sand"));
  }

  /* The rake: a wide head in the sand, its handle leaning over the wall. */
  faces.push(
    ...box(-17, -15, 13, 32, 5, 3.4, {
      r: 1.4,
      tone: "edge",
      topTone: "mid",
      group: "rake",
    }),
  );
  for (let index = 0; index < 6; index += 1) {
    const x = -14 + index * 5.6;
    faces.push(
      tube(
        [
          [x, -15, 13],
          [x, -15, 9],
        ],
        1.8,
        { tone: index === 5 ? "hi" : "mid", group: "rake" },
      ),
    );
  }
  faces.push(
    ...tapered([0, -11, 16], [54, 26, 64], 3.4, 2.4, {
      tone: "edge",
      group: "rake",
    }),
    ...drumY(22, 30, 54, 64, 4.4, {
      tone: "mid",
      topTone: "lo",
      group: "rake",
    }),
  );

  /* Near planks, painted last: they hide the sand lip cleanly. */
  faces.push(
    ...box(-62, 34, 0, 124, 8, 18, {
      r: 2,
      tone: "edge",
      topTone: "mid",
    }),
  );
  for (const x of [-44, -22, 0, 22, 44]) {
    faces.push(
      stroke3(
        [
          [x, 42.2, 2],
          [x, 42.2, 16],
        ],
        "lo",
      ),
    );
  }

  return faces;
}

export const sandbox: PrototypeMeta = {
  slug: "sandbox",
  name: "Sandbox",
  component: "Sandbox",
  object: "Sandbox with a rake",
  story:
    "The rake pulls one more furrow through the sand and the crest catches the light.",
  note: "A sandbox is bounded free material: a safe place to make a mark, then level it again.",
  scene: figureScene({
    slug: "sandbox",
    name: "Sandbox",
    component: "Layout",
    object: "Sandbox with a rake",
    description:
      "A wooden sandbox filled with raked sand, four plank walls and a rake resting with its tines in the sand.",
    aria:
      "An isometric wooden sandbox filled with raked sand, with a rake resting across it and one bright furrow.",
    faces: sandboxFaces(),
    motions: [
      { group: "rake", kind: "sway", period: 3200, amount: 0.04, pivot: [-10, -16, 12] },
      { group: "sand", kind: "breathe", period: 4800, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 156. Schema Display — patch panel                                          */
/* -------------------------------------------------------------------------- */

function schemaDisplayFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The panel is a metal plate; the ports and labels are engraved on it. */
  faces.push(
    ...box(-62, -6, 2, 124, 12, 84, {
      r: 2.4,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );

  const columns = [-49, -35, -21, -7, 7, 21, 35, 49];
  const rows = [58, 30];
  for (const z of rows) {
    for (const x of columns) {
      faces.push(
        face2(
          roundedRect(x - 4.4, z - 3.6, 8.8, 7.2, 1.2, 3).map(([px, py]) =>
            iso(px, 6.3, py),
          ),
          { tone: "mid" },
        ),
        face2(
          roundedRect(x - 2.6, z - 2, 5.2, 4, 0.8, 3).map(([px, py]) =>
            iso(px, 6.4, py),
          ),
          { tone: "lo" },
        ),
      );
      faces.push(dotAt(x, 6.6, z + 7.2, 1.2, "lo"));
    }
  }
  for (const x of columns) {
    faces.push(
      stroke3(
        [
          [x - 5, 6.5, 82],
          [x + 5, 6.5, 82],
        ],
        "lo",
      ),
    );
  }
  /* One status LED is alive above its port. */
  faces.push(
    face2(circle(iso(21, 6.7, 51)[0], iso(21, 6.7, 51)[1], 2.2, 14), {
      tone: "hi",
      group: "link",
    }),
  );

  /* Three patch cables looping out of the panel. */
  const cable = (
    from: [number, number],
    to: [number, number],
    bulge: number,
    group: string,
    tone: DetailTone,
  ) => {
    const points: Point3[] = [];
    for (let index = 0; index <= 16; index += 1) {
      const t = index / 16;
      const x = from[0] + (to[0] - from[0]) * t;
      const z = from[1] + (to[1] - from[1]) * t;
      const y = 6.5 + Math.sin(t * Math.PI) * bulge;
      points.push([x, y, z - Math.sin(t * Math.PI) * 6]);
    }
    faces.push(tube(points, 2.8, { tone, group }));
  };
  cable([-49, 58], [-21, 58], 24, "cable-a", "mid");
  cable([7, 58], [35, 30], 30, "cable-b", "edge");
  cable([21, 30], [49, 30], 20, "cable-c", "hi");

  /* Two mounting ears and screws. */
  for (const x of [-58, 58]) {
    faces.push(
      stroke3(
        [
          [x, 6.4, 12],
          [x, 6.4, 76],
        ],
        "lo",
      ),
    );
    for (const z of [16, 72]) {
      faces.push(dotAt(x, 6.6, z, 1.4, "mid"));
    }
  }

  return faces;
}

export const schemaDisplay: PrototypeMeta = {
  slug: "schema-display",
  name: "Schema Display",
  component: "Schema Display",
  object: "Patch panel",
  story:
    "A patch cable seats itself in its port and the link light comes on beside it.",
  note: "A schema is a patch panel: labelled ports and cables, every connection visible at a glance.",
  scene: figureScene({
    slug: "schema-display",
    name: "Schema Display",
    component: "Data",
    object: "Patch panel",
    description:
      "A network patch panel with two rows of eight ports, engraved labels, mounting ears and three looping patch cables, one bright.",
    aria:
      "An isometric patch panel with two rows of ports, engraved labels and three patch cables looping out, one cable bright.",
    faces: schemaDisplayFaces(),
    motions: [
      { group: "cable-a", kind: "sway", period: 3400, amount: 0.035, pivot: [-49, 6, 58] },
      { group: "cable-b", kind: "breathe", period: 4200, amount: 0.012 },
      { group: "cable-c", kind: "sway", period: 2800, amount: 0.045, pivot: [21, 6, 30] },
      { group: "link", kind: "flicker", period: 1800, amount: 0.18 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 157. Skip Nav — turnstile                                                  */
/* -------------------------------------------------------------------------- */

function skipNavFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* A waist-high cabinet is the body a tripod turnstile actually turns on. */
  faces.push(
    ...box(-30, -20, 0, 60, 40, 40, {
      r: 7,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );
  /* Front grooves and the entry light. */
  for (const z of [12, 22]) {
    faces.push(
      stroke3(
        [
          [-23, 20.3, z],
          [23, 20.3, z],
        ],
        "lo",
      ),
    );
  }
  faces.push(
    face2(circle(iso(0, 20.6, 32)[0], iso(0, 20.6, 32)[1], 2.4, 14), {
      tone: "hi",
      group: "reader",
    }),
    face2(circle(iso(0, 20.8, 32)[0], iso(0, 20.8, 32)[1], 4.4, 18), {
      fill: false,
      tone: "mid",
      group: "reader",
    }),
  );

  /* Rotor housing on the cabinet top. */
  faces.push(
    ...cylinder(0, 0, 40, 8, 14, 12, {
      tone: "edge",
      topTone: "mid",
      group: "rotor",
    }),
  );

  /* Three thick arms at waist height, each bent down at the wrist. */
  const armAngles = [0, TAU / 3, (TAU * 2) / 3];
  armAngles.forEach((a, index) => {
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    faces.push(
      tube(
        [
          [0, 0, 47],
          [ca * 40, sa * 40, 47],
          [ca * 54, sa * 54, 39],
        ],
        4.6,
        { tone: index === 0 ? "hi" : "edge", group: "rotor" },
      ),
      ...ball(ca * 54, sa * 54, 39, 3.4, {
        tone: index === 0 ? "hi" : "mid",
        group: "rotor",
      }),
    );
  });
  faces.push(
    ...cylinder(0, 0, 46, 9, 6, 5, {
      tone: "edge",
      topTone: "mid",
      group: "rotor",
    }),
  );

  /* A reading pad on the near top edge of the cabinet. */
  faces.push(
    face3(
      [
        [-10, 12, 40.4],
        [10, 12, 40.4],
        [12, 20, 38.4],
        [-12, 20, 38.4],
      ],
      { tone: "mid", group: "reader" },
    ),
  );

  return faces;
}

export const skipNav: PrototypeMeta = {
  slug: "skip-nav",
  name: "Skip Nav",
  component: "Skip Nav",
  object: "Turnstile",
  story:
    "The three arms pivot a third of a turn and let the reader straight through.",
  note: "Skip navigation is a turnstile: one deliberate movement past everything else.",
  scene: figureScene({
    slug: "skip-nav",
    name: "Skip Nav",
    component: "Navigation",
    object: "Turnstile",
    description:
      "A tripod turnstile: a cast base, a fixed pillar and three arms radiating from a rotor, with a card reader on top.",
    aria:
      "An isometric tripod turnstile with a cast base, a central pillar, three rotating arms and a bright card reader.",
    faces: skipNavFaces(),
    motions: [
      { group: "rotor", kind: "spin", period: 2800, amount: 120, pivot: [0, 0, 47] },
      { group: "reader", kind: "flicker", period: 2000, amount: 0.14 },
      { kind: "breathe", period: 5200, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 158. Subagent — test-tube rack                                             */
/* -------------------------------------------------------------------------- */

function subagentFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Back rail, side cheeks, then the tubes, then the front rail. */
  faces.push(
    ...box(-43, -28, 30, 86, 8, 6, {
      r: 1.6,
      tone: "mid",
      topTone: "lo",
      group: "rack",
    }),
    ...box(-50, -28, 0, 7, 56, 50, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "rack",
    }),
    ...box(43, -28, 0, 7, 56, 50, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      group: "rack",
    }),
  );

  const positions = [-32, -16, 0, 16, 32];
  positions.forEach((x, index) => {
    const lifted = index === 3;
    const z0 = lifted ? 20 : 8;
    const group = lifted ? "tube-3" : "tubes";
    faces.push(
      ...cylinder(x, 0, z0, 12, 3.4, 6.6, {
        tone: "mid",
        topTone: "lo",
        group,
      }),
      ...cylinder(x, 0, z0 + 12, 50, 6.6, 6.6, {
        tone: "edge",
        hollow: 1.6,
        topTone: "lo",
        group,
      }),
      ellipse3(x, 0, z0 + 27, 5.6, 5.6, {
        fill: false,
        tone: lifted ? "hi" : "lo",
        group,
      }),
    );
    faces.push(
      stroke3(
        [
          [x - 4, 1.2, z0 + 18],
          [x - 4, 1.2, z0 + 46],
        ],
        "lo",
        { group },
      ),
    );
  });

  /* Front rail and the holes the tubes pass through. */
  faces.push(
    ...box(-43, 20, 30, 86, 8, 6, {
      r: 1.6,
      tone: "edge",
      topTone: "mid",
      group: "rack",
    }),
  );
  for (const x of positions) {
    faces.push(
      ellipse3(x, -24, 36.2, 6.8, 6.8, { fill: false, tone: "lo" }),
      ellipse3(x, 24, 36.2, 6.8, 6.8, { fill: false, tone: "lo" }),
    );
  }
  /* A small label plate on the front cheek. */
  faces.push(
    face3(
      [
        [-22, 28.2, 12],
        [22, 28.2, 12],
        [22, 28.2, 18],
        [-22, 28.2, 18],
      ],
      { fill: false, tone: "lo" },
    ),
  );

  return faces;
}

export const subagent: PrototypeMeta = {
  slug: "subagent",
  name: "Subagent",
  component: "Subagent",
  object: "Test-tube rack",
  story:
    "One tube lifts clear of the rack and its sample shines; the others wait in their holes.",
  note: "A subagent is a tube in a rack: a small sample handled alongside the main work.",
  scene: figureScene({
    slug: "subagent",
    name: "Subagent",
    component: "AI",
    object: "Test-tube rack",
    description:
      "A wooden test-tube rack with two rails, four glass tubes at rest and one raised tube with a bright sample line.",
    aria:
      "An isometric wooden test-tube rack holding five glass tubes, the fourth lifted above the rails with a bright liquid line.",
    faces: subagentFaces(),
    motions: [
      { group: "tube-3", kind: "lift", period: 3000, amount: 9 },
      { group: "tube-3", kind: "bob", period: 2200, amount: 1.4 },
      { group: "tubes", kind: "breathe", period: 4800, amount: 0.006 },
      { group: "rack", kind: "breathe", period: 6000, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 159. Task — field notebook                                                 */
/* -------------------------------------------------------------------------- */

function taskFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Two pages rising from a low gutter, like a notebook pressed open. */
  const leftZ = (x: number) => 7 + ((x + 3) / -43) * 7;
  const rightZ = (x: number) => 7 + ((x - 3) / 43) * 7;
  faces.push(
    face3(
      [
        [-46, -28, 14],
        [-3, -28, 7],
        [-3, 28, 7],
        [-46, 28, 14],
      ],
      { tone: "edge", group: "left" },
    ),
    face3(
      [
        [3, -28, 7],
        [46, -28, 14],
        [46, 28, 14],
        [3, 28, 7],
      ],
      { tone: "edge", group: "page" },
    ),
  );
  /* The page block under each page, and a slim cloth spine. */
  for (const [x0, x1, group] of [
    [-46, -3, "left"],
    [3, 46, "page"],
  ] as const) {
    const z0 = x0 < 0 ? leftZ(x0) : rightZ(x0);
    const z1 = x0 < 0 ? leftZ(x1) : rightZ(x1);
    faces.push(
      face3(
        [
          [x0, -28, z0 - 2.4],
          [x1, -28, z1 - 2.4],
          [x1, 28, z1 - 2.4],
          [x0, 28, z0 - 2.4],
        ],
        { tone: "lo", group },
      ),
    );
    /* Page edges: three thin lines just under the top sheet. */
    for (const y of [-24, 0, 24]) {
      faces.push(
        stroke3(
          [
            [x0, y, z0 - 0.8],
            [x1, y, z1 - 0.8],
          ],
          "lo",
          { group },
        ),
      );
    }
  }
  faces.push(
    ...box(-4, -28, 0, 8, 56, 7, {
      r: 1.8,
      tone: "mid",
      topTone: "lo",
      group: "spine",
    }),
  );

  /* Ruled right page and three generous checkboxes. */
  for (let line = 0; line < 4; line += 1) {
    const y = -20 + line * 14;
    faces.push(
      stroke3(
        [
          [8, y, rightZ(8) + 0.4],
          [42, y, rightZ(42) + 0.4],
        ],
        "lo",
        { group: "page" },
      ),
    );
  }
  for (let line = 0; line < 3; line += 1) {
    const y = -20 + line * 14;
    const x0 = 8;
    const x1 = 20;
    faces.push(
      face3(
        [
          [x0, y - 4.6, rightZ(x0) + 0.5],
          [x1, y - 4.6, rightZ(x1) + 0.5],
          [x1, y + 4.6, rightZ(x1) + 0.5],
          [x0, y + 4.6, rightZ(x0) + 0.5],
        ],
        { fill: false, tone: "mid", group: "page" },
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [9.6, -23.4, rightZ(9.6) + 0.7],
        [12.4, -18.6, rightZ(12.4) + 0.7],
        [18.4, -25.4, rightZ(18.4) + 0.7],
      ],
      "hi",
      { group: "check" },
    ),
  );

  /* Left page: a drawn header, three notes and the elastic band. */
  faces.push(
    stroke3(
      [
        [-40, -20, leftZ(-40) + 0.4],
        [-12, -20, leftZ(-12) + 0.4],
      ],
      "hi",
      { group: "left" },
    ),
  );
  for (let line = 0; line < 3; line += 1) {
    const y = -6 + line * 12;
    faces.push(
      stroke3(
        [
          [-40, y, leftZ(-40) + 0.4],
          [-16, y, leftZ(-16) + 0.4],
        ],
        "lo",
        { group: "left" },
      ),
    );
  }
  faces.push(
    tube(
      [
        [-40, -28, leftZ(-40) + 1],
        [-40, 28, leftZ(-40) + 1],
      ],
      2.2,
      { tone: "mid", group: "left" },
    ),
  );

  /* Pencil resting on the right page, sharpened at the near end. */
  const pencilZ = rightZ(32) + 2.4;
  faces.push(
    ...drumY(-22, 16, 32, pencilZ, 2, {
      tone: "edge",
      topTone: "lo",
      group: "pencil",
    }, 12),
    ...tapered([32, 16, pencilZ], [32, 24, pencilZ], 2, 0.5, {
      tone: "mid",
      group: "pencil",
    }),
    dotAt(32, 24.6, pencilZ, 0.7, "hi", "pencil"),
  );

  return faces;
}

export const task: PrototypeMeta = {
  slug: "task",
  name: "Task",
  component: "Task",
  object: "Field notebook",
  story:
    "A box is ticked in bright ink and the ruled page settles flat in the gutter.",
  note: "A task is a line in a field notebook: noted once, checked off, carried on.",
  scene: figureScene({
    slug: "task",
    name: "Task",
    component: "Data",
    object: "Field notebook",
    description:
      "An open field notebook in a shallow V: ruled pages, three checkboxes with one bright tick, and a pencil in the gutter.",
    aria:
      "An isometric open field notebook with ruled pages, three checkboxes, one bright tick and a pencil resting in the gutter.",
    faces: taskFaces(),
    motions: [
      { group: "check", kind: "lift", period: 2600, amount: 1.6 },
      { group: "check", kind: "breathe", period: 2600, amount: 0.04 },
      { group: "page", kind: "breathe", period: 4400, amount: 0.005 },
      { group: "pencil", kind: "sway", period: 3800, amount: 0.025, pivot: [0, 0, 11] },
    ],
    press: 0.9,
  }),
};

/* -------------------------------------------------------------------------- */
/* 160. Timer — chess clock                                                   */
/* -------------------------------------------------------------------------- */

function timerFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Wooden body, a front lip and four small feet. */
  faces.push(
    ...box(-58, -30, 2, 116, 60, 58, {
      r: 7,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );
  for (const [x, y] of [
    [-50, 22],
    [50, 22],
  ] as const) {
    faces.push(
      ...cylinder(x, y, 0, 4, 3.4, 3, { tone: "lo", topTone: "lo" }),
    );
  }

  /* Two dials on the front face, with bezel, ticks and hands. */
  const dial = (cx: number, group: string, accent: boolean) => {
    faces.push(
      disc3(cx, 30.3, 34, 21, "xz", { tone: "edge" }),
      disc3(cx, 30.6, 34, 17.6, "xz", { tone: "lo" }),
    );
    for (let index = 0; index < 12; index += 1) {
      const a = (index / 12) * TAU;
      faces.push(
        face2(
          [
            iso(cx + Math.cos(a) * 14.4, 30.9, 34 + Math.sin(a) * 14.4),
            iso(cx + Math.cos(a) * 16.6, 30.9, 34 + Math.sin(a) * 16.6),
          ],
          { fill: false, tone: index % 3 === 0 ? "mid" : "lo" },
        ),
      );
    }
    faces.push(
      stroke2(
        [iso(cx, 31, 34), iso(cx + 8, 31, 34 + 8)],
        accent ? "hi" : "mid",
        { group },
      ),
      stroke2(
        [iso(cx, 31.1, 34), iso(cx - 2, 31.1, 34 + 12)],
        "mid",
        { group },
      ),
      (() => {
        const [hx, hy] = iso(cx, 31.2, 34);
        return face2(circle(hx, hy, 1.6, 12), { tone: "edge" });
      })(),
    );
  };
  dial(-28, "hand-a", true);
  dial(28, "hand-b", false);

  /* Two plungers on top: the left one is down, the right one still up. */
  faces.push(
    ...cylinder(-28, 0, 60, 6, 4.6, 5.4, {
      tone: "mid",
      topTone: "lo",
      group: "plunger-a",
    }),
    ...cylinder(28, 0, 60, 14, 4.6, 5.4, {
      tone: "edge",
      topTone: "mid",
      group: "plunger-b",
    }),
    ...ball(-28, 0, 68, 4.6, { tone: "mid", group: "plunger-a" }),
    ...ball(28, 0, 77, 4.6, { tone: "edge", group: "plunger-b" }),
  );

  /* Maker's plate and two brass corner pins. */
  faces.push(
    face2(
      [
        iso(-13, 30.3, 59),
        iso(13, 30.3, 59),
        iso(13, 30.3, 63),
        iso(-13, 30.3, 63),
      ],
      { fill: false, tone: "lo" },
    ),
    dotAt(-48, 30.5, 8, 1.4, "mid"),
    dotAt(48, 30.5, 8, 1.4, "mid"),
  );

  return faces;
}

export const timer: PrototypeMeta = {
  slug: "timer",
  name: "Timer",
  component: "Timer",
  object: "Chess clock",
  story:
    "One plunger sinks, the other rises and the waiting dial's bright hand steps forward.",
  note: "A timer is a chess clock: two times handed back and forth, one always running.",
  scene: figureScene({
    slug: "timer",
    name: "Timer",
    component: "Controls",
    object: "Chess clock",
    description:
      "A wooden chess clock with two round dials, tick marks, hands, two top plungers and a maker's plate.",
    aria:
      "An isometric chess clock with two dials and hands, two plungers on top, the left plunged down and the right hand bright.",
    faces: timerFaces(),
    motions: [
      { group: "hand-a", kind: "spin", period: 9000, amount: 360, pivot: [-28, 31, 34] },
      { group: "hand-b", kind: "spin", period: 11000, amount: 360, pivot: [28, 31, 34] },
      { group: "plunger-b", kind: "lift", period: 2600, amount: 3.2 },
      { group: "plunger-a", kind: "breathe", period: 2600, amount: 0.01 },
      { kind: "breathe", period: 6000, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 161. Tree View — branching coral                                           */
/* -------------------------------------------------------------------------- */

function treeViewFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* A flared foot, then a tapering trunk and two forking boughs. */
  faces.push(
    ...cylinder(0, 0, 0, 7, 13, 9, { tone: "mid", topTone: "lo", bottomArc: true }),
    ...cylinder(-11, 5, 0, 5, 8, 4, { tone: "mid", topTone: "lo" }),
    ...cylinder(10, -4, 0, 4, 7, 3.4, { tone: "mid", topTone: "lo" }),
    tube(
      [
        [0, 0, 5],
        [0, 0, 24],
        [3, -2, 42],
      ],
      12,
      { tone: "edge", group: "coral" },
    ),
  );

  const branches: Array<{
    points: Point3[];
    width: number;
    tone: DetailTone;
    group: string;
  }> = [
    {
      points: [
        [1, -1, 38],
        [-14, 3, 56],
        [-27, 1, 82],
        [-34, -5, 102],
      ],
      width: 7,
      tone: "edge",
      group: "coral",
    },
    {
      points: [
        [-22, 2, 76],
        [-38, 9, 92],
        [-48, 8, 108],
      ],
      width: 4.2,
      tone: "mid",
      group: "coral",
    },
    {
      points: [
        [2, -1, 42],
        [18, -5, 62],
        [30, -1, 88],
        [40, -7, 108],
      ],
      width: 7,
      tone: "edge",
      group: "coral",
    },
    {
      points: [
        [26, -2, 82],
        [40, 8, 96],
        [50, 7, 110],
      ],
      width: 4,
      tone: "mid",
      group: "coral",
    },
    {
      points: [
        [3, -2, 44],
        [-1, -4, 72],
        [-5, -6, 100],
        [2, -8, 120],
      ],
      width: 5.4,
      tone: "edge",
      group: "coral",
    },
    {
      points: [
        [-26, 2, 82],
        [-43, -3, 96],
        [-54, -9, 108],
      ],
      width: 3,
      tone: "mid",
      group: "coral",
    },
    {
      points: [
        [29, -1, 88],
        [23, 10, 102],
        [16, 15, 112],
      ],
      width: 2.8,
      tone: "mid",
      group: "coral",
    },
    {
      points: [
        [-4, -5, 98],
        [-11, -13, 112],
        [-18, -17, 120],
      ],
      width: 2.6,
      tone: "mid",
      group: "coral",
    },
    {
      points: [
        [16, -4, 62],
        [8, 12, 76],
        [2, 18, 86],
      ],
      width: 3.2,
      tone: "mid",
      group: "coral",
    },
  ];
  for (const branch of branches) {
    faces.push(
      tube(branch.points, branch.width, {
        tone: branch.tone,
        group: branch.group,
      }),
    );
  }

  /* Polyp clusters break the silhouette like living coral. */
  const clusters: Array<[number, number, number]> = [
    [-16, 3, 62],
    [-26, 1, 80],
    [17, -5, 67],
    [29, -1, 86],
    [-49, 8, 109],
    [51, 7, 111],
    [2, -8, 122],
    [-44, -2, 98],
    [23, 11, 103],
    [9, 13, 77],
  ];
  for (const [x, y, z] of clusters) {
    faces.push(
      ...ball(x, y, z, 2.8, { tone: "mid", group: "tips" }),
      ...ball(x + 3.2, y - 1.4, z + 2.4, 1.8, { tone: "lo", group: "tips" }),
      ...ball(x - 2.6, y + 1.6, z + 1.6, 1.6, { tone: "lo", group: "tips" }),
    );
  }
  faces.push(
    ...ball(51, 7, 112, 3.4, { tone: "hi", group: "tips" }),
    ...ball(-54, -9, 109, 2.8, { tone: "mid", group: "tips" }),
  );

  /* Engraved pores across the trunk and main boughs. */
  for (const [x, y, z] of [
    [-4, 6, 16],
    [5, 5, 28],
    [-19, 8, 58],
    [21, -7, 64],
    [-4, -10, 88],
    [33, -6, 92],
    [-31, 4, 92],
    [11, 6, 74],
  ] as const) {
    faces.push(dotAt(x, y, z, 1.1, "lo", "coral"));
  }

  return faces;
}

export const treeView: PrototypeMeta = {
  slug: "tree-view",
  name: "Tree View",
  component: "Tree View",
  object: "Branching coral",
  story:
    "The coral sways and one bright polyp lights at the end of a high branch.",
  note: "A tree view grows like coral: one trunk, forking branches, each growing from the last.",
  scene: figureScene({
    slug: "tree-view",
    name: "Tree View",
    component: "Data",
    object: "Branching coral",
    description:
      "A branching coral with a flared foot, a thick trunk, several forking boughs and scattered polyp nubs, one bright tip.",
    aria:
      "An isometric branching coral with a flared foot, a thick trunk and forking boughs tipped with polyp nubs, one tip bright.",
    faces: treeViewFaces(),
    motions: [
      { kind: "sway", period: 4600, amount: 0.022, pivot: [0, 0, 0] },
      { group: "tips", kind: "breathe", period: 3000, amount: 0.06 },
      { group: "coral", kind: "breathe", period: 5200, amount: 0.006 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 162. Type Table — printer's type case                                      */
/* -------------------------------------------------------------------------- */

/** A tiny letter sort engraved flat on the top of a type block. */
function flatSort(
  x: number,
  y: number,
  z: number,
  kind: number,
  tone: DetailTone,
  group: string,
): FigureFace[] {
  const faces: FigureFace[] = [];
  const put = (points: ReadonlyArray<Point2>) =>
    faces.push(
      face2(
        points.map(([u, v]) => iso(x + u, y + v, z)),
        { fill: false, tone, group },
      ),
    );
  const k = kind % 5;
  if (k === 0) {
    put([
      [-2.2, -3],
      [0, 3],
      [2.2, -3],
    ]);
    put([
      [-1.1, -0.4],
      [1.1, -0.4],
    ]);
  } else if (k === 1) {
    put([
      [-1.6, -3],
      [-1.6, 3],
      [2, 3],
    ]);
    put([
      [-1.6, -0.2],
      [1.4, -0.2],
    ]);
  } else if (k === 2) {
    put([
      [-2, 3],
      [2, 3],
    ]);
    put([
      [0, 3],
      [0, -3],
    ]);
  } else if (k === 3) {
    put([
      [-1.8, -3],
      [-1.8, 3],
    ]);
    put([
      [1.8, -3],
      [1.8, 3],
    ]);
    put([
      [-1.8, 0],
      [1.8, 0],
    ]);
  } else {
    put([
      [-1.6, 3],
      [-1.6, -3],
    ]);
    put([
      [-1.6, -3],
      [2, -3],
    ]);
  }
  return faces;
}

function typeTableFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The shallow case, with a raised wooden frame around the compartments. */
  faces.push(
    ...box(-70, -50, 0, 140, 100, 9, {
      r: 3,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );
  for (const [x, y, w, d] of [
    [-68, -48, 136, 5],
    [-68, 43, 136, 5],
    [-68, -43, 5, 86],
    [63, -43, 5, 86],
  ] as const) {
    faces.push(
      ...box(x, y, 9, w, d, 3, {
        r: 1,
        tone: "mid",
        topTone: "lo",
      }),
    );
  }

  /* Compartments: five columns by three rows, each recessed with a low sort. */
  const colX = [-56, -34, -12, 10, 32, 54];
  const rowY = [-39, -13, 13, 39];
  for (const x of colX) {
    faces.push(flatLine(x, -42, x, 42, 9.4, "lo"));
  }
  for (const y of rowY) {
    faces.push(flatLine(-61, y, 61, y, 9.4, "lo"));
  }

  const sorts = [0, 1, 2, 3, 4, 2, 0, 3, 1, 4, 1, 3, 0, 2, 4];
  sorts.forEach((kind, index) => {
    const col = index % 5;
    const row = Math.floor(index / 5);
    const x = -45 + col * 22;
    const y = -26 + row * 26;
    faces.push(
      face2(
        roundedRect(x - 9, y - 9, 18, 18, 1.2, 3).map(([px, py]) =>
          iso(px, py, 9.5),
        ),
        { fill: false, tone: "lo" },
      ),
    );
    /* Two cells wait empty, so the case reads as sorted and in use. */
    if (index === 7 || index === 12) return;
    faces.push(
      ...box(x - 5, y - 5, 9.4, 10, 10, 1.4, {
        r: 0.6,
        tone: "mid",
        topTone: "lo",
        group: "case",
      }),
      ...flatSort(x, y, 11, kind, (col + row) % 4 === 0 ? "hi" : "lo", "case"),
    );
  });

  /* A composing stick lifted over the front-right corner. */
  faces.push(
    ...box(28, 24, 13, 54, 20, 2.2, {
      r: 1,
      tone: "edge",
      topTone: "mid",
      group: "stick",
    }),
    ...box(28, 40, 15, 54, 4, 5, {
      r: 1,
      tone: "mid",
      topTone: "lo",
      group: "stick",
    }),
    ...box(28, 24, 15, 4, 20, 5, {
      r: 1,
      tone: "mid",
      topTone: "lo",
      group: "stick",
    }),
    ...box(80, 26, 13, 7, 16, 4, {
      r: 1.4,
      tone: "mid",
      topTone: "lo",
      group: "stick",
    }),
  );
  for (let index = 0; index < 3; index += 1) {
    const x = 37 + index * 12;
    const y = 32;
    faces.push(
      ...box(x - 5, y - 5, 15, 10, 10, 2.4, {
        r: 0.6,
        tone: "mid",
        topTone: "lo",
        group: "stick",
      }),
      ...flatSort(x, y, 17.6, index + 2, index === 2 ? "hi" : "lo", "piece"),
    );
  }

  return faces;
}

export const typeTable: PrototypeMeta = {
  slug: "type-table",
  name: "Type Table",
  component: "Type Table",
  object: "Printer's type case",
  story:
    "A new sort rises from its compartment and slides into the bright composing stick.",
  note: "A type table is a case of sorted characters: each glyph has its own numbered slot.",
  scene: figureScene({
    slug: "type-table",
    name: "Type Table",
    component: "Text",
    object: "Printer's type case",
    description:
      "A shallow printer's type case with fifteen sorted compartments holding letter sorts, and a composing stick with three raised letters.",
    aria:
      "An isometric printer's type case with a grid of compartments and letter sorts, plus a composing stick with three raised letters, one bright.",
    faces: typeTableFaces(),
    motions: [
      { group: "stick", kind: "lift", period: 3200, amount: 2.6 },
      { group: "piece", kind: "breathe", period: 2600, amount: 0.03 },
      { group: "case", kind: "breathe", period: 5600, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 163. Web Preview — diorama box                                             */
/* -------------------------------------------------------------------------- */

function webPreviewFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Back and side walls of the shallow box; the front stays open. */
  faces.push(
    ...box(-58, -36, 0, 116, 6, 58, {
      r: 1.6,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-58, -30, 0, 6, 66, 54, {
      r: 1.6,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(52, -30, 0, 6, 66, 54, {
      r: 1.6,
      tone: "edge",
      topTone: "mid",
    }),
  );

  /* A sun on the back wall and its short rays. */
  const [sx, sy] = iso(16, -29.4, 44);
  faces.push(
    face2(circle(sx, sy, 7.4, 24), { tone: "hi", group: "sun" }),
    face2(circle(sx, sy, 3, 16), { tone: "lo", group: "sun" }),
  );
  for (let index = 0; index < 8; index += 1) {
    const a = (index / 8) * TAU;
    faces.push(
      stroke2(
        [
          [sx + Math.cos(a) * 9.6, sy + Math.sin(a) * 9.6],
          [sx + Math.cos(a) * 13.6, sy + Math.sin(a) * 13.6],
        ],
        "lo",
        { group: "sun" },
      ),
    );
  }

  /* Floor and a low hill, a small tree and a path. */
  faces.push(
    ...prism(roundedRect(-52, -30, 104, 58, 2, 2), 0, 4, {
      tone: "edge",
      topTone: "mid",
      group: "scene",
    }),
  );
  faces.push(
    ...cylinder(-18, 6, 4, 8, 22, 12, {
      sides: 18,
      tone: "edge",
      topTone: "lo",
      group: "scene",
    }),
    ...cylinder(22, 10, 4, 5, 12, 8, {
      sides: 14,
      tone: "mid",
      topTone: "lo",
      group: "scene",
    }),
  );
  faces.push(
    tube(
      [
        [-2, 22, 5],
        [6, 16, 8],
        [12, 20, 7],
        [18, 26, 5],
      ],
      2.4,
      { tone: "mid", group: "scene" },
    ),
  );
  /* A toy tree. */
  faces.push(
    tube(
      [
        [4, 2, 4],
        [4, 2, 24],
      ],
      2.4,
      { tone: "edge", group: "scene" },
    ),
  );
  const [tx, ty] = iso(4, 2, 30);
  faces.push(
    face2(circle(tx, ty, 8.6, 20), { tone: "edge", group: "scene" }),
    face2(circle(tx - 2, ty - 2, 5.4, 16), { tone: "lo", group: "scene" }),
  );

  /* The glass front: only its thin frame and one reflection are drawn. */
  for (const [a, b] of [
    [[-58, 36, 0], [-58, 36, 54]],
    [[-58, 36, 54], [58, 36, 54]],
    [[58, 36, 54], [58, 36, 0]],
  ] as const) {
    faces.push(
      tube([a, b], 1.5, { tone: "lo", group: "glass" }),
    );
  }
  faces.push(
    stroke3(
      [
        [-44, 35.4, 44],
        [-24, 35.4, 24],
      ],
      "lo",
      { group: "glass" },
    ),
    stroke3(
      [
        [-40, 35.4, 48],
        [-32, 35.4, 40],
      ],
      "lo",
      { group: "glass" },
    ),
  );

  return faces;
}

export const webPreview: PrototypeMeta = {
  slug: "web-preview",
  name: "Web Preview",
  component: "Web Preview",
  object: "Diorama box",
  story:
    "The little scene warms up behind the glass and the sun catches the front pane.",
  note: "A web preview is a diorama: a small framed world you can look into without entering.",
  scene: figureScene({
    slug: "web-preview",
    name: "Web Preview",
    component: "Media",
    object: "Diorama box",
    description:
      "A shallow diorama box with a back wall, two side walls, an open glass front and a tiny lit landscape with a hill, a tree and a sun.",
    aria:
      "An isometric diorama box with an open glass front and a small landscape inside: a hill, a tree, a path and a bright sun on the back wall.",
    faces: webPreviewFaces(),
    motions: [
      { group: "scene", kind: "breathe", period: 4400, amount: 0.006 },
      { group: "sun", kind: "flicker", period: 2600, amount: 0.12 },
      { group: "glass", kind: "breathe", period: 3600, amount: 0.02 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 164. Anatomy — geological core sample                                      */
/* -------------------------------------------------------------------------- */

function rockFootprint(seed: number, radius: number): Point2[] {
  const points: Point2[] = [];
  const steps = 12;
  for (let index = 0; index < steps; index += 1) {
    const a = (index / steps) * TAU;
    const r =
      radius +
      Math.sin(a * 3 + seed) * 2.4 +
      Math.cos(a * 5 - seed * 0.7) * 1.4;
    points.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return points;
}

function anatomyFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Four rock layers, separated by a small gap, each with a rough edge. */
  const layers = [
    { z: 0, h: 18, seed: 0.4, r: 22 },
    { z: 22, h: 17, seed: 1.9, r: 23 },
    { z: 43, h: 18, seed: 3.1, r: 21 },
    { z: 65, h: 17, seed: 4.6, r: 22 },
  ];
  layers.forEach((layer, index) => {
    const group = index === 3 ? "layer-3" : "core";
    faces.push(
      ...prism(rockFootprint(layer.seed, layer.r), layer.z, layer.h, {
        tone: "edge",
        topTone: index === 1 ? "hi" : "mid",
        lip: true,
        group,
      }),
    );
    /* Fracture rings on the top and a couple of strata lines on the front. */
    faces.push(
      ellipse3(0, 0, layer.z + layer.h + 0.2, layer.r * 0.56, layer.r * 0.5, {
        fill: false,
        tone: "lo",
        group,
      }),
    );
    for (const t of [0.32, 0.64]) {
      const z = layer.z + layer.h * t;
      faces.push(
        stroke3(
          [
            [-layer.r * 0.5, layer.r * 0.88, z],
            [0, layer.r, z + 1.4],
            [layer.r * 0.5, layer.r * 0.88, z],
          ],
          "lo",
          { group },
        ),
      );
    }
  });

  /* Two labelled tags on leaders, the upper one bright. */
  const tag = (
    x: number,
    z: number,
    tx: number,
    tz: number,
    tone: DetailTone,
    group: string,
    accent: boolean,
  ) => {
    faces.push(
      face2([iso(x, 0, z), iso(tx, 0, tz)], {
        fill: false,
        tone: "lo",
        group,
      }),
    );
    const [px, py] = iso(tx, 0, tz);
    faces.push(
      face2(
        roundedRect(px - 3, py - 9, 22, 12, 2, 3),
        { tone: "mid", group },
      ),
    );
    faces.push(
      stroke2(
        [
          [px + 1, py - 6],
          [px + 15, py - 6],
        ],
        tone,
        { group },
      ),
      stroke2(
        [
          [px + 1, py - 1],
          [px + (accent ? 13 : 10), py - 1],
        ],
        "lo",
        { group },
      ),
      face2(circle(px, py - 3, 1.6, 12), { tone, group }),
    );
  };
  tag(15, 71, 46, 96, "hi", "labels", true);
  tag(-10, 52, 40, 74, "mid", "labels", false);

  return faces;
}

export const anatomy: PrototypeMeta = {
  slug: "anatomy",
  name: "Anatomy",
  component: "Anatomy",
  object: "Geological core sample",
  story:
    "The top layer lifts, the labelled tags swing out and one bright band shows the seam.",
  note: "Anatomy is a core sample: a thing cut into labelled layers so its construction is read.",
  scene: figureScene({
    slug: "anatomy",
    name: "Anatomy",
    component: "Layout",
    object: "Geological core sample",
    description:
      "A geological core sample split into four rough rock layers with fracture rings and strata, plus two labelled tags on leaders.",
    aria:
      "An isometric geological core sample made of four separated rock layers with rough edges, strata lines and two labelled tags.",
    faces: anatomyFaces(),
    motions: [
      { group: "layer-3", kind: "lift", period: 3600, amount: 3.6 },
      { group: "labels", kind: "sway", period: 4200, amount: 0.03, pivot: [0, 0, 60] },
      { group: "core", kind: "breathe", period: 5600, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 165. Environment Variables — valve manifold                                */
/* -------------------------------------------------------------------------- */

function environmentVariablesFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The manifold pipe, its end flanges and two saddles. */
  faces.push(
    ...drumX(-66, 66, 0, 30, 9, {
      tone: "edge",
      topTone: "mid",
      group: "manifold",
    }),
    disc3(-66.4, 0, 30, 13, "yz", { tone: "mid", group: "manifold" }),
    disc3(66.4, 0, 30, 13, "yz", { tone: "mid", group: "manifold" }),
  );
  for (const x of [-42, 42]) {
    faces.push(
      ...box(x - 6, -10, 0, 12, 20, 22, {
        r: 3,
        tone: "mid",
        topTone: "lo",
      }),
    );
  }
  for (const x of [-30, 30]) {
    faces.push(
      ellipse3(x, 0, 30.2, 9.2, 9.2, { fill: false, tone: "lo" }),
    );
  }

  /* Four valve bodies with stems and horizontal handwheels. */
  const valves = [-40, -14, 14, 40];
  valves.forEach((x, index) => {
    const group = index === 2 ? "wheel-2" : "wheel";
    faces.push(
      ...cylinder(x, 0, 34, 13, 7.4, 6.6, {
        tone: "mid",
        topTone: "lo",
      }),
      post(x, 0, 46, 56, 2.4, "edge"),
      ellipse3(x, 0, 58, 11.4, 11.4, {
        fill: false,
        tone: index === 2 ? "hi" : "edge",
        group,
      }),
      ellipse3(x, 0, 58, 4.8, 4.8, {
        fill: false,
        tone: "lo",
        group,
      }),
    );
    for (let spoke = 0; spoke < 4; spoke += 1) {
      const a = (spoke / 4) * TAU + Math.PI / 8;
      faces.push(
        flatLine(
          x,
          0,
          x + Math.cos(a) * 11.4,
          Math.sin(a) * 11.4,
          58,
          "mid",
          group,
        ),
      );
    }
  });

  /* Two gauges on the front of the pipe, one needle bright. */
  for (const [x, group, accent] of [
    [-27, "needle-a", false],
    [27, "needle", true],
  ] as const) {
    faces.push(
      disc3(x, 9.6, 38, 8.6, "xz", { tone: "edge" }),
      disc3(x, 9.9, 38, 6.4, "xz", { tone: "lo" }),
    );
    for (let index = 0; index < 8; index += 1) {
      const a = (index / 8) * TAU;
      faces.push(
        face2(
          [
            iso(x + Math.cos(a) * 4.6, 10.1, 38 + Math.sin(a) * 4.6),
            iso(x + Math.cos(a) * 5.8, 10.1, 38 + Math.sin(a) * 5.8),
          ],
          { fill: false, tone: "lo" },
        ),
      );
    }
    faces.push(
      stroke2(
        [
          iso(x, 10.2, 38),
          iso(x + (accent ? 4.4 : 3.4), 10.2, 38 + (accent ? 4.2 : 3)),
        ],
        accent ? "hi" : "mid",
        { group },
      ),
    );
  }

  /* A row of little name plates along the pipe. */
  for (const x of valves) {
    faces.push(
      face3(
        [
          [x - 6, 9.4, 22],
          [x + 6, 9.4, 22],
          [x + 6, 9.4, 25],
          [x - 6, 9.4, 25],
        ],
        { fill: false, tone: "lo" },
      ),
    );
  }

  return faces;
}

export const environmentVariables: PrototypeMeta = {
  slug: "environment-variables",
  name: "Environment Variables",
  component: "Environment Variables",
  object: "Valve manifold",
  story:
    "One handwheel turns a notch and its gauge needle jumps before settling.",
  note: "Environment variables are valves on a manifold: labelled settings feeding one system.",
  scene: figureScene({
    slug: "environment-variables",
    name: "Environment Variables",
    component: "AI",
    object: "Valve manifold",
    description:
      "A valve manifold: a long pipe on two saddles, four valved branches with handwheels, two pressure gauges and name plates.",
    aria:
      "An isometric valve manifold with four handwheel valves on a pipe, two pressure gauges and engraved name plates.",
    faces: environmentVariablesFaces(),
    motions: [
      { group: "wheel-2", kind: "sway", period: 2800, amount: 0.16, pivot: [14, 0, 58] },
      { group: "needle", kind: "sway", period: 2600, amount: 0.3, pivot: [27, 10, 38] },
      { group: "wheel", kind: "breathe", period: 4600, amount: 0.01 },
      { kind: "breathe", period: 6000, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 166. File Tree — nested measuring cups                                     */
/* -------------------------------------------------------------------------- */

function fileTreeFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  const cups = [
    { x: -42, y: -10, h: 54, r0: 17, r1: 24, group: "cup-0", accent: false },
    { x: -14, y: -2, h: 44, r0: 14, r1: 20, group: "cup-1", accent: false },
    { x: 11, y: 5, h: 35, r0: 11, r1: 16, group: "cup-2", accent: false },
    { x: 32, y: 11, h: 27, r0: 8, r1: 12, group: "cup-3", accent: true },
  ];

  for (const cup of cups) {
    faces.push(
      ...cylinder(cup.x, cup.y, 0, cup.h, cup.r0, cup.r1, {
        tone: "edge",
        hollow: 2,
        topTone: "mid",
        bottomArc: true,
        group: cup.group,
      }),
    );
    /* D-shaped handle on the near side. */
    const hx = cup.x + cup.r1 * 0.55;
    const hy = cup.y + cup.r1 + 2.4;
    faces.push(
      tube(
        [
          [hx, hy - 3, cup.h * 0.74],
          [hx + 9, hy + 8, cup.h * 0.64],
          [hx - 3, hy + 7, cup.h * 0.34],
        ],
        2.6,
        { tone: cup.accent ? "hi" : "mid", group: cup.group },
      ),
    );
    /* Engraved measuring lines on the front. */
    for (const t of [0.32, 0.52, 0.72]) {
      const r = cup.r0 + (cup.r1 - cup.r0) * t;
      faces.push(
        stroke3(
          [
            [cup.x - r * 0.6, cup.y + r * 0.82, cup.h * t],
            [cup.x + r * 0.6, cup.y + r * 0.82, cup.h * t],
          ],
          t === 0.72 && cup.accent ? "hi" : "lo",
          { group: cup.group },
        ),
      );
    }
  }

  return faces;
}

export const fileTree: PrototypeMeta = {
  slug: "file-tree",
  name: "File Tree",
  component: "File Tree",
  object: "Nested measuring cups",
  story:
    "The cups lift out one by one, largest to smallest, until the bright little one is free.",
  note: "A file tree nests like measuring cups: each level is a smaller vessel inside the last.",
  scene: figureScene({
    slug: "file-tree",
    name: "File Tree",
    component: "Data",
    object: "Nested measuring cups",
    description:
      "Four measuring cups in a graded row, each with a D handle and engraved measurements, the smallest bright on its rim.",
    aria:
      "An isometric set of four nested measuring cups in graded sizes, each with a handle, the smallest cup bright.",
    faces: fileTreeFaces(),
    motions: [
      { group: "cup-0", kind: "lift", period: 4600, amount: 1.4, phase: 0 },
      { group: "cup-1", kind: "lift", period: 4600, amount: 1.8, phase: 0.16 },
      { group: "cup-2", kind: "lift", period: 4600, amount: 2.2, phase: 0.32 },
      { group: "cup-3", kind: "lift", period: 4600, amount: 2.8, phase: 0.48 },
      { kind: "breathe", period: 6000, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 167. Float — paper airplane                                                */
/* -------------------------------------------------------------------------- */

function floatFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  const nose: Point3 = [58, 0, 62];
  const tail: Point3 = [-42, 0, 44];
  const left: Point3 = [-26, 28, 26];
  const right: Point3 = [-26, -28, 26];
  const keel: Point3 = [-32, 0, 14];

  /* Far wing, keel, then the near wing: a clean folded dart. */
  faces.push(
    face3([nose, tail, right], { tone: "mid", group: "plane" }),
    face3([nose, tail, keel], { tone: "edge", group: "plane" }),
    face3([nose, tail, left], { tone: "edge", group: "plane" }),
    /* Tail fin. */
    face3(
      [
        [-40, 0, 44],
        [-52, 0, 58],
        [-28, 0, 48],
      ],
      { tone: "mid", group: "plane" },
    ),
  );

  /* Fold lines: the bright ridge and two wing creases. */
  faces.push(
    stroke3([nose, tail], "hi", { group: "plane" }),
    stroke3([nose, [-8, 18, 38]], "lo", { group: "plane" }),
    stroke3([nose, [-8, -18, 38]], "lo", { group: "plane" }),
    stroke3([[-24, 24, 30], [-34, 10, 34]], "lo", { group: "plane" }),
    stroke3([[-24, -24, 30], [-34, -10, 34]], "lo", { group: "plane" }),
  );

  /* Three air streaks behind the tail. */
  for (const [dy, dz, len] of [
    [-10, 4, 20],
    [0, -4, 26],
    [10, 2, 18],
  ] as const) {
    faces.push(
      stroke3(
        [
          [-48, dy, 52 + dz],
          [-48 - len, dy * 1.2, 52 + dz - 4],
        ],
        "lo",
        { group: "trail" },
      ),
    );
  }

  return faces;
}

export const float: PrototypeMeta = {
  slug: "float",
  name: "Float",
  component: "Float",
  object: "Paper airplane",
  story:
    "The paper plane banks on a current and lifts, the bright ridge leading the fold.",
  note: "Float is a paper plane: a light folded thing that rides the air above the page.",
  scene: figureScene({
    slug: "float",
    name: "Float",
    component: "Effects",
    object: "Paper airplane",
    description:
      "A folded paper airplane with two swept wings, a keel, a tail fin, a bright ridge fold and three air streaks behind.",
    aria:
      "An isometric paper airplane with swept wings, a keel and tail fin, a bright ridge and three air streaks behind it.",
    faces: floatFaces(),
    motions: [
      { group: "plane", kind: "sway", period: 4200, amount: 0.11, pivot: [0, 0, 42] },
      { group: "plane", kind: "bob", period: 3200, amount: 2.8 },
      { group: "trail", kind: "breathe", period: 3600, amount: 0.03 },
    ],
    press: 1.4,
  }),
};

/* -------------------------------------------------------------------------- */
/* 168. Guides — museum audio guide                                           */
/* -------------------------------------------------------------------------- */

function guidesFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The handset lying at a slight angle, with its raised keypad. */
  faces.push(
    ...box(-46, -28, 0, 82, 48, 10, {
      r: 6,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );
  /* Speaker slots and a small screen on top. */
  for (let line = 0; line < 3; line += 1) {
    faces.push(
      flatLine(-38, -18 + line * 4, -24, -18 + line * 4, 10.3, "lo"),
    );
  }
  faces.push(
    face2(
      [
        iso(-38, 6, 10.4),
        iso(-14, 6, 10.4),
        iso(-14, 20, 10.4),
        iso(-38, 20, 10.4),
      ],
      { tone: "lo", group: "screen" },
    ),
    stroke2(
      [
        iso(-34, 15, 10.6),
        iso(-20, 15, 10.6),
      ],
      "mid",
      { group: "screen" },
    ),
  );

  /* A three-by-four telephone keypad, one key lit. */
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const x = 10 + col * 10.5;
      const y = -20 + row * 9.6;
      const lit = row === 2 && col === 1;
      faces.push(
        ...box(x - 3.4, y - 3.4, 10, 6.8, 6.8, 2.2, {
          r: 1,
          tone: "mid",
          topTone: "lo",
          group: lit ? "key-5" : "keys",
        }),
      );
      faces.push(
        dotAt(x, y, 12.6, lit ? 1.3 : 0.9, lit ? "hi" : "lo", lit ? "key-5" : "keys"),
        stroke2(
          [
            iso(x - 1.8, y + 1.8, 12.6),
            iso(x + 1.8, y + 1.8, 12.6),
          ],
          "lo",
          { group: lit ? "key-5" : "keys" },
        ),
      );
    }
  }

  /* A slender pointing wand, clipped along the top right. */
  faces.push(
    ...tapered([36, 20, 12], [76, 30, 74], 2.4, 1.2, {
      tone: "edge",
      group: "wand",
    }),
    ...ball(76, 30, 74, 2.6, { tone: "hi", group: "wand" }),
    ...ball(36, 20, 12, 3.2, { tone: "mid", group: "wand" }),
  );

  /* Wrist strap loop at the left end. */
  faces.push(
    tube(
      [
        [-46, 4, 4],
        [-54, 10, 2],
        [-58, 2, 8],
        [-50, -2, 12],
      ],
      1.8,
      { tone: "mid" },
    ),
  );

  return faces;
}

export const guides: PrototypeMeta = {
  slug: "guides",
  name: "Guides",
  component: "Guides",
  object: "Museum audio guide",
  story:
    "The wand points at the exhibit and one number on the keypad answers with a light.",
  note: "A guide is a museum handset: a numbered keypad and a wand that points at what you see.",
  scene: figureScene({
    slug: "guides",
    name: "Guides",
    component: "Text",
    object: "Museum audio guide",
    description:
      "A museum audio guide handset with a speaker grille, a small screen, twelve raised keys and a slender pointing wand, one key bright.",
    aria:
      "An isometric museum audio guide with a speaker grille, a screen, twelve keys and a pointing wand, with one key lit bright.",
    faces: guidesFaces(),
    motions: [
      { group: "wand", kind: "sway", period: 3400, amount: 0.04, pivot: [36, 20, 12] },
      { group: "key-5", kind: "lift", period: 2400, amount: 0.8 },
      { group: "key-5", kind: "breathe", period: 2400, amount: 0.03 },
      { group: "screen", kind: "breathe", period: 4000, amount: 0.03 },
      { kind: "breathe", period: 6000, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 169. Hello Effect — sparkler                                               */
/* -------------------------------------------------------------------------- */

function helloEffectFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The handle, the stiff wire and the coated tip. */
  faces.push(
    ...cylinder(2, 0, 0, 18, 4, 3.4, {
      tone: "mid",
      topTone: "lo",
      bottomArc: true,
    }),
    tube(
      [
        [2, 0, 16],
        [0, 0, 46],
        [-3, 0, 76],
      ],
      2.2,
      { tone: "edge" },
    ),
    ...ball(-3, 0, 80, 5.4, { tone: "edge", group: "tip" }),
    ...ball(-2, 2, 83, 3.4, { tone: "mid", group: "tip" }),
  );

  /* A burst of sparks around the tip and a few falling embers. */
  const [bx, by] = iso(-3, 0, 81);
  for (let index = 0; index < 14; index += 1) {
    const a = (index / 14) * TAU + 0.18;
    const r = 12 + (index % 3) * 5;
    const sx = bx + Math.cos(a) * r * 0.9;
    const sy = by + Math.sin(a) * r * 0.62;
    faces.push(
      stroke2(
        [
          [bx + Math.cos(a) * 6, by + Math.sin(a) * 4],
          [sx, sy],
        ],
        index % 4 === 0 ? "hi" : "lo",
        { group: "sparks" },
      ),
    );
  }
  for (let index = 0; index < 7; index += 1) {
    const dx = bx + 12 + index * 7;
    const dy = by + 20 + (index % 3) * 9;
    faces.push(
      face2(circle(dx, dy, index % 2 === 0 ? 1.5 : 1, 10), {
        tone: index % 3 === 0 ? "hi" : "lo",
        group: "sparks",
      }),
    );
  }

  return faces;
}

export const helloEffect: PrototypeMeta = {
  slug: "hello-effect",
  name: "Hello Effect",
  component: "Hello Effect",
  object: "Sparkler",
  story:
    "The tip catches, throws a crown of sparks and lets a few embers fall away.",
  note: "A hello effect is a sparkler: a short burst of energy that lights everything near it.",
  scene: figureScene({
    slug: "hello-effect",
    name: "Hello Effect",
    component: "Effects",
    object: "Sparkler",
    description:
      "A sparkler with a wrapped handle, a bent wire and a bright coated tip throwing fourteen sparks and seven falling embers.",
    aria:
      "An isometric sparkler with a wrapped handle, a bent wire and a bright tip in a burst of sparks and falling embers.",
    faces: helloEffectFaces(),
    motions: [
      { group: "tip", kind: "flicker", period: 520, amount: 0.24 },
      { group: "sparks", kind: "breathe", period: 1200, amount: 0.08 },
      { group: "sparks", kind: "bob", period: 1600, amount: 1.6 },
      { kind: "sway", period: 5200, amount: 0.02, pivot: [2, 0, 0] },
    ],
    press: 1.2,
  }),
};

/* -------------------------------------------------------------------------- */
/* 170. Inline Citation — quotation card on a stand                           */
/* -------------------------------------------------------------------------- */

function inlineCitationFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Front slope parameter: u across, v up the panel. */
  const front = (u: number, v: number): Point3 => [u, 20 * (1 - v), 44 * v];
  const back = (u: number, v: number): Point3 => [u, -20 * (1 - v), 44 * v];

  /* Two leaning panels joined at the ridge, with side gussets. */
  faces.push(
    face3([back(-32, 0), back(32, 0), back(32, 1), back(-32, 1)], {
      tone: "mid",
      group: "card",
    }),
    face3([front(-32, 0), front(32, 0), front(32, 1), front(-32, 1)], {
      tone: "edge",
      group: "card",
    }),
    face3([front(-32, 0), back(-32, 0), back(-32, 1)], {
      tone: "lo",
      group: "card",
    }),
    face3([front(32, 0), back(32, 0), back(32, 1)], {
      tone: "lo",
      group: "card",
    }),
  );

  /* A pair of quotation marks in bright ink. */
  for (const u of [-16, -6]) {
    faces.push(
      stroke3(
        [
          front(u, 0.72),
          front(u + 2, 0.6),
          front(u + 1, 0.5),
        ],
        "hi",
        { group: "quote" },
      ),
      stroke3(
        [
          front(u + 3, 0.72),
          front(u + 5, 0.6),
          front(u + 4, 0.5),
        ],
        "hi",
        { group: "quote" },
      ),
    );
  }
  /* Ruled lines of the quotation. */
  for (const [v, w, tone] of [
    [0.42, 22, "mid"],
    [0.31, 26, "lo"],
    [0.2, 18, "lo"],
  ] as const) {
    faces.push(
      stroke3([front(-20, v), front(-20 + w, v)], tone, {
        group: "card",
      }),
    );
  }

  /* The little easel lip at the bottom of the front panel. */
  faces.push(
    ...box(-20, 18, 0, 40, 5, 3, {
      r: 1,
      tone: "mid",
      topTone: "lo",
      group: "card",
    }),
  );

  return faces;
}

export const inlineCitation: PrototypeMeta = {
  slug: "inline-citation",
  name: "Inline Citation",
  component: "Inline Citation",
  object: "Quotation card on a stand",
  story:
    "The card lifts off its easel lip and turns its bright quotation marks to the reader.",
  note: "An inline citation is a quotation card: a voice held up beside the text, then set down.",
  scene: figureScene({
    slug: "inline-citation",
    name: "Inline Citation",
    component: "AI",
    object: "Quotation card on a stand",
    description:
      "A tent-shaped quotation card on an easel lip, with bright quotation marks and three ruled lines on its front panel.",
    aria:
      "An isometric quotation card standing on a small easel lip, with bright quotation marks and three ruled lines.",
    faces: inlineCitationFaces(),
    motions: [
      { group: "card", kind: "sway", period: 3600, amount: 0.035, pivot: [0, 0, 44] },
      { group: "card", kind: "lift", period: 3600, amount: 1.4 },
      { group: "quote", kind: "breathe", period: 2800, amount: 0.03 },
      { kind: "breathe", period: 6000, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 171. Keyboard Table — telephone keypad plate                               */
/* -------------------------------------------------------------------------- */

function rotatedRect(
  cx: number,
  cy: number,
  w: number,
  d: number,
  angle: number,
): Point2[] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return (
    [
      [-w / 2, -d / 2],
      [w / 2, -d / 2],
      [w / 2, d / 2],
      [-w / 2, d / 2],
    ] as const
  ).map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c] as Point2);
}

function keyboardTableFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The plate: a clean metal keypad, thicker than a card. */
  faces.push(
    ...box(-42, -34, 0, 84, 68, 9, {
      r: 4,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );

  /* Twelve keys with a simple engraved mark, one lit. */
  const xs = [-22, 0, 22];
  const ys = [-20, -6, 8, 22];
  ys.forEach((y, row) => {
    xs.forEach((x, col) => {
      const lit = row === 1 && col === 1;
      faces.push(
        ...box(x - 6, y - 6, 9, 12, 12, 3, {
          r: 1.8,
          tone: "mid",
          topTone: "lo",
          group: lit ? "key-5" : "keys",
        }),
      );
      faces.push(
        dotAt(x, y - 2, 12.4, 1.2, lit ? "hi" : "lo", lit ? "key-5" : "keys"),
        stroke2(
          [
            iso(x - 2.4, y, 12.4),
            iso(x + 2.4, y, 12.4),
          ],
          lit ? "hi" : "lo",
          { group: lit ? "key-5" : "keys" },
        ),
        stroke2(
          [
            iso(x, y - 2.4, 12.4),
            iso(x, y + 2.4, 12.4),
          ],
          "lo",
          { group: lit ? "key-5" : "keys" },
        ),
      );
    });
  });

  /* Speaker slots and a small index label at the head of the plate. */
  for (let line = 0; line < 3; line += 1) {
    faces.push(
      flatLine(-34, -27 + line * 4, -26, -27 + line * 4, 9.3, "lo"),
    );
  }
  faces.push(
    face3(
      [
        [28, -30, 9.2],
        [38, -30, 9.2],
        [38, -30, 15],
        [28, -30, 15],
      ],
      { fill: false, tone: "lo" },
    ),
  );

  /* A coiled cord looping away to the left. */
  const cord: Point3[] = [];
  for (let index = 0; index <= 60; index += 1) {
    const t = index / 60;
    const a = t * Math.PI * 7;
    cord.push([
      -44 - t * 20 + Math.cos(a) * 5.4,
      -10 - t * 4 + Math.sin(a) * 8,
      5 + Math.sin(a * 0.5) * 3,
    ]);
  }
  faces.push(tube(cord, 1.9, { tone: "edge", group: "cord" }));

  return faces;
}

export const keyboardTable: PrototypeMeta = {
  slug: "keyboard-table",
  name: "Keyboard Table",
  component: "Keyboard Table",
  object: "Telephone keypad plate",
  story:
    "One key sinks under the finger and lights, while the coiled cord stirs at the edge.",
  note: "A keyboard table is a keypad plate: a compact grid of characters, each in its own key.",
  scene: figureScene({
    slug: "keyboard-table",
    name: "Keyboard Table",
    component: "Data",
    object: "Telephone keypad plate",
    description:
      "A metal telephone keypad plate with twelve raised keys, a speaker grille and a coiled cord looping away to one side.",
    aria:
      "An isometric telephone keypad plate with twelve raised keys and a coiled cord, one key bright and pressed.",
    faces: keyboardTableFaces(),
    motions: [
      { group: "key-5", kind: "lift", period: 2400, amount: 0.9 },
      { group: "key-5", kind: "breathe", period: 2400, amount: 0.03 },
      { group: "cord", kind: "sway", period: 3200, amount: 0.03, pivot: [-44, -10, 5] },
      { group: "keys", kind: "breathe", period: 5200, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 172. Message Branch — railway fork                                         */
/* -------------------------------------------------------------------------- */

function branchPoint(t: number): Point3 {
  const mt = 1 - t;
  const x = mt * mt * 0 + 2 * mt * t * 26 + t * t * 54;
  const y = mt * mt * 0 + 2 * mt * t * 2 + t * t * 62;
  return [x, y, 4];
}

function messageBranchFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Offsets perpendicular to the branch tangent. */
  const tangent = (t: number): Point2 => {
    const a = branchPoint(Math.max(0, t - 0.01));
    const b = branchPoint(Math.min(1, t + 0.01));
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    return [dx / len, dy / len];
  };

  /* Main line: sleepers, then two rails. */
  for (let x = -64; x <= 4; x += 11) {
    faces.push(
      ...prism(rotatedRect(x, 0, 4, 24, 0), 0, 3, {
        tone: "mid",
        topTone: "lo",
      }),
    );
  }
  faces.push(
    tube(
      [
        [-66, -6, 3],
        [20, -6, 3],
      ],
      1.5,
      { tone: "edge" },
    ),
    tube(
      [
        [-66, 6, 3],
        [8, 6, 3],
      ],
      1.5,
      { tone: "edge" },
    ),
    tube(
      [
        [8, 6, 3],
        [64, 6, 3],
      ],
      1.5,
      { tone: "edge" },
    ),
    tube(
      [
        [20, -6, 3],
        [64, -6, 3],
      ],
      1.5,
      { tone: "edge" },
    ),
  );

  /* The diverging branch: curved sleepers and rails. */
  for (let index = 1; index <= 6; index += 1) {
    const t = index / 7;
    const p = branchPoint(t);
    const tan = tangent(t);
    const angle = Math.atan2(tan[1], tan[0]);
    faces.push(
      ...prism(rotatedRect(p[0], p[1], 4, 24, angle), 0, 3, {
        tone: "mid",
        topTone: "lo",
      }),
    );
  }
  /* Sleepers under the straight continuation complete the fork. */
  for (let x = 18; x <= 62; x += 11) {
    faces.push(
      ...prism(rotatedRect(x, 0, 4, 24, 0), 0, 3, {
        tone: "mid",
        topTone: "lo",
      }),
    );
  }
  for (const side of [-6, 6]) {
    const points: Point3[] = [];
    for (let index = 0; index <= 12; index += 1) {
      const t = index / 12;
      const p = branchPoint(t);
      const tan = tangent(t);
      const nx = -tan[1];
      const ny = tan[0];
      points.push([p[0] + nx * side, p[1] + ny * side, 3]);
    }
    faces.push(tube(points, 1.5, { tone: side === 6 ? "edge" : "mid" }));
  }

  /* Switch blades and the point lever. */
  faces.push(
    face3(
      [
        [2, 5, 4.2],
        [19, 2, 4.2],
      ],
      { fill: false, tone: "hi", group: "points" },
    ),
    face3(
      [
        [2, -5, 4.2],
        [14, -2, 4.2],
      ],
      { fill: false, tone: "mid", group: "points" },
    ),
    ...box(-4, 16, 0, 12, 8, 10, {
      r: 2,
      tone: "mid",
      topTone: "lo",
      group: "points",
    }),
    ...tapered([2, 20, 10], [7, 30, 30], 2.2, 1.8, {
      tone: "edge",
      group: "points",
    }),
    ...ball(7, 30, 32, 3.2, { tone: "hi", group: "points" }),
  );

  /* A wagon already on the new branch. */
  const w = branchPoint(0.55);
  const tan = tangent(0.55);
  const angle = Math.atan2(tan[1], tan[0]);
  const body = rotatedRect(w[0], w[1], 27, 14, angle);
  faces.push(
    ...prism(body, 6, 12, {
      tone: "edge",
      topTone: "mid",
      group: "wagon",
    }),
    face3(
      body.map(([x, y]) => [x, y, 18.3] as Point3),
      { fill: false, tone: "lo", group: "wagon" },
    ),
    stroke3(
      [
        [w[0] - Math.cos(angle) * 9, w[1] - Math.sin(angle) * 9, 18.4],
        [w[0] + Math.cos(angle) * 9, w[1] + Math.sin(angle) * 9, 18.4],
      ],
      "hi",
      { group: "wagon" },
    ),
  );
  for (const [dx, dy] of [
    [-9, -7],
    [9, -7],
    [-9, 7],
    [9, 7],
  ] as const) {
    const cx = w[0] + Math.cos(angle) * dx - Math.sin(angle) * dy;
    const cy = w[1] + Math.sin(angle) * dx + Math.cos(angle) * dy;
    faces.push(
      face2(circle(iso(cx, cy, 5.4)[0], iso(cx, cy, 5.4)[1], 2.8, 14), {
        tone: "mid",
        group: "wagon",
      }),
    );
  }

  return faces;
}

export const messageBranch: PrototypeMeta = {
  slug: "message-branch",
  name: "Message Branch",
  component: "Message Branch",
  object: "Railway fork",
  story:
    "The points snap over and the wagon rolls onto the new branch.",
  note: "A message branch is a railway fork: the same conversation can be sent down another track.",
  scene: figureScene({
    slug: "message-branch",
    name: "Message Branch",
    component: "AI",
    object: "Railway fork",
    description:
      "A railway turnout: a main line splitting into two, curved sleepers and rails, a point lever and a small wagon on the new branch.",
    aria:
      "An isometric railway fork with two diverging tracks, a point lever and a small wagon on the new branch.",
    faces: messageBranchFaces(),
    motions: [
      { group: "points", kind: "sway", period: 2600, amount: 0.09, pivot: [-4, 20, 4] },
      { group: "wagon", kind: "bob", period: 3200, amount: 1.6 },
      { group: "wagon", kind: "breathe", period: 4200, amount: 0.01 },
      { kind: "breathe", period: 6400, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 173. Message Scroller — scroll and case                                    */
/* -------------------------------------------------------------------------- */

function messageScrollerFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Wooden end knobs and the rolled parchment. */
  faces.push(
    ...drumY(-42, -34, -44, 16, 7, {
      tone: "mid",
      topTone: "lo",
      group: "roll",
    }, 20),
    ...drumY(34, 42, -44, 16, 7, {
      tone: "mid",
      topTone: "lo",
      group: "roll",
    }, 20),
    ...drumY(-34, 34, -44, 16, 16, {
      tone: "edge",
      topTone: "mid",
      group: "roll",
    }),
  );
  for (const y of [-24, -10, 4, 18]) {
    faces.push(
      face2(circleXZ(-44, y, 16, 16.2, 26), {
        fill: false,
        tone: "lo",
        group: "roll",
      }),
    );
  }

  /* The sheet unrolling to the right, with a lifted, curled edge. */
  faces.push(
    face3(
      [
        [-30, -30, 32],
        [-30, 30, 32],
        [38, 28, 16],
        [38, -28, 16],
      ],
      { tone: "edge", group: "sheet" },
    ),
  );
  const curl: Array<[(number), (number), (number), (number)]> = [
    [38, 28, 16, 30],
    [46, 26, 30, 29],
    [42, 22, 38, 28],
  ];
  let prev: [number, number, number, number] = [38, -28, 16, 30];
  let prevHigh: [number, number, number, number] = [38, 28, 16, 30];
  for (const [x, half, z, halfTop] of curl) {
    const a: Point3 = [prev[0], prev[1], prev[2]];
    const b: Point3 = [prev[0], prev[3], prev[2]];
    const c: Point3 = [x, halfTop, z];
    const d: Point3 = [x, half, z];
    faces.push(
      face3([a, b, c, d], {
        tone: z > 32 ? "mid" : "edge",
        group: "curl",
      }),
    );
    prev = [x, half, z, halfTop];
    prevHigh = [x, halfTop, z, z];
  }
  faces.push(
    stroke3(
      [
        [-30, 30.1, 32],
        [38, 28.1, 16],
        [46, 26.1, 30],
        [42, 22.1, 38],
      ],
      "hi",
      { group: "curl" },
    ),
  );

  /* Ruled text on the sheet, one bright line near the top. */
  for (let line = 0; line < 5; line += 1) {
    const y = -20 + line * 9.4;
    const t = (-20 + line * 9.4 + 28) / 56;
    const z0 = 32 - 16 * 0.1;
    faces.push(
      stroke3(
        [
          [-24, y, z0 - 2 - line * 0.6],
          [line === 0 ? 12 : 28, y, 16 + Math.abs(y) * 0.04],
        ],
        line === 0 ? "hi" : "lo",
        { group: "sheet" },
      ),
    );
    void t;
  }

  return faces;
}

export const messageScroller: PrototypeMeta = {
  slug: "message-scroller",
  name: "Message Scroller",
  component: "Message Scroller",
  object: "Scroll and case",
  story:
    "The scroll gives one turn on its rod and its loose edge curls under the light.",
  note: "A message scroller is a scroll: a long reading surface wound on a rod, turned as you go.",
  scene: figureScene({
    slug: "message-scroller",
    name: "Message Scroller",
    component: "AI",
    object: "Scroll and case",
    description:
      "A parchment scroll on a rod with two wooden knobs, partly unrolled to a long ruled sheet with a lifted, curled edge.",
    aria:
      "An isometric scroll on a wooden rod, partly unrolled into a ruled sheet with a bright edge and a curled end.",
    faces: messageScrollerFaces(),
    motions: [
      { group: "sheet", kind: "sway", period: 4200, amount: 0.018, pivot: [-44, 0, 20] },
      { group: "curl", kind: "sway", period: 3000, amount: 0.06, pivot: [38, 0, 16] },
      { group: "roll", kind: "breathe", period: 5200, amount: 0.008 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 174. Mic Selector — mixing console                                         */
/* -------------------------------------------------------------------------- */

function micSelectorFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  const slopeZ = (y: number) => 30 - ((y + 30) / 60) * 10;

  /* Console body with a sloped top: front low, back high. */
  faces.push(
    ...box(-58, -34, 0, 116, 68, 18, {
      r: 5,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
    face3(
      [
        [-54, -30, 30],
        [54, -30, 30],
        [54, 30, 20],
        [-54, 30, 20],
      ],
      { tone: "mid", group: "deck" },
    ),
    face3(
      [
        [54, -30, 18],
        [54, -30, 30],
        [54, 30, 20],
        [54, 30, 18],
      ],
      { tone: "lo" },
    ),
    face3(
      [
        [-54, -30, 18],
        [-54, -30, 30],
        [-54, 30, 20],
        [-54, 30, 18],
      ],
      { tone: "lo" },
    ),
  );

  /* Five channel faders, the centre one bright and raised. */
  const channels = [-40, -20, 0, 20, 40];
  channels.forEach((x, index) => {
    const accent = index === 2;
    const slotY0 = 2;
    const slotY1 = 26;
    faces.push(
      face3(
        [
          [x - 1.6, slotY0, slopeZ(slotY0) + 0.3],
          [x + 1.6, slotY0, slopeZ(slotY0) + 0.3],
          [x + 1.6, slotY1, slopeZ(slotY1) + 0.3],
          [x - 1.6, slotY1, slopeZ(slotY1) + 0.3],
        ],
        { fill: false, tone: "lo", group: accent ? "fader-2" : "faders" },
      ),
    );
    const capY = accent ? 8 : 18 - (index % 2) * 5;
    const capZ = slopeZ(capY);
    faces.push(
      ...box(x - 4.2, capY - 3, capZ, 8.4, 6, 4, {
        r: 1.4,
        tone: accent ? "edge" : "mid",
        topTone: accent ? "hi" : "lo",
        group: accent ? "fader-2" : "faders",
      }),
    );
    if (accent) {
      faces.push(
        face2(circle(iso(x + 8, -6, slopeZ(-6) + 1)[0], iso(x + 8, -6, slopeZ(-6) + 1)[1], 1.8, 12), {
          tone: "hi",
          group: "led",
        }),
      );
    }
  });

  /* Knob row near the back and jack sockets above it. */
  for (let index = 0; index < 8; index += 1) {
    const x = -46 + index * 13;
    const z = slopeZ(-20);
    faces.push(
      ellipse3(x, -20, z + 0.6, 3.4, 3.4, { tone: "mid" }),
      face2(
        [
          iso(x, -20, z + 4),
          iso(x + 2.2, -20, z + 4),
        ],
        { fill: false, tone: "lo" },
      ),
    );
  }
  for (let index = 0; index < 6; index += 1) {
    const x = -40 + index * 16;
    faces.push(
      ellipse3(x, -27, slopeZ(-27) + 0.6, 2.6, 2.6, {
        fill: false,
        tone: "lo",
      }),
    );
  }

  /* Two little meters on the deck. */
  for (const x of [-34, 34]) {
    faces.push(
      face3(
        [
          [x - 10, -6, slopeZ(-6) + 0.4],
          [x + 10, -6, slopeZ(-6) + 0.4],
          [x + 10, 0, slopeZ(0) + 0.4],
          [x - 10, 0, slopeZ(0) + 0.4],
        ],
        { fill: false, tone: "lo" },
      ),
      stroke3(
        [
          [x - 6, -1, slopeZ(-1) + 0.6],
          [x + (x < 0 ? 4 : 6), -1, slopeZ(-1) + 0.6],
        ],
        "mid",
      ),
    );
  }

  return faces;
}

export const micSelector: PrototypeMeta = {
  slug: "mic-selector",
  name: "Mic Selector",
  component: "Mic Selector",
  object: "Mixing console",
  story:
    "One fader rises, its channel light comes on and the metre needles lean.",
  note: "A mic selector is a mixing console: several inputs, one desk, each channel trimmed to taste.",
  scene: figureScene({
    slug: "mic-selector",
    name: "Mic Selector",
    component: "AI",
    object: "Mixing console",
    description:
      "A small mixing console with a sloped deck, five channel faders, eight knobs, jack sockets, two meters and one lit channel.",
    aria:
      "An isometric mixing console with five faders, eight knobs, jack sockets and two meters, one channel raised and lit.",
    faces: micSelectorFaces(),
    motions: [
      { group: "fader-2", kind: "lift", period: 2800, amount: 2.2 },
      { group: "led", kind: "flicker", period: 1600, amount: 0.16 },
      { group: "faders", kind: "breathe", period: 4800, amount: 0.006 },
      { group: "deck", kind: "breathe", period: 6000, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 175. Model Selector — gear stick                                           */
/* -------------------------------------------------------------------------- */

function modelSelectorFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Gearbox top plate with a rounded lip. */
  faces.push(
    ...box(-42, -32, 0, 84, 64, 8, {
      r: 6,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );

  /* Engraved H gate: two long slots and the cross slot. */
  for (const x of [-12, 12]) {
    faces.push(
      stroke3(
        [
          [x - 2.4, -22, 8.3],
          [x - 2.4, 22, 8.3],
        ],
        "mid",
      ),
      stroke3(
        [
          [x + 2.4, -22, 8.3],
          [x + 2.4, 22, 8.3],
        ],
        "mid",
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [-14.4, -2.4, 8.3],
        [14.4, -2.4, 8.3],
      ],
      "mid",
    ),
    stroke3(
      [
        [-14.4, 2.4, 8.3],
        [14.4, 2.4, 8.3],
      ],
      "mid",
    ),
    /* The selected detent is bright. */
    stroke3(
      [
        [12, 8, 8.4],
        [12, 18, 8.4],
      ],
      "hi",
      { group: "gate" },
    ),
  );

  /* Leather boot, collar and the lever. */
  faces.push(
    ...cylinder(0, 0, 8, 16, 8.4, 5.4, {
      tone: "mid",
      topTone: "lo",
      taperLines: 2,
    }),
    ...cylinder(0, 0, 24, 4, 5.4, 4.8, {
      tone: "edge",
      topTone: "mid",
    }),
    ...tapered([0, 0, 26], [14, 8, 66], 3.2, 2.4, {
      tone: "edge",
      group: "lever",
    }),
    ...ball(14, 8, 70, 8.2, { tone: "edge", group: "knob" }),
    ...ball(13, 7, 72.4, 4, { tone: "mid", group: "knob" }),
    face2(circle(iso(11, 6, 75)[0], iso(11, 6, 75)[1], 1.6, 12), {
      tone: "hi",
      group: "knob",
    }),
  );

  /* Two small bolts on the plate. */
  faces.push(
    dotAt(-34, -24, 8.4, 1.6, "mid"),
    dotAt(34, -24, 8.4, 1.6, "mid"),
  );

  return faces;
}

export const modelSelector: PrototypeMeta = {
  slug: "model-selector",
  name: "Model Selector",
  component: "Model Selector",
  object: "Gear stick",
  story:
    "The lever drops into the next detent and the knob settles, bright on top.",
  note: "A model selector is a gear stick: one lever moved through a fixed gate to choose a gear.",
  scene: figureScene({
    slug: "model-selector",
    name: "Model Selector",
    component: "AI",
    object: "Gear stick",
    description:
      "A gear lever in an H gate on a gearbox plate, with a leather boot, a bright detent and a round knob.",
    aria:
      "An isometric gear stick on a gearbox plate, with an engraved H gate, a leather boot and a round knob, one detent bright.",
    faces: modelSelectorFaces(),
    motions: [
      { group: "lever", kind: "sway", period: 3400, amount: 0.08, pivot: [0, 0, 8] },
      { group: "knob", kind: "breathe", period: 2600, amount: 0.02 },
      { group: "gate", kind: "breathe", period: 3000, amount: 0.03 },
      { kind: "breathe", period: 6000, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                  */
/* -------------------------------------------------------------------------- */

export const lot7Prototypes: PrototypeMeta[] = [
  marquee3d,
  navigationMenu,
  questionnaire,
  radioGroup,
  sandbox,
  schemaDisplay,
  skipNav,
  subagent,
  task,
  timer,
  treeView,
  typeTable,
  webPreview,
  anatomy,
  environmentVariables,
  fileTree,
  float,
  guides,
  helloEffect,
  inlineCitation,
  keyboardTable,
  messageBranch,
  messageScroller,
  micSelector,
  modelSelector,
];
