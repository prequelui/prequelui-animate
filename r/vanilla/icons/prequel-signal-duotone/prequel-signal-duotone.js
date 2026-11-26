import { createPrequelSignalIcon } from "./prequel-signal.js";

export function createPrequelSignalDuotoneIcon(root, options = {}) {
  const controller = createPrequelSignalIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
