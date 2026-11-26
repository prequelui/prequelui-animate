import { createPrequelTagIcon } from "./prequel-tag.js";

export function createPrequelTagDuotoneIcon(root, options = {}) {
  const controller = createPrequelTagIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
