import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"bank","name":"Bank","category":"Finance","parts":[{"tag":"path","attrs":{"d":"M3 9l9-6 9 6H3Z"}},{"tag":"path","attrs":{"d":"M5 9v8M9.5 9v8M14.5 9v8M19 9v8"}},{"tag":"path","attrs":{"d":"M3 21h18"}},{"tag":"path","attrs":{"d":"M5 17h14"}}],"roles":["primary","primary","primary","primary"],"closed":[true,false,false,false],"draw":[false,true,false,false],"inside":[false,false,false,false],"hasClosed":true,"highlight":{"cx":8.4,"cy":4.68,"rx":1.2,"ry":0.7},"palette":{"color":{"primary":"oklch(0.56 0.1 225)","primaryDark":"oklch(0.78 0.08 225)","accent":"oklch(0.66 0.13 200)","accentDark":"oklch(0.8 0.1 200)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.06,1],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{"initial":{"pathLength":1,"opacity":1},"animate":{"pathLength":[0,1],"opacity":[0.35,1],"transition":{"duration":0.65,"ease":"easeInOut"}}},"p2":{},"p3":{}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,0.9,1.14,0.98,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"pathLength":1,"opacity":1},"animate":{"pathLength":[0,1],"opacity":[0.35,1],"transition":{"duration":0.8,"ease":"easeInOut"}}},"p2":{},"p3":{}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"pathLength":1,"opacity":1},"animate":{"pathLength":[1,0.15,1],"opacity":[1,0.6,1],"transition":{"duration":1.7,"ease":"easeInOut"}}},"p2":{},"p3":{}}},"component":"PrequelBankIcon"};

export const meta = {"slug":"bank","name":"Bank","category":"Finance","component":"PrequelBankIcon","style":"outline"};

export function createPrequelBankIcon(root, options = {}) {
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
