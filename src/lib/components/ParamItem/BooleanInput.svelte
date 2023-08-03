<script lang="ts">
    export let name: string;
    export let value: boolean;
</script>

<input type="checkbox" bind:checked={value} id={name} on:change data-testid="boolean-param-input" />

<style lang="scss">
    input[type='checkbox'] {
        width: 100%;
    }
</style>
