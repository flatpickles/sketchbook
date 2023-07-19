<script lang="ts">
    import type { ProjectProperties } from '$lib/base/ProjectConfig';
    export let projects: ProjectProperties[];
    export let selectedGroup: string | undefined = undefined;

    // Procure the sorted groups list
    const groups = new Set(
        projects.reduce((acc, project) => {
            if (project.groups && project.groups.length > 0) {
                return acc.concat(project.groups);
            }
            return acc;
        }, [] as string[])
    );
    const sortedGroups = Array.from(groups).sort((a, b) => a.localeCompare(b));

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
            class="group-item"
            data-testid="group-item"
            class:selected={selectedGroup === undefined}
            on:click={handleGroupClick}
            on:keypress={handleGroupClick}
        >
            All
        </div>
        {#each sortedGroups as group}
            <div
                class="group-item"
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
        display: flex;
        flex-direction: row;
        gap: 0.25rem;
    }

    .group-item {
        padding: 0.25rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        cursor: pointer;
    }

    .selected {
        background-color: #ccc;
    }
</style>
