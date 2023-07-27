<script lang="ts">
    import { ProjectSortType } from '$lib/base/FileLoading/SketchbookConfig';
    import type { ProjectConfig } from '$lib/base/ProjectConfig/ProjectConfig';

    export let projects: Record<string, ProjectConfig>;
    export let selectedProjectKey: string;
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

<div class="project-list">
    {#each sortedKeys as key}
        {#if selectedGroup === undefined || (projects[key].groups?.includes(selectedGroup) ?? false)}
            <a href="/{key}"
                ><div
                    class="project-list-item"
                    data-testid="project-list-item"
                    class:selected={key === selectedProjectKey}
                >
                    {projects[key].title}
                </div></a
            >
        {/if}
    {/each}
</div>

<style lang="scss">
    $list-item-margin: calc($project-list-item-spacing / 2);

    a {
        text-decoration: none;
        color: inherit;
    }

    .project-list-item {
        padding: $list-item-margin $panel-content-inset;
    }

    .project-list-item:hover {
        background-color: aquamarine;
    }

    .selected {
        background-color: rgb(184, 253, 190);
    }
</style>
