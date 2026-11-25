import { createPrequelVoicemailIcon } from "./prequel-voicemail.js";

export function createPrequelVoicemailSolidIcon(root, options = {}) {
  const controller = createPrequelVoicemailIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
