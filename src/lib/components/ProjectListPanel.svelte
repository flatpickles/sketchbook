<script lang="ts">
    import { fade } from 'svelte/transition';

    import Content from '../../config/content';
    import { AppStateStore } from '$lib/base/AppState';

    import type { ProjectConfig } from '$lib/base/ProjectConfig/ProjectConfig';
    import GroupSelector from './GroupSelector.svelte';
    import Panel from './Panel.svelte';
    import PanelFooter from './PanelFooter.svelte';
    import PanelHeader from './PanelHeader.svelte';
    import ProjectList from './ProjectList.svelte';
    import SettingsContent from './Settings/SettingsContent.svelte';

    export let projects: Record<string, ProjectConfig>;

    export let selectedProjectKey: string;
    let selectedGroup: string | undefined;

    let settingsDisplayed = false;

    function closePanel() {
        alert('todo: close panel');
    }

    function showInfo() {
        if (!Content.leftButtonLink) throw new Error('No info link defined');
        document.location.href = Content.leftButtonLink;
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
                    title={Content.title}
                    subtitle={Content.subtitle}
                    description={Content.description}
                    on:close={closePanel}
                />
                <GroupSelector projects={Object.values(projects)} bind:selectedGroup />
                <ProjectList
                    {projects}
                    {selectedGroup}
                    {selectedProjectKey}
                    sorting={$AppStateStore.projectSortOrder}
                />
                <PanelFooter
                    footerText={Content.footer}
                    leftButton={Content.leftButtonIcon && Content.leftButtonLink
                        ? Content.leftButtonIcon
                        : undefined}
                    rightButton="fa-gear"
                    on:leftbuttonclick={showInfo}
                    on:rightbuttonclick={toggleSettings}
                />
            </div>
        {:else}
            <div class="settings-wrapper" transition:fade={{ duration: 200 }}>
                <PanelHeader
                    title={Content.settingsTitle}
                    description={Content.settingsDescription}
                    on:close={toggleSettings}
                />
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
