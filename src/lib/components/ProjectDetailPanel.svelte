<script lang="ts">
    import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
    import { settingsStore } from '$lib/base/Util/AppState';
    import Panel from './Panel.svelte';
    import PanelHeader from './PanelHeader.svelte';
    import PresetControl from './PresetControl.svelte';
    import ProjectParams from './ProjectParams.svelte';

    export let projectTuple: ProjectTuple;
    export let headerButtonIcon: string | undefined;

    // Add margin-bottom to overlaid panel if there are no params
    // (adding to header-wrapper's margin-bottom, completing 1x panel-section-spacing)
    $: marginBottom = $settingsStore.overlayPanels && projectTuple.params.length == 0;
</script>

<Panel overlaid={$settingsStore.overlayPanels}>
    <div class="detail-wrapper" class:margin-bottom={marginBottom}>
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
            <ProjectParams {projectTuple} on:paramupdated />
        {/if}
    </div>
</Panel>

<style lang="scss">
    .detail-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }

    .margin-bottom {
        margin-bottom: calc($panel-section-spacing / 2);
    }
</style>
