<script lang="ts">
    import type { NumberParamConfig } from '$lib/base/ParamConfig/NumberParamConfig';
    import ParamInput from './ParamInput.svelte';
    import { createEventDispatcher } from 'svelte';

    export let paramConfig: NumberParamConfig;
    export let value: number;
    export let even = false;

    const dispatch = createEventDispatcher();
    function paramUpdated() {
        dispatch('update', {
            config: paramConfig,
            value: value
        });
    }
</script>

<ParamInput name={paramConfig.name} {even}>
    <input
        type="range"
        bind:value
        id={paramConfig.name}
        min={paramConfig.min}
        max={paramConfig.max}
        step={paramConfig.step}
        on:input={paramUpdated}
    />
</ParamInput>

<style lang="scss">
    input[type='range'] {
        width: 100%;
    }
</style>
