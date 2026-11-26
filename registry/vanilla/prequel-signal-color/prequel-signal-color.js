import { createPrequelSignalIcon } from "./prequel-signal.js";

export function createPrequelSignalColorIcon(root, options = {}) {
  const controller = createPrequelSignalIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
