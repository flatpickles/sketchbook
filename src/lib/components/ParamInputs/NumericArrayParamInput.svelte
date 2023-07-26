<script lang="ts">
    import type { NumberParamConfig } from '$lib/base/ParamConfig/NumberParamConfig';
    import ParamInput from './ParamInput.svelte';
    import { createEventDispatcher } from 'svelte';

    export let paramConfig: NumberParamConfig;
    export let value: number[];

    const dispatch = createEventDispatcher();
    function paramUpdated() {
        dispatch('update', {
            config: paramConfig,
            value: value
        });
    }
</script>

<ParamInput name={paramConfig.name}>
    <div id={paramConfig.name} class="numeric-array-param-input">
        {#each value as valueMember}
            <input
                type="range"
                bind:value={valueMember}
                min={paramConfig.min}
                max={paramConfig.max}
                step={paramConfig.step}
                on:input={paramUpdated}
            />
        {/each}
    </div>
</ParamInput>

<style lang="scss">
    input[type='range'] {
        width: 100%;
    }
</style>
