<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let id: string;
    export let name: string;
    export let min: number;
    export let max: number;
    export let step: number;
    export let value: number;
    export let disabled = false;
    $: fieldValue = value;

    export let showSlider: boolean = true;
    export let showField: boolean = true;

    const dispatch = createEventDispatcher();
    function fieldInputEvent(event: Event) {
        const target = event.target as HTMLInputElement;

        // Check to see if the field is empty
        if (target.value == '') {
            if (event.type === 'change') {
                fieldValue = value;
            }
            return;
        }

        // All's good, carry on
        value = fieldValue;
        dispatch(event.type, event);
    }
</script>

<div class="number-input-wrapper">
    {#if showSlider}
        <input
            type="range"
            id={`${id}-slider`}
            aria-label={`${name} Slider`}
            {min}
            {max}
            {step}
            {disabled}
            bind:value
            on:input
            on:change
            data-testid="number-param-slider"
        />
    {/if}
    {#if showField}
        <input
            type="number"
            id={`${id}-field`}
            aria-label={`${name} Field`}
            {min}
            {max}
            {step}
            {disabled}
            bind:value={fieldValue}
            on:input={fieldInputEvent}
            on:change={fieldInputEvent}
            data-testid="number-param-field"
        />
    {/if}
</div>

<style lang="scss">
    @import './styles/input-range.scss';

    .number-input-wrapper {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: calc($parameter-item-spacing-horizontal / 2);
    }

    input[type='range'] {
        flex-grow: 1;
    }

    input[type='number'] {
        @include string-parameter-input;
        text-align: right;
        flex-grow: 1;
        min-width: $param-input-item-min-width;
        max-width: $param-input-item-partial-width;

        // Hide up/down arrows: Firefox
        appearance: textfield;
        -moz-appearance: textfield;
    }

    /* Hide up/down arrows: Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input:disabled {
        @include parameter-input-disabled;
    }
</style>
