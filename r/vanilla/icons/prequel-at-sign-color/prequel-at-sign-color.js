import { createPrequelAtSignIcon } from "./prequel-at-sign.js";

export function createPrequelAtSignColorIcon(root, options = {}) {
  const controller = createPrequelAtSignIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
