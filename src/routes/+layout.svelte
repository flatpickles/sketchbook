<script lang="ts">
    import Panel from '$lib/components/Panel.svelte';

    import type { PageData } from './$types';
    import type { ProjectProperties } from '$lib/base/ProjectConfig';

    export let data: PageData;
    let projects: ProjectProperties[] = Object.values(data.projects);
</script>

<Panel>
    {#each projects as props}
        {props.title}
    {/each}
</Panel>

<slot />
