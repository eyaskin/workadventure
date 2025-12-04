<script lang="ts">
    import { demographicsCompleteStore, setDemographics, type Demographics } from "../../Stores/DemographicsStore";
    import { onDestroy } from "svelte";

	// Role is fixed to "student" (no student/employee toggle)
	let role: Demographics["role"] = "student";
    let maritalStatus: Demographics["maritalStatus"] = "single";
    let gender: Demographics["gender"] = "notsay";
    let ageGroup: Demographics["ageGroup"] = "lt22";
    let pronouns: Demographics["pronouns"] = "prefer-not-say";

    let visible = true;
    const unsub = demographicsCompleteStore.subscribe((done) => {
        if (done) visible = false;
    });
    onDestroy(() => unsub());

    function submit() {
        const payload: Demographics = {
            role,
            maritalStatus,
            gender,
            ageGroup,
            pronouns,
        };
        setDemographics(payload);
        visible = false;
    }
</script>

{#if visible}
<div class="modal-backdrop">
    <div class="modal">
        <h2 class="title">Choose Your Profile</h2>
        <p class="subtitle">These choices shape the context of your motivation/attrition journey.</p>

        <div class="grid">
            <label>
                <span>Marital status</span>
                <select bind:value={maritalStatus}>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="other">Other</option>
                </select>
            </label>
            <label>
                <span>Gender</span>
                <select bind:value={gender}>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="nonbinary">Non-binary</option>
                    <option value="notsay">Prefer not to say</option>
                </select>
            </label>
            <label>
                <span>Age group</span>
                <select bind:value={ageGroup}>
                    <option value="lt22">Under 22</option>
                    <option value="22to24">22–24</option>
                    <option value="25plus">25+</option>
                </select>
            </label>
            <label>
                <span>Pronouns</span>
                <select bind:value={pronouns}>
                    <option value="she/her">She/Her</option>
                    <option value="he/him">He/Him</option>
                    <option value="they/them">They/Them</option>
                    <option value="she/they">She/They</option>
                    <option value="he/they">He/They</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-say">Prefer not to say</option>
                </select>
            </label>
        </div>

        <div class="actions">
            <button class="primary" on:click={submit}>Start</button>
        </div>
    </div>
</div>
{/if}

<style>
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 2000; }
    .modal { width: 680px; max-width: calc(100% - 2rem); background: #0f172a; color: #fff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.35); padding: 20px; }
    .title { margin: 0; font-size: 20px; }
    .subtitle { margin: 6px 0 16px; color: rgba(255,255,255,0.75); font-size: 13px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .span-2 { grid-column: span 2; }
    label { display: flex; flex-direction: column; gap: 6px; font-size: 12px; }
    select { background: #111827; color: #fff; border: 1px solid #374151; border-radius: 8px; padding: 8px 10px; font-size: 14px; }
    .actions { display: flex; justify-content: flex-end; margin-top: 16px; }
    .primary { background: #22c55e; color: #062a14; border: none; border-radius: 8px; padding: 10px 14px; font-weight: 600; cursor: pointer; }
    .primary:hover { filter: brightness(1.05); }
</style>


