<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import ProjectListPanel from '$lib/components/ProjectListPanel/ProjectListPanel.svelte';
    import SettingsPanel from '../SettingsPanel/SettingsPanel.svelte';

    import { content } from '$config/content';
    import { settingsStore, stateStore } from '$lib/base/Util/AppState';
    import type { ProjectConfig } from '$lib/base/ConfigModels/ProjectConfig';
    import {
        PanelState,
        toggledPanelState,
        panelShown,
        headerIconForPanelState
    } from '$lib/base/Util/PanelState';
    import { MouseState, mouseStateTransition } from '$lib/base/Util/MouseState';

    export let projectConfigs: Record<string, ProjectConfig>;
    export let selectedProjectKey: string;

    // Maximum width of panels, for mouse interactivity (state maintained in stateStore)
    let panelMaxWidth: number;

    // UI activity timeout; show panel buttons when active (state maintained in stateStore)
    let uiActiveTimeout: ReturnType<typeof setTimeout>;

    // Left panel reactive state
    $: leftPanelAvailable = $settingsStore.projectListPanelState !== PanelState.Unavailable;
    $: leftPanelShown =
        leftPanelAvailable &&
        panelShown(
            $settingsStore.projectListPanelState,
            $stateStore.currentMouseState,
            MouseState.LeftTrigger
        );
    $: leftPanelHeaderIcon = headerIconForPanelState($settingsStore.projectListPanelState);

    /* Events -> app state (state maintained in settingsStore & stateStore) */

    onMount(() => {
        // Mouse movement
        addEventListener('mousemove', mouseMoved);
        uiActivated();

        // Panel transitions
        const eventIsResizingContainer = (event: TransitionEvent): boolean => {
            return (
                event.target instanceof HTMLElement &&
                event.propertyName === 'width' &&
                (event.target.classList.contains('left-panel-wrapper') ||
                    event.target.classList.contains('right-panel-wrapper'))
            );
        };
        addEventListener('transitionstart', (event: TransitionEvent) => {
            if (eventIsResizingContainer(event)) {
                $stateStore.panelResizing = true;
                uiActivated();
            }
        });
        addEventListener('transitionend', (event: TransitionEvent) => {
            if (eventIsResizingContainer(event)) {
                setTimeout(() => {
                    // Set this on the next event loop (in case project has already updated)
                    $stateStore.panelResizing = false;
                }, 0);
                uiActivated();
            }
        });
    });

    onDestroy(() => {
        // Reset state to reasonable defaults upon destroy
        if (uiActiveTimeout) clearTimeout(uiActiveTimeout);
        $stateStore.currentMouseState = MouseState.NoTrigger;
        $stateStore.panelResizing = false;
        $stateStore.panelShowButtonsVisible = true;
        $stateStore.settingsPresented = false;
    });

    function toggleLeftPanel(showClicked = false) {
        // Toggle from current state
        $settingsStore.projectListPanelState = toggledPanelState(
            $settingsStore.projectListPanelState
        );

        // If showClicked with PanelState.MouseUnpinnable, it's likely mouse movement isn't working
        // on this device; PanelState.MousePinned falls back to click-based toggling
        if (showClicked && $settingsStore.projectListPanelState === PanelState.MouseUnpinnable) {
            $settingsStore.projectListPanelState = PanelState.MousePinned;
        }

        // Clear the mouse state
        $stateStore.currentMouseState = MouseState.ClearedLeft;
    }

    function mouseMoved(event: MouseEvent) {
        uiActivated();

        // Trigger with movement into trigger zone, untrigger with movement out of interaction zone
        const leftThresholds = {
            in: $settingsStore.panelMouseTriggerWidth,
            out: panelMaxWidth + $settingsStore.panelMouseTriggerWidth
        };
        const rightThresholds = {
            in: window.innerWidth - $settingsStore.panelMouseTriggerWidth,
            out: window.innerWidth - panelMaxWidth - $settingsStore.panelMouseTriggerWidth
        };

        // Update the mouse state
        $stateStore.currentMouseState = mouseStateTransition(
            $stateStore.currentMouseState,
            event.clientX,
            leftThresholds,
            rightThresholds
        );
    }

    // Called when the mouse moves, or the UI is otherwise activated
    function uiActivated() {
        if (uiActiveTimeout) clearTimeout(uiActiveTimeout);
        $stateStore.panelShowButtonsVisible = true;

        // Start a new timeout for deactivation
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const enableDeactivation =
            $settingsStore.hidePanelButtonsTimeout != undefined && !isTouchDevice;
        if (enableDeactivation) {
            uiActiveTimeout = setTimeout(() => {
                $stateStore.panelShowButtonsVisible = false;
            }, $settingsStore.hidePanelButtonsTimeout);
        }
    }

    function toggleSettings() {
        $stateStore.settingsPresented = !$stateStore.settingsPresented;
    }

    function settingsOverlayClicked(event: MouseEvent | KeyboardEvent) {
        // Don't toggle settings if the click was on the settings panel itself
        if (event.target instanceof HTMLElement && event.target.closest('.settings-container')) {
            return;
        }
        $stateStore.settingsPresented = false;
    }
</script>

<div class="main-wrapper" data-testid="main-wrapper">
    {#if leftPanelAvailable}
        {#if $settingsStore.projectListPanelState !== PanelState.Static}
            <div
                class="left-show-wrapper"
                data-testid="show-button-wrapper"
                class:hidden={!$stateStore.panelShowButtonsVisible}
            >
                <div
                    class="show-button"
                    data-testid="left-show"
                    class:hidden={leftPanelShown}
                    on:click={toggleLeftPanel.bind(null, true)}
                    on:keypress={toggleLeftPanel.bind(null, true)}
                >
                    <i class={content.projectListIcon} />
                </div>
            </div>
        {/if}

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
                    {selectedProjectKey}
                    headerButtonIcon={leftPanelHeaderIcon}
                    on:headeraction={toggleLeftPanel.bind(null, false)}
                    on:showsettings={toggleSettings}
                />
            </div>
        </div>
    {/if}

    <slot />
</div>

{#if $stateStore.settingsPresented}
    <div
        class="settings-overlay"
        data-testid="settings-overlay"
        transition:fade={{ duration: 300 }}
        on:click={settingsOverlayClicked}
        on:keypress={settingsOverlayClicked}
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
    @use 'sass:math';
    @import './main-layout.scss';

    .main-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    /* Left panel */

    .left-show-wrapper {
        @include show-button-wrapper;
        left: 0;
    }

    .left-panel-wrapper {
        @include panel-wrapper;
        left: 0;
    }

    .panel-dummy {
        // Dummy used to access rendered width of panels in script, for mouse interactivity
        // Avoid displaying this dummy to the user
        position: absolute;
        z-index: -100;
        opacity: 0;
        width: $panel-width;
        left: calc(-1 * $panel-width);
    }

    /* Settings */

    .settings-overlay {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 3;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: rgba(0, 0, 0, 0.5);
    }

    .settings-container {
        width: 400px;
        max-width: 100%;
        max-height: 100%;
        padding: $overlay-panel-edge-inset;
        box-sizing: border-box;
    }
</style>
