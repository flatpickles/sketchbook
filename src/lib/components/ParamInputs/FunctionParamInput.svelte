<script lang="ts">
    import type { FunctionParamConfig } from '$lib/base/ParamConfig/FunctionParamConfig';
    import ParamInput from './ParamInput.svelte';
    import { createEventDispatcher } from 'svelte';

    export let paramConfig: FunctionParamConfig;

    const dispatch = createEventDispatcher();
    function paramUpdated() {
        dispatch('update', {
            config: paramConfig
        });
    }
</script>

<ParamInput name={paramConfig.name}>
    <input type="button" value="Run Function" on:click={paramUpdated} />
</ParamInput>

<style lang="scss">
    input[type='button'] {
        @include function-parameter-input;
        cursor: pointer;
        min-width: 50%;
    }
</style>
