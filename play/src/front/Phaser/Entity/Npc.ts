import CancelablePromise from "cancelable-promise";
import { PositionMessage_Direction, SayMessageType } from "@workadventure/messages";
import type { GameScene } from "../Game/GameScene";
import { Character } from "./Character";
import { CompanionTextureError } from "../../Exception/CompanionTextureError";
import { setCurrentSpeaker, startConversation } from "../../Dialogue/DialogueStore";

export class Npc extends Character {
    private messages: string[];
    private messageIndex = 0;

    constructor(
        scene: GameScene,
        x: number,
        y: number,
        texturesPromise: CancelablePromise<string[]>,
        name: string,
        messages: string[]
    ) {
        super(
            scene,
            x,
            y,
            texturesPromise,
            name,
            PositionMessage_Direction.DOWN,
            false,
            1,
            true,
            new CancelablePromise<string>((_, reject) => reject(new CompanionTextureError("No companion")))
        );

        this.messages = messages;

        this.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.pointerOverOutline(0x7dbd00);
        });
        this.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.pointerOutOutline();
        });
        this.on(Phaser.Input.Events.POINTER_DOWN, () => {
            // Register a speaker so dialogue lines appear as speech bubbles above this NPC
            setCurrentSpeaker((text: string) => this.say(text, SayMessageType.SpeechBubble));
            startConversation(this.playerName);
        });
    }

    talk() {
        if (this.messages.length === 0) return;
        const message = this.messages[this.messageIndex % this.messages.length];
        this.messageIndex++;
        this.say(message, SayMessageType.SpeechBubble);
    }
}


