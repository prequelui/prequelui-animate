import { createPrequelPlaneIcon } from "./prequel-plane.js";

export function createPrequelPlaneColorIcon(root, options = {}) {
  const controller = createPrequelPlaneIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
