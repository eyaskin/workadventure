<script lang="ts">
    import { onDestroy } from "svelte";
    import { motivationPercentStore } from "../../Stores/MotivationStore";
    let percent = 0;
    const unsubscribe = motivationPercentStore.subscribe((v) => (percent = v));
    onDestroy(() => { unsubscribe(); });
</script>

<div class="fixed left-3 top-3 z-[1000] select-none">
    <div class="rounded bg-black/60 text-white px-3 py-2 shadow">
        <div class="text-xs uppercase tracking-wide opacity-90">Objective</div>
        <div class="text-sm mb-2">Stay enrolled/employed by keeping motivation up</div>
        <div class="text-xs mb-1">Motivation: {percent}%</div>
        <div class="w-64 h-3 bg-white/15 rounded">
            <div
                class="h-3 rounded"
                style={`width:${percent}%;background:linear-gradient(90deg,#34d399,#059669)`}
            />
        </div>
    </div>
    <div class="text-[10px] mt-1 text-white/80">Tip: Talk to NPCs; choices can affect motivation.</div>
</div>

<style>
    .fixed { position: fixed; }
    .left-3 { left: 0.75rem; }
    .top-3 { top: 0.75rem; }
    .z-\[1000\] { z-index: 1000; }
    .rounded { border-radius: 0.5rem; }
    .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-1 { margin-bottom: 0.25rem; }
    .w-64 { width: 16rem; }
    .h-3 { height: 0.75rem; }
    .text-xs { font-size: 0.75rem; }
    .text-sm { font-size: 0.875rem; }
    .uppercase { text-transform: uppercase; }
    .tracking-wide { letter-spacing: 0.05em; }
    .opacity-90 { opacity: 0.9; }
    .select-none { user-select: none; }
    .shadow { box-shadow: 0 4px 12px rgba(0,0,0,0.25); }
    .bg-black\/60 { background: rgba(0,0,0,0.6); }
    .bg-white\/15 { background: rgba(255,255,255,0.15); }
    .text-white { color: #fff; }
    .text-white\/80 { color: rgba(255,255,255,0.8); }
    .mt-1 { margin-top: 0.25rem; }
    .btn { background: #1f2937; color: #fff; border: 1px solid #374151; border-radius: 6px; padding: 2px 6px; margin-left: 6px; font-size: 11px; cursor: pointer; }
    .btn:hover { background: #243042; }
</style>


