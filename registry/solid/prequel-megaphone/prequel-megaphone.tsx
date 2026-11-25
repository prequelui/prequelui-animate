// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindPrequelIcon, renderIcon } from "./prequel-icon-core";

const spec = {"slug":"megaphone","name":"Megaphone","category":"Notifications","parts":[{"tag":"path","attrs":{"d":"M4 10v4l3 1 8 5V4L7 9l-3 1Z"}},{"tag":"path","attrs":{"d":"M15 8a4 4 0 0 1 0 8"}},{"tag":"path","attrs":{"d":"M7 15v4a2 2 0 0 0 4 0v-2"}}],"roles":["primary","primary","primary"],"closed":[true,false,false],"draw":[false,false,false],"inside":[false,false,false],"hasClosed":true,"highlight":{"cx":7.3,"cy":8.48,"rx":1.76,"ry":0.92},"palette":{"color":{"primary":"oklch(0.68 0.17 50)","primaryDark":"oklch(0.83 0.13 50)","accent":"oklch(0.62 0.18 25)","accentDark":"oklch(0.78 0.14 25)"},"emoji":{"primary":"oklch(0.68 0.2 27)","secondary":"oklch(0.54 0.19 25)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-6,5,-3,0],"transition":{"duration":0.6,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut"}}},"p2":{}},"tap":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-14,12,-8,4,0],"transition":{"duration":0.95,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p2":{}},"loop":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-4,4,0],"transition":{"duration":1.6,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p2":{}}},"component":"PrequelMegaphoneIcon"};

export function PrequelMegaphoneIcon(props) {
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
