import { createPrequelVoicemailIcon } from "./prequel-voicemail.js";

export function createPrequelVoicemailDuotoneIcon(root, options = {}) {
  const controller = createPrequelVoicemailIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
