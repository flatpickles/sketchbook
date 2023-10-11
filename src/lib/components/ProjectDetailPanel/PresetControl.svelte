<script lang="ts">
    import type { ProjectTuple } from '$lib/base/ProjectLoading/ProjectLoader';

    export let projectTuple: ProjectTuple;
</script>

<div class="presets-wrapper" data-testid="presets-ui">
    <div class="preset-selector">
        <i class="fa fa-angle-left" style="color: rgba(0, 0, 0, 30%)" />
        Default Values *
        <i class="fa fa-angle-right" />
    </div>
</div>

<style lang="scss">
    .presets-wrapper {
        width: 100%;
        padding: calc($panel-content-inset / 2) $panel-content-inset;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: $preset-control-item-spacing;
        user-select: none;
    }

    .preset-selector {
        @include preset-control-item;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    // .control-button {
    //     @include preset-control-item;
    //     cursor: pointer;
    // }
</style>
