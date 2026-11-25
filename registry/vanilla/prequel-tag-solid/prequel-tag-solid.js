import { createPrequelTagIcon } from "./prequel-tag.js";

export function createPrequelTagSolidIcon(root, options = {}) {
  const controller = createPrequelTagIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
