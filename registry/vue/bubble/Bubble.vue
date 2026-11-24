<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  interactive: { type: Boolean, default: false },
  speed: { type: Number, default: 1 },
  paused: { type: Boolean, default: false },
  colors: { type: Object, default: undefined },
});

const DEFAULTS = {
  first: "#6366f1",
  second: "#a855f7",
  third: "#22d3ee",
  fourth: "#f472b6",
  fifth: "#f59e0b",
  sixth: "#34d399",
};

let bubbleCount = 0;

const root = ref(null);
const blobOne = ref(null);
const blobTwo = ref(null);
const blobThree = ref(null);
const blobFour = ref(null);
const blobFive = ref(null);
const blobSix = ref(null);
const inView = ref(false);
const pageVisible = ref(true);
const reduceMotion = ref(false);
const filterId = `bubble-goo-${++bubbleCount}`;

const palette = computed(() => ({ ...DEFAULTS, ...(props.colors ?? {}) }));
const rate = computed(() => Math.max(0.2, props.speed));
const playing = computed(
  () => inView.value && pageVisible.value && !reduceMotion.value && !props.paused,
);

const filterStyle = computed(() => ({
  filter: `url(#${filterId}) blur(38px)`,
}));

const rootStyle = computed(() => ({
  "--bubble-first": palette.value.first,
  "--bubble-second": palette.value.second,
  "--bubble-third": palette.value.third,
  "--bubble-fourth": palette.value.fourth,
  "--bubble-fifth": palette.value.fifth,
  "--bubble-sixth": palette.value.sixth,
}));

const firstBackground = computed(
  () =>
    `radial-gradient(circle at center, color-mix(in oklab, var(--bubble-first) 80%, transparent) 0%, transparent 58%)`,
);
const secondBackground = computed(
  () =>
    `radial-gradient(circle at center, color-mix(in oklab, var(--bubble-second) 80%, transparent) 0%, transparent 58%)`,
);
const thirdBackground = computed(
  () =>
    `radial-gradient(circle at center, color-mix(in oklab, var(--bubble-third) 80%, transparent) 0%, transparent 58%)`,
);
const fourthBackground = computed(
  () =>
    `radial-gradient(circle at center, color-mix(in oklab, var(--bubble-fourth) 80%, transparent) 0%, transparent 58%)`,
);
const fifthBackground = computed(
  () =>
    `radial-gradient(circle at center, color-mix(in oklab, var(--bubble-fifth) 80%, transparent) 0%, transparent 58%)`,
);
const sixthBackground = computed(
  () =>
    `radial-gradient(circle at center, color-mix(in oklab, var(--bubble-sixth) 80%, transparent) 0%, transparent 58%)`,
);

let observer;
let media;
let onVisibility;
let onMedia;
let loops = [];
let follow;
const pointer = { x: 0, y: 0 };

function stopLoops() {
  for (const controls of loops) controls?.stop?.();
  loops = [];
}

function snap(element, values) {
  if (!element) return;
  loops.push(animate(element, values, { duration: 0 }));
}

function play() {
  stopLoops();
  if (!playing.value) {
    snap(blobOne.value, { y: -46 });
    snap(blobTwo.value, { rotate: reduceMotion.value ? 90 : 0 });
    snap(blobThree.value, { rotate: reduceMotion.value ? 180 : 0 });
    snap(blobFour.value, { x: -46 });
    snap(blobFive.value, { rotate: reduceMotion.value ? 45 : 0 });
    return;
  }

  const speed = rate.value;
  loops.push(
    animate(
      blobOne.value,
      { y: [-46, 46, -46] },
      {
        duration: 30 / speed,
        ease: "easeInOut",
        repeat: Infinity,
      },
    ),
  );
  loops.push(
    animate(
      blobTwo.value,
      { rotate: [0, 360] },
      {
        duration: 20 / speed,
        ease: "linear",
        repeat: Infinity,
      },
    ),
  );
  loops.push(
    animate(
      blobThree.value,
      { rotate: [0, -360] },
      {
        duration: 40 / speed,
        ease: "linear",
        repeat: Infinity,
      },
    ),
  );
  loops.push(
    animate(
      blobFour.value,
      { x: [-46, 46, -46] },
      {
        duration: 40 / speed,
        ease: "easeInOut",
        repeat: Infinity,
      },
    ),
  );
  loops.push(
    animate(
      blobFive.value,
      { rotate: [0, 360] },
      {
        duration: 24 / speed,
        ease: "linear",
        repeat: Infinity,
      },
    ),
  );
}

function applyPointer() {
  if (!blobSix.value) return;
  blobSix.value.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
}

function onPointerMove(event) {
  if (!props.interactive || reduceMotion.value || !root.value) return;
  const rect = root.value.getBoundingClientRect();
  const x = event.clientX - (rect.left + rect.width / 2);
  const y = event.clientY - (rect.top + rect.height / 2);
  follow?.stop?.();
  follow = animate(
    pointer,
    { x, y },
    {
      type: "spring",
      stiffness: 100,
      damping: 20,
      onUpdate: applyPointer,
    },
  );
}

watch(playing, play);
watch(rate, () => {
  if (playing.value) play();
});

onMounted(() => {
  media = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotion.value = media.matches;
  onMedia = () => {
    reduceMotion.value = media.matches;
  };
  media.addEventListener?.("change", onMedia);

  pageVisible.value = document.visibilityState !== "hidden";
  onVisibility = () => {
    pageVisible.value = document.visibilityState !== "hidden";
  };
  document.addEventListener("visibilitychange", onVisibility);

  observer = new IntersectionObserver(
    (entries) => {
      inView.value = entries.some((entry) => entry.isIntersecting);
    },
    { threshold: 0 },
  );
  if (root.value) observer.observe(root.value);

  play();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  if (onVisibility) document.removeEventListener("visibilitychange", onVisibility);
  media?.removeEventListener?.("change", onMedia);
  stopLoops();
  follow?.stop?.();
});
</script>

<template>
  <div
    ref="root"
    data-slot="bubble-background"
    class="relative size-full overflow-hidden bg-[linear-gradient(135deg,#12111a,#1d1830_45%,#0f172a)]"
    :style="rootStyle"
    @pointermove="onPointerMove"
  >
    <svg aria-hidden="true" class="pointer-events-none absolute size-0">
      <defs>
        <filter :id="filterId">
          <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0"
      :style="filterStyle"
    >
      <div
        ref="blobOne"
        class="absolute left-[8%] top-[8%] size-[86%] rounded-full opacity-90 mix-blend-hard-light"
        :style="{ background: firstBackground, willChange: 'transform' }"
      />
      <div
        ref="blobTwo"
        class="absolute inset-0 flex origin-[calc(50%-380px)] items-center justify-center"
      >
        <div
          class="size-[80%] rounded-full mix-blend-hard-light"
          :style="{ background: secondBackground }"
        />
      </div>
      <div
        ref="blobThree"
        class="absolute inset-0 flex origin-[calc(50%+400px)] items-center justify-center"
      >
        <div
          class="absolute left-[calc(50%-460px)] top-[calc(50%+180px)] size-[80%] rounded-full mix-blend-hard-light"
          :style="{ background: thirdBackground }"
        />
      </div>
      <div
        ref="blobFour"
        class="absolute left-[8%] top-[8%] size-[86%] rounded-full opacity-70 mix-blend-hard-light"
        :style="{ background: fourthBackground, willChange: 'transform' }"
      />
      <div
        ref="blobFive"
        class="absolute inset-0 flex origin-[calc(50%-760px)_calc(50%+180px)] items-center justify-center"
      >
        <div
          class="absolute left-1/2 top-1/2 size-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 mix-blend-hard-light"
          :style="{ background: fifthBackground }"
        />
      </div>
      <div
        v-if="interactive"
        ref="blobSix"
        class="absolute size-full rounded-full opacity-70 mix-blend-hard-light"
        :style="{ background: sixthBackground, willChange: 'transform' }"
      />
    </div>

    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(4,4,8,0.55))]"
    />
    <slot />
  </div>
</template>
