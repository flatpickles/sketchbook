<script lang="ts">
    export let name: string;
    export let min: number;
    export let max: number;
    export let step: number;
    export let value: number;
</script>

<input
    type="range"
    bind:value
    id={name}
    {min}
    {max}
    {step}
    on:input
    on:change
    data-testid="number-param-input"
/>

<style lang="scss">
    input[type='range'] {
        width: 100%;
    }
</style>
