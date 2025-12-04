import { derived, writable } from "svelte/store";

export type Role = "student" | "employee";
export type MaritalStatus = "single" | "married" | "other";
export type Gender = "female" | "male" | "nonbinary" | "notsay";
export type AgeGroup = "lt22" | "22to24" | "25plus";
export type Pronouns = "she/her" | "he/him" | "they/them" | "she/they" | "he/they" | "other" | "prefer-not-say";

export interface Demographics {
    role: Role;
    maritalStatus: MaritalStatus;
    gender: Gender;
    ageGroup: AgeGroup;
    pronouns: Pronouns;
    overtime?: "never" | "sometimes" | "often"; // employee only
}

const STORAGE_KEY = "wa-demographics";

function load(): Demographics | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Demographics) : null;
    } catch {
        return null;
    }
}

function save(value: Demographics | null) {
    if (value === null) {
        localStorage.removeItem(STORAGE_KEY);
        return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

const initial = load();
const store = writable<Demographics | null>(initial);

// Save to localStorage whenever demographics change
const unsubscribe = store.subscribe((v) => save(v));
// Note: We intentionally keep this subscription active for the app lifetime
// to persist demographics changes. This is not a memory leak.

export const demographicsStore = store;
export const demographicsCompleteStore = derived(demographicsStore, (v) => v !== null);

export function setDemographics(value: Demographics) {
    store.set(value);
}

export function clearDemographics() {
    store.set(null);
}


