import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"folder-open","name":"Folder Open","category":"Files","parts":[{"tag":"path","attrs":{"d":"M3 18V6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v3"}},{"tag":"path","attrs":{"d":"M3 10h15l3 8H6l-3-8Z"}},{"tag":"path","attrs":{"d":"M7 13h9"}}],"roles":["primary","primary","primary"],"closed":[false,true,false],"draw":[true,false,false],"inside":[false,false,true],"hasClosed":true,"highlight":{"cx":8.4,"cy":12.24,"rx":1.6,"ry":0.83},"palette":{"color":{"primary":"oklch(0.62 0.13 230)","primaryDark":"oklch(0.8 0.1 230)","accent":"oklch(0.7 0.14 205)","accentDark":"oklch(0.82 0.11 205)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.78 0.14 165)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.06,1],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{"initial":{"pathLength":1,"opacity":1},"animate":{"pathLength":[0,1],"opacity":[0.35,1],"transition":{"duration":0.65,"ease":"easeInOut"}}},"p1":{"initial":{"y":0},"animate":{"y":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p2":{}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,0.9,1.14,0.98,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p0":{"initial":{"pathLength":1,"opacity":1},"animate":{"pathLength":[0,1],"opacity":[0.35,1],"transition":{"duration":0.8,"ease":"easeInOut"}}},"p1":{"initial":{"y":0},"animate":{"y":[0,3,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p2":{}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{"initial":{"pathLength":1,"opacity":1},"animate":{"pathLength":[1,0.15,1],"opacity":[1,0.6,1],"transition":{"duration":1.7,"ease":"easeInOut"}}},"p1":{"initial":{"y":0},"animate":{"y":[0,1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p2":{}}},"component":"PrequelFolderOpenIcon"};

export const meta = {"slug":"folder-open","name":"Folder Open","category":"Files","component":"PrequelFolderOpenIcon","style":"outline"};

export function createPrequelFolderOpenIcon(root, options = {}) {
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
