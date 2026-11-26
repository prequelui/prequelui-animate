/*
 * Linear v4 — lot 6 (components 126 to 150 of the object catalogue).
 *
 * Same rules as lots 1-5: one real-world object per component, authored from
 * scratch in the shared 2:1 axonometric space, no slab under the object and a
 * silhouette that still reads at 64 px. Faces are painted back to front and
 * filled with the plate tone, so a nearer face hides the construction behind
 * it while the 0.9 px outline stays clean.
 *
 * Twenty-three objects are new here. Safari and Generated Image are the two
 * catalogue entries whose study drawings already existed at the same level:
 * they are re-exported from the study set so the object stays unique to its
 * component instead of being drawn a second time.
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
  stroke2,
  stroke3,
  tube,
  type FaceOptions,
  type PrototypeMeta,
} from "./geom";
import { generatedImage, safari } from "./scenes";

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

/** Screen-space tapered horn between two projected points. */
function horn(
  from: Point2,
  to: Point2,
  r0: number,
  r1: number,
  opts: { tone?: DetailTone; mouthTone?: DetailTone; group?: string } = {},
  steps = 24,
): FigureFace[] {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const angle = Math.atan2(ny, nx);
  const faces: FigureFace[] = [
    face2(
      [
        [from[0] + nx * r0, from[1] + ny * r0],
        [to[0] + nx * r1, to[1] + ny * r1],
        [to[0] - nx * r1, to[1] - ny * r1],
        [from[0] - nx * r0, from[1] - ny * r0],
      ],
      { tone: opts.tone ?? "edge", group: opts.group },
    ),
    face2(ellipseRot(to[0], to[1], r1, r1 * 0.4, angle, steps), {
      tone: opts.mouthTone ?? "mid",
      group: opts.group,
    }),
    face2(ellipseRot(to[0], to[1], r1 * 0.6, r1 * 0.24, angle, steps), {
      fill: false,
      tone: "lo",
      group: opts.group,
    }),
  ];
  return faces;
}

/** Horizontal drum along x, with the near end cap and an engraved rim. */
function drumX(
  x0: number,
  x1: number,
  cy: number,
  cz: number,
  r: number,
  opts: { tone?: DetailTone; topTone?: DetailTone; group?: string; rim?: boolean } = {},
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
    arc.push([px + Math.cos(a) * r * 0.82, py - r * 0.16 + Math.sin(a) * r * 0.28]);
  }
  return [
    face2(circle(px, py, r, 24), { tone: "edge", ...opts }),
    face2(arc, { fill: false, tone: "lo", group: opts.group }),
  ];
}

/* -------------------------------------------------------------------------- */
/* 126. Sonner — letter rack                                                  */
/* -------------------------------------------------------------------------- */

function sonnerFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Two side cheeks and a slatted back: the rack holds letters upright. */
  faces.push(
    ...box(-42, -22, 0, 7, 44, 66, {
      r: 2.4,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(35, -22, 0, 7, 44, 66, {
      r: 2.4,
      tone: "edge",
      topTone: "mid",
    }),
  );
  faces.push(
    panel(-35, 35, -20, 6, 58, { tone: "mid" }),
    panel(-35, 35, -19.4, 6, 58, { fill: false, tone: "lo" }),
  );
  for (const z of [12, 34, 56]) {
    faces.push(
      ...box(-35, -21, z, 70, 4, 5, {
        r: 1.4,
        tone: "mid",
        topTone: "lo",
      }),
    );
  }

  /* Letters: flat cards leaning back in the slots, painted left to right. */
  const cards: Array<{ x: number; group?: string; accent?: boolean }> = [
    { x: -27 },
    { x: -9 },
    { x: 9 },
    { x: 27, group: "letter", accent: true },
  ];
  const lean = (z: number) => 10 + ((-10 - 10) * (z - 10)) / 48;
  for (const card of cards) {
    const { x } = card;
    faces.push(
      sheet(
        [x - 10, 10, 10],
        [x + 10, 10, 10],
        [x + 10, -10, 58],
        [x - 10, -10, 58],
        { tone: card.accent ? "edge" : "mid", group: card.group },
      ),
      sheet(
        [x + 3, 9.6, 56],
        [x + 10, 9.6, 57],
        [x + 10, -9.6, 60],
        [x + 3, -9.6, 59],
        { tone: "lo", group: card.group },
      ),
    );
    if (card.accent) {
      /* The nearest card is an envelope: a bright V flap fixes the reading. */
      faces.push(
        stroke3(
          [
            [x - 8, lean(54) - 0.2, 54],
            [x, lean(46) - 0.2, 46],
            [x + 8, lean(54) - 0.2, 54],
          ],
          "hi",
          { group: card.group },
        ),
        stroke3(
          [
            [x - 8, lean(46) - 0.2, 46],
            [x + 8, lean(46) - 0.2, 46],
          ],
          "mid",
          { group: card.group },
        ),
      );
    } else {
      for (const z of [32, 40, 48]) {
        faces.push(
          stroke3(
            [
              [x - 6.4, lean(z) - 0.2, z],
              [x + 6.4, lean(z) - 0.2, z],
            ],
            "lo",
            { group: card.group },
          ),
        );
      }
    }
  }

  /* Front lips hide the bottom of each card: the slots read immediately. */
  for (const z of [14, 36]) {
    faces.push(
      ...box(-36, 12, z, 72, 6, 5, {
        r: 1.4,
        tone: "edge",
        topTone: "mid",
        group: "rack",
      }),
    );
  }

  return faces;
}

export const sonner: PrototypeMeta = {
  slug: "sonner",
  name: "Sonner",
  component: "Sonner",
  object: "Letter rack",
  story:
    "A fresh letter slides into the front slot, the pile settles and its address line catches the light.",
  note: "A sonner stacks messages the way a rack files letters: newest in front, older ones behind.",
  scene: figureScene({
    slug: "sonner",
    name: "Sonner",
    component: "Feedback",
    object: "Letter rack",
    description:
      "A wooden letter rack with two side cheeks, three slats and four leaning letters, the nearest one bright on its address line.",
    aria:
      "An isometric letter rack holding four leaning letters in slotted shelves, with a bright address line on the nearest card.",
    faces: sonnerFaces(),
    motions: [
      { group: "letter", kind: "lift", period: 2800, amount: 3.2 },
      { group: "rack", kind: "breathe", period: 4800, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 127. Menubar — diner menu board rail                                       */
/* -------------------------------------------------------------------------- */

function menubarFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Wall rail and its two brackets. */
  faces.push(
    ...box(-60, -5, 88, 120, 9, 8, {
      r: 2,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );
  for (const x of [-48, 48]) {
    faces.push(
      tube(
        [
          [x, -5, 92],
          [x, -14, 92],
          [x, -14, 78],
        ],
        3,
        { tone: "mid" },
      ),
      ...cylinder(x, -14, 74, 5, 4.4, 4, { tone: "mid", topTone: "lo" }),
    );
  }

  /* Hooks and three hanging boards: a diner rail of titled panels. */
  const boards = [
    { x: -37, group: "board-0", accent: false },
    { x: 0, group: "board-1", accent: true },
    { x: 37, group: "board-2", accent: false },
  ];
  for (const board of boards) {
    faces.push(
      tube(
        [
          [board.x, 0, 88],
          [board.x, 0, 79],
        ],
        2.2,
        { tone: "mid" },
      ),
      face2(
        circleXZ(board.x, 0, 78.4, 2.6, 16),
        { fill: false, tone: "lo" },
      ),
    );
  }
  for (const board of boards) {
    const { x, group, accent } = board;
    faces.push(
      ...box(x - 15, -1.6, 30, 30, 3.2, 44, {
        r: 2.6,
        tone: "edge",
        topTone: "mid",
        group,
      }),
      panel(x - 15, x + 15, 0.1, 30, 74, {
        fill: false,
        tone: "lo",
        group,
      }),
    );
    /* Title band and lines of fare. */
    faces.push(
      sheet(
        [x - 11.5, 1.8, 65],
        [x + 11.5, 1.8, 65],
        [x + 11.5, 1.8, 71],
        [x - 11.5, 1.8, 71],
        { tone: accent ? "hi" : "mid", group },
      ),
    );
    for (let line = 0; line < 5; line += 1) {
      const z = 57 - line * 5.4;
      faces.push(
        stroke3(
          [
            [x - 10.4, 1.9, z],
            [x + (line % 2 === 0 ? 10.4 : 6.2), 1.9, z],
          ],
          "lo",
          { group },
        ),
      );
    }
    faces.push(
      stroke3(
        [
          [x - 10.4, 1.9, 34],
          [x + 10.4, 1.9, 34],
        ],
        "mid",
        { group },
      ),
    );
  }

  return faces;
}

export const menubar: PrototypeMeta = {
  slug: "menubar",
  name: "Menubar",
  component: "Menubar",
  object: "Diner menu board rail",
  story:
    "The centre board tips on its hooks and lifts its bright title, while the neighbours hang steady.",
  note: "A menubar is a rail of titled boards: each section opens without leaving the counter.",
  scene: figureScene({
    slug: "menubar",
    name: "Menubar",
    component: "Navigation",
    object: "Diner menu board rail",
    description:
      "A diner menu rail with two wall brackets, three hooks and three hanging menu boards, the centre one bright on its title band.",
    aria:
      "An isometric diner menu board rail with three hanging titled boards, the centre board bright and slightly tipped on its hooks.",
    faces: menubarFaces(),
    motions: [
      { group: "board-0", kind: "sway", period: 4200, amount: 0.035, pivot: [-37, 0, 79] },
      { group: "board-1", kind: "sway", period: 3200, amount: 0.055, pivot: [0, 0, 79] },
      { group: "board-2", kind: "sway", period: 4800, amount: 0.03, pivot: [37, 0, 79] },
    ],
    press: 0.9,
  }),
};

/* -------------------------------------------------------------------------- */
/* 128. Prompt Input — dictaphone                                             */
/* -------------------------------------------------------------------------- */

function promptInputFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Office body with a rounded top, a lip and four feet. */
  faces.push(
    ...box(-50, -30, 6, 100, 60, 22, {
      r: 7,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );
  for (const [x, y] of [
    [-43, -24],
    [43, -24],
    [-43, 24],
    [43, 24],
  ] as const) {
    faces.push(
      ...cylinder(x, y, 0, 6, 3.4, 3, { tone: "lo", topTone: "lo" }),
    );
  }

  /* The wax cylinder, its end wheels and its engraved grooves. */
  faces.push(
    ...drumX(-30, 30, 0, 38, 15, {
      tone: "edge",
      topTone: "mid",
      group: "drum",
    }),
    ...drumX(-34, -30, 0, 38, 11, {
      tone: "mid",
      topTone: "lo",
      group: "drum",
    }, 20),
    ...drumX(30, 34, 0, 38, 11, {
      tone: "mid",
      topTone: "lo",
      group: "drum",
    }, 20),
  );
  for (const x of [-20, -10, 0, 10, 20]) {
    const rim = circleYZ(x, 0, 38, 15.1, 22);
    faces.push(
      face2(rim.slice(0, 12), { fill: false, tone: "lo", group: "drum" }),
    );
  }

  /* Winding crank on the right end. */
  faces.push(
    tube(
      [
        [38, 0, 38],
        [45, 0, 38],
      ],
      2.6,
      { tone: "mid", group: "crank" },
    ),
    tube(
      [
        [45, 0, 38],
        [45, 0, 48],
      ],
      3,
      { tone: "edge", group: "crank" },
    ),
    ...cylinder(45, 0, 48, 6, 4.6, 3.8, {
      tone: "mid",
      topTone: "lo",
      group: "crank",
    }),
  );

  /* Speaking tube: a gooseneck rising from the left, with a bright mouthpiece. */
  faces.push(
    tube(
      [
        [-36, -22, 28],
        [-41, -29, 37],
        [-47, -33, 46],
      ],
      3.2,
      { tone: "edge", group: "tube" },
    ),
  );
  const mouth = iso(-50, -35, 49);
  faces.push(
    ...horn(
      iso(-47, -33, 46),
      mouth,
      4.4,
      7.6,
      { tone: "mid", mouthTone: "edge", group: "tube" },
      20,
    ),
    face2(ellipseRot(mouth[0], mouth[1], 3.4, 3.4, 0, 16), {
      tone: "hi",
      group: "tube",
    }),
  );

  /* A short row of control keys and a bright indicator. */
  for (let index = 0; index < 6; index += 1) {
    const x = -30 + index * 10;
    faces.push(
      face2(
        roundedRect(x - 3.4, 8, 6.8, 5, 1.4, 3).map(([px, py]) =>
          iso(px, py, 28.6),
        ),
        { tone: index === 2 ? "mid" : "lo", group: "keys" },
      ),
    );
  }
  faces.push(
    dotAt(38, -20, 28.8, 2.6, "hi"),
    dotAt(-38, -20, 28.8, 2.2, "lo"),
  );

  return faces;
}

export const promptInput: PrototypeMeta = {
  slug: "prompt-input",
  name: "Prompt Input",
  component: "Prompt Input",
  object: "Dictaphone",
  story:
    "The wax cylinder turns, the speaking tube trembles and the keys answer one by one.",
  note: "A prompt is dictated before it is processed: a short message captured whole.",
  scene: figureScene({
    slug: "prompt-input",
    name: "Prompt Input",
    component: "AI",
    object: "Dictaphone",
    description:
      "A desktop dictaphone with a rounded body, a horizontal wax cylinder, a winding crank, a gooseneck speaking tube and a row of keys.",
    aria:
      "An isometric dictaphone with a horizontal wax cylinder and grooves, a winding crank, a gooseneck speaking tube and a bright mouthpiece.",
    faces: promptInputFaces(),
    motions: [
      { group: "crank", kind: "spin", period: 3000, amount: 360, pivot: [38, 0, 38] },
      { group: "drum", kind: "breathe", period: 3000, amount: 0.004 },
      { group: "tube", kind: "sway", period: 3600, amount: 0.035, pivot: [-36, -22, 28] },
      { group: "keys", kind: "bob", period: 2200, amount: 0.7 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 129. Message — telegram slip                                               */
/* -------------------------------------------------------------------------- */

function messageFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The printed form the telegram is pasted on. */
  faces.push(
    flatCard(0, 0, 0, 108, 74, 3.4, { tone: "mid" }),
    face2(
      roundedRect(-48, -30, 96, 60, 2.6, 4).map(([x, y]) => iso(x, y, 0.4)),
      { fill: false, tone: "lo" },
    ),
  );
  for (let line = 0; line < 3; line += 1) {
    faces.push(
      flatLine(-44, 20 + line * 4.6, 28, 20 + line * 4.6, 0.6, "lo"),
    );
  }
  faces.push(dotAt(44, 24, 0.8, 3.2, "mid"));
  faces.push(
    face2(circleXZ(44, 24, 1, 2.2, 18), { fill: false, tone: "lo" }),
  );

  /* Narrow telegram band lying across the form, its right end curled up. */
  faces.push(
    sheet(
      [-46, -18, 0.8],
      [34, -18, 0.8],
      [34, 12, 0.8],
      [-46, 12, 0.8],
      { tone: "edge", group: "band" },
    ),
  );
  for (let line = 0; line < 4; line += 1) {
    const z = 4 + line * 4.4;
    faces.push(
      flatLine(-41, -8 + line * 4.4, 26, -8 + line * 4.4, 1.1,
        line === 1 ? "hi" : "lo", "band"),
    );
  }

  /* Curl: the loose end lifts, rolls and shows its underside. */
  faces.push(
    sheet(
      [34, -18, 0.8],
      [46, -18, 10],
      [46, 12, 10],
      [34, 12, 0.8],
      { tone: "edge", group: "curl" },
    ),
    sheet(
      [46, -18, 10],
      [42, -16, 18],
      [42, 10, 18],
      [46, 12, 10],
      { tone: "mid", group: "curl" },
    ),
  );
  faces.push(
    stroke3(
      [
        [34, -17.9, 1.2],
        [46, -17.9, 10.2],
        [42, -15.9, 18.2],
      ],
      "hi",
      { group: "curl" },
    ),
    ...(() => {
      const [cx, cy] = iso(42, -3, 18);
      return [
        face2(ellipseRot(cx, cy, 8.6, 3.2, -0.5, 22), {
          tone: "mid",
          group: "curl",
        }),
        face2(ellipseRot(cx, cy, 5.4, 1.9, -0.5, 20), {
          fill: false,
          tone: "lo",
          group: "curl",
        }),
      ];
    })(),
  );

  /* A bright priority tab folded over the left edge. */
  faces.push(
    sheet(
      [-52, -12, 0.9],
      [-46, -12, 0.9],
      [-46, 6, 0.9],
      [-52, 6, 0.9],
      { tone: "hi" },
    ),
    stroke3(
      [
        [-49, -8, 1.2],
        [-49, 2, 1.2],
      ],
      "lo",
    ),
  );

  return faces;
}

export const message: PrototypeMeta = {
  slug: "message",
  name: "Message",
  component: "Message",
  object: "Telegram slip",
  story:
    "The loose end of the telegram unrolls and its printed line darkens under the light.",
  note: "A message is a short strip of text pasted onto a form: delivered, not composed.",
  scene: figureScene({
    slug: "message",
    name: "Message",
    component: "AI",
    object: "Telegram slip",
    description:
      "A printed telegram form with a narrow pasted band, a curled loose end and a bright priority tab.",
    aria:
      "An isometric telegram form with a pasted paper band, a curled end, printed lines and a bright priority tab.",
    faces: messageFaces(),
    motions: [
      { group: "curl", kind: "sway", period: 3000, amount: 0.05, pivot: [34, 0, 1] },
      { group: "band", kind: "breathe", period: 4200, amount: 0.004 },
    ],
    press: 0.8,
  }),
};

/* -------------------------------------------------------------------------- */
/* 130. Terminal — teletype machine                                           */
/* -------------------------------------------------------------------------- */

function terminalFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Desk body, its lip and two rubber feet. */
  faces.push(
    ...box(-58, -34, 4, 116, 68, 18, {
      r: 7,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );
  for (const [x, y] of [
    [-48, 26],
    [48, 26],
  ] as const) {
    faces.push(
      ...cylinder(x, y, 0, 4, 4.4, 4, { tone: "lo", topTone: "lo" }),
    );
  }

  /* Sloped keyboard deck with three rows of keycaps. */
  faces.push(
    face3(
      [
        [-46, 4, 22],
        [46, 4, 22],
        [46, 28, 19],
        [-46, 28, 19],
      ],
      { tone: "mid" },
    ),
  );
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const x = -40 + col * 10;
      const y = 9 + row * 6.4;
      const z = 22 - ((y - 4) / 24) * 3;
      faces.push(
        face2(
          roundedRect(x - 3.4, y - 2.2, 6.8, 4.4, 1.2, 3).map(([px, py]) =>
            iso(px, py, z + 0.8),
          ),
          { tone: col === 4 && row === 1 ? "hi" : "lo", group: "keys" },
        ),
      );
    }
  }

  /* Paper roller at the back, with its side knobs and a crank. */
  faces.push(
    ...drumX(-36, 36, -16, 30, 11, {
      tone: "edge",
      topTone: "mid",
      group: "roller",
    }),
    ...drumX(-42, -36, -16, 30, 7, {
      tone: "mid",
      topTone: "lo",
      group: "roller",
    }, 20),
    ...drumX(36, 42, -16, 30, 7, {
      tone: "mid",
      topTone: "lo",
      group: "roller",
    }, 20),
  );
  faces.push(
    tube(
      [
        [42, -16, 30],
        [52, -16, 42],
      ],
      3,
      { tone: "edge", group: "crank" },
    ),
    ...cylinder(53, -16, 42, 5, 4, 3.4, {
      tone: "mid",
      topTone: "lo",
      group: "crank",
    }),
  );

  /* Paper rising from the roller, with a bright printed line. */
  faces.push(
    sheet(
      [-32, -18, 33],
      [32, -18, 33],
      [32, -18, 86],
      [-32, -18, 86],
      { tone: "edge", group: "paper" },
    ),
    sheet(
      [-32, -18, 86],
      [32, -18, 86],
      [30, -14, 94],
      [-30, -14, 94],
      { tone: "edge", group: "paper" },
    ),
  );
  for (let line = 0; line < 6; line += 1) {
    const z = 44 + line * 7;
    faces.push(
      stroke3(
        [
          [-26, -17.6, z],
          [line === 5 ? 8 : 26, -17.6, z],
        ],
        line === 1 ? "hi" : "lo",
        { group: "paper" },
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [-26, -17.4, 92],
        [16, -17.4, 92],
      ],
      "mid",
      { group: "paper" },
    ),
  );

  /* A small bell and a maker's plate on the front. */
  faces.push(
    ...ball(44, 26, 27, 5.4, { tone: "mid" }),
    panel(-20, 10, 27.4, 8, 14, { fill: false, tone: "lo" }),
  );

  return faces;
}

export const terminal: PrototypeMeta = {
  slug: "terminal",
  name: "Terminal",
  component: "Terminal",
  object: "Teletype machine",
  story:
    "The keys clack down in a wave and the roller feeds the paper up one printed line.",
  note: "A terminal is a teletype: commands typed on keys, answers printed line by line.",
  scene: figureScene({
    slug: "terminal",
    name: "Terminal",
    component: "AI",
    object: "Teletype machine",
    description:
      "A teletype machine with a sloped keyboard of keycaps, a paper roller with side knobs, a crank and a tall printed sheet.",
    aria:
      "An isometric teletype machine with a three-row keyboard, a paper roller, a side crank and a tall printed sheet with a bright line.",
    faces: terminalFaces(),
    motions: [
      { group: "keys", kind: "bob", period: 2200, amount: 0.9 },
      { group: "paper", kind: "lift", period: 3000, amount: 2.6 },
      { group: "crank", kind: "sway", period: 3000, amount: 0.16, pivot: [42, -16, 30] },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 131. QR Code — dot-matrix printer                                          */
/* -------------------------------------------------------------------------- */

function qrCodeFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Printer body with a paper slot and two rubber feet. */
  faces.push(
    ...box(-54, -36, 0, 108, 72, 24, {
      r: 6,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );
  for (const [x, y] of [
    [-44, 28],
    [44, 28],
  ] as const) {
    faces.push(
      ...cylinder(x, y, -5, 5, 4.6, 4, { tone: "lo", topTone: "lo" }),
    );
  }
  faces.push(
    ...box(-40, -32, 24, 80, 8, 4, {
      r: 2,
      tone: "mid",
      topTone: "lo",
    }),
  );

  /* Platen roller and the tall sheet feeding up behind it. */
  faces.push(
    ...drumX(-36, 36, -18, 30, 9, {
      tone: "edge",
      topTone: "mid",
      group: "roller",
    }),
    sheet(
      [-32, -20, 34],
      [32, -20, 34],
      [32, -20, 92],
      [-32, -20, 92],
      { tone: "edge", group: "paper" },
    ),
    sheet(
      [-32, -20, 92],
      [32, -20, 92],
      [29, -15, 100],
      [-29, -15, 100],
      { tone: "mid", group: "paper" },
    ),
  );

  /* The dot matrix: a quiet grid with one bright printed line. */
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const x = -24 + col * 6;
      const z = 40 + row * 5.4;
      const bright = row === 6 && col < 5;
      faces.push(
        dotAt(x, -19.6, z, bright ? 1.8 : 1.4, bright ? "hi" : "lo", "print"),
      );
    }
  }
  /* Three finder squares read as a code rather than as loose dots. */
  for (const [cx, cz] of [
    [-18, 70],
    [18, 70],
    [-18, 46],
  ] as const) {
    faces.push(
      face2(
        roundedRect(cx - 5, cz - 5, 10, 10, 1, 3).map(([px, py]) =>
          iso(px, -19.4, py),
        ),
        { fill: false, tone: "mid", group: "print" },
      ),
      face2(
        roundedRect(cx - 2.4, cz - 2.4, 4.8, 4.8, 0.6, 3).map(([px, py]) =>
          iso(px, -19.4, py),
        ),
        { tone: "mid", group: "print" },
      ),
    );
  }

  /* Gantry rails, the print head and its nozzle. */
  faces.push(
    tube(
      [
        [-48, -26, 78],
        [48, -26, 78],
      ],
      2.4,
      { tone: "mid" },
    ),
    tube(
      [
        [-48, -26, 78],
        [-48, -26, 96],
      ],
      3,
      { tone: "edge" },
    ),
    tube(
      [
        [48, -26, 78],
        [48, -26, 96],
      ],
      3,
      { tone: "edge" },
    ),
    tube(
      [
        [-48, -26, 96],
        [48, -26, 96],
      ],
      2.4,
      { tone: "mid" },
    ),
  );
  faces.push(
    ...box(-12, -33, 82, 26, 15, 10, {
      r: 2.4,
      tone: "edge",
      topTone: "mid",
      group: "head",
    }),
    ...box(-7, -30, 78, 15, 9, 5, {
      r: 1.4,
      tone: "mid",
      topTone: "lo",
      group: "head",
    }),
    post(0, -26, 72, 80, 3, "edge", "head"),
  );
  const [nx, ny] = iso(0, -26, 72);
  faces.push(
    face2(
      [
        [nx - 2.4, ny],
        [nx, ny + 4],
        [nx + 2.4, ny],
      ],
      { tone: "hi", group: "head" },
    ),
  );

  return faces;
}

export const qrCode: PrototypeMeta = {
  slug: "qr-code",
  name: "QR Code",
  component: "QR Code",
  object: "Dot-matrix printer",
  story:
    "The head sweeps the gantry and the dot grid gains a fresh bright line.",
  note: "A QR code is a printed matrix: a machine lays down dots until the pattern resolves.",
  scene: figureScene({
    slug: "qr-code",
    name: "QR Code",
    component: "Media",
    object: "Dot-matrix printer",
    description:
      "A dot-matrix printer with a platen roller, a tall sheet of dots and finder squares, and a print head on a gantry rail.",
    aria:
      "An isometric dot-matrix printer feeding a tall sheet of printed dots and finder squares, with a print head on a gantry rail.",
    faces: qrCodeFaces(),
    motions: [
      { group: "head", kind: "sway", period: 2600, amount: 0.07, pivot: [0, -26, 95] },
      { group: "paper", kind: "lift", period: 3600, amount: 2.2 },
      { group: "print", kind: "breathe", period: 2800, amount: 0.008 },
      { group: "roller", kind: "breathe", period: 3600, amount: 0.006 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 132. Separator — expansion joint                                           */
/* -------------------------------------------------------------------------- */

function separatorFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Two heavy deck slabs with a working gap between them. */
  faces.push(
    ...box(-54, -26, 0, 44, 52, 16, {
      r: 2.4,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
    ...box(10, -26, 0, 44, 52, 16, {
      r: 2.4,
      tone: "edge",
      topTone: "mid",
      lip: true,
      group: "slab-b",
    }),
  );
  for (const x of [-44, -20, 20, 44]) {
    faces.push(
      stroke3(
        [
          [x, 25.8, 1],
          [x, 25.8, 15],
        ],
        "lo",
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [-54, 26, 8],
        [-10, 26, 8],
      ],
      "lo",
    ),
    stroke3(
      [
        [10, 26, 8],
        [54, 26, 8],
      ],
      "lo",
      { group: "slab-b" },
    ),
  );

  /* The corrugated rubber seal: a folded wall spanning the gap. */
  const sealX = (z: number) => 5 * Math.sin(((z - 2) / 14) * Math.PI * 3);
  for (let row = 0; row < 7; row += 1) {
    const y0 = -22 + row * 6.4;
    const y1 = y0 + 6.4;
    for (let step = 0; step < 4; step += 1) {
      const z0 = 2 + step * 3.5;
      const z1 = z0 + 3.5;
      faces.push(
        sheet(
          [sealX(z0), y0, z0],
          [sealX(z0), y1, z0],
          [sealX(z1), y1, z1],
          [sealX(z1), y0, z1],
          { tone: step % 2 === 0 ? "edge" : "lo", group: "seal" },
        ),
      );
    }
  }
  faces.push(
    stroke3(
      [
        [0, -23, 16.2],
        [0, 23, 16.2],
      ],
      "hi",
      { group: "seal" },
    ),
    stroke3(
      [
        [sealX(9), -23, 9],
        [sealX(9), 23, 9],
      ],
      "lo",
      { group: "seal" },
    ),
  );

  /* Anchor bolts on both slab lips, one catching the light. */
  for (const [x, y] of [
    [-16, -18],
    [-16, 0],
    [-16, 18],
    [16, -18],
    [16, 0],
    [16, 18],
  ] as const) {
    faces.push(
      ...cylinder(x, y, 16, 3, 2.4, 2, {
        tone: "mid",
        topTone: x > 0 && y === 0 ? "hi" : "lo",
      }),
    );
  }

  return faces;
}

export const separator: PrototypeMeta = {
  slug: "separator",
  name: "Separator",
  component: "Separator",
  object: "Expansion joint",
  story:
    "The deck opens a fraction and the corrugated seal flexes, its bright edge stretching across the gap.",
  note: "A separator is a deliberate gap: two things held apart by a joint that can move.",
  scene: figureScene({
    slug: "separator",
    name: "Separator",
    component: "Layout",
    object: "Expansion joint",
    description:
      "Two concrete deck slabs separated by a working gap, bridged by a corrugated rubber seal and six anchor bolts.",
    aria:
      "An isometric expansion joint made of two deck slabs, a corrugated seal across the gap and six anchor bolts.",
    faces: separatorFaces(),
    motions: [
      { group: "seal", kind: "breathe", period: 3000, amount: 0.02 },
      { group: "slab-b", kind: "breathe", period: 4400, amount: 0.008 },
      { group: "seal", kind: "bob", period: 3000, amount: 0.6 },
    ],
    press: 0.9,
  }),
};

/* -------------------------------------------------------------------------- */
/* 133. Floating Panel — paper lantern                                        */
/* -------------------------------------------------------------------------- */

function lanternRadius(z: number) {
  if (z < 24) return 8 + ((z - 14) / 10) * 6;
  if (z < 48) return 14 + ((z - 24) / 24) * 14;
  if (z < 72) return 28;
  if (z < 96) return 28 - ((z - 72) / 24) * 14;
  return 14 - ((z - 96) / 6) * 5;
}

function floatingPanelFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The cord and its ceiling ring: the lantern hangs, nothing sits under it. */
  faces.push(
    post(0, 0, 108, 158, 1.4, "mid", "lantern"),
    face2(circleXZ(0, 0, 158, 4.2, 18), {
      fill: false,
      tone: "mid",
      group: "lantern",
    }),
    ...cylinder(0, 0, 102, 8, 7, 9, {
      tone: "edge",
      topTone: "mid",
      group: "lantern",
    }),
  );

  /* Five stacked sections give the barrel its bulge without a mask. */
  faces.push(
    ...cylinder(0, 0, 14, 10, 8, 14, {
      sides: 26,
      tone: "edge",
      topTone: "mid",
      group: "lantern",
    }),
    ...cylinder(0, 0, 24, 24, 14, 28, {
      sides: 26,
      tone: "edge",
      topTone: "mid",
      group: "lantern",
    }),
    ...cylinder(0, 0, 48, 24, 28, 28, {
      sides: 30,
      tone: "edge",
      topTone: "mid",
      group: "lantern",
    }),
    ...cylinder(0, 0, 72, 24, 28, 14, {
      sides: 26,
      tone: "edge",
      topTone: "mid",
      group: "lantern",
    }),
    ...cylinder(0, 0, 96, 6, 14, 9, {
      sides: 22,
      tone: "edge",
      topTone: "mid",
      group: "lantern",
    }),
  );

  /* Vertical ribs follow the same profile; two paper bands cross them. */
  for (let index = 0; index < 10; index += 1) {
    const a = (index / 10) * TAU;
    const points: Point3[] = [];
    for (let step = 0; step <= 12; step += 1) {
      const z = 14 + (step / 12) * 88;
      const r = lanternRadius(z) + 0.3;
      points.push([Math.cos(a) * r, Math.sin(a) * r, z]);
    }
    faces.push(
      tube(points, 0.9, {
        tone: "lo",
        group: "lantern",
        fill: false,
      }),
    );
  }
  for (const z of [40, 58, 76]) {
    faces.push(
      face2(circleXZ(0, 0, z, lanternRadius(z) + 0.2, 34), {
        fill: false,
        tone: "mid",
        group: "lantern",
      }),
    );
  }

  /* Bottom cap and tassel. */
  faces.push(
    ...cylinder(0, 0, 8, 6, 9, 7, {
      tone: "edge",
      topTone: "mid",
      group: "lantern",
    }),
    post(0, 0, -2, 8, 1.3, "mid", "tassel"),
    ...drumX(-4, 4, 0, -4, 4, {
      tone: "mid",
      topTone: "lo",
      group: "tassel",
    }, 14),
  );

  /* The one bright element: the candle showing through a paper panel. */
  const [gx, gy] = iso(0, 28.4, 60);
  faces.push(
    face2(
      [
        [gx, gy - 10],
        [gx + 4.6, gy],
        [gx, gy + 10],
        [gx - 4.6, gy],
      ],
      { tone: "hi", group: "glow" },
    ),
    face2(
      [
        [gx, gy - 5],
        [gx + 2.2, gy],
        [gx, gy + 5],
        [gx - 2.2, gy],
      ],
      { tone: "mid", group: "glow" },
    ),
  );

  return faces;
}

export const floatingPanel: PrototypeMeta = {
  slug: "floating-panel",
  name: "Floating Panel",
  component: "Floating Panel",
  object: "Paper lantern",
  story:
    "The lantern sways on its cord and the candle behind the paper breathes brighter.",
  note: "A floating panel hangs above the surface: present without displacing the room.",
  scene: figureScene({
    slug: "floating-panel",
    name: "Floating Panel",
    component: "Overlays",
    object: "Paper lantern",
    description:
      "A ribbed paper lantern hanging from a cord: a barrel body with paper bands, a bottom tassel and a bright candle glow.",
    aria:
      "An isometric paper lantern hanging from a cord, with ten ribs, three paper bands, a tassel and a bright candle glow.",
    faces: floatingPanelFaces(),
    motions: [
      { group: "lantern", kind: "sway", period: 4200, amount: 0.05, pivot: [0, 0, 158] },
      { group: "tassel", kind: "sway", period: 3200, amount: 0.16, pivot: [0, 0, 6] },
      { group: "glow", kind: "breathe", period: 2600, amount: 0.035 },
    ],
    press: 1.4,
  }),
};

/* -------------------------------------------------------------------------- */
/* 134. Hint — sticky note                                                    */
/* -------------------------------------------------------------------------- */

function hintFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Portrait note with the bottom-right corner cut away for the peel. */
  faces.push(
    face3(
      [
        [-36, 0, 0],
        [18, 0, 0],
        [36, 0, 18],
        [36, 0, 72],
        [-36, 0, 72],
      ],
      { tone: "edge", group: "note" },
    ),
  );
  /* Sticky band at the head, ruled lines and a margin. */
  faces.push(
    face3(
      [
        [-36, -0.5, 62],
        [36, -0.5, 62],
        [36, -0.5, 72],
        [-36, -0.5, 72],
      ],
      { tone: "mid", group: "note" },
    ),
  );
  for (let line = 0; line < 4; line += 1) {
    const z = 22 + line * 9;
    faces.push(
      stroke3(
        [
          [-30, 0.5, z],
          [30, 0.5, z],
        ],
        "lo",
        { group: "note" },
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [-29, 0.6, 16],
        [-29, 0.6, 58],
      ],
      "mid",
      { group: "note" },
    ),
  );

  /* Peeled flap: two faces lifted toward the viewer, with a bright fold. */
  faces.push(
    face3(
      [
        [18, 0, 0],
        [36, 0, 18],
        [29, 10, 10],
      ],
      { tone: "mid", group: "flap" },
    ),
    face3(
      [
        [18, 0, 0],
        [29, 10, 10],
        [21, 9, -2],
      ],
      { tone: "lo", group: "flap" },
    ),
    stroke3(
      [
        [18, 0.8, 0.4],
        [36, 0.8, 18],
      ],
      "mid",
      { group: "flap" },
    ),
  );

  /* Pushpin: shaft through the paper and a bright head. */
  faces.push(
    tube(
      [
        [0, 0, 68],
        [0, 7, 68],
      ],
      2.2,
      { tone: "edge" },
    ),
    ...ball(0, 11, 68, 2, { tone: "mid" }),
  );
  const [px, py] = iso(0, 11, 68);
  faces.push(
    face2(circle(px, py, 3.4, 16), { tone: "hi" }),
    face2(circle(px, py, 1.2, 12), { tone: "mid" }),
  );

  return faces;
}

export const hint: PrototypeMeta = {
  slug: "hint",
  name: "Hint",
  component: "Hint",
  object: "Sticky note",
  story:
    "The peeled corner lifts higher and the pinned note stirs on the wall.",
  note: "A hint is a sticky note: a small help you can read once and peel away.",
  scene: figureScene({
    slug: "hint",
    name: "Hint",
    component: "Feedback",
    object: "Sticky note",
    description:
      "A pinned sticky note with ruled lines, a sticky head band and a peeled bottom-right corner curling toward the reader.",
    aria:
      "An isometric sticky note pinned at the top, with ruled lines, a sticky band and a peeled lower-right corner.",
    faces: hintFaces(),
    motions: [
      { group: "flap", kind: "sway", period: 2600, amount: 0.11, pivot: [18, 0, 0] },
      { group: "note", kind: "breathe", period: 4200, amount: 0.003 },
      { group: "note", kind: "lift", period: 5000, amount: 0.8 },
    ],
    press: 0.8,
  }),
};

/* -------------------------------------------------------------------------- */
/* 135. Tour — guide flag                                                     */
/* -------------------------------------------------------------------------- */

function tourFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Short pole with a wrapped grip, a finial and a rubber foot. */
  faces.push(
    ...cylinder(0, 0, -3, 4, 4.6, 3.6, { tone: "lo", topTone: "lo" }),
    post(0, 0, 0, 102, 3.2, "edge", "pole"),
    ...cylinder(0, 0, 16, 28, 3.8, 3.6, {
      tone: "mid",
      topTone: "lo",
      group: "pole",
    }),
    ...ball(0, 0, 104, 4.2, { tone: "mid", group: "pole" }),
  );

  /* Sleeve and the flag: a wavy pennant with a swallowtail. */
  faces.push(
    ...cylinder(0, 0, 84, 15, 3.6, 3.8, {
      tone: "mid",
      topTone: "lo",
      group: "flag",
    }),
  );
  const top: Point3[] = [];
  const bottom: Point3[] = [];
  for (let index = 0; index <= 6; index += 1) {
    const t = index / 6;
    const x = 2 + t * 60;
    const wave = Math.sin(t * Math.PI * 1.7) * 3.6;
    top.push([x, wave, 104 - t * 2]);
    bottom.push([x, wave * 0.7, 80 + t * 5]);
  }
  faces.push(
    face3([...top, [48, 2.6, 91], ...bottom.reverse()], {
      tone: "edge",
      group: "flag",
    }),
  );
  /* Folded underside and one engraved seam. */
  const underTop: Point3[] = [];
  const underBottom: Point3[] = [];
  for (let index = 0; index <= 4; index += 1) {
    const t = index / 4;
    const x = 2 + t * 48;
    const wave = Math.sin(t * Math.PI * 1.7) * 3.6 + 4.4;
    underTop.push([x, wave, 103 - t * 2]);
    underBottom.push([x, wave * 0.7, 81 + t * 5]);
  }
  faces.push(
    face3([...underTop, ...underBottom.reverse()], {
      tone: "mid",
      group: "flag",
    }),
    stroke3(
      [
        [4, -1.5, 97],
        [26, 2.4, 95],
        [52, -0.6, 92],
      ],
      "lo",
      { group: "flag" },
    ),
  );

  /* A small bright emblem marks the guide without swallowing the pennant. */
  const [ex, ey] = iso(26, 2.6, 93);
  faces.push(
    face2(circle(ex, ey, 4.4, 18), { tone: "hi", group: "flag" }),
    face2(circle(ex, ey, 2.2, 14), { fill: false, tone: "lo", group: "flag" }),
  );

  return faces;
}

export const tour: PrototypeMeta = {
  slug: "tour",
  name: "Tour",
  component: "Tour",
  object: "Guide flag",
  story:
    "The pennant ripples at the top of the pole and its bright emblem turns toward the group.",
  note: "A tour is a guide flag: one raised marker that tells a group where to look next.",
  scene: figureScene({
    slug: "tour",
    name: "Tour",
    component: "Navigation",
    object: "Guide flag",
    description:
      "A guide's pennant on a short pole: a wrapped grip, a finial, a wavy swallowtail flag and a bright round emblem.",
    aria:
      "An isometric guide flag on a short pole with a grip, a finial and a wavy swallowtail pennant carrying a bright emblem.",
    faces: tourFaces(),
    motions: [
      { group: "flag", kind: "sway", period: 2600, amount: 0.05, pivot: [0, 0, 92] },
      { group: "pole", kind: "sway", period: 4600, amount: 0.018, pivot: [0, 0, 0] },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 136. Toggle Tooltip — retractable badge reel                               */
/* -------------------------------------------------------------------------- */

function toggleTooltipFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Belt clip: a spring loop hugging the back of the housing. */
  faces.push(
    tube(
      [
        [-6, -2, 82],
        [-4, -2, 98],
        [0, -2, 102],
        [4, -2, 98],
        [6, -2, 82],
      ],
      4.2,
      { tone: "mid" },
    ),
    tube(
      [
        [-5, -3.4, 88],
        [5, -3.4, 88],
      ],
      2.2,
      { tone: "lo" },
    ),
  );

  /* The reel housing: a thick disc facing the reader. */
  const back = circleXZ(0, -2, 70, 21, 32);
  const front = circleXZ(0, 8, 70, 21, 32);
  faces.push(
    face2(convexHull([...back, ...front]), { tone: "edge" }),
    face2(front, { tone: "mid" }),
    face2(circleXZ(0, 8.2, 70, 15.4, 28), { fill: false, tone: "lo" }),
    face2(circleXZ(0, 8.4, 70, 7.2, 22), { tone: "lo" }),
    face2(circleXZ(0, 8.6, 70, 3.2, 16), { tone: "hi" }),
  );
  /* Radial stamp marks on the housing face. */
  for (let index = 0; index < 6; index += 1) {
    const a = (index / 6) * TAU;
    faces.push(
      stroke2(
        [
          [iso(0, 8.5, 70)[0] + Math.cos(a) * 10, iso(0, 8.5, 70)[1] + Math.sin(a) * 10],
          [iso(0, 8.5, 70)[0] + Math.cos(a) * 14, iso(0, 8.5, 70)[1] + Math.sin(a) * 14],
        ],
        "lo",
      ),
    );
  }
  /* Exit slot and retractable strap. */
  faces.push(
    ...box(-6, 5, 47, 12, 6, 5, { r: 1.4, tone: "mid", topTone: "lo" }),
    tube(
      [
        [0, 8, 48],
        [4, 10, 34],
        [14, 11, 26],
      ],
      4.2,
      { tone: "edge", group: "strap" },
    ),
  );

  /* The badge at the end of the strap. */
  faces.push(
    ...box(12, 8, 0, 32, 2.6, 26, {
      r: 3,
      tone: "edge",
      topTone: "mid",
      group: "badge",
    }),
    sheet(
      [16, 11, 19],
      [40, 11, 19],
      [40, 11, 23],
      [16, 11, 23],
      { tone: "hi", group: "badge" },
    ),
  );
  for (const z of [12, 16]) {
    faces.push(
      stroke3(
        [
          [17, 11.1, z],
          [35, 11.1, z],
        ],
        "lo",
        { group: "badge" },
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [16, 11.2, 8],
        [24, 11.2, 8],
      ],
      "mid",
      { group: "badge" },
    ),
  );

  return faces;
}

export const toggleTooltip: PrototypeMeta = {
  slug: "toggle-tooltip",
  name: "Toggle Tooltip",
  component: "Toggle Tooltip",
  object: "Retractable badge reel",
  story:
    "The reel pays out a little strap and the badge swings into view before it is reeled back.",
  note: "A toggle tooltip is a badge reel: a label kept close, given slack only on request.",
  scene: figureScene({
    slug: "toggle-tooltip",
    name: "Toggle Tooltip",
    component: "Overlays",
    object: "Retractable badge reel",
    description:
      "A round retractable badge reel with a belt clip, a radial housing and a name badge hanging on a strap.",
    aria:
      "An isometric retractable badge reel with a belt clip and a bright hub, paying out a strap to a hanging name badge.",
    faces: toggleTooltipFaces(),
    motions: [
      { group: "strap", kind: "sway", period: 2800, amount: 0.08, pivot: [0, 8, 48] },
      { group: "badge", kind: "sway", period: 2800, amount: 0.1, pivot: [14, 10, 24] },
      { group: "badge", kind: "lift", period: 4200, amount: 1.8 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 137. Image Cropper — paper trimmer                                         */
/* -------------------------------------------------------------------------- */

function imageCropperFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The trimmer's own work board, with its measuring rail at the back. */
  faces.push(
    ...box(-58, -38, 0, 116, 76, 6, {
      r: 3,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
    ...box(-56, -36, 6, 112, 9, 4, {
      r: 2,
      tone: "mid",
      topTone: "lo",
    }),
  );
  for (let index = 0; index < 9; index += 1) {
    const x = -48 + index * 12;
    faces.push(
      stroke2(
        [
          iso(x, -36, 10.4),
          iso(x, -29, 10.4),
        ],
        index % 2 === 0 ? "lo" : "mid",
      ),
    );
  }

  /* Sheet with crop marks. */
  faces.push(
    flatCard(0, 4, 6.4, 88, 54, 1.4, { tone: "edge" }),
  );
  for (const [x0, y0, x1, y1] of [
    [-34, -20, -22, -20],
    [-34, -20, -34, -8],
    [22, -20, 34, -20],
    [34, -20, 34, -8],
    [-34, 14, -22, 14],
    [-34, 2, -34, 14],
    [22, 14, 34, 14],
    [34, 2, 34, 14],
  ] as const) {
    faces.push(
      flatLine(x0, y0, x1, y1, 6.8, "lo"),
    );
  }
  faces.push(
    flatLine(-34, 20, 34, 20, 6.9, "hi"),
    flatLine(-40, -24, 40, -24, 6.9, "mid"),
  );

  /* The swing arm and its blade, hinged on the rail. */
  const ax = 50;
  const ay = -32;
  const bx = -44;
  const by = 10;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * 3.6;
  const ny = (dx / len) * 3.6;
  faces.push(
    ...prism(
      [
        [ax + nx, ay + ny],
        [bx + nx, by + ny],
        [bx - nx, by - ny],
        [ax - nx, ay - ny],
      ],
      9,
      5,
      { tone: "edge", topTone: "mid", group: "arm" },
    ),
    ...cylinder(ax, ay, 14, 4, 5.2, 4.4, {
      tone: "mid",
      topTone: "lo",
      group: "arm",
    }),
    ...cylinder(bx, by, 14, 4, 4.2, 3.6, {
      tone: "mid",
      topTone: "lo",
      group: "arm",
    }),
    stroke3(
      [
        [ax, ay, 14.4],
        [bx, by, 14.4],
      ],
      "hi",
      { group: "arm" },
    ),
    ...box(-8, -14, 8, 18, 16, 7, {
      r: 2,
      tone: "mid",
      topTone: "lo",
      group: "arm",
    }),
  );

  return faces;
}

export const imageCropper: PrototypeMeta = {
  slug: "image-cropper",
  name: "Image Cropper",
  component: "Image Cropper",
  object: "Paper trimmer",
  story:
    "The arm swings down along the rail and leaves a clean bright edge on the sheet.",
  note: "Cropping is physical: one straight blade, one chosen edge, the rest falls away.",
  scene: figureScene({
    slug: "image-cropper",
    name: "Image Cropper",
    component: "Media",
    object: "Paper trimmer",
    description:
      "A paper trimmer with a marked work board, a measuring rail, a sheet with crop marks and a hinged blade arm.",
    aria:
      "An isometric paper trimmer with a measuring rail, a marked sheet and a hinged blade arm with a bright cutting edge.",
    faces: imageCropperFaces(),
    motions: [
      { group: "arm", kind: "sway", period: 3000, amount: 0.045, pivot: [50, -32, 10] },
      { group: "arm", kind: "lift", period: 3000, amount: -0.8 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 138. Pixel Image — mosaic panel                                            */
/* -------------------------------------------------------------------------- */

function pixelImageFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Two small feet and the framed backing: a panel, not a plinth. */
  faces.push(
    ...box(-32, -10, 0, 14, 20, 8, { r: 2, tone: "lo", topTone: "lo" }),
    ...box(18, -10, 0, 14, 20, 8, { r: 2, tone: "lo", topTone: "lo" }),
    face3(
      [
        [-50, 0, 8],
        [50, 0, 8],
        [50, 0, 112],
        [-50, 0, 112],
      ],
      { tone: "mid" },
    ),
  );
  /* Four frame bars with a bright inner bevel on top. */
  faces.push(
    panel(-50, 50, 1, 104, 112, { tone: "edge" }),
    panel(-50, 50, 1, 8, 16, { tone: "edge" }),
    panel(-50, -42, 1, 16, 104, { tone: "edge" }),
    panel(42, 50, 1, 16, 104, { tone: "edge" }),
    stroke3(
      [
        [-41, 1.4, 103],
        [41, 1.4, 103],
      ],
      "hi",
    ),
  );

  /* Tessera grid: six by six small tiles, a few turned as diamonds. */
  const turned = new Set(["1-2", "3-1", "4-4"]);
  const size = 11.4;
  for (let row = 0; row < 6; row += 1) {
    for (let col = 0; col < 6; col += 1) {
      const cx = -33 + col * 13.2;
      const cz = 22 + row * 13.2;
      const key = `${row}-${col}`;
      const tone: DetailTone =
        (row * 5 + col * 3) % 7 === 0
          ? "hi"
          : (row + col) % 3 === 0
            ? "edge"
            : (row + col) % 3 === 1
              ? "mid"
              : "lo";
      const group = turned.has(key) ? "turn" : undefined;
      if (turned.has(key)) {
        faces.push(
          face3(
            [
              [cx, 2, cz - size / 2],
              [cx + size / 2, 2, cz],
              [cx, 2, cz + size / 2],
              [cx - size / 2, 2, cz],
            ],
            { tone, group },
          ),
        );
      } else {
        faces.push(
          sheet(
            [cx - size / 2, 2, cz - size / 2],
            [cx + size / 2, 2, cz - size / 2],
            [cx + size / 2, 2, cz + size / 2],
            [cx - size / 2, 2, cz + size / 2],
            { tone, group },
          ),
        );
      }
    }
  }

  return faces;
}

export const pixelImage: PrototypeMeta = {
  slug: "pixel-image",
  name: "Pixel Image",
  component: "Pixel Image",
  object: "Mosaic panel",
  story:
    "Three tesserae turn and lift out of the grid, and the image sharpens a little.",
  note: "A pixel image is a mosaic: small tiles that only resolve into a picture at a distance.",
  scene: figureScene({
    slug: "pixel-image",
    name: "Pixel Image",
    component: "Media",
    object: "Mosaic panel",
    description:
      "A framed mosaic panel on two small feet, made of thirty-six tesserae, three of them turned as diamonds and one bright.",
    aria:
      "An isometric mosaic panel in a frame, with a grid of tesserae, three turned diamonds and one bright tile.",
    faces: pixelImageFaces(),
    motions: [
      { group: "turn", kind: "lift", period: 3200, amount: 1.8 },
      { group: "turn", kind: "breathe", period: 2600, amount: 0.02 },
    ],
    press: 0.9,
  }),
};

/* -------------------------------------------------------------------------- */
/* 139. Safari — hot-air balloon (study drawing, same object)                  */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* 140. iPhone — telephone handset                                            */
/* -------------------------------------------------------------------------- */

function iphoneFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Cradle base and its two saddles: the telephone's own body. */
  faces.push(
    ...box(-48, -16, 0, 96, 32, 8, {
      r: 4,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
  );
  for (const x of [-30, 30]) {
    faces.push(
      ...box(x - 8, -10, 8, 16, 20, 12, {
        r: 3,
        tone: "mid",
        topTone: "lo",
      }),
      sheet(
        [x - 8, 1, 20],
        [x + 8, 1, 20],
        [x + 6, 1, 14],
        [x - 6, 1, 14],
        { tone: "lo" },
      ),
    );
  }

  /* The handset: a curved bar with two cups. */
  faces.push(
    ...drumX(-42, -24, 0, 34, 9.6, {
      tone: "edge",
      topTone: "mid",
      group: "handset",
    }),
    ...drumX(24, 42, 0, 34, 9.6, {
      tone: "edge",
      topTone: "mid",
      group: "handset",
    }),
    tube(
      [
        [-26, 0, 38],
        [0, 0, 44],
        [26, 0, 38],
      ],
      8.6,
      { tone: "edge", group: "handset" },
    ),
    face2(circleXZ(-33, 0, 34, 6, 20), {
      fill: false,
      tone: "lo",
      group: "handset",
    }),
    face2(circleXZ(33, 0, 34, 6, 20), {
      fill: false,
      tone: "lo",
      group: "handset",
    }),
    stroke3(
      [
        [-38, -9.7, 31],
        [-28, -9.7, 31],
      ],
      "hi",
      { group: "handset" },
    ),
    stroke3(
      [
        [28, -9.7, 31],
        [38, -9.7, 31],
      ],
      "lo",
      { group: "handset" },
    ),
  );

  /* Coiled cord from the left cup down into the base. */
  const cord: Point3[] = [];
  const start: Point3 = [-36, 2, 25];
  const end: Point3 = [-20, 11, 7];
  for (let index = 0; index <= 48; index += 1) {
    const t = index / 48;
    const a = t * TAU * 5;
    cord.push([
      start[0] + (end[0] - start[0]) * t + Math.cos(a) * 4.6,
      start[1] + (end[1] - start[1]) * t + Math.sin(a) * 3.2,
      start[2] + (end[2] - start[2]) * t,
    ]);
  }
  faces.push(tube(cord, 1.5, { tone: "mid", group: "cord" }));

  /* Ring: two sound arcs above the right cup, bright. */
  for (const [radius, offset] of [
    [10, 0],
    [16, 3],
  ] as const) {
    const points: Point2[] = [];
    for (let index = 0; index <= 14; index += 1) {
      const a = -Math.PI * 0.35 + (index / 14) * Math.PI * 0.7;
      points.push(iso(44 + Math.cos(a) * radius, -2 + offset, 40 + Math.sin(a) * radius));
    }
    faces.push(
      face2(points, { fill: false, tone: "hi", group: "ring" }),
    );
  }

  return faces;
}

export const iphone: PrototypeMeta = {
  slug: "iphone",
  name: "iPhone",
  component: "iPhone",
  object: "Telephone handset",
  story:
    "The handset lifts off its cradle, the cord stretches and two bright ring arcs pulse.",
  note: "A phone is a handset on a cradle: the archetypal object of a personal call.",
  scene: figureScene({
    slug: "iphone",
    name: "iPhone",
    component: "Media",
    object: "Telephone handset",
    description:
      "A classic telephone handset with two cups, a curved bar, a coiled cord and a low cradle with two saddles.",
    aria:
      "An isometric telephone handset on a low cradle, with two cups, a coiled cord and two bright ring arcs.",
    faces: iphoneFaces(),
    motions: [
      { group: "handset", kind: "lift", period: 2600, amount: 4.2 },
      { group: "cord", kind: "sway", period: 3200, amount: 0.06, pivot: [-36, 2, 25] },
      { group: "ring", kind: "flicker", period: 2200, amount: 0.16 },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 141. Item — domino in a rack                                               */
/* -------------------------------------------------------------------------- */

function itemFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Wooden channel: two side cheeks, a back rail and a front lip. */
  faces.push(
    ...box(-52, -20, 0, 10, 40, 10, {
      r: 2.4,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(42, -20, 0, 10, 40, 10, {
      r: 2.4,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-52, -20, 10, 104, 7, 18, {
      r: 2,
      tone: "mid",
      topTone: "lo",
    }),
  );

  /* Four standing dominoes, pips engraved on their front faces. */
  const tiles = [
    { x: -36, group: undefined },
    { x: -12, group: undefined },
    { x: 12, group: undefined },
    { x: 36, group: "tile" },
  ];
  for (const tile of tiles) {
    const { x, group } = tile;
    faces.push(
      ...box(x - 9, -8, 10, 18, 4.6, 40, {
        r: 1.6,
        tone: "edge",
        topTone: "mid",
        group,
      }),
      stroke3(
        [
          [x - 8, -3.5, 30],
          [x + 8, -3.5, 30],
        ],
        "mid",
        { group },
      ),
    );
    const pips: Array<[number, number, boolean]> = [
      [-4.6, 38, false],
      [4.6, 34, false],
      [-4.6, 22, group !== undefined],
      [4.6, 18, false],
    ];
    for (const [dx, z, bright] of pips) {
      faces.push(
        dotAt(x + dx, -3.55, z, 2.1, bright ? "hi" : "lo", group),
      );
    }
  }

  /* Front lip drawn after the tiles so they sit inside the rack. */
  faces.push(
    ...box(-52, 10, 10, 104, 7, 13, {
      r: 2,
      tone: "edge",
      topTone: "mid",
    }),
  );
  for (let index = 0; index < 5; index += 1) {
    const x = -44 + index * 22;
    faces.push(
      stroke3(
        [
          [x, 10.2, 12],
          [x, 10.2, 21],
        ],
        "lo",
      ),
    );
  }

  return faces;
}

export const item: PrototypeMeta = {
  slug: "item",
  name: "Item",
  component: "Item",
  object: "Domino in a rack",
  story:
    "The end tile tips forward on its base and taps its neighbour, and the bright pip catches the light.",
  note: "An item is one domino in a rack: a unit that also belongs to the row around it.",
  scene: figureScene({
    slug: "item",
    name: "Item",
    component: "Data",
    object: "Domino in a rack",
    description:
      "A wooden domino rack holding four upright tiles with engraved pips, the end tile tipping forward under a bright pip.",
    aria:
      "An isometric domino rack with four upright tiles, engraved divider lines and pips, the end tile tipping forward.",
    faces: itemFaces(),
    motions: [
      { group: "tile", kind: "sway", period: 2600, amount: 0.09, pivot: [36, -6, 10] },
      { group: "tile", kind: "bob", period: 2600, amount: -1.2 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 142. Direction — weathervane                                               */
/* -------------------------------------------------------------------------- */

function directionFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Mast, pivot ball and the four fixed direction arms. */
  faces.push(
    post(0, 0, 0, 92, 3.6, "edge"),
    ...ball(0, 0, 94, 5, { tone: "mid" }),
    tube(
      [
        [-30, 0, 64],
        [30, 0, 64],
      ],
      2.8,
      { tone: "mid" },
    ),
    tube(
      [
        [0, -30, 64],
        [0, 30, 64],
      ],
      2.8,
      { tone: "mid" },
    ),
    face2(circleXZ(0, 0, 64, 4.2, 18), { tone: "lo" }),
  );
  /* Four small arrowheads mark the cardinal points. */
  for (const [tx, ty] of [
    [34, 0],
    [-34, 0],
    [0, 34],
    [0, -34],
  ] as const) {
    const baseX = tx === 0 ? 0 : Math.sign(tx) * 3;
    const baseY = ty === 0 ? 0 : Math.sign(ty) * 3;
    faces.push(
      face2(
        [
          iso(tx + baseX * 3, ty + baseY * 3, 64),
          iso(tx - baseY * 3 - baseX, ty + baseX * 3 - baseY, 64),
          iso(tx + baseY * 3 - baseX, ty - baseX * 3 - baseY, 64),
        ],
        { tone: "mid" },
      ),
    );
  }

  /* The free arrow at the top, with a vane and a bright point. */
  faces.push(
    tube(
      [
        [-42, 0, 92],
        [40, 0, 92],
      ],
      4.2,
      { tone: "edge", group: "arrow" },
    ),
    face2(
      [
        iso(40, 0, 92),
        iso(52, 0, 97),
        iso(40, 0, 102),
      ],
      { tone: "hi", group: "arrow" },
    ),
    sheet(
      [-42, 0, 84],
      [-34, 0, 84],
      [-34, 0, 100],
      [-42, 0, 100],
      { tone: "mid", group: "arrow" },
    ),
    stroke3(
      [
        [-38, -0.2, 86],
        [-38, -0.2, 98],
      ],
      "lo",
      { group: "arrow" },
    ),
    face2(circleXZ(0, 0, 92, 3.4, 16), {
      fill: false,
      tone: "mid",
      group: "arrow",
    }),
  );

  return faces;
}

export const direction: PrototypeMeta = {
  slug: "direction",
  name: "Direction",
  component: "Direction",
  object: "Weathervane",
  story:
    "The arrow swings across the four fixed arms, overshoots and settles into the wind.",
  note: "Direction is a weathervane: one free arrow read against four fixed points.",
  scene: figureScene({
    slug: "direction",
    name: "Direction",
    component: "Navigation",
    object: "Weathervane",
    description:
      "A weathervane on a slim mast: a pivot ball, four cardinal arms with arrowheads and a free arrow with a bright point.",
    aria:
      "An isometric weathervane with a slim mast, four cardinal arms and a free arrow with a bright point.",
    faces: directionFaces(),
    motions: [
      { group: "arrow", kind: "sway", period: 3600, amount: 0.22, pivot: [0, 0, 92] },
      { group: "arrow", kind: "bob", period: 5000, amount: -0.5 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 143. Menu Dock — ship's wheel                                              */
/* -------------------------------------------------------------------------- */

function menuDockFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* A short axle and mounting plate behind the wheel. */
  faces.push(
    tube(
      [
        [0, -8, 58],
        [0, -26, 58],
      ],
      6,
      { tone: "mid" },
    ),
    face2(circleXZ(0, -26, 58, 13, 26), { tone: "mid" }),
    face2(circleXZ(0, -25.8, 58, 8, 22), { fill: false, tone: "lo" }),
  );

  /* Eight spokes before the rim, so the rim hides their outer ends. */
  for (let index = 0; index < 8; index += 1) {
    const a = (index / 8) * TAU + Math.PI / 8;
    faces.push(
      tube(
        [
          [Math.cos(a) * 5, 0, 58 + Math.sin(a) * 5],
          [Math.cos(a) * 31, 0, 58 + Math.sin(a) * 31],
        ],
        4,
        { tone: "mid", group: "wheel" },
      ),
    );
  }

  /* Rim as a thick closed tube, with an engraved inner line. */
  const rim: Point3[] = [];
  for (let index = 0; index <= 40; index += 1) {
    const a = (index / 40) * TAU;
    rim.push([Math.cos(a) * 34, 0, 58 + Math.sin(a) * 34]);
  }
  faces.push(
    tube(rim, 7, { tone: "edge", group: "wheel" }),
    face2(
      rim.map(([x, , z]) => iso(x, 0, z)),
      { fill: false, tone: "lo", group: "wheel" },
    ),
  );

  /* Eight handles beyond the rim, each with a turned knob. */
  for (let index = 0; index < 8; index += 1) {
    const a = (index / 8) * TAU + Math.PI / 8;
    const inner: Point3 = [Math.cos(a) * 37, 0, 58 + Math.sin(a) * 37];
    const outer: Point3 = [Math.cos(a) * 48, 0, 58 + Math.sin(a) * 48];
    faces.push(
      tube([inner, outer], 4.4, { tone: "edge", group: "wheel" }),
    );
    const [kx, ky] = iso(outer[0], 0, outer[2]);
    faces.push(
      face2(circle(kx, ky, 4.2, 18), { tone: "mid", group: "wheel" }),
      face2(circle(kx, ky, 1.8, 12), { tone: "lo", group: "wheel" }),
    );
  }

  /* Hub: a thick disc with a bright centre. */
  faces.push(
    face2(convexHull([
      ...circleXZ(0, -4, 58, 10, 26),
      ...circleXZ(0, 5, 58, 10, 26),
    ]), { tone: "edge", group: "wheel" }),
    face2(circleXZ(0, 5.2, 58, 10, 26), { tone: "mid", group: "wheel" }),
    face2(circleXZ(0, 5.4, 58, 6.2, 22), { fill: false, tone: "lo", group: "wheel" }),
    face2(circleXZ(0, 5.6, 58, 3, 16), { tone: "hi", group: "wheel" }),
  );

  return faces;
}

export const menuDock: PrototypeMeta = {
  slug: "menu-dock",
  name: "Menu Dock",
  component: "Menu Dock",
  object: "Ship's wheel",
  story:
    "The wheel turns a quarter on its axle and each handle catches the light in turn.",
  note: "A menu dock is a ship's wheel: a compact ring of destinations you grip and turn.",
  scene: figureScene({
    slug: "menu-dock",
    name: "Menu Dock",
    component: "Navigation",
    object: "Ship's wheel",
    description:
      "A ship's wheel with eight handles, a thick rim, eight spokes, a bright hub and a short axle on a mounting plate.",
    aria:
      "An isometric ship's wheel with eight handles and spokes around a bright hub, mounted on a short axle.",
    faces: menuDockFaces(),
    motions: [
      { group: "wheel", kind: "spin", period: 9000, amount: 360 },
      { group: "wheel", kind: "sway", period: 4600, amount: 0.02 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 144. Limelight Nav — follow spot                                           */
/* -------------------------------------------------------------------------- */

function limelightNavFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Tripod foot and the column. */
  for (const [x, y] of [
    [-22, -12],
    [22, -12],
    [0, 22],
  ] as const) {
    faces.push(
      tube(
        [
          [0, 0, 10],
          [x, y, 0],
        ],
        3,
        { tone: "mid" },
      ),
      ...cylinder(x, y, -2, 3, 3.2, 2.6, { tone: "lo", topTone: "lo" }),
    );
  }
  faces.push(
    ...cylinder(0, 0, 10, 8, 7, 5.4, { tone: "mid", topTone: "lo" }),
    post(0, 0, 18, 46, 4, "edge"),
    ...ball(0, 0, 46, 5, { tone: "mid" }),
  );

  /* U-yoke around the lamp body. */
  for (const y of [-15, 15]) {
    faces.push(
      tube(
        [
          [0, y, 44],
          [0, y, 58],
          [-4, y, 64],
        ],
        3.4,
        { tone: "edge" },
      ),
      ...cylinder(0, y, 62, 5, 4, 3.4, { tone: "mid", topTone: "lo" }),
    );
  }

  /* Body: a long snout built as a screen-space horn between two projections. */
  const rear = iso(-28, 0, 56);
  const lens = iso(34, -8, 76);
  faces.push(
    ...horn(rear, lens, 10, 16, {
      tone: "edge",
      mouthTone: "mid",
      group: "lamp",
    }, 28),
  );
  const angle = Math.atan2(lens[1] - rear[1], lens[0] - rear[0]);
  faces.push(
    face2(ellipseRot(lens[0], lens[1], 14.6, 6.4, angle, 28), {
      fill: false,
      tone: "mid",
      group: "lamp",
    }),
    face2(ellipseRot(lens[0], lens[1], 4.6, 2.4, angle, 18), {
      tone: "hi",
      group: "lamp",
    }),
    face2(ellipseRot(rear[0], rear[1], 9.2, 4.4, angle, 22), {
      tone: "mid",
      group: "lamp",
    }),
  );
  /* Two side cooling fins and a rear grip. */
  for (const t of [0.28, 0.42]) {
    const x = rear[0] + (lens[0] - rear[0]) * t;
    const y = rear[1] + (lens[1] - rear[1]) * t;
    faces.push(
      stroke2(
        [
          [x, y - 11],
          [x, y + 11],
        ],
        "lo",
        { group: "lamp" },
      ),
    );
  }
  faces.push(
    tube(
      [
        [-30, 0, 56],
        [-42, 5, 61],
      ],
      4.2,
      { tone: "mid", group: "lamp" },
    ),
  );

  /* Narrow beam, drawn as open hairlines so it stays a drawing. */
  const bx = lens[0] + 8;
  const by = lens[1] - 4;
  faces.push(
    face2(
      [
        [bx, by - 7],
        [bx + 58, by - 44],
      ],
      { fill: false, tone: "lo", group: "lamp" },
    ),
    face2(
      [
        [bx, by + 7],
        [bx + 58, by - 22],
      ],
      { fill: false, tone: "lo", group: "lamp" },
    ),
    face2(ellipseRot(bx + 58, by - 33, 12, 5, -0.6, 18), {
      fill: false,
      tone: "lo",
      group: "lamp",
    }),
  );

  return faces;
}

export const limelightNav: PrototypeMeta = {
  slug: "limelight-nav",
  name: "Limelight Nav",
  component: "Limelight Nav",
  object: "Follow spot",
  story:
    "The snout swings on its yoke and the narrow beam sweeps while the iris opens.",
  note: "A limelight nav is a follow spot: attention made physical, kept on one moving target.",
  scene: figureScene({
    slug: "limelight-nav",
    name: "Limelight Nav",
    component: "Navigation",
    object: "Follow spot",
    description:
      "A theatrical follow spot on a tripod and column, with a U-yoke, a long snout, a bright iris and a narrow beam.",
    aria:
      "An isometric follow spot on a tripod, with a long snouted lamp in a yoke, a bright iris and a narrow hairline beam.",
    faces: limelightNavFaces(),
    motions: [
      { group: "lamp", kind: "sway", period: 3800, amount: 0.07, pivot: [0, 0, 50] },
      { group: "lamp", kind: "bob", period: 5200, amount: -0.6 },
    ],
    press: 1.1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 145. Link Overlay — carabiner                                              */
/* -------------------------------------------------------------------------- */

function linkOverlayFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The D-shaped body: a smooth left bulge and a flatter gate side. */
  const ringPoint = (a: number, k = 1): Point3 => {
    const c = Math.cos(a);
    const s = Math.sin(a);
    const rx = 26 - 4 * c;
    return [-4 + c * rx * k, 0, 50 + s * 42 * k];
  };
  const outer: Point3[] = [];
  const inner: Point3[] = [];
  const bevel: Point3[] = [];
  for (let index = 0; index < 32; index += 1) {
    const a = (index / 32) * TAU;
    outer.push(ringPoint(a));
    inner.push(ringPoint(a, 0.72));
    bevel.push(ringPoint(a, 0.62));
  }
  faces.push(
    face3(outer, { tone: "edge" }),
    face3(inner, { tone: "mid" }),
    face3(bevel, { fill: false, tone: "lo" }),
  );

  /* Gate on the right side: hinge at the top, nose at the bottom. */
  faces.push(
    tube(
      [
        [17, 2, 82],
        [17, 2, 20],
      ],
      5.2,
      { tone: "edge", group: "gate" },
    ),
    ...cylinder(17, 2, 84, 6, 5.4, 4.6, {
      tone: "mid",
      topTone: "lo",
      group: "gate",
    }),
    tube(
      [
        [17.2, 2.4, 26],
        [17.2, 2.4, 44],
      ],
      6.2,
      { tone: "mid", group: "gate" },
    ),
    ...cylinder(17, 2, 18, 4, 4.2, 3.4, {
      tone: "mid",
      topTone: "lo",
      group: "gate",
    }),
  );
  /* Bright hinge screw and a small notch on the spine. */
  faces.push(
    dotAt(17, 5.4, 84, 2.6, "hi"),
    stroke3(
      [
        [-30, 0.4, 46],
        [-24, 0.4, 50],
      ],
      "lo",
    ),
  );

  return faces;
}

export const linkOverlay: PrototypeMeta = {
  slug: "link-overlay",
  name: "Link Overlay",
  component: "Link Overlay",
  object: "Carabiner",
  story:
    "The spring gate swings open on its hinge, clears the nose and snaps back against the spine.",
  note: "A link overlay is a carabiner: a spring gate that connects two things without a knot.",
  scene: figureScene({
    slug: "link-overlay",
    name: "Link Overlay",
    component: "Overlays",
    object: "Carabiner",
    description:
      "A metal carabiner with a D-shaped body, an inner cut-out, a spring gate and a bright hinge screw.",
    aria:
      "An isometric carabiner with a thick D-shaped body, an inner opening and a spring gate with a bright hinge.",
    faces: linkOverlayFaces(),
    motions: [
      { group: "gate", kind: "sway", period: 2800, amount: 0.18, pivot: [17, 2, 84] },
      { group: "gate", kind: "bob", period: 5600, amount: -0.8 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 146. Frame — picture frame on a wire                                       */
/* -------------------------------------------------------------------------- */

function frameFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Hanging wire and its ring, drawn behind the frame. */
  faces.push(
    tube(
      [
        [-30, 0, 104],
        [0, 0, 138],
        [30, 0, 104],
      ],
      1.4,
      { tone: "mid", group: "hanger" },
    ),
    face2(circleXZ(0, 0, 140, 4.4, 18), {
      fill: false,
      tone: "mid",
      group: "hanger",
    }),
    ...ball(0, 0, 144, 2.4, { tone: "lo", group: "hanger" }),
  );

  /* The picture itself, then four frame bars in front of its edges. */
  faces.push(
    panel(-29, 29, -1, 14, 98, { tone: "mid", group: "hanger" }),
    stroke3(
      [
        [-29, -0.6, 52],
        [-12, -0.6, 74],
        [2, -0.6, 40],
        [18, -0.6, 66],
        [29, -0.6, 58],
      ],
      "lo",
      { group: "hanger" },
    ),
    stroke3(
      [
        [-24, -0.5, 30],
        [24, -0.5, 30],
      ],
      "lo",
      { group: "hanger" },
    ),
    face2(
      circleXZ(-14, -0.4, 78, 5, 18),
      { fill: false, tone: "mid", group: "hanger" },
    ),
  );
  faces.push(
    panel(-38, 38, 0, 96, 108, { tone: "edge", group: "hanger" }),
    panel(-38, 38, 0, 4, 16, { tone: "edge", group: "hanger" }),
    panel(-38, -28, 0, 16, 96, { tone: "edge", group: "hanger" }),
    panel(28, 38, 0, 16, 96, { tone: "edge", group: "hanger" }),
  );
  /* Mitres and the inner bevel, with one bright top edge. */
  for (const [x, z] of [
    [-33, 11],
    [33, 11],
    [-33, 101],
    [33, 101],
  ] as const) {
    faces.push(
      stroke3(
        [
          [x - 5, 0.4, z - 5],
          [x + 5, 0.4, z + 5],
        ],
        "lo",
        { group: "hanger" },
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [-28, 0.8, 96],
        [28, 0.8, 96],
      ],
      "hi",
      { group: "hanger" },
    ),
    stroke3(
      [
        [-28, 0.8, 16],
        [28, 0.8, 16],
      ],
      "lo",
      { group: "hanger" },
    ),
  );

  return faces;
}

export const frame: PrototypeMeta = {
  slug: "frame",
  name: "Frame",
  component: "Frame",
  object: "Picture frame on a wire",
  story:
    "The frame leans on its wire, swings once and settles with its bright top bevel catching the light.",
  note: "A frame is a boundary held from one point: it defines what is inside by leaving the rest out.",
  scene: figureScene({
    slug: "frame",
    name: "Frame",
    component: "Layout",
    object: "Picture frame on a wire",
    description:
      "A rectangular picture frame hanging from a wire and a ring, with mitred corners, a small landscape and a bright top bevel.",
    aria:
      "An isometric picture frame hanging from a wire and a ring, with a landscape inside and a bright top bevel.",
    faces: frameFaces(),
    motions: [
      { group: "hanger", kind: "sway", period: 4400, amount: 0.032, pivot: [0, 0, 140] },
      { group: "hanger", kind: "bob", period: 6200, amount: -0.5 },
    ],
    press: 0.9,
  }),
};

/* -------------------------------------------------------------------------- */
/* 147. Generated Image — 3D printer (study drawing, same object)              */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* 148. Label — peeling sticker                                               */
/* -------------------------------------------------------------------------- */

function labelFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Glossy backing liner, wider than the sticker. */
  faces.push(
    flatCard(0, 0, 0, 102, 70, 3, { tone: "mid" }),
    face2(
      roundedRect(-46, -30, 92, 60, 2.4, 4).map(([x, y]) => iso(x, y, 0.4)),
      { fill: false, tone: "lo" },
    ),
  );

  /* Sticker with the top-right corner cut away, printed bars underneath. */
  faces.push(
    face3(
      [
        [-44, -28, 0.9],
        [44, -28, 0.9],
        [44, 13, 0.9],
        [30, 28, 0.9],
        [-44, 28, 0.9],
      ],
      { tone: "edge", group: "sticker" },
    ),
    face2(
      (
        [
          [-39, -23],
          [39, -23],
          [39, 10],
          [27, 23],
          [-39, 23],
        ] as Point2[]
      ).map(([x, y]) => iso(x, y, 1.2)),
      { fill: false, tone: "lo", group: "sticker" },
    ),
  );
  for (const [y0, width] of [
    [-14, 66],
    [-8, 48],
    [-2, 58],
    [4, 34],
  ] as const) {
    faces.push(
      flatLine(-34, y0, -34 + width, y0, 1.3, "mid", "sticker"),
    );
  }
  faces.push(
    dotAt(-33, 5, 1.4, 3, "mid", "sticker"),
    dotAt(33, -18, 1.4, 2.4, "lo", "sticker"),
  );

  /* Peeled corner: the flap stands up off the liner, bright along its fold. */
  faces.push(
    face3(
      [
        [44, 13, 0.9],
        [30, 28, 0.9],
        [33, 22, 13],
      ],
      { tone: "mid", group: "flap" },
    ),
    face3(
      [
        [44, 13, 0.9],
        [33, 22, 13],
        [40, 17, 12],
      ],
      { tone: "lo", group: "flap" },
    ),
    stroke3(
      [
        [44, 13, 1.2],
        [30, 28, 1.2],
      ],
      "hi",
      { group: "flap" },
    ),
  );

  return faces;
}

export const label: PrototypeMeta = {
  slug: "label",
  name: "Label",
  component: "Label",
  object: "Peeling sticker",
  story:
    "The corner of the sticker peels off its liner and curls up, bright along the fold.",
  note: "A label is a sticker: a name applied to a surface, and lifted off when it no longer applies.",
  scene: figureScene({
    slug: "label",
    name: "Label",
    component: "Text",
    object: "Peeling sticker",
    description:
      "A glossy backing liner with a printed sticker peeling at its top-right corner, the fold catching a bright edge.",
    aria:
      "An isometric sticker on its glossy liner, with printed bars and a peeled upper-right corner curling upward.",
    faces: labelFaces(),
    motions: [
      { group: "flap", kind: "sway", period: 3000, amount: 0.08, pivot: [37, 20, 1] },
      { group: "sticker", kind: "lift", period: 4400, amount: 0.7 },
    ],
    press: 0.8,
  }),
};

/* -------------------------------------------------------------------------- */
/* 149. Listbox — pill organizer                                              */
/* -------------------------------------------------------------------------- */

function listboxFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The tray with a lip and a front clasp. */
  faces.push(
    ...box(-54, -34, 0, 108, 68, 15, {
      r: 7,
      tone: "edge",
      topTone: "mid",
      lip: true,
    }),
    ...box(-10, 32, 15, 20, 5, 5, { r: 1.6, tone: "mid", topTone: "lo" }),
  );
  /* Six compartments: one open and five closed. */
  const cells: Array<{ x: number; y: number; open?: boolean }> = [
    { x: -34, y: -15 },
    { x: 0, y: -15 },
    { x: 34, y: -15 },
    { x: -34, y: 15 },
    { x: 0, y: 15, open: true },
    { x: 34, y: 15 },
  ];
  for (const cell of cells) {
    if (cell.open) {
      faces.push(
        face2(
          roundedRect(cell.x - 15, cell.y - 13, 30, 24, 3, 4).map(([x, y]) =>
            iso(x, y, 15.4),
          ),
          { tone: "lo" },
        ),
        ...ball(cell.x, cell.y + 1, 20.4, 5.2, { tone: "mid" }),
        dotAt(cell.x, cell.y - 1.6, 23, 2.2, "hi"),
      );
      /* Open lid leaning back on its hinge at the rear edge. */
      faces.push(
        face3(
          [
            [cell.x - 15, cell.y - 13, 16],
            [cell.x + 15, cell.y - 13, 16],
            [cell.x + 15, cell.y - 17, 44],
            [cell.x - 15, cell.y - 17, 44],
          ],
          { tone: "edge", group: "lid" },
        ),
        face3(
          [
            [cell.x - 12, cell.y - 12.4, 18],
            [cell.x + 12, cell.y - 12.4, 18],
            [cell.x + 12, cell.y - 16.4, 41],
            [cell.x - 12, cell.y - 16.4, 41],
          ],
          { fill: false, tone: "lo", group: "lid" },
        ),
      );
      continue;
    }
    faces.push(
      ...box(cell.x - 15, cell.y - 13, 15, 30, 26, 4, {
        r: 3,
        tone: "edge",
        topTone: "mid",
        group: "closed",
      }),
      stroke3(
        [
          [cell.x - 11, cell.y + 12.6, 19],
          [cell.x + 11, cell.y + 12.6, 19],
        ],
        "lo",
        { group: "closed" },
      ),
    );
  }
  /* Dividing ridges between the columns. */
  for (const x of [-17, 17]) {
    faces.push(
      stroke3(
        [
          [x, -30, 15.6],
          [x, 30, 15.6],
        ],
        "lo",
      ),
    );
  }
  faces.push(
    stroke3(
      [
        [-50, 0, 15.6],
        [50, 0, 15.6],
      ],
      "lo",
    ),
  );

  return faces;
}

export const listbox: PrototypeMeta = {
  slug: "listbox",
  name: "Listbox",
  component: "Listbox",
  object: "Pill organizer",
  story:
    "One compartment lid stands open on its hinge while the others stay latched, and a bright pill waits inside.",
  note: "A listbox is a pill organizer: many discrete choices kept in one body, each behind its own lid.",
  scene: figureScene({
    slug: "listbox",
    name: "Listbox",
    component: "Data",
    object: "Pill organizer",
    description:
      "A rounded pill organizer with six compartments, five closed lids, one open lid standing on its hinge and a bright pill inside.",
    aria:
      "An isometric pill organizer with six compartments, five closed lids and one open lid revealing a bright pill.",
    faces: listboxFaces(),
    motions: [
      { group: "lid", kind: "sway", period: 2800, amount: 0.1, pivot: [0, 2, 16] },
      { group: "closed", kind: "breathe", period: 5200, amount: 0.002 },
    ],
    press: 0.9,
  }),
};

/* -------------------------------------------------------------------------- */
/* 150. Marker — paint roller                                                 */
/* -------------------------------------------------------------------------- */

function markerFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The fresh band on the wall: two wet edges, not a panel. */
  faces.push(
    stroke3(
      [
        [-56, 21.6, 14],
        [-56, 21.6, 88],
      ],
      "lo",
      { group: "paint" },
    ),
    stroke3(
      [
        [-20, 21.6, 18],
        [-14, 21.6, 34],
        [-18, 21.6, 48],
        [-12, 21.6, 64],
        [-17, 21.6, 78],
        [-22, 21.6, 88],
      ],
      "hi",
      { group: "paint" },
    ),
    stroke3(
      [
        [-52, 21.6, 40],
        [-22, 21.6, 40],
      ],
      "mid",
      { group: "paint" },
    ),
    stroke3(
      [
        [-52, 21.6, 66],
        [-20, 21.6, 66],
      ],
      "mid",
      { group: "paint" },
    ),
  );

  /* Roller cover on its axle: a broad drum with a nap texture. */
  faces.push(
    ...drumX(-22, 24, 0, 64, 13.5, {
      tone: "edge",
      topTone: "mid",
      group: "roller",
    }),
    face2(circleYZ(-22, 0, 64, 5.2, 18), { tone: "mid", group: "roller" }),
    face2(circleYZ(24, 0, 64, 5.2, 18), { tone: "mid", group: "roller" }),
  );
  for (const x of [-16, -8, 0, 8, 16]) {
    faces.push(
      stroke2(
        [iso(x, -13, 52), iso(x, -13, 76)],
        "lo",
        { group: "roller" },
      ),
    );
  }
  /* A wet lower edge on the cover. */
  faces.push(
    stroke2(
      [
        iso(-20, 4, 53.4),
        iso(-8, 8, 51.6),
        iso(6, 8, 51.6),
        iso(20, 4, 53.4),
      ],
      "mid",
      { group: "roller" },
    ),
  );

  /* Frame: the U support on the far side and the long handle on the near side. */
  faces.push(
    tube(
      [
        [-23, 0, 64],
        [-32, -4, 51],
      ],
      3.2,
      { tone: "mid", group: "frame" },
    ),
    tube(
      [
        [25, 0, 64],
        [36, 6, 58],
        [45, 13, 34],
        [48, 17, 17],
      ],
      4.6,
      { tone: "edge", group: "frame" },
    ),
    ...cylinder(48, 17, 3, 26, 6, 5.4, {
      tone: "mid",
      topTone: "lo",
      group: "frame",
    }),
    ...ball(48, 17, 31, 5, { tone: "mid", group: "frame" }),
  );

  return faces;
}

export const marker: PrototypeMeta = {
  slug: "marker",
  name: "Marker",
  component: "Marker",
  object: "Paint roller",
  story:
    "The roller presses against the wall and makes one more pass, its fresh edge catching the light.",
  note: "A marker is a paint roller: a broad, even band laid down in a single gesture.",
  scene: figureScene({
    slug: "marker",
    name: "Marker",
    component: "Text",
    object: "Paint roller",
    description:
      "A paint roller with a nap cover on its axle, an L-shaped frame and a grip, leaving one fresh bright-edged band on the wall.",
    aria:
      "An isometric paint roller with a nap cover, an L-shaped frame and grip, beside a fresh painted band with a bright edge.",
    faces: markerFaces(),
    motions: [
      { group: "roller", kind: "breathe", period: 2200, amount: 0.018 },
      { group: "frame", kind: "sway", period: 3200, amount: 0.025, pivot: [20, 0, 62] },
      { group: "paint", kind: "breathe", period: 4200, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                  */
/* -------------------------------------------------------------------------- */

export const lot6Prototypes: PrototypeMeta[] = [
  sonner,
  menubar,
  promptInput,
  message,
  terminal,
  qrCode,
  separator,
  floatingPanel,
  hint,
  tour,
  toggleTooltip,
  imageCropper,
  pixelImage,
  safari,
  iphone,
  item,
  direction,
  menuDock,
  limelightNav,
  linkOverlay,
  frame,
  generatedImage,
  label,
  listbox,
  marker,
];
