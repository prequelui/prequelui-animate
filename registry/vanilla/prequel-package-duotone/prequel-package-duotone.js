import { createPrequelPackageIcon } from "./prequel-package.js";

export function createPrequelPackageDuotoneIcon(root, options = {}) {
  const controller = createPrequelPackageIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
