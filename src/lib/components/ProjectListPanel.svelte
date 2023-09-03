<script lang="ts">
    import { fade } from 'svelte/transition';

    import { content } from '../../config/content';
    import { settingsStore } from '$lib/base/Util/AppState';

    import type { ProjectConfig } from '$lib/base/ProjectConfig/ProjectConfig';
    import GroupSelector from './GroupSelector.svelte';
    import Panel from './Panel.svelte';
    import PanelFooter from './PanelFooter.svelte';
    import PanelHeader from './PanelHeader.svelte';
    import ProjectList from './ProjectList.svelte';
    import SettingsContent from './Settings/SettingsContent.svelte';

    export let projects: Record<string, ProjectConfig>;
    export let selectedProjectKey: string;
    export let headerButtonIcon: string | undefined;

    let selectedGroup: string | undefined;
    let settingsDisplayed = false;

    function showInfo() {
        if (!content.leftButtonLink) throw new Error('No info link defined');
        document.location.href = content.leftButtonLink;
    }

    function toggleSettings() {
        settingsDisplayed = !settingsDisplayed;
    }
</script>

<Panel>
    {#if !settingsDisplayed}
        <div class="list-panel-wrapper" transition:fade={{ duration: 200 }}>
            <PanelHeader
                title={content.title}
                subtitle={content.subtitle}
                description={content.description}
                {headerButtonIcon}
                on:headeraction
            />
            <GroupSelector
                projects={Object.values(projects)}
                bind:selectedGroup
                sorting={$settingsStore.groupSortOrder}
            />
            <ProjectList
                {projects}
                {selectedGroup}
                {selectedProjectKey}
                sorting={$settingsStore.projectSortOrder}
            />
            <PanelFooter
                footerText={content.footer}
                leftButton={content.leftButtonIcon && content.leftButtonLink
                    ? content.leftButtonIcon
                    : undefined}
                rightButton="fa-gear"
                on:leftbuttonclick={showInfo}
                on:rightbuttonclick={toggleSettings}
            />
        </div>
    {:else}
        <div class="settings-wrapper" transition:fade={{ duration: 200 }}>
            <PanelHeader
                title={content.settingsTitle}
                description={content.settingsDescription}
                on:close={toggleSettings}
            />
            <SettingsContent />
        </div>
    {/if}
</Panel>

<style lang="scss">
    .list-panel-wrapper {
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
