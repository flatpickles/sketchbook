<script lang="ts">
    import type { FunctionParamConfig } from '$lib/base/ParamConfig/FunctionParamConfig';
    import ParamInput from './ParamInput.svelte';
    import { createEventDispatcher } from 'svelte';

    export let paramConfig: FunctionParamConfig;
    export let even = false;

    const dispatch = createEventDispatcher();
    function paramUpdated() {
        dispatch('update', {
            config: paramConfig,
            complete: true
        });
    }
</script>

<ParamInput name={paramConfig.name} {even}>
    <input type="button" value="Run Function" on:click={paramUpdated} />
</ParamInput>

<style lang="scss">
    input[type='button'] {
        @include function-parameter-input;
        cursor: pointer;
        min-width: 50%;
    }
</style>
