<script lang="ts">
    import ProjectViewer from '$lib/components/ProjectViewer.svelte';
    import ProjectDetailPanel from '$lib/components/ProjectDetailPanel.svelte';
    import ProjectListPanel from '$lib/components/ProjectListPanel.svelte';

    import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
    import type { ProjectConfig } from '$lib/base/ProjectConfig/ProjectConfig';

    export let projectConfigs: Record<string, ProjectConfig>;
    export let selectedProjectTuple: ProjectTuple;

    let leftPanelClosed = false;
    let rightPanelClosed = false;

    function closeLeftPanel() {
        console.log('closeLeftPanel');
        leftPanelClosed = true;
    }

    function closeRightPanel() {
        console.log('closeRightPanel');
        rightPanelClosed = true;
    }
</script>

<div class="main-wrapper">
    <div class="left-panel-wrapper" class:closed={leftPanelClosed}>
        <div class="panel" class:leftClosed={leftPanelClosed}>
            <ProjectListPanel
                projects={projectConfigs}
                selectedProjectKey={selectedProjectTuple.key}
                on:close={closeLeftPanel}
            />
        </div>
    </div>
    <div class="project-viewer">
        <ProjectViewer project={selectedProjectTuple.project} />
    </div>
    <div class="right-panel-wrapper" class:closed={rightPanelClosed}>
        <div class="panel">
            <ProjectDetailPanel projectTuple={selectedProjectTuple} on:close={closeRightPanel} />
        </div>
    </div>
</div>

<style lang="scss">
    // To animate panel wrapper width changes, we need to set width explicitly
    $panelWrapperWidth: if($overlay-panels, $panel-edge-inset * 2, 0) + $panel-width;
    $panelAnimationDuration: 0.5s;

    .main-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    @mixin panel-wrapper {
        position: if($overlay-panels, absolute, relative);
        z-index: 1;

        // Enable panel min-height despite absolute inheritance:
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .left-panel-wrapper {
        @include panel-wrapper;
        left: 0;
        transition: width $panelAnimationDuration ease-in-out;
        width: $panelWrapperWidth;

        &.closed {
            width: 0;
        }
    }

    .right-panel-wrapper {
        @include panel-wrapper;
        right: 0;
        transition: width $panelAnimationDuration ease-in-out;
        width: $panelWrapperWidth;

        &.closed {
            width: 0;
        }
    }

    .panel {
        position: relative;
        padding: if($overlay-panels, $panel-edge-inset, 0);
        min-height: if($full-height-panels or not $overlay-panels, 100%, 0);
        max-height: 100%;
        transition: left $panelAnimationDuration ease-in-out;
        left: 0;

        &.leftClosed {
            // Align to the right side of a zero-width panel:
            left: calc(-1 * $panelWrapperWidth);
        }
    }

    .project-viewer {
        flex-grow: 1;

        overflow: hidden;
        z-index: 0;
    }
</style>
