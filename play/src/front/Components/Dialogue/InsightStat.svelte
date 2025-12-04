<script lang="ts">
    export let title: string = "Impact";
    export let percent: number = 35;
    export let description: string =
        "Misgendering erodes trust — about 35% of misgendered employees quit or consider quitting.";
</script>

<div class="stat-card">
    <div class="hdr">{title}</div>
    <div class="row">
        <div class="percent">{percent}%</div>
        <div class="bar-wrap">
            <div class="bar">
                <div class="fill" style={`width:${Math.max(0, Math.min(100, percent))}%;`} />
            </div>
            <div class="axis">
                <span>0%</span><span>50%</span><span>100%</span>
            </div>
        </div>
    </div>
    <div class="desc">{description}</div>
</div>

<style>
    .stat-card {
        background: #0b1220;
        color: #e5e7eb;
        border: 1px solid #263145;
        border-radius: 12px;
        padding: 12px;
        width: 320px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    }
    .hdr {
        font-weight: 700;
        font-size: 14px;
        margin-bottom: 8px;
    }
    .row {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-bottom: 8px;
    }
    .percent {
        font-size: 28px;
        font-weight: 800;
        color: #f87171;
        min-width: 72px;
        text-align: right;
    }
    .bar-wrap { flex: 1; }
    .bar {
        background: #1f2937;
        border: 1px solid #374151;
        height: 16px;
        border-radius: 999px;
        overflow: hidden;
    }
    .fill {
        height: 100%;
        background: linear-gradient(90deg,#f87171,#ef4444);
    }
    .axis {
        margin-top: 4px;
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: #9ca3af;
    }
    .desc {
        font-size: 12px;
        color: rgba(255,255,255,0.8);
    }
</style>


