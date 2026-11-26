import { createPrequelTerminalIcon } from "./prequel-terminal.js";

export function createPrequelTerminalColorIcon(root, options = {}) {
  const controller = createPrequelTerminalIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
