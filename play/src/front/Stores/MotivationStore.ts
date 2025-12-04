import { derived, writable } from "svelte/store";

// Motivation score from 0 to 100. The "objective" is to keep it above 0.
const score = writable<number>(50);

export const motivationScoreStore = score;

export function increaseMotivation(amount: number = 5): void {
    score.update((v) => clamp(v + amount));
}

export function decreaseMotivation(amount: number = 5): void {
    score.update((v) => clamp(v - amount));
}

export const motivationPercentStore = derived(motivationScoreStore, (v) => clamp(v));

function clamp(v: number): number {
    if (v < 0) return 0;
    if (v > 100) return 100;
    return v;
}


