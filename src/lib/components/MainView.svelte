<script lang="ts">
    import ProjectViewer from '$lib/components/ProjectViewer.svelte';
    import ProjectDetailPanel from '$lib/components/ProjectDetailPanel.svelte';
    import ProjectListPanel from '$lib/components/ProjectListPanel.svelte';

    import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
    import type { ProjectConfig } from '$lib/base/ProjectConfig/ProjectConfig';

    export let projectConfigs: Record<string, ProjectConfig>;
    export let selectedProjectTuple: ProjectTuple;
</script>

<div class="main-wrapper">
    <div class="left-panel-wrapper">
        <div class="panel">
            <ProjectListPanel
                projects={projectConfigs}
                selectedProjectKey={selectedProjectTuple.key}
            />
        </div>
    </div>
    <div class="project-viewer">
        <ProjectViewer project={selectedProjectTuple.project} />
    </div>
    <div class="right-panel-wrapper">
        <div class="panel">
            <ProjectDetailPanel projectTuple={selectedProjectTuple} />
        </div>
    </div>
</div>

<style lang="scss">
    $overlay: false;

    .main-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    @mixin panel-wrapper {
        position: if($overlay, absolute, relative);
        z-index: 1;

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
        padding: if($overlay, $panel-edge-inset, 0);
        min-height: if($overlay, 0, 100%);
        max-height: 100%;
    }

    .project-viewer {
        flex-grow: 1;

        overflow: hidden;
        z-index: 0;
    }
</style>
