<script lang="ts">
    import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
    import Panel from './Panel.svelte';
    import PanelHeader from './PanelHeader.svelte';
    import PresetControl from './PresetControl.svelte';
    import ProjectParams from './ProjectParams.svelte';

    export let projectTuple: ProjectTuple;
    export let headerButtonIcon: string | undefined;
</script>

<Panel>
    <!-- todo: customizable date formatting -->
    <PanelHeader
        title={projectTuple.props.title}
        subtitle={projectTuple.props.date?.toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'long'
        })}
        description={projectTuple.props.description}
        {headerButtonIcon}
        on:headeraction
    />
    {#if projectTuple.props.presetsAvailable}
        <PresetControl {projectTuple} />
    {/if}
    {#if projectTuple.params && Object.values(projectTuple.params).length > 0}
        <ProjectParams {projectTuple} />
    {/if}
</Panel>
