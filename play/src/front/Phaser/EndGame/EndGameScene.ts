import { ResizableScene } from "../Login/ResizableScene";
import { gameManager } from "../Game/GameManager";
import { showEndGameScene, hideEndGameScene } from "../../Stores/EndGameStore";

export const EndGameSceneName = "EndGameScene";

export class EndGameScene extends ResizableScene {
    constructor() {
        super({
            key: EndGameSceneName,
        });
    }

    preload() {}

    create() {
        // Show the end game summary UI
        showEndGameScene();

        if (gameManager.currentStartedRoom?.backgroundColor != undefined) {
            this.cameras.main.setBackgroundColor(gameManager.currentStartedRoom.backgroundColor);
        }
    }

    public onResize(): void {}

    update(time: number, delta: number): void {}

    public close(): void {
        hideEndGameScene();
        this.scene.sleep(EndGameSceneName);
        // Optionally restart or go back to intro
        // gameManager.goToStartingMap();
    }
}

