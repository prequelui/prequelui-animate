import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"timer","name":"Timer","category":"Time","parts":[{"tag":"circle","attrs":{"cx":12,"cy":14,"r":7.5}},{"tag":"path","attrs":{"d":"M9 2h6"}},{"tag":"path","attrs":{"d":"M12 2v3.5"}},{"tag":"path","attrs":{"d":"M12 14v-4"}}],"roles":["primary","primary","primary","primary"],"closed":[true,false,false,false],"draw":[false,false,false,false],"inside":[false,false,false,true],"hasClosed":true,"highlight":{"cx":9,"cy":10.7,"rx":2.4,"ry":1.25},"palette":{"color":{"primary":"oklch(0.68 0.14 75)","primaryDark":"oklch(0.82 0.11 75)","accent":"oklch(0.62 0.16 40)","accentDark":"oklch(0.76 0.13 40)"},"emoji":{"primary":"oklch(0.82 0.16 85)","secondary":"oklch(0.66 0.15 80)","accent":"oklch(0.72 0.19 48)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.06,1],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{},"p2":{},"p3":{"initial":{"rotate":0,"transformOrigin":"12px 14px"},"animate":{"rotate":[0,25,0],"transition":{"duration":0.55,"ease":"easeInOut"},"transformOrigin":"12px 14px"}}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,0.9,1.14,0.98,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{},"p2":{},"p3":{"initial":{"rotate":0,"transformOrigin":"12px 14px"},"animate":{"rotate":[0,360],"transition":{"duration":0.85,"ease":[0.22,1,0.36,1]},"transformOrigin":"12px 14px"}}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{},"p3":{"initial":{"rotate":0,"transformOrigin":"12px 14px"},"animate":{"rotate":[0,360],"transition":{"duration":1.8,"ease":"easeInOut"},"transformOrigin":"12px 14px"}}}},"component":"PrequelTimerIcon"};

export const meta = {"slug":"timer","name":"Timer","category":"Time","component":"PrequelTimerIcon","style":"outline"};

export function createPrequelTimerIcon(root, options = {}) {
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
