import { writable } from "svelte/store";

export type Role = "student" | "staff"; // staff = employer/financial aid officer

const role = writable<Role>("student");

export const roleStore = role;

export function toggleRole(): void {
    role.update((r) => (r === "student" ? "staff" : "student"));
}


