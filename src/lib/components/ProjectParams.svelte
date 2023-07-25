<script lang="ts">
    import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
    import { isBooleanParamConfig } from '$lib/base/ParamConfig/BooleanParamConfig';
    import type { ParamConfig } from '$lib/base/ParamConfig/ParamConfig';
    import { type ParamValueType, ParamGuards } from '$lib/base/ParamConfig/ParamTypes';
    import BooleanParamInput from './ParamInputs/BooleanParamInput.svelte';
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
        {#if ParamGuards.isNumberParamConfig(param)}
            <NumberParamInput
                paramConfig={param}
                value={initialValueForParam(param)}
                on:update={paramUpdated}
            />
        {:else if ParamGuards.isBooleanParamConfig(param)}
            <BooleanParamInput
                paramConfig={param}
                value={initialValueForParam(param)}
                on:update={paramUpdated}
            />
        {/if}
    {/each}
</div>
