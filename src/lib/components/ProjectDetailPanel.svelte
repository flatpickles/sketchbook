<script lang="ts">
    import type { ProjectTuple } from '$lib/base/ProjectLoader';
    import Panel from './Panel.svelte';

    export let projectTuple: ProjectTuple;
</script>

<div class="panel-container">
    <Panel>
        <h1>{projectTuple.props.title}</h1>
        <ul>
            {#each Object.values(projectTuple.params) as param}
                <li>{param.name}</li>
            {/each}
        </ul>
    </Panel>
</div>

<style lang="scss">
    .panel-container {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        padding: $panel-inset;
    }
</style>
