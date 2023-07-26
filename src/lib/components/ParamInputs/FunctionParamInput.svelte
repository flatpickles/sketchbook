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
    <input type="button" value="Run" on:click={paramUpdated} />
</ParamInput>

<style lang="scss">
    input[type='button'] {
        background-color: orange;
        cursor: pointer;
    }
</style>
