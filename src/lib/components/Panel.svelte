<div class="panel-container">
    <slot />
</div>

<style lang="scss">
    .panel-container {
        display: flex;
        flex-direction: column;
        justify-content: top;
        row-gap: $panel-section-spacing;

        height: 100%;
        width: $panel-width;
        background-color: $panel-bg-color;
        backdrop-filter: $panel-bg-filter;
        -webkit-backdrop-filter: $panel-bg-filter;

        border-radius: $panel-border-radius;
        box-shadow: $panel-shadow;
        outline: $panel-outline;
    }
</style>
