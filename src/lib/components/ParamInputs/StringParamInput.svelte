<script lang="ts">
    import type { StringParamConfig } from '$lib/base/ParamConfig/StringParamConfig';
    import ParamInput from './ParamInput.svelte';
    import { createEventDispatcher } from 'svelte';

    export let paramConfig: StringParamConfig;
    export let value: string;
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
        type="text"
        bind:value
        id={paramConfig.name}
        on:input={paramUpdated.bind(null, false)}
        on:blur={paramUpdated.bind(null, true)}
        autocomplete="off"
        data-testid="string-param-input"
    />
</ParamInput>

<style lang="scss">
    input[type='text'] {
        @include string-parameter-input;
        width: 100%;
    }
</style>
