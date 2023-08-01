<script lang="ts">
    import type { BooleanParamConfig } from '$lib/base/ParamConfig/BooleanParamConfig';
    import ParamInput from './ParamInput.svelte';
    import { createEventDispatcher } from 'svelte';

    export let paramConfig: BooleanParamConfig;
    export let value: boolean;
    export let even = false;

    const dispatch = createEventDispatcher();
    function paramUpdated() {
        dispatch('update', {
            config: paramConfig,
            value: value,
            complete: true
        });
    }
</script>

<ParamInput name={paramConfig.name} {even}>
    <input type="checkbox" bind:checked={value} id={paramConfig.name} on:change={paramUpdated} />
</ParamInput>

<style lang="scss">
    input[type='checkbox'] {
        width: 100%;
    }
</style>
