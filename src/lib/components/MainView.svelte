<script lang="ts">
    import ProjectViewer from '$lib/components/ProjectViewer.svelte';
    import ProjectDetailPanel from '$lib/components/ProjectDetailPanel.svelte';
    import ProjectListPanel from '$lib/components/ProjectListPanel.svelte';
    import { content } from '../../config/content';

    import { settingsStore, stateStore } from '$lib/base/Util/AppState';
    import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
    import type { ProjectConfig } from '$lib/base/ProjectConfig/ProjectConfig';
    import { PanelState } from '$lib/base/Util/ConfigTypes';
    import { onMount } from 'svelte';

    export let projectConfigs: Record<string, ProjectConfig>;
    export let selectedProjectTuple: ProjectTuple;

    enum MouseState {
        LeftTrigger = 'leftTrigger',
        ClearedLeft = 'clearedLeft',
        NoTrigger = 'noTrigger',
        ClearedRight = 'clearedRight',
        RightTrigger = 'rightTrigger'
    }

    let currentMouse: MouseState = MouseState.NoTrigger;
    let panelMaxWidth: number;

    $: leftPanelShown = panelShown(
        $stateStore.projectListState,
        currentMouse,
        MouseState.LeftTrigger
    );
    $: rightPanelShown = panelShown(
        $stateStore.projectDetailState,
        currentMouse,
        MouseState.RightTrigger
    );
    $: leftPanelHeaderIcon = headerIconForPanelState($stateStore.projectListState);
    $: rightPanelHeaderIcon = headerIconForPanelState($stateStore.projectDetailState);

    onMount(() => {
        addEventListener('mousemove', mouseMoved);
    });

    function panelShown(panelState: PanelState, mouseState: MouseState, mouseTest: MouseState) {
        const explicitlyVisible = [
            PanelState.Visible,
            PanelState.Static,
            PanelState.MousePinned
        ].includes(panelState);
        const mouseShowable = [PanelState.MousePinnable, PanelState.MouseUnpinnable].includes(
            panelState
        );
        return explicitlyVisible || (mouseShowable && mouseState === mouseTest);
    }

    function headerIconForPanelState(state: PanelState) {
        switch (state) {
            case PanelState.Visible:
                return 'fa-close';
            case PanelState.Hidden:
                return 'fa-close';
            case PanelState.MousePinned:
                return 'fa-close';
            case PanelState.MousePinnable:
                return 'fa-plus';
            default:
                return undefined;
        }
    }

    function toggleState(state: PanelState) {
        switch (state) {
            case PanelState.Visible:
                return PanelState.Hidden;
            case PanelState.Hidden:
                return PanelState.Visible;
            case PanelState.MousePinnable:
                return PanelState.MousePinned;
            case PanelState.MousePinned:
                return PanelState.MousePinnable;
            default:
                return state;
        }
    }

    function toggleLeftPanel(showClicked = false) {
        // Toggle from current state
        $stateStore.projectListState = toggleState($stateStore.projectListState);

        // If showClicked with PanelState.MouseUnpinnable, it's likely mouse movement isn't working
        // on this device; PanelState.MousePinned falls back to click-based toggling
        if (showClicked && $stateStore.projectListState === PanelState.MouseUnpinnable) {
            $stateStore.projectListState = PanelState.MousePinned;
        }

        // Clear the mouse state
        currentMouse = MouseState.ClearedLeft;
    }

    function toggleRightPanel(showClicked = false) {
        // Toggle from current state
        $stateStore.projectDetailState = toggleState($stateStore.projectDetailState);

        // If showClicked with PanelState.MouseUnpinnable, it's likely mouse movement isn't working
        // on this device; PanelState.MousePinned falls back to click-based toggling
        if (showClicked && $stateStore.projectDetailState === PanelState.MouseUnpinnable) {
            $stateStore.projectDetailState = PanelState.MousePinned;
        }

        // Clear the mouse state
        currentMouse = MouseState.ClearedRight;
    }

    function mouseMoved(event: MouseEvent) {
        // Trigger with movement into trigger zone, untrigger with movement out of interaction zone
        const leftThresholds = {
            in: $settingsStore.panelMouseTriggerWidth,
            out: panelMaxWidth
        };
        const rightThresholds = {
            in: document.body.clientWidth - $settingsStore.panelMouseTriggerWidth,
            out: document.body.clientWidth - panelMaxWidth
        };

        // Apply ins & outs based on current mouse state
        if (currentMouse === MouseState.NoTrigger) {
            // Trigger with movement into left/right trigger zones
            if (event.clientX < leftThresholds.in) currentMouse = MouseState.LeftTrigger;
            else if (event.clientX > rightThresholds.in) currentMouse = MouseState.RightTrigger;
        } else if (currentMouse === MouseState.LeftTrigger) {
            // Untrigger with movement out of left interaction zone
            if (event.clientX > leftThresholds.out) currentMouse = MouseState.NoTrigger;
        } else if (currentMouse === MouseState.RightTrigger) {
            // Untrigger with movement out of right interaction zone
            if (event.clientX < rightThresholds.out) currentMouse = MouseState.NoTrigger;
        } else if (currentMouse == MouseState.ClearedLeft) {
            // Untrigger with movement out of left trigger zone after clearing
            if (event.clientX > leftThresholds.in) currentMouse = MouseState.NoTrigger;
        } else if (currentMouse == MouseState.ClearedRight) {
            // Untrigger with movement out of right trigger zone after clearing
            if (event.clientX < rightThresholds.in) currentMouse = MouseState.NoTrigger;
        }
    }
</script>

<div class="main-wrapper">
    <div class="left-panel-wrapper" class:closed={!leftPanelShown}>
        <div class="panel" class:leftClosed={!leftPanelShown}>
            <ProjectListPanel
                projects={projectConfigs}
                selectedProjectKey={selectedProjectTuple.key}
                headerButtonIcon={leftPanelHeaderIcon}
                on:headeraction={toggleLeftPanel.bind(null, false)}
            />
        </div>
    </div>
    <div class="project-viewer">
        <ProjectViewer project={selectedProjectTuple.project} />
    </div>
    <div class="right-panel-wrapper" class:closed={!rightPanelShown}>
        <div class="panel">
            <ProjectDetailPanel
                projectTuple={selectedProjectTuple}
                headerButtonIcon={rightPanelHeaderIcon}
                on:headeraction={toggleRightPanel.bind(null, false)}
            />
        </div>
    </div>
</div>

{#if ![PanelState.Unavailable, PanelState.Static].includes($stateStore.projectListState)}
    <div
        class="left-show"
        class:hidden={leftPanelShown}
        on:click={toggleLeftPanel.bind(null, true)}
        on:keypress={toggleLeftPanel.bind(null, true)}
    >
        <i class={content.projectListIcon} />
    </div>
{/if}

{#if ![PanelState.Unavailable, PanelState.Static].includes($stateStore.projectDetailState)}
    <div
        class="right-show"
        class:hidden={rightPanelShown}
        on:click={toggleRightPanel.bind(null, true)}
        on:keypress={toggleRightPanel.bind(null, true)}
    >
        <i class={content.projectDetailIcon} />
    </div>
{/if}

<!-- Use this dummy to expose $panel-wrapper-width from SCSS below -->
<div class="panel-dummy" bind:clientWidth={panelMaxWidth} />

<style lang="scss">
    .main-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .project-viewer {
        flex-grow: 1;

        overflow: hidden;
        z-index: 0;
    }

    /* Show buttons */

    @mixin show-button {
        @include panel-show-button;
        position: absolute;
        top: 0;
        z-index: 1;
        cursor: pointer;

        // Transition opacity (with +0.1s buffer)
        opacity: 100%;
        transition: opacity $panel-show-button-animation-duration ease-in-out;
        transition-delay: calc($panel-animation-duration + 0.1s);
        &.hidden {
            opacity: 0;
            transition-delay: 0.1s;
        }
    }

    .left-show {
        @include show-button;
        left: 0;
    }

    .right-show {
        @include show-button;
        right: 0;
    }

    /* Panels */

    // To animate panel wrapper width changes, we need to set width explicitly
    $panel-wrapper-width: if($overlay-panels, $panel-edge-inset * 2, 0) + $panel-width;

    @mixin panel-wrapper {
        position: if($overlay-panels, absolute, relative);
        z-index: 2;

        // Transition width
        width: $panel-wrapper-width;
        transition: width $panel-animation-duration ease-in-out;
        &.closed {
            width: 0;
        }

        // Enable panel min-height despite absolute inheritance:
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .left-panel-wrapper {
        @include panel-wrapper;
        left: 0;
    }

    .right-panel-wrapper {
        @include panel-wrapper;
        right: 0;
    }

    .panel {
        position: relative;
        padding: if($overlay-panels, $panel-edge-inset, 0);
        min-height: if($overlay-panels, $panel-min-height, 100%);
        max-height: 100%;

        // Transition left (for left panel only)
        left: 0;
        transition: left $panel-animation-duration ease-in-out;
        &.leftClosed {
            // Align to the right side of a zero-width panel:
            left: calc(-1 * $panel-wrapper-width);
        }
    }

    .panel-dummy {
        // We'll use clientWidth to expose this value
        width: $panel-wrapper-width;

        // Avoid displaying this dummy to the user
        position: absolute;
        left: calc(-1 * $panel-wrapper-width);
        z-index: -100;
        opacity: 0;
    }
</style>
