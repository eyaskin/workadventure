import { writable } from "svelte/store";

export interface InsightStatData {
    percent: number;
    description: string;
}

const store = writable<InsightStatData | null>(null);

export const insightStatStore = store;

export function showInsightStat(percent: number, description: string) {
    store.set({ percent, description });
    // Auto-hide after 6 seconds
    setTimeout(() => {
        store.set(null);
    }, 6000);
}

export function hideInsightStat() {
    store.set(null);
}
