let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .q-panel { animation: q-in 300ms cubic-bezier(0.25,0.1,0.35,1) both; }
    .q-option { animation: q-option 220ms cubic-bezier(0.25,0.1,0.35,1) both; }
    @keyframes q-in { from { opacity: 0; transform: translateY(24px); filter: blur(5px); } }
    @keyframes q-option { from { opacity: 0; transform: translateY(4px); } }
    @media (prefers-reduced-motion: reduce) { .q-panel, .q-option { animation: q-fade 150ms linear both; } @keyframes q-fade { from { opacity: 0; } } }`;
  document.head.appendChild(style);
}

export function createQuestionnaire(root, options = {}) {
  ensureStyles();
  const {
    questions = [
      { title: "How often do you ship motion?", options: ["Every day", "Every release", "Rarely"] },
      { title: "What slows you down the most?", options: ["Timing", "Accessibility", "Consistency"] },
    ],
    onComplete = undefined,
  } = options;
  const id = `questionnaire-${++uid}`;
  let step = 0;
  let answers = [];

  root.innerHTML = `<div class="w-[300px] rounded-xl border bg-background p-4" data-questionnaire="${id}"></div>`;
  const host = root.querySelector(`[data-questionnaire="${id}"]`);

  function render() {
    const done = step >= questions.length;
    const dots = questions
      .map((_, index) => {
        const width = index === Math.min(step, questions.length - 1) ? 20 : 6;
        return `<span class="h-1.5 rounded-full transition-all duration-300 ${index <= step ? "bg-foreground" : "bg-border"}" style="width:${width}px"></span>`;
      })
      .join("");
    const header = `<div class="flex items-center gap-1.5">${dots}
      <span class="ml-auto text-[13px] text-muted-foreground">${Math.min(step + 1, questions.length)} / ${questions.length}</span></div>`;
    if (done) {
      host.innerHTML = `${header}
        <div class="q-panel pt-4">
          <p class="flex items-center gap-2 text-[14px] font-medium">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><path d="M20 6 9 17l-5-5"/></svg>
            All set
          </p>
          <p class="mt-1 text-[13px] leading-5 text-muted-foreground">We picked ${answers.length} motion tokens for you.</p>
          <button type="button" data-restart class="mt-3 text-[13px] text-muted-foreground underline underline-offset-4 hover:text-foreground">Start again</button>
        </div>`;
      host.querySelector("[data-restart]").addEventListener("click", () => {
        step = 0;
        answers = [];
        render();
      });
      return;
    }
    const question = questions[step];
    host.innerHTML = `${header}
      <div class="q-panel pt-4">
        <p class="text-[14px] font-medium">${question.title}</p>
        <div class="mt-3 space-y-1.5">
          ${question.options
            .map(
              (option, index) => `<button type="button" data-option="${index}"
                class="q-option flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-[0.985]"
                style="animation-delay:${index * 30}ms">${option}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>`,
            )
            .join("")}
        </div>
      </div>`;
    host.querySelectorAll("[data-option]").forEach((node) => {
      node.addEventListener("click", () => {
        const option = question.options[Number(node.getAttribute("data-option"))];
        answers = [...answers, option];
        step += 1;
        if (answers.length >= questions.length) onComplete?.([...answers]);
        render();
      });
    });
  }
  render();

  return {
    get step() { return step; },
    get answers() { return [...answers]; },
    destroy() {
      root.innerHTML = "";
    },
  };
}
