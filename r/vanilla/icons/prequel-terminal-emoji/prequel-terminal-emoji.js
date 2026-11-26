import { createPrequelTerminalIcon } from "./prequel-terminal.js";

export function createPrequelTerminalEmojiIcon(root, options = {}) {
  const controller = createPrequelTerminalIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
