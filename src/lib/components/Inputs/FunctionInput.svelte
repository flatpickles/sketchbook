<script lang="ts">
    import { FunctionParamConfigDefaults } from '$lib/base/ConfigModels/ParamConfigs/FunctionParamConfig';

    export let id: string;
    export let name: string;
    export let buttonText: string = FunctionParamConfigDefaults.buttonText;
    export let disabled = false;
</script>

<input
    type="button"
    {id}
    aria-label={name}
    value={buttonText}
    {disabled}
    on:click
    data-testid="function-param-input"
/>

<style lang="scss">
    input[type='button'] {
        cursor: pointer;
        min-width: $param-input-item-partial-width;
        max-width: 100%;

        @include ellipsis;
        @include function-parameter-input;
    }

    input:disabled {
        @include parameter-input-disabled;
    }
</style>
