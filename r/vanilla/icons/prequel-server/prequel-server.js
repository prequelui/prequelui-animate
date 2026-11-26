import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"server","name":"Server","category":"Development","parts":[{"tag":"rect","attrs":{"x":3,"y":3,"width":18,"height":7,"rx":2}},{"tag":"rect","attrs":{"x":3,"y":14,"width":18,"height":7,"rx":2}},{"tag":"path","attrs":{"d":"M7 6.5h.01M7 17.5h.01"}},{"tag":"path","attrs":{"d":"M11 6.5h6M11 17.5h6"}}],"roles":["primary","accent","primary","primary"],"closed":[true,true,false,false],"draw":[false,false,false,false],"inside":[false,false,false,false],"hasClosed":true,"highlight":{"cx":8.4,"cy":4.96,"rx":1.4,"ry":0.73},"palette":{"color":{"primary":"oklch(0.58 0.16 275)","primaryDark":"oklch(0.77 0.13 275)","accent":"oklch(0.7 0.16 250)","accentDark":"oklch(0.82 0.13 250)"},"emoji":{"primary":"oklch(0.6 0.2 300)","secondary":"oklch(0.46 0.18 300)","accent":"oklch(0.78 0.14 165)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p1":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p2":{},"p3":{}},"tap":{"group":{"initial":{"y":0},"animate":{"y":[0,-6,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p0":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p1":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p2":{},"p3":{}},"loop":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p0":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p1":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p2":{},"p3":{}}},"component":"PrequelServerIcon"};

export const meta = {"slug":"server","name":"Server","category":"Development","component":"PrequelServerIcon","style":"outline"};

export function createPrequelServerIcon(root, options = {}) {
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
