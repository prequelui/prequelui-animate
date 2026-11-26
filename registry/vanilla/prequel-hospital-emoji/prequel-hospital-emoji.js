import { createPrequelHospitalIcon } from "./prequel-hospital.js";

export function createPrequelHospitalEmojiIcon(root, options = {}) {
  const controller = createPrequelHospitalIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
