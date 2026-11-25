// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindPrequelIcon, renderIcon } from "./prequel-icon-core";

const spec = {"slug":"user","name":"User","category":"People","parts":[{"tag":"circle","attrs":{"cx":12,"cy":8,"r":4}},{"tag":"path","attrs":{"d":"M5 21a7 7 0 0 1 14 0"}}],"roles":["primary","primary"],"closed":[true,false],"draw":[false,false],"inside":[false,false],"hasClosed":true,"highlight":{"cx":10.4,"cy":6.24,"rx":1.28,"ry":0.7},"palette":{"color":{"primary":"oklch(0.64 0.16 355)","primaryDark":"oklch(0.81 0.12 355)","accent":"oklch(0.72 0.14 20)","accentDark":"oklch(0.84 0.11 20)"},"emoji":{"primary":"oklch(0.68 0.2 27)","secondary":"oklch(0.54 0.19 25)","accent":"oklch(0.62 0.22 350)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{}},"tap":{"group":{"initial":{"y":0},"animate":{"y":[0,-6,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{}},"loop":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p0":{},"p1":{}}},"component":"PrequelUserIcon"};

export function PrequelUserIcon(props) {
  let host;

  const view = () =>
    renderIcon(spec, {
      size: props.size ?? 28,
      variant: props.variant ?? "outline",
      weight: props.weight ?? "regular",
      className: props.class ?? "",
      label: props.label ?? "",
    });

  onMount(() => {
    const controller = bindPrequelIcon(host, spec, () => ({
      speed: props.speed ?? 1,
      tempo: props.tempo ?? 1,
      delay: props.delay ?? 0,
      loop: props.loop ?? false,
      animate: props.animate ?? false,
      animateOnHover: props.animateOnHover ?? true,
      animateOnTap: props.animateOnTap ?? true,
      animateOnView: props.animateOnView ?? false,
      animateOnViewOnce: props.animateOnViewOnce ?? true,
      animation: props.animation ?? "hover",
    }));
    onCleanup(() => controller.destroy());
  });

  return (
    <span
      ref={host}
      data-slot="prequel-icon-host"
      style={{ display: "contents" }}
      innerHTML={view()}
    />
  );
}
