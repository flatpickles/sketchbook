<script lang="ts">
    import type { NumberParamConfig } from '$lib/base/ParamConfig/NumberParamConfig';
    import ParamInput from './ParamInput.svelte';
    import { createEventDispatcher } from 'svelte';

    export let paramConfig: NumberParamConfig;
    export let value: number;
    export let even = false;

    const dispatch = createEventDispatcher();
    function paramUpdated(complete: boolean) {
        dispatch('update', {
            config: paramConfig,
            value: value,
            complete: complete
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
        on:input={paramUpdated.bind(null, false)}
        on:change={paramUpdated.bind(null, true)}
    />
</ParamInput>

<style lang="scss">
    input[type='range'] {
        width: 100%;
    }
</style>
