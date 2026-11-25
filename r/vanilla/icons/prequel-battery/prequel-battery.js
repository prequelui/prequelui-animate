import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"battery","name":"Battery","category":"Connectivity","parts":[{"tag":"rect","attrs":{"x":2,"y":7,"width":18,"height":10,"rx":2.5}},{"tag":"path","attrs":{"d":"M22 11v2"}},{"tag":"rect","attrs":{"x":5,"y":10,"width":4.5,"height":4,"rx":1}}],"roles":["primary","primary","accent"],"closed":[true,false,true],"draw":[false,false,false],"inside":[false,false,true],"hasClosed":true,"highlight":{"cx":7.4,"cy":9.8,"rx":2,"ry":1.04},"palette":{"color":{"primary":"oklch(0.64 0.12 195)","primaryDark":"oklch(0.8 0.1 195)","accent":"oklch(0.68 0.14 170)","accentDark":"oklch(0.8 0.12 170)"},"emoji":{"primary":"oklch(0.78 0.14 165)","secondary":"oklch(0.62 0.13 165)","accent":"oklch(0.74 0.13 232)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.05,1],"transition":{"duration":0.55,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{"initial":{"scaleY":1,"transformOrigin":"0% 50%"},"animate":{"scaleY":[0.65,1.05,1],"transition":{"duration":0.5,"ease":"easeOut"},"transformOrigin":"0% 50%"}}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.15,1],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{},"p2":{"initial":{"scaleY":1,"transformOrigin":"0% 50%"},"animate":{"scaleY":[0.4,1.08,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]},"transformOrigin":"0% 50%"}}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.6,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{"initial":{"scaleY":1,"transformOrigin":"0% 50%"},"animate":{"scaleY":[0.7,1.04,0.7],"transition":{"duration":1.5,"ease":"easeInOut"},"transformOrigin":"0% 50%"}}}},"component":"PrequelBatteryIcon"};

export const meta = {"slug":"battery","name":"Battery","category":"Connectivity","component":"PrequelBatteryIcon","style":"outline"};

export function createPrequelBatteryIcon(root, options = {}) {
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
