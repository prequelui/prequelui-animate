import { createPrequelBugIcon } from "./prequel-bug.js";

export function createPrequelBugSolidIcon(root, options = {}) {
  const controller = createPrequelBugIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
