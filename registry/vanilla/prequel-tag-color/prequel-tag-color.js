import { createPrequelTagIcon } from "./prequel-tag.js";

export function createPrequelTagColorIcon(root, options = {}) {
  const controller = createPrequelTagIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
