<script lang="ts">
    import ProjectViewer from '$lib/components/ProjectViewer.svelte';
    import ProjectDetailPanel from '$lib/components/ProjectDetailPanel.svelte';
    import ProjectListPanel from '$lib/components/ProjectListPanel.svelte';
    import { content } from '../../config/content';

    import { stateStore } from '$lib/base/Util/AppState';
    import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
    import type { ProjectConfig } from '$lib/base/ProjectConfig/ProjectConfig';
    import { PanelState } from '$lib/base/Util/ConfigTypes';

    export let projectConfigs: Record<string, ProjectConfig>;
    export let selectedProjectTuple: ProjectTuple;

    $: leftPanelShown = $stateStore.projectListState === PanelState.Visible;
    $: rightPanelShown = $stateStore.projectDetailState === PanelState.Visible;

    function showLeftPanel(show = true) {
        $stateStore.projectListState = show ? PanelState.Visible : PanelState.Hidden;
    }

    function showRightPanel(show = true) {
        $stateStore.projectDetailState = show ? PanelState.Visible : PanelState.Hidden;
    }
</script>

<div class="main-wrapper">
    <div class="left-panel-wrapper" class:closed={!leftPanelShown}>
        <div class="panel" class:leftClosed={!leftPanelShown}>
            <ProjectListPanel
                projects={projectConfigs}
                selectedProjectKey={selectedProjectTuple.key}
                on:close={showLeftPanel.bind(null, false)}
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
                on:close={showRightPanel.bind(null, false)}
            />
        </div>
    </div>
</div>

<div
    class="left-show"
    class:hidden={leftPanelShown}
    on:click={showLeftPanel.bind(null, true)}
    on:keypress={showLeftPanel.bind(null, true)}
>
    <i class={content.projectListIcon} />
</div>

<div
    class="right-show"
    class:hidden={rightPanelShown}
    on:click={showRightPanel.bind(null, true)}
    on:keypress={showRightPanel.bind(null, true)}
>
    <i class={content.projectDetailIcon} />
</div>

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
</style>
