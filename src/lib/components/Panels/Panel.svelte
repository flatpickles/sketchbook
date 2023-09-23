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
            border-width: $panel-overlay-border-size;
            backdrop-filter: $panel-bg-filter;
            -webkit-backdrop-filter: $panel-bg-filter;
            background-color: rgba($panel-bg-color, $panel-bg-opacity);

            border-radius: $panel-border-radius;
            box-shadow: $panel-shadow;
        }

        &.left-fill {
            border-style: none solid none none;
        }

        &.right-fill {
            border-style: none none none solid;
        }
    }
</style>
