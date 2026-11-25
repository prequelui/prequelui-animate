import { createPrequelUserIcon } from "./prequel-user.js";

export function createPrequelUserColorIcon(root, options = {}) {
  const controller = createPrequelUserIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
