import { get, writable } from "svelte/store";
import { v4 as uuid } from "uuid";
import type { TodoListInterface, TodoTaskInterface } from "@workadventure/shared-utils";
import { isActivatedStore as todoListIsActivatedStore, isTodoListVisibleStore, todoListsStore } from "./TodoListStore";

let initialized = false;

// Expose last completed task to help the UI open the right panel/section
export const lastCompleted = writable<{ listId: string; title: string } | null>(null);

function makeTask(title: string, description: string): TodoTaskInterface {
	return {
		id: uuid(),
		title,
		description,
		status: "notStarted",
	};
}

export function initManagerTasks(): void {
	if (initialized) return;
	initialized = true;

	const current = get(todoListsStore);
	if (current.size > 0) {
		// Do not override an existing list
		return;
	}

	const tasks: TodoTaskInterface[] = [
		makeTask("Meet the Employee", "Start a conversation with Marisa."),
		makeTask("Assess Motivation", "Check the motivation badge below the character."),
		makeTask("Prioritize Work", "Choose options that reduce overload and clarify goals."),
		makeTask("Support Growth", "Offer mentoring/feedback to increase commitment."),
		makeTask("Celebrate Wins", "Adopt a weekly recognition practice."),
	];

	const list: TodoListInterface = {
		id: "manager-onboarding",
		title: "Manager Tasks",
		tasks,
	};

	const map = new Map<string, TodoListInterface>();
	map.set(list.id, list);
	todoListsStore.set(map);

	// Enable and show the todo list UI
	todoListIsActivatedStore.set(true);
	isTodoListVisibleStore.set(true);
}

export function completeManagerTask(title: string): void {
	const current = get(todoListsStore);
	if (current.size === 0) return;
	let changed = false;
	const updated = new Map(current);
	for (const [id, list] of updated.entries()) {
		const tasks = list.tasks.map((t) => {
			if (t.title === title && t.status !== "completed") {
				changed = true;
				return { ...t, status: "completed" as const };
			}
			return t;
		});
		if (changed) {
			updated.set(id, { ...list, tasks });
			break;
		}
	}
	if (changed) {
		todoListsStore.set(updated);
		// Ensure the list UI is visible
		isTodoListVisibleStore.set(true);
		// Remember what was just completed so UI can expand the right panel
		const first = [...updated.keys()][0];
		lastCompleted.set({ listId: first, title });
	}
}


