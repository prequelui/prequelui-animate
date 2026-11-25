import { createPrequelTerminalIcon } from "./prequel-terminal.js";

export function createPrequelTerminalDuotoneIcon(root, options = {}) {
  const controller = createPrequelTerminalIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
