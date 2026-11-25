import { createPrequelClipboardIcon } from "./prequel-clipboard.js";

export function createPrequelClipboardDuotoneIcon(root, options = {}) {
  const controller = createPrequelClipboardIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
