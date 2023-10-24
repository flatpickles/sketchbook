<script lang="ts">
    import ProjectDetailPanel from '../ProjectDetailPanel/ProjectDetailPanel.svelte';
    import ProjectViewer from './ProjectViewer.svelte';

    import type { ProjectTuple } from '$lib/base/ProjectLoading/ProjectLoader';
    import { settingsStore, stateStore } from '$lib/base/Util/AppState';
    import {
        PanelState,
        headerIconForPanelState,
        panelShown,
        toggledPanelState
    } from '$lib/base/Util/PanelState';
    import { MouseState } from '$lib/base/Util/MouseState';
    import { content } from '$config/content';

    export let projectTuple: ProjectTuple;

    // Right panel reactive state
    $: projectHasDetail =
        projectTuple.config.date !== undefined ||
        projectTuple.config.description !== undefined ||
        projectTuple.params.length > 0; // todo: incorporate presets, once implemented
    $: rightPanelAvailable =
        projectHasDetail && $settingsStore.projectDetailPanelState !== PanelState.Unavailable;
    $: rightPanelShown =
        rightPanelAvailable &&
        panelShown(
            $settingsStore.projectDetailPanelState,
            $stateStore.currentMouseState,
            MouseState.RightTrigger
        );
    $: rightPanelHeaderIcon = headerIconForPanelState($settingsStore.projectDetailPanelState);

    function toggleRightPanel(showClicked = false) {
        // Toggle from current state
        $settingsStore.projectDetailPanelState = toggledPanelState(
            $settingsStore.projectDetailPanelState
        );

        // If showClicked with PanelState.MouseUnpinnable, it's likely mouse movement isn't working
        // on this device; PanelState.MousePinned falls back to click-based toggling
        if (showClicked && $settingsStore.projectDetailPanelState === PanelState.MouseUnpinnable) {
            $settingsStore.projectDetailPanelState = PanelState.MousePinned;
        }

        // Clear the mouse state
        $stateStore.currentMouseState = MouseState.ClearedRight;
    }
</script>

<div class="project-viewer">
    <ProjectViewer
        project={projectTuple.project}
        staticMode={projectTuple.config.staticMode}
        containerResizing={!$settingsStore.overlayPanels && $stateStore.panelResizing}
        canvasSizeConfig={projectTuple.config.canvasSize}
        pixelRatioConfig={projectTuple.config.pixelRatio}
    />
</div>

{#if rightPanelAvailable}
    <div
        class="right-panel-wrapper"
        data-testid="right-panel-wrapper"
        class:closed={!rightPanelShown}
        class:overlaid={$settingsStore.overlayPanels}
    >
        <div
            class="panel right-panel"
            class:rightClosed={!rightPanelShown}
            class:overlaid={$settingsStore.overlayPanels}
        >
            <ProjectDetailPanel
                {projectTuple}
                headerButtonIcon={rightPanelHeaderIcon}
                on:headeraction={toggleRightPanel.bind(null, false)}
            />
        </div>
    </div>

    {#if $settingsStore.projectDetailPanelState !== PanelState.Static}
        <div
            class="right-show-wrapper"
            data-testid="show-button-wrapper"
            class:hidden={!$stateStore.panelShowButtonsVisible}
        >
            <div
                class="show-button"
                data-testid="right-show"
                class:hidden={rightPanelShown}
                on:click={toggleRightPanel.bind(null, true)}
                on:keypress={toggleRightPanel.bind(null, true)}
            >
                <i class={content.projectDetailIcon} />
            </div>
        </div>
    {/if}
{/if}

<style lang="scss">
    @use 'sass:math';
    @import './main-layout.scss';

    .project-viewer {
        flex-grow: 1;

        overflow: hidden;
        z-index: 0;
    }

    /* Right panel */

    .right-show-wrapper {
        @include show-button-wrapper;
        right: 0;
    }

    .right-panel-wrapper {
        @include panel-wrapper;
        right: 0;
    }
</style>
