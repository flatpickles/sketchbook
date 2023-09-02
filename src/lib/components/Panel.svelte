<div class="panel-container">
    <slot />
</div>

<style lang="scss">
    .panel-container {
        display: flex;
        flex-direction: column;
        justify-content: top;

        height: 100%;
        width: $panel-width;
        background-color: $panel-bg-color;
        backdrop-filter: $panel-bg-filter;
        -webkit-backdrop-filter: $panel-bg-filter;

        border-radius: if($overlay-panels, $panel-border-radius, 0);
        box-shadow: $panel-shadow;
        outline: $panel-outline;
        overflow: hidden;
    }
</style>
