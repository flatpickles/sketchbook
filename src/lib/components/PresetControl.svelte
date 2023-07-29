<script lang="ts">
    import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';

    export let projectTuple: ProjectTuple;
</script>

<div class="presets-wrapper">
    <div class="preset-selector">Default Values</div>
    <div class="control-button">...</div>
</div>

<style lang="scss">
    .presets-wrapper {
        width: 100%;
        padding: 0 $panel-content-inset;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: $preset-control-item-spacing;
    }

    .preset-selector {
        @include preset-control-item;
        background-color: orange;
        width: 100%;
    }

    .control-button {
        @include preset-control-item;
        background-color: yellow;
        cursor: pointer;
    }
</style>
