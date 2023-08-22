<script lang="ts">
    import { fade } from 'svelte/transition';

    import type { SketchbookConfig } from '$lib/base/FileLoading/SketchbookConfig';
    import type { ProjectConfig } from '$lib/base/ProjectConfig/ProjectConfig';
    import GroupSelector from './GroupSelector.svelte';
    import Panel from './Panel.svelte';
    import PanelFooter from './PanelFooter.svelte';
    import PanelHeader from './PanelHeader.svelte';
    import ProjectList from './ProjectList.svelte';
    import SettingsContent from './SettingsContent.svelte';

    export let sketchbookConfig: SketchbookConfig;
    export let projects: Record<string, ProjectConfig>;

    export let selectedProjectKey: string;
    let selectedGroup: string | undefined;

    let settingsDisplayed = false;

    function closePanel() {
        alert('todo: close panel');
    }

    function showInfo() {
        alert('todo: show info');
    }

    function toggleSettings() {
        settingsDisplayed = !settingsDisplayed;
    }
</script>

<div class="panel-container">
    <Panel>
        {#if !settingsDisplayed}
            <div class="main-wrapper" transition:fade={{ duration: 200 }}>
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
                    on:rightbuttonclick={toggleSettings}
                />
            </div>
        {:else}
            <div class="settings-wrapper" transition:fade={{ duration: 200 }}>
                <PanelHeader title="Settings" on:close={toggleSettings} />
                <SettingsContent />
            </div>
        {/if}
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

    .main-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .settings-wrapper {
        position: absolute;
        width: $panel-width; // 100% overflows on Safari w/ absolute positioning
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>
