import type { BotState } from "./types";

const ALLOWED: Record<BotState, BotState[]> = {
  idle: ["armed", "proposing", "applied"],
  armed: ["idle", "hovering", "thinking"],
  hovering: ["armed", "thinking", "idle"],
  thinking: ["proposing", "idle", "armed"],
  proposing: ["previewing", "tuning", "output", "thinking", "idle", "armed", "applied"],
  previewing: ["proposing", "tuning", "output", "idle", "armed", "applied"],
  tuning: ["previewing", "proposing", "output", "idle", "applied"],
  output: ["proposing", "previewing", "tuning", "idle", "applied"],
  applied: ["proposing", "output", "idle", "armed"],
};

export class StateMachine {
  private state: BotState = "idle";
  private listeners = new Set<(state: BotState) => void>();

  get(): BotState {
    return this.state;
  }

  can(next: BotState): boolean {
    return next === this.state || ALLOWED[this.state].includes(next);
  }

  set(next: BotState): boolean {
    if (!this.can(next)) return false;
    if (next === this.state) return true;
    this.state = next;
    for (const listener of this.listeners) listener(next);
    return true;
  }

  subscribe(listener: (state: BotState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

