<script lang="ts">
    import { FunctionParamConfigDefaults } from '$lib/base/ParamConfig/FunctionParamConfig';

    export let buttonText: string | undefined = FunctionParamConfigDefaults.buttonText;
</script>

<input type="button" value={buttonText} on:click data-testid="function-param-input" />

<style lang="scss">
    input[type='button'] {
        @include function-parameter-input;
        cursor: pointer;
        min-width: $param-input-item-partial-width;
    }
</style>
