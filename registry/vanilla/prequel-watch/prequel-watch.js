import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"watch","name":"Watch","category":"Devices","parts":[{"tag":"rect","attrs":{"x":7,"y":6,"width":10,"height":12,"rx":3}},{"tag":"path","attrs":{"d":"M9 6l.5-3h5l.5 3"}},{"tag":"path","attrs":{"d":"M9 18l.5 3h5l.5-3"}},{"tag":"path","attrs":{"d":"M12 10v2.5l1.5 1"}}],"roles":["primary","primary","primary","primary"],"closed":[true,false,false,false],"draw":[false,false,false,false],"inside":[false,false,false,true],"hasClosed":true,"highlight":{"cx":10,"cy":9.36,"rx":1.6,"ry":0.83},"palette":{"color":{"primary":"oklch(0.6 0.13 265)","primaryDark":"oklch(0.78 0.1 265)","accent":"oklch(0.7 0.15 285)","accentDark":"oklch(0.82 0.12 285)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.6 0.2 300)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-6,5,-3,0],"transition":{"duration":0.6,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{},"p3":{"initial":{"rotate":0,"transformOrigin":"12px 12px"},"animate":{"rotate":[0,25,0],"transition":{"duration":0.55,"ease":"easeInOut"},"transformOrigin":"12px 12px"}}},"tap":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-14,12,-8,4,0],"transition":{"duration":0.95,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{},"p3":{"initial":{"rotate":0,"transformOrigin":"12px 12px"},"animate":{"rotate":[0,360],"transition":{"duration":0.85,"ease":[0.22,1,0.36,1]},"transformOrigin":"12px 12px"}}},"loop":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-4,4,0],"transition":{"duration":1.6,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{},"p3":{"initial":{"rotate":0,"transformOrigin":"12px 12px"},"animate":{"rotate":[0,360],"transition":{"duration":1.8,"ease":"easeInOut"},"transformOrigin":"12px 12px"}}}},"component":"PrequelWatchIcon"};

export const meta = {"slug":"watch","name":"Watch","category":"Devices","component":"PrequelWatchIcon","style":"outline"};

export function createPrequelWatchIcon(root, options = {}) {
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
