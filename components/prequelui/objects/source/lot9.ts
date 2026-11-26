/*
 * Linear v4 — Objects collection, part one (objects 8 to 32, ordinals 201-225).
 *
 * The first seven generic objects live in lot 8 (cake to key). This file
 * continues the collection with padlock, envelope, lightbulb, book, camera,
 * headphones, clock, globe, trophy, umbrella, hourglass, compass, magnifier,
 * donut, ice cream, mushroom, flower, tree, leaf, sun, moon, five-point star,
 * cloud, teapot and kettle.
 *
 * Every drawing is authored from scratch for this study: one real object per
 * entry, no base slab, a silhouette that reads at 64 px, the same 2:1
 * axonometric space and the same engraved hairline as lots 1-8.
 */

import type { FigureFace, Point2, Point3 } from "./engine";
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
  stroke2,
  stroke3,
  type PrototypeMeta,
} from "./geom";
import {
  TAU,
  ball,
  circleYZ,
  dome,
  dotAt,
  drumX,
  ellipseRot,
  flatCard,
  frontRing,
  leaf,
  loop,
  panel,
  petalRing,
  post,
  quad,
  star,
  tapered,
  tube,
} from "./objectKit";

/* -------------------------------------------------------------------------- */
/* Local helpers                                                              */
/* -------------------------------------------------------------------------- */

/** Screen-space centre of a 3D point. */
function at(x: number, y: number, z: number): Point2 {
  return iso(x, y, z);
}

/** Point along a ray from (cx, cy) at `angle`, `t` units out. */
function ray(cx: number, cy: number, angle: number, t: number): Point2 {
  return [cx + Math.cos(angle) * t, cy + Math.sin(angle) * t];
}

/* -------------------------------------------------------------------------- */
/* 201. Padlock — padlock with a shackle                                      */
/* -------------------------------------------------------------------------- */

function padlockFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The shackle is painted first so the body hides its legs. */
  faces.push(
    tube(
      [
        [-17, 0, 48],
        [-17, 0, 82],
        [-9, 0, 96],
        [9, 0, 96],
        [17, 0, 82],
        [17, 0, 48],
      ],
      8,
      { tone: "mid", group: "shackle" },
    ),
    tube(
      [
        [-17, 0, 54],
        [-17, 0, 82],
        [-9, 0, 96],
        [9, 0, 96],
        [17, 0, 82],
        [17, 0, 54],
      ],
      2.4,
      { tone: "lo", group: "shackle" },
    ),
  );

  /* The heavy body, with a rounded face and its own metal lip. */
  faces.push(
    ...box(-27, -18, 6, 54, 36, 48, {
      r: 9,
      lip: true,
      tone: "edge",
      topTone: "mid",
    }),
  );

  /* Keyhole: a round well and a slot that owns the single accent. */
  faces.push(
    disc3(0, 18.4, 33, 7, "xz", { tone: "mid", group: "keyhole" }),
    disc3(0, 18.8, 33, 4.6, "xz", { tone: "lo", group: "keyhole" }),
    stroke3(
      [
        [0, 18.9, 30],
        [0, 18.9, 21],
      ],
      "hi",
      { group: "keyhole" },
    ),
  );

  /* Two rivets and a stamped serial bar. */
  for (const [x, z] of [
    [-19, 47],
    [19, 47],
  ] as const) {
    faces.push(
      face2(circle(...at(x, 18.5, z), 2.6, 14), {
        tone: "mid",
        group: "body",
      }),
    );
  }
  faces.push(
    stroke3(
      [
        [-8, 18.5, 12],
        [8, 18.5, 12],
      ],
      "lo",
      { group: "body" },
    ),
  );

  return faces;
}

export const padlock: PrototypeMeta = {
  slug: "padlock",
  name: "Padlock",
  component: "Objects",
  object: "Padlock with a shackle",
  story:
    "The shackle lifts out of both sockets while the keyhole catches a glint.",
  note: "A generic object: security as a body and a sprung shackle you can see open.",
  scene: figureScene({
    slug: "padlock",
    name: "Padlock",
    component: "Objects",
    object: "Padlock with a shackle",
    description:
      "A heavy padlock standing on its base: a rounded body, a U-shaped shackle and a keyhole with a slot.",
    aria:
      "An isometric padlock with a rounded body, a U-shaped shackle and a bright keyhole slot.",
    faces: padlockFaces(),
    motions: [
      {
        group: "shackle",
        kind: "lift",
        period: 3200,
        amount: 4,
      },
      { group: "keyhole", kind: "breathe", period: 2600, amount: 0.05 },
      { kind: "breathe", period: 5800, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 202. Envelope — envelope with a flap                                       */
/* -------------------------------------------------------------------------- */

function envelopeFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Open flap behind the letter, then the letter, then the body. */
  faces.push(
    face3(
      [
        [-46, -9, 63],
        [46, -9, 63],
        [0, -9, 95],
      ],
      { tone: "mid", group: "flap" },
    ),
    stroke3(
      [
        [-32, -9.3, 68],
        [0, -9.3, 84],
        [32, -9.3, 68],
      ],
      "lo",
      { group: "flap" },
    ),
  );

  /* The letter peeks above the top edge; its bright rim is the accent. */
  faces.push(
    panel(-31, 31, 4.4, 52, 83, { tone: "mid", group: "letter" }),
    stroke3(
      [
        [-31, 4.7, 83],
        [31, 4.7, 83],
      ],
      "hi",
      { group: "letter" },
    ),
    flatCard(12, 4, 73, 14, 10, 1, { tone: "lo", group: "letter" }),
  );

  /* Body with its folded paper thickness and a generous lip. */
  faces.push(
    ...box(-47, -6, 5, 94, 12, 59, {
      r: 5,
      lip: true,
      tone: "edge",
      topTone: "mid",
    }),
  );

  /* Fold seams on the front face. */
  faces.push(
    stroke3(
      [
        [-45, 6.3, 61],
        [0, 6.3, 26],
        [45, 6.3, 61],
      ],
      "lo",
      { group: "body" },
    ),
    stroke3(
      [
        [-45, 6.3, 12],
        [0, 6.3, 40],
        [45, 6.3, 12],
      ],
      "lo",
      { group: "body" },
    ),
    stroke3(
      [
        [-45, 6.3, 61],
        [-45, 6.3, 12],
      ],
      "lo",
      { group: "body" },
    ),
    stroke3(
      [
        [45, 6.3, 61],
        [45, 6.3, 12],
      ],
      "lo",
      { group: "body" },
    ),
  );

  /* A small return address block bottom left. */
  for (let index = 0; index < 3; index += 1) {
    faces.push(
      stroke3(
        [
          [-37, 6.4, 46 - index * 5],
          [-18 + index * 4, 6.4, 46 - index * 5],
        ],
        "lo",
        { group: "body" },
      ),
    );
  }

  return faces;
}

export const envelope: PrototypeMeta = {
  slug: "envelope",
  name: "Envelope",
  component: "Objects",
  object: "Envelope with a flap",
  story:
    "The flap swings open and the letter rises a finger-width, its top edge lit.",
  note: "A generic object: a message ready to leave, held in a folded paper pocket.",
  scene: figureScene({
    slug: "envelope",
    name: "Envelope",
    component: "Objects",
    object: "Envelope with a flap",
    description:
      "An envelope standing on its long edge, its flap open behind a rising letter, with fold seams and an address block.",
    aria:
      "An isometric envelope with an open triangular flap, a letter rising from the top and engraved fold seams.",
    faces: envelopeFaces(),
    motions: [
      {
        group: "flap",
        kind: "sway",
        period: 3400,
        amount: 3,
        pivot: [0, -9, 63],
      },
      { group: "letter", kind: "lift", period: 3000, amount: 3.4 },
      { group: "body", kind: "breathe", period: 5600, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 203. Lightbulb — incandescent bulb                                         */
/* -------------------------------------------------------------------------- */

function lightbulbFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Screw base, its threads and the contact foot. */
  faces.push(
    ...cylinder(0, 0, 0, 20, 13, 12, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
  );
  for (const z of [5, 10, 15]) {
    faces.push(frontRing(0, 0, z, 13.2, "lo", "base", 30));
  }
  faces.push(
    ...cylinder(0, 0, 18, 28, 9, 14, {
      tone: "edge",
      topTone: "lo",
    }),
  );

  /* Glass globe. */
  faces.push(...ball(0, 0, 80, 29, { tone: "edge", group: "glass" }));

  /* Filament, its two supports and a bright drip of light. */
  const [gx, gy] = at(0, 0, 80);
  faces.push(
    stroke2(
      [
        [gx - 9, gy + 6],
        [gx - 4, gy - 7],
        [gx + 1, gy + 5],
        [gx + 6, gy - 7],
        [gx + 10, gy + 5],
      ],
      "hi",
      { group: "filament" },
    ),
    stroke2(
      [
        [gx - 9, gy + 6],
        [gx - 13, gy + 16],
      ],
      "mid",
      { group: "filament" },
    ),
    stroke2(
      [
        [gx + 10, gy + 5],
        [gx + 14, gy + 16],
      ],
      "mid",
      { group: "filament" },
    ),
  );

  /* Two glow rings, the only decoration of the glass. */
  faces.push(
    ellipse2(gx, gy, 35, 33, 46).length
      ? face2(ellipse2(gx, gy, 35, 33, 46), {
          fill: false,
          tone: "lo",
          group: "glow",
        })
      : face2([], {}),
    face2(ellipse2(gx, gy, 41, 38, 46), {
      fill: false,
      tone: "lo",
      group: "glow",
    }),
  );
  faces.push(
    stroke2(
      [
        [gx - 20, gy - 12],
        [gx - 13, gy - 20],
        [gx - 4, gy - 24],
      ],
      "mid",
      { group: "glass" },
    ),
  );

  return faces;
}

export const lightbulb: PrototypeMeta = {
  slug: "lightbulb",
  name: "Lightbulb",
  component: "Objects",
  object: "Incandescent bulb",
  story:
    "The filament brightens and the glass around it breathes out two rings of light.",
  note: "A generic object: an idea and a lamp in the same glass globe.",
  scene: figureScene({
    slug: "lightbulb",
    name: "Lightbulb",
    component: "Objects",
    object: "Incandescent bulb",
    description:
      "An incandescent bulb on its screw base: a glass globe, a zigzag filament and two faint glow rings.",
    aria:
      "An isometric lightbulb with a threaded base, a glass globe, a bright zigzag filament and faint glow rings.",
    faces: lightbulbFaces(),
    motions: [
      { group: "filament", kind: "flicker", period: 2200, amount: 0.12 },
      { group: "glow", kind: "breathe", period: 2600, amount: 0.06 },
      { group: "glass", kind: "breathe", period: 5200, amount: 0.004 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 204. Book — open hardcover book                                            */
/* -------------------------------------------------------------------------- */

function bookFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The cover sits a little below and wider than the page block. */
  faces.push(
    quad([-72, -42, 6], [0, -42, 16], [0, 42, 16], [-72, 42, 6], {
      tone: "mid",
    }),
    quad([0, -42, 16], [72, -42, 6], [72, 42, 6], [0, 42, 16], {
      tone: "mid",
    }),
    /* Page blocks, left then right. */
    quad([-68, -38, 12], [0, -38, 22], [0, 38, 22], [-68, 38, 12], {
      tone: "edge",
      group: "pageL",
    }),
    quad([0, -38, 22], [68, -38, 12], [68, 38, 12], [0, 38, 22], {
      tone: "edge",
      group: "pageR",
    }),
    /* Outer page edges. */
    face3(
      [
        [-68, -38, 12],
        [-68, 38, 12],
        [-68, 38, 8],
        [-68, -38, 8],
      ],
      { tone: "lo" },
    ),
    face3(
      [
        [68, -38, 12],
        [68, 38, 12],
        [68, 38, 8],
        [68, -38, 8],
      ],
      { tone: "lo" },
    ),
  );

  /* Ruled lines run from the spine to the fore-edge on both pages. */
  for (let index = 0; index < 7; index += 1) {
    const y = -30 + index * 10;
    faces.push(
      stroke3(
        [
          [0, y, 22.3],
          [-62, y, 13.2],
        ],
        "lo",
        { group: "pageL" },
      ),
      stroke3(
        [
          [0, y, 22.3],
          [62, y, 13.2],
        ],
        "lo",
        { group: "pageR" },
      ),
    );
  }

  /* Spine ridge and two page-curl lines. */
  faces.push(
    ...cylinder(0, 0, 10, 9, 5, 5, { tone: "mid", topTone: "lo" }),
    stroke3(
      [
        [-50, 38, 13.4],
        [-46, 33, 13.9],
        [-55, 28, 13.2],
      ],
      "lo",
    ),
    stroke3(
      [
        [52, -38, 11.6],
        [47, -32, 12.2],
        [56, -26, 11.4],
      ],
      "lo",
    ),
  );

  /* The bookmark is the single bright element, draped over the right page. */
  faces.push(
    face3(
      [
        [0, 6, 22.6],
        [6, 6, 22.6],
        [9, 18, 8],
        [3, 18, 8],
      ],
      { tone: "hi", group: "ribbon" },
    ),
  );

  return faces;
}

export const book: PrototypeMeta = {
  slug: "book",
  name: "Book",
  component: "Objects",
  object: "Open hardcover book",
  story:
    "A page lifts at the fore-edge while the ribbon bookmark sways below the spine.",
  note: "A generic object: knowledge as two pages opening from one spine.",
  scene: figureScene({
    slug: "book",
    name: "Book",
    component: "Objects",
    object: "Open hardcover book",
    description:
      "An open hardcover book seen from above: two ruled pages, a rounded spine and a bright bookmark hanging out.",
    aria:
      "An isometric open hardcover book with two ruled pages, a rounded spine and a bright bookmark.",
    faces: bookFaces(),
    motions: [
      {
        group: "pageR",
        kind: "lift",
        period: 3400,
        amount: 2.6,
      },
      {
        group: "pageL",
        kind: "breathe",
        period: 4800,
        amount: 0.01,
      },
      {
        group: "ribbon",
        kind: "sway",
        period: 3200,
        amount: 6,
        pivot: [0, 4, 22],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 205. Camera — twin-lens camera                                             */
/* -------------------------------------------------------------------------- */

function cameraFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* The body, its top plate and a leather lip around the front. */
  faces.push(
    ...box(-40, -22, 0, 80, 44, 84, {
      r: 6,
      lip: true,
      tone: "edge",
      topTone: "mid",
    }),
  );

  /* Twin lenses on the front face. */
  const lens = (
    cz: number,
    r: number,
    group: string,
    aperture: boolean,
  ): FigureFace[] => {
    return [
      disc3(0, 22.4, cz, r, "xz", { tone: "edge", group }),
      disc3(0, 22.9, cz, r - 3.4, "xz", { tone: "mid", group }),
      disc3(0, 23.3, cz, r - 7, "xz", {
        tone: aperture ? "lo" : "mid",
        group: aperture ? "iris" : group,
      }),
      disc3(0, 23.7, cz, Math.max(2, r - 11), "xz", {
        tone: "lo",
        group,
      }),
    ];
  };

  faces.push(...lens(58, 18, "lensTop", false));
  faces.push(...lens(26, 14, "lensBottom", true));

  /* Aperture blades: small radial marks inside the lower lens. */
  const [ax, ay] = at(0, 0, 26);
  for (let index = 0; index < 6; index += 1) {
    const a = (index / 6) * TAU + 0.2;
    faces.push(
      face2(
        [ray(ax, ay, a, 3), ray(ax, ay, a + 0.5, 7), ray(ax, ay, a + 0.9, 3)],
        { fill: false, tone: "lo", group: "iris" },
      ),
    );
  }

  /* Nameplate, shutter lever, winding knob and finder. */
  faces.push(
    panel(-13, 13, 22.4, 72, 79, { tone: "lo" }),
    stroke3(
      [
        [-9, 22.5, 75.5],
        [9, 22.5, 75.5],
      ],
      "mid",
    ),
    ...cylinder(24, -6, 84, 4, 8, 8, {
      tone: "mid",
      topTone: "lo",
      group: "knob",
    }),
    ...cylinder(-24, 8, 84, 3, 4, 4, {
      tone: "mid",
      topTone: "lo",
      group: "knob",
    }),
    ...box(-10, 12, 84, 20, 8, 4, { r: 2, tone: "mid", topTone: "lo" }),
    /* Hinges on the left. */
    ...cylinder(-41, 14, 20, 6, 3, 3, { tone: "mid", topTone: "lo" }),
    ...cylinder(-41, 14, 58, 6, 3, 3, { tone: "mid", topTone: "lo" }),
  );

  /* The bright glint on the upper lens is the accent. */
  const [gx, gy] = at(0, 0, 58);
  faces.push(
    stroke2(
      [
        [gx - 8, gy - 5],
        [gx - 2, gy - 11],
      ],
      "hi",
      { group: "lensTop" },
    ),
  );

  return faces;
}

export const camera: PrototypeMeta = {
  slug: "camera",
  name: "Camera",
  component: "Objects",
  object: "Twin-lens camera",
  story:
    "The aperture blades flick shut and the twin lenses settle, a glint on the upper glass.",
  note: "A generic object: image-making as a box with two eyes and a shutter.",
  scene: figureScene({
    slug: "camera",
    name: "Camera",
    component: "Objects",
    object: "Twin-lens camera",
    description:
      "A twin-lens camera standing on its base: two stacked lenses, aperture blades, a nameplate and two winding knobs.",
    aria:
      "An isometric twin-lens camera with two stacked lenses, aperture blades, a glint and two knobs on top.",
    faces: cameraFaces(),
    motions: [
      { group: "iris", kind: "flicker", period: 2200, amount: 0.14 },
      {
        group: "lensTop",
        kind: "sway",
        period: 3600,
        amount: 2,
        pivot: [0, 22, 58],
      },
      {
        group: "lensBottom",
        kind: "sway",
        period: 3600,
        amount: 2,
        pivot: [0, 22, 26],
      },
      { group: "knob", kind: "sway", period: 3000, amount: 4 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 206. Headphones — over-ear headphones                                      */
/* -------------------------------------------------------------------------- */

function headphonesFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Headband, painted first so both cups sit in front of it. */
  faces.push(
    tube(
      [
        [-47, 0, 42],
        [-42, 0, 78],
        [-20, 0, 96],
        [20, 0, 96],
        [42, 0, 78],
        [47, 0, 42],
      ],
      8,
      { tone: "edge", group: "band" },
    ),
    tube(
      [
        [-43, 0, 46],
        [-38, 0, 78],
        [-18, 0, 92],
        [18, 0, 92],
        [38, 0, 78],
        [43, 0, 46],
      ],
      2,
      { tone: "lo", group: "band" },
    ),
  );

  /* Two cups: far one first, near one last. */
  const cup = (x0: number, x1: number, group: string, accent: boolean) => {
    const parts: FigureFace[] = drumX(x0, x1, 0, 30, 23, {
      tone: "edge",
      topTone: "mid",
      group,
      rim: false,
    });
    const rimX = x1 + (x1 > x0 ? 0.4 : -0.4);
    parts.push(
      face2(circleYZ(rimX, 0, 30, 18.5, 34), {
        fill: false,
        tone: "mid",
        group,
      }),
      face2(circleYZ(rimX + (x1 > x0 ? 0.3 : -0.3), 0, 30, 12.5, 32), {
        fill: false,
        tone: "lo",
        group,
      }),
    );
    if (accent) {
      parts.push(
        stroke2(
          [
            [
              circleYZ(rimX, 0, 30, 16, 40)[0][0],
              circleYZ(rimX, 0, 30, 16, 40)[0][1],
            ],
          ],
          "hi",
          { group },
        ),
      );
    }
    return parts;
  };

  faces.push(...cup(-64, -44, "cupFar", false));
  faces.push(...cup(44, 64, "cupNear", false));

  /* Cushions wrap the back of each cup. */
  faces.push(
    ...drumX(-48, -44, 0, 30, 20, {
      tone: "mid",
      topTone: "lo",
      group: "cupFar",
      rim: false,
    }),
    ...drumX(44, 48, 0, 30, 20, {
      tone: "mid",
      topTone: "lo",
      group: "cupNear",
      rim: false,
    }),
  );

  /* Slider stems and hinges. */
  for (const side of [-1, 1]) {
    faces.push(
      tube(
        [
          [side * 47, 0, 50],
          [side * 47, 0, 42],
        ],
        4,
        { tone: "mid", group: side < 0 ? "cupFar" : "cupNear" },
      ),
    );
  }

  /* Two sound arcs leave the near cup: the single bright accent. */
  const [nx, ny] = at(64, 0, 30);
  for (const [from, to] of [
    [-0.7, 0.5],
    [-0.5, 0.3],
  ] as const) {
    const points: Point2[] = [];
    for (let index = 0; index <= 8; index += 1) {
      const a = from + ((to - from) * index) / 8;
      points.push([
        nx + 22 + Math.cos(a) * 18,
        ny + Math.sin(a) * 24,
      ]);
    }
    faces.push(
      face2(points, {
        fill: false,
        tone: "hi",
        group: "sound",
      }),
    );
  }

  return faces;
}

export const headphones: PrototypeMeta = {
  slug: "headphones",
  name: "Headphones",
  component: "Objects",
  object: "Over-ear headphones",
  story:
    "The cushions bounce against the band and two rings of sound leave the near cup.",
  note: "A generic object: private sound as a band over two soft cups.",
  scene: figureScene({
    slug: "headphones",
    name: "Headphones",
    component: "Objects",
    object: "Over-ear headphones",
    description:
      "Over-ear headphones standing on their cups: a wide headband, two deep cushions and two rings of sound.",
    aria:
      "An isometric pair of over-ear headphones with a wide headband, two deep cushions and two bright sound rings.",
    faces: headphonesFaces(),
    motions: [
      { group: "cupFar", kind: "breathe", period: 2800, amount: 0.03 },
      { group: "cupNear", kind: "breathe", period: 2500, amount: 0.04 },
      {
        group: "band",
        kind: "sway",
        period: 4200,
        amount: 2,
        pivot: [0, 0, 42],
      },
      { group: "sound", kind: "flicker", period: 2000, amount: 0.12 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 207. Clock — alarm clock                                                   */
/* -------------------------------------------------------------------------- */

function clockFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [cx, cy] = at(0, 0, 58);

  /* Two feet and a small bridge keep the case upright. */
  faces.push(
    ...cylinder(-20, 4, 0, 10, 5, 4, { tone: "mid", topTone: "lo" }),
    ...cylinder(20, 4, 0, 10, 5, 4, { tone: "mid", topTone: "lo" }),
    ...box(-20, -3, 8, 40, 8, 4, { r: 2, tone: "lo", topTone: "lo" }),
  );

  /* The round case and its dial, in screen space so the face stays round. */
  faces.push(
    face2(circle(cx, cy, 40, 44), { tone: "edge", group: "case" }),
    face2(circle(cx, cy, 35, 42), { tone: "mid", group: "case" }),
    face2(circle(cx, cy, 31, 40), { tone: "lo", group: "case" }),
  );

  /* Hour ticks. */
  for (let index = 0; index < 12; index += 1) {
    const a = -Math.PI / 2 + (index / 12) * TAU;
    faces.push(
      face2(
        [ray(cx, cy, a, 25), ray(cx, cy, a, index % 3 === 0 ? 30 : 28)],
        { fill: false, tone: index % 3 === 0 ? "mid" : "lo", group: "case" },
      ),
    );
  }

  /* Hands: the minute hand is the only accent. */
  faces.push(
    face2([ray(cx, cy, -1.15, 23), ray(cx, cy, -1.15 + 0.08, 0)], {
      fill: false,
      tone: "hi",
      group: "hands",
    }),
    face2([ray(cx, cy, 0.5, 16), ray(cx, cy, 0.5 + 0.1, 0)], {
      fill: false,
      tone: "mid",
      group: "hands",
    }),
    face2(circle(cx, cy, 3, 14), { tone: "hi", group: "hands" }),
  );

  /* Two bells with a hammer between them. */
  for (const side of [-1, 1]) {
    const bx = cx + side * 24;
    faces.push(
      face2(circle(bx, cy - 40, 13, 28), {
        tone: "edge",
        group: "bells",
      }),
      face2(circle(bx, cy - 40, 8, 22), {
        fill: false,
        tone: "lo",
        group: "bells",
      }),
    );
  }
  faces.push(
    stroke2(
      [
        [cx - 36, cy - 36],
        [cx, cy - 56],
        [cx + 36, cy - 36],
      ],
      "mid",
      { group: "bells" },
    ),
    face2(circle(cx, cy - 48, 3.4, 14), { tone: "mid", group: "bells" }),
  );

  /* A small loop handle above the bells. */
  faces.push(
    face2(
      [ray(cx, cy - 62, 0.1, 8), ray(cx, cy - 62, Math.PI - 0.1, 8)].map(
        ([x, y]) => [x, y] as Point2,
      ),
      { fill: false, tone: "mid", group: "bells" },
    ),
  );

  return faces;
}

export const clock: PrototypeMeta = {
  slug: "clock",
  name: "Clock",
  component: "Objects",
  object: "Alarm clock",
  story:
    "The minute hand sweeps on and the two bells rock once against their hammer.",
  note: "A generic object: time that can wake you, a round dial under two bells.",
  scene: figureScene({
    slug: "clock",
    name: "Clock",
    component: "Objects",
    object: "Alarm clock",
    description:
      "An alarm clock on two small feet: a round dial with twelve ticks and two hands, two bells and a hammer.",
    aria:
      "An isometric alarm clock with a round dial, twelve ticks, a bright minute hand and two bells.",
    faces: clockFaces(),
    motions: [
      {
        group: "hands",
        kind: "spin",
        period: 9000,
        amount: 360,
        pivot: [0, 0, 58],
      },
      {
        group: "bells",
        kind: "sway",
        period: 1300,
        amount: 5,
        pivot: [0, 0, 88],
      },
      { group: "case", kind: "breathe", period: 5200, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 208. Globe — globe on a stand                                              */
/* -------------------------------------------------------------------------- */

function globeFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [cx, cy] = at(0, 0, 72);

  /* Base, stem and fork are the globe's own support. */
  faces.push(
    ...cylinder(0, 0, 0, 8, 24, 21, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ellipse3(0, 0, 8.2, 15, 15, { fill: false, tone: "lo" }),
    post(0, 0, 8, 34, 3, "edge", "stand"),
    tube(
      [
        [0, 0, 32],
        [0, 0, 52],
      ],
      4,
      { tone: "mid", group: "stand" },
    ),
  );

  /* The sphere and its engraved meridians, grouped so it can turn. */
  faces.push(
    face2(circle(cx, cy, 30, 44), { tone: "edge", group: "globe" }),
  );
  const meridians: Array<[number, number, number]> = [
    [30, 10, -0.5],
    [24, 24, 0.9],
    [14, 28, -0.15],
  ];
  for (const [rx, ry, angle] of meridians) {
    faces.push(
      face2(ellipseRot(cx, cy, rx, ry, angle, 40), {
        fill: false,
        tone: "lo",
        group: "globe",
      }),
    );
  }
  for (const dy of [-14, 0, 14]) {
    faces.push(
      face2(ellipse2(cx, cy + dy, 26 - Math.abs(dy) * 0.5, 7, 34), {
        fill: false,
        tone: "lo",
        group: "globe",
      }),
    );
  }
  faces.push(
    face2(ellipseRot(cx, cy, 34, 17, -0.5, 40), {
      fill: false,
      tone: "hi",
      group: "ring",
    }),
    /* Axis through both poles. */
    stroke2(
      [
        [cx - 22, cy + 24],
        [cx + 22, cy - 24],
      ],
      "mid",
      { group: "axis" },
    ),
  );

  return faces;
}

export const globe: PrototypeMeta = {
  slug: "globe",
  name: "Globe",
  component: "Objects",
  object: "Globe on a stand",
  story:
    "The globe turns inside its bright meridian ring and the parallels slide past.",
  note: "A generic object: the world as a sphere you can spin on its stand.",
  scene: figureScene({
    slug: "globe",
    name: "Globe",
    component: "Objects",
    object: "Globe on a stand",
    description:
      "A globe on a round base and slim fork: a sphere crossed by meridians and parallels, held in a bright ring.",
    aria:
      "An isometric globe on a round stand, with engraved meridians, parallels and a bright meridian ring.",
    faces: globeFaces(),
    motions: [
      { group: "globe", kind: "spin", period: 14000, amount: 360 },
      { group: "ring", kind: "sway", period: 5200, amount: 2 },
      { group: "stand", kind: "breathe", period: 6000, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 209. Trophy — cup trophy                                                   */
/* -------------------------------------------------------------------------- */

function trophyFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Plinth, base and stem. */
  faces.push(
    ...cylinder(0, 0, 0, 8, 26, 26, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ellipse3(0, 0, 8.2, 18, 18, { fill: false, tone: "lo" }),
    ...cylinder(0, 0, 8, 8, 18, 22, { tone: "edge", topTone: "lo" }),
    ...cylinder(0, 0, 16, 18, 6, 8, { tone: "mid", topTone: "lo" }),
    ...cylinder(0, 0, 32, 6, 13, 17, { tone: "mid", topTone: "lo" }),
  );

  /* Handles are added after the bowl so both loops stay visible. */

  /* The bowl: a flared cup with a hollow rim. */
  faces.push(
    ...cylinder(0, 0, 48, 32, 17, 27, {
      tone: "edge",
      topTone: "mid",
      hollow: 4.5,
      bottomArc: true,
      group: "cup",
    }),
  );
  faces.push(
    ellipse3(0, 0, 81, 26.6, 26.6, { fill: false, tone: "lo", group: "cup" }),
    ellipse3(0, 0, 81.4, 22.4, 22.4, { fill: false, tone: "lo", group: "cup" }),
  );

  /* Two screen-space handles wrap the bowl. */
  const [hx, hy] = at(0, 0, 64);
  for (const side of [-1, 1] as const) {
    const centerX = hx + side * 32;
    const a = side * 0.12;
    faces.push(
      loop(
        ellipseRot(centerX, hy - 2, 13, 17, a, 30),
        "edge",
        "cup",
      ),
      loop(
        ellipseRot(centerX, hy - 2, 8.6, 12, a, 26),
        "lo",
        "cup",
      ),
    );
  }

  /* Bright emblem on the cup front. */
  const [ex, ey] = at(0, 0, 62);
  faces.push(
    face2(star(ex, ey, 7.5, 3.2, 5), { tone: "hi", group: "emblem" }),
    stroke2(
      [
        [ex - 13, ey + 10],
        [ex + 13, ey + 10],
      ],
      "lo",
      { group: "cup" },
    ),
  );

  return faces;
}

export const trophy: PrototypeMeta = {
  slug: "trophy",
  name: "Trophy",
  component: "Objects",
  object: "Cup trophy",
  story:
    "The cup lifts off its stem and the star on its face catches the light.",
  note: "A generic object: achievement made solid in a cup on a plinth.",
  scene: figureScene({
    slug: "trophy",
    name: "Trophy",
    component: "Objects",
    object: "Cup trophy",
    description:
      "A cup trophy on a stepped plinth: a flared bowl with two handles, a slim stem and a bright star.",
    aria:
      "An isometric cup trophy on a stepped plinth, with two handles, a hollow rim and a bright star.",
    faces: trophyFaces(),
    motions: [
      { group: "cup", kind: "lift", period: 3400, amount: 2.6 },
      { group: "emblem", kind: "breathe", period: 2600, amount: 0.06 },
      { kind: "breathe", period: 5600, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 210. Umbrella — open umbrella                                              */
/* -------------------------------------------------------------------------- */

function umbrellaFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Handle and shaft: the umbrella rests on the curve of its handle. */
  faces.push(
    tube(
      [
        [20, 0, 0],
        [8, 0, 2],
        [2, 0, 8],
        [0, 0, 18],
      ],
      5,
      { tone: "edge", group: "shaft" },
    ),
    post(0, 0, 14, 108, 3, "edge", "shaft"),
    ...cylinder(0, 0, 76, 5, 4, 4, {
      tone: "mid",
      topTone: "lo",
      group: "shaft",
    }),
  );

  /* Canopy: gores from the apex to a scalloped rim. */
  const rim3: Point3[] = [];
  const count = 8;
  for (let index = 0; index < count; index += 1) {
    const a = (index / count) * TAU + 0.2;
    const x = Math.cos(a) * 56;
    const y = Math.sin(a) * 56;
    rim3.push([x, y, 82]);
  }
  for (let index = 0; index < count; index += 1) {
    const a = rim3[index];
    const b = rim3[(index + 1) % count];
    faces.push(
      face3([apex3(), [a[0], a[1], a[2]], [b[0], b[1], b[2]]], {
        tone: "edge",
        group: "canopy",
      }),
      stroke3(
        [
          [a[0], a[1], a[2]],
          [b[0], b[1], b[2]],
        ],
        "lo",
        { group: "canopy" },
      ),
    );
    /* Ribs from the apex. */
    faces.push(
      stroke3(
        [
          [0, 0, 112],
          [a[0], a[1], a[2]],
        ],
        "edge",
        { group: "canopy" },
      ),
    );
    /* Scallop hanging below the rim between two ribs. */
    const left = at(a[0], a[1], 82);
    const right = at(b[0], b[1], 82);
    const scallop: Point2[] = [];
    for (let step = 0; step <= 10; step += 1) {
      const t = step / 10;
      const px = left[0] + (right[0] - left[0]) * t;
      const py =
        left[1] + (right[1] - left[1]) * t + Math.sin(t * Math.PI) * 7;
      scallop.push([px, py]);
    }
    faces.push(
      face2(scallop, { tone: "mid", group: "canopy" }),
    );
  }

  /* Ferrule and the bright tip. */
  faces.push(
    ...cylinder(0, 0, 108, 8, 3, 2, {
      tone: "mid",
      topTone: "hi",
      group: "shaft",
    }),
    face2(circle(...at(0, 0, 116), 2.2, 12), { tone: "hi", group: "shaft" }),
  );

  return faces;
}

function apex3(): Point3 {
  return [0, 0, 112];
}

export const umbrella: PrototypeMeta = {
  slug: "umbrella",
  name: "Umbrella",
  component: "Objects",
  object: "Open umbrella",
  story:
    "The canopy opens a touch and its ribs pull taut while the bright tip holds the eye.",
  note: "A generic object: a portable shelter, ribs and cloth around one shaft.",
  scene: figureScene({
    slug: "umbrella",
    name: "Umbrella",
    component: "Objects",
    object: "Open umbrella",
    description:
      "An open umbrella standing on its curved handle: eight scalloped gores, ribs, a shaft and a bright ferrule.",
    aria:
      "An isometric open umbrella with eight scalloped panels, ribs, a curved handle and a bright ferrule.",
    faces: umbrellaFaces(),
    motions: [
      { group: "canopy", kind: "breathe", period: 3000, amount: 0.035 },
      {
        group: "shaft",
        kind: "sway",
        period: 4200,
        amount: 1.6,
        pivot: [0, 0, 0],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 211. Hourglass — hourglass                                                 */
/* -------------------------------------------------------------------------- */

function hourglassFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Plates and four corner posts: the frame is the object's own support. */
  faces.push(
    ...box(-32, -22, 0, 64, 44, 8, {
      r: 4,
      lip: true,
      tone: "edge",
      topTone: "mid",
    }),
    ...box(-32, -22, 92, 64, 44, 8, {
      r: 4,
      lip: true,
      tone: "edge",
      topTone: "mid",
    }),
  );
  for (const [x, y] of [
    [-31, -21],
    [31, -21],
    [31, 21],
    [-31, 21],
  ] as const) {
    faces.push(
      tube(
        [
          [x, y, 8],
          [x, y, 92],
        ],
        2.6,
        { tone: "mid", group: "frame" },
      ),
      face2(circle(...at(x, y, 8), 2.4, 12), { tone: "lo" }),
    );
  }

  /* The two glass bulbs, opaque, then the sand drawn over them. */
  faces.push(
    ...cylinder(0, 0, 52, 40, 7, 23, {
      tone: "edge",
      topTone: "lo",
      group: "glassTop",
    }),
    ...cylinder(0, 0, 12, 40, 23, 7, {
      tone: "edge",
      topTone: "lo",
      group: "glassBottom",
    }),
  );
  faces.push(
    ellipse3(0, 0, 92.4, 23, 23, {
      fill: false,
      tone: "lo",
      group: "glassTop",
    }),
    ellipse3(0, 0, 12.2, 23, 23, {
      fill: false,
      tone: "lo",
      group: "glassBottom",
    }),
  );

  /* Upper sand level, lower pile and the falling thread. */
  faces.push(
    ellipse3(0, 0, 76, 15, 15, {
      fill: false,
      tone: "mid",
      group: "sand",
    }),
  );
  for (const [z, w] of [
    [16, 17],
    [21, 14],
    [26, 11],
    [31, 7],
  ] as const) {
    faces.push(
      stroke3(
        [
          [-w, w * 0.4, z],
          [w, -w * 0.4, z],
        ],
        "lo",
        { group: "sand" },
      ),
    );
  }
  faces.push(
    face3(
      [
        [0, 0, 10],
        [-13, 9, 16],
        [0, 20, 18],
        [13, 11, 16],
      ],
      { tone: "mid", group: "sand" },
    ),
    stroke3(
      [
        [0, 0, 54],
        [0, 0, 22],
      ],
      "hi",
      { group: "stream" },
    ),
    dotAt(0, 0, 18, 1.8, "hi", "stream"),
  );

  return faces;
}

export const hourglass: PrototypeMeta = {
  slug: "hourglass",
  name: "Hourglass",
  component: "Objects",
  object: "Hourglass",
  story:
    "Sand pours down the bright thread and the lower bulb swells while the frame holds still.",
  note: "A generic object: time measured by gravity, two bulbs and a falling thread.",
  scene: figureScene({
    slug: "hourglass",
    name: "Hourglass",
    component: "Objects",
    object: "Hourglass",
    description:
      "An hourglass in a four-post frame: two glass bulbs, a level of sand above and a growing pile below.",
    aria:
      "An isometric hourglass in a wooden frame with two glass bulbs and a bright thread of falling sand.",
    faces: hourglassFaces(),
    motions: [
      { group: "sand", kind: "breathe", period: 4200, amount: 0.05 },
      { group: "stream", kind: "flicker", period: 1500, amount: 0.12 },
      { group: "frame", kind: "sway", period: 5600, amount: 1.2 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 212. Compass — magnetic compass                                            */
/* -------------------------------------------------------------------------- */

function compassFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Brass case with a generous bezel. */
  faces.push(
    ...cylinder(0, 0, 0, 8, 41, 41, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
    }),
    ellipse3(0, 0, 8.1, 34, 34, { fill: false, tone: "lo" }),
    ellipse3(0, 0, 8.2, 30, 30, { fill: false, tone: "mid" }),
    ellipse3(0, 0, 8.3, 26, 26, { fill: false, tone: "lo" }),
  );

  /* Cardinal and ordinal ticks. */
  for (let index = 0; index < 12; index += 1) {
    const a = (index / 12) * TAU;
    const inner = index % 3 === 0 ? 27 : 29;
    faces.push(
      stroke3(
        [
          [Math.cos(a) * inner, Math.sin(a) * inner, 8.4],
          [Math.cos(a) * 34, Math.sin(a) * 34, 8.4],
        ],
        index % 3 === 0 ? "mid" : "lo",
        { group: "dial" },
      ),
    );
  }

  /* North index on the bezel. */
  const [ix, iy] = at(0, 0, 8.5);
  faces.push(
    face2(
      [
        [ix, iy - 24],
        [ix - 4, iy - 17],
        [ix + 4, iy - 17],
      ],
      { tone: "mid", group: "dial" },
    ),
  );

  /* The needle lies on the dial: a bright north half and a dark tail. */
  const [nx, ny] = at(0, 0, 8.6);
  faces.push(
    face3(
      [
        [0, -26, 8.6],
        [-4, 0, 8.6],
        [4, 0, 8.6],
      ],
      { tone: "hi", group: "needle" },
    ),
    face3(
      [
        [-4, 0, 8.6],
        [0, 20, 8.6],
        [4, 0, 8.6],
      ],
      { tone: "mid", group: "needle" },
    ),
    face2(circle(...at(0, 0, 8.7), 3, 16), {
      tone: "lo",
      group: "needle",
    }),
  );

  /* A glass reflection across the dial. */
  faces.push(
    stroke2(
      [
        [nx - 22, ny - 12],
        [nx - 10, ny - 21],
        [nx + 6, ny - 23],
      ],
      "lo",
      { group: "dial" },
    ),
  );

  /* Two tiny hinge bosses on the left edge of the case. */
  for (const y of [-10, 10]) {
    faces.push(
      ...cylinder(-41, y, 3, 5, 3.2, 3.2, {
        tone: "mid",
        topTone: "lo",
        group: "case",
      }),
    );
  }

  return faces;
}

export const compass: PrototypeMeta = {
  slug: "compass",
  name: "Compass",
  component: "Objects",
  object: "Magnetic compass",
  story:
    "The needle swings toward north and settles with its bright tip on the index.",
  note: "A generic object: direction as a physical pull on a single needle.",
  scene: figureScene({
    slug: "compass",
    name: "Compass",
    component: "Objects",
    object: "Magnetic compass",
    description:
      "A brass pocket compass seen from above: a bezel, twelve ticks and a two-tone needle with a bright north tip.",
    aria:
      "An isometric brass compass with a bezel, twelve ticks and a two-tone needle with a bright north tip.",
    faces: compassFaces(),
    motions: [
      {
        group: "needle",
        kind: "sway",
        period: 3600,
        amount: 11,
        pivot: [0, 0, 10],
      },
      { group: "dial", kind: "breathe", period: 5200, amount: 0.01 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 213. Magnifier — magnifying glass                                          */
/* -------------------------------------------------------------------------- */

function magnifierFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Handle and collar rest on the desk; the lens leans over them. */
  faces.push(
    tube(
      [
        [34, -10, 1],
        [18, -2, 40],
        [10, 0, 54],
      ],
      10,
      { tone: "edge", group: "handle" },
    ),
    tube(
      [
        [25, -6, 28],
        [17, -2, 42],
      ],
      3,
      { tone: "lo", group: "handle" },
    ),
  );

  const [cx, cy] = at(0, 0, 88);
  faces.push(
    face2(circle(cx, cy, 34, 44), { tone: "edge", group: "lens" }),
    face2(circle(cx, cy, 29, 40), { tone: "mid", group: "lens" }),
    face2(circle(cx, cy, 26, 38), { tone: "lo", group: "lens" }),
    stroke2(
      [
        [cx - 17, cy - 7],
        [cx - 8, cy - 17],
        [cx + 3, cy - 20],
      ],
      "mid",
      { group: "lens" },
    ),
  );

  /* A collar at the joint hides the handle root. */
  const [jx, jy] = at(10, 0, 54);
  faces.push(
    face2(circle(jx, jy, 6, 20), { tone: "mid", group: "handle" }),
    face2(circle(jx, jy, 3, 14), {
      fill: false,
      tone: "lo",
      group: "handle",
    }),
  );

  /* The focused ring on the desk is the single accent. */
  faces.push(
    face2(ellipse2(...at(26, -18, 0), 15, 5, 30), {
      fill: false,
      tone: "hi",
      group: "spot",
    }),
    face2(ellipse2(...at(26, -18, 0), 19, 6.4, 30), {
      fill: false,
      tone: "lo",
      group: "spot",
    }),
  );

  return faces;
}

export const magnifier: PrototypeMeta = {
  slug: "magnifier",
  name: "Magnifier",
  component: "Objects",
  object: "Magnifying glass",
  story:
    "The lens tilts on its handle and the ring of light on the desk tightens.",
  note: "A generic object: seeing more by bringing one lens closer.",
  scene: figureScene({
    slug: "magnifier",
    name: "Magnifier",
    component: "Objects",
    object: "Magnifying glass",
    description:
      "A magnifying glass leaning on its handle: a deep rim, a bright glass, a glint and a focused ring on the desk.",
    aria:
      "An isometric magnifying glass with a deep rim, a glint on the glass and a bright ring of focused light below.",
    faces: magnifierFaces(),
    motions: [
      {
        group: "lens",
        kind: "sway",
        period: 3400,
        amount: 5,
        pivot: [10, 0, 54],
      },
      { group: "spot", kind: "breathe", period: 3000, amount: 0.08 },
      { group: "handle", kind: "breathe", period: 5600, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 214. Donut — glazed donut                                                  */
/* -------------------------------------------------------------------------- */

function donutFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* A squat round body, then the hole and the glaze on top. */
  faces.push(
    ...cylinder(0, 0, 8, 14, 44, 44, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
      group: "body",
    }),
  );
  const [cx, cy] = at(0, 0, 22);

  /* The hole: a strong inner rim and a shallow wall. */
  faces.push(
    ellipse3(0, 0, 22.3, 16, 16, {
      tone: "edge",
      group: "body",
    }),
    ellipse3(0, 0, 22.4, 11, 11, {
      fill: false,
      tone: "lo",
      group: "body",
    }),
    frontRing(0, 0, 16, 16, "lo", "body", 30),
  );

  /* A smooth glaze band and a bright sweep. */
  faces.push(
    ellipse3(0, 0, 22.5, 38, 38, {
      fill: false,
      tone: "mid",
      group: "glaze",
    }),
    ellipse3(0, 0, 22.6, 31, 31, {
      fill: false,
      tone: "lo",
      group: "glaze",
    }),
    face2(
      ellipse2(cx, cy, 31, 31, 48)
        .slice(20, 24)
        .map(([x, y]) => [x, y] as Point2),
      { fill: false, tone: "hi", group: "glaze" },
    ),
  );

  /* Sprinkles scattered on the band, not on the hole. */
  for (let index = 0; index < 10; index += 1) {
    const a = (index / 10) * TAU + 0.2;
    const rr = 24 + (index % 3) * 4.5;
    const px = cx + Math.cos(a) * rr;
    const py = cy + Math.sin(a) * rr * 0.96;
    faces.push(
      face2(
        [
          [px - 3, py + 1],
          [px + 3, py - 1.4],
        ],
        {
          fill: false,
          tone: index === 3 ? "mid" : "lo",
          group: "glaze",
        },
      ),
    );
  }

  /* Four soft drips hang over the front rim. */
  for (const a of [0.45, 1.15, 2.05, 2.7]) {
    const px = cx + Math.cos(a) * 43;
    const py = cy + Math.sin(a) * 43 * 0.96;
    faces.push(
      face2(
        [
          [px - 2.6, py],
          [px + 2.6, py],
          [px + 1.8, py + 7],
          [px, py + 9],
          [px - 1.8, py + 7],
        ],
        { tone: "mid", group: "drip" },
      ),
    );
  }

  return faces;
}

export const donut: PrototypeMeta = {
  slug: "donut",
  name: "Donut",
  component: "Objects",
  object: "Glazed donut",
  story:
    "The glaze settles, the drips thicken and the whole ring turns a few degrees.",
  note: "A generic object: a hole that makes the shape, a ring of glazed dough.",
  scene: figureScene({
    slug: "donut",
    name: "Donut",
    component: "Objects",
    object: "Glazed donut",
    description:
      "A glazed donut seen from above: a thick ring, a wavy glaze, sprinkles and four drips over the rim.",
    aria:
      "An isometric glazed donut with a thick ring, a wavy glaze, sprinkles, drips and a bright highlight.",
    faces: donutFaces(),
    motions: [
      { group: "glaze", kind: "breathe", period: 3000, amount: 0.022 },
      { group: "drip", kind: "lift", period: 2600, amount: 1.6 },
      { group: "body", kind: "sway", period: 5200, amount: 2.4 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 215. Ice Cream — cone with two scoops                                      */
/* -------------------------------------------------------------------------- */

function iceCreamFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Waffle cone: a narrow cone with engraved lattice. */
  faces.push(
    ...cylinder(0, 0, 0, 46, 1.4, 27, {
      tone: "edge",
      topTone: "mid",
      group: "cone",
    }),
  );
  const apex = at(0, 0, 0);
  for (const [t0, t1] of [
    [0.2, 0.48],
    [0.48, 0.2],
    [0.4, 0.72],
    [0.72, 0.4],
    [0.6, 0.9],
    [0.9, 0.6],
  ] as const) {
    const left = (t: number): Point2 => [
      apex[0] - 19 * t,
      apex[1] - 39.8 * t,
    ];
    const right = (t: number): Point2 => [
      apex[0] + 19 * t,
      apex[1] - 39.8 * t,
    ];
    faces.push(
      face2([left(t0), right(t1)], { fill: false, tone: "lo", group: "cone" }),
    );
  }

  /* Two scoops, the upper one a touch offset. */
  faces.push(
    ...ball(0, 0, 66, 25, { tone: "edge", group: "scoopBottom" }),
    ...ball(4, -2, 94, 21, { tone: "edge", group: "scoopTop" }),
  );
  const [s1x, s1y] = at(0, 0, 66);
  const [s2x, s2y] = at(4, -2, 94);
  faces.push(
    face2(circle(s1x, s1y, 21, 28).slice(7, 21), {
      fill: false,
      tone: "lo",
      group: "scoopBottom",
    }),
    face2(circle(s2x, s2y, 17, 24).slice(6, 19), {
      fill: false,
      tone: "lo",
      group: "scoopTop",
    }),
  );

  /* Cream drips hang from the lower scoop. */
  for (const dx of [-17, 0, 17]) {
    const px = s1x + dx;
    const py = s1y + 20;
    faces.push(
      face2(
        [
          [px - 3.2, py],
          [px + 3.2, py],
          [px + 2.2, py + 7],
          [px, py + 9.5],
          [px - 2.2, py + 7],
        ],
        { tone: "mid", group: "drip" },
      ),
    );
  }

  /* Cherry and its stem: the bright accent. */
  faces.push(
    ...ball(4, -2, 118, 8, { tone: "hi", group: "cherry" }),
    tube(
      [
        [4, -2, 124],
        [7, -4, 136],
      ],
      2,
      { tone: "mid", group: "cherry" },
    ),
  );

  return faces;
}

export const iceCream: PrototypeMeta = {
  slug: "ice-cream",
  name: "Ice Cream",
  component: "Objects",
  object: "Cone with two scoops",
  story:
    "The top scoop slips a little, a cream drip forms and the cherry sways on its stem.",
  note: "A generic object: a treat read at once by its cone and stacked scoops.",
  scene: figureScene({
    slug: "ice-cream",
    name: "Ice Cream",
    component: "Objects",
    object: "Cone with two scoops",
    description:
      "An ice-cream cone standing on its tip: a waffle cone, two stacked scoops, cream drips and a bright cherry.",
    aria:
      "An isometric ice-cream cone with a waffle lattice, two stacked scoops, cream drips and a bright cherry.",
    faces: iceCreamFaces(),
    motions: [
      { group: "scoopTop", kind: "lift", period: 3200, amount: 2.4 },
      {
        group: "cherry",
        kind: "sway",
        period: 2800,
        amount: 6,
        pivot: [4, -2, 118],
      },
      { group: "drip", kind: "breathe", period: 3000, amount: 0.06 },
      { group: "cone", kind: "breathe", period: 5600, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 216. Mushroom — mushroom                                                   */
/* -------------------------------------------------------------------------- */

function mushroomFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 50, 14, 11, {
      tone: "edge",
      topTone: "lo",
      bottomArc: true,
      group: "stem",
    }),
    frontRing(0, 0, 38, 16, "lo", "stem"),
    frontRing(0, 0, 42, 15, "lo", "stem"),
  );

  /* Cap: a flared dome with a rim and engraved gills underneath. */
  faces.push(
    ...cylinder(0, 0, 50, 17, 41, 21, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
      group: "cap",
    }),
    ellipse3(0, 0, 50.2, 41, 41, {
      fill: false,
      tone: "lo",
      group: "cap",
    }),
    ellipse3(0, 0, 67.1, 21, 21, {
      fill: false,
      tone: "lo",
      group: "cap",
    }),
  );

  /* Spots on the cap. */
  const spot = (x: number, y: number, r: number) => {
    const [px, py] = at(x, y, 66.8);
    faces.push(
      face2(circle(px, py, r, 20), { tone: "lo", group: "cap" }),
    );
  };
  spot(-20, 6, 6);
  spot(4, -4, 7);
  spot(22, 10, 5);
  spot(-4, 18, 4.4);
  spot(16, 24, 3.6);

  /* A low cloud of spores, the bright accent. */
  for (const [x, y, z, r] of [
    [-10, 0, 76, 2.6],
    [6, 4, 82, 2],
    [18, -4, 78, 2.2],
    [-2, 10, 86, 1.8],
    [24, 6, 84, 1.6],
  ] as const) {
    faces.push(...ball(x, y, z, r, { tone: "hi", group: "spores" }));
  }

  return faces;
}

export const mushroom: PrototypeMeta = {
  slug: "mushroom",
  name: "Mushroom",
  component: "Objects",
  object: "Mushroom",
  story:
    "The cap opens a fraction and a bright cloud of spores drifts up from the gills.",
  note: "A generic object: a living thing with a clean silhouette, cap and stem.",
  scene: figureScene({
    slug: "mushroom",
    name: "Mushroom",
    component: "Objects",
    object: "Mushroom",
    description:
      "A mushroom standing on its stem: a flared spotted cap, a skirt, engraved gills and a cloud of spores.",
    aria:
      "An isometric mushroom with a flared spotted cap, a skirted stem and a cloud of bright spores.",
    faces: mushroomFaces(),
    motions: [
      { group: "cap", kind: "breathe", period: 3200, amount: 0.035 },
      { group: "spores", kind: "bob", period: 3000, amount: 3.4 },
      { group: "stem", kind: "breathe", period: 5800, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 217. Flower — flower in bloom                                              */
/* -------------------------------------------------------------------------- */

function flowerFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    tube(
      [
        [0, 0, 0],
        [4, 0, 30],
        [1, 0, 62],
      ],
      3.6,
      { tone: "edge", group: "stem" },
    ),
  );

  const [sx, sy] = at(4, 0, 30);
  faces.push(
    ...leaf(sx + 12, sy - 4, 30, 13, -0.5, { tone: "mid", group: "stem" }),
    ...leaf(sx - 12, sy - 16, 26, 12, 2.7, { tone: "mid", group: "stem" }),
  );

  const [cx, cy] = at(1, 0, 84);
  faces.push(
    ...petalRing(cx, cy, 8, 19, 27, 13, 0.25, {
      tone: "edge",
      group: "petals",
    }),
    face2(circle(cx, cy, 11, 30), { tone: "mid", group: "heart" }),
    face2(circle(cx, cy, 7, 24), { tone: "lo", group: "heart" }),
    face2(circle(cx, cy, 3.4, 16), { tone: "hi", group: "heart" }),
  );

  /* Two tiny pollen dots. */
  for (const [dx, dy] of [
    [-4, -3],
    [5, 2],
  ] as const) {
    faces.push(
      face2(circle(cx + dx, cy + dy, 1.3, 10), {
        tone: "lo",
        group: "petals",
      }),
    );
  }

  return faces;
}

export const flower: PrototypeMeta = {
  slug: "flower",
  name: "Flower",
  component: "Objects",
  object: "Flower in bloom",
  story:
    "The petals open outward and the bright heart lifts at the centre.",
  note: "A generic object: bloom as a radial crown of petals around one heart.",
  scene: figureScene({
    slug: "flower",
    name: "Flower",
    component: "Objects",
    object: "Flower in bloom",
    description:
      "A flower on a curved stem: two leaves and a head of eight petals around a bright heart.",
    aria:
      "An isometric flower on a curved stem with two leaves and eight open petals around a bright heart.",
    faces: flowerFaces(),
    motions: [
      { group: "petals", kind: "breathe", period: 3200, amount: 0.045 },
      { group: "heart", kind: "lift", period: 2800, amount: 2.2 },
      {
        group: "stem",
        kind: "sway",
        period: 4800,
        amount: 2,
        pivot: [0, 0, 0],
      },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 218. Tree — leafy tree                                                     */
/* -------------------------------------------------------------------------- */

function treeFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  /* Trunk with a flared base, two roots and two branches. */
  faces.push(
    ...tapered([0, 0, 0], [3, 0, 64], 13, 7, {
      tone: "edge",
      group: "trunk",
    }),
    stroke3(
      [
        [-6, 0, 7],
        [-17, 0, 1],
        [-23, 0, 6],
      ],
      "mid",
      { group: "trunk" },
    ),
    stroke3(
      [
        [7, 0, 7],
        [18, 0, 1],
        [24, 0, 6],
      ],
      "mid",
      { group: "trunk" },
    ),
    tube(
      [
        [2, 0, 46],
        [-18, 0, 64],
      ],
      4,
      { tone: "mid", group: "trunk" },
    ),
    tube(
      [
        [3, 0, 44],
        [20, 2, 62],
      ],
      4,
      { tone: "mid", group: "trunk" },
    ),
  );

  /* A single bumpy crown, built in screen space so the outline stays leafy. */
  const [cx, cy] = at(0, 0, 84);
  const crown: Point2[] = [
    [cx - 54, cy + 12],
    [cx - 60, cy - 4],
    [cx - 48, cy - 22],
    [cx - 34, cy - 16],
    [cx - 30, cy - 36],
    [cx - 12, cy - 30],
    [cx - 2, cy - 50],
    [cx + 14, cy - 38],
    [cx + 30, cy - 34],
    [cx + 38, cy - 18],
    [cx + 52, cy - 8],
    [cx + 50, cy + 10],
    [cx + 34, cy + 20],
    [cx + 14, cy + 18],
    [cx - 6, cy + 26],
    [cx - 30, cy + 22],
  ].map(([x, y]) => [x, y] as Point2);
  faces.push(
    face2(crown, { tone: "edge", group: "canopy" }),
    face2(
      crown.map(([x, y]) => [
        cx + (x - cx) * 0.88,
        cy + (y - cy) * 0.86,
      ] as Point2),
      { fill: false, tone: "lo", group: "canopy" },
    ),
  );

  /* Three engraved arcs suggest the leaf clusters inside the crown. */
  faces.push(
    stroke2(
      [
        [cx - 45, cy + 2],
        [cx - 38, cy - 16],
        [cx - 22, cy - 24],
      ],
      "lo",
      { group: "canopy" },
    ),
    stroke2(
      [
        [cx + 2, cy - 40],
        [cx + 20, cy - 32],
        [cx + 30, cy - 18],
      ],
      "lo",
      { group: "canopy" },
    ),
    stroke2(
      [
        [cx - 10, cy + 8],
        [cx + 4, cy],
        [cx + 20, cy + 6],
      ],
      "lo",
      { group: "canopy" },
    ),
  );

  /* Leaves attached to the crown edge. */
  faces.push(
    ...leaf(cx + 48, cy - 12, 24, 10, 0.3, {
      tone: "mid",
      group: "canopy",
    }),
    ...leaf(cx - 52, cy + 2, 20, 9, 2.95, {
      tone: "mid",
      group: "canopy",
    }),
    ...leaf(cx + 20, cy + 24, 18, 8, 1.1, {
      tone: "lo",
      group: "canopy",
    }),
  );

  /* One leaf is falling: the bright accent. */
  const [fx, fy] = at(40, -18, 34);
  faces.push(...leaf(fx, fy, 24, 11, 1.05, { tone: "hi", group: "fall" }));

  return faces;
}

export const tree: PrototypeMeta = {
  slug: "tree",
  name: "Tree",
  component: "Objects",
  object: "Leafy tree",
  story:
    "The crown sways on the trunk and a bright leaf comes loose and drifts down.",
  note: "A generic object: growth as one vertical silhouette, trunk and crown.",
  scene: figureScene({
    slug: "tree",
    name: "Tree",
    component: "Objects",
    object: "Leafy tree",
    description:
      "A leafy tree: a tapered trunk with roots and two branches under a five-lobed crown, one leaf falling.",
    aria:
      "An isometric leafy tree with a tapered trunk, two branches, a five-lobed crown and one falling bright leaf.",
    faces: treeFaces(),
    motions: [
      {
        group: "canopy",
        kind: "sway",
        period: 4600,
        amount: 2.4,
        pivot: [0, 0, 54],
      },
      { group: "fall", kind: "bob", period: 2800, amount: 5 },
      { group: "trunk", kind: "breathe", period: 6000, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 219. Leaf — single leaf                                                    */
/* -------------------------------------------------------------------------- */

function leafFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    tube(
      [
        [0, 0, 0],
        [3, 0, 16],
        [0, 0, 28],
      ],
      3.4,
      { tone: "edge", group: "stem" },
    ),
  );

  const [cx, cy] = at(0, 0, 70);
  const angle = -0.95;
  faces.push(
    ...leaf(cx, cy, 104, 54, angle, { tone: "edge", group: "leaf" }),
  );

  /* Side veins branch from the midrib. */
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const along = (t: number, o = 0): Point2 => [
    cx + ca * t - sa * o,
    cy + sa * t + ca * o,
  ];
  for (let index = 0; index < 6; index += 1) {
    const t = -26 + index * 17;
    const side = index % 2 === 0 ? 1 : -1;
    const base = along(t);
    const tip = along(t + 10, side * 18);
    const mid = along(t + 6, side * 10);
    faces.push(
      face2([base, mid, tip], {
        fill: false,
        tone: "lo",
        group: "leaf",
      }),
    );
  }
  faces.push(
    stroke2([along(-48), along(48)], "mid", { group: "leaf" }),
  );

  /* A dewdrop on the blade is the bright accent. */
  const dew = along(18, -12);
  faces.push(
    face2(circle(dew[0], dew[1], 3.6, 16), { tone: "hi", group: "dew" }),
    face2(circle(dew[0] + 1, dew[1] - 1, 1.2, 10), {
      tone: "lo",
      group: "dew",
    }),
  );

  return faces;
}

export const leafObject: PrototypeMeta = {
  slug: "leaf",
  name: "Leaf",
  component: "Objects",
  object: "Single leaf",
  story:
    "The blade turns on its stem and the veins catch the light around a bright dewdrop.",
  note: "A generic object: one leaf, the unit a whole plant is built from.",
  scene: figureScene({
    slug: "leaf",
    name: "Leaf",
    component: "Objects",
    object: "Single leaf",
    description:
      "A single leaf standing on its stem: a broad blade, a midrib, six side veins and a dewdrop.",
    aria:
      "An isometric single leaf on its stem with a midrib, six side veins and a bright dewdrop.",
    faces: leafFaces(),
    motions: [
      {
        group: "leaf",
        kind: "sway",
        period: 3800,
        amount: 4,
        pivot: [0, 0, 30],
      },
      { group: "dew", kind: "bob", period: 2600, amount: 1.6 },
      { group: "stem", kind: "breathe", period: 5600, amount: 0.003 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 220. Sun — sun with rays                                                   */
/* -------------------------------------------------------------------------- */

function sunFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [cx, cy] = at(0, 0, 78);

  faces.push(
    face2(circle(cx, cy, 31, 44), { tone: "edge", group: "core" }),
    face2(circle(cx, cy, 25, 38), { tone: "lo", group: "core" }),
  );

  for (let index = 0; index < 12; index += 1) {
    const a = (index / 12) * TAU;
    const long = index % 2 === 0;
    const inner = 35;
    const outer = long ? 55 : 46;
    const spread = 0.075;
    faces.push(
      face2(
        [
          ray(cx, cy, a - spread, inner),
          ray(cx, cy, a, outer),
          ray(cx, cy, a + spread, inner),
        ],
        { tone: index === 4 ? "hi" : "edge", group: "rays" },
      ),
    );
  }

  return faces;
}

export const sun: PrototypeMeta = {
  slug: "sun",
  name: "Sun",
  component: "Objects",
  object: "Sun with rays",
  story:
    "The rays stretch outward and the disc pulses, one long ray holding the accent.",
  note: "A generic object: light as a radial body, a disc and its crown of rays.",
  scene: figureScene({
    slug: "sun",
    name: "Sun",
    component: "Objects",
    object: "Sun with rays",
    description:
      "A sun seen from the front: a bright disc ringed by twelve triangular rays of two lengths.",
    aria:
      "An isometric sun with a bright disc and twelve triangular rays, one ray carrying the accent.",
    faces: sunFaces(),
    motions: [
      { group: "rays", kind: "breathe", period: 3200, amount: 0.06 },
      { group: "core", kind: "breathe", period: 2600, amount: 0.025 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 221. Moon — crescent moon                                                  */
/* -------------------------------------------------------------------------- */

function moonFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [cx, cy] = at(0, 0, 80);

  /* A crescent cut from two circles, drawn as one screen-space loop. */
  const outline: Point2[] = [];
  for (let index = 0; index <= 26; index += 1) {
    const a = -2.15 + (index / 26) * 4.3;
    outline.push([cx + Math.cos(a) * 40, cy + Math.sin(a) * 40]);
  }
  for (let index = 26; index >= 0; index -= 1) {
    const a = -2.05 + (index / 26) * 4.1;
    outline.push([
      cx + 15 + Math.cos(a) * 34,
      cy - 4 + Math.sin(a) * 34,
    ]);
  }
  faces.push(
    face2(outline, { tone: "edge", group: "moon" }),
    stroke2(
      [
        [cx - 22, cy - 24],
        [cx - 10, cy - 18],
        [cx - 6, cy - 4],
        [cx - 14, cy + 10],
      ],
      "lo",
      { group: "moon" },
    ),
  );

  /* Three craters. */
  for (const [dx, dy, r] of [
    [-18, -6, 5],
    [-8, 10, 3.4],
    [-20, 16, 2.6],
    [-28, 6, 2.2],
    [-12, 24, 1.8],
    [-31, -10, 1.6],
  ] as const) {
    faces.push(
      face2(circle(cx + dx, cy + dy, r, 18), {
        fill: false,
        tone: "lo",
        group: "moon",
      }),
    );
  }

  /* One small star, the accent. */
  faces.push(
    face2(star(cx + 46, cy - 40, 9, 3, 4, -Math.PI / 2), {
      tone: "hi",
      group: "star",
    }),
  );

  return faces;
}

export const moon: PrototypeMeta = {
  slug: "moon",
  name: "Moon",
  component: "Objects",
  object: "Crescent moon",
  story:
    "The crescent turns slowly and the little star beside it flickers once.",
  note: "A generic object: night light reduced to a single crescent and a star.",
  scene: figureScene({
    slug: "moon",
    name: "Moon",
    component: "Objects",
    object: "Crescent moon",
    description:
      "A crescent moon with three craters and a small four-point star beside it.",
    aria:
      "An isometric crescent moon with three craters and a small bright four-point star.",
    faces: moonFaces(),
    motions: [
      {
        group: "moon",
        kind: "sway",
        period: 5000,
        amount: 3.4,
        pivot: [0, 0, 80],
      },
      { group: "star", kind: "flicker", period: 2200, amount: 0.18 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 222. Five-point star — five-point star                                     */
/* -------------------------------------------------------------------------- */

function fivePointStarFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [cx, cy] = at(0, 0, 76);

  faces.push(
    face2(star(cx, cy, 54, 23, 5, -Math.PI / 2), {
      tone: "edge",
      group: "star",
    }),
    face2(star(cx, cy, 34, 14.5, 5, -Math.PI / 2), {
      fill: false,
      tone: "mid",
      group: "star",
    }),
    face2(star(cx, cy, 20, 8.5, 5, -Math.PI / 2), {
      fill: false,
      tone: "lo",
      group: "star",
    }),
  );

  /* Three facet lines from the centre to outer points. */
  for (const angle of [
    -Math.PI / 2,
    -Math.PI / 2 + (Math.PI * 2) / 5,
    -Math.PI / 2 - (Math.PI * 2) / 5,
  ]) {
    faces.push(
      face2(
        [
          [cx, cy],
          ray(cx, cy, angle, 50),
        ],
        { fill: false, tone: "lo", group: "star" },
      ),
    );
  }

  /* One bright edge from the centre to the top point. */
  faces.push(
    stroke2(
      [
        [cx, cy],
        [cx + Math.cos(-Math.PI / 2) * 51, cy + Math.sin(-Math.PI / 2) * 46],
      ],
      "hi",
      { group: "shine" },
    ),
  );

  /* A small hanging loop at the top. */
  faces.push(
    face2(circle(cx, cy - 62, 7, 24), {
      fill: false,
      tone: "mid",
      group: "star",
    }),
    face2(circle(cx, cy - 62, 4, 18), {
      fill: false,
      tone: "lo",
      group: "star",
    }),
  );

  return faces;
}

export const fivePointStar: PrototypeMeta = {
  slug: "five-point-star",
  name: "Five-point Star",
  component: "Objects",
  object: "Five-point star",
  story:
    "The star turns and one edge of its top point catches the light.",
  note: "A generic object: the simplest radial symbol, five points around a centre.",
  scene: figureScene({
    slug: "five-point-star",
    name: "Five-point Star",
    component: "Objects",
    object: "Five-point star",
    description:
      "A five-point star with an inner bevel and one bright edge running to the top point.",
    aria:
      "An isometric five-point star with an inner bevel and one bright edge to its top point.",
    faces: fivePointStarFaces(),
    motions: [
      { group: "star", kind: "spin", period: 16000, amount: 360 },
      { group: "shine", kind: "flicker", period: 2400, amount: 0.06 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 223. Cloud — puffy cloud                                                   */
/* -------------------------------------------------------------------------- */

function cloudFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [cx, cy] = at(0, 0, 76);

  const lobes: Array<[number, number, number]> = [
    [-40, 8, 19],
    [-24, -8, 23],
    [-2, -16, 26],
    [22, -10, 22],
    [38, 4, 18],
    [16, 12, 20],
    [-12, 14, 20],
  ];
  for (const [dx, dy, r] of lobes) {
    faces.push(
      face2(circle(cx + dx, cy + dy, r, 32), {
        tone: "edge",
        group: "cloud",
      }),
    );
  }
  faces.push(
    stroke2(
      [
        [cx - 46, cy + 22],
        [cx + 44, cy + 22],
      ],
      "lo",
      { group: "cloud" },
    ),
  );

  /* Three falling drops, one of them bright. */
  for (const [dx, dy, r, bright] of [
    [-18, 38, 3.4, false],
    [4, 46, 4, true],
    [24, 36, 3, false],
  ] as const) {
    faces.push(
      face2(
        [
          [cx + dx, cy + dy - r * 1.5],
          [cx + dx + r, cy + dy],
          [cx + dx - r, cy + dy],
        ],
        { tone: bright ? "hi" : "mid", group: "drops" },
      ),
    );
  }

  return faces;
}

export const cloud: PrototypeMeta = {
  slug: "cloud",
  name: "Cloud",
  component: "Objects",
  object: "Puffy cloud",
  story:
    "The cloud drifts on the air and three drops fall, the middle one lit.",
  note: "A generic object: weather read at a glance, a mass of soft lobes.",
  scene: figureScene({
    slug: "cloud",
    name: "Cloud",
    component: "Objects",
    object: "Puffy cloud",
    description:
      "A puffy cloud of seven lobes over a flat base, with three falling drops, one of them bright.",
    aria:
      "An isometric puffy cloud made of seven lobes with three falling drops, one bright drop in the middle.",
    faces: cloudFaces(),
    motions: [
      { group: "cloud", kind: "bob", period: 5200, amount: 3.4 },
      { group: "drops", kind: "lift", period: 2000, amount: 3 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 224. Teapot — teapot                                                       */
/* -------------------------------------------------------------------------- */

function teapotFaces(): FigureFace[] {
  const faces: FigureFace[] = [];
  const [cx, cy] = at(0, 0, 44);

  /* Foot ring, body, spout and handle. */
  faces.push(
    ...cylinder(0, 0, 0, 8, 21, 19, {
      tone: "edge",
      topTone: "lo",
      bottomArc: true,
    }),
    frontRing(0, 0, 8, 19, "lo", "body"),
  );

  /* Spout and handle are behind the body. */
  faces.push(
    ...tapered([21, 0, 54], [44, 0, 70], 8, 3.6, {
      tone: "edge",
      group: "spout",
    }),
    ellipse2(...at(44, 0, 70), 4, 2.6, 20).length
      ? face2(ellipse2(...at(44, 0, 70), 4, 2.6, 20), {
          fill: false,
          tone: "lo",
          group: "spout",
        })
      : face2([], {}),
    tube(
      [
        [-22, 0, 56],
        [-42, 0, 58],
        [-48, 0, 38],
        [-40, 0, 20],
        [-22, 0, 16],
      ],
      6,
      { tone: "edge", group: "handle" },
    ),
  );

  faces.push(...ball(0, 0, 44, 32, { tone: "edge", group: "body" }));

  /* A horizontal belly line and the lid. */
  faces.push(
    stroke2(
      [
        [cx - 30, cy + 6],
        [cx - 22, cy + 15],
        [cx, cy + 18],
      ],
      "lo",
      { group: "body" },
    ),
  );
  faces.push(
    ...dome(cx, cy - 31, 17, 7, 8, { tone: "mid", group: "lid" }),
    face2(circle(cx, cy - 40, 4.2, 18), { tone: "hi", group: "knob" }),
  );

  /* Steam leaves the spout in two soft curls. */
  const [sx2, sy2] = at(44, 0, 74);
  for (const [start, amp] of [
    [0, 6],
    [7, 4],
  ] as const) {
    const points: Point2[] = [];
    for (let index = 0; index <= 8; index += 1) {
      const t = index / 8;
      points.push([
        sx2 + start - t * 10 + Math.sin(t * Math.PI * 2) * amp,
        sy2 - t * 26,
      ]);
    }
    faces.push(
      face2(points, { fill: false, tone: "mid", group: "steam" }),
    );
  }

  return faces;
}

export const teapot: PrototypeMeta = {
  slug: "teapot",
  name: "Teapot",
  component: "Objects",
  object: "Teapot",
  story:
    "The lid lifts on its rim and two soft curls of steam leave the spout.",
  note: "A generic object: tea held in a round body with a spout and an ear.",
  scene: figureScene({
    slug: "teapot",
    name: "Teapot",
    component: "Objects",
    object: "Teapot",
    description:
      "A round teapot on a foot ring: a curved spout, a large ear handle, a domed lid and a bright knob.",
    aria:
      "An isometric round teapot with a curved spout, a large handle, a domed lid and two curls of steam.",
    faces: teapotFaces(),
    motions: [
      { group: "lid", kind: "lift", period: 3400, amount: 3 },
      { group: "steam", kind: "bob", period: 3000, amount: 3 },
      { group: "body", kind: "breathe", period: 5800, amount: 0.003 },
      { group: "spout", kind: "sway", period: 4200, amount: 1.4 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* 225. Kettle — stovetop kettle                                              */
/* -------------------------------------------------------------------------- */

function kettleFaces(): FigureFace[] {
  const faces: FigureFace[] = [];

  faces.push(
    ...cylinder(0, 0, 0, 6, 37, 37, {
      tone: "edge",
      topTone: "lo",
      bottomArc: true,
    }),
    ...cylinder(0, 0, 5, 44, 35, 25, {
      tone: "edge",
      topTone: "mid",
      bottomArc: true,
      group: "body",
    }),
    frontRing(0, 0, 20, 32, "lo", "body"),
  );

  /* Spout and whistle. */
  faces.push(
    ...tapered([29, 0, 24], [49, 0, 38], 9, 4.4, {
      tone: "edge",
      group: "spout",
    }),
    ...ball(50, 0, 41, 4.4, { tone: "hi", group: "whistle" }),
  );

  /* Arch handle. */
  faces.push(
    tube(
      [
        [-28, 0, 48],
        [-24, 0, 74],
        [0, 0, 86],
        [24, 0, 74],
        [28, 0, 48],
      ],
      5.5,
      { tone: "edge", group: "handle" },
    ),
  );

  /* Lid and knob. */
  faces.push(
    ...cylinder(0, 0, 48, 8, 21, 15, {
      tone: "mid",
      topTone: "mid",
      group: "lid",
    }),
    ...ball(0, 0, 60, 4.2, { tone: "mid", group: "lid" }),
  );

  /* Steam jets from the whistle. */
  const [wx2, wy2] = at(52, 0, 46);
  for (const [dx, amp] of [
    [0, 3],
    [6, 2],
  ] as const) {
    const points: Point2[] = [];
    for (let index = 0; index <= 7; index += 1) {
      const t = index / 7;
      points.push([
        wx2 + dx + t * 10 + Math.sin(t * Math.PI * 2) * amp,
        wy2 - t * 24,
      ]);
    }
    faces.push(
      face2(points, { fill: false, tone: "mid", group: "steam" }),
    );
  }

  return faces;
}

export const kettle: PrototypeMeta = {
  slug: "kettle",
  name: "Kettle",
  component: "Objects",
  object: "Stovetop kettle",
  story:
    "The whistle shakes, steam jets from the spout and the lid knocks once.",
  note: "A generic object: boiling made audible by a squat body and a whistle.",
  scene: figureScene({
    slug: "kettle",
    name: "Kettle",
    component: "Objects",
    object: "Stovetop kettle",
    description:
      "A stovetop kettle: a wide body, a short spout with a bright whistle, an arch handle and a domed lid.",
    aria:
      "An isometric stovetop kettle with a wide body, a short spout, a bright whistle, an arch handle and steam.",
    faces: kettleFaces(),
    motions: [
      { group: "whistle", kind: "sway", period: 900, amount: 4.5 },
      { group: "steam", kind: "flicker", period: 1400, amount: 0.14 },
      { group: "lid", kind: "lift", period: 1100, amount: 1.4 },
      { group: "handle", kind: "breathe", period: 5600, amount: 0.002 },
    ],
    press: 1,
  }),
};

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                  */
/* -------------------------------------------------------------------------- */

export const lot9Prototypes: PrototypeMeta[] = [
  padlock,
  envelope,
  lightbulb,
  book,
  camera,
  headphones,
  clock,
  globe,
  trophy,
  umbrella,
  hourglass,
  compass,
  magnifier,
  donut,
  iceCream,
  mushroom,
  flower,
  tree,
  leafObject,
  sun,
  moon,
  fivePointStar,
  cloud,
  teapot,
  kettle,
];

export const lot9BySlug = new Map(
  lot9Prototypes.map((item) => [item.slug, item]),
);
