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
    "slug": "umbrella",
    "name": "Umbrella",
    "category": "Weather",
    "keywords": [
      "umbrella",
      "rain",
      "shelter",
      "weather"
    ],
    "description": "An open umbrella that tilts with the wind and springs back.",
    "component": "PrequelUmbrellaIcon",
    "file": "prequel-umbrella.tsx",
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
          "d": "M3 12a9 9 0 0 1 18 0H3Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 3V2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 12v7a2.5 2.5 0 0 0 5 0"
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
      "cx": 11.1,
      "cy": 8.04,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 12a9 9 0 0 1 18 0H3Z\" /><path d=\"M12 3V2\" /><path d=\"M12 12v7a2.5 2.5 0 0 0 5 0\" /></svg>"
  },
  {
    "slug": "rainbow",
    "name": "Rainbow",
    "category": "Weather",
    "keywords": [
      "rainbow",
      "colors",
      "after rain",
      "weather"
    ],
    "description": "Three nested arcs that draw outward in a staggered pass.",
    "component": "PrequelRainbowIcon",
    "file": "prequel-rainbow.tsx",
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
          "d": "M3 18a9 9 0 0 1 18 0"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6.5 18a5.5 5.5 0 0 1 11 0"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M10.2 18a1.8 1.8 0 0 1 3.6 0"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 18a9 9 0 0 1 18 0\" /><path d=\"M6.5 18a5.5 5.5 0 0 1 11 0\" /><path d=\"M10.2 18a1.8 1.8 0 0 1 3.6 0\" /></svg>"
  },
  {
    "slug": "lightning",
    "name": "Lightning",
    "category": "Weather",
    "keywords": [
      "lightning",
      "storm",
      "bolt",
      "energy"
    ],
    "description": "A bolt that flashes its fill and flickers at the edges.",
    "component": "PrequelLightningIcon",
    "file": "prequel-lightning.tsx",
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
          "points": "13,2 5,13 11,13 9,22 19,10 13,10 13,2"
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
      "cx": 9.2,
      "cy": 7.6,
      "rx": 2.24,
      "ry": 1.16
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
    "fill": [
      "M13 2L5 13h6l-2 9 10-12h-6V2Z"
    ],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><polygon points=\"13,2 5,13 11,13 9,22 19,10 13,10 13,2\" /></svg>"
  },
  {
    "slug": "fog",
    "name": "Fog",
    "category": "Weather",
    "keywords": [
      "fog",
      "mist",
      "haze",
      "weather"
    ],
    "description": "A low cloud with three bands of mist drifting through it.",
    "component": "PrequelFogIcon",
    "file": "prequel-fog.tsx",
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
          "d": "M6.5 11h10a3.2 3.2 0 0 0 .4-6.4A5 5 0 0 0 7.4 4 3.8 3.8 0 0 0 6.5 11Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 15h16"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 18h12"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 21h10"
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
      "cx": 7.71,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6.5 11h10a3.2 3.2 0 0 0 .4-6.4A5 5 0 0 0 7.4 4 3.8 3.8 0 0 0 6.5 11Z\" /><path d=\"M4 15h16\" /><path d=\"M6 18h12\" /><path d=\"M4 21h10\" /></svg>"
  },
  {
    "slug": "sunrise",
    "name": "Sunrise",
    "category": "Weather",
    "keywords": [
      "sunrise",
      "dawn",
      "morning",
      "sun"
    ],
    "description": "A sun that rises over the horizon with two warming rays.",
    "component": "PrequelSunriseIcon",
    "file": "prequel-sunrise.tsx",
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
          "d": "M3 18h18"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 18a4 4 0 0 1 8 0"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 4v3M5.6 7.6l2 2M18.4 7.6l-2 2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 21h18"
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 18h18\" /><path d=\"M8 18a4 4 0 0 1 8 0\" /><path d=\"M12 4v3M5.6 7.6l2 2M18.4 7.6l-2 2\" /><path d=\"M3 21h18\" /></svg>"
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
    "slug": "film",
    "name": "Film",
    "category": "Media",
    "keywords": [
      "film",
      "movie",
      "cinema",
      "reel"
    ],
    "description": "A film strip whose sprocket holes tick past frame by frame.",
    "component": "PrequelFilmIcon",
    "file": "prequel-film.tsx",
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
          "d": "M7 4v16M17 4v16"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 9h4M3 15h4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M17 9h4M17 15h4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M10.5 9.5l4 2.5-4 2.5v-5Z"
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
      "primary",
      "primary",
      "accent"
    ],
    "closed": [
      true,
      false,
      false,
      false,
      true
    ],
    "highlight": {
      "cx": 8.4,
      "cy": 8.48,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\" /><path d=\"M7 4v16M17 4v16\" /><path d=\"M3 9h4M3 15h4\" /><path d=\"M17 9h4M17 15h4\" /><path d=\"M10.5 9.5l4 2.5-4 2.5v-5Z\" /></svg>"
  },
  {
    "slug": "image",
    "name": "Image",
    "category": "Media",
    "keywords": [
      "image",
      "photo",
      "picture",
      "gallery"
    ],
    "description": "A framed photo whose sun and hills settle into the shot.",
    "component": "PrequelImageIcon",
    "file": "prequel-image.tsx",
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
          "rx": 2.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 8.5,
          "cy": 9,
          "r": 1.7
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M5 18l5-5 4 4 3-3 3 3"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": true
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
      "cy": 8.48,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2.5\" /><circle cx=\"8.5\" cy=\"9\" r=\"1.7\" /><path d=\"M5 18l5-5 4 4 3-3 3 3\" /></svg>"
  },
  {
    "slug": "radio",
    "name": "Radio",
    "category": "Media",
    "keywords": [
      "radio",
      "broadcast",
      "tuner",
      "audio"
    ],
    "description": "A table radio whose speaker breathes with the signal.",
    "component": "PrequelRadioIcon",
    "file": "prequel-radio.tsx",
    "motion": "jiggle",
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
          "y": 8,
          "width": 18,
          "height": 12,
          "rx": 2.5
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
          "cy": 14,
          "r": 2.6
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M15 12h4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M15 16h4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 8l12-5"
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
      "primary",
      "primary"
    ],
    "closed": [
      true,
      true,
      false,
      false,
      false
    ],
    "highlight": {
      "cx": 8.4,
      "cy": 11.36,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"8\" width=\"18\" height=\"12\" rx=\"2.5\" /><circle cx=\"8\" cy=\"14\" r=\"2.6\" /><path d=\"M15 12h4\" /><path d=\"M15 16h4\" /><path d=\"M6 8l12-5\" /></svg>"
  },
  {
    "slug": "podcast",
    "name": "Podcast",
    "category": "Media",
    "keywords": [
      "podcast",
      "episode",
      "audio",
      "show"
    ],
    "description": "A microphone tower whose broadcast rings widen and fade.",
    "component": "PrequelPodcastIcon",
    "file": "prequel-podcast.tsx",
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
        "tag": "circle",
        "attrs": {
          "cx": 12,
          "cy": 11,
          "r": 2.6
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M10.5 15c0 2 1 5.5 1.5 5.5s1.5-3.5 1.5-5.5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 6.5a6 6 0 0 0 0 9M15 6.5a6 6 0 0 1 0 9"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
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
      "cy": 8.04,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\" /><circle cx=\"12\" cy=\"11\" r=\"2.6\" /><path d=\"M10.5 15c0 2 1 5.5 1.5 5.5s1.5-3.5 1.5-5.5\" /><path d=\"M9 6.5a6 6 0 0 0 0 9M15 6.5a6 6 0 0 1 0 9\" /></svg>"
  },
  {
    "slug": "subtitles",
    "name": "Subtitles",
    "category": "Media",
    "keywords": [
      "subtitles",
      "captions",
      "text",
      "accessibility"
    ],
    "description": "A caption bar whose two lines write themselves in turn.",
    "component": "PrequelSubtitlesIcon",
    "file": "prequel-subtitles.tsx",
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
          "d": "M7 11h4M13 11h4"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M7 15h7M16 15h1"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
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
      "cy": 8.92,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2.5\" /><path d=\"M7 11h4M13 11h4\" /><path d=\"M7 15h7M16 15h1\" /></svg>"
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
    "slug": "phone",
    "name": "Phone",
    "category": "Communication",
    "keywords": [
      "phone",
      "call",
      "dial",
      "contact"
    ],
    "description": "A handset that tips toward its ear and sends a soft ring.",
    "component": "PrequelPhoneIcon",
    "file": "prequel-phone.tsx",
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
          "d": "M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2.5 2.5 0 0 1-2.8 2.5A17 17 0 0 1 4 6.8 2.5 2.5 0 0 1 6.5 3Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M15 3a6 6 0 0 1 6 6"
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
      "cx": 3.5,
      "cy": 3.5,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2.5 2.5 0 0 1-2.8 2.5A17 17 0 0 1 4 6.8 2.5 2.5 0 0 1 6.5 3Z\" /><path d=\"M15 3a6 6 0 0 1 6 6\" /></svg>"
  },
  {
    "slug": "video-call",
    "name": "Video Call",
    "category": "Communication",
    "keywords": [
      "video",
      "call",
      "meeting",
      "remote"
    ],
    "description": "A video window whose camera lens opens toward the room.",
    "component": "PrequelVideoCallIcon",
    "file": "prequel-video-call.tsx",
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
          "x": 3,
          "y": 6,
          "width": 12,
          "height": 12,
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
          "d": "M15 10l5-3v10l-5-3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 9,
          "cy": 12,
          "r": 2.2
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
      "cx": 6.6,
      "cy": 9.36,
      "rx": 1.92,
      "ry": 1
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"6\" width=\"12\" height=\"12\" rx=\"2.5\" /><path d=\"M15 10l5-3v10l-5-3\" /><circle cx=\"9\" cy=\"12\" r=\"2.2\" /></svg>"
  },
  {
    "slug": "at-sign",
    "name": "At Sign",
    "category": "Communication",
    "keywords": [
      "at",
      "email",
      "mention",
      "address"
    ],
    "description": "An at sign whose inner ring tightens around its address.",
    "component": "PrequelAtSignIcon",
    "file": "prequel-at-sign.tsx",
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
          "d": "M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"
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
      "primary": "oklch(0.56 0.1 225)",
      "primaryDark": "oklch(0.78 0.08 225)",
      "accent": "oklch(0.66 0.13 200)",
      "accentDark": "oklch(0.8 0.1 200)"
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"4\" /><path d=\"M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1\" /></svg>"
  },
  {
    "slug": "chat-bubbles",
    "name": "Chat Bubbles",
    "category": "Communication",
    "keywords": [
      "chat",
      "bubbles",
      "conversation",
      "talk"
    ],
    "description": "Two speech bubbles that trade the conversation back and forth.",
    "component": "PrequelChatBubblesIcon",
    "file": "prequel-chat-bubbles.tsx",
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
          "d": "M2 7a4 4 0 0 1 4-4h5a4 4 0 0 1 0 8H8l-5 3V7Z"
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M14 13a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-2l-4 2v-2.5A3 3 0 0 1 14 16v-3Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 7h3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "accent",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      true,
      false
    ],
    "highlight": {
      "cx": 15.5,
      "cy": 11.2,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M2 7a4 4 0 0 1 4-4h5a4 4 0 0 1 0 8H8l-5 3V7Z\" /><path d=\"M14 13a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-2l-4 2v-2.5A3 3 0 0 1 14 16v-3Z\" /><path d=\"M6 7h3\" /></svg>"
  },
  {
    "slug": "reply",
    "name": "Reply",
    "category": "Communication",
    "keywords": [
      "reply",
      "answer",
      "message",
      "return"
    ],
    "description": "A reply curl that springs back toward the sender.",
    "component": "PrequelReplyIcon",
    "file": "prequel-reply.tsx",
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
          "d": "M9 7L3 12l6 5v-3h6a5 5 0 0 0 5-5V7"
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
      "primary": "oklch(0.56 0.1 225)",
      "primaryDark": "oklch(0.78 0.08 225)",
      "accent": "oklch(0.66 0.13 200)",
      "accentDark": "oklch(0.8 0.1 200)"
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M9 7L3 12l6 5v-3h6a5 5 0 0 0 5-5V7\" /></svg>"
  },
  {
    "slug": "rss",
    "name": "Rss",
    "category": "Communication",
    "keywords": [
      "rss",
      "feed",
      "subscribe",
      "news"
    ],
    "description": "Two broadcast arcs that ripple out from a steady dot.",
    "component": "PrequelRssIcon",
    "file": "prequel-rss.tsx",
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
          "d": "M4 11a9 9 0 0 1 9 9"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 5a15 15 0 0 1 15 15"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 5,
          "cy": 19,
          "r": 1
        },
        "role": "primary",
        "closed": true,
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
      true
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.56 0.1 225)",
      "primaryDark": "oklch(0.78 0.08 225)",
      "accent": "oklch(0.66 0.13 200)",
      "accentDark": "oklch(0.8 0.1 200)"
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 11a9 9 0 0 1 9 9\" /><path d=\"M4 5a15 15 0 0 1 15 15\" /><circle cx=\"5\" cy=\"19\" r=\"1\" /></svg>"
  },
  {
    "slug": "inbox",
    "name": "Inbox",
    "category": "Communication",
    "keywords": [
      "inbox",
      "email",
      "receive",
      "tray"
    ],
    "description": "A mail tray whose front lip dips as a letter lands.",
    "component": "PrequelInboxIcon",
    "file": "prequel-inbox.tsx",
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
          "d": "M4 4h16v16H4V4Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 13h4l2 3h4l2-3h4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 8h8"
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
      "cy": 8.48,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 4h16v16H4V4Z\" /><path d=\"M4 13h4l2 3h4l2-3h4\" /><path d=\"M8 8h8\" /></svg>"
  },
  {
    "slug": "voicemail",
    "name": "Voicemail",
    "category": "Communication",
    "keywords": [
      "voicemail",
      "message",
      "audio",
      "phone"
    ],
    "description": "Two reels joined by a bar that pulses like a held note.",
    "component": "PrequelVoicemailIcon",
    "file": "prequel-voicemail.tsx",
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
          "cx": 6.5,
          "cy": 12,
          "r": 3.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 17.5,
          "cy": 12,
          "r": 3.5
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6.5 15.5h11"
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
      "cx": 5.1,
      "cy": 10.46,
      "rx": 1.12,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"6.5\" cy=\"12\" r=\"3.5\" /><circle cx=\"17.5\" cy=\"12\" r=\"3.5\" /><path d=\"M6.5 15.5h11\" /></svg>"
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
    "slug": "git-commit",
    "name": "Git Commit",
    "category": "Development",
    "keywords": [
      "git",
      "commit",
      "version",
      "history"
    ],
    "description": "A commit node that slides along its history line.",
    "component": "PrequelGitCommitIcon",
    "file": "prequel-git-commit.tsx",
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
          "cx": 12,
          "cy": 12,
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
          "d": "M3 12h5.5M15.5 12H21"
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
      "cx": 10.6,
      "cy": 10.46,
      "rx": 1.12,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"3.5\" /><path d=\"M3 12h5.5M15.5 12H21\" /></svg>"
  },
  {
    "slug": "git-merge",
    "name": "Git Merge",
    "category": "Development",
    "keywords": [
      "git",
      "merge",
      "branch",
      "combine"
    ],
    "description": "A branch line that draws itself into the merge node.",
    "component": "PrequelGitMergeIcon",
    "file": "prequel-git-merge.tsx",
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
          "r": 2.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 6,
          "cy": 18,
          "r": 2.5
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 18,
          "cy": 12,
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
          "d": "M6 8.5v7M8.5 18H12a6 6 0 0 0 6-6"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
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
      true,
      true,
      true,
      false
    ],
    "highlight": {
      "cx": 5,
      "cy": 4.9,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"6\" cy=\"6\" r=\"2.5\" /><circle cx=\"6\" cy=\"18\" r=\"2.5\" /><circle cx=\"18\" cy=\"12\" r=\"2.5\" /><path d=\"M6 8.5v7M8.5 18H12a6 6 0 0 0 6-6\" /></svg>"
  },
  {
    "slug": "git-pull-request",
    "name": "Git Pull Request",
    "category": "Development",
    "keywords": [
      "git",
      "pull request",
      "review",
      "merge"
    ],
    "description": "Two branches whose request arrow travels to the target node.",
    "component": "PrequelGitPullRequestIcon",
    "file": "prequel-git-pull-request.tsx",
    "motion": "slideLeft",
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
          "r": 2.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 6,
          "cy": 18,
          "r": 2.5
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 18,
          "cy": 18,
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
          "d": "M6 8.5v7"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M18 15.5V9a3 3 0 0 0-3-3h-4M13 4l-2 2 2 2"
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
      "accent",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      true,
      true,
      false,
      false
    ],
    "highlight": {
      "cx": 5,
      "cy": 4.9,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"6\" cy=\"6\" r=\"2.5\" /><circle cx=\"6\" cy=\"18\" r=\"2.5\" /><circle cx=\"18\" cy=\"18\" r=\"2.5\" /><path d=\"M6 8.5v7\" /><path d=\"M18 15.5V9a3 3 0 0 0-3-3h-4M13 4l-2 2 2 2\" /></svg>"
  },
  {
    "slug": "webhook",
    "name": "Webhook",
    "category": "Development",
    "keywords": [
      "webhook",
      "event",
      "endpoint",
      "automation"
    ],
    "description": "Three hook nodes whose connecting loop draws on each call.",
    "component": "PrequelWebhookIcon",
    "file": "prequel-webhook.tsx",
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
          "cy": 5,
          "r": 2.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 5,
          "cy": 18,
          "r": 2.5
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 19,
          "cy": 18,
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
          "d": "M12 7.5v4a4 4 0 0 1-4 4H7M12 11.5a4 4 0 0 1 4 4M8.5 16.5h7"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
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
      true,
      true,
      true,
      false
    ],
    "highlight": {
      "cx": 11,
      "cy": 3.9,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"5\" r=\"2.5\" /><circle cx=\"5\" cy=\"18\" r=\"2.5\" /><circle cx=\"19\" cy=\"18\" r=\"2.5\" /><path d=\"M12 7.5v4a4 4 0 0 1-4 4H7M12 11.5a4 4 0 0 1 4 4M8.5 16.5h7\" /></svg>"
  },
  {
    "slug": "braces",
    "name": "Braces",
    "category": "Development",
    "keywords": [
      "code",
      "braces",
      "syntax",
      "development"
    ],
    "description": "A pair of braces that open wide and close around a dot.",
    "component": "PrequelBracesIcon",
    "file": "prequel-braces.tsx",
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
          "d": "M8 4c-2.5 0-2.5 4-2.5 8s0 8 2.5 8"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M16 4c2.5 0 2.5 4 2.5 8s0 8-2.5 8"
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
          "cy": 12,
          "r": 1.2
        },
        "role": "primary",
        "closed": true,
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
      true
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M8 4c-2.5 0-2.5 4-2.5 8s0 8 2.5 8\" /><path d=\"M16 4c2.5 0 2.5 4 2.5 8s0 8-2.5 8\" /><circle cx=\"12\" cy=\"12\" r=\"1.2\" /></svg>"
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
    "slug": "file-text",
    "name": "File Text",
    "category": "Files",
    "keywords": [
      "file",
      "text",
      "document",
      "page"
    ],
    "description": "A typed page whose paragraph writes itself line by line.",
    "component": "PrequelFileTextIcon",
    "file": "prequel-file-text.tsx",
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
        "draw": true,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 13h6M9 17h4"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z\" /><path d=\"M14 3v5h5\" /><path d=\"M9 13h6M9 17h4\" /></svg>"
  },
  {
    "slug": "file-plus",
    "name": "File Plus",
    "category": "Files",
    "keywords": [
      "file",
      "plus",
      "add",
      "create"
    ],
    "description": "A blank page whose plus draws in and presses forward.",
    "component": "PrequelFilePlusIcon",
    "file": "prequel-file-plus.tsx",
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
          "d": "M12 12v5"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9.5 14.5h5"
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z\" /><path d=\"M14 3v5h5\" /><path d=\"M12 12v5\" /><path d=\"M9.5 14.5h5\" /></svg>"
  },
  {
    "slug": "archive",
    "name": "Archive",
    "category": "Files",
    "keywords": [
      "archive",
      "box",
      "store",
      "zip"
    ],
    "description": "A storage box whose lid lifts and whose handle pulls forward.",
    "component": "PrequelArchiveIcon",
    "file": "prequel-archive.tsx",
    "motion": "slideUp",
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
          "height": 4,
          "rx": 1.5
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "rect",
        "attrs": {
          "x": 5,
          "y": 8,
          "width": 14,
          "height": 12,
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
          "d": "M10 12h4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "accent",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      true,
      false
    ],
    "highlight": {
      "cx": 9.2,
      "cy": 11.36,
      "rx": 2.24,
      "ry": 1.16
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"4\" rx=\"1.5\" /><rect x=\"5\" y=\"8\" width=\"14\" height=\"12\" rx=\"2\" /><path d=\"M10 12h4\" /></svg>"
  },
  {
    "slug": "folder-open",
    "name": "Folder Open",
    "category": "Files",
    "keywords": [
      "folder",
      "open",
      "directory",
      "browse"
    ],
    "description": "An open folder whose front flap swings down to show its contents.",
    "component": "PrequelFolderOpenIcon",
    "file": "prequel-folder-open.tsx",
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
          "d": "M3 18V6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v3"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 10h15l3 8H6l-3-8Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M7 13h9"
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
      false,
      true,
      false
    ],
    "highlight": {
      "cx": 8.4,
      "cy": 12.24,
      "rx": 1.6,
      "ry": 0.83
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 18V6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v3\" /><path d=\"M3 10h15l3 8H6l-3-8Z\" /><path d=\"M7 13h9\" /></svg>"
  },
  {
    "slug": "clipboard",
    "name": "Clipboard",
    "category": "Files",
    "keywords": [
      "clipboard",
      "copy",
      "list",
      "task"
    ],
    "description": "A clipboard whose clip snaps shut over a short checklist.",
    "component": "PrequelClipboardIcon",
    "file": "prequel-clipboard.tsx",
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
          "y": 4,
          "width": 14,
          "height": 18,
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
          "d": "M9 4a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4v2H9V4Z"
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8.5 11h7"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8.5 15h7"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
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
      "cx": 9.2,
      "cy": 9.04,
      "rx": 2.24,
      "ry": 1.16
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"5\" y=\"4\" width=\"14\" height=\"18\" rx=\"2.5\" /><path d=\"M9 4a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4v2H9V4Z\" /><path d=\"M8.5 11h7\" /><path d=\"M8.5 15h7\" /></svg>"
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
    "slug": "storefront",
    "name": "Storefront",
    "category": "Commerce",
    "keywords": [
      "store",
      "shop",
      "front",
      "retail"
    ],
    "description": "A shop front whose striped awning lifts and settles.",
    "component": "PrequelStorefrontIcon",
    "file": "prequel-storefront.tsx",
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
          "d": "M3 9l1.5-4h15L21 9"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 9h16v11H4V9Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 9c0 1.5 1.2 2.5 2.5 2.5S9 10.5 9 9c0 1.5 1.2 2.5 2.5 2.5S15 10.5 15 9c0 1.5 1.2 2.5 2.5 2.5S21 10.5 21 9"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 20v-5h6v5"
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
      false,
      true,
      false,
      false
    ],
    "highlight": {
      "cx": 8.8,
      "cy": 12.08,
      "rx": 2.2,
      "ry": 1.14
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 9l1.5-4h15L21 9\" /><path d=\"M4 9h16v11H4V9Z\" /><path d=\"M4 9c0 1.5 1.2 2.5 2.5 2.5S9 10.5 9 9c0 1.5 1.2 2.5 2.5 2.5S15 10.5 15 9c0 1.5 1.2 2.5 2.5 2.5S21 10.5 21 9\" /><path d=\"M9 20v-5h6v5\" /></svg>"
  },
  {
    "slug": "barcode",
    "name": "Barcode",
    "category": "Commerce",
    "keywords": [
      "barcode",
      "scan",
      "product",
      "retail"
    ],
    "description": "A barcode whose bars rise and fall like a tiny equalizer.",
    "component": "PrequelBarcodeIcon",
    "file": "prequel-barcode.tsx",
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
          "d": "M4 5v14"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M7 5v14"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M10 5v10"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M13 5v14"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M16 5v10"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M19 5v14"
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
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false,
      false,
      false,
      false,
      false
    ],
    "highlight": null,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 5v14\" /><path d=\"M7 5v14\" /><path d=\"M10 5v10\" /><path d=\"M13 5v14\" /><path d=\"M16 5v10\" /><path d=\"M19 5v14\" /></svg>"
  },
  {
    "slug": "gift",
    "name": "Gift",
    "category": "Commerce",
    "keywords": [
      "gift",
      "present",
      "birthday",
      "reward"
    ],
    "description": "A wrapped gift whose bow lifts and settles on the box.",
    "component": "PrequelGiftIcon",
    "file": "prequel-gift.tsx",
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
          "y": 8,
          "width": 18,
          "height": 4,
          "rx": 1.5
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "rect",
        "attrs": {
          "x": 5,
          "y": 12,
          "width": 14,
          "height": 9,
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
          "d": "M12 8v13"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 8C12 5 10 3 8 3S6 6 9 7l3 1ZM12 8c0-3 2-5 4-5s2 3-1 4l-3 1Z"
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "accent",
      "primary",
      "primary",
      "accent"
    ],
    "closed": [
      true,
      true,
      false,
      true
    ],
    "highlight": {
      "cx": 9.2,
      "cy": 14.52,
      "rx": 1.8,
      "ry": 0.94
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"8\" width=\"18\" height=\"4\" rx=\"1.5\" /><rect x=\"5\" y=\"12\" width=\"14\" height=\"9\" rx=\"1.5\" /><path d=\"M12 8v13\" /><path d=\"M12 8C12 5 10 3 8 3S6 6 9 7l3 1ZM12 8c0-3 2-5 4-5s2 3-1 4l-3 1Z\" /></svg>"
  },
  {
    "slug": "truck",
    "name": "Delivery Truck",
    "category": "Commerce",
    "keywords": [
      "truck",
      "delivery",
      "shipping",
      "logistics"
    ],
    "description": "A delivery van that rolls forward with its wheels tripping.",
    "component": "PrequelDeliveryTruckIcon",
    "file": "prequel-truck.tsx",
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
          "d": "M3 6h11v11H3V6Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M14 9h4l3 3v5h-7"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 7,
          "cy": 19,
          "r": 1.8
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 17.5,
          "cy": 19,
          "r": 1.8
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 10h4"
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
      "accent",
      "accent",
      "primary"
    ],
    "closed": [
      true,
      false,
      true,
      true,
      false
    ],
    "highlight": {
      "cx": 6.3,
      "cy": 9.08,
      "rx": 1.76,
      "ry": 0.92
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 6h11v11H3V6Z\" /><path d=\"M14 9h4l3 3v5h-7\" /><circle cx=\"7\" cy=\"19\" r=\"1.8\" /><circle cx=\"17.5\" cy=\"19\" r=\"1.8\" /><path d=\"M6 10h4\" /></svg>"
  },
  {
    "slug": "package",
    "name": "Package",
    "category": "Commerce",
    "keywords": [
      "package",
      "box",
      "parcel",
      "shipping"
    ],
    "description": "A parcel whose seams draw in and whose lid lifts away.",
    "component": "PrequelPackageIcon",
    "file": "prequel-package.tsx",
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
          "d": "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 7.5l8 4.5 8-4.5"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 12v9"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8.5 5.2l7.5 4.3"
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
      "cy": 8.04,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z\" /><path d=\"M4 7.5l8 4.5 8-4.5\" /><path d=\"M12 12v9\" /><path d=\"M8.5 5.2l7.5 4.3\" /></svg>"
  },
  {
    "slug": "coupon",
    "name": "Coupon",
    "category": "Commerce",
    "keywords": [
      "coupon",
      "voucher",
      "discount",
      "offer"
    ],
    "description": "A coupon that flexes at its perforation and settles.",
    "component": "PrequelCouponIcon",
    "file": "prequel-coupon.tsx",
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
          "d": "M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V6Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 9v6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 10h4M12 13h4"
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
      "cy": 9.36,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V6Z\" /><path d=\"M9 9v6\" /><path d=\"M12 10h4M12 13h4\" /></svg>"
  },
  {
    "slug": "basket",
    "name": "Basket",
    "category": "Commerce",
    "keywords": [
      "basket",
      "shopping",
      "grocery",
      "buy"
    ],
    "description": "A shopping basket that hops while its handles swing.",
    "component": "PrequelBasketIcon",
    "file": "prequel-basket.tsx",
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
          "d": "M4 10h16l-1.5 9h-13L4 10Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 10l1-6M16 10l-1-6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 14v3M12 14v3M16 14v3"
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
      "cy": 12.52,
      "rx": 1.8,
      "ry": 0.94
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 10h16l-1.5 9h-13L4 10Z\" /><path d=\"M8 10l1-6M16 10l-1-6\" /><path d=\"M8 14v3M12 14v3M16 14v3\" /></svg>"
  },
  {
    "slug": "scale",
    "name": "Scale",
    "category": "Commerce",
    "keywords": [
      "scale",
      "balance",
      "weight",
      "justice"
    ],
    "description": "A balance that tips one pan and then returns to level.",
    "component": "PrequelScaleIcon",
    "file": "prequel-scale.tsx",
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
          "d": "M12 3v18"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 21h12"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M5 7h14"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "polygon",
        "attrs": {
          "points": "5,7 2,13 8,13"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "polygon",
        "attrs": {
          "points": "19,7 16,13 22,13"
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
      "primary",
      "primary",
      "accent"
    ],
    "closed": [
      false,
      false,
      false,
      true,
      true
    ],
    "highlight": {
      "cx": 3.8,
      "cy": 8.68,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 3v18\" /><path d=\"M6 21h12\" /><path d=\"M5 7h14\" /><polygon points=\"5,7 2,13 8,13\" /><polygon points=\"19,7 16,13 22,13\" /></svg>"
  },
  {
    "slug": "wallet",
    "name": "Wallet",
    "category": "Finance",
    "keywords": [
      "wallet",
      "money",
      "balance",
      "pay"
    ],
    "description": "A folded wallet whose clasp catches the light on every play.",
    "component": "PrequelWalletIcon",
    "file": "prequel-wallet.tsx",
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
          "y": 6,
          "width": 18,
          "height": 13,
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
          "d": "M3 9h18"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 16.5,
          "cy": 13,
          "r": 1.1
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M13 6V4.5A1.5 1.5 0 0 1 14.5 3H19"
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
      "cx": 8.4,
      "cy": 9.64,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"6\" width=\"18\" height=\"13\" rx=\"3\" /><path d=\"M3 9h18\" /><circle cx=\"16.5\" cy=\"13\" r=\"1.1\" /><path d=\"M13 6V4.5A1.5 1.5 0 0 1 14.5 3H19\" /></svg>"
  },
  {
    "slug": "coins",
    "name": "Coins",
    "category": "Finance",
    "keywords": [
      "coins",
      "money",
      "cash",
      "savings"
    ],
    "description": "A stack of coins that settles one layer at a time.",
    "component": "PrequelCoinsIcon",
    "file": "prequel-coins.tsx",
    "motion": "bounce",
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
          "cy": 6.5,
          "rx": 6,
          "ry": 2.6
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "ellipse",
        "attrs": {
          "cx": 12,
          "cy": 12,
          "rx": 6,
          "ry": 2.6
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "ellipse",
        "attrs": {
          "cx": 12,
          "cy": 17.5,
          "rx": 6,
          "ry": 2.6
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 6.5v11M18 6.5v11"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "accent",
      "accent",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      true,
      true,
      false
    ],
    "highlight": {
      "cx": 9.6,
      "cy": 16.36,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><ellipse cx=\"12\" cy=\"6.5\" rx=\"6\" ry=\"2.6\" /><ellipse cx=\"12\" cy=\"12\" rx=\"6\" ry=\"2.6\" /><ellipse cx=\"12\" cy=\"17.5\" rx=\"6\" ry=\"2.6\" /><path d=\"M6 6.5v11M18 6.5v11\" /></svg>"
  },
  {
    "slug": "bank",
    "name": "Bank",
    "category": "Finance",
    "keywords": [
      "bank",
      "building",
      "institution",
      "finance"
    ],
    "description": "A neoclassical bank whose columns settle under a steady pediment.",
    "component": "PrequelBankIcon",
    "file": "prequel-bank.tsx",
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
          "d": "M3 9l9-6 9 6H3Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M5 9v8M9.5 9v8M14.5 9v8M19 9v8"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 21h18"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M5 17h14"
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
      "cx": 8.4,
      "cy": 4.68,
      "rx": 1.2,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 9l9-6 9 6H3Z\" /><path d=\"M5 9v8M9.5 9v8M14.5 9v8M19 9v8\" /><path d=\"M3 21h18\" /><path d=\"M5 17h14\" /></svg>"
  },
  {
    "slug": "receipt",
    "name": "Receipt",
    "category": "Finance",
    "keywords": [
      "receipt",
      "bill",
      "purchase",
      "invoice"
    ],
    "description": "A till receipt whose torn edge and lines reveal one by one.",
    "component": "PrequelReceiptIcon",
    "file": "prequel-receipt.tsx",
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
          "d": "M5 3h14v18l-2.3-1.5L14.4 21l-2.4-1.5L9.6 21 7.3 19.5 5 21V3Z"
        },
        "role": "primary",
        "closed": true,
        "draw": true,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 7h8"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 11h8"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 15h5"
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
      "cx": 9.2,
      "cy": 8.04,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 3h14v18l-2.3-1.5L14.4 21l-2.4-1.5L9.6 21 7.3 19.5 5 21V3Z\" /><path d=\"M8 7h8\" /><path d=\"M8 11h8\" /><path d=\"M8 15h5\" /></svg>"
  },
  {
    "slug": "piggy-bank",
    "name": "Piggy Bank",
    "category": "Finance",
    "keywords": [
      "piggy",
      "savings",
      "bank",
      "money"
    ],
    "description": "A piggy bank that wiggles while its coin slot swallows a coin.",
    "component": "PrequelPiggyBankIcon",
    "file": "prequel-piggy-bank.tsx",
    "motion": "jiggle",
    "effects": [
      "hover",
      "tap",
      "loop"
    ],
    "parts": [
      {
        "tag": "ellipse",
        "attrs": {
          "cx": 11,
          "cy": 13,
          "rx": 8,
          "ry": 5.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 19.5,
          "cy": 13,
          "r": 1.6
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 18v2M15.5 18v2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 9.5c.5-2 1.5-3.5 3-4.5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8.5 8.5h4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "accent",
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      true,
      false,
      false,
      false
    ],
    "highlight": {
      "cx": 7.8,
      "cy": 10.58,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><ellipse cx=\"11\" cy=\"13\" rx=\"8\" ry=\"5.5\" /><circle cx=\"19.5\" cy=\"13\" r=\"1.6\" /><path d=\"M6 18v2M15.5 18v2\" /><path d=\"M6 9.5c.5-2 1.5-3.5 3-4.5\" /><path d=\"M8.5 8.5h4\" /></svg>"
  },
  {
    "slug": "percent",
    "name": "Percent",
    "category": "Finance",
    "keywords": [
      "percent",
      "discount",
      "rate",
      "interest"
    ],
    "description": "Two rings and a slash that draws itself across the pair.",
    "component": "PrequelPercentIcon",
    "file": "prequel-percent.tsx",
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
          "cx": 7.5,
          "cy": 7.5,
          "r": 2.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 16.5,
          "cy": 16.5,
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
          "d": "M19 5L5 19"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
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
      "cx": 6.5,
      "cy": 6.4,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"7.5\" cy=\"7.5\" r=\"2.5\" /><circle cx=\"16.5\" cy=\"16.5\" r=\"2.5\" /><path d=\"M19 5L5 19\" /></svg>"
  },
  {
    "slug": "banknote",
    "name": "Banknote",
    "category": "Finance",
    "keywords": [
      "banknote",
      "cash",
      "bill",
      "money"
    ],
    "description": "A paper note whose central seal breathes like a watermark.",
    "component": "PrequelBanknoteIcon",
    "file": "prequel-banknote.tsx",
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
          "y": 6,
          "width": 20,
          "height": 12,
          "rx": 2
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 12,
          "cy": 12,
          "r": 2.6
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M5 9v6M19 9v6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
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
      "cx": 8,
      "cy": 9.36,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"2\" y=\"6\" width=\"20\" height=\"12\" rx=\"2\" /><circle cx=\"12\" cy=\"12\" r=\"2.6\" /><path d=\"M5 9v6M19 9v6\" /></svg>"
  },
  {
    "slug": "safe",
    "name": "Safe",
    "category": "Finance",
    "keywords": [
      "safe",
      "vault",
      "secure",
      "lock"
    ],
    "description": "A floor safe whose dial turns and whose bolt slides home.",
    "component": "PrequelSafeIcon",
    "file": "prequel-safe.tsx",
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
          "y": 3,
          "width": 18,
          "height": 18,
          "rx": 2.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 12,
          "cy": 12,
          "r": 4.2
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 9.2v2.8l2 1"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M17 9h1.5M17 12h1.5M17 15h1.5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
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
      "cy": 8.04,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2.5\" /><circle cx=\"12\" cy=\"12\" r=\"4.2\" /><path d=\"M12 9.2v2.8l2 1\" /><path d=\"M17 9h1.5M17 12h1.5M17 15h1.5\" /></svg>"
  },
  {
    "slug": "invoice",
    "name": "Invoice",
    "category": "Finance",
    "keywords": [
      "invoice",
      "bill",
      "document",
      "payment"
    ],
    "description": "A billed page whose total signs itself at the foot.",
    "component": "PrequelInvoiceIcon",
    "file": "prequel-invoice.tsx",
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
          "d": "M6 3h9l4 4v14H6V3Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M15 3v4h4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 9v8"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M14.4 10.6c-.6-.9-3.8-1.1-3.8.6 0 1.6 3.8.8 3.8 2.4 0 1.7-3.4 1.6-4 .5"
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
      "cx": 9.9,
      "cy": 8.04,
      "rx": 2.08,
      "ry": 1.08
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 3h9l4 4v14H6V3Z\" /><path d=\"M15 3v4h4\" /><path d=\"M12 9v8\" /><path d=\"M14.4 10.6c-.6-.9-3.8-1.1-3.8.6 0 1.6 3.8.8 3.8 2.4 0 1.7-3.4 1.6-4 .5\" /></svg>"
  },
  {
    "slug": "currency-exchange",
    "name": "Currency Exchange",
    "category": "Finance",
    "keywords": [
      "exchange",
      "currency",
      "convert",
      "forex"
    ],
    "description": "Two counter-flowing arrows trade places around a currency mark.",
    "component": "PrequelCurrencyExchangeIcon",
    "file": "prequel-currency-exchange.tsx",
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
          "d": "M4 8h13l-3-3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M20 16H7l3 3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 11v5M13.6 12.2c-.4-.6-2.4-.7-2.4.3 0 1 2.4.5 2.4 1.5 0 1-2.1 1-2.6.4"
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
      "primary": "oklch(0.56 0.1 225)",
      "primaryDark": "oklch(0.78 0.08 225)",
      "accent": "oklch(0.66 0.13 200)",
      "accentDark": "oklch(0.8 0.1 200)"
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 8h13l-3-3\" /><path d=\"M20 16H7l3 3\" /><path d=\"M12 11v5M13.6 12.2c-.4-.6-2.4-.7-2.4.3 0 1 2.4.5 2.4 1.5 0 1-2.1 1-2.6.4\" /></svg>"
  },
  {
    "slug": "heart-pulse",
    "name": "Heart Pulse",
    "category": "Health",
    "keywords": [
      "heart",
      "pulse",
      "health",
      "ecg"
    ],
    "description": "A steady heart with a trace that draws across its beat.",
    "component": "PrequelHeartPulseIcon",
    "file": "prequel-heart-pulse.tsx",
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
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4.5 12h4l1.5-2.5 2.5 5 1.5-2.5h5"
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
      "cx": 9.75,
      "cy": 6.68,
      "rx": 2.4,
      "ry": 1.25
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
      "accent": "oklch(0.82 0.16 85)"
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 20S3 14.5 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 14.5 12 20 12 20Z\" /><path d=\"M4.5 12h4l1.5-2.5 2.5 5 1.5-2.5h5\" /></svg>"
  },
  {
    "slug": "stethoscope",
    "name": "Stethoscope",
    "category": "Health",
    "keywords": [
      "stethoscope",
      "doctor",
      "examine",
      "clinic"
    ],
    "description": "A stethoscope whose tube dips while the chest piece listens.",
    "component": "PrequelStethoscopeIcon",
    "file": "prequel-stethoscope.tsx",
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
          "d": "M6 3v6a4 4 0 0 0 8 0V3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 3h1.5M12.5 3H14"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M10 13v3a5 5 0 0 0 10 0v-2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 20,
          "cy": 12,
          "r": 2.2
        },
        "role": "primary",
        "closed": true,
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
      true
    ],
    "highlight": {
      "cx": 19.12,
      "cy": 11.03,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 3v6a4 4 0 0 0 8 0V3\" /><path d=\"M6 3h1.5M12.5 3H14\" /><path d=\"M10 13v3a5 5 0 0 0 10 0v-2\" /><circle cx=\"20\" cy=\"12\" r=\"2.2\" /></svg>"
  },
  {
    "slug": "pill",
    "name": "Pill",
    "category": "Health",
    "keywords": [
      "pill",
      "medicine",
      "capsule",
      "dose"
    ],
    "description": "A capsule that splits along its seam on every press.",
    "component": "PrequelPillIcon",
    "file": "prequel-pill.tsx",
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
          "d": "M10.5 3.5l10 10a4 4 0 0 1-5.7 5.7l-10-10a4 4 0 0 1 5.7-5.7Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M7.5 6.5l10 10"
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
      "cx": 9.51,
      "cy": 6.14,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M10.5 3.5l10 10a4 4 0 0 1-5.7 5.7l-10-10a4 4 0 0 1 5.7-5.7Z\" /><path d=\"M7.5 6.5l10 10\" /></svg>"
  },
  {
    "slug": "syringe",
    "name": "Syringe",
    "category": "Health",
    "keywords": [
      "syringe",
      "injection",
      "vaccine",
      "dose"
    ],
    "description": "A syringe that charges, presses and draws back its plunger.",
    "component": "PrequelSyringeIcon",
    "file": "prequel-syringe.tsx",
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
          "d": "M18 6l3-3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M15 9l3 3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 16l6-6 3 3-6 6H8v-3Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M5 19l3-3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 21l2-2"
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
      false,
      false,
      true,
      false,
      false
    ],
    "highlight": {
      "cx": 10.7,
      "cy": 12.52,
      "rx": 1.44,
      "ry": 0.75
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M18 6l3-3\" /><path d=\"M15 9l3 3\" /><path d=\"M8 16l6-6 3 3-6 6H8v-3Z\" /><path d=\"M5 19l3-3\" /><path d=\"M3 21l2-2\" /></svg>"
  },
  {
    "slug": "thermometer",
    "name": "Thermometer",
    "category": "Health",
    "keywords": [
      "thermometer",
      "fever",
      "temperature",
      "clinical"
    ],
    "description": "A clinical thermometer whose mercury rises on each trigger.",
    "component": "PrequelThermometerIcon",
    "file": "prequel-thermometer.tsx",
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
          "d": "M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "rect",
        "attrs": {
          "x": 11,
          "y": 9,
          "width": 2,
          "height": 6,
          "rx": 1
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M16 7h2M16 10h2M16 13h2"
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
      "cx": 9,
      "cy": 7.06,
      "rx": 1.6,
      "ry": 0.83
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0Z\" /><rect x=\"11\" y=\"9\" width=\"2\" height=\"6\" rx=\"1\" /><path d=\"M16 7h2M16 10h2M16 13h2\" /></svg>"
  },
  {
    "slug": "first-aid",
    "name": "First Aid",
    "category": "Health",
    "keywords": [
      "first aid",
      "kit",
      "emergency",
      "cross"
    ],
    "description": "A medical kit whose cross is drawn and then lights up.",
    "component": "PrequelFirstAidIcon",
    "file": "prequel-first-aid.tsx",
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
          "x": 3,
          "y": 3,
          "width": 18,
          "height": 18,
          "rx": 4
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 8v8"
        },
        "role": "primary",
        "closed": false,
        "draw": true,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 12h8"
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
      "cy": 8.04,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"4\" /><path d=\"M12 8v8\" /><path d=\"M8 12h8\" /></svg>"
  },
  {
    "slug": "lungs",
    "name": "Lungs",
    "category": "Health",
    "keywords": [
      "lungs",
      "breath",
      "respiratory",
      "oxygen"
    ],
    "description": "A pair of lungs that fills and empties like a slow breath.",
    "component": "PrequelLungsIcon",
    "file": "prequel-lungs.tsx",
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
          "d": "M9 4v5.5c0 2.5-4 3.5-4 8 0 2 1.2 3.5 3 3.5 2.4 0 3.4-2.5 3.4-5V4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M15 4v5.5c0 2.5 4 3.5 4 8 0 2-1.2 3.5-3 3.5-2.4 0-3.4-2.5-3.4-5V4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 4v8"
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
      "primary": "oklch(0.56 0.1 225)",
      "primaryDark": "oklch(0.78 0.08 225)",
      "accent": "oklch(0.66 0.13 200)",
      "accentDark": "oklch(0.8 0.1 200)"
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M9 4v5.5c0 2.5-4 3.5-4 8 0 2 1.2 3.5 3 3.5 2.4 0 3.4-2.5 3.4-5V4\" /><path d=\"M15 4v5.5c0 2.5 4 3.5 4 8 0 2-1.2 3.5-3 3.5-2.4 0-3.4-2.5-3.4-5V4\" /><path d=\"M12 4v8\" /></svg>"
  },
  {
    "slug": "dna",
    "name": "Dna",
    "category": "Health",
    "keywords": [
      "dna",
      "genetics",
      "helix",
      "science"
    ],
    "description": "A double helix whose rungs light from top to bottom.",
    "component": "PrequelDnaIcon",
    "file": "prequel-dna.tsx",
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
          "d": "M7 3c0 5 10 5 10 9s-10 4-10 9"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M17 3c0 5-10 5-10 9s10 4 10 9"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8.4 7h7.2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8.4 12h7.2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8.4 17h7.2"
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
      false,
      false,
      false,
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.56 0.1 225)",
      "primaryDark": "oklch(0.78 0.08 225)",
      "accent": "oklch(0.66 0.13 200)",
      "accentDark": "oklch(0.8 0.1 200)"
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M7 3c0 5 10 5 10 9s-10 4-10 9\" /><path d=\"M17 3c0 5-10 5-10 9s10 4 10 9\" /><path d=\"M8.4 7h7.2\" /><path d=\"M8.4 12h7.2\" /><path d=\"M8.4 17h7.2\" /></svg>"
  },
  {
    "slug": "activity",
    "name": "Activity",
    "category": "Health",
    "keywords": [
      "activity",
      "monitor",
      "vitals",
      "health"
    ],
    "description": "A monitor frame with a pulse line that sweeps across it.",
    "component": "PrequelActivityIcon",
    "file": "prequel-activity.tsx",
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
          "rx": 4
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 12h4l2-4 3 8 2-4h1"
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
      "cy": 8.48,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"4\" /><path d=\"M6 12h4l2-4 3 8 2-4h1\" /></svg>"
  },
  {
    "slug": "hospital",
    "name": "Hospital",
    "category": "Health",
    "keywords": [
      "hospital",
      "clinic",
      "building",
      "care"
    ],
    "description": "A hospital block whose cross and doorway settle into place.",
    "component": "PrequelHospitalIcon",
    "file": "prequel-hospital.tsx",
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
          "d": "M3 21V6l9-3 9 3v15"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 21v-6h6v6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 7v4M10 9h4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 21h18"
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
      "primary": "oklch(0.56 0.1 225)",
      "primaryDark": "oklch(0.78 0.08 225)",
      "accent": "oklch(0.66 0.13 200)",
      "accentDark": "oklch(0.8 0.1 200)"
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 21V6l9-3 9 3v15\" /><path d=\"M9 21v-6h6v6\" /><path d=\"M12 7v4M10 9h4\" /><path d=\"M3 21h18\" /></svg>"
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
    "slug": "plane",
    "name": "Plane",
    "category": "Travel",
    "keywords": [
      "plane",
      "flight",
      "airport",
      "trip"
    ],
    "description": "A top-view airliner that banks just enough to feel airborne.",
    "component": "PrequelPlaneIcon",
    "file": "prequel-plane.tsx",
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
          "d": "M12 2c1 0 2 1.5 2 3.5V9l7 4v2l-7-2v4l2 2v2l-4-1-4 1v-2l2-2v-4l-7 2v-2l7-4V5.5C10 3.5 11 2 12 2Z"
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
      "cy": 7.32,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 2c1 0 2 1.5 2 3.5V9l7 4v2l-7-2v4l2 2v2l-4-1-4 1v-2l2-2v-4l-7 2v-2l7-4V5.5C10 3.5 11 2 12 2Z\" /></svg>"
  },
  {
    "slug": "suitcase",
    "name": "Suitcase",
    "category": "Travel",
    "keywords": [
      "suitcase",
      "luggage",
      "pack",
      "trip"
    ],
    "description": "A packed case that lifts and lands on its two little feet.",
    "component": "PrequelSuitcaseIcon",
    "file": "prequel-suitcase.tsx",
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
          "x": 4,
          "y": 7,
          "width": 16,
          "height": 13,
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
          "d": "M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 11v5M15 11v5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 20v1M15 20v1"
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
      "cx": 8.8,
      "cy": 10.64,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"4\" y=\"7\" width=\"16\" height=\"13\" rx=\"2.5\" /><path d=\"M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2\" /><path d=\"M9 11v5M15 11v5\" /><path d=\"M9 20v1M15 20v1\" /></svg>"
  },
  {
    "slug": "map-pin",
    "name": "Map Pin",
    "category": "Travel",
    "keywords": [
      "pin",
      "location",
      "place",
      "map"
    ],
    "description": "A location pin that drops onto its spot and pulses once.",
    "component": "PrequelMapPinIcon",
    "file": "prequel-map-pin.tsx",
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
          "d": "M12 21s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 12,
          "cy": 9,
          "r": 2.5
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
      "cx": 4.3,
      "cy": 7.32,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 21s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12Z\" /><circle cx=\"12\" cy=\"9\" r=\"2.5\" /></svg>"
  },
  {
    "slug": "compass",
    "name": "Compass",
    "category": "Travel",
    "keywords": [
      "compass",
      "navigate",
      "direction",
      "explore"
    ],
    "description": "A navigator's compass whose needle finds north again.",
    "component": "PrequelCompassIcon",
    "file": "prequel-compass.tsx",
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
          "d": "M14.5 9.5L11 11l-1.5 3.5L13 13l1.5-3.5Z"
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 4v1.5M20 12h-1.5M12 20v-1.5M4 12h1.5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
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
      "cy": 8.04,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\" /><path d=\"M14.5 9.5L11 11l-1.5 3.5L13 13l1.5-3.5Z\" /><path d=\"M12 4v1.5M20 12h-1.5M12 20v-1.5M4 12h1.5\" /></svg>"
  },
  {
    "slug": "passport",
    "name": "Passport",
    "category": "Travel",
    "keywords": [
      "passport",
      "identity",
      "border",
      "travel"
    ],
    "description": "A passport with a globe stamp that turns under the cover.",
    "component": "PrequelPassportIcon",
    "file": "prequel-passport.tsx",
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
          "y": 2,
          "width": 14,
          "height": 20,
          "rx": 2
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 12,
          "cy": 10,
          "r": 3.5
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8.5 10h7M12 6.5c1.5 1.5 1.5 5.5 0 7M12 6.5c-1.5 1.5-1.5 5.5 0 7"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 17h8"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
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
      "cx": 9.2,
      "cy": 7.6,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"5\" y=\"2\" width=\"14\" height=\"20\" rx=\"2\" /><circle cx=\"12\" cy=\"10\" r=\"3.5\" /><path d=\"M8.5 10h7M12 6.5c1.5 1.5 1.5 5.5 0 7M12 6.5c-1.5 1.5-1.5 5.5 0 7\" /><path d=\"M8 17h8\" /></svg>"
  },
  {
    "slug": "hotel",
    "name": "Hotel",
    "category": "Travel",
    "keywords": [
      "hotel",
      "stay",
      "room",
      "building"
    ],
    "description": "A hotel facade whose windows blink on in a quiet cascade.",
    "component": "PrequelHotelIcon",
    "file": "prequel-hotel.tsx",
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
          "d": "M4 21V4h16v17"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 8h2M14 8h2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 12h2M14 12h2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 16h2M14 16h2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M10 21v-3h4v3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M3 21h18"
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
      "primary",
      "primary"
    ],
    "closed": [
      false,
      false,
      false,
      false,
      false,
      false
    ],
    "highlight": null,
    "palette": {
      "primary": "oklch(0.56 0.1 225)",
      "primaryDark": "oklch(0.78 0.08 225)",
      "accent": "oklch(0.66 0.13 200)",
      "accentDark": "oklch(0.8 0.1 200)"
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 21V4h16v17\" /><path d=\"M8 8h2M14 8h2\" /><path d=\"M8 12h2M14 12h2\" /><path d=\"M8 16h2M14 16h2\" /><path d=\"M10 21v-3h4v3\" /><path d=\"M3 21h18\" /></svg>"
  },
  {
    "slug": "train",
    "name": "Train",
    "category": "Travel",
    "keywords": [
      "train",
      "rail",
      "station",
      "transit"
    ],
    "description": "A railcar that glides forward while its windows flicker past.",
    "component": "PrequelTrainIcon",
    "file": "prequel-train.tsx",
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
          "d": "M7 3h10a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M4 10h16"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 14h.01"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M15 14h.01"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 21l2-2M16 21l-2-2"
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
      "cy": 5.88,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M7 3h10a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z\" /><path d=\"M4 10h16\" /><path d=\"M9 14h.01\" /><path d=\"M15 14h.01\" /><path d=\"M8 21l2-2M16 21l-2-2\" /></svg>"
  },
  {
    "slug": "car",
    "name": "Car",
    "category": "Travel",
    "keywords": [
      "car",
      "drive",
      "road",
      "vehicle"
    ],
    "description": "A compact car that bounces on its suspension.",
    "component": "PrequelCarIcon",
    "file": "prequel-car.tsx",
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
          "d": "M5 16l1.5-6.5A2 2 0 0 1 8.4 8h7.2a2 2 0 0 1 1.9 1.5L19 16"
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
          "y": 15,
          "width": 18,
          "height": 3.5,
          "rx": 1.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 7.5,
          "cy": 19.5,
          "r": 1.7
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 16.5,
          "cy": 19.5,
          "r": 1.7
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M8 12h8"
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
      "accent",
      "primary"
    ],
    "closed": [
      false,
      true,
      true,
      true,
      false
    ],
    "highlight": {
      "cx": 8.4,
      "cy": 15.98,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 16l1.5-6.5A2 2 0 0 1 8.4 8h7.2a2 2 0 0 1 1.9 1.5L19 16\" /><rect x=\"3\" y=\"15\" width=\"18\" height=\"3.5\" rx=\"1.5\" /><circle cx=\"7.5\" cy=\"19.5\" r=\"1.7\" /><circle cx=\"16.5\" cy=\"19.5\" r=\"1.7\" /><path d=\"M8 12h8\" /></svg>"
  },
  {
    "slug": "bike",
    "name": "Bike",
    "category": "Travel",
    "keywords": [
      "bike",
      "cycle",
      "ride",
      "commute"
    ],
    "description": "A bicycle that rolls as its pedals turn one full lap.",
    "component": "PrequelBikeIcon",
    "file": "prequel-bike.tsx",
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
          "cx": 6,
          "cy": 17,
          "r": 3.5
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
          "cy": 17,
          "r": 3.5
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 17l4-6h4l4 6"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M10 11h3a1 1 0 0 1 0 2h-3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9.5 11l2 6"
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
      "primary",
      "primary"
    ],
    "closed": [
      true,
      true,
      false,
      false,
      false
    ],
    "highlight": {
      "cx": 4.6,
      "cy": 15.46,
      "rx": 1.12,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"6\" cy=\"17\" r=\"3.5\" /><circle cx=\"18\" cy=\"17\" r=\"3.5\" /><path d=\"M6 17l4-6h4l4 6\" /><path d=\"M10 11h3a1 1 0 0 1 0 2h-3\" /><path d=\"M9.5 11l2 6\" /></svg>"
  },
  {
    "slug": "globe",
    "name": "Globe",
    "category": "Travel",
    "keywords": [
      "globe",
      "world",
      "international",
      "earth"
    ],
    "description": "A globe whose meridians turn while the equator holds still.",
    "component": "PrequelGlobeIcon",
    "file": "prequel-globe.tsx",
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
          "d": "M3 12h18"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 3c3 3 3 15 0 18"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 3c-3 3-3 15 0 18"
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
      "cy": 8.04,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\" /><path d=\"M3 12h18\" /><path d=\"M12 3c3 3 3 15 0 18\" /><path d=\"M12 3c-3 3-3 15 0 18\" /></svg>"
  },
  {
    "slug": "sparkles",
    "name": "Sparkles",
    "category": "AI",
    "keywords": [
      "sparkles",
      "ai",
      "magic",
      "generate"
    ],
    "description": "A four-point spark that blooms while two smaller ones blink.",
    "component": "PrequelSparklesIcon",
    "file": "prequel-sparkles.tsx",
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
          "d": "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M18.5 3l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z"
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M5 16l.6 1.4L7 18l-1.4.6L5 20l-.6-1.4L3 18l1.4-.6L5 16Z"
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "primary",
      "accent",
      "accent"
    ],
    "closed": [
      true,
      true,
      true
    ],
    "highlight": {
      "cx": 9.2,
      "cy": 6.92,
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
      "accent": "oklch(0.82 0.16 85)"
    },
    "styles": [
      "outline",
      "solid",
      "duotone",
      "color",
      "emoji"
    ],
    "fill": [
      "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"
    ],
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z\" /><path d=\"M18.5 3l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z\" /><path d=\"M5 16l.6 1.4L7 18l-1.4.6L5 20l-.6-1.4L3 18l1.4-.6L5 16Z\" /></svg>"
  },
  {
    "slug": "bot",
    "name": "Bot",
    "category": "AI",
    "keywords": [
      "bot",
      "assistant",
      "ai",
      "automation"
    ],
    "description": "A small assistant whose antenna bobs and whose eyes blink.",
    "component": "PrequelBotIcon",
    "file": "prequel-bot.tsx",
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
          "x": 4,
          "y": 6,
          "width": 16,
          "height": 12,
          "rx": 5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 3v3"
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
          "cy": 2,
          "r": 1.4
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 12h.01M15 12h.01"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M2 11v2M22 11v2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9.5 15.5h5"
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
      "accent",
      "primary",
      "primary",
      "primary"
    ],
    "closed": [
      true,
      false,
      true,
      false,
      false,
      false
    ],
    "highlight": {
      "cx": 8.8,
      "cy": 9.36,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"4\" y=\"6\" width=\"16\" height=\"12\" rx=\"5\" /><path d=\"M12 3v3\" /><circle cx=\"12\" cy=\"2\" r=\"1.4\" /><path d=\"M9 12h.01M15 12h.01\" /><path d=\"M2 11v2M22 11v2\" /><path d=\"M9.5 15.5h5\" /></svg>"
  },
  {
    "slug": "brain-circuit",
    "name": "Brain Circuit",
    "category": "AI",
    "keywords": [
      "brain",
      "circuit",
      "neural",
      "intelligence"
    ],
    "description": "A thinking brain whose circuit nodes light in sequence.",
    "component": "PrequelBrainCircuitIcon",
    "file": "prequel-brain-circuit.tsx",
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
          "d": "M9.5 4a3 3 0 0 0-5 2.1 3 3 0 0 0-1 5A3 3 0 0 0 5 15a3 3 0 0 0 4.5 2.9A2.3 2.3 0 0 0 12 16V6a2 2 0 0 0-2.5-2Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M14.5 4a3 3 0 0 1 5 2.1 3 3 0 0 1 1 5A3 3 0 0 1 19 15a3 3 0 0 1-4.5 2.9A2.3 2.3 0 0 1 12 16V6a2 2 0 0 1 2.5-2Z"
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 6.5,
          "cy": 8.5,
          "r": 1
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 17.5,
          "cy": 8.5,
          "r": 1
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 7,
          "cy": 14,
          "r": 1
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M12 4v12"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "accent",
      "accent",
      "accent",
      "accent",
      "primary"
    ],
    "closed": [
      true,
      true,
      true,
      true,
      true,
      false
    ],
    "highlight": {
      "cx": 4.64,
      "cy": 7.29,
      "rx": 2.21,
      "ry": 1.15
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M9.5 4a3 3 0 0 0-5 2.1 3 3 0 0 0-1 5A3 3 0 0 0 5 15a3 3 0 0 0 4.5 2.9A2.3 2.3 0 0 0 12 16V6a2 2 0 0 0-2.5-2Z\" /><path d=\"M14.5 4a3 3 0 0 1 5 2.1 3 3 0 0 1 1 5A3 3 0 0 1 19 15a3 3 0 0 1-4.5 2.9A2.3 2.3 0 0 1 12 16V6a2 2 0 0 1 2.5-2Z\" /><circle cx=\"6.5\" cy=\"8.5\" r=\"1\" /><circle cx=\"17.5\" cy=\"8.5\" r=\"1\" /><circle cx=\"7\" cy=\"14\" r=\"1\" /><path d=\"M12 4v12\" /></svg>"
  },
  {
    "slug": "chip",
    "name": "Chip",
    "category": "AI",
    "keywords": [
      "chip",
      "processor",
      "compute",
      "ai"
    ],
    "description": "A processor die whose pins pulse in a ring around it.",
    "component": "PrequelChipIcon",
    "file": "prequel-chip.tsx",
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
          "x": 6,
          "y": 6,
          "width": 12,
          "height": 12,
          "rx": 2.5
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "rect",
        "attrs": {
          "x": 9.5,
          "y": 9.5,
          "width": 5,
          "height": 5,
          "rx": 1
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 2v4M15 2v4M9 18v4M15 18v4"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M2 9h4M2 15h4M18 9h4M18 15h4"
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
          "cy": 12,
          "r": 1
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      }
    ],
    "roles": [
      "primary",
      "accent",
      "primary",
      "primary",
      "accent"
    ],
    "closed": [
      true,
      true,
      false,
      false,
      true
    ],
    "highlight": {
      "cx": 9.6,
      "cy": 9.36,
      "rx": 1.92,
      "ry": 1
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"6\" y=\"6\" width=\"12\" height=\"12\" rx=\"2.5\" /><rect x=\"9.5\" y=\"9.5\" width=\"5\" height=\"5\" rx=\"1\" /><path d=\"M9 2v4M15 2v4M9 18v4M15 18v4\" /><path d=\"M2 9h4M2 15h4M18 9h4M18 15h4\" /><circle cx=\"12\" cy=\"12\" r=\"1\" /></svg>"
  },
  {
    "slug": "neural",
    "name": "Neural",
    "category": "AI",
    "keywords": [
      "neural",
      "network",
      "nodes",
      "model"
    ],
    "description": "A network of nodes that pulses from the input to the output.",
    "component": "PrequelNeuralIcon",
    "file": "prequel-neural.tsx",
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
          "cx": 4.5,
          "cy": 6,
          "r": 2
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 4.5,
          "cy": 18,
          "r": 2
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 12,
          "cy": 12,
          "r": 2.4
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 19.5,
          "cy": 6,
          "r": 2
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 19.5,
          "cy": 18,
          "r": 2
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6.3 7l3.6 3.5M6.3 17l3.6-3.5M14.2 10.5l3.5-3.5M14.2 13.5l3.5 3.5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      }
    ],
    "roles": [
      "accent",
      "accent",
      "primary",
      "accent",
      "accent",
      "primary"
    ],
    "closed": [
      true,
      true,
      true,
      true,
      true,
      false
    ],
    "highlight": {
      "cx": 11.04,
      "cy": 10.94,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"4.5\" cy=\"6\" r=\"2\" /><circle cx=\"4.5\" cy=\"18\" r=\"2\" /><circle cx=\"12\" cy=\"12\" r=\"2.4\" /><circle cx=\"19.5\" cy=\"6\" r=\"2\" /><circle cx=\"19.5\" cy=\"18\" r=\"2\" /><path d=\"M6.3 7l3.6 3.5M6.3 17l3.6-3.5M14.2 10.5l3.5-3.5M14.2 13.5l3.5 3.5\" /></svg>"
  },
  {
    "slug": "wand",
    "name": "Wand",
    "category": "AI",
    "keywords": [
      "wand",
      "magic",
      "generate",
      "sparkle"
    ],
    "description": "A wand that taps its tip and leaves a small four-point star.",
    "component": "PrequelWandIcon",
    "file": "prequel-wand.tsx",
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
          "d": "M3 21L14.5 9.5"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M14.5 9.5l2.5 2.5 3-3-2.5-2.5-3 3Z"
        },
        "role": "primary",
        "closed": true,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M18 3v2M21 5h-2"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M6 4l.8 1.7L8.5 6l-1.7.8L6 8.5l-.8-1.7L3.5 6l1.7-.3L6 4Z"
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
      "primary",
      "accent"
    ],
    "closed": [
      false,
      true,
      false,
      true
    ],
    "highlight": {
      "cx": 16.15,
      "cy": 8.04,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 21L14.5 9.5\" /><path d=\"M14.5 9.5l2.5 2.5 3-3-2.5-2.5-3 3Z\" /><path d=\"M18 3v2M21 5h-2\" /><path d=\"M6 4l.8 1.7L8.5 6l-1.7.8L6 8.5l-.8-1.7L3.5 6l1.7-.3L6 4Z\" /></svg>"
  },
  {
    "slug": "prompt",
    "name": "Prompt",
    "category": "AI",
    "keywords": [
      "prompt",
      "input",
      "command",
      "ai"
    ],
    "description": "A prompt box whose caret types and whose spark answers.",
    "component": "PrequelPromptIcon",
    "file": "prequel-prompt.tsx",
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
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M18 6l.5 1.5L20 8l-1.5.5L18 10l-.5-1.5L16 8l1.5-.5L18 6Z"
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
      "primary",
      "accent"
    ],
    "closed": [
      true,
      false,
      false,
      true
    ],
    "highlight": {
      "cx": 8.4,
      "cy": 8.48,
      "rx": 2.4,
      "ry": 1.25
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\" /><path d=\"M7 9l3 3-3 3\" /><path d=\"M13 15h4\" /><path d=\"M18 6l.5 1.5L20 8l-1.5.5L18 10l-.5-1.5L16 8l1.5-.5L18 6Z\" /></svg>"
  },
  {
    "slug": "robot",
    "name": "Robot",
    "category": "AI",
    "keywords": [
      "robot",
      "android",
      "machine",
      "ai"
    ],
    "description": "A friendly robot whose antenna bobs and whose arms wave.",
    "component": "PrequelRobotIcon",
    "file": "prequel-robot.tsx",
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
          "x": 5,
          "y": 7,
          "width": 14,
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
          "d": "M12 3v4"
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
          "cy": 2.5,
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
          "d": "M2 12v3M22 12v3"
        },
        "role": "primary",
        "closed": false,
        "draw": false,
        "inside": false
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 9.5,
          "cy": 12,
          "r": 1
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      },
      {
        "tag": "circle",
        "attrs": {
          "cx": 14.5,
          "cy": 12,
          "r": 1
        },
        "role": "accent",
        "closed": true,
        "draw": false,
        "inside": true
      },
      {
        "tag": "path",
        "attrs": {
          "d": "M9 15.5h6"
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
      "accent",
      "primary",
      "accent",
      "accent",
      "primary"
    ],
    "closed": [
      true,
      false,
      true,
      false,
      true,
      true,
      false
    ],
    "highlight": {
      "cx": 9.2,
      "cy": 10.08,
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
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"5\" y=\"7\" width=\"14\" height=\"11\" rx=\"3\" /><path d=\"M12 3v4\" /><circle cx=\"12\" cy=\"2.5\" r=\"1.5\" /><path d=\"M2 12v3M22 12v3\" /><circle cx=\"9.5\" cy=\"12\" r=\"1\" /><circle cx=\"14.5\" cy=\"12\" r=\"1\" /><path d=\"M9 15.5h6\" /></svg>"
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
    "id": "Communication",
    "title": "Communication"
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
    "id": "Finance",
    "title": "Finance"
  },
  {
    "id": "Health",
    "title": "Health"
  },
  {
    "id": "Nature",
    "title": "Nature"
  },
  {
    "id": "Travel",
    "title": "Travel"
  },
  {
    "id": "AI",
    "title": "AI"
  },
  {
    "id": "Tools",
    "title": "Tools"
  }
];
