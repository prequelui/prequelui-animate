import { createPrequelMailIcon } from "./prequel-mail.js";

export function createPrequelMailColorIcon(root, options = {}) {
  const controller = createPrequelMailIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
