<script lang="ts">
    import type { ProjectConfig } from '$lib/base/ProjectConfig/ProjectConfig';
    import { settingsStore } from '$lib/base/Util/AppState';
    import { SortOrder } from '$lib/base/Util/ConfigTypes';

    export let projects: Record<string, ProjectConfig>;
    export let selectedProjectKey: string;
    export let sorting: SortOrder = SortOrder.ReverseChronological;
    export let selectedGroup: string | undefined = undefined;

    $: sortedKeys = Object.keys(projects).sort((a, b) => {
        const projectA = projects[a];
        const projectB = projects[b];
        const timeA = projectA.date ? projectA.date.getTime() : Date.now();
        const timeB = projectB.date ? projectB.date.getTime() : Date.now();
        switch (sorting) {
            case SortOrder.Alphabetical:
                return projectA.title.localeCompare(projectB.title);
            case SortOrder.Chronological:
                return timeA - timeB;
            case SortOrder.ReverseChronological:
                return timeB - timeA;
        }
    });

    $: visibleKeys = sortedKeys.filter((key) => {
        const project = projects[key];
        if (!project) return false;
        if (project.experimental && !$settingsStore.showExperiments) return false;
        if (selectedGroup === undefined) return true;
        if (!project.groups.includes(selectedGroup)) return false;
        return true;
    });
</script>

<div class="project-list">
    {#each visibleKeys as key}
        {#if true}
            <a
                href="/{key}"
                class="project-list-item"
                data-testid="project-list-item"
                class:selected={key === selectedProjectKey}
            >
                {projects[key].title}
                {#if projects[key].experimental}
                    <i
                        class="fa fa-flask experimental"
                        title="Experimental"
                        data-testid="experimental-icon"
                    />
                {/if}
            </a>
        {/if}
    {/each}
</div>

<style lang="scss">
    a {
        text-decoration: none;
        color: inherit;
        display: block;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .project-list {
        flex-grow: 1;
        padding: calc($panel-section-spacing / 2) 0;

        // Fade out edges
        mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 1) calc($panel-section-spacing / 2),
            rgba(0, 0, 0, 1) calc(100% - $panel-section-spacing/2),
            rgba(0, 0, 0, 0)
        );

        // Scroll with no scrollbar
        overflow-y: scroll;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */

        // Internal layout
        display: flex;
        flex-direction: column;
        gap: $project-list-item-spacing;
    }

    // Webkit hide scrollbar
    .project-list::-webkit-scrollbar {
        display: none;
    }

    .project-list-item {
        user-select: none;
        flex-shrink: 0;
        @include project-list-item;
    }
</style>
