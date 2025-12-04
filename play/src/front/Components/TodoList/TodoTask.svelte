<script lang="ts">
    import { TodoTaskInterface } from "@workadventure/shared-utils";
    import CheckIcon from "../Icons/CheckIcon.svelte";
    export let task: TodoTaskInterface;

    export let oddColor: string | boolean = "odd:bg-white/10";
    export let evenColor: string | boolean = "even:bg-white/5";

    let opendDescription = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="flex flex-col text-left my-2 p-2 box-border hover:bg-white/15 transition-all {oddColor ?? ''} {evenColor ??
        ''} rounded-md border {task.status === 'completed' ? 'bg-green-600/15' : ''}"
    class:cursor-pointer={task.status == "completed"}
    class:border-green-500={task.status === "completed"}
    on:click={() => (opendDescription = !opendDescription)}
>
    <p class="text-lg m-0 p-0 flex items-center gap-2" class:line-through={task.status === "completed" && !opendDescription}>
        {#if task.status === "completed"}
            <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white">
                <CheckIcon height="h-4" width="w-4" strokeColor="stroke-white" />
            </span>
        {/if}
        <span class="font-bold">{task.title}</span>
        {#if task.end}<span class="text-sm border border-gray-400 border-solid rounded-lg px-2"
                >{task.end.toLocaleDateString()}</span
            >{/if}
    </p>
    {#if task.status !== "completed"}
        {#if task.description}
            <p class="text-sm m-0 p-0 py-2">Description: {task.description}</p>
        {/if}
        {#if task.start}
            <p class="w-fit text-xs m-0 p-0 border border-gray-400 border-solid rounded-lg px-2">
                Due date: {task.start.toLocaleDateString()}
            </p>
        {/if}
        {#if task.end}
            <p class="w-fit text-xs m-0 p-0 border border-gray-400 border-solid rounded-lg px-2">
                Complete: {task.end.toLocaleDateString()}
            </p>
        {/if}
        {#if task.recurence}
            <p class="w-fit text-xs m-0 p-0 border border-gray-400 border-solid rounded-lg px-2">
                Repeat: {task.recurence}
            </p>
        {/if}
    {:else if task.description && opendDescription}
        <p class="text-sm m-0 p-0 py-2">Description: {task.description}</p>
        <p class="text-xs m-0 p-0 text-green-400">Completed</p>
    {/if}
</div>
