<script lang="ts">
    import { settingsStore } from '$lib/base/Util/AppState';
</script>

<div class="panel-container" class:overlaid={$settingsStore.overlayPanels}>
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

        box-shadow: $panel-shadow;
        outline: $panel-outline;
        overflow: hidden;

        &.overlaid {
            border-radius: $panel-border-radius;
        }
    }
</style>
