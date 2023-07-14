<script lang="ts">
    import type { ProjectProperties } from '$lib/base/ProjectConfig';
    import Panel from './Panel.svelte';

    export let projects: Record<string, ProjectProperties>;
</script>

<div class="panel-container">
    <Panel>
        <h1>Sketchbook</h1>
        <ul>
            {#each Object.keys(projects) as key}
                <li><a href="/{key}">{projects[key].title}</a></li>
            {/each}
        </ul>
    </Panel>
</div>

<style lang="scss">
    .panel-container {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        padding: $panel-inset;
    }
</style>
