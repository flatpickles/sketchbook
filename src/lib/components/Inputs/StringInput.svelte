<script lang="ts">
    export let id: string;
    export let name: string;
    export let value: string;
    export let multiline = true;
    export let disabled = false;
</script>

{#if multiline}
    <textarea
        {id}
        aria-label={name}
        autocomplete="off"
        rows="2"
        {disabled}
        bind:value
        on:input
        on:change
        data-testid="string-param-input-multiline"
    />
{:else}
    <input
        type="text"
        {id}
        aria-label={name}
        {disabled}
        autocomplete="off"
        bind:value
        on:input
        on:change
        data-testid="string-param-input-singleline"
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

    input:disabled {
        @include parameter-input-disabled;
    }

    textarea:disabled {
        @include parameter-input-disabled;
    }
</style>
