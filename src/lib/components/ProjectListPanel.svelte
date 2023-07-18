<script lang="ts">
    import type { SketchbookConfig } from '$lib/base/ConfigLoader';
    import type { ProjectProperties } from '$lib/base/ProjectConfig';
    import Panel from './Panel.svelte';
    import PanelHeader from './PanelHeader.svelte';
    import ProjectList from './ProjectList.svelte';

    export let projects: Record<string, ProjectProperties>;
    export let sketchbookConfig: SketchbookConfig;

    // const groups = Object.values(projects).reduce((acc, project) => {
    //     const groups: string[] =
    //         project.groups && project.groups.length > 0
    //             ? project.groups
    //             : [sketchbookConfig.defaultGroup];
    //     acc = acc.concat(groups);
    //     return acc;
    // }, [] as string[]);
    // console.log(groups);
</script>

<div class="panel-container">
    <Panel>
        <PanelHeader
            title={sketchbookConfig.title}
            subtitle={sketchbookConfig.subtitle}
            description={sketchbookConfig.description}
        />
        <ProjectList {projects} />
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
