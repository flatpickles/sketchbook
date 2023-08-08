<script lang="ts">
    export let name: string;
    export let value: boolean;
</script>

<input type="checkbox" bind:checked={value} id={name} on:change data-testid="boolean-param-input" />

<style lang="scss">
    @import './styles/input-checkbox.scss';
</style>
