<script lang="ts">
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    import { content } from '../../config/content';
    import { settingsStore } from '$lib/base/Util/AppState';

    import type { ProjectConfig } from '$lib/base/ProjectConfig/ProjectConfig';
    import GroupSelector from './GroupSelector.svelte';
    import Panel from './Panel.svelte';
    import PanelFooter from './PanelFooter.svelte';
    import PanelHeader from './PanelHeader.svelte';
    import ProjectList from './ProjectList.svelte';

    export let projects: Record<string, ProjectConfig>;
    export let selectedProjectKey: string;
    export let headerButtonIcon: string | undefined;

    let selectedGroup: string | undefined;

    function showInfo() {
        if (!content.leftButtonLink) throw new Error('No info link defined');
        document.location.href = content.leftButtonLink;
    }

    const dispatch = createEventDispatcher();
    function showSettings() {
        dispatch('showsettings');
    }
</script>

<Panel overlaid={$settingsStore.overlayPanels}>
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
        on:rightbuttonclick={showSettings}
    />
</Panel>
