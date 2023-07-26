<script lang="ts">
    import type { StringParamConfig } from '$lib/base/ParamConfig/StringParamConfig';
    import ParamInput from './ParamInput.svelte';
    import { createEventDispatcher } from 'svelte';

    export let paramConfig: StringParamConfig;
    export let value: boolean;

    const dispatch = createEventDispatcher();
    function paramUpdated(event: any) {
        event;
        dispatch('update', {
            config: paramConfig,
            value: event.target.value
        });
    }
</script>

<ParamInput name={paramConfig.name}>
    <input type="text" bind:value id={paramConfig.name} on:input={paramUpdated} />
</ParamInput>

<style lang="scss">
    input[type='text'] {
        background-color: orange;
    }
</style>
