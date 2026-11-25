import { createPrequelPassportIcon } from "./prequel-passport.js";

export function createPrequelPassportSolidIcon(root, options = {}) {
  const controller = createPrequelPassportIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
