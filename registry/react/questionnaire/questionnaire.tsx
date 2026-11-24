"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type QuestionnaireStep = {
  title: string;
  options: string[];
};

export type QuestionnaireProps = {
  questions?: QuestionnaireStep[];
  onComplete?: (answers: string[]) => void;
  className?: string;
};

const FALLBACK: QuestionnaireStep[] = [
  { title: "How often do you ship motion?", options: ["Every day", "Every release", "Rarely"] },
  { title: "What slows you down the most?", options: ["Timing", "Accessibility", "Consistency"] },
];

const panelIn = { duration: 0.3, ease: [0.25, 0.1, 0.35, 1] } as const;
const panelOut = { duration: 0.15, ease: [0, 0, 0.58, 1] } as const;
const resize = { duration: 0.45, ease: [0.4, 0, 0.1, 1] } as const;

export function Questionnaire({
  questions = FALLBACK,
  onComplete,
  className,
}: QuestionnaireProps) {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<string[]>([]);
  const reduce = useReducedMotion();
  const done = step >= questions.length;

  const choose = (option: string) => {
    const next = [...answers, option];
    setAnswers(next);
    setStep((current) => current + 1);
    if (next.length >= questions.length) onComplete?.(next);
  };

  return (
    <motion.div
      layout
      transition={reduce ? { duration: 0 } : resize}
      className={cn("w-[300px] rounded-xl border bg-background p-4", className)}
    >
      <div className="flex items-center gap-1.5">
        {questions.map((_, index) => (
          <motion.span
            key={index}
            animate={{ width: index === Math.min(step, questions.length - 1) ? 20 : 6 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
            className={cn("h-1.5 rounded-full", index <= step ? "bg-foreground" : "bg-border")}
          />
        ))}
        <span className="ml-auto text-[13px] text-muted-foreground">
          {Math.min(step + 1, questions.length)} / {questions.length}
        </span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={reduce ? { duration: 0 } : panelIn}
            className="pt-4"
          >
            <p className="flex items-center gap-2 text-[14px] font-medium">
              <Check className="size-4" /> All set
            </p>
            <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
              We picked {answers.length} motion tokens for you.
            </p>
            <button
              type="button"
              onClick={() => {
                setAnswers([]);
                setStep(0);
              }}
              className="mt-3 text-[13px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Start again
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(5px)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: -24, filter: "blur(5px)", transition: panelOut }
            }
            transition={reduce ? { duration: 0.2 } : panelIn}
            className="pt-4"
          >
            <p className="text-[14px] font-medium">{questions[step]?.title}</p>
            <div className="mt-3 space-y-1.5">
              {questions[step]?.options.map((option, index) => (
                <motion.button
                  key={option}
                  type="button"
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: index * 0.03 }}
                  whileTap={reduce ? undefined : { scale: 0.985 }}
                  onClick={() => choose(option)}
                  className="flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {option}
                  <ChevronRight className="size-3.5" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
