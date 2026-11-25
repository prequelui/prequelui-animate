import { createPrequelBugIcon } from "./prequel-bug.js";

export function createPrequelBugColorIcon(root, options = {}) {
  const controller = createPrequelBugIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
