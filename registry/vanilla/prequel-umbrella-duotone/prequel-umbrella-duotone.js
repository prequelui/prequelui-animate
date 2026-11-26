import { createPrequelUmbrellaIcon } from "./prequel-umbrella.js";

export function createPrequelUmbrellaDuotoneIcon(root, options = {}) {
  const controller = createPrequelUmbrellaIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
