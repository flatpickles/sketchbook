<script lang="ts">
    import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
    import { ParamType, type ParamConfig } from '$lib/base/ParamConfig/ParamConfig';
    import { type ParamValueType, ParamGuards } from '$lib/base/ParamConfig/ParamTypes';
    import BooleanParamInput from './ParamInputs/BooleanParamInput.svelte';
    import FunctionParamInput from './ParamInputs/FunctionParamInput.svelte';
    import NumberParamInput from './ParamInputs/NumberParamInput.svelte';
    import NumericArrayParamInput from './ParamInputs/NumericArrayParamInput.svelte';
    import StringParamInput from './ParamInputs/StringParamInput.svelte';

    export let projectTuple: ProjectTuple;

    // A little dark magic to apply the updated param (or call the associated function)
    function paramUpdated(event: any) {
        const updatedConfig = event.detail.config as ParamConfig;
        if (updatedConfig.type != ParamType.Function) {
            // Change the project's value for this key, and update the project
            Object.defineProperty(projectTuple.project, updatedConfig.key, {
                value: event.detail.value,
                writable: true,
                enumerable: true,
                configurable: true
            });
            projectTuple.project.update();
        } else {
            // Call the named function on the project
            const descriptor = Object.getOwnPropertyDescriptor(
                projectTuple.project,
                updatedConfig.key
            );
            if (descriptor?.value) {
                descriptor.value();
            }
        }
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
        {:else if ParamGuards.isFunctionParamConfig(param)}
            <FunctionParamInput paramConfig={param} on:update={paramUpdated} />
        {:else if ParamGuards.isStringParamConfig(param)}
            <StringParamInput
                paramConfig={param}
                value={initialValueForParam(param)}
                on:update={paramUpdated}
            />
        {:else if ParamGuards.isNumericArrayParamConfig(param)}
            <NumericArrayParamInput
                paramConfig={param}
                value={initialValueForParam(param)}
                on:update={paramUpdated}
            />
        {/if}
    {/each}
</div>

<style lang="scss">
    .params-wrapper {
        width: 100%;
        display: grid;
        grid-template-columns: fit-content(50%) 1fr;
        padding: 0 $panel-content-inset;
    }
</style>
