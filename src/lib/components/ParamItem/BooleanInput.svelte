<script lang="ts">
    export let name: string;
    export let value: boolean;

    let inputElement: HTMLInputElement;
    function wrapperClicked(event: MouseEvent | KeyboardEvent) {
        if (event.target !== inputElement) inputElement.click();
    }
</script>

<div
    class="checkbox-wrapper"
    data-testid="boolean-param-wrapper"
    on:click={wrapperClicked}
    on:keypress={wrapperClicked}
>
    <input
        type="checkbox"
        bind:checked={value}
        id={name}
        on:change
        data-testid="boolean-param-input"
        bind:this={inputElement}
    />
</div>

<style lang="scss">
    @import './styles/input-checkbox.scss';

    .checkbox-wrapper {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
    }
</style>
