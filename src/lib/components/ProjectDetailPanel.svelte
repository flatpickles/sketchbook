<script lang="ts">
    import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
    import Panel from './Panel.svelte';
    import PanelHeader from './PanelHeader.svelte';
    import PresetControl from './PresetControl.svelte';
    import ProjectParams from './ProjectParams.svelte';

    export let projectTuple: ProjectTuple;
</script>

<div class="panel-container">
    <Panel>
        <!-- todo: customizable date formatting -->
        <PanelHeader
            title={projectTuple.props.title}
            subtitle={projectTuple.props.date?.toLocaleDateString('en-us', {
                year: 'numeric',
                month: 'long'
            })}
            description={projectTuple.props.description}
        />
        <PresetControl {projectTuple} />
        {#if projectTuple.params && Object.values(projectTuple.params).length > 0}
            <ProjectParams {projectTuple} />
        {/if}
    </Panel>
</div>

<style lang="scss">
    .panel-container {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        padding: $panel-edge-inset;
    }
</style>
