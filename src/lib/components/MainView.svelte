<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import ProjectViewer from '$lib/components/ProjectViewer.svelte';
    import ProjectDetailPanel from '$lib/components/ProjectDetailPanel.svelte';
    import ProjectListPanel from '$lib/components/ProjectListPanel.svelte';
    import SettingsPanel from './Settings/SettingsPanel.svelte';

    import { content } from '../../config/content';
    import { settingsStore, stateStore } from '$lib/base/Util/AppState';
    import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
    import type { ProjectConfig } from '$lib/base/ProjectConfig/ProjectConfig';
    import {
        PanelState,
        toggledPanelState,
        panelShown,
        headerIconForPanelState
    } from '$lib/base/Util/PanelState';
    import { MouseState, mouseStateTransition } from '$lib/base/Util/MouseState';

    export let projectConfigs: Record<string, ProjectConfig>;
    export let selectedProjectTuple: ProjectTuple;

    let panelMaxWidth: number;
    let panelResizing = false;
    let currentMouseState: MouseState = MouseState.NoTrigger;
    let viewer: ProjectViewer;

    // Left panel reactive state
    $: leftPanelAvailable = $stateStore.projectListState !== PanelState.Unavailable;
    $: leftPanelShown =
        leftPanelAvailable &&
        panelShown($stateStore.projectListState, currentMouseState, MouseState.LeftTrigger);
    $: leftPanelHeaderIcon = headerIconForPanelState($stateStore.projectListState);

    // Right panel reactive state
    $: projectHasDetail =
        selectedProjectTuple.config.date !== undefined ||
        selectedProjectTuple.config.description !== undefined ||
        selectedProjectTuple.params.length > 0; // todo: incorporate presets, once implemented
    $: rightPanelAvailable =
        projectHasDetail && $stateStore.projectDetailState !== PanelState.Unavailable;
    $: rightPanelShown =
        rightPanelAvailable &&
        panelShown($stateStore.projectDetailState, currentMouseState, MouseState.RightTrigger);
    $: rightPanelHeaderIcon = headerIconForPanelState($stateStore.projectDetailState);

    /* Event bindings */

    onMount(() => {
        // Mouse movement
        addEventListener('mousemove', mouseMoved);

        // Panel transitions
        const eventIsResizingContainer = (event: TransitionEvent): boolean => {
            return (
                !$settingsStore.overlayPanels &&
                event.target instanceof HTMLElement &&
                event.propertyName === 'width' &&
                (event.target.classList.contains('left-panel-wrapper') ||
                    event.target.classList.contains('right-panel-wrapper'))
            );
        };
        addEventListener('transitionstart', (event: TransitionEvent) => {
            if (eventIsResizingContainer(event)) panelResizing = true;
        });
        addEventListener('transitionend', (event: TransitionEvent) => {
            if (eventIsResizingContainer(event)) panelResizing = false;
        });
    });

    function toggleLeftPanel(showClicked = false) {
        // Toggle from current state
        $stateStore.projectListState = toggledPanelState($stateStore.projectListState);

        // If showClicked with PanelState.MouseUnpinnable, it's likely mouse movement isn't working
        // on this device; PanelState.MousePinned falls back to click-based toggling
        if (showClicked && $stateStore.projectListState === PanelState.MouseUnpinnable) {
            $stateStore.projectListState = PanelState.MousePinned;
        }

        // Clear the mouse state
        currentMouseState = MouseState.ClearedLeft;
    }

    function toggleRightPanel(showClicked = false) {
        // Toggle from current state
        $stateStore.projectDetailState = toggledPanelState($stateStore.projectDetailState);

        // If showClicked with PanelState.MouseUnpinnable, it's likely mouse movement isn't working
        // on this device; PanelState.MousePinned falls back to click-based toggling
        if (showClicked && $stateStore.projectDetailState === PanelState.MouseUnpinnable) {
            $stateStore.projectDetailState = PanelState.MousePinned;
        }

        // Clear the mouse state
        currentMouseState = MouseState.ClearedRight;
    }

    function mouseMoved(event: MouseEvent) {
        // Trigger with movement into trigger zone, untrigger with movement out of interaction zone
        const leftThresholds = {
            in: $settingsStore.panelMouseTriggerWidth,
            out: panelMaxWidth
        };
        const rightThresholds = {
            in: window.innerWidth - $settingsStore.panelMouseTriggerWidth,
            out: window.innerWidth - panelMaxWidth
        };

        // Update the mouse state
        currentMouseState = mouseStateTransition(
            currentMouseState,
            event.clientX,
            leftThresholds,
            rightThresholds
        );
    }

    function toggleSettings() {
        $stateStore.settingsPresented = !$stateStore.settingsPresented;
    }
</script>

<div class="main-wrapper" data-testid="main-wrapper">
    {#if leftPanelAvailable}
        <div
            class="left-panel-wrapper"
            data-testid="left-panel-wrapper"
            class:closed={!leftPanelShown}
            class:overlaid={$settingsStore.overlayPanels}
        >
            <div
                class="panel left-panel"
                class:leftClosed={!leftPanelShown}
                class:overlaid={$settingsStore.overlayPanels}
            >
                <ProjectListPanel
                    projects={projectConfigs}
                    selectedProjectKey={selectedProjectTuple.key}
                    headerButtonIcon={leftPanelHeaderIcon}
                    on:headeraction={toggleLeftPanel.bind(null, false)}
                    on:showsettings={toggleSettings}
                />
            </div>
        </div>
    {/if}

    <div class="project-viewer">
        <ProjectViewer
            project={selectedProjectTuple.project}
            containerResizing={panelResizing}
            bind:this={viewer}
        />
    </div>

    {#if rightPanelAvailable}
        <div
            class="right-panel-wrapper"
            data-testid="right-panel-wrapper"
            class:closed={!rightPanelShown}
            class:overlaid={$settingsStore.overlayPanels}
        >
            <div class="panel right-panel" class:overlaid={$settingsStore.overlayPanels}>
                <ProjectDetailPanel
                    projectTuple={selectedProjectTuple}
                    headerButtonIcon={rightPanelHeaderIcon}
                    on:headeraction={toggleRightPanel.bind(null, false)}
                    on:paramupdated={viewer.paramUpdated}
                />
            </div>
        </div>
    {/if}
</div>

{#if leftPanelAvailable && $stateStore.projectListState !== PanelState.Static}
    <div
        class="left-show"
        data-testid="left-show"
        class:hidden={leftPanelShown}
        on:click={toggleLeftPanel.bind(null, true)}
        on:keypress={toggleLeftPanel.bind(null, true)}
    >
        <i class={content.projectListIcon} />
    </div>
{/if}

{#if rightPanelAvailable && $stateStore.projectDetailState !== PanelState.Static}
    <div
        class="right-show"
        data-testid="right-show"
        class:hidden={rightPanelShown}
        on:click={toggleRightPanel.bind(null, true)}
        on:keypress={toggleRightPanel.bind(null, true)}
    >
        <i class={content.projectDetailIcon} />
    </div>
{/if}

{#if $stateStore.settingsPresented}
    <div
        class="settings-overlay"
        data-testid="settings-overlay"
        transition:fade={{ duration: 300 }}
    >
        <div class="settings-container">
            <SettingsPanel on:headeraction={toggleSettings} />
        </div>
    </div>
{/if}

<!-- Use this dummy to expose $panel-wrapper-width from SCSS below -->
<div
    class="panel-dummy"
    bind:clientWidth={panelMaxWidth}
    class:overlaid={$settingsStore.overlayPanels}
/>

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

        // Transition opacity
        opacity: 100%;
        transition: opacity $panel-show-button-animation-duration ease-in-out;
        transition-delay: calc($panel-animation-duration);
        &.hidden {
            opacity: 0;
            transition-delay: 0s;

            // Fade out quickly while panel slides over
            transition-duration: $panel-animation-duration;
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

    @mixin panel-wrapper {
        z-index: 2;

        // Enable panel min-height despite absolute inheritance:
        display: flex;
        flex-direction: column;
        height: 100vh;

        // Setup differently if overlaid
        position: relative;
        width: $panel-width;
        box-sizing: border-box;
        &.overlaid {
            position: absolute;
        }

        // Transition width
        transition: width $panel-animation-duration ease-in-out;
        &.closed {
            width: 0;
        }
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
        min-height: 100%;
        max-height: 100%;
        width: $panel-width;

        // Setup differently if overlaid
        &.overlaid {
            padding: $panel-edge-inset;
            min-height: $panel-min-height;
            &.left-panel {
                padding-right: 0;
            }
            &.right-panel {
                padding-left: 0;
            }
        }

        // Transition left (for left panel only)
        left: 0;
        transition: left $panel-animation-duration ease-in-out;
        &.leftClosed {
            // Align to the right side of a zero-width panel:
            left: calc(-1 * $panel-width);
            &.overlaid {
                left: calc(-1 * ($panel-edge-inset * 2 + $panel-width));
            }
        }
    }

    .panel-dummy {
        // Avoid displaying this dummy to the user
        position: absolute;
        z-index: -100;
        opacity: 0;

        // Setup differently if overlaid
        width: $panel-width;
        left: calc(-1 * $panel-width);
        &.overlaid {
            width: $panel-edge-inset * 2 + $panel-width;
            left: calc(-1 * ($panel-edge-inset * 2 + $panel-width));
        }
    }

    /* Settings */

    .settings-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: rgba(0, 0, 0, 0.5);
    }

    .settings-container {
        width: 400px;
        height: 400px;
        max-width: 100%;
        max-height: 100%;
        padding: $panel-edge-inset;
        box-sizing: border-box;
    }
</style>
