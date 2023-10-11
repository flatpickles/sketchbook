<script lang="ts">
    import type { ProjectTuple } from '$lib/base/ProjectLoading/ProjectLoader';
    import { settingsStore } from '$lib/base/Util/AppState';
    import Panel from '../Panels/Panel.svelte';
    import PanelHeader from '../Panels/PanelHeader.svelte';
    import PresetControl from './PresetControl.svelte';
    import ParamList from './ParamList.svelte';
    import { defaultPresetKey } from '$lib/base/ProjectLoading/PresetLoader';
    import PresetManager from '$lib/base/ProjectLoading/PresetManager';

    export let projectTuple: ProjectTuple;
    export let headerButtonIcon: string | undefined;

    // Add margin-bottom to overlaid panel if there are no params
    // (adding to header-wrapper's margin-bottom, completing 1x panel-section-spacing)
    $: marginBottom = $settingsStore.overlayPanels && projectTuple.params.length == 0;

    // Update the selected & stored preset keys as project & preset selections change
    $: projectSelected(projectTuple.key);
    let selectedPresetKey = PresetManager.getSelectedPresetKey(projectTuple.key);
    function projectSelected(projectKey: string) {
        selectedPresetKey = PresetManager.getSelectedPresetKey(projectKey);
    }
    function presetSelected(event: CustomEvent) {
        PresetManager.setSelectedPresetKey(projectTuple.key, event.detail);
        selectedPresetKey = event.detail;
    }
</script>

<Panel style={$settingsStore.overlayPanels ? 'overlay' : 'right-fill'}>
    <div class="detail-wrapper" class:margin-bottom={marginBottom}>
        <PanelHeader
            title={projectTuple.config.title}
            subtitle={projectTuple.config.date?.toLocaleDateString('en-us', {
                year: 'numeric',
                month: 'long'
            })}
            description={projectTuple.config.description}
            {headerButtonIcon}
            on:headeraction
        />
        {#if $settingsStore.alwaysShowPresets || Object.values(projectTuple.presets).length > 1}
            <PresetControl
                presets={projectTuple.presets}
                currentPresetKey={selectedPresetKey}
                on:preset-selected={presetSelected}
            />
        {/if}
        {#if projectTuple.params && Object.values(projectTuple.params).length > 0}
            <ParamList {projectTuple} />
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
