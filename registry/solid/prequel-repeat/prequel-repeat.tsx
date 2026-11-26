// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindPrequelIcon, renderIcon } from "./prequel-icon-core";

const spec = {"slug":"repeat","name":"Repeat","category":"Arrows","parts":[{"tag":"path","attrs":{"d":"M17 3l3 3-3 3"}},{"tag":"path","attrs":{"d":"M4 11V9a4 4 0 0 1 4-4h12"}},{"tag":"path","attrs":{"d":"M7 21l-3-3 3-3"}},{"tag":"path","attrs":{"d":"M20 13v2a4 4 0 0 1-4 4H4"}}],"roles":["primary","primary","primary","primary"],"closed":[false,false,false,false],"draw":[false,false,false,false],"inside":[false,false,false,false],"hasClosed":false,"highlight":null,"palette":{"color":{"primary":"oklch(0.6 0.15 250)","primaryDark":"oklch(0.78 0.12 250)","accent":"oklch(0.7 0.16 235)","accentDark":"oklch(0.82 0.13 235)"},"emoji":{"primary":"oklch(0.72 0.19 48)","secondary":"oklch(0.58 0.18 45)","accent":"oklch(0.74 0.13 232)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"x":0},"animate":{"x":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{"initial":{"x":0},"animate":{"x":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p1":{},"p2":{"initial":{"x":0},"animate":{"x":[0,-1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p3":{}},"tap":{"group":{"initial":{"x":0},"animate":{"x":[0,5,0],"transition":{"duration":0.6,"ease":[0.22,1,0.36,1]}}},"p0":{"initial":{"x":0},"animate":{"x":[0,3,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p1":{},"p2":{"initial":{"x":0},"animate":{"x":[0,-3,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p3":{}},"loop":{"group":{"initial":{"x":0},"animate":{"x":[0,2.4,0],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{"initial":{"x":0},"animate":{"x":[0,1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p1":{},"p2":{"initial":{"x":0},"animate":{"x":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p3":{}}},"component":"PrequelRepeatIcon"};

export function PrequelRepeatIcon(props) {
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
