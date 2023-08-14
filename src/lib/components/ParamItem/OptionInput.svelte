<script lang="ts">
    export let name: string;
    export let value: string;
    export let options: string[] = [];
    export let disabled = false;
</script>

<select id={name} {disabled} bind:value on:change data-testid="option-param-input">
    {#each options as option}
        <option value={option}>{option}</option>
    {/each}
</select>

<style lang="scss">
    select {
        appearance: auto; // system default
        width: 100%;
        @include string-parameter-input;
    }

    select:disabled {
        @include parameter-input-disabled;
    }
</style>
