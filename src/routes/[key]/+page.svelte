<script lang="ts">
    import type { ProjectTuple } from '$lib/base/ProjectLoader';
    import Panel from '$lib/components/Panel.svelte';
    import { onMount } from 'svelte';
    import type { PageData } from './$types';

    export let data: ProjectTuple;
    let canvasElement: HTMLCanvasElement;

    onMount(() => {
        data.project.canvas = canvasElement;
        data.project.init();
        data.project.update();
    });
</script>

<canvas bind:this={canvasElement} />

<Panel>
    <h1>{data.props.title}</h1>
    <ul>
        {#each Object.values(data.params) as param}
            <li>{param.name}</li>
        {/each}
    </ul>
</Panel>
