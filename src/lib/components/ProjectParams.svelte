<script lang="ts">
    import {
        type ParamConfig,
        type ParamValueType,
        isNumberParamConfig,
        type NumberParamConfig,
        type BooleanParamConfig
    } from '$lib/base/ParamConfig';
    import type { ProjectTuple } from '$lib/base/ProjectLoader';
    import NumberParamInput from './ParamInputs/NumberParamInput.svelte';

    export let projectTuple: ProjectTuple;

    // A little dark magic update the project's value for this key
    function paramUpdated(event: any) {
        const updatedConfig = event.detail.config as ParamConfig;
        Object.defineProperty(projectTuple.project, updatedConfig.key, {
            value: event.detail.value,
            writable: true,
            enumerable: true,
            configurable: true
        });
        projectTuple.project.update();
    }

    // A little dark magic to get the properly typed initial value for a given param
    function initialValueForParam<T extends ParamConfig>(paramConfig: T): ParamValueType<T> {
        const descriptor = Object.getOwnPropertyDescriptor(projectTuple.project, paramConfig.key);
        return descriptor?.value as ParamValueType<T>;
    }
</script>

<div class="params-wrapper">
    {#each projectTuple.params as param}
        {#if isNumberParamConfig(param)}
            <NumberParamInput
                paramConfig={param}
                value={initialValueForParam(param)}
                on:update={paramUpdated}
            />
        {/if}
    {/each}
</div>
