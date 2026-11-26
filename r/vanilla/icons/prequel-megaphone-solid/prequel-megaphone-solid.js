import { createPrequelMegaphoneIcon } from "./prequel-megaphone.js";

export function createPrequelMegaphoneSolidIcon(root, options = {}) {
  const controller = createPrequelMegaphoneIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
