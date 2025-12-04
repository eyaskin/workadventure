<script lang="ts">
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { todoListsStore } from "../../Stores/TodoListStore";
    import { motivationScoreStore } from "../../Stores/MotivationStore";
    import { hideEndGameScene } from "../../Stores/EndGameStore";

    let tasksCompleted = 0;
    let totalTasks = 0;
    let finalMotivation = 0;

    onMount(() => {
        // Calculate summary stats
        const todoLists = get(todoListsStore);
        for (const list of todoLists.values()) {
            totalTasks += list.tasks.length;
            tasksCompleted += list.tasks.filter((t) => t.status === "completed").length;
        }
        finalMotivation = get(motivationScoreStore);
    });

    function handleClose() {
        hideEndGameScene();
        // Optionally reload the page to restart
        window.location.reload();
    }
</script>

<div class="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center">
    <div class="bg-contrast rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl">
        <h1 class="text-3xl font-bold text-white mb-6 text-center">Game Summary</h1>

        <div class="space-y-6">
            <!-- Tasks Completed -->
            <div class="bg-white/10 rounded-lg p-4">
                <h2 class="text-xl font-semibold text-white mb-2">Tasks Completed</h2>
                <div class="flex items-center gap-4">
                    <div class="flex-1">
                        <div class="w-full bg-white/20 rounded-full h-4">
                            <div
                                class="bg-green-500 h-4 rounded-full transition-all duration-500"
                                style="width: {totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0}%"
                            ></div>
                        </div>
                    </div>
                    <span class="text-white font-bold text-lg">
                        {tasksCompleted} / {totalTasks}
                    </span>
                </div>
            </div>

            <!-- Final Motivation Score -->
            <div class="bg-white/10 rounded-lg p-4">
                <h2 class="text-xl font-semibold text-white mb-2">Final Motivation Score</h2>
                <div class="flex items-center gap-4">
                    <div class="flex-1">
                        <div class="w-full bg-white/20 rounded-full h-6">
                            <div
                                class="h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                                style="width: {finalMotivation}%; background: {finalMotivation < 33 ? '#ef4444' : finalMotivation < 67 ? '#f59e0b' : '#10b981'};"
                            >
                                <span class="text-white text-xs font-bold">{finalMotivation}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Performance Message -->
            <div class="bg-white/10 rounded-lg p-4">
                <h2 class="text-xl font-semibold text-white mb-2">Performance</h2>
                <p class="text-white/80">
                    {#if tasksCompleted === totalTasks && finalMotivation >= 70}
                        Excellent work! You've completed all tasks and maintained high motivation. You're ready to be a great manager!
                    {:else if tasksCompleted >= totalTasks * 0.6 && finalMotivation >= 50}
                        Good job! You've made solid progress. Keep practicing to improve your management skills.
                    {:else}
                        You've learned valuable lessons about management. Review the tasks and try again to improve your score!
                    {/if}
                </p>
            </div>

            <!-- Close Button -->
            <div class="flex justify-center pt-4">
                <button
                    on:click={handleClose}
                    class="bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
</div>

