import { writable } from "svelte/store";

export const introSceneVisibleStore = writable<boolean>(false);
export function showIntroScene() {
	introSceneVisibleStore.set(true);
}
export function hideIntroScene() {
	introSceneVisibleStore.set(false);
}


