import { createPrequelVoicemailIcon } from "./prequel-voicemail.js";

export function createPrequelVoicemailColorIcon(root, options = {}) {
  const controller = createPrequelVoicemailIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
