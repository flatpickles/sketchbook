<script lang="ts">
    import type { BooleanParamConfig } from '$lib/base/ParamConfig/BooleanParamConfig';
    import ParamInput from './ParamInput.svelte';
    import { createEventDispatcher } from 'svelte';

    export let paramConfig: BooleanParamConfig;
    export let value: boolean;

    const dispatch = createEventDispatcher();
    function paramUpdated(event: any) {
        dispatch('update', {
            config: paramConfig,
            value: event.target.checked
        });
    }
</script>

<ParamInput name={paramConfig.name}>
    <input type="checkbox" bind:checked={value} id={paramConfig.name} on:change={paramUpdated} />
</ParamInput>
