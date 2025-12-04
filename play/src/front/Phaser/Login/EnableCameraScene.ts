import { gameManager } from "../Game/GameManager";
import { enableCameraSceneVisibilityStore } from "../../Stores/MediaStore";
import { analyticsClient } from "../../Administration/AnalyticsClient";
import { ResizableScene } from "./ResizableScene";
import { DISABLE_CAMERA } from "../../Enum/EnvironmentVariable";

export const EnableCameraSceneName = "EnableCameraScene";

export class EnableCameraScene extends ResizableScene {
    constructor() {
        super({
            key: EnableCameraSceneName,
        });
    }

    preload() {}

    create() {
        // If camera is globally disabled, skip the enable camera scene entirely
        if (DISABLE_CAMERA) {
            if (gameManager.currentStartedRoom.backgroundColor != undefined) {
                this.cameras.main.setBackgroundColor(gameManager.currentStartedRoom.backgroundColor);
            }
            this.scene.sleep(EnableCameraSceneName);
            gameManager.goToStartingMap();
            return;
        }

        // Event listeners are valid for the lifetime of the Phaser scene and will be garbage collected when the object is destroyed
        /* eslint-disable listeners/no-missing-remove-event-listener, listeners/no-inline-function-event-listener */
        this.input.keyboard?.on("keyup-ENTER", () => {
            this.login();
        });

        enableCameraSceneVisibilityStore.showEnableCameraScene();

        if (gameManager.currentStartedRoom.backgroundColor != undefined) {
            this.cameras.main.setBackgroundColor(gameManager.currentStartedRoom.backgroundColor);
        }
    }

    public onResize(): void {}

    update(time: number, delta: number): void {}

    public login(): void {
        analyticsClient.validationVideo();

        enableCameraSceneVisibilityStore.hideEnableCameraScene();

        this.scene.sleep(EnableCameraSceneName);
        gameManager.goToStartingMap();
    }
}
