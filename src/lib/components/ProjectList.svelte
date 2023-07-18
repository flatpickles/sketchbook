<script lang="ts">
    import type { ProjectProperties } from '$lib/base/ProjectConfig';
    export let projects: Record<string, ProjectProperties>;
    export let selectedGroup: string | undefined = undefined;
</script>

<ul>
    {#each Object.keys(projects) as key}
        {#if selectedGroup === undefined || (projects[key].groups?.includes(selectedGroup) ?? false)}
            <li><a href="/{key}">{projects[key].title}</a></li>
        {/if}
    {/each}
</ul>
