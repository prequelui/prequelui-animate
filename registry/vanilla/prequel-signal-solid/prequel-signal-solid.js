import { createPrequelSignalIcon } from "./prequel-signal.js";

export function createPrequelSignalSolidIcon(root, options = {}) {
  const controller = createPrequelSignalIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
