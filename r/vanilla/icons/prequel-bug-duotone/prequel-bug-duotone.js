import { createPrequelBugIcon } from "./prequel-bug.js";

export function createPrequelBugDuotoneIcon(root, options = {}) {
  const controller = createPrequelBugIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
