<script lang="ts">
    import type { StringParamConfig } from '$lib/base/ParamConfig/StringParamConfig';
    import ParamInput from './ParamInput.svelte';
    import { createEventDispatcher } from 'svelte';

    export let paramConfig: StringParamConfig;
    export let value: string;
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
        type="text"
        bind:value
        id={paramConfig.name}
        on:input={paramUpdated}
        autocomplete="off"
    />
</ParamInput>

<style lang="scss">
    input[type='text'] {
        @include string-parameter-input;
        width: 100%;
    }
</style>
