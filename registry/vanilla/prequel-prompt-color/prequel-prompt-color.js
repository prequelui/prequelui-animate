import { createPrequelPromptIcon } from "./prequel-prompt.js";

export function createPrequelPromptColorIcon(root, options = {}) {
  const controller = createPrequelPromptIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
