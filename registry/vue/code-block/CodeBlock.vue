<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Check, Copy } from "@lucide/vue";

const props = defineProps({
  code: { type: String, required: true },
  filename: { type: String, default: "example.ts" },
  typing: { type: Boolean, default: true },
});

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const length = ref(props.typing && !reduce() ? 0 : props.code.length);
const copied = ref(false);
let typingTimer;
let copyTimer;

function start() {
  clearInterval(typingTimer);
  if (!props.typing || reduce()) {
    length.value = props.code.length;
    return;
  }
  length.value = 0;
  typingTimer = setInterval(() => {
    if (length.value >= props.code.length) {
      clearInterval(typingTimer);
      return;
    }
    length.value += 1;
  }, 14);
}

watch(() => props.code, start);
onMounted(start);
onBeforeUnmount(() => {
  clearInterval(typingTimer);
  clearTimeout(copyTimer);
});

const shown = computed(() => props.code.slice(0, length.value));

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code);
  } catch {
    const area = document.createElement("textarea");
    area.value = props.code;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  copied.value = true;
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => (copied.value = false), 2000);
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border bg-code">
    <div class="flex items-center justify-between border-b px-4 py-2">
      <span class="font-mono text-[13px] text-muted-foreground">{{ filename }}</span>
      <button type="button" :aria-label="copied ? 'Copied' : 'Copy code'" class="relative flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground" @click="copy">
        <Transition name="copy" mode="out-in">
          <Check v-if="copied" class="size-3.5" />
          <Copy v-else class="size-3.5" />
        </Transition>
      </button>
    </div>
    <pre class="overflow-auto p-4 font-mono text-[13px] leading-6"><code>{{ shown }}<span v-if="length < code.length" class="animate-pulse">▍</span></code></pre>
  </div>
</template>

<style>
.copy-enter-active, .copy-leave-active { transition: opacity 150ms cubic-bezier(0.23, 1, 0.32, 1), transform 150ms cubic-bezier(0.23, 1, 0.32, 1), filter 150ms; }
.copy-enter-from, .copy-leave-to { opacity: 0; transform: scale(0.5); filter: blur(2px); }
</style>
