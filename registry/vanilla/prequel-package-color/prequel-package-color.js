import { createPrequelPackageIcon } from "./prequel-package.js";

export function createPrequelPackageColorIcon(root, options = {}) {
  const controller = createPrequelPackageIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
