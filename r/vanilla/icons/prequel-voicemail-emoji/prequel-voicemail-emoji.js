import { createPrequelVoicemailIcon } from "./prequel-voicemail.js";

export function createPrequelVoicemailEmojiIcon(root, options = {}) {
  const controller = createPrequelVoicemailIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
