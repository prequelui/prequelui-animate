import { For, Show, createSignal, onCleanup } from "solid-js";
import { animate } from "motion";

export type AvatarGroupAvatar = {
  id?: string;
  name: string;
  src?: string;
  color?: string;
};

export type AvatarGroupProps = {
  avatars?: AvatarGroupAvatar[];
  invertOverlap?: boolean;
  tooltipSideOffset?: number;
  class?: string;
};

const fallbackAvatars: AvatarGroupAvatar[] = [
  { name: "Mina", color: "from-rose-300 to-orange-200" },
  { name: "Theo", color: "from-sky-300 to-indigo-200" },
  { name: "Iris", color: "from-emerald-300 to-lime-200" },
  { name: "Noé", color: "from-amber-300 to-pink-200" },
];

const avatarSpring = { type: "spring" as const, stiffness: 300, damping: 17 };
const popSpring = { type: "spring" as const, stiffness: 400, damping: 29 };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function AvatarGroup(props: AvatarGroupProps) {
  let root: HTMLDivElement | undefined;
  let tip: HTMLSpanElement | undefined;
  const [hovered, setHovered] = createSignal<number | null>(null);
  const [center, setCenter] = createSignal(0);
  const [showTip, setShowTip] = createSignal(false);
  const avatars = () => props.avatars ?? fallbackAvatars;
  let liftControls: Array<ReturnType<typeof animate>> = [];
  let tipControls: ReturnType<typeof animate> | undefined;

  const lift = () => {
    liftControls.forEach((control) => control.stop?.());
    liftControls = [];
    if (!root) return;
    const nodes = root.querySelectorAll<HTMLElement>("[data-avatar]");
    nodes.forEach((element, index) => {
      const up = hovered() === index && !reduce();
      liftControls.push(
        animate(
          element,
          { y: up ? "-30%" : "0%" },
          reduce() ? { duration: 0 } : avatarSpring,
        ),
      );
    });
  };

  const enter = (index: number, event: { currentTarget: EventTarget | null }) => {
    const element = event.currentTarget as HTMLElement | null;
    if (root && element) {
      const groupRect = root.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      setCenter(rect.left - groupRect.left + rect.width / 2);
    }

    if (hovered() !== index) {
      setHovered(index);
      lift();
    }

    if (showTip()) {
      if (tip && !reduce()) {
        tipControls?.stop?.();
        tipControls = animate(tip, { opacity: 1, scale: 1 }, { duration: 0.12 });
      }
      return;
    }
    setShowTip(true);
    queueMicrotask(() => {
      if (!tip) return;
      tipControls?.stop?.();
      if (reduce()) {
        tip.style.opacity = "1";
        return;
      }
      tip.style.opacity = "0";
      tipControls = animate(
        tip,
        { opacity: [0, 1], scale: [0.9, 1], filter: ["blur(4px)", "blur(0px)"] },
        popSpring,
      );
    });
  };

  const leaveGroup = () => {
    setHovered(null);
    lift();
    if (!tip) {
      setShowTip(false);
      return;
    }
    tipControls?.stop?.();
    if (reduce()) {
      setShowTip(false);
      return;
    }
    tipControls = animate(tip, { opacity: 0, scale: 0.95 }, { duration: 0.12 });
    tipControls.finished.then(() => {
      if (hovered() === null) setShowTip(false);
    });
  };

  onCleanup(() => {
    liftControls.forEach((control) => control.stop?.());
    tipControls?.stop?.();
  });

  return (
    <div
      ref={(node: HTMLDivElement) => (root = node)}
      data-slot="avatar-group"
      class={`relative inline-flex items-end ${props.class ?? ""}`}
      onPointerLeave={leaveGroup}
    >
      <div class="flex -space-x-3">
        <For each={avatars()}>
          {(avatar, index) => (
            <span
              data-avatar
              role="img"
              aria-label={avatar.name}
              tabIndex={0}
              style={{
                "z-index": props.invertOverlap ? 20 - index() : index(),
              }}
              class={`relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-gradient-to-br text-[13px] font-medium text-black/70 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${avatar.color || "from-rose-300 to-orange-200"}`}
              onPointerEnter={(event: PointerEvent) => enter(index(), event)}
              onFocus={(event: FocusEvent) => enter(index(), event)}
            >
              <Show
                when={avatar.src}
                fallback={avatar.name.slice(0, 1)}
              >
                <img src={avatar.src} alt="" class="size-full object-cover" />
              </Show>
            </span>
          )}
        </For>
      </div>

      <Show when={showTip()}>
        <span
          ref={(node: HTMLSpanElement) => (tip = node)}
          role="tooltip"
          style={{
            left: `${center()}px`,
            bottom: `calc(100% + ${props.tooltipSideOffset ?? 8}px)`,
            translate: "-50% 0",
            opacity: 0,
          }}
          class="pointer-events-none absolute z-30 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[13px] font-medium text-primary-foreground shadow-md"
        >
          {hovered() !== null ? avatars()[hovered()!]?.name : ""}
        </span>
      </Show>
    </div>
  );
}
