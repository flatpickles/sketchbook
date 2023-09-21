<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { ParamConfig } from '$lib/base/ConfigModels/ParamConfig';
    import { ParamGuards, type ParamValueType } from '$lib/base/ConfigModels/ParamTypes';
    import BooleanInput from '../Inputs/BooleanInput.svelte';
    import FunctionInput from '../Inputs/FunctionInput.svelte';
    import NumberInput from '../Inputs/NumberInput.svelte';
    import StringInput from '../Inputs/StringInput.svelte';

    import { NumberParamStyle } from '$lib/base/ConfigModels/ParamConfigs/NumberParamConfig';
    import {
        NumericArrayParamStyle,
        isNumericArray
    } from '$lib/base/ConfigModels/ParamConfigs/NumericArrayParamConfig';
    import { StringParamStyle } from '$lib/base/ConfigModels/ParamConfigs/StringParamConfig';
    import ColorInput from '../Inputs/ColorInput.svelte';
    import OptionInput from '../Inputs/OptionInput.svelte';
    import FileInput from '../Inputs/FileInput.svelte';

    export let config: ParamConfig;
    export let value: ParamValueType<typeof config>;
    export let even = false;
    export let disabled = false;

    const dispatch = createEventDispatcher();
    function paramUpdated(complete: boolean) {
        // If the param update isn't complete and applyDuringInput isn't set, we shan't proceed
        if (!config.applyDuringInput && !complete) return;

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

    function optionsObject<T>(options: T[] | Record<string, T>): Record<string, T> {
        // Just return the object if it's already an object
        if (typeof options === 'object' && !Array.isArray(options)) return options;

        // Otherwise, parse the array into an object
        const result: Record<string, T> = {};
        for (const option of options) {
            // Use the string directly, or stringify the object (with more readable commas)
            const key =
                typeof option === 'string' ? option : JSON.stringify(option).replace(/,/g, ', ');
            result[key] = option;
        }
        return result;
    }
</script>

{#if !config.fullWidthInput}
    <div
        class="label-wrapper"
        data-testid="param-label-wrapper"
        class:even
        class:odd={!even}
        title={config.hoverText}
    >
        <span class="param-label" data-testid="param-label">{config.name}</span>
    </div>
{/if}
<div
    class="input-wrapper"
    data-testid="param-input-wrapper"
    class:even
    class:odd={!even}
    class:full-width={config.fullWidthInput}
>
    {#if ParamGuards.isNumberParamConfig(config) && typeof value === 'number'}
        {#if config.options != undefined}
            <OptionInput
                name={config.name}
                options={optionsObject(config.options)}
                {disabled}
                bind:value
                on:change={paramUpdated.bind(null, true)}
            />
        {:else}
            <NumberInput
                name={config.name}
                min={config.min}
                max={config.max}
                step={config.step}
                showField={[NumberParamStyle.Field, NumberParamStyle.Combo].includes(config.style)}
                showSlider={[NumberParamStyle.Slider, NumberParamStyle.Combo].includes(
                    config.style
                )}
                {disabled}
                bind:value
                on:input={paramUpdated.bind(null, false)}
                on:change={paramUpdated.bind(null, true)}
            />
        {/if}
    {:else if ParamGuards.isBooleanParamConfig(config) && typeof value === 'boolean'}
        <BooleanInput
            name={config.name}
            {disabled}
            bind:value
            on:change={paramUpdated.bind(null, true)}
        />
    {:else if ParamGuards.isStringParamConfig(config) && typeof value === 'string'}
        {#if config.options != undefined}
            <OptionInput
                name={config.name}
                options={optionsObject(config.options)}
                {disabled}
                bind:value
                on:change={paramUpdated.bind(null, true)}
            />
        {:else if config.style === StringParamStyle.Color}
            <ColorInput
                name={config.name}
                {disabled}
                bind:value
                on:input={paramUpdated.bind(null, false)}
                on:change={paramUpdated.bind(null, true)}
            />
        {:else}
            <StringInput
                name={config.name}
                multiline={config.style === StringParamStyle.MultiLine}
                {disabled}
                bind:value
                on:input={paramUpdated.bind(null, false)}
                on:change={paramUpdated.bind(null, true)}
            />
        {/if}
    {:else if ParamGuards.isNumericArrayParamConfig(config) && isNumericArray(value)}
        {#if config.options != undefined}
            <OptionInput
                name={config.name}
                options={optionsObject(config.options)}
                {disabled}
                bind:value
                on:change={paramUpdated.bind(null, true)}
            />
        {:else if config.style === NumericArrayParamStyle.Color || config.style === NumericArrayParamStyle.UnitColor}
            <ColorInput
                name={config.name}
                {disabled}
                unitColorArrays={config.style === NumericArrayParamStyle.UnitColor}
                bind:value
                on:input={paramUpdated.bind(null, false)}
                on:change={paramUpdated.bind(null, true)}
            />
        {:else}
            <div
                class="array-param-wrapper"
                class:compact={[
                    NumericArrayParamStyle.CompactField,
                    NumericArrayParamStyle.CompactSlider
                ].includes(config.style)}
            >
                {#each value as valueMember, index}
                    <NumberInput
                        name={`${config.name} Element ${index + 1}`}
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
                        {disabled}
                        bind:value={valueMember}
                        on:input={paramUpdated.bind(null, false)}
                        on:change={paramUpdated.bind(null, true)}
                    />
                {/each}
            </div>
        {/if}
    {:else if ParamGuards.isFunctionParamConfig(config)}
        <FunctionInput
            buttonText={config.buttonText}
            {disabled}
            on:click={paramUpdated.bind(null, true)}
        />
    {:else if ParamGuards.isFileParamConfig(config)}
        <FileInput
            name={config.name}
            key={config.key}
            multiple={config.multiple}
            accept={config.accept}
            {disabled}
            on:change={filesSelected}
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

        // When it's just in the right column...
        &:not(.full-width) {
            padding-left: calc($parameter-item-spacing-horizontal / 2);
            margin-left: 0;
            border-radius: 0 $border-radius $border-radius 0;
        }

        // When it spans two columns...
        &.full-width {
            grid-column-start: 1;
            grid-column-end: span 2;
            border-radius: $border-radius;
        }
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
