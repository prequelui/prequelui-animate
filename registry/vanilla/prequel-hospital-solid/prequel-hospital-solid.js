import { createPrequelHospitalIcon } from "./prequel-hospital.js";

export function createPrequelHospitalSolidIcon(root, options = {}) {
  const controller = createPrequelHospitalIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
