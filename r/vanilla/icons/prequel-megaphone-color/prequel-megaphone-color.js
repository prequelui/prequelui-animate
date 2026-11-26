import { createPrequelMegaphoneIcon } from "./prequel-megaphone.js";

export function createPrequelMegaphoneColorIcon(root, options = {}) {
  const controller = createPrequelMegaphoneIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
