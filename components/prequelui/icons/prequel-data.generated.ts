export type PrequelIconRole = "primary" | "secondary" | "accent";
export type PrequelIconStyle = "outline" | "solid" | "duotone" | "color" | "emoji";

export type PrequelIconPart = {
  tag: "path" | "circle" | "rect" | "line" | "polyline" | "polygon" | "ellipse";
  attrs: Record<string, string | number>;
  role?: PrequelIconRole;
  closed?: boolean;
  draw?: boolean;
  inside?: boolean;
};

export type PrequelColorPalette = {
  primary: string;
  primaryDark: string;
  accent: string;
  accentDark: string;
};

export type PrequelEmojiPalette = {
  primary: string;
  secondary: string;
  accent: string;
};

export type PrequelIconDefinition = {
  slug: string;
  name: string;
  category: string;
  keywords: string[];
  description: string;
  component: string;
  file: string;
  motion: string;
  effects: string[];
  parts: PrequelIconPart[];
  roles: PrequelIconRole[];
  closed: boolean[];
  highlight: { cx: number; cy: number; rx: number; ry: number } | null;
  palette: PrequelColorPalette;
  emoji: PrequelEmojiPalette;
  styles: PrequelIconStyle[];
  fill: string[];
  svg: string;
};

export const prequelIcons: PrequelIconDefinition[] = [
  {
    "slug": "arrow-up",
    "name": "Arrow Up",
    "category": "Arrows",
    "keywords": [
      "up",
      "north",
      "rise",
      "direction"
    ],
    "description": "A vertical arrow that lifts a little further on every trigger.",
    "component": "PrequelArrowUpIcon",
    "file": "prequel-arrow-up.tsx",
    "motion": "slideUp",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M12 20V5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 11l6-6 6 6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.6 0.15 250)",
      "primaryDark": "oklch(0.78 0.12 250)",
      "accent": "oklch(0.7 0.16 235)",
      "accentDark": "oklch(0.82 0.13 235)"
    },
    "emoji": {
      "primary": "oklch(0.72 0.19 48)",
      "secondary": "oklch(0.58 0.18 45)",
      "accent": "oklch(0.74 0.13 232)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 20V5\" /><path d=\"M6 11l6-6 6 6\" /></svg>"
  },
  {
    "slug": "arrow-down",
    "name": "Arrow Down",
    "category": "Arrows",
    "keywords": [
      "down",
      "south",
      "fall",
      "direction"
    ],
    "description": "A vertical arrow that drops into place with a soft landing.",
    "component": "PrequelArrowDownIcon",
    "file": "prequel-arrow-down.tsx",
    "motion": "slideDown",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M12 4v15"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 13l6 6 6-6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.6 0.15 250)",
      "primaryDark": "oklch(0.78 0.12 250)",
      "accent": "oklch(0.7 0.16 235)",
      "accentDark": "oklch(0.82 0.13 235)"
    },
    "emoji": {
      "primary": "oklch(0.72 0.19 48)",
      "secondary": "oklch(0.58 0.18 45)",
      "accent": "oklch(0.74 0.13 232)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 4v15\" /><path d=\"M6 13l6 6 6-6\" /></svg>"
  },
  {
    "slug": "arrow-left",
    "name": "Arrow Left",
    "category": "Arrows",
    "keywords": [
      "left",
      "west",
      "back",
      "direction"
    ],
    "description": "A horizontal arrow that steps left before settling.",
    "component": "PrequelArrowLeftIcon",
    "file": "prequel-arrow-left.tsx",
    "motion": "slideLeft",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M20 12H5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M11 6l-6 6 6 6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.6 0.15 250)",
      "primaryDark": "oklch(0.78 0.12 250)",
      "accent": "oklch(0.7 0.16 235)",
      "accentDark": "oklch(0.82 0.13 235)"
    },
    "emoji": {
      "primary": "oklch(0.72 0.19 48)",
      "secondary": "oklch(0.58 0.18 45)",
      "accent": "oklch(0.74 0.13 232)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M20 12H5\" /><path d=\"M11 6l-6 6 6 6\" /></svg>"
  },
  {
    "slug": "arrow-right",
    "name": "Arrow Right",
    "category": "Arrows",
    "keywords": [
      "right",
      "east",
      "next",
      "direction"
    ],
    "description": "A horizontal arrow that steps right before settling.",
    "component": "PrequelArrowRightIcon",
    "file": "prequel-arrow-right.tsx",
    "motion": "slideRight",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M4 12h15"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M13 6l6 6-6 6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.6 0.15 250)",
      "primaryDark": "oklch(0.78 0.12 250)",
      "accent": "oklch(0.7 0.16 235)",
      "accentDark": "oklch(0.82 0.13 235)"
    },
    "emoji": {
      "primary": "oklch(0.72 0.19 48)",
      "secondary": "oklch(0.58 0.18 45)",
      "accent": "oklch(0.74 0.13 232)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 12h15\" /><path d=\"M13 6l6 6-6 6\" /></svg>"
  },
  {
    "slug": "arrow-up-right",
    "name": "Arrow Up Right",
    "category": "Arrows",
    "keywords": [
      "diagonal",
      "north east",
      "external",
      "open"
    ],
    "description": "A diagonal arrow that leans out of its corner on hover.",
    "component": "PrequelArrowUpRightIcon",
    "file": "prequel-arrow-up-right.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M6 18L18 6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 6h9v9"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.6 0.15 250)",
      "primaryDark": "oklch(0.78 0.12 250)",
      "accent": "oklch(0.7 0.16 235)",
      "accentDark": "oklch(0.82 0.13 235)"
    },
    "emoji": {
      "primary": "oklch(0.72 0.19 48)",
      "secondary": "oklch(0.58 0.18 45)",
      "accent": "oklch(0.74 0.13 232)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 18L18 6\" /><path d=\"M9 6h9v9\" /></svg>"
  },
  {
    "slug": "arrow-down-left",
    "name": "Arrow Down Left",
    "category": "Arrows",
    "keywords": [
      "diagonal",
      "south west",
      "return",
      "inbound"
    ],
    "description": "A diagonal arrow that points back into its corner.",
    "component": "PrequelArrowDownLeftIcon",
    "file": "prequel-arrow-down-left.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M18 6L6 18"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M15 18H6V9"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.6 0.15 250)",
      "primaryDark": "oklch(0.78 0.12 250)",
      "accent": "oklch(0.7 0.16 235)",
      "accentDark": "oklch(0.82 0.13 235)"
    },
    "emoji": {
      "primary": "oklch(0.72 0.19 48)",
      "secondary": "oklch(0.58 0.18 45)",
      "accent": "oklch(0.74 0.13 232)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M18 6L6 18\" /><path d=\"M15 18H6V9\" /></svg>"
  },
  {
    "slug": "refresh",
    "name": "Refresh",
    "category": "Arrows",
    "keywords": [
      "reload",
      "sync",
      "cycle",
      "arrows"
    ],
    "description": "Two chasing arcs with arrowheads that redraw on each pass.",
    "component": "PrequelRefreshIcon",
    "file": "prequel-refresh.tsx",
    "motion": "spin",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M4 12a8 8 0 0 1 13.9-5.4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M20 12a8 8 0 0 1-13.9 5.4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M18.5 3.5v4h-4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M5.5 20.5v-4h4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false,
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.6 0.15 250)",
      "primaryDark": "oklch(0.78 0.12 250)",
      "accent": "oklch(0.7 0.16 235)",
      "accentDark": "oklch(0.82 0.13 235)"
    },
    "emoji": {
      "primary": "oklch(0.72 0.19 48)",
      "secondary": "oklch(0.58 0.18 45)",
      "accent": "oklch(0.74 0.13 232)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 12a8 8 0 0 1 13.9-5.4\" /><path d=\"M20 12a8 8 0 0 1-13.9 5.4\" /><path d=\"M18.5 3.5v4h-4\" /><path d=\"M5.5 20.5v-4h4\" /></svg>"
  },
  {
    "slug": "repeat",
    "name": "Repeat",
    "category": "Arrows",
    "keywords": [
      "loop",
      "again",
      "cycle",
      "arrows"
    ],
    "description": "Two return arrows that trade places in a quiet cycle.",
    "component": "PrequelRepeatIcon",
    "file": "prequel-repeat.tsx",
    "motion": "slideRight",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M17 3l3 3-3 3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 11V9a4 4 0 0 1 4-4h12"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M7 21l-3-3 3-3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M20 13v2a4 4 0 0 1-4 4H4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false,
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.6 0.15 250)",
      "primaryDark": "oklch(0.78 0.12 250)",
      "accent": "oklch(0.7 0.16 235)",
      "accentDark": "oklch(0.82 0.13 235)"
    },
    "emoji": {
      "primary": "oklch(0.72 0.19 48)",
      "secondary": "oklch(0.58 0.18 45)",
      "accent": "oklch(0.74 0.13 232)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M17 3l3 3-3 3\" /><path d=\"M4 11V9a4 4 0 0 1 4-4h12\" /><path d=\"M7 21l-3-3 3-3\" /><path d=\"M20 13v2a4 4 0 0 1-4 4H4\" /></svg>"
  },
  {
    "slug": "chart-bar",
    "name": "Chart Bar",
    "category": "Charts",
    "keywords": [
      "bar",
      "graph",
      "stats",
      "analytics"
    ],
    "description": "Three columns that grow from the baseline one after another.",
    "component": "PrequelChartBarIcon",
    "file": "prequel-chart-bar.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M4 20h16"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "rect",
        "attrs": {
          "x": 6,
          "y": 12,
          "width": 3,
          "height": 7,
          "rx": 1
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "rect",
        "attrs": {
          "x": 10.5,
          "y": 8,
          "width": 3,
          "height": 11,
          "rx": 1
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "rect",
        "attrs": {
          "x": 15,
          "y": 4,
          "width": 3,
          "height": 15,
          "rx": 1
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "accent",
      "accent",
      "primary"
    ],
    "closed": [
      false,
      true,
      true,
      true
    ],
    "highlight": {
      "cx": 15.9,
      "cy": 8.2,
      "rx": 1.1,
      "ry": 0.7
    },
    "palette": {
      "primary": "oklch(0.6 0.16 290)",
      "primaryDark": "oklch(0.78 0.13 290)",
      "accent": "oklch(0.7 0.15 310)",
      "accentDark": "oklch(0.82 0.12 310)"
    },
    "emoji": {
      "primary": "oklch(0.6 0.2 300)",
      "secondary": "oklch(0.46 0.18 300)",
      "accent": "oklch(0.68 0.2 27)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 20h16\" /><rect x=\"6\" y=\"12\" width=\"3\" height=\"7\" rx=\"1\" /><rect x=\"10.5\" y=\"8\" width=\"3\" height=\"11\" rx=\"1\" /><rect x=\"15\" y=\"4\" width=\"3\" height=\"15\" rx=\"1\" /></svg>"
  },
  {
    "slug": "chart-line",
    "name": "Chart Line",
    "category": "Charts",
    "keywords": [
      "line",
      "graph",
      "trend",
      "analytics"
    ],
    "description": "An axes corner with a trend line that draws itself in.",
    "component": "PrequelChartLineIcon",
    "file": "prequel-chart-line.tsx",
    "motion": "slideRight",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M4 4v16h16"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "polyline",
        "attrs": {
          "points": "7 15 11 10 15 13 20 6"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.6 0.16 290)",
      "primaryDark": "oklch(0.78 0.13 290)",
      "accent": "oklch(0.7 0.15 310)",
      "accentDark": "oklch(0.82 0.12 310)"
    },
    "emoji": {
      "primary": "oklch(0.6 0.2 300)",
      "secondary": "oklch(0.46 0.18 300)",
      "accent": "oklch(0.68 0.2 27)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 4v16h16\" /><polyline points=\"7 15 11 10 15 13 20 6\" /></svg>"
  },
  {
    "slug": "chart-pie",
    "name": "Chart Pie",
    "category": "Charts",
    "keywords": [
      "pie",
      "slice",
      "share",
      "analytics"
    ],
    "description": "A pie outline whose highlighted slice draws on every trigger.",
    "component": "PrequelChartPieIcon",
    "file": "prequel-chart-pie.tsx",
    "motion": "draw",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M12 3a9 9 0 1 0 9 9"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 3a9 9 0 0 1 9 9h-9V3Z"
        },
        "role": "primary",
        "closed": true,
        "draw": true,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 12,
          "cy": 12,
          "r": 1
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "accent"
    ],
    "closed": [
      false,
      true,
      true
    ],
    "highlight": {
      "cx": 17.4,
      "cy": 8.04,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.6 0.16 290)",
      "primaryDark": "oklch(0.78 0.13 290)",
      "accent": "oklch(0.7 0.15 310)",
      "accentDark": "oklch(0.82 0.12 310)"
    },
    "emoji": {
      "primary": "oklch(0.6 0.2 300)",
      "secondary": "oklch(0.46 0.18 300)",
      "accent": "oklch(0.68 0.2 27)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 3a9 9 0 1 0 9 9\" /><path d=\"M12 3a9 9 0 0 1 9 9h-9V3Z\" /><circle cx=\"12\" cy=\"12\" r=\"1\" /></svg>"
  },
  {
    "slug": "trending-up",
    "name": "Trending Up",
    "category": "Charts",
    "keywords": [
      "trend",
      "growth",
      "up",
      "analytics"
    ],
    "description": "A rising line that redraws while its arrowhead kicks upward.",
    "component": "PrequelTrendingUpIcon",
    "file": "prequel-trending-up.tsx",
    "motion": "slideRight",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "polyline",
        "attrs": {
          "points": "3 17 9 11 13 15 21 7"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": false
      },
      {
        "tag": "polyline",
        "attrs": {
          "points": "15 7 21 7 21 13"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.6 0.16 290)",
      "primaryDark": "oklch(0.78 0.13 290)",
      "accent": "oklch(0.7 0.15 310)",
      "accentDark": "oklch(0.82 0.12 310)"
    },
    "emoji": {
      "primary": "oklch(0.6 0.2 300)",
      "secondary": "oklch(0.46 0.18 300)",
      "accent": "oklch(0.68 0.2 27)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><polyline points=\"3 17 9 11 13 15 21 7\" /><polyline points=\"15 7 21 7 21 13\" /></svg>"
  },
  {
    "slug": "trending-down",
    "name": "Trending Down",
    "category": "Charts",
    "keywords": [
      "trend",
      "loss",
      "down",
      "analytics"
    ],
    "description": "A falling line that redraws while its arrowhead sinks.",
    "component": "PrequelTrendingDownIcon",
    "file": "prequel-trending-down.tsx",
    "motion": "slideRight",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "polyline",
        "attrs": {
          "points": "3 7 9 13 13 9 21 17"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": false
      },
      {
        "tag": "polyline",
        "attrs": {
          "points": "15 17 21 17 21 11"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.6 0.16 290)",
      "primaryDark": "oklch(0.78 0.13 290)",
      "accent": "oklch(0.7 0.15 310)",
      "accentDark": "oklch(0.82 0.12 310)"
    },
    "emoji": {
      "primary": "oklch(0.6 0.2 300)",
      "secondary": "oklch(0.46 0.18 300)",
      "accent": "oklch(0.68 0.2 27)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><polyline points=\"3 7 9 13 13 9 21 17\" /><polyline points=\"15 17 21 17 21 11\" /></svg>"
  },
  {
    "slug": "sun",
    "name": "Sun",
    "category": "Weather",
    "keywords": [
      "sun",
      "light",
      "day",
      "bright"
    ],
    "description": "A round sun whose rays rotate and flicker together.",
    "component": "PrequelSunIcon",
    "file": "prequel-sun.tsx",
    "motion": "spin",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "circle",
        "attrs": {
          "cx": 12,
          "cy": 12,
          "r": 4
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false
    ],
    "highlight": {
      "cx": 10.4,
      "cy": 10.24,
      "rx": 1.28,
      "ry": 0.7
    },
    "palette": {
      "primary": "oklch(0.62 0.14 235)",
      "primaryDark": "oklch(0.79 0.11 235)",
      "accent": "oklch(0.74 0.16 85)",
      "accentDark": "oklch(0.85 0.13 85)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.82 0.16 85)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"4\" /><path d=\"M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4\" /></svg>"
  },
  {
    "slug": "moon",
    "name": "Moon",
    "category": "Weather",
    "keywords": [
      "moon",
      "night",
      "dark",
      "sleep"
    ],
    "description": "A crescent moon that floats beside a twinkling star.",
    "component": "PrequelMoonIcon",
    "file": "prequel-moon.tsx",
    "motion": "float",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M17 2.6l.7 1.8 1.9.7-1.9.7-.7 1.8-.7-1.8-1.9-.7 1.9-.7Z"
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "accent"
    ],
    "closed": [
      true,
      true
    ],
    "highlight": {
      "cx": 9.25,
      "cy": 3.5,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.62 0.14 235)",
      "primaryDark": "oklch(0.79 0.11 235)",
      "accent": "oklch(0.74 0.16 85)",
      "accentDark": "oklch(0.85 0.13 85)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.82 0.16 85)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z\" /><path d=\"M17 2.6l.7 1.8 1.9.7-1.9.7-.7 1.8-.7-1.8-1.9-.7 1.9-.7Z\" /></svg>"
  },
  {
    "slug": "cloud",
    "name": "Cloud",
    "category": "Weather",
    "keywords": [
      "cloud",
      "sky",
      "weather",
      "soft"
    ],
    "description": "A single cloud that drifts up and back down.",
    "component": "PrequelCloudIcon",
    "file": "prequel-cloud.tsx",
    "motion": "float",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M6.5 18h11a3.5 3.5 0 0 0 .4-7 5.5 5.5 0 0 0-10.6-1.6A4.25 4.25 0 0 0 6.5 18Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary"
    ],
    "closed": [
      true
    ],
    "highlight": {
      "cx": 7.68,
      "cy": 9.04,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.62 0.14 235)",
      "primaryDark": "oklch(0.79 0.11 235)",
      "accent": "oklch(0.74 0.16 85)",
      "accentDark": "oklch(0.85 0.13 85)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.82 0.16 85)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6.5 18h11a3.5 3.5 0 0 0 .4-7 5.5 5.5 0 0 0-10.6-1.6A4.25 4.25 0 0 0 6.5 18Z\" /></svg>"
  },
  {
    "slug": "cloud-rain",
    "name": "Cloud Rain",
    "category": "Weather",
    "keywords": [
      "rain",
      "cloud",
      "shower",
      "weather"
    ],
    "description": "A cloud with three drops that fall in a staggered rhythm.",
    "component": "PrequelCloudRainIcon",
    "file": "prequel-cloud-rain.tsx",
    "motion": "float",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M6.5 16h11a3.5 3.5 0 0 0 .4-7 5.5 5.5 0 0 0-10.6-1.6A4.25 4.25 0 0 0 6.5 16Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 19v2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 19v3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M16 19v2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      false,
      false
    ],
    "highlight": {
      "cx": 7.68,
      "cy": 7.04,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.62 0.14 235)",
      "primaryDark": "oklch(0.79 0.11 235)",
      "accent": "oklch(0.74 0.16 85)",
      "accentDark": "oklch(0.85 0.13 85)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.82 0.16 85)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6.5 16h11a3.5 3.5 0 0 0 .4-7 5.5 5.5 0 0 0-10.6-1.6A4.25 4.25 0 0 0 6.5 16Z\" /><path d=\"M8 19v2\" /><path d=\"M12 19v3\" /><path d=\"M16 19v2\" /></svg>"
  },
  {
    "slug": "snowflake",
    "name": "Snowflake",
    "category": "Weather",
    "keywords": [
      "snow",
      "cold",
      "winter",
      "flake"
    ],
    "description": "A six-branch flake that turns slowly and shimmers.",
    "component": "PrequelSnowflakeIcon",
    "file": "prequel-snowflake.tsx",
    "motion": "spin",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M12 2v20"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3.3 7l17.4 10"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M20.7 7L3.3 17"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.62 0.14 235)",
      "primaryDark": "oklch(0.79 0.11 235)",
      "accent": "oklch(0.74 0.16 85)",
      "accentDark": "oklch(0.85 0.13 85)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.82 0.16 85)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 2v20\" /><path d=\"M3.3 7l17.4 10\" /><path d=\"M20.7 7L3.3 17\" /></svg>"
  },
  {
    "slug": "wind",
    "name": "Wind",
    "category": "Weather",
    "keywords": [
      "wind",
      "air",
      "breeze",
      "weather"
    ],
    "description": "Three curling gusts that slide at slightly different speeds.",
    "component": "PrequelWindIcon",
    "file": "prequel-wind.tsx",
    "motion": "slideRight",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M3 8h11a3 3 0 1 0-3-3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 12h15a3 3 0 1 1-3 3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 16h7a2.5 2.5 0 1 1-2.5 2.5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.62 0.14 235)",
      "primaryDark": "oklch(0.79 0.11 235)",
      "accent": "oklch(0.74 0.16 85)",
      "accentDark": "oklch(0.85 0.13 85)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.82 0.16 85)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 8h11a3 3 0 1 0-3-3\" /><path d=\"M3 12h15a3 3 0 1 1-3 3\" /><path d=\"M3 16h7a2.5 2.5 0 1 1-2.5 2.5\" /></svg>"
  },
  {
    "slug": "clock",
    "name": "Clock",
    "category": "Time",
    "keywords": [
      "clock",
      "time",
      "hour",
      "schedule"
    ],
    "description": "A clock face whose hands sweep forward on every play.",
    "component": "PrequelClockIcon",
    "file": "prequel-clock.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "circle",
        "attrs": {
          "cx": 12,
          "cy": 12,
          "r": 9
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 7v5l3 2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false
    ],
    "highlight": {
      "cx": 8.4,
      "cy": 8.04,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.68 0.14 75)",
      "primaryDark": "oklch(0.82 0.11 75)",
      "accent": "oklch(0.62 0.16 40)",
      "accentDark": "oklch(0.76 0.13 40)"
    },
    "emoji": {
      "primary": "oklch(0.82 0.16 85)",
      "secondary": "oklch(0.66 0.15 80)",
      "accent": "oklch(0.72 0.19 48)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\" /><path d=\"M12 7v5l3 2\" /></svg>"
  },
  {
    "slug": "alarm-clock",
    "name": "Alarm Clock",
    "category": "Time",
    "keywords": [
      "alarm",
      "wake",
      "ring",
      "time"
    ],
    "description": "A ringing alarm with shaking bells and spinning hands.",
    "component": "PrequelAlarmClockIcon",
    "file": "prequel-alarm-clock.tsx",
    "motion": "jiggle",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "circle",
        "attrs": {
          "cx": 12,
          "cy": 13,
          "r": 8
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 4l3 2M20 4l-3 2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 21l-1 1M18 21l1 1"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 9v4l2 2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      false,
      false
    ],
    "highlight": {
      "cx": 8.8,
      "cy": 9.48,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.68 0.14 75)",
      "primaryDark": "oklch(0.82 0.11 75)",
      "accent": "oklch(0.62 0.16 40)",
      "accentDark": "oklch(0.76 0.13 40)"
    },
    "emoji": {
      "primary": "oklch(0.82 0.16 85)",
      "secondary": "oklch(0.66 0.15 80)",
      "accent": "oklch(0.72 0.19 48)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"13\" r=\"8\" /><path d=\"M4 4l3 2M20 4l-3 2\" /><path d=\"M6 21l-1 1M18 21l1 1\" /><path d=\"M12 9v4l2 2\" /></svg>"
  },
  {
    "slug": "timer",
    "name": "Timer",
    "category": "Time",
    "keywords": [
      "timer",
      "countdown",
      "stopwatch",
      "time"
    ],
    "description": "A stopwatch with a top crown and a hand that whips around.",
    "component": "PrequelTimerIcon",
    "file": "prequel-timer.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "circle",
        "attrs": {
          "cx": 12,
          "cy": 14,
          "r": 7.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 2h6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 2v3.5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 14v-4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      false,
      false
    ],
    "highlight": {
      "cx": 9,
      "cy": 10.7,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.68 0.14 75)",
      "primaryDark": "oklch(0.82 0.11 75)",
      "accent": "oklch(0.62 0.16 40)",
      "accentDark": "oklch(0.76 0.13 40)"
    },
    "emoji": {
      "primary": "oklch(0.82 0.16 85)",
      "secondary": "oklch(0.66 0.15 80)",
      "accent": "oklch(0.72 0.19 48)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"14\" r=\"7.5\" /><path d=\"M9 2h6\" /><path d=\"M12 2v3.5\" /><path d=\"M12 14v-4\" /></svg>"
  },
  {
    "slug": "hourglass",
    "name": "Hourglass",
    "category": "Time",
    "keywords": [
      "hourglass",
      "wait",
      "sand",
      "time"
    ],
    "description": "An hourglass that tips over to restart its sand.",
    "component": "PrequelHourglassIcon",
    "file": "prequel-hourglass.tsx",
    "motion": "flip",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M6 2h12M6 22h12"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 2v3c0 2.4 4 4.2 4 7s-4 4.6-4 7v3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M16 2v3c0 2.4-4 4.2-4 7s4 4.6 4 7v3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.68 0.14 75)",
      "primaryDark": "oklch(0.82 0.11 75)",
      "accent": "oklch(0.62 0.16 40)",
      "accentDark": "oklch(0.76 0.13 40)"
    },
    "emoji": {
      "primary": "oklch(0.82 0.16 85)",
      "secondary": "oklch(0.66 0.15 80)",
      "accent": "oklch(0.72 0.19 48)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 2h12M6 22h12\" /><path d=\"M8 2v3c0 2.4 4 4.2 4 7s-4 4.6-4 7v3\" /><path d=\"M16 2v3c0 2.4-4 4.2-4 7s4 4.6 4 7v3\" /></svg>"
  },
  {
    "slug": "calendar",
    "name": "Calendar",
    "category": "Time",
    "keywords": [
      "calendar",
      "date",
      "month",
      "plan"
    ],
    "description": "A calendar whose day dots blink in sequence.",
    "component": "PrequelCalendarIcon",
    "file": "prequel-calendar.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "rect",
        "attrs": {
          "x": 3,
          "y": 5,
          "width": 18,
          "height": 16,
          "rx": 2
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 3v4M16 3v4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 10h18"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 14h.01M8 18h.01"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 14h.01M12 18h.01"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M16 14h.01"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary",
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      false,
      false,
      false,
      false
    ],
    "highlight": {
      "cx": 8.4,
      "cy": 9.48,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.68 0.14 75)",
      "primaryDark": "oklch(0.82 0.11 75)",
      "accent": "oklch(0.62 0.16 40)",
      "accentDark": "oklch(0.76 0.13 40)"
    },
    "emoji": {
      "primary": "oklch(0.82 0.16 85)",
      "secondary": "oklch(0.66 0.15 80)",
      "accent": "oklch(0.72 0.19 48)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\" /><path d=\"M8 3v4M16 3v4\" /><path d=\"M3 10h18\" /><path d=\"M8 14h.01M8 18h.01\" /><path d=\"M12 14h.01M12 18h.01\" /><path d=\"M16 14h.01\" /></svg>"
  },
  {
    "slug": "smartphone",
    "name": "Smartphone",
    "category": "Devices",
    "keywords": [
      "phone",
      "mobile",
      "device",
      "screen"
    ],
    "description": "A phone that lifts and nudges on each press.",
    "component": "PrequelSmartphoneIcon",
    "file": "prequel-smartphone.tsx",
    "motion": "bounce",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "rect",
        "attrs": {
          "x": 7,
          "y": 2,
          "width": 10,
          "height": 20,
          "rx": 2
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M11 18h2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M10.5 5.5h3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      false
    ],
    "highlight": {
      "cx": 10,
      "cy": 7.6,
      "rx": 1.6,
      "ry": 0.83
    },
    "palette": {
      "primary": "oklch(0.6 0.13 265)",
      "primaryDark": "oklch(0.78 0.1 265)",
      "accent": "oklch(0.7 0.15 285)",
      "accentDark": "oklch(0.82 0.12 285)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.6 0.2 300)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"7\" y=\"2\" width=\"10\" height=\"20\" rx=\"2\" /><path d=\"M11 18h2\" /><path d=\"M10.5 5.5h3\" /></svg>"
  },
  {
    "slug": "laptop",
    "name": "Laptop",
    "category": "Devices",
    "keywords": [
      "laptop",
      "computer",
      "screen",
      "device"
    ],
    "description": "An open laptop that settles with a small pop.",
    "component": "PrequelLaptopIcon",
    "file": "prequel-laptop.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "rect",
        "attrs": {
          "x": 4,
          "y": 5,
          "width": 16,
          "height": 11,
          "rx": 1.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M2 19h20"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 8h6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      false
    ],
    "highlight": {
      "cx": 8.8,
      "cy": 8.08,
      "rx": 2.2,
      "ry": 1.14
    },
    "palette": {
      "primary": "oklch(0.6 0.13 265)",
      "primaryDark": "oklch(0.78 0.1 265)",
      "accent": "oklch(0.7 0.15 285)",
      "accentDark": "oklch(0.82 0.12 285)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.6 0.2 300)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"4\" y=\"5\" width=\"16\" height=\"11\" rx=\"1.5\" /><path d=\"M2 19h20\" /><path d=\"M9 8h6\" /></svg>"
  },
  {
    "slug": "camera",
    "name": "Camera",
    "category": "Devices",
    "keywords": [
      "camera",
      "photo",
      "lens",
      "capture"
    ],
    "description": "A camera whose lens pulses like a shutter breath.",
    "component": "PrequelCameraIcon",
    "file": "prequel-camera.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M4 7h4l1.5-2h5L16 7h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 7h6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 12,
          "cy": 13,
          "r": 3.5
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary",
      "accent"
    ],
    "closed": [
      true,
      false,
      true
    ],
    "highlight": {
      "cx": 8,
      "cy": 9.2,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.6 0.13 265)",
      "primaryDark": "oklch(0.78 0.1 265)",
      "accent": "oklch(0.7 0.15 285)",
      "accentDark": "oklch(0.82 0.12 285)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.6 0.2 300)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 7h4l1.5-2h5L16 7h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z\" /><path d=\"M9 7h6\" /><circle cx=\"12\" cy=\"13\" r=\"3.5\" /></svg>"
  },
  {
    "slug": "headphones",
    "name": "Headphones",
    "category": "Devices",
    "keywords": [
      "headphones",
      "audio",
      "listen",
      "device"
    ],
    "description": "A headset whose ear cups bounce to the beat.",
    "component": "PrequelHeadphonesIcon",
    "file": "prequel-headphones.tsx",
    "motion": "bounce",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M4 14v-2a8 8 0 0 1 16 0v2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "rect",
        "attrs": {
          "x": 3,
          "y": 14,
          "width": 4,
          "height": 6,
          "rx": 2
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "rect",
        "attrs": {
          "x": 17,
          "y": 14,
          "width": 4,
          "height": 6,
          "rx": 2
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "accent"
    ],
    "closed": [
      false,
      true,
      true
    ],
    "highlight": {
      "cx": 4.2,
      "cy": 15.68,
      "rx": 1.1,
      "ry": 0.7
    },
    "palette": {
      "primary": "oklch(0.6 0.13 265)",
      "primaryDark": "oklch(0.78 0.1 265)",
      "accent": "oklch(0.7 0.15 285)",
      "accentDark": "oklch(0.82 0.12 285)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.6 0.2 300)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 14v-2a8 8 0 0 1 16 0v2\" /><rect x=\"3\" y=\"14\" width=\"4\" height=\"6\" rx=\"2\" /><rect x=\"17\" y=\"14\" width=\"4\" height=\"6\" rx=\"2\" /></svg>"
  },
  {
    "slug": "watch",
    "name": "Watch",
    "category": "Devices",
    "keywords": [
      "watch",
      "wrist",
      "time",
      "device"
    ],
    "description": "A wristwatch that sways while its hands sweep.",
    "component": "PrequelWatchIcon",
    "file": "prequel-watch.tsx",
    "motion": "swing",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "rect",
        "attrs": {
          "x": 7,
          "y": 6,
          "width": 10,
          "height": 12,
          "rx": 3
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 6l.5-3h5l.5 3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 18l.5 3h5l.5-3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 10v2.5l1.5 1"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      false,
      false
    ],
    "highlight": {
      "cx": 10,
      "cy": 9.36,
      "rx": 1.6,
      "ry": 0.83
    },
    "palette": {
      "primary": "oklch(0.6 0.13 265)",
      "primaryDark": "oklch(0.78 0.1 265)",
      "accent": "oklch(0.7 0.15 285)",
      "accentDark": "oklch(0.82 0.12 285)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.6 0.2 300)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"7\" y=\"6\" width=\"10\" height=\"12\" rx=\"3\" /><path d=\"M9 6l.5-3h5l.5 3\" /><path d=\"M9 18l.5 3h5l.5-3\" /><path d=\"M12 10v2.5l1.5 1\" /></svg>"
  },
  {
    "slug": "wifi",
    "name": "Wifi",
    "category": "Connectivity",
    "keywords": [
      "wifi",
      "signal",
      "network",
      "wireless"
    ],
    "description": "Three arcs and a dot that pulse outward like a broadcast.",
    "component": "PrequelWifiIcon",
    "file": "prequel-wifi.tsx",
    "motion": "pulse",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M2 8.5a15 15 0 0 1 20 0"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M5 12a10.5 10.5 0 0 1 14 0"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8.5 15.5a5.5 5.5 0 0 1 7 0"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 20h.01"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false,
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.64 0.12 195)",
      "primaryDark": "oklch(0.8 0.1 195)",
      "accent": "oklch(0.68 0.14 170)",
      "accentDark": "oklch(0.8 0.12 170)"
    },
    "emoji": {
      "primary": "oklch(0.78 0.14 165)",
      "secondary": "oklch(0.62 0.13 165)",
      "accent": "oklch(0.74 0.13 232)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M2 8.5a15 15 0 0 1 20 0\" /><path d=\"M5 12a10.5 10.5 0 0 1 14 0\" /><path d=\"M8.5 15.5a5.5 5.5 0 0 1 7 0\" /><path d=\"M12 20h.01\" /></svg>"
  },
  {
    "slug": "bluetooth",
    "name": "Bluetooth",
    "category": "Connectivity",
    "keywords": [
      "bluetooth",
      "wireless",
      "pair",
      "device"
    ],
    "description": "A bluetooth rune that turns in place.",
    "component": "PrequelBluetoothIcon",
    "file": "prequel-bluetooth.tsx",
    "motion": "spin",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M7 7l10 10-5 5V2l5 5L7 17"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary"
    ],
    "closed": [
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.64 0.12 195)",
      "primaryDark": "oklch(0.8 0.1 195)",
      "accent": "oklch(0.68 0.14 170)",
      "accentDark": "oklch(0.8 0.12 170)"
    },
    "emoji": {
      "primary": "oklch(0.78 0.14 165)",
      "secondary": "oklch(0.62 0.13 165)",
      "accent": "oklch(0.74 0.13 232)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M7 7l10 10-5 5V2l5 5L7 17\" /></svg>"
  },
  {
    "slug": "battery",
    "name": "Battery",
    "category": "Connectivity",
    "keywords": [
      "battery",
      "power",
      "charge",
      "energy"
    ],
    "description": "A battery whose charge cell breathes on hover.",
    "component": "PrequelBatteryIcon",
    "file": "prequel-battery.tsx",
    "motion": "pulse",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "rect",
        "attrs": {
          "x": 2,
          "y": 7,
          "width": 18,
          "height": 10,
          "rx": 2.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M22 11v2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "rect",
        "attrs": {
          "x": 5,
          "y": 10,
          "width": 4.5,
          "height": 4,
          "rx": 1
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary",
      "accent"
    ],
    "closed": [
      true,
      false,
      true
    ],
    "highlight": {
      "cx": 7.4,
      "cy": 9.8,
      "rx": 2,
      "ry": 1.04
    },
    "palette": {
      "primary": "oklch(0.64 0.12 195)",
      "primaryDark": "oklch(0.8 0.1 195)",
      "accent": "oklch(0.68 0.14 170)",
      "accentDark": "oklch(0.8 0.12 170)"
    },
    "emoji": {
      "primary": "oklch(0.78 0.14 165)",
      "secondary": "oklch(0.62 0.13 165)",
      "accent": "oklch(0.74 0.13 232)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"2\" y=\"7\" width=\"18\" height=\"10\" rx=\"2.5\" /><path d=\"M22 11v2\" /><rect x=\"5\" y=\"10\" width=\"4.5\" height=\"4\" rx=\"1\" /></svg>"
  },
  {
    "slug": "signal",
    "name": "Signal",
    "category": "Connectivity",
    "keywords": [
      "signal",
      "bars",
      "network",
      "reception"
    ],
    "description": "Four bars that rise from the ground in a cascade.",
    "component": "PrequelSignalIcon",
    "file": "prequel-signal.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M4 20v-3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9.3 20v-7"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M14.6 20v-11"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M20 20V5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false,
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.64 0.12 195)",
      "primaryDark": "oklch(0.8 0.1 195)",
      "accent": "oklch(0.68 0.14 170)",
      "accentDark": "oklch(0.8 0.12 170)"
    },
    "emoji": {
      "primary": "oklch(0.78 0.14 165)",
      "secondary": "oklch(0.62 0.13 165)",
      "accent": "oklch(0.74 0.13 232)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 20v-3\" /><path d=\"M9.3 20v-7\" /><path d=\"M14.6 20v-11\" /><path d=\"M20 20V5\" /></svg>"
  },
  {
    "slug": "link",
    "name": "Link",
    "category": "Connectivity",
    "keywords": [
      "link",
      "chain",
      "url",
      "connect"
    ],
    "description": "Two chain halves that pull apart and close again.",
    "component": "PrequelLinkIcon",
    "file": "prequel-link.tsx",
    "motion": "slideRight",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.64 0.12 195)",
      "primaryDark": "oklch(0.8 0.1 195)",
      "accent": "oklch(0.68 0.14 170)",
      "accentDark": "oklch(0.8 0.12 170)"
    },
    "emoji": {
      "primary": "oklch(0.78 0.14 165)",
      "secondary": "oklch(0.62 0.13 165)",
      "accent": "oklch(0.74 0.13 232)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1\" /><path d=\"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1\" /></svg>"
  },
  {
    "slug": "play",
    "name": "Play",
    "category": "Media",
    "keywords": [
      "play",
      "start",
      "media",
      "video"
    ],
    "description": "A play triangle that presses forward and rebounds.",
    "component": "PrequelPlayIcon",
    "file": "prequel-play.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "polygon",
        "attrs": {
          "points": "8,4.5 20,12 8,19.5"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary"
    ],
    "closed": [
      true
    ],
    "highlight": {
      "cx": 11.6,
      "cy": 8.7,
      "rx": 1.92,
      "ry": 1
    },
    "palette": {
      "primary": "oklch(0.62 0.18 330)",
      "primaryDark": "oklch(0.79 0.14 330)",
      "accent": "oklch(0.72 0.16 355)",
      "accentDark": "oklch(0.84 0.13 355)"
    },
    "emoji": {
      "primary": "oklch(0.62 0.22 350)",
      "secondary": "oklch(0.48 0.2 350)",
      "accent": "oklch(0.6 0.2 300)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><polygon points=\"8,4.5 20,12 8,19.5\" /></svg>"
  },
  {
    "slug": "pause",
    "name": "Pause",
    "category": "Media",
    "keywords": [
      "pause",
      "stop",
      "media",
      "hold"
    ],
    "description": "Two pause bars that swell and settle together.",
    "component": "PrequelPauseIcon",
    "file": "prequel-pause.tsx",
    "motion": "pulse",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "rect",
        "attrs": {
          "x": 7,
          "y": 5,
          "width": 3.5,
          "height": 14,
          "rx": 1.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "rect",
        "attrs": {
          "x": 13.5,
          "y": 5,
          "width": 3.5,
          "height": 14,
          "rx": 1.5
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "accent"
    ],
    "closed": [
      true,
      true
    ],
    "highlight": {
      "cx": 8.05,
      "cy": 8.92,
      "rx": 1.1,
      "ry": 0.7
    },
    "palette": {
      "primary": "oklch(0.62 0.18 330)",
      "primaryDark": "oklch(0.79 0.14 330)",
      "accent": "oklch(0.72 0.16 355)",
      "accentDark": "oklch(0.84 0.13 355)"
    },
    "emoji": {
      "primary": "oklch(0.62 0.22 350)",
      "secondary": "oklch(0.48 0.2 350)",
      "accent": "oklch(0.6 0.2 300)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"7\" y=\"5\" width=\"3.5\" height=\"14\" rx=\"1.5\" /><rect x=\"13.5\" y=\"5\" width=\"3.5\" height=\"14\" rx=\"1.5\" /></svg>"
  },
  {
    "slug": "volume",
    "name": "Volume",
    "category": "Media",
    "keywords": [
      "volume",
      "sound",
      "speaker",
      "audio"
    ],
    "description": "A speaker cone whose sound waves ripple outward.",
    "component": "PrequelVolumeIcon",
    "file": "prequel-volume.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M4 9v6h4l5 4V5L8 9H4Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M16 9a4 4 0 0 1 0 6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M18.5 6.5a8 8 0 0 1 0 11"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      false
    ],
    "highlight": {
      "cx": 6.7,
      "cy": 8.92,
      "rx": 1.44,
      "ry": 0.75
    },
    "palette": {
      "primary": "oklch(0.62 0.18 330)",
      "primaryDark": "oklch(0.79 0.14 330)",
      "accent": "oklch(0.72 0.16 355)",
      "accentDark": "oklch(0.84 0.13 355)"
    },
    "emoji": {
      "primary": "oklch(0.62 0.22 350)",
      "secondary": "oklch(0.48 0.2 350)",
      "accent": "oklch(0.6 0.2 300)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 9v6h4l5 4V5L8 9H4Z\" /><path d=\"M16 9a4 4 0 0 1 0 6\" /><path d=\"M18.5 6.5a8 8 0 0 1 0 11\" /></svg>"
  },
  {
    "slug": "mic",
    "name": "Microphone",
    "category": "Media",
    "keywords": [
      "mic",
      "voice",
      "record",
      "audio"
    ],
    "description": "A microphone that lifts off its stand and pulses.",
    "component": "PrequelMicrophoneIcon",
    "file": "prequel-mic.tsx",
    "motion": "bounce",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "rect",
        "attrs": {
          "x": 9,
          "y": 2,
          "width": 6,
          "height": 11,
          "rx": 3
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M5 11a7 7 0 0 0 14 0"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 18v4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 22h8"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      false,
      false
    ],
    "highlight": {
      "cx": 10.8,
      "cy": 5.08,
      "rx": 1.1,
      "ry": 0.7
    },
    "palette": {
      "primary": "oklch(0.62 0.18 330)",
      "primaryDark": "oklch(0.79 0.14 330)",
      "accent": "oklch(0.72 0.16 355)",
      "accentDark": "oklch(0.84 0.13 355)"
    },
    "emoji": {
      "primary": "oklch(0.62 0.22 350)",
      "secondary": "oklch(0.48 0.2 350)",
      "accent": "oklch(0.6 0.2 300)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"9\" y=\"2\" width=\"6\" height=\"11\" rx=\"3\" /><path d=\"M5 11a7 7 0 0 0 14 0\" /><path d=\"M12 18v4\" /><path d=\"M8 22h8\" /></svg>"
  },
  {
    "slug": "music",
    "name": "Music",
    "category": "Media",
    "keywords": [
      "music",
      "note",
      "song",
      "audio"
    ],
    "description": "A pair of notes whose heads bob to a steady beat.",
    "component": "PrequelMusicIcon",
    "file": "prequel-music.tsx",
    "motion": "bounce",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M9 18V5l11-2v13"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 6,
          "cy": 18,
          "r": 3
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 17,
          "cy": 16,
          "r": 3
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "accent"
    ],
    "closed": [
      false,
      true,
      true
    ],
    "highlight": {
      "cx": 4.8,
      "cy": 16.68,
      "rx": 1.1,
      "ry": 0.7
    },
    "palette": {
      "primary": "oklch(0.62 0.18 330)",
      "primaryDark": "oklch(0.79 0.14 330)",
      "accent": "oklch(0.72 0.16 355)",
      "accentDark": "oklch(0.84 0.13 355)"
    },
    "emoji": {
      "primary": "oklch(0.62 0.22 350)",
      "secondary": "oklch(0.48 0.2 350)",
      "accent": "oklch(0.6 0.2 300)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M9 18V5l11-2v13\" /><circle cx=\"6\" cy=\"18\" r=\"3\" /><circle cx=\"17\" cy=\"16\" r=\"3\" /></svg>"
  },
  {
    "slug": "bell",
    "name": "Bell",
    "category": "Notifications",
    "keywords": [
      "bell",
      "alert",
      "notification",
      "ring"
    ],
    "description": "A bell that swings from its crown while the clapper lags.",
    "component": "PrequelBellIcon",
    "file": "prequel-bell.tsx",
    "motion": "swing",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M6 9a6 6 0 0 1 12 0c0 5 2 6 2 7H4c0-1 2-2 2-7Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M10 20a2 2 0 0 0 4 0"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false
    ],
    "highlight": {
      "cx": 10,
      "cy": 6.64,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.68 0.17 50)",
      "primaryDark": "oklch(0.83 0.13 50)",
      "accent": "oklch(0.62 0.18 25)",
      "accentDark": "oklch(0.78 0.14 25)"
    },
    "emoji": {
      "primary": "oklch(0.68 0.2 27)",
      "secondary": "oklch(0.54 0.19 25)",
      "accent": "oklch(0.82 0.16 85)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 9a6 6 0 0 1 12 0c0 5 2 6 2 7H4c0-1 2-2 2-7Z\" /><path d=\"M10 20a2 2 0 0 0 4 0\" /></svg>"
  },
  {
    "slug": "mail",
    "name": "Mail",
    "category": "Notifications",
    "keywords": [
      "mail",
      "email",
      "inbox",
      "message"
    ],
    "description": "An envelope whose flap lifts a touch when played.",
    "component": "PrequelMailIcon",
    "file": "prequel-mail.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "rect",
        "attrs": {
          "x": 3,
          "y": 5,
          "width": 18,
          "height": 14,
          "rx": 2
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 7l9 6 9-6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false
    ],
    "highlight": {
      "cx": 8.4,
      "cy": 8.92,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.68 0.17 50)",
      "primaryDark": "oklch(0.83 0.13 50)",
      "accent": "oklch(0.62 0.18 25)",
      "accentDark": "oklch(0.78 0.14 25)"
    },
    "emoji": {
      "primary": "oklch(0.68 0.2 27)",
      "secondary": "oklch(0.54 0.19 25)",
      "accent": "oklch(0.82 0.16 85)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\" /><path d=\"M3 7l9 6 9-6\" /></svg>"
  },
  {
    "slug": "message",
    "name": "Message",
    "category": "Notifications",
    "keywords": [
      "message",
      "chat",
      "bubble",
      "talk"
    ],
    "description": "A speech bubble whose three dots pulse in sequence.",
    "component": "PrequelMessageIcon",
    "file": "prequel-message.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M21 12a8 8 0 0 1-8 8H6l-3 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 12h.01"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 12h.01"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M16 12h.01"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      false,
      false
    ],
    "highlight": {
      "cx": 10.8,
      "cy": 4.96,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.68 0.17 50)",
      "primaryDark": "oklch(0.83 0.13 50)",
      "accent": "oklch(0.62 0.18 25)",
      "accentDark": "oklch(0.78 0.14 25)"
    },
    "emoji": {
      "primary": "oklch(0.68 0.2 27)",
      "secondary": "oklch(0.54 0.19 25)",
      "accent": "oklch(0.82 0.16 85)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M21 12a8 8 0 0 1-8 8H6l-3 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z\" /><path d=\"M8 12h.01\" /><path d=\"M12 12h.01\" /><path d=\"M16 12h.01\" /></svg>"
  },
  {
    "slug": "send",
    "name": "Send",
    "category": "Notifications",
    "keywords": [
      "send",
      "paper plane",
      "dispatch",
      "message"
    ],
    "description": "A paper plane that darts forward with its fold.",
    "component": "PrequelSendIcon",
    "file": "prequel-send.tsx",
    "motion": "slideRight",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M21 3L3 10l7 3 3 7 8-17Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M10 13l5-5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false
    ],
    "highlight": {
      "cx": 8.4,
      "cy": 7.76,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.68 0.17 50)",
      "primaryDark": "oklch(0.83 0.13 50)",
      "accent": "oklch(0.62 0.18 25)",
      "accentDark": "oklch(0.78 0.14 25)"
    },
    "emoji": {
      "primary": "oklch(0.68 0.2 27)",
      "secondary": "oklch(0.54 0.19 25)",
      "accent": "oklch(0.82 0.16 85)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M21 3L3 10l7 3 3 7 8-17Z\" /><path d=\"M10 13l5-5\" /></svg>"
  },
  {
    "slug": "megaphone",
    "name": "Megaphone",
    "category": "Notifications",
    "keywords": [
      "megaphone",
      "announce",
      "promote",
      "broadcast"
    ],
    "description": "A megaphone that swings while its sound arc pulses.",
    "component": "PrequelMegaphoneIcon",
    "file": "prequel-megaphone.tsx",
    "motion": "swing",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M4 10v4l3 1 8 5V4L7 9l-3 1Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M15 8a4 4 0 0 1 0 8"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M7 15v4a2 2 0 0 0 4 0v-2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      false
    ],
    "highlight": {
      "cx": 7.3,
      "cy": 8.48,
      "rx": 1.76,
      "ry": 0.92
    },
    "palette": {
      "primary": "oklch(0.68 0.17 50)",
      "primaryDark": "oklch(0.83 0.13 50)",
      "accent": "oklch(0.62 0.18 25)",
      "accentDark": "oklch(0.78 0.14 25)"
    },
    "emoji": {
      "primary": "oklch(0.68 0.2 27)",
      "secondary": "oklch(0.54 0.19 25)",
      "accent": "oklch(0.82 0.16 85)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 10v4l3 1 8 5V4L7 9l-3 1Z\" /><path d=\"M15 8a4 4 0 0 1 0 8\" /><path d=\"M7 15v4a2 2 0 0 0 4 0v-2\" /></svg>"
  },
  {
    "slug": "code",
    "name": "Code",
    "category": "Development",
    "keywords": [
      "code",
      "brackets",
      "developer",
      "programming"
    ],
    "description": "Two angle brackets that push apart around a slash.",
    "component": "PrequelCodeIcon",
    "file": "prequel-code.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M8 8l-4 4 4 4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M16 8l4 4-4 4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M13 5l-2 14"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.58 0.16 275)",
      "primaryDark": "oklch(0.77 0.13 275)",
      "accent": "oklch(0.7 0.16 250)",
      "accentDark": "oklch(0.82 0.13 250)"
    },
    "emoji": {
      "primary": "oklch(0.6 0.2 300)",
      "secondary": "oklch(0.46 0.18 300)",
      "accent": "oklch(0.78 0.14 165)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M8 8l-4 4 4 4\" /><path d=\"M16 8l4 4-4 4\" /><path d=\"M13 5l-2 14\" /></svg>"
  },
  {
    "slug": "terminal",
    "name": "Terminal",
    "category": "Development",
    "keywords": [
      "terminal",
      "shell",
      "console",
      "command"
    ],
    "description": "A terminal window with a prompt that steps right.",
    "component": "PrequelTerminalIcon",
    "file": "prequel-terminal.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "rect",
        "attrs": {
          "x": 3,
          "y": 4,
          "width": 18,
          "height": 16,
          "rx": 2
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M7 9l3 3-3 3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M13 15h4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      false
    ],
    "highlight": {
      "cx": 8.4,
      "cy": 8.48,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.58 0.16 275)",
      "primaryDark": "oklch(0.77 0.13 275)",
      "accent": "oklch(0.7 0.16 250)",
      "accentDark": "oklch(0.82 0.13 250)"
    },
    "emoji": {
      "primary": "oklch(0.6 0.2 300)",
      "secondary": "oklch(0.46 0.18 300)",
      "accent": "oklch(0.78 0.14 165)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\" /><path d=\"M7 9l3 3-3 3\" /><path d=\"M13 15h4\" /></svg>"
  },
  {
    "slug": "git-branch",
    "name": "Git Branch",
    "category": "Development",
    "keywords": [
      "git",
      "branch",
      "version",
      "merge"
    ],
    "description": "A branch line that draws from the trunk to its node.",
    "component": "PrequelGitBranchIcon",
    "file": "prequel-git-branch.tsx",
    "motion": "pulse",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "circle",
        "attrs": {
          "cx": 6,
          "cy": 6,
          "r": 2.3
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 6,
          "cy": 18,
          "r": 2.3
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 18,
          "cy": 6,
          "r": 2.3
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M18 8.5v2a4 4 0 0 1-4 4H6"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": false
      }
    ],
    "roles": [
      "accent",
      "primary",
      "accent",
      "primary"
    ],
    "closed": [
      true,
      true,
      true,
      false
    ],
    "highlight": {
      "cx": 5.08,
      "cy": 16.99,
      "rx": 1.1,
      "ry": 0.7
    },
    "palette": {
      "primary": "oklch(0.58 0.16 275)",
      "primaryDark": "oklch(0.77 0.13 275)",
      "accent": "oklch(0.7 0.16 250)",
      "accentDark": "oklch(0.82 0.13 250)"
    },
    "emoji": {
      "primary": "oklch(0.6 0.2 300)",
      "secondary": "oklch(0.46 0.18 300)",
      "accent": "oklch(0.78 0.14 165)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"6\" cy=\"6\" r=\"2.3\" /><circle cx=\"6\" cy=\"18\" r=\"2.3\" /><circle cx=\"18\" cy=\"6\" r=\"2.3\" /><path d=\"M18 8.5v2a4 4 0 0 1-4 4H6\" /></svg>"
  },
  {
    "slug": "bug",
    "name": "Bug",
    "category": "Development",
    "keywords": [
      "bug",
      "issue",
      "debug",
      "error"
    ],
    "description": "A beetle whose legs and antennae jitter together.",
    "component": "PrequelBugIcon",
    "file": "prequel-bug.tsx",
    "motion": "jiggle",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M8 9h8v5a4 4 0 0 1-8 0V9Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 9V7a3 3 0 0 1 6 0v2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 12h3M17 12h3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M5 18l2-2M19 18l-2-2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M5 6l2 2M19 6l-2 2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      false,
      false,
      false
    ],
    "highlight": {
      "cx": 7.6,
      "cy": 11.52,
      "rx": 1.8,
      "ry": 0.94
    },
    "palette": {
      "primary": "oklch(0.58 0.16 275)",
      "primaryDark": "oklch(0.77 0.13 275)",
      "accent": "oklch(0.7 0.16 250)",
      "accentDark": "oklch(0.82 0.13 250)"
    },
    "emoji": {
      "primary": "oklch(0.6 0.2 300)",
      "secondary": "oklch(0.46 0.18 300)",
      "accent": "oklch(0.78 0.14 165)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M8 9h8v5a4 4 0 0 1-8 0V9Z\" /><path d=\"M9 9V7a3 3 0 0 1 6 0v2\" /><path d=\"M4 12h3M17 12h3\" /><path d=\"M5 18l2-2M19 18l-2-2\" /><path d=\"M5 6l2 2M19 6l-2 2\" /></svg>"
  },
  {
    "slug": "database",
    "name": "Database",
    "category": "Development",
    "keywords": [
      "database",
      "storage",
      "data",
      "server"
    ],
    "description": "Stacked database discs that breathe as one.",
    "component": "PrequelDatabaseIcon",
    "file": "prequel-database.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "ellipse",
        "attrs": {
          "cx": 12,
          "cy": 6,
          "rx": 8,
          "ry": 3
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      false
    ],
    "highlight": {
      "cx": 8.8,
      "cy": 4.68,
      "rx": 1.2,
      "ry": 0.7
    },
    "palette": {
      "primary": "oklch(0.58 0.16 275)",
      "primaryDark": "oklch(0.77 0.13 275)",
      "accent": "oklch(0.7 0.16 250)",
      "accentDark": "oklch(0.82 0.13 250)"
    },
    "emoji": {
      "primary": "oklch(0.6 0.2 300)",
      "secondary": "oklch(0.46 0.18 300)",
      "accent": "oklch(0.78 0.14 165)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><ellipse cx=\"12\" cy=\"6\" rx=\"8\" ry=\"3\" /><path d=\"M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6\" /><path d=\"M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3\" /></svg>"
  },
  {
    "slug": "server",
    "name": "Server",
    "category": "Development",
    "keywords": [
      "server",
      "hosting",
      "rack",
      "infrastructure"
    ],
    "description": "Two server bays that bounce against each other.",
    "component": "PrequelServerIcon",
    "file": "prequel-server.tsx",
    "motion": "bounce",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "rect",
        "attrs": {
          "x": 3,
          "y": 3,
          "width": 18,
          "height": 7,
          "rx": 2
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "rect",
        "attrs": {
          "x": 3,
          "y": 14,
          "width": 18,
          "height": 7,
          "rx": 2
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M7 6.5h.01M7 17.5h.01"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M11 6.5h6M11 17.5h6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "accent",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      true,
      false,
      false
    ],
    "highlight": {
      "cx": 8.4,
      "cy": 4.96,
      "rx": 1.4,
      "ry": 0.73
    },
    "palette": {
      "primary": "oklch(0.58 0.16 275)",
      "primaryDark": "oklch(0.77 0.13 275)",
      "accent": "oklch(0.7 0.16 250)",
      "accentDark": "oklch(0.82 0.13 250)"
    },
    "emoji": {
      "primary": "oklch(0.6 0.2 300)",
      "secondary": "oklch(0.46 0.18 300)",
      "accent": "oklch(0.78 0.14 165)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"7\" rx=\"2\" /><rect x=\"3\" y=\"14\" width=\"18\" height=\"7\" rx=\"2\" /><path d=\"M7 6.5h.01M7 17.5h.01\" /><path d=\"M11 6.5h6M11 17.5h6\" /></svg>"
  },
  {
    "slug": "file",
    "name": "File",
    "category": "Files",
    "keywords": [
      "file",
      "document",
      "page",
      "text"
    ],
    "description": "A document whose ruled lines pulse one after another.",
    "component": "PrequelFileIcon",
    "file": "prequel-file.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M14 3v5h5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 14h6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 17h4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      false,
      false
    ],
    "highlight": {
      "cx": 8.4,
      "cy": 8.6,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.62 0.13 230)",
      "primaryDark": "oklch(0.8 0.1 230)",
      "accent": "oklch(0.7 0.14 205)",
      "accentDark": "oklch(0.82 0.11 205)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.78 0.14 165)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z\" /><path d=\"M14 3v5h5\" /><path d=\"M9 14h6\" /><path d=\"M9 17h4\" /></svg>"
  },
  {
    "slug": "folder",
    "name": "Folder",
    "category": "Files",
    "keywords": [
      "folder",
      "directory",
      "storage",
      "files"
    ],
    "description": "A folder whose tab lifts and settles.",
    "component": "PrequelFolderIcon",
    "file": "prequel-folder.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 10h18"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false
    ],
    "highlight": {
      "cx": 7.6,
      "cy": 8.32,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.62 0.13 230)",
      "primaryDark": "oklch(0.8 0.1 230)",
      "accent": "oklch(0.7 0.14 205)",
      "accentDark": "oklch(0.82 0.11 205)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.78 0.14 165)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z\" /><path d=\"M3 10h18\" /></svg>"
  },
  {
    "slug": "download",
    "name": "Download",
    "category": "Files",
    "keywords": [
      "download",
      "save",
      "arrow",
      "file"
    ],
    "description": "An arrow that falls into its tray and lands.",
    "component": "PrequelDownloadIcon",
    "file": "prequel-download.tsx",
    "motion": "slideDown",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M12 3v12"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M7 10l5 5 5-5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 20h16"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.62 0.13 230)",
      "primaryDark": "oklch(0.8 0.1 230)",
      "accent": "oklch(0.7 0.14 205)",
      "accentDark": "oklch(0.82 0.11 205)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.78 0.14 165)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 3v12\" /><path d=\"M7 10l5 5 5-5\" /><path d=\"M4 20h16\" /></svg>"
  },
  {
    "slug": "upload",
    "name": "Upload",
    "category": "Files",
    "keywords": [
      "upload",
      "send",
      "arrow",
      "file"
    ],
    "description": "An arrow that rises from its tray and settles.",
    "component": "PrequelUploadIcon",
    "file": "prequel-upload.tsx",
    "motion": "slideUp",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M12 20V8"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M7 12l5-5 5 5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 3h16"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.62 0.13 230)",
      "primaryDark": "oklch(0.8 0.1 230)",
      "accent": "oklch(0.7 0.14 205)",
      "accentDark": "oklch(0.82 0.11 205)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.78 0.14 165)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 20V8\" /><path d=\"M7 12l5-5 5 5\" /><path d=\"M4 3h16\" /></svg>"
  },
  {
    "slug": "trash",
    "name": "Trash",
    "category": "Files",
    "keywords": [
      "trash",
      "delete",
      "bin",
      "remove"
    ],
    "description": "A bin that rattles while its lid stays put.",
    "component": "PrequelTrashIcon",
    "file": "prequel-trash.tsx",
    "motion": "jiggle",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M4 6h16"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 6V4h8v2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M10 11v6M14 11v6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false,
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.62 0.13 230)",
      "primaryDark": "oklch(0.8 0.1 230)",
      "accent": "oklch(0.7 0.14 205)",
      "accentDark": "oklch(0.82 0.11 205)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.78 0.14 165)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 6h16\" /><path d=\"M8 6V4h8v2\" /><path d=\"M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14\" /><path d=\"M10 11v6M14 11v6\" /></svg>"
  },
  {
    "slug": "user",
    "name": "User",
    "category": "People",
    "keywords": [
      "user",
      "person",
      "account",
      "profile"
    ],
    "description": "A profile silhouette that lifts gently on each trigger.",
    "component": "PrequelUserIcon",
    "file": "prequel-user.tsx",
    "motion": "bounce",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "circle",
        "attrs": {
          "cx": 12,
          "cy": 8,
          "r": 4
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M5 21a7 7 0 0 1 14 0"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false
    ],
    "highlight": {
      "cx": 10.4,
      "cy": 6.24,
      "rx": 1.28,
      "ry": 0.7
    },
    "palette": {
      "primary": "oklch(0.64 0.16 355)",
      "primaryDark": "oklch(0.81 0.12 355)",
      "accent": "oklch(0.72 0.14 20)",
      "accentDark": "oklch(0.84 0.11 20)"
    },
    "emoji": {
      "primary": "oklch(0.68 0.2 27)",
      "secondary": "oklch(0.54 0.19 25)",
      "accent": "oklch(0.62 0.22 350)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"8\" r=\"4\" /><path d=\"M5 21a7 7 0 0 1 14 0\" /></svg>"
  },
  {
    "slug": "users",
    "name": "Users",
    "category": "People",
    "keywords": [
      "users",
      "team",
      "group",
      "people"
    ],
    "description": "Two profile silhouettes that bounce out of phase.",
    "component": "PrequelUsersIcon",
    "file": "prequel-users.tsx",
    "motion": "bounce",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "circle",
        "attrs": {
          "cx": 9,
          "cy": 8,
          "r": 3.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M2 20a7 7 0 0 1 14 0"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 17,
          "cy": 9,
          "r": 2.5
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M16 14a5 5 0 0 1 5 5v1"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary",
      "accent",
      "primary"
    ],
    "closed": [
      true,
      false,
      true,
      false
    ],
    "highlight": {
      "cx": 7.6,
      "cy": 6.46,
      "rx": 1.12,
      "ry": 0.7
    },
    "palette": {
      "primary": "oklch(0.64 0.16 355)",
      "primaryDark": "oklch(0.81 0.12 355)",
      "accent": "oklch(0.72 0.14 20)",
      "accentDark": "oklch(0.84 0.11 20)"
    },
    "emoji": {
      "primary": "oklch(0.68 0.2 27)",
      "secondary": "oklch(0.54 0.19 25)",
      "accent": "oklch(0.62 0.22 350)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"9\" cy=\"8\" r=\"3.5\" /><path d=\"M2 20a7 7 0 0 1 14 0\" /><circle cx=\"17\" cy=\"9\" r=\"2.5\" /><path d=\"M16 14a5 5 0 0 1 5 5v1\" /></svg>"
  },
  {
    "slug": "heart",
    "name": "Heart",
    "category": "People",
    "keywords": [
      "heart",
      "like",
      "love",
      "favorite"
    ],
    "description": "A heart that beats once and flashes its fill.",
    "component": "PrequelHeartIcon",
    "file": "prequel-heart.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M12 20S3 14.5 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 14.5 12 20 12 20Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary"
    ],
    "closed": [
      true
    ],
    "highlight": {
      "cx": 9.75,
      "cy": 6.68,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.64 0.16 355)",
      "primaryDark": "oklch(0.81 0.12 355)",
      "accent": "oklch(0.72 0.14 20)",
      "accentDark": "oklch(0.84 0.11 20)"
    },
    "emoji": {
      "primary": "oklch(0.68 0.2 27)",
      "secondary": "oklch(0.54 0.19 25)",
      "accent": "oklch(0.62 0.22 350)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [
      "M12 20S3 14.5 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 14.5 12 20 12 20Z"
    ],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 20S3 14.5 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 14.5 12 20 12 20Z\" /></svg>"
  },
  {
    "slug": "star",
    "name": "Star",
    "category": "People",
    "keywords": [
      "star",
      "favorite",
      "bookmark",
      "rating"
    ],
    "description": "A star that spins a little and flashes its fill.",
    "component": "PrequelStarIcon",
    "file": "prequel-star.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M12 3l2.7 5.6 6.3.9-4.5 4.3 1 6.2-5.5-3-5.5 3 1-6.2L3 9.5l6.3-.9L12 3Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary"
    ],
    "closed": [
      true
    ],
    "highlight": {
      "cx": 8.4,
      "cy": 7.76,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.64 0.16 355)",
      "primaryDark": "oklch(0.81 0.12 355)",
      "accent": "oklch(0.72 0.14 20)",
      "accentDark": "oklch(0.84 0.11 20)"
    },
    "emoji": {
      "primary": "oklch(0.68 0.2 27)",
      "secondary": "oklch(0.54 0.19 25)",
      "accent": "oklch(0.62 0.22 350)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [
      "M12 3l2.7 5.6 6.3.9-4.5 4.3 1 6.2-5.5-3-5.5 3 1-6.2L3 9.5l6.3-.9L12 3Z"
    ],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 3l2.7 5.6 6.3.9-4.5 4.3 1 6.2-5.5-3-5.5 3 1-6.2L3 9.5l6.3-.9L12 3Z\" /></svg>"
  },
  {
    "slug": "cart",
    "name": "Shopping Cart",
    "category": "Commerce",
    "keywords": [
      "cart",
      "shop",
      "buy",
      "checkout"
    ],
    "description": "A cart that rolls forward while its wheels bounce.",
    "component": "PrequelShoppingCartIcon",
    "file": "prequel-cart.tsx",
    "motion": "slideRight",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "circle",
        "attrs": {
          "cx": 9,
          "cy": 20,
          "r": 1.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 18,
          "cy": 20,
          "r": 1.5
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 3h2l2.4 12.2a2 2 0 0 0 2 1.8h7.8a2 2 0 0 0 2-1.6L21 7H6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "accent",
      "primary"
    ],
    "closed": [
      true,
      true,
      false
    ],
    "highlight": {
      "cx": 8.4,
      "cy": 19.34,
      "rx": 1.1,
      "ry": 0.7
    },
    "palette": {
      "primary": "oklch(0.62 0.14 160)",
      "primaryDark": "oklch(0.8 0.11 160)",
      "accent": "oklch(0.7 0.16 130)",
      "accentDark": "oklch(0.82 0.13 130)"
    },
    "emoji": {
      "primary": "oklch(0.82 0.18 130)",
      "secondary": "oklch(0.66 0.16 130)",
      "accent": "oklch(0.72 0.19 48)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"9\" cy=\"20\" r=\"1.5\" /><circle cx=\"18\" cy=\"20\" r=\"1.5\" /><path d=\"M3 3h2l2.4 12.2a2 2 0 0 0 2 1.8h7.8a2 2 0 0 0 2-1.6L21 7H6\" /></svg>"
  },
  {
    "slug": "bag",
    "name": "Shopping Bag",
    "category": "Commerce",
    "keywords": [
      "bag",
      "shop",
      "purchase",
      "store"
    ],
    "description": "A shopping bag whose handle pulses like a breath.",
    "component": "PrequelShoppingBagIcon",
    "file": "prequel-bag.tsx",
    "motion": "bounce",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M6 8h12l1 12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L6 8Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 8V6a3 3 0 0 1 6 0v2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false
    ],
    "highlight": {
      "cx": 7.8,
      "cy": 12.48,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.62 0.14 160)",
      "primaryDark": "oklch(0.8 0.11 160)",
      "accent": "oklch(0.7 0.16 130)",
      "accentDark": "oklch(0.82 0.13 130)"
    },
    "emoji": {
      "primary": "oklch(0.82 0.18 130)",
      "secondary": "oklch(0.66 0.16 130)",
      "accent": "oklch(0.72 0.19 48)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 8h12l1 12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L6 8Z\" /><path d=\"M9 8V6a3 3 0 0 1 6 0v2\" /></svg>"
  },
  {
    "slug": "credit-card",
    "name": "Credit Card",
    "category": "Commerce",
    "keywords": [
      "card",
      "payment",
      "credit",
      "money"
    ],
    "description": "A payment card that slides while its chip blinks.",
    "component": "PrequelCreditCardIcon",
    "file": "prequel-credit-card.tsx",
    "motion": "slideRight",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "rect",
        "attrs": {
          "x": 2,
          "y": 5,
          "width": 20,
          "height": 14,
          "rx": 2.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M2 10h20"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 15h4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      false
    ],
    "highlight": {
      "cx": 8,
      "cy": 8.92,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.62 0.14 160)",
      "primaryDark": "oklch(0.8 0.11 160)",
      "accent": "oklch(0.7 0.16 130)",
      "accentDark": "oklch(0.82 0.13 130)"
    },
    "emoji": {
      "primary": "oklch(0.82 0.18 130)",
      "secondary": "oklch(0.66 0.16 130)",
      "accent": "oklch(0.72 0.19 48)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"2.5\" /><path d=\"M2 10h20\" /><path d=\"M6 15h4\" /></svg>"
  },
  {
    "slug": "tag",
    "name": "Tag",
    "category": "Commerce",
    "keywords": [
      "tag",
      "price",
      "label",
      "sale"
    ],
    "description": "A price tag that sways around its hole.",
    "component": "PrequelTagIcon",
    "file": "prequel-tag.tsx",
    "motion": "swing",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M20 13l-7 7-9-9V4h7l9 9Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 8,
          "cy": 8,
          "r": 1.4
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "accent"
    ],
    "closed": [
      true,
      true
    ],
    "highlight": {
      "cx": 8.8,
      "cy": 8.48,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.62 0.14 160)",
      "primaryDark": "oklch(0.8 0.11 160)",
      "accent": "oklch(0.7 0.16 130)",
      "accentDark": "oklch(0.82 0.13 130)"
    },
    "emoji": {
      "primary": "oklch(0.82 0.18 130)",
      "secondary": "oklch(0.66 0.16 130)",
      "accent": "oklch(0.72 0.19 48)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M20 13l-7 7-9-9V4h7l9 9Z\" /><circle cx=\"8\" cy=\"8\" r=\"1.4\" /></svg>"
  },
  {
    "slug": "leaf",
    "name": "Leaf",
    "category": "Nature",
    "keywords": [
      "leaf",
      "plant",
      "nature",
      "eco"
    ],
    "description": "A leaf that sways while its central vein draws in.",
    "component": "PrequelLeafIcon",
    "file": "prequel-leaf.tsx",
    "motion": "swing",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M20 4C10 4 4 9 4 16c0 2 1 3 2 4 7 0 14-6 14-16Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 20C7 14 11 10 17 7"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false
    ],
    "highlight": {
      "cx": 8.8,
      "cy": 8.48,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.6 0.15 145)",
      "primaryDark": "oklch(0.79 0.12 145)",
      "accent": "oklch(0.74 0.16 95)",
      "accentDark": "oklch(0.86 0.13 95)"
    },
    "emoji": {
      "primary": "oklch(0.82 0.18 130)",
      "secondary": "oklch(0.66 0.16 130)",
      "accent": "oklch(0.78 0.14 165)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M20 4C10 4 4 9 4 16c0 2 1 3 2 4 7 0 14-6 14-16Z\" /><path d=\"M4 20C7 14 11 10 17 7\" /></svg>"
  },
  {
    "slug": "flame",
    "name": "Flame",
    "category": "Nature",
    "keywords": [
      "flame",
      "fire",
      "heat",
      "hot"
    ],
    "description": "A flame whose inner core pulses brighter.",
    "component": "PrequelFlameIcon",
    "file": "prequel-flame.tsx",
    "motion": "pulse",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M12 22c4 0 7-2.7 7-7 0-6-7-13-7-13S5 9 5 15c0 4.3 3 7 7 7Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 18c1.7 0 3-1.3 3-3 0-2.2-3-5-3-5s-3 2.8-3 5c0 1.7 1.3 3 3 3Z"
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "accent"
    ],
    "closed": [
      true,
      true
    ],
    "highlight": {
      "cx": 9.2,
      "cy": 7.6,
      "rx": 2.24,
      "ry": 1.16
    },
    "palette": {
      "primary": "oklch(0.6 0.15 145)",
      "primaryDark": "oklch(0.79 0.12 145)",
      "accent": "oklch(0.74 0.16 95)",
      "accentDark": "oklch(0.86 0.13 95)"
    },
    "emoji": {
      "primary": "oklch(0.82 0.18 130)",
      "secondary": "oklch(0.66 0.16 130)",
      "accent": "oklch(0.78 0.14 165)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 22c4 0 7-2.7 7-7 0-6-7-13-7-13S5 9 5 15c0 4.3 3 7 7 7Z\" /><path d=\"M12 18c1.7 0 3-1.3 3-3 0-2.2-3-5-3-5s-3 2.8-3 5c0 1.7 1.3 3 3 3Z\" /></svg>"
  },
  {
    "slug": "droplet",
    "name": "Droplet",
    "category": "Nature",
    "keywords": [
      "drop",
      "water",
      "liquid",
      "rain"
    ],
    "description": "A water drop that stretches as it falls and settles.",
    "component": "PrequelDropletIcon",
    "file": "prequel-droplet.tsx",
    "motion": "slideDown",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary"
    ],
    "closed": [
      true
    ],
    "highlight": {
      "cx": 4.3,
      "cy": 8.32,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.6 0.15 145)",
      "primaryDark": "oklch(0.79 0.12 145)",
      "accent": "oklch(0.74 0.16 95)",
      "accentDark": "oklch(0.86 0.13 95)"
    },
    "emoji": {
      "primary": "oklch(0.82 0.18 130)",
      "secondary": "oklch(0.66 0.16 130)",
      "accent": "oklch(0.78 0.14 165)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12Z\" /></svg>"
  },
  {
    "slug": "mountain",
    "name": "Mountain",
    "category": "Nature",
    "keywords": [
      "mountain",
      "peak",
      "nature",
      "landscape"
    ],
    "description": "A mountain range whose ridges draw themselves in.",
    "component": "PrequelMountainIcon",
    "file": "prequel-mountain.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "path",
        "attrs": {
          "d": "M3 20L9 8l4 7 2-3 6 8H3Z"
        },
        "role": "primary",
        "closed": true,
        "draw": true,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6.5 20L9 15l1.5 2"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false
    ],
    "highlight": {
      "cx": 8.4,
      "cy": 11.36,
      "rx": 2.4,
      "ry": 1.25
    },
    "palette": {
      "primary": "oklch(0.6 0.15 145)",
      "primaryDark": "oklch(0.79 0.12 145)",
      "accent": "oklch(0.74 0.16 95)",
      "accentDark": "oklch(0.86 0.13 95)"
    },
    "emoji": {
      "primary": "oklch(0.82 0.18 130)",
      "secondary": "oklch(0.66 0.16 130)",
      "accent": "oklch(0.78 0.14 165)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 20L9 8l4 7 2-3 6 8H3Z\" /><path d=\"M6.5 20L9 15l1.5 2\" /></svg>"
  },
  {
    "slug": "search",
    "name": "Search",
    "category": "Tools",
    "keywords": [
      "search",
      "find",
      "magnifier",
      "lookup"
    ],
    "description": "A magnifier that leans toward its target and back.",
    "component": "PrequelSearchIcon",
    "file": "prequel-search.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "circle",
        "attrs": {
          "cx": 11,
          "cy": 11,
          "r": 7
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M16 16l5 5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false
    ],
    "highlight": {
      "cx": 8.2,
      "cy": 7.92,
      "rx": 2.24,
      "ry": 1.16
    },
    "palette": {
      "primary": "oklch(0.56 0.1 225)",
      "primaryDark": "oklch(0.78 0.08 225)",
      "accent": "oklch(0.66 0.13 200)",
      "accentDark": "oklch(0.8 0.1 200)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.6 0.2 300)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"11\" cy=\"11\" r=\"7\" /><path d=\"M16 16l5 5\" /></svg>"
  },
  {
    "slug": "settings",
    "name": "Settings",
    "category": "Tools",
    "keywords": [
      "settings",
      "gear",
      "preferences",
      "config"
    ],
    "description": "A gear whose teeth spin around a still centre.",
    "component": "PrequelSettingsIcon",
    "file": "prequel-settings.tsx",
    "motion": "spin",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "circle",
        "attrs": {
          "cx": 12,
          "cy": 12,
          "r": 3.2
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false
    ],
    "highlight": {
      "cx": 10.72,
      "cy": 10.59,
      "rx": 1.1,
      "ry": 0.7
    },
    "palette": {
      "primary": "oklch(0.56 0.1 225)",
      "primaryDark": "oklch(0.78 0.08 225)",
      "accent": "oklch(0.66 0.13 200)",
      "accentDark": "oklch(0.8 0.1 200)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.6 0.2 300)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"3.2\" /><path d=\"M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1\" /></svg>"
  },
  {
    "slug": "lock",
    "name": "Lock",
    "category": "Tools",
    "keywords": [
      "lock",
      "secure",
      "private",
      "password"
    ],
    "description": "A padlock whose shackle breathes above the body.",
    "component": "PrequelLockIcon",
    "file": "prequel-lock.tsx",
    "motion": "pop",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "rect",
        "attrs": {
          "x": 5,
          "y": 10,
          "width": 14,
          "height": 11,
          "rx": 2.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 10V7a4 4 0 0 1 8 0v3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 12,
          "cy": 15,
          "r": 1.2
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "primary",
      "accent"
    ],
    "closed": [
      true,
      false,
      true
    ],
    "highlight": {
      "cx": 9.2,
      "cy": 13.08,
      "rx": 2.2,
      "ry": 1.14
    },
    "palette": {
      "primary": "oklch(0.56 0.1 225)",
      "primaryDark": "oklch(0.78 0.08 225)",
      "accent": "oklch(0.66 0.13 200)",
      "accentDark": "oklch(0.8 0.1 200)"
    },
    "emoji": {
      "primary": "oklch(0.74 0.13 232)",
      "secondary": "oklch(0.58 0.13 232)",
      "accent": "oklch(0.6 0.2 300)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"5\" y=\"10\" width=\"14\" height=\"11\" rx=\"2.5\" /><path d=\"M8 10V7a4 4 0 0 1 8 0v3\" /><circle cx=\"12\" cy=\"15\" r=\"1.2\" /></svg>"
  }
];

export const prequelCategories = [
  {
    "id": "Arrows",
    "title": "Arrows"
  },
  {
    "id": "Charts",
    "title": "Charts"
  },
  {
    "id": "Weather",
    "title": "Weather"
  },
  {
    "id": "Time",
    "title": "Time"
  },
  {
    "id": "Devices",
    "title": "Devices"
  },
  {
    "id": "Connectivity",
    "title": "Connectivity"
  },
  {
    "id": "Media",
    "title": "Media"
  },
  {
    "id": "Notifications",
    "title": "Notifications"
  },
  {
    "id": "Development",
    "title": "Development"
  },
  {
    "id": "Files",
    "title": "Files"
  },
  {
    "id": "People",
    "title": "People"
  },
  {
    "id": "Commerce",
    "title": "Commerce"
  },
  {
    "id": "Nature",
    "title": "Nature"
  },
  {
    "id": "Tools",
    "title": "Tools"
  }
];
