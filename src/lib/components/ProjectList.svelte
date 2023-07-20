<script lang="ts">
    import type { ProjectProperties } from '$lib/base/ProjectConfig';
    import { ProjectSortType } from '$lib/base/ConfigLoader';
    export let projects: Record<string, ProjectProperties>;
    export let sorting: ProjectSortType = ProjectSortType.Date;
    export let selectedGroup: string | undefined = undefined;

    $: sortedKeys = Object.keys(projects).sort((a, b) => {
        const projectA = projects[a];
        const projectB = projects[b];
        switch (sorting) {
            case ProjectSortType.Alphabetical:
                return projectA.title.localeCompare(projectB.title);
            case ProjectSortType.Date:
                const timeA = projectA.date ? projectA.date.getTime() : 0;
                const timeB = projectB.date ? projectB.date.getTime() : 0;
                return timeB - timeA;
        }
    });
</script>

{#each sortedKeys as key}
    {#if selectedGroup === undefined || (projects[key].groups?.includes(selectedGroup) ?? false)}
        <div class="project-list-item" data-testid="project-list-item">
            <a href="/{key}">{projects[key].title}</a>
        </div>
    {/if}
{/each}

<style lang="scss">
    .project-list-item {
        margin-bottom: 0.5rem;
    }
</style>
