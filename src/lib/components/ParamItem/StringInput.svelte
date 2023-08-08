<script lang="ts">
    export let name: string;
    export let value: string;

    export let multiline = true;
</script>

{#if multiline}
    <textarea
        bind:value
        id={name}
        on:input
        on:change
        autocomplete="off"
        rows="2"
        data-testid="string-param-input"
    />
{:else}
    <input
        type="text"
        bind:value
        id={name}
        on:input
        on:change
        autocomplete="off"
        data-testid="string-param-input"
    />
{/if}

<style lang="scss">
    input[type='text'] {
        @include string-parameter-input;
        width: 100%;
    }

    textarea {
        @include string-parameter-input;
        width: 100%;
    }
</style>
