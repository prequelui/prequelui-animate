import { createPrequelUmbrellaIcon } from "./prequel-umbrella.js";

export function createPrequelUmbrellaSolidIcon(root, options = {}) {
  const controller = createPrequelUmbrellaIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
