import { writable } from "svelte/store";

export const isEndGameVisible = writable(false);

export function showEndGameScene(): void {
    isEndGameVisible.set(true);
}

export function hideEndGameScene(): void {
    isEndGameVisible.set(false);
}

// Track game start time
export const gameStartTime = writable<number | null>(null);

export function setGameStartTime(): void {
    gameStartTime.set(Date.now());
}

