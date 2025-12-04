<script lang="ts">
    import type { Game } from "../Phaser/Game/Game";
    import { errorStore } from "../Stores/ErrorStore";
    import { errorScreenStore } from "../Stores/ErrorScreenStore";
    import { loginSceneVisibleStore } from "../Stores/LoginSceneStore";
    import { enableCameraSceneVisibilityStore } from "../Stores/MediaStore";
    import { selectCharacterSceneVisibleStore } from "../Stores/SelectCharacterStore";
    import { selectCompanionSceneVisibleStore } from "../Stores/SelectCompanionStore";
    import { gameSceneIsLoadedStore } from "../Stores/GameSceneStore";
    import { mapEditorModeStore } from "../Stores/MapEditorStore";
    import { refreshPromptStore } from "../Stores/RefreshPromptStore";
    import { forceRefreshChatStore } from "../Stores/ChatStore";
    import { loaderVisibleStore } from "../Stores/LoaderStore";
    import { showModalGlobalComminucationVisibilityStore } from "../Stores/ModalStore";
    import { isActivatedStore as calendarIsActivatedStore, isCalendarVisibleStore } from "../Stores/CalendarStore";
    import { isActivatedStore as todoListIsActivatedStore, isTodoListVisibleStore } from "../Stores/TodoListStore";
    import { draggingFile } from "../Stores/FileUploadStore";
    import ChatSidebar from "../Chat/ChatSidebar.svelte";
    import LoginScene from "./Login/LoginScene.svelte";
    import MainLayout from "./MainLayout.svelte";
    import SelectCompanionScene from "./SelectCompanion/SelectCompanionScene.svelte";
    import ErrorDialog from "./UI/ErrorDialog.svelte";
    import ErrorScreen from "./UI/ErrorScreen.svelte";
    import MapEditor from "./MapEditor/MapEditor.svelte";
    import RefreshPrompt from "./RefreshPrompt.svelte";
    import LoaderScene from "./Loader/LoaderScene.svelte";
    import EnableCameraScene from "./EnableCamera/EnableCameraScene.svelte";
    import bgMap from "./images/map-exemple.png";
    import defaultLoader from "./images/Workadventure.gif";
    import GlobalCommunicationModal from "./Modal/GlobalCommunicationModal.svelte";
    import Calendar from "./Calendar/Calendar.svelte";
    import TodoList from "./TodoList/TodoList.svelte";
    import FloatingUiPopupList from "./Util/FloatingUiPopupList.svelte";
    import MainModal from "./Modal/MainModal.svelte";
    import DroppingFileScene from "./DroppingFile/DroppingFileScene.svelte";
    import WokaScene from "./Woka/WokaScene.svelte";
    import DemographicsModal from "./Modal/DemographicsModal.svelte";
	import { introSceneVisibleStore } from "../Stores/IntroSceneStore";
	import { insightStatStore } from "../Stores/InsightStatStore";
	import IntroScene from "./Intro/IntroScene.svelte";
	// Initialize default manager tasks
	import { initManagerTasks } from "../Stores/ManagerTasks";
	initManagerTasks();
	import DialogueOverlay from "./Dialogue/DialogueOverlay.svelte";
	import InsightStat from "./Dialogue/InsightStat.svelte";

    export let game: Game;

    /**
     * When changing map from an exit on the current map, the Chat and the MainLayout are not really destroyed
     * due to an internal issue of Svelte, we use a #key directive to force the destruction of the components.
     * https://github.com/sveltejs/svelte/issues/5268
     */
</script>

<!-- Preload image loader TODO HUGO : Better way ? -->
<link rel="preload" as="image" href={bgMap} />
<link rel="preload" as="image" href={defaultLoader} />

{#if $loaderVisibleStore}
    <div class="bg-contrast">
        <LoaderScene />
    </div>
{/if}
{#if $draggingFile}
    <div>
        <DroppingFileScene />
    </div>
{/if}
{#if $errorScreenStore !== undefined}
    <div class="bg-contrast">
        <ErrorScreen />
    </div>
{:else if $errorStore.length > 0}
    <div class="bg-contrast">
        <ErrorDialog />
    </div>
{:else if $introSceneVisibleStore}
	<div class="h-dvh overflow-y-auto">
		<IntroScene {game} />
	</div>
{:else if $loginSceneVisibleStore}
    <div class="h-dvh overflow-y-auto">
        <LoginScene {game} />
    </div>
{:else if $selectCharacterSceneVisibleStore}
    <div class="absolute h-dvh">
        <WokaScene />
    </div>
{:else if $selectCompanionSceneVisibleStore}
    <div>
        <SelectCompanionScene {game} />
    </div>
{:else if $enableCameraSceneVisibilityStore}
    <div class="h-dvh overflow-y-auto">
        <EnableCameraScene {game} />
    </div>
{:else if $gameSceneIsLoadedStore && !$loaderVisibleStore}
    {#if $refreshPromptStore}
        <RefreshPrompt />
    {/if}
    <!-- Ask demographics once at the beginning of the session -->
    <DemographicsModal />
    {#key $forceRefreshChatStore}
        <ChatSidebar />
        {#if $mapEditorModeStore}
            <MapEditor />
        {/if}
        {#if $showModalGlobalComminucationVisibilityStore}
            <GlobalCommunicationModal />
        {/if}

        <MainLayout />
    {/key}
    <MainModal />
	<DialogueOverlay />
	{#if $insightStatStore}
		<div class="fixed bottom-20 right-4 z-[1600]">
			<InsightStat percent={$insightStatStore.percent} description={$insightStatStore.description} />
		</div>
	{/if}

    {#if $calendarIsActivatedStore && $isCalendarVisibleStore}
        <Calendar />
    {/if}
    {#if $todoListIsActivatedStore && $isTodoListVisibleStore}
        <TodoList />
    {/if}
	{#if $todoListIsActivatedStore && !$isTodoListVisibleStore}
		<button
			class="fixed right-3 bottom-3 z-[450] bg-secondary text-white rounded px-3 py-2 shadow pointer-events-auto"
			on:click={() => isTodoListVisibleStore.set(true)}
		>
			Tasks
		</button>
	{/if}
{/if}

<FloatingUiPopupList />
<!-- </div> -->
