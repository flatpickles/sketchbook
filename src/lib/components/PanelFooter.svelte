<script lang="ts">
    export let footerText: string | undefined = undefined;
    export let leftButton: string | undefined = undefined;
    export let rightButton: string | undefined = undefined;
</script>

<div class="footer-wrapper">
    <button class="left-button" class:hidden={leftButton == undefined}>
        <i class="fa {leftButton}" />
    </button>
    <div class="footer-text" class:hidden={footerText == undefined}>
        {@html footerText}
    </div>
    <button class="right-button" class:hidden={rightButton == undefined}>
        <i class="fa {rightButton}" />
    </button>
</div>

<style lang="scss">
    .footer-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
    }

    .footer-text {
        @include footer-text;
        text-align: center;
        flex-grow: 1;
        padding: calc($panel-content-inset / 2) calc($panel-section-spacing / 2)
            $panel-content-inset calc($panel-section-spacing / 2);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :global(.footer-text a) {
        @include footer-link-style;
    }

    .left-button {
        @include panel-button;
        flex-shrink: 0;
        margin: calc($panel-section-spacing / 2) calc($panel-section-spacing / 2) 0 0;
        border: $panel-outline;
        border-style: solid solid none none;
        border-radius: 0 $panel-border-radius 0 $panel-border-radius;
    }

    .right-button {
        @include panel-button;
        flex-shrink: 0;
        margin: calc($panel-section-spacing / 2) 0 0 calc($panel-section-spacing / 2);
        border: $panel-outline;
        border-style: solid none none solid;
        border-radius: $panel-border-radius 0 $panel-border-radius 0;
    }

    .hidden {
        // Still included in DOM to preserve layout (no display: none)
        visibility: hidden;
    }
</style>
