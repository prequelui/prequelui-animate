import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"bluetooth","name":"Bluetooth","category":"Connectivity","parts":[{"tag":"path","attrs":{"d":"M7 7l10 10-5 5V2l5 5L7 17"}}],"roles":["primary"],"closed":[false],"draw":[false],"inside":[false],"hasClosed":false,"highlight":null,"palette":{"color":{"primary":"oklch(0.64 0.12 195)","primaryDark":"oklch(0.8 0.1 195)","accent":"oklch(0.68 0.14 170)","accentDark":"oklch(0.8 0.12 170)"},"emoji":{"primary":"oklch(0.78 0.14 165)","secondary":"oklch(0.62 0.13 165)","accent":"oklch(0.74 0.13 232)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,18,0],"transition":{"duration":0.55,"ease":"easeInOut"}}},"p0":{}},"tap":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,180,360],"transition":{"duration":0.8,"ease":[0.22,1,0.36,1]}}},"p0":{}},"loop":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,360],"transition":{"duration":1.8,"ease":"easeInOut"}}},"p0":{}}},"component":"PrequelBluetoothIcon"};

export const meta = {"slug":"bluetooth","name":"Bluetooth","category":"Connectivity","component":"PrequelBluetoothIcon","style":"outline"};

export function createPrequelBluetoothIcon(root, options = {}) {
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
