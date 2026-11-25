import { createPrequelHospitalIcon } from "./prequel-hospital.js";

export function createPrequelHospitalDuotoneIcon(root, options = {}) {
  const controller = createPrequelHospitalIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
