import { createPrequelFilmIcon } from "./prequel-film.js";

export function createPrequelFilmDuotoneIcon(root, options = {}) {
  const controller = createPrequelFilmIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
