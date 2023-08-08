<input type="button" value="Run" on:click data-testid="function-param-input" />

<style lang="scss">
    input[type='button'] {
        @include function-parameter-input;
        cursor: pointer;
        min-width: $param-input-item-partial-width;
    }
</style>
