import { createPrequelPromptIcon } from "./prequel-prompt.js";

export function createPrequelPromptDuotoneIcon(root, options = {}) {
  const controller = createPrequelPromptIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
