<script lang="ts">
    export let name: string;
    export let value: string;
</script>

<input
    type="text"
    bind:value
    id={name}
    on:input
    on:blur
    autocomplete="off"
    data-testid="string-param-input"
/>

<style lang="scss">
    input[type='text'] {
        @include string-parameter-input;
        width: 100%;
    }
</style>
