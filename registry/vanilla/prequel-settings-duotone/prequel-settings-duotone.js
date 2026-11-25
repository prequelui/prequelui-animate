import { createPrequelSettingsIcon } from "./prequel-settings.js";

export function createPrequelSettingsDuotoneIcon(root, options = {}) {
  const controller = createPrequelSettingsIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
