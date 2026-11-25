import { createPrequelClipboardIcon } from "./prequel-clipboard.js";

export function createPrequelClipboardSolidIcon(root, options = {}) {
  const controller = createPrequelClipboardIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
