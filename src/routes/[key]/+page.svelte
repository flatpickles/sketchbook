<script lang="ts">
    import type { ProjectTuple } from '$lib/base/ProjectLoader';
    import Panel from '$lib/components/Panel.svelte';
    import type { PageData } from './$types';

    export let data: ProjectTuple;
    console.log(data);
</script>

<h1>{data.props.title}</h1>

<canvas />

<Panel>
    <ul>
        {#each Object.values(data.params) as param}
            <li>{param.name}</li>
        {/each}
    </ul>
</Panel>
