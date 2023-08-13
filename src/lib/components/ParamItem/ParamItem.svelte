<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { ParamConfig } from '$lib/base/ParamConfig/ParamConfig';
    import { ParamGuards, type ParamValueType } from '$lib/base/ParamConfig/ParamTypes';
    import BooleanInput from './BooleanInput.svelte';
    import FunctionInput from './FunctionInput.svelte';
    import NumberInput from './NumberInput.svelte';
    import StringInput from './StringInput.svelte';

    import { NumberParamStyle } from '$lib/base/ParamConfig/NumberParamConfig';
    import { NumericArrayParamStyle } from '$lib/base/ParamConfig/NumericArrayParamConfig';
    import { StringParamStyle } from '$lib/base/ParamConfig/StringParamConfig';
    import ColorInput from './ColorInput.svelte';
    import OptionInput from './OptionInput.svelte';
    import FileInput from './FileInput.svelte';

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

    // File selection is special!
    function filesSelected(event: any) {
        const files = event.detail;
        dispatch('update', {
            config: config,
            value: files
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

<div
    class="label-wrapper"
    data-testid="param-label-wrapper"
    class:even
    class:odd={!even}
    title={config.hoverText}
>
    <label class="param-label" data-testid="param-label" for={config.name}>{config.name}</label>
</div>
<div class="input-wrapper" data-testid="param-input-wrapper" class:even class:odd={!even}>
    {#if ParamGuards.isNumberParamConfig(config) && typeof value === 'number'}
        <NumberInput
            bind:value
            on:input={paramUpdated.bind(null, false)}
            on:change={paramUpdated.bind(null, true)}
            name={config.name}
            min={config.min}
            max={config.max}
            step={config.step}
            showField={[NumberParamStyle.Field, NumberParamStyle.Combo].includes(config.style)}
            showSlider={[NumberParamStyle.Slider, NumberParamStyle.Combo].includes(config.style)}
        />
    {:else if ParamGuards.isBooleanParamConfig(config) && typeof value === 'boolean'}
        <BooleanInput bind:value on:change={paramUpdated.bind(null, true)} name={config.name} />
    {:else if ParamGuards.isStringParamConfig(config) && typeof value === 'string'}
        {#if config.style === StringParamStyle.Options}
            <OptionInput
                bind:value
                on:change={paramUpdated.bind(null, true)}
                name={config.name}
                options={config.options}
            />
        {:else if config.style === StringParamStyle.Color}
            <ColorInput
                bind:value
                on:input={paramUpdated.bind(null, false)}
                on:change={paramUpdated.bind(null, true)}
                name={config.name}
            />
        {:else}
            <StringInput
                bind:value
                on:input={paramUpdated.bind(null, false)}
                on:change={paramUpdated.bind(null, true)}
                name={config.name}
                multiline={config.style === StringParamStyle.MultiLine}
            />
        {/if}
    {:else if ParamGuards.isNumericArrayParamConfig(config) && isNumericArray(value)}
        <div
            class="array-param-wrapper"
            class:compact={[
                NumericArrayParamStyle.CompactField,
                NumericArrayParamStyle.CompactSlider
            ].includes(config.style)}
        >
            {#each value as valueMember}
                <NumberInput
                    bind:value={valueMember}
                    on:input={paramUpdated.bind(null, false)}
                    on:change={paramUpdated.bind(null, true)}
                    name={config.name}
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    showField={[
                        NumericArrayParamStyle.Field,
                        NumericArrayParamStyle.CompactField,
                        NumericArrayParamStyle.Combo
                    ].includes(config.style)}
                    showSlider={[
                        NumericArrayParamStyle.Slider,
                        NumericArrayParamStyle.CompactSlider,
                        NumericArrayParamStyle.Combo
                    ].includes(config.style)}
                />
            {/each}
        </div>
    {:else if ParamGuards.isFunctionParamConfig(config)}
        <FunctionInput on:click={paramUpdated.bind(null, true)} buttonText={config.buttonText} />
    {:else if ParamGuards.isFileParamConfig(config)}
        <FileInput
            on:change={filesSelected}
            name={config.name}
            key={config.key}
            multiple={config.multiple}
            accept={config.accept}
        />
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
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        user-select: none;

        @include parameter-item;
        padding-left: calc($parameter-item-spacing-horizontal / 2);
        margin-left: 0;
        border-radius: 0 $border-radius $border-radius 0;
    }

    .array-param-wrapper {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        row-gap: $parameter-item-spacing-vertical;
        column-gap: calc($parameter-item-spacing-horizontal / 2);
        align-items: center;
    }

    .compact {
        grid-template-columns: 1fr 1fr;
    }
</style>
