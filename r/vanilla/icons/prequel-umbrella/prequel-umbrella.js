import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"umbrella","name":"Umbrella","category":"Weather","parts":[{"tag":"path","attrs":{"d":"M3 12a9 9 0 0 1 18 0H3Z"}},{"tag":"path","attrs":{"d":"M12 3V2"}},{"tag":"path","attrs":{"d":"M12 12v7a2.5 2.5 0 0 0 5 0"}}],"roles":["primary","primary","primary"],"closed":[true,false,false],"draw":[false,false,false],"inside":[false,false,true],"hasClosed":true,"highlight":{"cx":11.1,"cy":8.04,"rx":2.4,"ry":1.25},"palette":{"color":{"primary":"oklch(0.62 0.14 235)","primaryDark":"oklch(0.79 0.11 235)","accent":"oklch(0.74 0.16 85)","accentDark":"oklch(0.85 0.13 85)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"rotate":0,"transformOrigin":"top center"},"animate":{"rotate":[0,-6,5,-3,0],"transition":{"duration":0.6,"ease":"easeInOut"},"transformOrigin":"top center"}},"p0":{},"p1":{},"p2":{"initial":{"x":0},"animate":{"x":[0,-2.5,2.5,-1.5,0],"transition":{"duration":0.5,"ease":"easeInOut"}}}},"tap":{"group":{"initial":{"rotate":0,"transformOrigin":"top center"},"animate":{"rotate":[0,-14,12,-8,4,0],"transition":{"duration":0.95,"ease":"easeInOut"},"transformOrigin":"top center"}},"p0":{},"p1":{},"p2":{"initial":{"x":0},"animate":{"x":[0,-4,4,-3,2,0],"transition":{"duration":0.75,"ease":"easeInOut"}}}},"loop":{"group":{"initial":{"rotate":0,"transformOrigin":"top center"},"animate":{"rotate":[0,-4,4,0],"transition":{"duration":1.6,"ease":"easeInOut"},"transformOrigin":"top center"}},"p0":{},"p1":{},"p2":{"initial":{"x":0},"animate":{"x":[0,-2,2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}}}},"component":"PrequelUmbrellaIcon"};

export const meta = {"slug":"umbrella","name":"Umbrella","category":"Weather","component":"PrequelUmbrellaIcon","style":"outline"};

export function createPrequelUmbrellaIcon(root, options = {}) {
  let current = { ...options };
  const render = () => {
    root.innerHTML = renderIcon(spec, current);
  };
  render();
  const controller = bindPrequelIcon(root, spec, () => current);
  return {
    play: controller.play,
    reset: controller.reset,
    destroy: controller.destroy,
    update(next = {}) {
      current = { ...current, ...next };
      render();
    },
    get observed() {
      return controller.observed;
    },
  };
}
