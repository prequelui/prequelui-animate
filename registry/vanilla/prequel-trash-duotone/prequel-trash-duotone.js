import { createPrequelTrashIcon } from "./prequel-trash.js";

export function createPrequelTrashDuotoneIcon(root, options = {}) {
  const controller = createPrequelTrashIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
