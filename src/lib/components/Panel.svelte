<div class="panel-container">
    <slot />
</div>

<style lang="scss">
    .panel-container {
        display: flex;
        flex-direction: column;
        justify-content: top;
        row-gap: $panel-content-spacing;

        height: 100%;
        width: $panel-width;
        background-color: $panel-bg-color;

        border-radius: $panel-border-radius;
        box-shadow: $panel-shadow;
    }
</style>
