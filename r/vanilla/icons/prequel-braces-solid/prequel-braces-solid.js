import { createPrequelBracesIcon } from "./prequel-braces.js";

export function createPrequelBracesSolidIcon(root, options = {}) {
  const controller = createPrequelBracesIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
