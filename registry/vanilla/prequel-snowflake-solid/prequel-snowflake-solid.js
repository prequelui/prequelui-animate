import { createPrequelSnowflakeIcon } from "./prequel-snowflake.js";

export function createPrequelSnowflakeSolidIcon(root, options = {}) {
  const controller = createPrequelSnowflakeIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
