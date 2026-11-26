import { createPrequelPromptIcon } from "./prequel-prompt.js";

export function createPrequelPromptSolidIcon(root, options = {}) {
  const controller = createPrequelPromptIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
