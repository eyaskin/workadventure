import { ResizableScene } from "./ResizableScene";
import { gameManager } from "../Game/GameManager";
import { hideIntroScene, showIntroScene } from "../../Stores/IntroSceneStore";
import { localUserStore } from "../../Connection/LocalUserStore";

export const IntroSceneName = "IntroScene";

export class IntroScene extends ResizableScene {
	constructor() {
		super({
			key: IntroSceneName,
		});
	}

	preload() {}

	create() {
		/* eslint-disable listeners/no-missing-remove-event-listener, listeners/no-inline-function-event-listener */
		this.input.keyboard?.on("keyup-ENTER", () => {
			this.continue();
		});

		showIntroScene();

		if (gameManager.currentStartedRoom?.backgroundColor != undefined) {
			this.cameras.main.setBackgroundColor(gameManager.currentStartedRoom.backgroundColor);
		}
	}

	public continue(): void {
		// Ensure a default name exists to bypass login entirely
		// (name should already be set from the UI component, but fallback to default if not)
		if (!gameManager.getPlayerName()) {
			const defaultName = `Manager ${Math.floor(1000 + Math.random() * 9000)}`;
			gameManager.setPlayerName(defaultName);
			localUserStore.setName(defaultName);
		}

		hideIntroScene();
		this.scene.sleep(IntroSceneName);
		// Jump straight to the map
		gameManager.goToStartingMap();
	}

	public onResize(): void {}

	update(time: number, delta: number): void {}
}


