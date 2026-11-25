import { createPrequelBracesIcon } from "./prequel-braces.js";

export function createPrequelBracesDuotoneIcon(root, options = {}) {
  const controller = createPrequelBracesIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
