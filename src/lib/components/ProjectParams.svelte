<script lang="ts">
    import { type ParamConfig, isNumberParamConfig } from '$lib/base/ParamConfig';
    import type { ProjectTuple } from '$lib/base/ProjectLoader';
    import NumberParamInput from './ParamInputs/NumberParamInput.svelte';

    export let projectTuple: ProjectTuple;

    function paramUpdated(event: any) {
        // A little dark magic update the project's value for this key
        const updatedConfig = event.detail.config as ParamConfig;
        Object.defineProperty(projectTuple.project, updatedConfig.key, {
            value: event.detail.value,
            writable: true,
            enumerable: true,
            configurable: true
        });
        projectTuple.project.update();
    }
</script>

<div class="params-wrapper">
    {#each projectTuple.params as param}
        {#if isNumberParamConfig(param)}
            <NumberParamInput paramConfig={param} value={0.2} on:update={paramUpdated} />
        {/if}
    {/each}
</div>
