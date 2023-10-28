<script lang="ts">
    import type { ProjectTuple } from '$lib/base/ProjectLoading/ProjectLoader';
    import { settingsStore } from '$lib/base/Util/AppState';
    import Panel from '../Panels/Panel.svelte';
    import PanelHeader from '../Panels/PanelHeader.svelte';
    import PresetControl from './PresetControl.svelte';
    import ParamList from './ParamList.svelte';
    import PresetUtil from '$lib/base/ProjectLoading/PresetUtil';
    import { defaultPresetKey } from '$lib/base/ProjectLoading/PresetLoader';

    export let projectTuple: ProjectTuple;
    export let headerButtonIcon: string | undefined;

    // Add margin-bottom to overlaid panel if there are no params
    // (adding to header-wrapper's margin-bottom, completing 1x panel-section-spacing)
    $: marginBottom = $settingsStore.overlayPanels && projectTuple.params.length == 0;

    // Update the selected & stored preset keys as project & preset selections change
    $: projectSelected(projectTuple.key);
    export let selectedPresetKey = defaultPresetKey;
    function projectSelected(projectKey: string) {
        selectedPresetKey = PresetUtil.getSelectedPresetKey(projectKey);
    }
    export function presetSelected(event: CustomEvent) {
        // Update selected preset state
        PresetUtil.setSelectedPresetKey(projectTuple.key, event.detail);
        selectedPresetKey = event.detail;
        // Apply newly selected preset values to project
        paramList.applyPreset(event.detail);
    }

    // Track state for preset updates and edit state
    let paramList: ParamList;
    let presetEdited = false;

    // Handle exporting current values as new preset file
    function exportPreset() {
        const presetName = window.prompt(
            'Exporting a new preset file with the current parameter values.\n\n' +
                'Enter a name for the new preset:',
            `${projectTuple.key} Preset`
        );
        if (presetName && presetName.replace(/\s/g, '').length > 0) {
            PresetUtil.exportPresetFile(projectTuple, presetName);
        }
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
                edited={presetEdited}
                on:preset-selected={presetSelected}
                on:export={exportPreset}
            />
        {/if}
        {#if projectTuple.params && Object.values(projectTuple.params).length > 0}
            <ParamList bind:this={paramList} {projectTuple} {selectedPresetKey} bind:presetEdited />
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
