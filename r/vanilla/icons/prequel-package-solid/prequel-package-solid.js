import { createPrequelPackageIcon } from "./prequel-package.js";

export function createPrequelPackageSolidIcon(root, options = {}) {
  const controller = createPrequelPackageIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
