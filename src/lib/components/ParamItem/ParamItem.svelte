<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { ParamConfig } from '$lib/base/ParamConfig/ParamConfig';
    import { ParamGuards, type ParamValueType } from '$lib/base/ParamConfig/ParamTypes';
    import BooleanInput from './BooleanInput.svelte';
    import FunctionInput from './FunctionInput.svelte';
    import NumberInput from './NumberInput.svelte';
    import StringInput from './StringInput.svelte';

    import { NumberParamStyle } from '$lib/base/ParamConfig/NumberParamConfig';

    export let config: ParamConfig;
    export let value: ParamValueType<typeof config>;
    export let even = false;

    const dispatch = createEventDispatcher();
    function paramUpdated(complete: boolean) {
        // If the param update isn't complete and liveUpdates isn't set, we shan't proceed
        if (!config.liveUpdates && !complete) return;

        // Dispatch the update event
        dispatch('update', {
            config: config,
            value: value
        });
    }

    export function isNumericArray(value: any): value is number[] {
        if (!Array.isArray(value)) return false;
        for (const member of value) {
            if (typeof member !== 'number') return false;
        }
        return true;
    }
</script>

<div class="label-wrapper" class:even class:odd={!even} title={config.hoverText}>
    <label class="param-label" data-testid="param-label" for={config.name}>{config.name}</label>
</div>
<div class="input-wrapper" class:even class:odd={!even}>
    {#if ParamGuards.isNumberParamConfig(config) && typeof value === 'number'}
        <NumberInput
            name={config.name}
            min={config.min}
            max={config.max}
            step={config.step}
            bind:value
            on:input={paramUpdated.bind(null, false)}
            on:change={paramUpdated.bind(null, true)}
            showField={config.style == NumberParamStyle.Field ||
                config.style == NumberParamStyle.Combo}
            showSlider={config.style == NumberParamStyle.Slider ||
                config.style == NumberParamStyle.Combo}
        />
    {:else if ParamGuards.isBooleanParamConfig(config) && typeof value === 'boolean'}
        <BooleanInput name={config.name} bind:value on:change={paramUpdated.bind(null, true)} />
    {:else if ParamGuards.isFunctionParamConfig(config) && typeof value === 'function'}
        <FunctionInput on:click={paramUpdated.bind(null, true)} />
    {:else if ParamGuards.isStringParamConfig(config) && typeof value === 'string'}
        <StringInput
            name={config.name}
            bind:value
            on:input={paramUpdated.bind(null, false)}
            on:blur={paramUpdated.bind(null, true)}
        />
    {:else if ParamGuards.isNumericArrayParamConfig(config) && isNumericArray(value)}
        {#each value as valueMember}
            <NumberInput
                name={config.name}
                min={config.min}
                max={config.max}
                step={config.step}
                bind:value={valueMember}
                on:input={paramUpdated.bind(null, false)}
                on:change={paramUpdated.bind(null, true)}
            />
        {/each}
    {/if}
</div>

<style lang="scss">
    .label-wrapper {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: left;
        overflow: hidden;

        @include parameter-item;
        padding-right: calc($parameter-item-spacing-horizontal / 2);
        margin-right: 0;
        border-radius: $border-radius 0 0 $border-radius;
    }

    .param-label {
        white-space: nowrap;
        text-align: left;
        pointer-events: none;
        overflow: hidden;
        text-overflow: ellipsis;

        @include parameter-label;
    }

    .input-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        user-select: none;
        gap: $parameter-item-spacing-vertical;

        @include parameter-item;
        padding-left: calc($parameter-item-spacing-horizontal / 2);
        margin-left: 0;
        border-radius: 0 $border-radius $border-radius 0;
    }
</style>
