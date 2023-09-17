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
        backdrop-filter: $panel-bg-filter;
        -webkit-backdrop-filter: $panel-bg-filter;

        border: $panel-border;
        overflow: hidden;

        &.overlay {
            border-radius: $panel-border-radius;
            box-shadow: $panel-shadow;
            border-width: $panel-overlay-border-size;
        }

        &.left-fill {
            border-style: none solid none none;
        }

        &.right-fill {
            border-style: none none none solid;
        }
    }
</style>
