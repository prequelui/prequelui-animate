import { createPrequelUserIcon } from "./prequel-user.js";

export function createPrequelUserSolidIcon(root, options = {}) {
  const controller = createPrequelUserIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
