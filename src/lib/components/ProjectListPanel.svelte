<script lang="ts">
    import type { SketchbookConfig } from '$lib/base/ConfigLoader';
    import type { ProjectProperties } from '$lib/base/ProjectConfig';
    import GroupSelector from './GroupSelector.svelte';
    import Panel from './Panel.svelte';
    import PanelHeader from './PanelHeader.svelte';
    import ProjectList from './ProjectList.svelte';

    export let sketchbookConfig: SketchbookConfig;
    export let projects: Record<string, ProjectProperties>;

    let selectedGroup: string | undefined;
</script>

<div class="panel-container">
    <Panel>
        <PanelHeader
            title={sketchbookConfig.title}
            subtitle={sketchbookConfig.subtitle}
            description={sketchbookConfig.description}
        />
        <GroupSelector projects={Object.values(projects)} bind:selectedGroup />
        <ProjectList {projects} {selectedGroup} />
    </Panel>
</div>

<style lang="scss">
    .panel-container {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        padding: $panel-inset;
    }
</style>
