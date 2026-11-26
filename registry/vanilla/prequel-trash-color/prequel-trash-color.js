import { createPrequelTrashIcon } from "./prequel-trash.js";

export function createPrequelTrashColorIcon(root, options = {}) {
  const controller = createPrequelTrashIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
