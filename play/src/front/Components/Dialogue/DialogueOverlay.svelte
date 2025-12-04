<script lang="ts">
    import { onDestroy } from "svelte";
    import { activeDialogueStore, choose, closeDialogue, dialogueVisibleStore } from "../../Dialogue/DialogueStore";
    let visible = false;
    let npcName = "";
    let choices: { text: string }[] = [];

    const unsubVisible = dialogueVisibleStore.subscribe((v) => (visible = v));
    const unsubActive = activeDialogueStore.subscribe((v) => {
        npcName = v?.npcName ?? "";
        choices = v?.node.choices ?? [];
    });
    onDestroy(() => {
        unsubVisible();
        unsubActive();
    });

    function onChoice(i: number) {
        choose(i);
    }
</script>

{#if visible}
<div class="dlg-wrap">
    <div class="dlg">
        <div class="dlg-header">
            <div class="dlg-title">{npcName}</div>
            <button class="dlg-close" on:click={closeDialogue}>×</button>
        </div>
        <!-- NPC line now shown as an in-world speech bubble over the NPC -->
        <div class="dlg-sub">You (Evelyn): choose what to say</div>
        <div class="dlg-choices">
            {#each choices as c, i (i)}
                <button class="dlg-choice" on:click={() => onChoice(i)}>Evelyn: {c.text}</button>
            {/each}
        </div>
    </div>
    <div class="dlg-tip">You are speaking as the manager (Evelyn). Your response affects motivation.</div>
    </div>
{/if}

<style>
    .dlg-wrap { position: fixed; inset: 0; display: flex; align-items: flex-end; justify-content: center; background: rgba(0,0,0,0.35); z-index: 1500; }
    .dlg { width: 860px; max-width: calc(100vw - 2rem); margin: 1rem; background: #0b1220; color: #fff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.35); padding: 16px; overflow-x: hidden; }
    .dlg-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .dlg-title { font-weight: 700; letter-spacing: .02em; }
    .dlg-close { background: transparent; color: #9ca3af; border: none; font-size: 18px; cursor: pointer; }
    .dlg-line { margin-top: 8px; margin-bottom: 12px; color: #e5e7eb; }
    .dlg-sub { margin: 6px 0 10px; font-size: 12px; color: rgba(255,255,255,0.75); }
    .dlg-choices { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 8px; max-width: 100%; }
    .dlg-choice { background: #1f2937; color: #fff; border: 1px solid #374151; border-radius: 10px; padding: 10px 12px; text-align: left; cursor: pointer; word-wrap: break-word; overflow-wrap: break-word; }
    .dlg-choice:hover { background: #243042; }
    .dlg-tip { margin: 0 1rem 1rem; color: rgba(255,255,255,0.7); font-size: 12px; }
</style>


