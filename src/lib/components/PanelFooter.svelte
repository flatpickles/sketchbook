<div class="footer-wrapper">
    <div class="footer-text">Copyright © 2023 Matt Nichols</div>
    <button class="footer-button"><i class="fa fa-gear" /></button>
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
        flex-grow: 0;
        padding: calc($panel-content-inset / 2) $panel-content-inset $panel-content-inset
            $panel-content-inset;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .footer-button {
        @include footer-button;
        flex-shrink: 0;
    }
</style>
