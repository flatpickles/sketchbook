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

        // If the param update isn't complete and liveUpdates isn't set, we shan't proceed
        if (!event.detail.complete && !updatedConfig.liveUpdates) {
            return;
        }

        // Update the project's value for this key, or call the named function
        if (updatedConfig.type != ParamType.Function) {
            // If it's an array, we need to copy it so that we don't mutate the original
            const value = Array.isArray(event.detail.value)
                ? [...event.detail.value]
                : event.detail.value;
            Object.defineProperty(projectTuple.project, updatedConfig.key, {
                value: value,
                writable: true,
                enumerable: true,
                configurable: true
            });
            projectTuple.project.update();
        } else {
            const descriptor = Object.getOwnPropertyDescriptor(
                projectTuple.project,
                updatedConfig.key
            );
            if (descriptor?.value) {
                descriptor.value();
                projectTuple.project.update();
            }
        }
    }

    // A little dark magic to get the properly typed initial value for a given param
    function initialValueForParam<T extends ParamConfig>(paramConfig: T): ParamValueType<T> {
        const descriptor = Object.getOwnPropertyDescriptor(projectTuple.project, paramConfig.key);
        const value = descriptor?.value;
        // If it's an array, we need to copy it so that we don't mutate the original
        return (Array.isArray(value) ? [...value] : value) as ParamValueType<T>;
    }
</script>

<div class="params-wrapper">
    {#each projectTuple.params as param, paramIdx}
        {#if ParamGuards.isNumberParamConfig(param)}
            <NumberParamInput
                paramConfig={param}
                value={initialValueForParam(param)}
                on:update={paramUpdated}
                even={paramIdx % 2 == 0}
            />
        {:else if ParamGuards.isBooleanParamConfig(param)}
            <BooleanParamInput
                paramConfig={param}
                value={initialValueForParam(param)}
                on:update={paramUpdated}
                even={paramIdx % 2 == 0}
            />
        {:else if ParamGuards.isFunctionParamConfig(param)}
            <FunctionParamInput
                paramConfig={param}
                on:update={paramUpdated}
                even={paramIdx % 2 == 0}
            />
        {:else if ParamGuards.isStringParamConfig(param)}
            <StringParamInput
                paramConfig={param}
                value={initialValueForParam(param)}
                on:update={paramUpdated}
                even={paramIdx % 2 == 0}
            />
        {:else if ParamGuards.isNumericArrayParamConfig(param)}
            <NumericArrayParamInput
                paramConfig={param}
                value={initialValueForParam(param)}
                on:update={paramUpdated}
                even={paramIdx % 2 == 0}
            />
        {/if}
    {/each}
</div>

<style lang="scss">
    .params-wrapper {
        width: 100%;
        display: grid;
        grid-template-columns: fit-content($parameter-label-max-width) 1fr;
        row-gap: $parameter-item-spacing-vertical;
        align-items: center;
    }
</style>
