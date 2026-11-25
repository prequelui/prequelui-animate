import { createPrequelClipboardIcon } from "./prequel-clipboard.js";

export function createPrequelClipboardColorIcon(root, options = {}) {
  const controller = createPrequelClipboardIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
