<script lang="ts">
    export let name: string;
    export let value: string;

    export let options: string[] = [];
</script>

<select bind:value on:change id={name} data-testid="option-param-input">
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
</style>
