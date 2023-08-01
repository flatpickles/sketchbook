<script lang="ts">
    import type { NumberParamConfig } from '$lib/base/ParamConfig/NumberParamConfig';
    import ParamInput from './ParamInput.svelte';
    import { createEventDispatcher } from 'svelte';

    export let paramConfig: NumberParamConfig;
    export let value: number[];
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
    <div id={paramConfig.name} class="numeric-array-param-input">
        {#each value as valueMember}
            <input
                type="range"
                bind:value={valueMember}
                min={paramConfig.min}
                max={paramConfig.max}
                step={paramConfig.step}
                on:input={paramUpdated.bind(null, false)}
                on:change={paramUpdated.bind(null, true)}
                data-testid="numeric-array-param-input"
            />
        {/each}
    </div>
</ParamInput>

<style lang="scss">
    input[type='range'] {
        width: 100%;
    }

    .numeric-array-param-input {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>
