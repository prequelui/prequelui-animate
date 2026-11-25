import { createPrequelUmbrellaIcon } from "./prequel-umbrella.js";

export function createPrequelUmbrellaColorIcon(root, options = {}) {
  const controller = createPrequelUmbrellaIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
