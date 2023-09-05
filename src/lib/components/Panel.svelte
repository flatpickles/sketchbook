<script lang="ts">
    export let overlaid = false;
</script>

<div class="panel-container" class:overlaid>
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

        box-shadow: $panel-shadow;
        outline: $panel-outline;
        overflow: hidden;

        &.overlaid {
            border-radius: $panel-border-radius;
        }
    }
</style>
