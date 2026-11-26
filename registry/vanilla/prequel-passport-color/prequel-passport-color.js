import { createPrequelPassportIcon } from "./prequel-passport.js";

export function createPrequelPassportColorIcon(root, options = {}) {
  const controller = createPrequelPassportIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
