import { createPrequelUserIcon } from "./prequel-user.js";

export function createPrequelUserDuotoneIcon(root, options = {}) {
  const controller = createPrequelUserIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
