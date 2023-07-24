<script lang="ts">
    import ParamInput from './ParamInput.svelte';
    import type { NumberParamConfig, ParamConfig } from '$lib/base/ParamConfig';
    import { createEventDispatcher } from 'svelte';

    export let paramConfig: NumberParamConfig;
    export let value: number;

    const dispatch = createEventDispatcher();
    function paramUpdated(event: any) {
        dispatch('update', {
            config: paramConfig,
            value: event.target.value
        });
    }
</script>

<ParamInput name={paramConfig.name}>
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
