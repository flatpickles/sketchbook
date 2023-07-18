<script lang="ts">
    import type { ProjectProperties } from '$lib/base/ProjectConfig';
    export let projects: Record<string, ProjectProperties>;
</script>

<ul>
    {#each Object.keys(projects) as key}
        <li><a href="/{key}">{projects[key].title}</a></li>
    {/each}
</ul>
