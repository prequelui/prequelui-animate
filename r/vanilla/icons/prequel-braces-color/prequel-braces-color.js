import { createPrequelBracesIcon } from "./prequel-braces.js";

export function createPrequelBracesColorIcon(root, options = {}) {
  const controller = createPrequelBracesIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
