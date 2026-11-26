import { createPrequelTerminalIcon } from "./prequel-terminal.js";

export function createPrequelTerminalSolidIcon(root, options = {}) {
  const controller = createPrequelTerminalIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
