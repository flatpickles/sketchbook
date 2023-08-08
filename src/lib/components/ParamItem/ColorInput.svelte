<script lang="ts">
    export let name: string;
    export let value: string;
</script>

<!-- Currently logs a warning: https://github.com/sveltejs/kit/issues/10501 -->
<input type="color" bind:value id={name} on:input on:change />

<style lang="scss">
    // todo: go through https://css-tricks.com/color-inputs-a-deep-dive-into-cross-browser-differences/
    input[type='color'] {
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;

        border: none;
        background: none;
        overflow: hidden;
        outline: 0;

        @include color-parameter-input;
    }

    input[type='color']::-webkit-color-swatch-wrapper {
        border: 0;
        padding: 0;
    }

    input[type='color']::-webkit-color-swatch {
        border: 0;
    }
</style>
