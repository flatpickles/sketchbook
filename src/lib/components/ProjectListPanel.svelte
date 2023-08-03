<script lang="ts">
    import type { SketchbookConfig } from '$lib/base/FileLoading/SketchbookConfig';
    import type { ProjectConfig } from '$lib/base/ProjectConfig/ProjectConfig';
    import GroupSelector from './GroupSelector.svelte';
    import Panel from './Panel.svelte';
    import PanelFooter from './PanelFooter.svelte';
    import PanelHeader from './PanelHeader.svelte';
    import ProjectList from './ProjectList.svelte';

    export let sketchbookConfig: SketchbookConfig;
    export let projects: Record<string, ProjectConfig>;

    export let selectedProjectKey: string;
    let selectedGroup: string | undefined;

    function closePanel() {
        alert('todo: close panel');
    }

    function showInfo() {
        alert('todo: show info');
    }

    function showSettings() {
        alert('todo: show settings');
    }
</script>

<div class="panel-container">
    <Panel>
        <PanelHeader
            title={sketchbookConfig.title}
            subtitle={sketchbookConfig.subtitle}
            description={sketchbookConfig.description}
            on:close={closePanel}
        />
        <GroupSelector projects={Object.values(projects)} bind:selectedGroup />
        <ProjectList
            {projects}
            {selectedGroup}
            {selectedProjectKey}
            sorting={sketchbookConfig.sorting}
        />
        <PanelFooter
            footerText={sketchbookConfig.footer}
            leftButton="fa-info-circle"
            rightButton="fa-gear"
            on:leftbuttonclick={showInfo}
            on:rightbuttonclick={showSettings}
        />
    </Panel>
</div>

<style lang="scss">
    .panel-container {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        padding: $panel-edge-inset;
    }
</style>
