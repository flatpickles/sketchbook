<script lang="ts" generics="T extends (string | number | number[])">
    import { createEventDispatcher } from 'svelte';

    export let name: string;
    export let value: T;
    export let options: Record<string, T>;
    export let disabled = false;

    // Evidently we can't do direct value binding with array values – array equality is weird.
    const dispatch = createEventDispatcher();
    function valueUpdated(event: Event) {
        value = options[(event.target as HTMLSelectElement).value];
        dispatch('change');
    }
</script>

<select id={name} {disabled} on:change={valueUpdated} data-testid="option-param-input">
    {#each Object.entries(options) as [optionLabel, optionValue]}
        <option
            value={optionLabel}
            selected={JSON.stringify(optionValue) === JSON.stringify(value)}
        >
            {optionLabel}
        </option>
    {/each}
</select>

<style lang="scss">
    select {
        appearance: auto; // system default
        width: 100%;
        @include string-parameter-input;
    }

    select:disabled {
        @include parameter-input-disabled;
    }
</style>
