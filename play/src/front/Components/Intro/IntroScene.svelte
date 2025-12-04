<script lang="ts">
    import type { Game } from "../../Phaser/Game/Game";
    import type { IntroScene } from "../../Phaser/Login/IntroScene";
    import { IntroSceneName } from "../../Phaser/Login/IntroScene";
    import { introSceneVisibleStore } from "../../Stores/IntroSceneStore";
    import { gameManager } from "../../Phaser/Game/GameManager";
    import bgMap from "../images/map-exemple.png";

    import { localUserStore } from "../../Connection/LocalUserStore";
    import { gameManager } from "../../Phaser/Game/GameManager";

    export let game: Game;

    const introScene = game.scene.getScene(IntroSceneName) as IntroScene;

    let playerName = gameManager.getPlayerName() || "";

    function proceed() {
        // Set the player name if provided, otherwise use default
        if (playerName.trim()) {
            gameManager.setPlayerName(playerName.trim());
            localUserStore.setName(playerName.trim());
        }
        introScene.continue();
    }

    function getBackgroundColor() {
        if (!gameManager.currentStartedRoom) return undefined;
        return gameManager.currentStartedRoom.backgroundColor;
    }
</script>

{#if $introSceneVisibleStore}
<section class="intro h-dvh flex items-center justify-center pointer-events-auto relative z-30">
    <div class="panel">
        <h1 class="title">Welcome to WorkAdventure</h1>
        <p class="lede">
            Explore a collaborative virtual world where your profile and choices shape your experience.
            You'll meet characters, make decisions, and see your motivation evolve over time.
        </p>
        <ul class="bullets">
            <li>Learn how the world works with a short guided intro.</li>
            <li>Pick a profile so NPCs react to your context.</li>
            <li>Jump into the map and start exploring together.</li>
        </ul>
        <div class="name-input">
            <label for="player-name">Your Name</label>
            <input
                id="player-name"
                type="text"
                placeholder="Enter your name"
                bind:value={playerName}
                on:keypress={(e) => {
                    if (e.key === "Enter") {
                        proceed();
                    }
                }}
                autofocus
            />
        </div>
        <div class="actions">
            <button class="primary" on:click={proceed} disabled={!playerName.trim()}>Get started</button>
        </div>
        <p class="hint">Press Enter to continue</p>
    </div>
    <div
        class="backdrop"
        style={getBackgroundColor() != undefined ? `background-color: ${getBackgroundColor()};` : ""}
    />
    <div class="bg" style="background-image: url('{bgMap}');" />
    </section>
{/if}

<style>
    .intro { width: 100%; }
    .panel {
        width: min(720px, calc(100% - 2rem));
        background: rgba(15, 23, 42, 0.92);
        color: #e5e7eb;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        padding: 28px;
        position: relative;
        z-index: 30;
        backdrop-filter: blur(6px);
    }
    .title {
        margin: 0 0 10px;
        font-size: 28px;
        color: #fff;
    }
    .lede {
        margin: 0 0 14px;
        font-size: 16px;
        color: rgba(255,255,255,0.85);
    }
    .bullets {
        margin: 0 0 18px 18px;
        padding: 0;
        font-size: 14px;
        color: rgba(255,255,255,0.85);
    }
    .name-input {
        margin: 18px 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .name-input label {
        font-size: 13px;
        color: rgba(255,255,255,0.85);
        font-weight: 500;
    }
    .name-input input {
        background: #111827;
        color: #fff;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 8px;
        padding: 10px 12px;
        font-size: 14px;
        width: 100%;
    }
    .name-input input:focus {
        outline: none;
        border-color: #22c55e;
    }
    .actions { display: flex; gap: 10px; }
    .primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .primary {
        background: #22c55e;
        color: #062a14;
        border: none;
        border-radius: 10px;
        padding: 10px 14px;
        font-weight: 700;
        cursor: pointer;
    }
    .primary:hover { filter: brightness(1.05); }
    .ghost {
        background: transparent;
        color: rgba(255,255,255,0.85);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 10px;
        padding: 10px 14px;
        font-weight: 600;
        cursor: pointer;
    }
    .ghost:hover { background: rgba(255,255,255,0.06); }
    .hint { margin: 10px 0 0; font-size: 12px; color: rgba(255,255,255,0.6); }
    .backdrop {
        position: absolute; left: 0; top: 0; width: 100%; height: 100%;
        z-index: 20; opacity: 0.7;
    }
    .bg {
        position: absolute; left: 0; top: 0; width: 100%; height: 100%;
        background-size: cover; background-position: center;
        z-index: 10; opacity: 0.35;
    }
</style>


