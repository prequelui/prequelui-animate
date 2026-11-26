import { createPrequelTrashIcon } from "./prequel-trash.js";

export function createPrequelTrashSolidIcon(root, options = {}) {
  const controller = createPrequelTrashIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
