<script lang="ts">
    export let style: 'overlay' | 'left-fill' | 'right-fill' = 'overlay';
</script>

<div class={`panel-container ${style}`}>
    <slot />
</div>

<style lang="scss">
    .panel-container {
        display: flex;
        flex-direction: column;
        justify-content: top;

        height: 100%;
        width: 100%;
        background-color: $panel-bg-color;
        color: $panel-fg-color;

        border: $panel-border;
        overflow: hidden;

        &.overlay {
            backdrop-filter: $overlay-panel-bg-filter;
            -webkit-backdrop-filter: $overlay-panel-bg-filter;
            background-color: rgba($panel-bg-color, $overlay-panel-bg-opacity);

            border-radius: $panel-border-radius;
            box-shadow: $panel-shadow;

            @if ($overlay-panel-border-enabled != true) {
                border-width: 0;
            }
        }

        &.left-fill {
            border-style: none solid none none;
        }

        &.right-fill {
            border-style: none none none solid;
        }
    }
</style>
