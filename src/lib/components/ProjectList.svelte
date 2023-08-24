<script lang="ts">
    import type { ProjectConfig } from '$lib/base/ProjectConfig/ProjectConfig';
    import { SortOrder } from '../../config/config';

    export let projects: Record<string, ProjectConfig>;
    export let selectedProjectKey: string;
    export let sorting: SortOrder = SortOrder.ReverseChronological;
    export let selectedGroup: string | undefined = undefined;

    $: sortedKeys = Object.keys(projects).sort((a, b) => {
        const projectA = projects[a];
        const projectB = projects[b];
        const timeA = projectA.date ? projectA.date.getTime() : 0;
        const timeB = projectB.date ? projectB.date.getTime() : 0;
        switch (sorting) {
            case SortOrder.Alphabetical:
                return projectA.title.localeCompare(projectB.title);
            case SortOrder.Chronological:
                return timeA - timeB;
            case SortOrder.ReverseChronological:
                return timeB - timeA;
        }
    });
</script>

<div class="project-list">
    {#each sortedKeys as key}
        {#if selectedGroup === undefined || (projects[key].groups?.includes(selectedGroup) ?? false)}
            <a
                href="/{key}"
                class="project-list-item"
                data-testid="project-list-item"
                class:selected={key === selectedProjectKey}
            >
                {projects[key].title}
            </a>
        {/if}
    {/each}
</div>

<style lang="scss">
    a {
        text-decoration: none;
        color: inherit;
        display: block;
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
        @include project-list-item;
    }
</style>
