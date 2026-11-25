import { createPrequelPassportIcon } from "./prequel-passport.js";

export function createPrequelPassportDuotoneIcon(root, options = {}) {
  const controller = createPrequelPassportIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
