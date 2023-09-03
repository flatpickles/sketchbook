<script lang="ts">
    import type { ProjectConfig } from '$lib/base/ProjectConfig/ProjectConfig';
    import { SortOrder } from '$lib/base/Util/ConfigTypes';
    export let projects: ProjectConfig[];
    export let sorting: SortOrder = SortOrder.Alphabetical;
    export let selectedGroup: string | undefined = undefined;

    // Procure the sorted groups list
    const chronologicalProjects = projects.sort((a, b) => {
        const timeA = a.date ? a.date.getTime() : Date.now();
        const timeB = b.date ? b.date.getTime() : Date.now();
        return timeA - timeB;
    });
    const groups = new Set(
        chronologicalProjects.reduce((acc, project) => {
            if (project.groups && project.groups.length > 0) {
                return acc.concat(project.groups);
            }
            return acc;
        }, [] as string[])
    );
    const groupsArray = Array.from(groups);
    const sortedGroups =
        sorting === SortOrder.Chronological
            ? groupsArray
            : sorting === SortOrder.ReverseChronological
            ? groupsArray.reverse()
            : groupsArray.sort((a, b) => a.localeCompare(b));

    // Handle group clicks
    function handleGroupClick(event: UIEvent) {
        const target = event.target as HTMLElement;
        if (target.classList.contains('group-item')) {
            const group = target.textContent?.trim();
            if (!group || group === 'All') {
                selectedGroup = undefined;
            } else {
                selectedGroup = group;
            }
        }
    }
</script>

{#if sortedGroups.length > 0}
    <div class="group-list" data-testid="group-list">
        <div
            class="group-item group-1"
            data-testid="group-item"
            class:selected={selectedGroup === undefined}
            on:click={handleGroupClick}
            on:keypress={handleGroupClick}
        >
            All
        </div>
        {#each sortedGroups as group, i}
            <div
                class="group-item group-{i + 2}"
                data-testid="group-item"
                class:selected={selectedGroup === group}
                on:click={handleGroupClick}
                on:keypress={handleGroupClick}
            >
                {group}
            </div>
        {/each}
    </div>
{/if}

<style lang="scss">
    .group-list {
        flex-shrink: 0;

        display: flex;
        flex-direction: row;
        gap: $group-selector-item-spacing;
        padding: calc($panel-content-inset / 2) $panel-content-inset;

        // Fade out edges
        mask-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 1) $panel-content-inset,
            rgba(0, 0, 0, 1) calc(100% - $panel-content-inset),
            rgba(0, 0, 0, 0)
        );

        // Scroll with no scrollbar
        overflow-y: scroll;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    }

    // Webkit hide scrollbar
    .group-list::-webkit-scrollbar {
        display: none;
    }

    .group-item {
        @include group-selector-item;
        cursor: pointer;
        white-space: nowrap;
        user-select: none;
    }
</style>
