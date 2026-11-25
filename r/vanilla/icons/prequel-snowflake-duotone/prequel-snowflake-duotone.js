import { createPrequelSnowflakeIcon } from "./prequel-snowflake.js";

export function createPrequelSnowflakeDuotoneIcon(root, options = {}) {
  const controller = createPrequelSnowflakeIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
