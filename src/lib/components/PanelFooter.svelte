<div class="footer-wrapper">
    <button class="left-button"><i class="fa fa-info-circle" /></button>
    <div class="footer-text">Copyright © 2023 Matt Nichols</div>
    <button class="right-button"><i class="fa fa-gear" /></button>
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
</style>
