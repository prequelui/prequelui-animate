import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"headphones","name":"Headphones","category":"Devices","parts":[{"tag":"path","attrs":{"d":"M4 14v-2a8 8 0 0 1 16 0v2"}},{"tag":"rect","attrs":{"x":3,"y":14,"width":4,"height":6,"rx":2}},{"tag":"rect","attrs":{"x":17,"y":14,"width":4,"height":6,"rx":2}}],"roles":["primary","primary","accent"],"closed":[false,true,true],"draw":[false,false,false],"inside":[false,false,false],"hasClosed":true,"highlight":{"cx":4.2,"cy":15.68,"rx":1.1,"ry":0.7},"palette":{"color":{"primary":"oklch(0.6 0.13 265)","primaryDark":"oklch(0.78 0.1 265)","accent":"oklch(0.7 0.15 285)","accentDark":"oklch(0.82 0.12 285)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.6 0.2 300)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p2":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}}},"tap":{"group":{"initial":{"y":0},"animate":{"y":[0,-6,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p2":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}}},"loop":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p2":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}}}},"component":"PrequelHeadphonesIcon"};

export const meta = {"slug":"headphones","name":"Headphones","category":"Devices","component":"PrequelHeadphonesIcon","style":"outline"};

export function createPrequelHeadphonesIcon(root, options = {}) {
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
