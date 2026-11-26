import { createPrequelHospitalIcon } from "./prequel-hospital.js";

export function createPrequelHospitalColorIcon(root, options = {}) {
  const controller = createPrequelHospitalIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
