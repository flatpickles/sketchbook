<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let footerText: string | undefined = undefined;
    export let leftButton: string | undefined = undefined;
    export let rightButton: string | undefined = undefined;

    const dispatch = createEventDispatcher();
    function leftButtonClicked() {
        dispatch('leftbuttonclick');
    }
    function rightButtonClicked() {
        dispatch('rightbuttonclick');
    }
</script>

<div class="footer-wrapper">
    {#if leftButton != undefined}
        <button
            class="left-button"
            data-testid="left-footer-button"
            class:hidden={leftButton == undefined}
            on:click={leftButtonClicked}
            on:keypress={leftButtonClicked}
        >
            <i class="fa {leftButton}" />
        </button>
    {/if}
    <div
        class="footer-text"
        data-testid="footer-text"
        class:hidden={footerText == undefined}
        class:left-align={leftButton == undefined}
    >
        {@html footerText}
    </div>
    <button
        class="right-button"
        data-testid="right-footer-button"
        class:hidden={rightButton == undefined}
        on:click={rightButtonClicked}
        on:keypress={rightButtonClicked}
    >
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
        margin: calc($panel-content-inset / 2) calc($panel-section-spacing / 2) $panel-content-inset
            calc($panel-section-spacing / 2);
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
    }

    .right-button {
        @include panel-button;
        flex-shrink: 0;
    }

    @if ($panel-button-inset-zero) {
        // No configured inset, configure borders & margins accordingly

        .left-button {
            border-style: solid solid none none;
            border-top-left-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
            margin-top: calc($panel-section-spacing / 2);
            margin-right: calc($panel-section-spacing / 2);
        }

        .right-button {
            border-style: solid none none solid;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
            margin-top: calc($panel-section-spacing / 2);
            margin-left: calc($panel-section-spacing / 2);
        }
    }

    .hidden {
        // Still included in DOM to preserve layout (no display: none)
        visibility: hidden;
    }

    .left-align {
        text-align: left;
        padding-left: $panel-content-inset;
    }
</style>
